import os
import re
import csv
import io
import json
import time
import secrets
import hashlib
from datetime import datetime, timezone, timedelta
from typing import Dict, Any, List, Optional
import html

import jwt
from starlette.applications import Starlette
from starlette.routing import Route, Mount
from starlette.requests import Request
from starlette.responses import JSONResponse, HTMLResponse, Response, RedirectResponse
from starlette.staticfiles import StaticFiles

from database import (
    BASE_DIR,
    init_db,
    get_connection,
    utc_now_iso,
    verify_password,
    hash_password,
    format_product_row,
    get_store_settings,
    calculate_delivery_fee_for_governorate,
    validate_discount_code,
    EGYPT_GOVERNORATES,
)

JWT_SECRET = os.environ.get(
    "JWT_SECRET_KEY", "dp_prod_secret_9a8f7b6e5d4c3b2a1908f7e6d5c4b3a2109876543210fedcba"
)
JWT_ALGO = "HS256"
ADMIN_COOKIE_NAME = "dp_admin_token"

EGYPT_PHONE_REGEX = re.compile(r"^(?:\+?20|0020|0)?1[0125]\d{8}$")
VALID_ORDER_STATUSES = {"Pending", "Confirmed", "Processing", "Shipped", "Delivered", "Cancelled"}
ALLOWED_IMAGE_EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp"}


def get_base_url(request: Request) -> str:
    env_url = os.environ.get("SITE_URL", "").strip().rstrip("/")
    if env_url and not env_url.startswith("http://localhost"):
        return env_url
    scheme = request.headers.get("x-forwarded-proto", request.url.scheme)
    host = request.headers.get("x-forwarded-host", request.headers.get("host", "localhost:8000"))
    return f"{scheme}://{host}"


def slugify(text: str) -> str:
    s = text.lower().strip()
    s = re.sub(r"[^a-z0-9\u0600-\u06FF\s-]", "", s)
    s = re.sub(r"[\s-]+", "-", s).strip("-")
    return s or f"product-{secrets.token_hex(4)}"


def normalize_egypt_phone(phone: str) -> Optional[str]:
    cleaned = re.sub(r"[\s\-\(\)]", "", (phone or "").strip())
    if not EGYPT_PHONE_REGEX.match(cleaned):
        return None
    if cleaned.startswith("+20"):
        cleaned = "0" + cleaned[3:]
    elif cleaned.startswith("0020"):
        cleaned = "0" + cleaned[4:]
    elif cleaned.startswith("20") and len(cleaned) == 12:
        cleaned = "0" + cleaned[2:]
    elif not cleaned.startswith("0") and len(cleaned) == 10:
        cleaned = "0" + cleaned
    return cleaned


def create_admin_jwt(username: str) -> str:
    payload = {
        "sub": username,
        "role": "admin",
        "iat": int(time.time()),
        "exp": int(time.time()) + 86400 * 7,
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGO)


def verify_admin_request(request: Request) -> Optional[Dict[str, Any]]:
    token = None
    auth_header = request.headers.get("Authorization", "")
    if auth_header.startswith("Bearer "):
        token = auth_header[7:].strip()
    if not token:
        token = request.cookies.get(ADMIN_COOKIE_NAME)
    if not token:
        return None
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGO])
        if payload.get("role") != "admin":
            return None
        return payload
    except Exception:
        return None


def get_client_ip_hash(request: Request) -> str:
    ip = request.client.host if request.client else "127.0.0.1"
    forwarded = request.headers.get("x-forwarded-for")
    if forwarded:
        ip = forwarded.split(",")[0].strip()
    return hashlib.sha256((ip + JWT_SECRET[:12]).encode("utf-8")).hexdigest()[:24]


# ----------------------------------------------------------------------------
# PUBLIC API ENDPOINTS
# ----------------------------------------------------------------------------

async def api_bootstrap(request: Request) -> JSONResponse:
    conn = get_connection()
    try:
        settings = get_store_settings(conn)
        prod_rows = conn.execute(
            "SELECT * FROM products WHERE availability != 'disabled' ORDER BY id ASC"
        ).fetchall()
        rev_rows = conn.execute(
            "SELECT id, product_id, rating, review_text, display_name, created_at "
            "FROM reviews WHERE moderation_status = 'approved' ORDER BY id DESC"
        ).fetchall()
        reviews_by_product: Dict[int, List[Dict[str, Any]]] = {}
        for r in rev_rows:
            pid = r["product_id"]
            reviews_by_product.setdefault(pid, []).append(dict(r))

        products = [
            format_product_row(row, reviews_by_product.get(row["id"], []))
            for row in prod_rows
        ]
        categories_map = {}
        for p in products:
            key = p["category_en"]
            if key not in categories_map:
                categories_map[key] = {
                    "category_en": p["category_en"],
                    "category_ar": p["category_ar"],
                }

        return JSONResponse(
            {
                "settings": settings,
                "products": products,
                "categories": list(categories_map.values()),
            }
        )
    finally:
        conn.close()


async def api_list_products(request: Request) -> JSONResponse:
    q = (request.query_params.get("q") or "").strip().lower()
    category = (request.query_params.get("category") or "").strip()
    availability = (request.query_params.get("availability") or "").strip()
    min_price = request.query_params.get("min_price")
    max_price = request.query_params.get("max_price")
    sort_by = (request.query_params.get("sort") or "default").strip()

    conn = get_connection()
    try:
        rows = conn.execute(
            "SELECT * FROM products WHERE availability != 'disabled' ORDER BY id ASC"
        ).fetchall()
        rev_rows = conn.execute(
            "SELECT id, product_id, rating, review_text, display_name, created_at "
            "FROM reviews WHERE moderation_status = 'approved' ORDER BY id DESC"
        ).fetchall()
        reviews_by_product: Dict[int, List[Dict[str, Any]]] = {}
        for r in rev_rows:
            reviews_by_product.setdefault(r["product_id"], []).append(dict(r))

        products = [
            format_product_row(row, reviews_by_product.get(row["id"], []))
            for row in rows
        ]

        if q:
            products = [
                p
                for p in products
                if q in p["name_ar"].lower()
                or q in p["name_en"].lower()
                or q in p["description_ar"].lower()
                or q in p["description_en"].lower()
                or q in p["category_ar"].lower()
                or q in p["category_en"].lower()
            ]

        if category and category != "all":
            products = [
                p
                for p in products
                if p["category_en"].lower() == category.lower()
                or p["category_ar"] == category
            ]

        if availability == "in_stock":
            products = [p for p in products if p["in_stock"]]
        elif availability == "out_of_stock":
            products = [p for p in products if not p["in_stock"]]

        if min_price is not None and min_price != "":
            try:
                min_v = float(min_price)
                products = [p for p in products if p["current_price"] >= min_v]
            except ValueError:
                pass

        if max_price is not None and max_price != "":
            try:
                max_v = float(max_price)
                products = [p for p in products if p["current_price"] <= max_v]
            except ValueError:
                pass

        if sort_by == "price_asc":
            products.sort(key=lambda x: x["current_price"])
        elif sort_by == "price_desc":
            products.sort(key=lambda x: x["current_price"], reverse=True)
        elif sort_by == "name_ar":
            products.sort(key=lambda x: x["name_ar"])
        elif sort_by == "name_en":
            products.sort(key=lambda x: x["name_en"].lower())

        return JSONResponse({"products": products, "total": len(products)})
    finally:
        conn.close()


async def api_get_product(request: Request) -> JSONResponse:
    slug_or_id = request.path_params["slug_or_id"]
    conn = get_connection()
    try:
        if slug_or_id.isdigit():
            row = conn.execute(
                "SELECT * FROM products WHERE id = ? AND availability != 'disabled'",
                (int(slug_or_id),),
            ).fetchone()
        else:
            row = conn.execute(
                "SELECT * FROM products WHERE slug = ? AND availability != 'disabled'",
                (slug_or_id,),
            ).fetchone()

        if not row:
            return JSONResponse(
                {"error_ar": "المنتج غير موجود", "error_en": "Product not found"},
                status_code=404,
            )

        revs = [
            dict(r)
            for r in conn.execute(
                "SELECT id, product_id, rating, review_text, display_name, created_at "
                "FROM reviews WHERE product_id = ? AND moderation_status = 'approved' ORDER BY id DESC",
                (row["id"],),
            ).fetchall()
        ]
        product = format_product_row(row, revs)

        related_rows = conn.execute(
            "SELECT * FROM products WHERE id != ? AND availability != 'disabled' ORDER BY id ASC LIMIT 4",
            (row["id"],),
        ).fetchall()
        related = [format_product_row(r, []) for r in related_rows]

        return JSONResponse({"product": product, "related_products": related})
    finally:
        conn.close()


async def api_submit_review(request: Request) -> JSONResponse:
    product_id = int(request.path_params["product_id"])
    try:
        body = await request.json()
    except Exception:
        return JSONResponse(
            {"error_ar": "بيانات غير صالحة", "error_en": "Invalid request payload"},
            status_code=400,
        )

    display_name = (body.get("display_name") or "").strip()
    review_text = (body.get("review_text") or "").strip()
    honeypot = (body.get("website") or "").strip()
    try:
        rating = int(body.get("rating", 0))
    except (ValueError, TypeError):
        rating = 0

    # Honeypot spam check
    if honeypot:
        return JSONResponse(
            {"error_ar": "تم رفض الطلب", "error_en": "Spam detected"},
            status_code=400,
        )

    if rating < 1 or rating > 5:
        return JSONResponse(
            {
                "error_ar": "يرجى اختيار تقييم من 1 إلى 5 نجوم",
                "error_en": "Please select a rating between 1 and 5 stars",
            },
            status_code=400,
        )

    if len(display_name) < 2 or len(display_name) > 80:
        return JSONResponse(
            {
                "error_ar": "يرجى إدخال اسم صحيح (من حرفين إلى 80 حرفاً)",
                "error_en": "Please enter a valid name (2 to 80 characters)",
            },
            status_code=400,
        )

    if len(review_text) < 5 or len(review_text) > 1000:
        return JSONResponse(
            {
                "error_ar": "يرجى كتابة تعليق لا يقل عن 5 أحرف ولا يزيد عن 1000 حرف",
                "error_en": "Please enter a review between 5 and 1000 characters",
            },
            status_code=400,
        )

    if "http://" in review_text.lower() or "https://" in review_text.lower():
        return JSONResponse(
            {
                "error_ar": "لا يُسمح بإدراج روابط في التقييمات",
                "error_en": "Links are not allowed in product reviews",
            },
            status_code=400,
        )

    ip_hash = get_client_ip_hash(request)
    conn = get_connection()
    try:
        prod = conn.execute(
            "SELECT id FROM products WHERE id = ? AND availability != 'disabled'",
            (product_id,),
        ).fetchone()
        if not prod:
            return JSONResponse(
                {"error_ar": "المنتج غير موجود", "error_en": "Product not found"},
                status_code=404,
            )

        # Basic rate limit: max 3 reviews from same IP hash per product
        recent_count = conn.execute(
            "SELECT COUNT(*) AS cnt FROM reviews WHERE product_id = ? AND ip_hash = ?",
            (product_id, ip_hash),
        ).fetchone()["cnt"]
        if recent_count >= 3:
            return JSONResponse(
                {
                    "error_ar": "لقد قمت بإرسال تقييم لهذا المنتج بالفعل.",
                    "error_en": "You have already submitted reviews for this product.",
                },
                status_code=429,
            )

        now = utc_now_iso()
        conn.execute(
            """
            INSERT INTO reviews (product_id, rating, review_text, display_name, moderation_status, ip_hash, created_at)
            VALUES (?, ?, ?, ?, 'pending', ?, ?)
            """,
            (product_id, rating, review_text, display_name, ip_hash, now),
        )
        conn.commit()
        return JSONResponse(
            {
                "success": True,
                "message_ar": "شكراً لتقييمك! تم استلام مراجعتك وسيتم نشرها بعد المراجعة.",
                "message_en": "Thank you! Your review has been received and is pending moderation.",
            },
            status_code=201,
        )
    finally:
        conn.close()


async def api_calculate_cart(request: Request) -> JSONResponse:
    """
    Server-side cart and checkout preview calculation.
    Never trusts prices sent by the browser.
    """
    try:
        body = await request.json()
    except Exception:
        body = {}

    raw_items = body.get("items") or []
    discount_code = (body.get("discount_code") or "").strip()
    governorate = (body.get("governorate") or "").strip()

    conn = get_connection()
    try:
        settings = get_store_settings(conn)
        delivery_fee = calculate_delivery_fee_for_governorate(settings, governorate)

        validated_items = []
        subtotal = 0.0
        warnings_ar = []
        warnings_en = []

        for item in raw_items:
            try:
                pid = int(item.get("product_id"))
                qty = int(item.get("quantity", 1))
            except (ValueError, TypeError):
                continue
            if qty <= 0:
                continue

            row = conn.execute("SELECT * FROM products WHERE id = ?", (pid,)).fetchone()
            if not row or row["availability"] == "disabled":
                warnings_ar.append("أحد المنتجات لم يعد متوفراً")
                warnings_en.append("One of the products is no longer available")
                continue

            prod = format_product_row(row)
            avail_stock = int(prod["stock_quantity"]) if prod["in_stock"] else 0
            if avail_stock <= 0:
                warnings_ar.append(f"المنتج ({prod['name_ar']}) غير متوفر حالياً في المخزون")
                warnings_en.append(f"Product ({prod['name_en']}) is currently out of stock")
                continue

            actual_qty = min(qty, avail_stock)
            if actual_qty < qty:
                warnings_ar.append(
                    f"تم تعديل كمية ({prod['name_ar']}) إلى الحد الأقصى المتاح ({actual_qty})"
                )
                warnings_en.append(
                    f"Quantity for ({prod['name_en']}) adjusted to available stock ({actual_qty})"
                )

            unit_price = round(float(prod["current_price"]), 2)
            line_total = round(unit_price * actual_qty, 2)
            subtotal = round(subtotal + line_total, 2)

            validated_items.append(
                {
                    "product_id": prod["id"],
                    "slug": prod["slug"],
                    "name_ar": prod["name_ar"],
                    "name_en": prod["name_en"],
                    "size": prod["size"],
                    "image": prod["images"][0] if prod["images"] else "/static/images/logo.png",
                    "unit_price": unit_price,
                    "original_price": float(prod["original_price"]),
                    "quantity": actual_qty,
                    "max_stock": avail_stock,
                    "line_total": line_total,
                }
            )

        discount_amount = 0.0
        discount_valid = False
        discount_msg_ar = ""
        discount_msg_en = ""
        applied_code = None

        if discount_code and subtotal > 0:
            is_valid, msg_ar, msg_en, disc_amt, disc_row = validate_discount_code(
                conn, discount_code, subtotal
            )
            discount_valid = is_valid
            discount_msg_ar = msg_ar
            discount_msg_en = msg_en
            if is_valid and disc_row:
                discount_amount = disc_amt
                applied_code = disc_row["code"]

        effective_delivery = delivery_fee if subtotal > 0 else 0.0
        final_total = round(max(0.0, subtotal - discount_amount) + effective_delivery, 2)

        return JSONResponse(
            {
                "items": validated_items,
                "subtotal": subtotal,
                "discount_code": applied_code,
                "discount_valid": discount_valid,
                "discount_amount": discount_amount,
                "discount_message_ar": discount_msg_ar,
                "discount_message_en": discount_msg_en,
                "delivery_fee": effective_delivery,
                "configured_delivery_fee": delivery_fee,
                "final_total": final_total,
                "warnings_ar": warnings_ar,
                "warnings_en": warnings_en,
            }
        )
    finally:
        conn.close()


async def api_create_order(request: Request) -> JSONResponse:
    """
    Secure server-side order creation with atomic stock deduction and idempotency.
    """
    try:
        body = await request.json()
    except Exception:
        return JSONResponse(
            {"error_ar": "بيانات الطلب غير صالحة", "error_en": "Invalid order data"},
            status_code=400,
        )

    customer_name = (body.get("customer_name") or "").strip()
    raw_phone = (body.get("phone_number") or "").strip()
    governorate = (body.get("governorate") or "").strip()
    delivery_address = (body.get("delivery_address") or "").strip()
    notes = (body.get("notes") or "").strip()
    discount_code = (body.get("discount_code") or "").strip()
    idempotency_key = (body.get("idempotency_key") or "").strip() or None
    raw_items = body.get("items") or []

    # 1. Validate required customer fields
    if len(customer_name) < 2 or len(customer_name) > 120:
        return JSONResponse(
            {
                "error_ar": "يرجى إدخال اسم العميل بالكامل",
                "error_en": "Please enter your full name",
                "field": "customer_name",
            },
            status_code=400,
        )

    normalized_phone = normalize_egypt_phone(raw_phone)
    if not normalized_phone:
        return JSONResponse(
            {
                "error_ar": "يرجى إدخال رقم هاتف محمول مصري صحيح (مثال: 01012345678)",
                "error_en": "Please enter a valid Egyptian mobile phone number (e.g. 01012345678)",
                "field": "phone_number",
            },
            status_code=400,
        )

    valid_govs = {g["id"] for g in EGYPT_GOVERNORATES} | {g["ar"] for g in EGYPT_GOVERNORATES}
    if not governorate or governorate not in valid_govs:
        return JSONResponse(
            {
                "error_ar": "يرجى اختيار المحافظة",
                "error_en": "Please select a valid governorate",
                "field": "governorate",
            },
            status_code=400,
        )

    if len(delivery_address) < 5 or len(delivery_address) > 500:
        return JSONResponse(
            {
                "error_ar": "يرجى إدخال عنوان التوصيل بالتفصيل",
                "error_en": "Please enter a detailed delivery address",
                "field": "delivery_address",
            },
            status_code=400,
        )

    if len(notes) > 1000:
        notes = notes[:1000]

    if not isinstance(raw_items, list) or len(raw_items) == 0:
        return JSONResponse(
            {
                "error_ar": "سلة التسوق فارغة",
                "error_en": "Your shopping cart is empty",
            },
            status_code=400,
        )

    # Consolidate quantities by product_id and validate positive integers
    merged_quantities: Dict[int, int] = {}
    for item in raw_items:
        try:
            pid = int(item.get("product_id"))
            qty = int(item.get("quantity"))
        except (ValueError, TypeError, AttributeError):
            return JSONResponse(
                {
                    "error_ar": "كمية أو معرف منتج غير صالح",
                    "error_en": "Invalid product ID or quantity",
                },
                status_code=400,
            )
        if qty <= 0 or qty > 999:
            return JSONResponse(
                {
                    "error_ar": "الكمية المطلوبة غير صالحة",
                    "error_en": "Requested quantity must be a positive number",
                },
                status_code=400,
            )
        merged_quantities[pid] = merged_quantities.get(pid, 0) + qty

    conn = get_connection()
    try:
        conn.execute("BEGIN IMMEDIATE;")

        # Check idempotency key to prevent duplicate orders from double-clicks / retries
        if idempotency_key:
            existing_order = conn.execute(
                "SELECT * FROM orders WHERE idempotency_key = ?", (idempotency_key,)
            ).fetchone()
            if existing_order:
                conn.execute("COMMIT;")
                items_rows = conn.execute(
                    "SELECT * FROM order_items WHERE order_id = ?", (existing_order["id"],)
                ).fetchall()
                order_dict = dict(existing_order)
                order_dict["items"] = [dict(r) for r in items_rows]
                return JSONResponse({"order": order_dict, "duplicate_prevented": True}, status_code=200)

        # Validate products & stock inside the transaction
        order_items_to_insert = []
        subtotal = 0.0

        for pid, qty in merged_quantities.items():
            prod_row = conn.execute(
                "SELECT * FROM products WHERE id = ?", (pid,)
            ).fetchone()
            if not prod_row or prod_row["availability"] == "disabled":
                conn.execute("ROLLBACK;")
                return JSONResponse(
                    {
                        "error_ar": "أحد المنتجات المطلوبة غير متاح حالياً",
                        "error_en": "One of the requested products is currently unavailable",
                    },
                    status_code=400,
                )

            if prod_row["availability"] != "in_stock" or int(prod_row["stock_quantity"]) < qty:
                conn.execute("ROLLBACK;")
                avail = int(prod_row["stock_quantity"]) if prod_row["availability"] == "in_stock" else 0
                return JSONResponse(
                    {
                        "error_ar": f"الكمية المطلوبة من ({prod_row['name_ar']}) غير متوفرة بالكامل. المتاح حالياً: {avail}",
                        "error_en": f"Insufficient stock for ({prod_row['name_en']}). Available: {avail}",
                    },
                    status_code=400,
                )

            unit_price = round(float(prod_row["current_price"]), 2)
            if unit_price < 0:
                conn.execute("ROLLBACK;")
                return JSONResponse(
                    {"error_ar": "خطأ في تسعير المنتج", "error_en": "Invalid product price"},
                    status_code=400,
                )

            line_total = round(unit_price * qty, 2)
            subtotal = round(subtotal + line_total, 2)

            order_items_to_insert.append(
                {
                    "product_id": pid,
                    "product_name_ar_snapshot": prod_row["name_ar"],
                    "product_name_en_snapshot": prod_row["name_en"],
                    "product_name_snapshot": f"{prod_row['name_ar']} / {prod_row['name_en']}",
                    "unit_price_snapshot": unit_price,
                    "quantity": qty,
                    "line_total": line_total,
                }
            )

        # Validate discount code if supplied
        discount_amount = 0.0
        applied_discount_code = None
        discount_id = None

        if discount_code:
            is_valid, msg_ar, msg_en, disc_amt, disc_row = validate_discount_code(
                conn, discount_code, subtotal
            )
            if not is_valid or not disc_row:
                conn.execute("ROLLBACK;")
                return JSONResponse(
                    {"error_ar": msg_ar, "error_en": msg_en, "field": "discount_code"},
                    status_code=400,
                )
            discount_amount = disc_amt
            applied_discount_code = disc_row["code"]
            discount_id = disc_row["id"]

        # Retrieve live delivery fee from backend configuration
        settings = get_store_settings(conn)
        delivery_fee = calculate_delivery_fee_for_governorate(settings, governorate)
        final_total = round(max(0.0, subtotal - discount_amount) + delivery_fee, 2)

        now = utc_now_iso()
        date_part = datetime.now(timezone.utc).strftime("%Y%m%d")
        order_number = f"DP-{date_part}-{secrets.token_hex(3).upper()}"
        while conn.execute(
            "SELECT 1 FROM orders WHERE order_number = ?", (order_number,)
        ).fetchone():
            order_number = f"DP-{date_part}-{secrets.token_hex(3).upper()}"

        access_token = secrets.token_hex(24)

        cursor = conn.execute(
            """
            INSERT INTO orders (
                order_number, idempotency_key, access_token, customer_name, phone_number,
                governorate, delivery_address, notes, subtotal, discount_code,
                discount_amount, delivery_fee, final_total, payment_method,
                order_status, stock_restored, created_at, updated_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'COD', 'Pending', 0, ?, ?)
            """,
            (
                order_number,
                idempotency_key,
                access_token,
                customer_name,
                normalized_phone,
                governorate,
                delivery_address,
                notes,
                subtotal,
                applied_discount_code,
                discount_amount,
                delivery_fee,
                final_total,
                now,
                now,
            ),
        )
        order_id = cursor.lastrowid

        for item in order_items_to_insert:
            conn.execute(
                """
                INSERT INTO order_items (
                    order_id, product_id, product_name_ar_snapshot, product_name_en_snapshot,
                    product_name_snapshot, unit_price_snapshot, quantity, line_total
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                """,
                (
                    order_id,
                    item["product_id"],
                    item["product_name_ar_snapshot"],
                    item["product_name_en_snapshot"],
                    item["product_name_snapshot"],
                    item["unit_price_snapshot"],
                    item["quantity"],
                    item["line_total"],
                ),
            )
            # Deduct inventory atomically
            conn.execute(
                """
                UPDATE products
                SET stock_quantity = stock_quantity - ?,
                    availability = CASE WHEN (stock_quantity - ?) <= 0 THEN 'out_of_stock' ELSE availability END,
                    updated_at = ?
                WHERE id = ?
                """,
                (item["quantity"], item["quantity"], now, item["product_id"]),
            )

        if discount_id is not None:
            conn.execute(
                "UPDATE discount_codes SET used_count = used_count + 1 WHERE id = ?",
                (discount_id,),
            )

        conn.execute("COMMIT;")

        order_row = conn.execute("SELECT * FROM orders WHERE id = ?", (order_id,)).fetchone()
        items_rows = conn.execute(
            "SELECT * FROM order_items WHERE order_id = ?", (order_id,)
        ).fetchall()
        order_data = dict(order_row)
        order_data["items"] = [dict(r) for r in items_rows]

        return JSONResponse({"order": order_data}, status_code=201)
    except Exception as e:
        try:
            conn.execute("ROLLBACK;")
        except Exception:
            pass
        return JSONResponse(
            {
                "error_ar": "حدث خطأ أثناء حفظ الطلب، يرجى المحاولة مرة أخرى",
                "error_en": f"An error occurred while saving your order: {str(e)}",
            },
            status_code=500,
        )
    finally:
        conn.close()


async def api_get_order_by_number(request: Request) -> JSONResponse:
    """
    Secure order confirmation lookup.
    Requires either the order's unique access_token OR an authenticated admin session.
    """
    order_number = (request.path_params.get("order_number") or "").strip()
    provided_token = (
        request.query_params.get("token")
        or request.headers.get("X-Order-Token")
        or ""
    ).strip()
    admin_payload = verify_admin_request(request)

    conn = get_connection()
    try:
        row = conn.execute(
            "SELECT * FROM orders WHERE order_number = ?", (order_number,)
        ).fetchone()
        if not row:
            return JSONResponse(
                {"error_ar": "الطلب غير موجود", "error_en": "Order not found"},
                status_code=404,
            )

        if not admin_payload:
            if not provided_token or not secrets.compare_digest(
                provided_token, row["access_token"]
            ):
                return JSONResponse(
                    {
                        "error_ar": "غير مصرح بالوصول إلى بيانات هذا الطلب",
                        "error_en": "Unauthorized access to order details",
                    },
                    status_code=403,
                )

        items_rows = conn.execute(
            "SELECT * FROM order_items WHERE order_id = ?", (row["id"],)
        ).fetchall()
        order_dict = dict(row)
        if not admin_payload:
            order_dict.pop("idempotency_key", None)
        order_dict["items"] = [dict(r) for r in items_rows]
        return JSONResponse({"order": order_dict})
    finally:
        conn.close()


# ----------------------------------------------------------------------------
# ADMIN API ENDPOINTS
# ----------------------------------------------------------------------------

async def api_admin_login(request: Request) -> JSONResponse:
    try:
        body = await request.json()
    except Exception:
        return JSONResponse(
            {"error_ar": "بيانات غير صالحة", "error_en": "Invalid request"},
            status_code=400,
        )

    username = (body.get("username") or "").strip()
    password = body.get("password") or ""

    if not username or not password:
        return JSONResponse(
            {
                "error_ar": "يرجى إدخال اسم المستخدم وكلمة المرور",
                "error_en": "Username and password are required",
            },
            status_code=400,
        )

    conn = get_connection()
    try:
        row = conn.execute(
            "SELECT * FROM admin_users WHERE username = ?", (username,)
        ).fetchone()
        if not row or not verify_password(password, row["password_hash"]):
            return JSONResponse(
                {
                    "error_ar": "اسم المستخدم أو كلمة المرور غير صحيحة",
                    "error_en": "Invalid username or password",
                },
                status_code=401,
            )

        token = create_admin_jwt(row["username"])
        resp = JSONResponse(
            {"success": True, "username": row["username"], "token": token}
        )
        resp.set_cookie(
            ADMIN_COOKIE_NAME,
            token,
            max_age=86400 * 7,
            httponly=True,
            samesite="lax",
            path="/",
        )
        return resp
    finally:
        conn.close()


async def api_admin_logout(request: Request) -> JSONResponse:
    resp = JSONResponse({"success": True})
    resp.delete_cookie(ADMIN_COOKIE_NAME, path="/")
    return resp


async def api_admin_me(request: Request) -> JSONResponse:
    admin = verify_admin_request(request)
    if not admin:
        return JSONResponse(
            {"authenticated": False, "error_en": "Unauthorized"}, status_code=401
        )
    return JSONResponse({"authenticated": True, "username": admin["sub"]})


async def api_admin_overview(request: Request) -> JSONResponse:
    if not verify_admin_request(request):
        return JSONResponse({"error_en": "Unauthorized"}, status_code=401)

    conn = get_connection()
    try:
        settings = get_store_settings(conn)
        low_stock_threshold = int(settings.get("low_stock_threshold", 10))

        total_orders = conn.execute("SELECT COUNT(*) AS c FROM orders").fetchone()["c"]
        pending_orders = conn.execute(
            "SELECT COUNT(*) AS c FROM orders WHERE order_status = 'Pending'"
        ).fetchone()["c"]
        completed_orders = conn.execute(
            "SELECT COUNT(*) AS c FROM orders WHERE order_status = 'Delivered'"
        ).fetchone()["c"]
        cancelled_orders = conn.execute(
            "SELECT COUNT(*) AS c FROM orders WHERE order_status = 'Cancelled'"
        ).fetchone()["c"]

        sales_row = conn.execute(
            """
            SELECT
                COALESCE(SUM(final_total), 0) AS total_sales,
                COALESCE(SUM(subtotal), 0) AS gross_product_sales,
                COALESCE(SUM(discount_amount), 0) AS total_discounts,
                COALESCE(SUM(delivery_fee), 0) AS total_delivery_fees
            FROM orders
            WHERE order_status != 'Cancelled'
            """
        ).fetchone()

        cancelled_value = conn.execute(
            "SELECT COALESCE(SUM(final_total), 0) AS v FROM orders WHERE order_status = 'Cancelled'"
        ).fetchone()["v"]

        status_rows = conn.execute(
            "SELECT order_status, COUNT(*) AS count, COALESCE(SUM(final_total), 0) AS total FROM orders GROUP BY order_status"
        ).fetchall()

        best_selling_rows = conn.execute(
            """
            SELECT
                oi.product_id,
                oi.product_name_ar_snapshot AS name_ar,
                oi.product_name_en_snapshot AS name_en,
                SUM(oi.quantity) AS total_quantity_sold,
                ROUND(SUM(oi.line_total), 2) AS total_revenue
            FROM order_items oi
            JOIN orders o ON o.id = oi.order_id
            WHERE o.order_status != 'Cancelled'
            GROUP BY oi.product_id, oi.product_name_ar_snapshot, oi.product_name_en_snapshot
            ORDER BY total_quantity_sold DESC, total_revenue DESC
            LIMIT 5
            """
        ).fetchall()

        recent_orders_rows = conn.execute(
            "SELECT * FROM orders ORDER BY id DESC LIMIT 10"
        ).fetchall()

        low_stock_rows = conn.execute(
            "SELECT * FROM products WHERE stock_quantity <= ? ORDER BY stock_quantity ASC",
            (low_stock_threshold,),
        ).fetchall()

        sales_by_date_rows = conn.execute(
            """
            SELECT
                SUBSTR(created_at, 1, 10) AS date,
                COUNT(*) AS order_count,
                ROUND(SUM(CASE WHEN order_status != 'Cancelled' THEN subtotal ELSE 0 END), 2) AS gross_sales,
                ROUND(SUM(CASE WHEN order_status != 'Cancelled' THEN discount_amount ELSE 0 END), 2) AS discounts,
                ROUND(SUM(CASE WHEN order_status != 'Cancelled' THEN delivery_fee ELSE 0 END), 2) AS delivery_fees,
                ROUND(SUM(CASE WHEN order_status != 'Cancelled' THEN final_total ELSE 0 END), 2) AS net_revenue,
                ROUND(SUM(CASE WHEN order_status = 'Cancelled' THEN final_total ELSE 0 END), 2) AS cancelled_total
            FROM orders
            GROUP BY SUBSTR(created_at, 1, 10)
            ORDER BY date DESC
            LIMIT 30
            """
        ).fetchall()

        pending_reviews_count = conn.execute(
            "SELECT COUNT(*) AS c FROM reviews WHERE moderation_status = 'pending'"
        ).fetchone()["c"]

        return JSONResponse(
            {
                "total_orders": total_orders,
                "pending_orders": pending_orders,
                "completed_orders": completed_orders,
                "cancelled_orders": cancelled_orders,
                "total_sales": round(float(sales_row["total_sales"]), 2),
                "gross_product_sales": round(float(sales_row["gross_product_sales"]), 2),
                "total_discounts": round(float(sales_row["total_discounts"]), 2),
                "total_delivery_fees": round(float(sales_row["total_delivery_fees"]), 2),
                "cancelled_orders_value": round(float(cancelled_value), 2),
                "orders_by_status": [dict(r) for r in status_rows],
                "best_selling_products": [dict(r) for r in best_selling_rows],
                "recent_orders": [dict(r) for r in recent_orders_rows],
                "low_stock_products": [format_product_row(r) for r in low_stock_rows],
                "sales_by_date": [dict(r) for r in sales_by_date_rows],
                "pending_reviews_count": pending_reviews_count,
            }
        )
    finally:
        conn.close()


async def api_admin_products(request: Request) -> JSONResponse:
    if not verify_admin_request(request):
        return JSONResponse({"error_en": "Unauthorized"}, status_code=401)

    conn = get_connection()
    try:
        if request.method == "GET":
            rows = conn.execute("SELECT * FROM products ORDER BY id ASC").fetchall()
            return JSONResponse({"products": [format_product_row(r) for r in rows]})

        body = await request.json()
        name_ar = (body.get("name_ar") or "").strip()
        name_en = (body.get("name_en") or "").strip()
        description_ar = (body.get("description_ar") or "").strip()
        description_en = (body.get("description_en") or "").strip()
        category_ar = (body.get("category_ar") or "مزيلات بقع").strip()
        category_en = (body.get("category_en") or "Stain Removers").strip()
        size = (body.get("size") or "220 ml").strip()
        slug = (body.get("slug") or "").strip() or slugify(name_en or name_ar)

        try:
            current_price = round(float(body.get("current_price", 99.0)), 2)
            original_price = round(float(body.get("original_price", current_price)), 2)
            stock_quantity = int(body.get("stock_quantity", 0))
        except (ValueError, TypeError):
            return JSONResponse(
                {"error_ar": "سعر أو كمية غير صالحة", "error_en": "Invalid price or stock quantity"},
                status_code=400,
            )

        if not name_ar or not name_en or current_price < 0 or original_price < 0 or stock_quantity < 0:
            return JSONResponse(
                {
                    "error_ar": "يرجى ملء جميع البيانات الإلزامية بقيم صحيحة",
                    "error_en": "Please provide valid product names, non-negative prices, and stock quantity",
                },
                status_code=400,
            )

        images = body.get("images") or ["/static/images/logo.png"]
        if isinstance(images, str):
            images = [x.strip() for x in images.split(",") if x.strip()]

        availability = body.get("availability") or ("in_stock" if stock_quantity > 0 else "out_of_stock")
        if availability not in ("in_stock", "out_of_stock", "disabled"):
            availability = "in_stock"

        usage_ar = body.get("usage_instructions_ar") or []
        if isinstance(usage_ar, str):
            usage_ar = [line.strip() for line in usage_ar.splitlines() if line.strip()]
        usage_en = body.get("usage_instructions_en") or []
        if isinstance(usage_en, str):
            usage_en = [line.strip() for line in usage_en.splitlines() if line.strip()]

        # Ensure unique slug
        base_slug = slug
        counter = 2
        while conn.execute("SELECT 1 FROM products WHERE slug = ?", (slug,)).fetchone():
            slug = f"{base_slug}-{counter}"
            counter += 1

        now = utc_now_iso()
        cur = conn.execute(
            """
            INSERT INTO products (
                slug, name_ar, name_en, description_ar, description_en,
                category_ar, category_en, size, current_price, original_price,
                images, stock_quantity, availability, usage_instructions_ar,
                usage_instructions_en, created_at, updated_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """,
            (
                slug,
                name_ar,
                name_en,
                description_ar,
                description_en,
                category_ar,
                category_en,
                size,
                current_price,
                original_price,
                json.dumps(images, ensure_ascii=False),
                stock_quantity,
                availability,
                json.dumps(usage_ar, ensure_ascii=False),
                json.dumps(usage_en, ensure_ascii=False),
                now,
                now,
            ),
        )
        conn.commit()
        new_row = conn.execute("SELECT * FROM products WHERE id = ?", (cur.lastrowid,)).fetchone()
        return JSONResponse({"product": format_product_row(new_row)}, status_code=201)
    finally:
        conn.close()


async def api_admin_product_detail(request: Request) -> JSONResponse:
    if not verify_admin_request(request):
        return JSONResponse({"error_en": "Unauthorized"}, status_code=401)

    pid = int(request.path_params["id"])
    conn = get_connection()
    try:
        existing = conn.execute("SELECT * FROM products WHERE id = ?", (pid,)).fetchone()
        if not existing:
            return JSONResponse({"error_en": "Product not found"}, status_code=404)

        if request.method == "DELETE":
            conn.execute("DELETE FROM products WHERE id = ?", (pid,))
            conn.commit()
            return JSONResponse({"success": True})

        body = await request.json()
        existing_fmt = format_product_row(existing)

        name_ar = (body.get("name_ar", existing_fmt["name_ar"]) or "").strip()
        name_en = (body.get("name_en", existing_fmt["name_en"]) or "").strip()
        description_ar = (body.get("description_ar", existing_fmt["description_ar"]) or "").strip()
        description_en = (body.get("description_en", existing_fmt["description_en"]) or "").strip()
        category_ar = (body.get("category_ar", existing_fmt["category_ar"]) or "").strip()
        category_en = (body.get("category_en", existing_fmt["category_en"]) or "").strip()
        size = (body.get("size", existing_fmt["size"]) or "").strip()
        slug = (body.get("slug", existing_fmt["slug"]) or "").strip() or existing_fmt["slug"]

        try:
            current_price = round(float(body.get("current_price", existing_fmt["current_price"])), 2)
            original_price = round(float(body.get("original_price", existing_fmt["original_price"])), 2)
            stock_quantity = int(body.get("stock_quantity", existing_fmt["stock_quantity"]))
        except (ValueError, TypeError):
            return JSONResponse(
                {"error_ar": "سعر أو كمية غير صالحة", "error_en": "Invalid price or stock quantity"},
                status_code=400,
            )

        if not name_ar or not name_en or current_price < 0 or original_price < 0 or stock_quantity < 0:
            return JSONResponse(
                {"error_ar": "بيانات المنتج غير صالحة", "error_en": "Invalid product values"},
                status_code=400,
            )

        images = body.get("images", existing_fmt["images"])
        if isinstance(images, str):
            images = [x.strip() for x in images.split(",") if x.strip()]
        if not images:
            images = existing_fmt["images"]

        availability = body.get("availability", existing_fmt["availability"])
        if availability not in ("in_stock", "out_of_stock", "disabled"):
            availability = existing_fmt["availability"]

        usage_ar = body.get("usage_instructions_ar", existing_fmt["usage_instructions_ar"])
        if isinstance(usage_ar, str):
            usage_ar = [line.strip() for line in usage_ar.splitlines() if line.strip()]
        usage_en = body.get("usage_instructions_en", existing_fmt["usage_instructions_en"])
        if isinstance(usage_en, str):
            usage_en = [line.strip() for line in usage_en.splitlines() if line.strip()]

        conflict = conn.execute(
            "SELECT id FROM products WHERE slug = ? AND id != ?", (slug, pid)
        ).fetchone()
        if conflict:
            slug = f"{slug}-{pid}"

        now = utc_now_iso()
        conn.execute(
            """
            UPDATE products
            SET slug = ?, name_ar = ?, name_en = ?, description_ar = ?, description_en = ?,
                category_ar = ?, category_en = ?, size = ?, current_price = ?, original_price = ?,
                images = ?, stock_quantity = ?, availability = ?, usage_instructions_ar = ?,
                usage_instructions_en = ?, updated_at = ?
            WHERE id = ?
            """,
            (
                slug,
                name_ar,
                name_en,
                description_ar,
                description_en,
                category_ar,
                category_en,
                size,
                current_price,
                original_price,
                json.dumps(images, ensure_ascii=False),
                stock_quantity,
                availability,
                json.dumps(usage_ar, ensure_ascii=False),
                json.dumps(usage_en, ensure_ascii=False),
                now,
                pid,
            ),
        )
        conn.commit()
        updated = conn.execute("SELECT * FROM products WHERE id = ?", (pid,)).fetchone()
        return JSONResponse({"product": format_product_row(updated)})
    finally:
        conn.close()


async def api_admin_upload_image(request: Request) -> JSONResponse:
    if not verify_admin_request(request):
        return JSONResponse({"error_en": "Unauthorized"}, status_code=401)

    form = await request.form()
    upload_file = form.get("file")
    if not upload_file or not getattr(upload_file, "filename", None):
        return JSONResponse(
            {"error_ar": "لم يتم اختيار ملف", "error_en": "No file selected"},
            status_code=400,
        )

    ext = os.path.splitext(upload_file.filename)[1].lower()
    if ext not in ALLOWED_IMAGE_EXTENSIONS:
        return JSONResponse(
            {
                "error_ar": "صيغة الصورة غير مدعومة (يُسمح بـ JPG, PNG, WEBP)",
                "error_en": "Unsupported image format (allowed: JPG, PNG, WEBP)",
            },
            status_code=400,
        )

    content = await upload_file.read()
    if len(content) > 10 * 1024 * 1024:
        return JSONResponse(
            {"error_ar": "حجم الصورة يتجاوز 10 ميجابايت", "error_en": "Image exceeds 10MB limit"},
            status_code=400,
        )

    safe_name = f"prod_{int(time.time())}_{secrets.token_hex(4)}{ext}"
    uploads_dir = os.path.join(BASE_DIR, "static", "uploads")
    os.makedirs(uploads_dir, exist_ok=True)
    dest_path = os.path.join(uploads_dir, safe_name)
    with open(dest_path, "wb") as f:
        f.write(content)

    return JSONResponse({"url": f"/static/uploads/{safe_name}"}, status_code=201)


async def api_admin_orders(request: Request) -> JSONResponse:
    if not verify_admin_request(request):
        return JSONResponse({"error_en": "Unauthorized"}, status_code=401)

    q = (request.query_params.get("q") or "").strip()
    status = (request.query_params.get("status") or "").strip()
    date_from = (request.query_params.get("date_from") or "").strip()
    date_to = (request.query_params.get("date_to") or "").strip()

    conn = get_connection()
    try:
        sql = "SELECT * FROM orders WHERE 1=1"
        params: List[Any] = []

        if q:
            sql += " AND (order_number LIKE ? OR customer_name LIKE ? OR phone_number LIKE ?)"
            like_q = f"%{q}%"
            params.extend([like_q, like_q, like_q])

        if status and status != "all":
            sql += " AND order_status = ?"
            params.append(status)

        if date_from:
            sql += " AND SUBSTR(created_at, 1, 10) >= ?"
            params.append(date_from[:10])

        if date_to:
            sql += " AND SUBSTR(created_at, 1, 10) <= ?"
            params.append(date_to[:10])

        sql += " ORDER BY id DESC"
        rows = conn.execute(sql, params).fetchall()

        orders_list = []
        for r in rows:
            od = dict(r)
            items = conn.execute(
                "SELECT * FROM order_items WHERE order_id = ?", (r["id"],)
            ).fetchall()
            od["items"] = [dict(i) for i in items]
            orders_list.append(od)

        return JSONResponse({"orders": orders_list})
    finally:
        conn.close()


async def api_admin_orders_export(request: Request) -> Response:
    if not verify_admin_request(request):
        return JSONResponse({"error_en": "Unauthorized"}, status_code=401)

    q = (request.query_params.get("q") or "").strip()
    status = (request.query_params.get("status") or "").strip()
    date_from = (request.query_params.get("date_from") or "").strip()
    date_to = (request.query_params.get("date_to") or "").strip()

    conn = get_connection()
    try:
        sql = "SELECT * FROM orders WHERE 1=1"
        params: List[Any] = []
        if q:
            sql += " AND (order_number LIKE ? OR customer_name LIKE ? OR phone_number LIKE ?)"
            params.extend([f"%{q}%", f"%{q}%", f"%{q}%"])
        if status and status != "all":
            sql += " AND order_status = ?"
            params.append(status)
        if date_from:
            sql += " AND SUBSTR(created_at, 1, 10) >= ?"
            params.append(date_from[:10])
        if date_to:
            sql += " AND SUBSTR(created_at, 1, 10) <= ?"
            params.append(date_to[:10])
        sql += " ORDER BY id DESC"

        rows = conn.execute(sql, params).fetchall()
        output = io.StringIO()
        output.write("\ufeff")  # UTF-8 BOM for Excel Arabic compatibility
        writer = csv.writer(output)
        writer.writerow(
            [
                "Order Number / رقم الطلب",
                "Date / التاريخ",
                "Customer Name / اسم العميل",
                "Phone / رقم الهاتف",
                "Governorate / المحافظة",
                "Address / العنوان",
                "Items / المنتجات",
                "Subtotal (EGP)",
                "Discount Code",
                "Discount (EGP)",
                "Delivery Fee (EGP)",
                "Final Total (EGP)",
                "Payment Method",
                "Status / الحالة",
                "Notes / ملاحظات",
            ]
        )

        for r in rows:
            items = conn.execute(
                "SELECT * FROM order_items WHERE order_id = ?", (r["id"],)
            ).fetchall()
            items_summary = " | ".join(
                f"{i['product_name_ar_snapshot']} (x{i['quantity']} @ {i['unit_price_snapshot']} EGP)"
                for i in items
            )
            writer.writerow(
                [
                    r["order_number"],
                    r["created_at"],
                    r["customer_name"],
                    r["phone_number"],
                    r["governorate"],
                    r["delivery_address"],
                    items_summary,
                    r["subtotal"],
                    r["discount_code"] or "",
                    r["discount_amount"],
                    r["delivery_fee"],
                    r["final_total"],
                    r["payment_method"],
                    r["order_status"],
                    r["notes"] or "",
                ]
            )

        csv_bytes = output.getvalue().encode("utf-8")
        return Response(
            content=csv_bytes,
            media_type="text/csv; charset=utf-8",
            headers={
                "Content-Disposition": 'attachment; filename="diesel_power_orders.csv"'
            },
        )
    finally:
        conn.close()


async def api_admin_order_detail(request: Request) -> JSONResponse:
    if not verify_admin_request(request):
        return JSONResponse({"error_en": "Unauthorized"}, status_code=401)

    oid = int(request.path_params["id"])
    conn = get_connection()
    try:
        if request.method == "GET":
            row = conn.execute("SELECT * FROM orders WHERE id = ?", (oid,)).fetchone()
            if not row:
                return JSONResponse({"error_en": "Order not found"}, status_code=404)
            items = conn.execute(
                "SELECT * FROM order_items WHERE order_id = ?", (oid,)
            ).fetchall()
            od = dict(row)
            od["items"] = [dict(i) for i in items]
            return JSONResponse({"order": od})

        body = await request.json()
        conn.execute("BEGIN IMMEDIATE;")
        row = conn.execute("SELECT * FROM orders WHERE id = ?", (oid,)).fetchone()
        if not row:
            conn.execute("ROLLBACK;")
            return JSONResponse({"error_en": "Order not found"}, status_code=404)

        new_status = (body.get("order_status") or row["order_status"]).strip()
        if new_status not in VALID_ORDER_STATUSES:
            conn.execute("ROLLBACK;")
            return JSONResponse(
                {"error_ar": "حالة الطلب غير صالحة", "error_en": "Invalid order status"},
                status_code=400,
            )

        customer_name = (body.get("customer_name") or row["customer_name"]).strip()
        phone_number = (body.get("phone_number") or row["phone_number"]).strip()
        governorate = (body.get("governorate") or row["governorate"]).strip()
        delivery_address = (body.get("delivery_address") or row["delivery_address"]).strip()
        notes = body.get("notes") if "notes" in body else row["notes"]

        now = utc_now_iso()
        stock_restored = int(row["stock_restored"])

        # Handle cancellation and safe single-time inventory restoration
        if new_status == "Cancelled" and stock_restored == 0:
            items = conn.execute(
                "SELECT * FROM order_items WHERE order_id = ?", (oid,)
            ).fetchall()
            for item in items:
                if item["product_id"] is not None:
                    conn.execute(
                        """
                        UPDATE products
                        SET stock_quantity = stock_quantity + ?,
                            availability = CASE WHEN availability = 'out_of_stock' AND (stock_quantity + ?) > 0 THEN 'in_stock' ELSE availability END,
                            updated_at = ?
                        WHERE id = ?
                        """,
                        (item["quantity"], item["quantity"], now, item["product_id"]),
                    )
            stock_restored = 1
        elif new_status != "Cancelled" and stock_restored == 1:
            # Re-activating a previously cancelled order: verify and re-deduct stock
            items = conn.execute(
                "SELECT * FROM order_items WHERE order_id = ?", (oid,)
            ).fetchall()
            for item in items:
                if item["product_id"] is not None:
                    p = conn.execute(
                        "SELECT stock_quantity, name_en FROM products WHERE id = ?",
                        (item["product_id"],),
                    ).fetchone()
                    if not p or int(p["stock_quantity"]) < int(item["quantity"]):
                        conn.execute("ROLLBACK;")
                        return JSONResponse(
                            {
                                "error_ar": "لا يمكن إعادة تفعيل الطلب لعدم كفاية المخزون الحالي",
                                "error_en": "Cannot reactivate cancelled order due to insufficient current stock",
                            },
                            status_code=400,
                        )
                    conn.execute(
                        """
                        UPDATE products
                        SET stock_quantity = stock_quantity - ?,
                            availability = CASE WHEN (stock_quantity - ?) <= 0 THEN 'out_of_stock' ELSE availability END,
                            updated_at = ?
                        WHERE id = ?
                        """,
                        (item["quantity"], item["quantity"], now, item["product_id"]),
                    )
            stock_restored = 0

        conn.execute(
            """
            UPDATE orders
            SET order_status = ?, customer_name = ?, phone_number = ?,
                governorate = ?, delivery_address = ?, notes = ?,
                stock_restored = ?, updated_at = ?
            WHERE id = ?
            """,
            (
                new_status,
                customer_name,
                phone_number,
                governorate,
                delivery_address,
                notes,
                stock_restored,
                now,
                oid,
            ),
        )
        conn.execute("COMMIT;")

        updated_row = conn.execute("SELECT * FROM orders WHERE id = ?", (oid,)).fetchone()
        items = conn.execute(
            "SELECT * FROM order_items WHERE order_id = ?", (oid,)
        ).fetchall()
        od = dict(updated_row)
        od["items"] = [dict(i) for i in items]
        return JSONResponse({"order": od})
    except Exception as e:
        try:
            conn.execute("ROLLBACK;")
        except Exception:
            pass
        return JSONResponse({"error_en": str(e)}, status_code=500)
    finally:
        conn.close()


async def api_admin_settings(request: Request) -> JSONResponse:
    if not verify_admin_request(request):
        return JSONResponse({"error_en": "Unauthorized"}, status_code=401)

    conn = get_connection()
    try:
        if request.method == "GET":
            return JSONResponse({"settings": get_store_settings(conn)})

        body = await request.json()
        now = utc_now_iso()

        if "delivery_fee" in body:
            try:
                fee = round(float(body["delivery_fee"]), 2)
            except (ValueError, TypeError):
                return JSONResponse(
                    {
                        "error_ar": "يرجى إدخال قيمة رقمية صحيحة لسعر التوصيل",
                        "error_en": "Please enter a valid numeric delivery fee",
                    },
                    status_code=400,
                )
            if fee < 0 or fee > 5000:
                return JSONResponse(
                    {
                        "error_ar": "سعر التوصيل يجب أن يكون 0 أو أكثر",
                        "error_en": "Delivery fee must be 0 or greater",
                    },
                    status_code=400,
                )
            conn.execute(
                "INSERT OR REPLACE INTO store_settings (key, value, updated_at) VALUES ('delivery_fee', ?, ?)",
                (str(fee), now),
            )

        if "governorate_delivery_fees" in body and isinstance(
            body["governorate_delivery_fees"], dict
        ):
            clean_gov_fees = {}
            for k, v in body["governorate_delivery_fees"].items():
                if v is not None and v != "":
                    try:
                        fv = round(float(v), 2)
                        if fv >= 0:
                            clean_gov_fees[str(k)] = fv
                    except (ValueError, TypeError):
                        pass
            conn.execute(
                "INSERT OR REPLACE INTO store_settings (key, value, updated_at) VALUES ('governorate_delivery_fees', ?, ?)",
                (json.dumps(clean_gov_fees, ensure_ascii=False), now),
            )

        if "low_stock_threshold" in body:
            try:
                lst = max(0, int(body["low_stock_threshold"]))
                conn.execute(
                    "INSERT OR REPLACE INTO store_settings (key, value, updated_at) VALUES ('low_stock_threshold', ?, ?)",
                    (str(lst), now),
                )
            except (ValueError, TypeError):
                pass

        for text_key in ("phone", "whatsapp", "facebook_url", "address_ar", "address_en"):
            if text_key in body and isinstance(body[text_key], str):
                conn.execute(
                    "INSERT OR REPLACE INTO store_settings (key, value, updated_at) VALUES (?, ?, ?)",
                    (text_key, body[text_key].strip(), now),
                )

        conn.commit()
        return JSONResponse(
            {
                "success": True,
                "message_ar": "تم حفظ الإعدادات وتحديث سعر التوصيل بنجاح",
                "message_en": "Settings and delivery fee saved successfully",
                "settings": get_store_settings(conn),
            }
        )
    finally:
        conn.close()


async def api_admin_discounts(request: Request) -> JSONResponse:
    if not verify_admin_request(request):
        return JSONResponse({"error_en": "Unauthorized"}, status_code=401)

    conn = get_connection()
    try:
        if request.method == "GET":
            rows = conn.execute("SELECT * FROM discount_codes ORDER BY id DESC").fetchall()
            return JSONResponse({"discounts": [dict(r) for r in rows]})

        body = await request.json()
        code = re.sub(r"\s+", "", (body.get("code") or "").strip().upper())
        discount_type = (body.get("discount_type") or "percentage").strip()
        try:
            discount_value = round(float(body.get("discount_value", 0)), 2)
            min_order_amount = round(float(body.get("min_order_amount", 0) or 0), 2)
        except (ValueError, TypeError):
            return JSONResponse(
                {"error_ar": "قيمة الخصم غير صالحة", "error_en": "Invalid discount value"},
                status_code=400,
            )

        usage_limit = body.get("usage_limit")
        if usage_limit in ("", None):
            usage_limit = None
        else:
            try:
                usage_limit = int(usage_limit)
                if usage_limit <= 0:
                    usage_limit = None
            except (ValueError, TypeError):
                usage_limit = None

        expiry_date = (body.get("expiry_date") or "").strip() or None
        is_active = 1 if body.get("is_active", True) else 0

        if not code or len(code) < 2:
            return JSONResponse(
                {"error_ar": "يرجى إدخال كود خصم صالح", "error_en": "Please enter a valid code"},
                status_code=400,
            )

        if discount_type not in ("percentage", "fixed") or discount_value <= 0:
            return JSONResponse(
                {"error_ar": "نوع أو قيمة الخصم غير صالحة", "error_en": "Invalid discount type or value"},
                status_code=400,
            )

        if discount_type == "percentage" and discount_value > 100:
            return JSONResponse(
                {
                    "error_ar": "نسبة الخصم لا يمكن أن تتجاوز 100%",
                    "error_en": "Percentage discount cannot exceed 100%",
                },
                status_code=400,
            )

        exists = conn.execute(
            "SELECT id FROM discount_codes WHERE UPPER(code) = ?", (code,)
        ).fetchone()
        if exists:
            return JSONResponse(
                {"error_ar": "كود الخصم موجود بالفعل", "error_en": "Discount code already exists"},
                status_code=400,
            )

        now = utc_now_iso()
        cur = conn.execute(
            """
            INSERT INTO discount_codes (
                code, discount_type, discount_value, min_order_amount,
                expiry_date, usage_limit, used_count, is_active, created_at
            ) VALUES (?, ?, ?, ?, ?, ?, 0, ?, ?)
            """,
            (
                code,
                discount_type,
                discount_value,
                min_order_amount,
                expiry_date,
                usage_limit,
                is_active,
                now,
            ),
        )
        conn.commit()
        row = conn.execute(
            "SELECT * FROM discount_codes WHERE id = ?", (cur.lastrowid,)
        ).fetchone()
        return JSONResponse({"discount": dict(row)}, status_code=201)
    finally:
        conn.close()


async def api_admin_discount_detail(request: Request) -> JSONResponse:
    if not verify_admin_request(request):
        return JSONResponse({"error_en": "Unauthorized"}, status_code=401)

    did = int(request.path_params["id"])
    conn = get_connection()
    try:
        existing = conn.execute("SELECT * FROM discount_codes WHERE id = ?", (did,)).fetchone()
        if not existing:
            return JSONResponse({"error_en": "Discount code not found"}, status_code=404)

        if request.method == "DELETE":
            conn.execute("DELETE FROM discount_codes WHERE id = ?", (did,))
            conn.commit()
            return JSONResponse({"success": True})

        body = await request.json()
        code = re.sub(
            r"\s+", "", (body.get("code") or existing["code"]).strip().upper()
        )
        discount_type = body.get("discount_type") or existing["discount_type"]
        discount_value = round(
            float(body.get("discount_value", existing["discount_value"])), 2
        )
        min_order_amount = round(
            float(body.get("min_order_amount", existing["min_order_amount"]) or 0), 2
        )
        expiry_date = (
            body.get("expiry_date") if "expiry_date" in body else existing["expiry_date"]
        )
        if expiry_date == "":
            expiry_date = None

        usage_limit = (
            body.get("usage_limit") if "usage_limit" in body else existing["usage_limit"]
        )
        if usage_limit in ("", None):
            usage_limit = None
        else:
            usage_limit = int(usage_limit)

        is_active = (
            (1 if body["is_active"] else 0)
            if "is_active" in body
            else int(existing["is_active"])
        )

        conn.execute(
            """
            UPDATE discount_codes
            SET code = ?, discount_type = ?, discount_value = ?, min_order_amount = ?,
                expiry_date = ?, usage_limit = ?, is_active = ?
            WHERE id = ?
            """,
            (
                code,
                discount_type,
                discount_value,
                min_order_amount,
                expiry_date,
                usage_limit,
                is_active,
                did,
            ),
        )
        conn.commit()
        updated = conn.execute("SELECT * FROM discount_codes WHERE id = ?", (did,)).fetchone()
        return JSONResponse({"discount": dict(updated)})
    finally:
        conn.close()


async def api_admin_reviews(request: Request) -> JSONResponse:
    if not verify_admin_request(request):
        return JSONResponse({"error_en": "Unauthorized"}, status_code=401)

    conn = get_connection()
    try:
        rows = conn.execute(
            """
            SELECT r.*, p.name_ar AS product_name_ar, p.name_en AS product_name_en
            FROM reviews r
            LEFT JOIN products p ON p.id = r.product_id
            ORDER BY r.id DESC
            """
        ).fetchall()
        return JSONResponse({"reviews": [dict(r) for r in rows]})
    finally:
        conn.close()


async def api_admin_review_detail(request: Request) -> JSONResponse:
    if not verify_admin_request(request):
        return JSONResponse({"error_en": "Unauthorized"}, status_code=401)

    rid = int(request.path_params["id"])
    conn = get_connection()
    try:
        if request.method == "DELETE":
            conn.execute("DELETE FROM reviews WHERE id = ?", (rid,))
            conn.commit()
            return JSONResponse({"success": True})

        body = await request.json()
        status = (body.get("moderation_status") or "").strip()
        if status not in ("pending", "approved", "rejected"):
            return JSONResponse({"error_en": "Invalid moderation status"}, status_code=400)

        conn.execute(
            "UPDATE reviews SET moderation_status = ? WHERE id = ?", (status, rid)
        )
        conn.commit()
        row = conn.execute("SELECT * FROM reviews WHERE id = ?", (rid,)).fetchone()
        return JSONResponse({"review": dict(row) if row else None})
    finally:
        conn.close()


# ----------------------------------------------------------------------------
# SEO: SITEMAP.XML, ROBOTS.TXT, AND SERVER-SIDE HTML META INJECTION
# ----------------------------------------------------------------------------

async def sitemap_xml(request: Request) -> Response:
    base_url = get_base_url(request)
    conn = get_connection()
    try:
        prods = conn.execute(
            "SELECT slug, updated_at FROM products WHERE availability != 'disabled' ORDER BY id ASC"
        ).fetchall()
    finally:
        conn.close()

    now_date = utc_now_iso()[:10]
    static_paths = [
        ("/", "1.0", "daily"),
        ("/shop", "0.9", "daily"),
        ("/about", "0.7", "weekly"),
        ("/privacy", "0.4", "monthly"),
        ("/terms", "0.4", "monthly"),
    ]

    xml_lines = [
        '<?xml version="1.0" encoding="UTF-8"?>',
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">',
    ]

    for path, prio, freq in static_paths:
        full_url = f"{base_url}{path}"
        xml_lines.append("  <url>")
        xml_lines.append(f"    <loc>{html.escape(full_url)}</loc>")
        xml_lines.append(f"    <lastmod>{now_date}</lastmod>")
        xml_lines.append(f"    <changefreq>{freq}</changefreq>")
        xml_lines.append(f"    <priority>{prio}</priority>")
        xml_lines.append(
            f'    <xhtml:link rel="alternate" hreflang="ar" href="{html.escape(full_url)}?lang=ar" />'
        )
        xml_lines.append(
            f'    <xhtml:link rel="alternate" hreflang="en" href="{html.escape(full_url)}?lang=en" />'
        )
        xml_lines.append(
            f'    <xhtml:link rel="alternate" hreflang="x-default" href="{html.escape(full_url)}" />'
        )
        xml_lines.append("  </url>")

    for p in prods:
        p_url = f"{base_url}/product/{p['slug']}"
        lastmod = (p["updated_at"] or now_date)[:10]
        xml_lines.append("  <url>")
        xml_lines.append(f"    <loc>{html.escape(p_url)}</loc>")
        xml_lines.append(f"    <lastmod>{lastmod}</lastmod>")
        xml_lines.append("    <changefreq>weekly</changefreq>")
        xml_lines.append("    <priority>0.8</priority>")
        xml_lines.append(
            f'    <xhtml:link rel="alternate" hreflang="ar" href="{html.escape(p_url)}?lang=ar" />'
        )
        xml_lines.append(
            f'    <xhtml:link rel="alternate" hreflang="en" href="{html.escape(p_url)}?lang=en" />'
        )
        xml_lines.append(
            f'    <xhtml:link rel="alternate" hreflang="x-default" href="{html.escape(p_url)}" />'
        )
        xml_lines.append("  </url>")

    xml_lines.append("</urlset>")
    return Response("\n".join(xml_lines), media_type="application/xml; charset=utf-8")


async def robots_txt(request: Request) -> Response:
    base_url = get_base_url(request)
    txt = "\n".join(
        [
            "User-agent: *",
            "Allow: /",
            "Disallow: /admin",
            "Disallow: /api/",
            "Disallow: /order-confirmation/",
            f"Sitemap: {base_url}/sitemap.xml",
            "",
        ]
    )
    return Response(txt, media_type="text/plain; charset=utf-8")


def build_seo_context(request: Request) -> Dict[str, Any]:
    base_url = get_base_url(request)
    path = request.url.path
    lang = (request.query_params.get("lang") or "ar").lower()
    if lang not in ("ar", "en"):
        lang = "ar"

    default_title_ar = "الديزل باور (Diesel Power) | استلمها جديدة — مزيلات البقع والمنظفات"
    default_title_en = "Diesel Power | Receive It Like New — Stain Removers & Cleaning Products"
    default_desc_ar = (
        "الديزل باور هو براند منظفات بجودة قياسية لإزالة أصعب البقع من الملابس والسجاد "
        "والانتريهات وجميع أنواع المفروشات دون التأثير على الأقمشة وألوانها. أفضل جودة، أمان عالي، سعر معقول."
    )
    default_desc_en = (
        "Diesel Power is a high-standard Egyptian cleaning brand designed to remove stubborn "
        "stains from clothing, carpets, sofas, and upholstery while helping preserve fabrics and colors."
    )

    title_ar = default_title_ar
    title_en = default_title_en
    desc_ar = default_desc_ar
    desc_en = default_desc_en
    og_image = f"{base_url}/static/images/logo.png"
    og_type = "website"
    canonical_url = f"{base_url}{path}"
    robots_meta = "index, follow"

    conn = get_connection()
    try:
        settings = get_store_settings(conn)
        all_prods_rows = conn.execute(
            "SELECT * FROM products WHERE availability != 'disabled' ORDER BY id ASC"
        ).fetchall()
        all_prods = [format_product_row(r) for r in all_prods_rows]

        json_ld_list: List[Dict[str, Any]] = [
            {
                "@context": "https://schema.org",
                "@type": "Organization",
                "name": "Diesel Power - الديزل باور",
                "alternateName": "الديزل باور",
                "slogan": "استلمها جديدة",
                "url": base_url,
                "logo": f"{base_url}/static/images/logo.png",
                "description": default_desc_ar,
                "telephone": "+201013514594",
                "address": {
                    "@type": "PostalAddress",
                    "streetAddress": settings.get("address_ar"),
                    "addressLocality": "شبرا الخيمة",
                    "addressCountry": "EG",
                },
                "sameAs": [settings.get("facebook_url")],
            },
            {
                "@context": "https://schema.org",
                "@type": "WebSite",
                "name": "Diesel Power - الديزل باور",
                "url": base_url,
                "potentialAction": {
                    "@type": "SearchAction",
                    "target": f"{base_url}/shop?q={{search_term_string}}",
                    "query-input": "required name=search_term_string",
                },
            },
        ]

        if path == "/shop":
            title_ar = "تسوق منتجات الديزل باور | مزيلات البقع — Diesel Power"
            title_en = "Shop Diesel Power Stain Removers | Official Store"
            desc_ar = "تصفح جميع مزيلات البقع من الديزل باور (الصدأ، الزيوت والشحوم، الحبر، الدم والميك آب، الفاكهة والقهوة والشاي) بحجم 220 مل والدفع عند الاستلام."
            desc_en = "Browse all Diesel Power 220 ml stain removers (Rust, Oil & Grease, Ink, Blood & Makeup, Fruit, Coffee & Tea) with Cash on Delivery."
        elif path == "/about":
            title_ar = "من نحن | الديزل باور (Diesel Power) — استلمها جديدة"
            title_en = "About Us | Diesel Power — Effective Stain Removal & Fabric Care"
            desc_ar = "تعرف على الديزل باور: أفضل جودة، أمان عالي، سعر معقول لإزالة أصعب البقع من الملابس والمفروشات دون التأثير على الأقمشة وألوانها."
            desc_en = "Learn about Diesel Power: high quality, fabric care, and reasonable prices for tackling tough household stains."
        elif path == "/cart":
            title_ar = "سلة التسوق | الديزل باور — Diesel Power"
            title_en = "Shopping Cart | Diesel Power"
            robots_meta = "noindex, follow"
        elif path == "/checkout":
            title_ar = "إتمام الطلب والدفع عند الاستلام | الديزل باور — Diesel Power"
            title_en = "Checkout (Cash on Delivery) | Diesel Power"
            robots_meta = "noindex, follow"
        elif path == "/wishlist":
            title_ar = "المفضلة | الديزل باور — Diesel Power"
            title_en = "Wishlist | Diesel Power"
            robots_meta = "noindex, follow"
        elif path == "/privacy":
            title_ar = "سياسة الخصوصية | الديزل باور — Diesel Power"
            title_en = "Privacy Policy | Diesel Power"
        elif path == "/terms":
            title_ar = "الشروط والأحكام | الديزل باور — Diesel Power"
            title_en = "Terms & Conditions | Diesel Power"
        elif path.startswith("/order-confirmation"):
            title_ar = "تأكيد الطلب | الديزل باور — Diesel Power"
            title_en = "Order Confirmation | Diesel Power"
            robots_meta = "noindex, nofollow"
        elif path.startswith("/admin"):
            title_ar = "لوحة التحكم | الديزل باور — Diesel Power Admin"
            title_en = "Admin Dashboard | Diesel Power"
            robots_meta = "noindex, nofollow"
        elif path.startswith("/product/"):
            slug = path.split("/product/", 1)[1].strip("/")
            prod_row = conn.execute(
                "SELECT * FROM products WHERE slug = ? AND availability != 'disabled'",
                (slug,),
            ).fetchone()
            if prod_row:
                revs = [
                    dict(r)
                    for r in conn.execute(
                        "SELECT * FROM reviews WHERE product_id = ? AND moderation_status = 'approved'",
                        (prod_row["id"],),
                    ).fetchall()
                ]
                prod = format_product_row(prod_row, revs)
                title_ar = f"{prod['name_ar']} ({prod['size']}) | الديزل باور — Diesel Power"
                title_en = f"{prod['name_en']} ({prod['size']}) | Diesel Power"
                desc_ar = prod["description_ar"]
                desc_en = prod["description_en"]
                if prod["images"]:
                    img_path = prod["images"][0]
                    og_image = (
                        img_path
                        if img_path.startswith("http")
                        else f"{base_url}{img_path}"
                    )
                og_type = "product"
                canonical_url = f"{base_url}/product/{prod['slug']}"

                product_ld: Dict[str, Any] = {
                    "@context": "https://schema.org",
                    "@type": "Product",
                    "name": prod["name_ar"] if lang == "ar" else prod["name_en"],
                    "alternateName": prod["name_en"] if lang == "ar" else prod["name_ar"],
                    "description": prod["description_ar"] if lang == "ar" else prod["description_en"],
                    "image": [og_image],
                    "sku": f"DP-{prod['id']}",
                    "brand": {
                        "@type": "Brand",
                        "name": "Diesel Power",
                    },
                    "category": prod["category_ar"] if lang == "ar" else prod["category_en"],
                    "offers": {
                        "@type": "Offer",
                        "url": canonical_url,
                        "priceCurrency": "EGP",
                        "price": f"{prod['current_price']:.2f}",
                        "availability": (
                            "https://schema.org/InStock"
                            if prod["in_stock"]
                            else "https://schema.org/OutOfStock"
                        ),
                        "itemCondition": "https://schema.org/NewCondition",
                    },
                }
                if prod.get("review_count", 0) > 0:
                    product_ld["aggregateRating"] = {
                        "@type": "AggregateRating",
                        "ratingValue": str(prod["average_rating"]),
                        "reviewCount": str(prod["review_count"]),
                    }
                json_ld_list.append(product_ld)
    finally:
        conn.close()

    active_title = title_ar if lang == "ar" else title_en
    active_desc = desc_ar if lang == "ar" else desc_en

    return {
        "lang": lang,
        "dir": "rtl" if lang == "ar" else "ltr",
        "title": active_title,
        "description": active_desc,
        "canonical_url": canonical_url,
        "hreflang_ar": f"{canonical_url}?lang=ar",
        "hreflang_en": f"{canonical_url}?lang=en",
        "og_image": og_image,
        "og_type": og_type,
        "robots": robots_meta,
        "json_ld": json.dumps(json_ld_list, ensure_ascii=False),
    }


async def serve_spa_page(request: Request) -> HTMLResponse:
    template_path = os.path.join(BASE_DIR, "templates", "index.html")
    with open(template_path, "r", encoding="utf-8") as f:
        html_content = f.read()

    seo = build_seo_context(request)
    replacements = {
        "__HTML_LANG__": html.escape(seo["lang"]),
        "__HTML_DIR__": html.escape(seo["dir"]),
        "__SEO_TITLE__": html.escape(seo["title"]),
        "__SEO_DESCRIPTION__": html.escape(seo["description"]),
        "__SEO_CANONICAL__": html.escape(seo["canonical_url"]),
        "__SEO_HREFLANG_AR__": html.escape(seo["hreflang_ar"]),
        "__SEO_HREFLANG_EN__": html.escape(seo["hreflang_en"]),
        "__SEO_OG_IMAGE__": html.escape(seo["og_image"]),
        "__SEO_OG_TYPE__": html.escape(seo["og_type"]),
        "__SEO_ROBOTS__": html.escape(seo["robots"]),
        "__SEO_JSON_LD__": seo["json_ld"],
    }
    for placeholder, val in replacements.items():
        html_content = html_content.replace(placeholder, val)

    return HTMLResponse(html_content)


init_db()

routes = [
    # Public APIs
    Route("/api/bootstrap", api_bootstrap, methods=["GET"]),
    Route("/api/products", api_list_products, methods=["GET"]),
    Route("/api/products/{slug_or_id}", api_get_product, methods=["GET"]),
    Route("/api/products/{product_id:int}/reviews", api_submit_review, methods=["POST"]),
    Route("/api/cart/calculate", api_calculate_cart, methods=["POST"]),
    Route("/api/orders", api_create_order, methods=["POST"]),
    Route("/api/orders/{order_number}", api_get_order_by_number, methods=["GET"]),
    # Admin APIs
    Route("/api/admin/login", api_admin_login, methods=["POST"]),
    Route("/api/admin/logout", api_admin_logout, methods=["POST"]),
    Route("/api/admin/me", api_admin_me, methods=["GET"]),
    Route("/api/admin/overview", api_admin_overview, methods=["GET"]),
    Route("/api/admin/products", api_admin_products, methods=["GET", "POST"]),
    Route("/api/admin/products/{id:int}", api_admin_product_detail, methods=["PUT", "DELETE"]),
    Route("/api/admin/upload", api_admin_upload_image, methods=["POST"]),
    Route("/api/admin/orders", api_admin_orders, methods=["GET"]),
    Route("/api/admin/orders/export", api_admin_orders_export, methods=["GET"]),
    Route("/api/admin/orders/{id:int}", api_admin_order_detail, methods=["GET", "PUT"]),
    Route("/api/admin/settings", api_admin_settings, methods=["GET", "PUT"]),
    Route("/api/admin/discounts", api_admin_discounts, methods=["GET", "POST"]),
    Route("/api/admin/discounts/{id:int}", api_admin_discount_detail, methods=["PUT", "DELETE"]),
    Route("/api/admin/reviews", api_admin_reviews, methods=["GET"]),
    Route("/api/admin/reviews/{id:int}", api_admin_review_detail, methods=["PUT", "DELETE"]),
    # SEO files
    Route("/sitemap.xml", sitemap_xml, methods=["GET"]),
    Route("/robots.txt", robots_txt, methods=["GET"]),
    # Static files
    Mount("/static", StaticFiles(directory=os.path.join(BASE_DIR, "static")), name="static"),
    # Customer & Admin HTML routes
    Route("/", serve_spa_page, methods=["GET"]),
    Route("/shop", serve_spa_page, methods=["GET"]),
    Route("/product/{slug}", serve_spa_page, methods=["GET"]),
    Route("/about", serve_spa_page, methods=["GET"]),
    Route("/wishlist", serve_spa_page, methods=["GET"]),
    Route("/cart", serve_spa_page, methods=["GET"]),
    Route("/checkout", serve_spa_page, methods=["GET"]),
    Route("/order-confirmation/{order_number}", serve_spa_page, methods=["GET"]),
    Route("/privacy", serve_spa_page, methods=["GET"]),
    Route("/terms", serve_spa_page, methods=["GET"]),
    Route("/admin", serve_spa_page, methods=["GET"]),
    Route("/admin/{subpath:path}", serve_spa_page, methods=["GET"]),
]

app = Starlette(debug=False, routes=routes)

if __name__ == "__main__":
    import uvicorn

    port = int(os.environ.get("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)
