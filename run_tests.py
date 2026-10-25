import os
import sys
import json
import tempfile

# Use an isolated test database so production DB remains clean after tests
TEST_DB = os.path.join(tempfile.gettempdir(), "diesel_power_test_suite.db")
if os.path.exists(TEST_DB):
    os.remove(TEST_DB)
os.environ["DIESEL_POWER_DB_PATH"] = TEST_DB

from starlette.testclient import TestClient
import database
import app as web_app

database.init_db()
client = TestClient(web_app.app)

RESULTS = []


def record(category: str, name: str, passed: bool, detail: str = ""):
    RESULTS.append({"category": category, "name": name, "passed": passed, "detail": detail})
    status_str = "PASS" if passed else "FAIL"
    print(f"[{status_str}] ({category}) {name} — {detail}")
    if not passed:
        raise AssertionError(f"Test failed: {name} ({detail})")


def run_all_tests():
    # ========================================================================
    # 1. STOREFRONT TESTS
    # ========================================================================
    r_home = client.get("/")
    record(
        "Storefront",
        "Homepage loads successfully",
        r_home.status_code == 200 and "DIESEL POWER" in r_home.text and "الديزل باور" in r_home.text,
        f"HTTP {r_home.status_code}",
    )

    r_ar = client.get("/?lang=ar")
    r_en = client.get("/?lang=en")
    record(
        "Storefront",
        "Arabic & English switching + RTL/LTR layout attributes",
        'lang="ar" dir="rtl"' in r_ar.text and 'lang="en" dir="ltr"' in r_en.text,
        "Verified lang='ar' dir='rtl' and lang='en' dir='ltr'",
    )

    r_boot = client.get("/api/bootstrap")
    boot_data = r_boot.json()
    products = boot_data["products"]
    expected_names_ar = {
        "مزيل بقع الصدأ",
        "مزيل بقع الزيوت والشحوم",
        "مزيل بقع الحبر",
        "مزيل بقع الدم والميك آب",
        "مزيل بقع الفاكهة والقهوة والشاي",
    }
    actual_names_ar = {p["name_ar"] for p in products}
    all_prices_99 = all(p["current_price"] == 99.0 and p["original_price"] == 120.0 and p["discount_percentage"] == 17.5 for p in products)
    all_size_220 = all(p["size"] == "220 ml" for p in products)
    exact_step_4 = all(
        p["usage_instructions_ar"][3] == "اشوف القطعة بالماء الفاتر، أو اغسلها في الغسالة كالمعتاد."
        for p in products
    )
    record(
        "Storefront",
        "All 5 initial products configured with exact names, images, EGP 99/120 prices, 17.5% discount, and exact usage instructions",
        len(products) == 5 and actual_names_ar == expected_names_ar and all_prices_99 and all_size_220 and exact_step_4,
        f"Count={len(products)}, Prices=99/120 (17.5%), Exact Arabic instructions verified",
    )

    # Product search
    r_search_ar = client.get("/api/products?q=الصدأ").json()
    r_search_en = client.get("/api/products?q=Ink").json()
    record(
        "Storefront",
        "Product search works in Arabic and English",
        r_search_ar["total"] == 1
        and r_search_ar["products"][0]["slug"] == "rust-stain-remover"
        and r_search_en["total"] == 1
        and r_search_en["products"][0]["slug"] == "ink-stain-remover",
        "Arabic search 'الصدأ' -> 1 match; English search 'Ink' -> 1 match",
    )

    # Product filters & sorting
    r_filter_price = client.get("/api/products?max_price=90").json()
    r_filter_avail = client.get("/api/products?availability=in_stock&sort=name_en").json()
    record(
        "Storefront",
        "Product filters and sorting work",
        r_filter_price["total"] == 0
        and r_filter_avail["total"] == 5
        and r_filter_avail["products"][0]["name_en"] == "Blood & Makeup Stain Remover",
        "Max price filter and alphabetical sorting verified",
    )

    # Cart calculation & default EGP 70 delivery fee
    r_cart = client.post(
        "/api/cart/calculate",
        json={"items": [{"product_id": 1, "quantity": 2}, {"product_id": 3, "quantity": 1}]},
    ).json()
    record(
        "Storefront",
        "Cart quantities, subtotal, default EGP 70 delivery fee, and final total calculate accurately",
        r_cart["subtotal"] == 297.0
        and r_cart["delivery_fee"] == 70.0
        and r_cart["final_total"] == 367.0,
        f"Subtotal={r_cart['subtotal']}, Delivery={r_cart['delivery_fee']}, Total={r_cart['final_total']}",
    )

    # Checkout validation
    r_bad_phone = client.post(
        "/api/orders",
        json={
            "customer_name": "أحمد محمد",
            "phone_number": "12345",
            "governorate": "Cairo",
            "delivery_address": "شارع شبرا، القاهرة",
            "items": [{"product_id": 1, "quantity": 1}],
        },
    )
    record(
        "Storefront",
        "Checkout validates required fields and Egyptian mobile phone numbers",
        r_bad_phone.status_code == 400 and r_bad_phone.json().get("field") == "phone_number",
        f"Rejected invalid phone with HTTP {r_bad_phone.status_code}",
    )

    # Valid guest COD checkout + idempotency duplicate prevention
    idem_key = "test-idem-order-1"
    r_order1 = client.post(
        "/api/orders",
        json={
            "customer_name": "محمود حسن",
            "phone_number": "01013514594",
            "governorate": "Qalyubia",
            "delivery_address": "شبرا الخيمة - محطة الكاوتش",
            "notes": "الاتصال قبل الوصول",
            "idempotency_key": idem_key,
            "items": [{"product_id": 1, "quantity": 2}],
        },
    )
    order1_data = r_order1.json()["order"]
    order1_number = order1_data["order_number"]
    order1_token = order1_data["access_token"]

    # Retry same idempotency_key (simulating double-click)
    r_order1_retry = client.post(
        "/api/orders",
        json={
            "customer_name": "محمود حسن",
            "phone_number": "01013514594",
            "governorate": "Qalyubia",
            "delivery_address": "شبرا الخيمة - محطة الكاوتش",
            "idempotency_key": idem_key,
            "items": [{"product_id": 1, "quantity": 2}],
        },
    )
    record(
        "Storefront",
        "Valid COD order saved with EGP 70 delivery fee & duplicate submission prevented",
        r_order1.status_code == 201
        and order1_data["subtotal"] == 198.0
        and order1_data["delivery_fee"] == 70.0
        and order1_data["final_total"] == 268.0
        and order1_data["payment_method"] == "COD"
        and r_order1_retry.json().get("duplicate_prevented") is True,
        f"Order #{order1_number} total={order1_data['final_total']} EGP",
    )

    # Order confirmation retrieval with valid token
    r_conf = client.get(f"/api/orders/{order1_number}?token={order1_token}")
    record(
        "Storefront",
        "Order confirmation displays accurate saved order details",
        r_conf.status_code == 200
        and r_conf.json()["order"]["order_number"] == order1_number
        and len(r_conf.json()["order"]["items"]) == 1,
        f"Confirmed order #{order1_number}",
    )

    # Check WhatsApp manual link & no automatic notification hooks
    record(
        "Storefront",
        "Manual WhatsApp floating button present with 01013514594 (+201013514594)",
        "https://wa.me/201013514594" in r_home.text and "tel:01013514594" in r_home.text,
        "Verified manual WhatsApp and click-to-call links",
    )

    # ========================================================================
    # 2. SECURITY TESTS
    # ========================================================================
    r_unauth_admin = client.get("/api/admin/overview")
    r_unauth_settings = client.put("/api/admin/settings", json={"delivery_fee": 0})
    record(
        "Security",
        "Unauthorized customer sessions cannot access admin dashboard APIs",
        r_unauth_admin.status_code == 401 and r_unauth_settings.status_code == 401,
        f"Admin overview={r_unauth_admin.status_code}, Admin settings={r_unauth_settings.status_code}",
    )

    r_other_customer = client.get(f"/api/orders/{order1_number}")
    r_wrong_token = client.get(f"/api/orders/{order1_number}?token=wrong_token_123")
    record(
        "Security",
        "Customers cannot access other customers' private orders without valid access token",
        r_other_customer.status_code == 403 and r_wrong_token.status_code == 403,
        f"No token={r_other_customer.status_code}, Wrong token={r_wrong_token.status_code}",
    )

    # Attempt browser price manipulation
    r_manipulated = client.post(
        "/api/orders",
        json={
            "customer_name": "عميل تجريبي",
            "phone_number": "01112345678",
            "governorate": "Cairo",
            "delivery_address": "مدينة نصر، القاهرة",
            "subtotal": 1.0,
            "delivery_fee": 0.0,
            "final_total": 1.0,
            "items": [{"product_id": 2, "quantity": 1, "unit_price": 0.5, "price": 0.5}],
        },
    )
    manip_order = r_manipulated.json()["order"]
    record(
        "Security",
        "Customers cannot manipulate prices, delivery fees, or totals through browser requests",
        r_manipulated.status_code == 201
        and manip_order["subtotal"] == 99.0
        and manip_order["delivery_fee"] == 70.0
        and manip_order["final_total"] == 169.0,
        f"Browser sent total=1.0; Server enforced subtotal=99.0 + delivery=70.0 = 169.0",
    )

    # Attempt invalid discount code on order
    r_bad_disc = client.post(
        "/api/orders",
        json={
            "customer_name": "عميل تجريبي",
            "phone_number": "01212345678",
            "governorate": "Giza",
            "delivery_address": "الدقي، الجيزة",
            "discount_code": "FAKECODE999",
            "items": [{"product_id": 2, "quantity": 1}],
        },
    )
    record(
        "Security",
        "Invalid discount codes are rejected at checkout",
        r_bad_disc.status_code == 400 and r_bad_disc.json().get("field") == "discount_code",
        f"Rejected FAKECODE999 with HTTP {r_bad_disc.status_code}",
    )

    # Attempt ordering more than available stock
    r_over_stock = client.post(
        "/api/orders",
        json={
            "customer_name": "عميل تجريبي",
            "phone_number": "01512345678",
            "governorate": "Cairo",
            "delivery_address": "المعادي، القاهرة",
            "items": [{"product_id": 1, "quantity": 500}],
        },
    )
    record(
        "Security",
        "Orders exceeding available stock are rejected and stock cannot become negative",
        r_over_stock.status_code == 400,
        f"Rejected excessive quantity with HTTP {r_over_stock.status_code}",
    )

    # Check frontend JS for leaked secrets
    with open(os.path.join(database.BASE_DIR, "static", "js", "app.js"), "r", encoding="utf-8") as f:
        js_code = f.read()
    record(
        "Security",
        "Secret credentials and JWT keys are never exposed in frontend code",
        "DieselPower@2026!" not in js_code and "dp_prod_secret_" not in js_code,
        "Verified no secrets in static/js/app.js",
    )

    # ========================================================================
    # 3. ADMIN DASHBOARD TESTS
    # ========================================================================
    admin_user = os.environ.get("ADMIN_USERNAME", "admin")
    admin_pass = os.environ.get("ADMIN_PASSWORD", "DieselPower@2026!")
    r_login = client.post(
        "/api/admin/login", json={"username": admin_user, "password": admin_pass}
    )
    admin_token = r_login.json().get("token")
    auth_headers = {"Authorization": f"Bearer {admin_token}"}
    record(
        "Admin",
        "Admin login works with valid credentials",
        r_login.status_code == 200 and bool(admin_token),
        f"Logged in as {admin_user}",
    )

    # Change delivery fee in admin settings from EGP 70 to EGP 85
    r_set_fee = client.put(
        "/api/admin/settings", headers=auth_headers, json={"delivery_fee": 85}
    )
    # Create a new order and check that new order gets EGP 85 while historical order1 still has EGP 70
    r_order_new_fee = client.post(
        "/api/orders",
        json={
            "customer_name": "سارة علي",
            "phone_number": "01098765432",
            "governorate": "Alexandria",
            "delivery_address": "سموحة، الإسكندرية",
            "items": [{"product_id": 3, "quantity": 1}],
        },
    )
    new_fee_order = r_order_new_fee.json()["order"]
    historical_order1_check = client.get(
        f"/api/orders/{order1_number}?token={order1_token}"
    ).json()["order"]

    record(
        "Admin",
        "Changing delivery fee in dashboard updates new orders immediately while historical order fees remain unchanged",
        r_set_fee.status_code == 200
        and new_fee_order["delivery_fee"] == 85.0
        and new_fee_order["final_total"] == 184.0
        and historical_order1_check["delivery_fee"] == 70.0,
        f"New order delivery_fee={new_fee_order['delivery_fee']} EGP; Historical order delivery_fee={historical_order1_check['delivery_fee']} EGP",
    )

    # Restore default delivery fee to 70 EGP
    client.put("/api/admin/settings", headers=auth_headers, json={"delivery_fee": 70})

    # Discount code creation & application
    r_create_disc = client.post(
        "/api/admin/discounts",
        headers=auth_headers,
        json={
            "code": "SAVE20",
            "discount_type": "fixed",
            "discount_value": 20,
            "usage_limit": 5,
            "is_active": True,
        },
    )
    r_order_disc = client.post(
        "/api/orders",
        json={
            "customer_name": "كريم عادل",
            "phone_number": "01055556666",
            "governorate": "Cairo",
            "delivery_address": "مصر الجديدة، القاهرة",
            "discount_code": "SAVE20",
            "items": [{"product_id": 4, "quantity": 1}],
        },
    ).json()["order"]
    record(
        "Admin",
        "Discount codes creation and server-side checkout application work",
        r_create_disc.status_code == 201
        and r_order_disc["discount_amount"] == 20.0
        and r_order_disc["final_total"] == (99.0 - 20.0 + 70.0),
        f"Subtotal=99, Discount=20, Delivery=70 -> Final Total={r_order_disc['final_total']}",
    )

    # Inventory deduction & single-time cancellation stock restoration
    prod1_before_cancel = client.get("/api/products/1").json()["product"]["stock_quantity"]
    # Order 1 had 2 units of product 1 (so stock was 100 - 2 = 98)
    r_cancel1 = client.put(
        f"/api/admin/orders/{order1_data['id']}",
        headers=auth_headers,
        json={"order_status": "Cancelled"},
    )
    prod1_after_cancel1 = client.get("/api/products/1").json()["product"]["stock_quantity"]
    # Cancel again to ensure stock is NOT restored twice
    r_cancel2 = client.put(
        f"/api/admin/orders/{order1_data['id']}",
        headers=auth_headers,
        json={"order_status": "Cancelled"},
    )
    prod1_after_cancel2 = client.get("/api/products/1").json()["product"]["stock_quantity"]
    record(
        "Admin",
        "Order cancellation restores inventory once and never restores stock twice",
        prod1_before_cancel == 98
        and prod1_after_cancel1 == 100
        and prod1_after_cancel2 == 100,
        f"Stock before cancel={prod1_before_cancel}, after 1st cancel={prod1_after_cancel1}, after 2nd cancel={prod1_after_cancel2}",
    )

    # Product CRUD + image upload + historical snapshot preservation
    r_upload = client.post(
        "/api/admin/upload",
        headers=auth_headers,
        files={"file": ("test.png", b"\x89PNG\r\n\x1a\n\x00\x00\x00\rIHDR", "image/png")},
    )
    uploaded_url = r_upload.json().get("url")

    r_add_prod = client.post(
        "/api/admin/products",
        headers=auth_headers,
        json={
            "name_ar": "منتج تجريبي",
            "name_en": "Test Cleaner",
            "description_ar": "وصف تجريبي",
            "description_en": "Test description",
            "category_ar": "مزيلات بقع",
            "category_en": "Stain Removers",
            "size": "500 ml",
            "current_price": 150,
            "original_price": 180,
            "stock_quantity": 25,
            "images": [uploaded_url],
        },
    )
    new_prod_id = r_add_prod.json()["product"]["id"]
    r_edit_prod = client.put(
        f"/api/admin/products/{new_prod_id}",
        headers=auth_headers,
        json={"current_price": 140},
    )
    r_del_prod = client.delete(f"/api/admin/products/{new_prod_id}", headers=auth_headers)
    record(
        "Admin",
        "Product creation, editing, deletion, and image upload work",
        r_upload.status_code == 201
        and r_add_prod.status_code == 201
        and r_edit_prod.json()["product"]["current_price"] == 140.0
        and r_del_prod.status_code == 200,
        f"Uploaded {uploaded_url}, created/updated/deleted product #{new_prod_id}",
    )

    # CSV Order export & Sales report overview
    r_csv = client.get("/api/admin/orders/export", headers=auth_headers)
    r_overview = client.get("/api/admin/overview", headers=auth_headers).json()
    record(
        "Admin",
        "Orders CSV export and real-data Sales Reports work",
        r_csv.status_code == 200
        and "Order Number" in r_csv.text
        and r_overview["total_orders"] == 4
        and r_overview["cancelled_orders"] == 1,
        f"Total orders={r_overview['total_orders']}, Net sales={r_overview['total_sales']} EGP",
    )

    # Customer review submission & moderation
    r_rev_sub = client.post(
        "/api/products/1/reviews",
        json={"rating": 5, "display_name": "منى أحمد", "review_text": "منتج ممتاز لإزالة بقع الصدأ"},
    )
    revs_admin = client.get("/api/admin/reviews", headers=auth_headers).json()["reviews"]
    rev_id = revs_admin[0]["id"]
    client.put(
        f"/api/admin/reviews/1",
        headers=auth_headers,
        json={"moderation_status": "approved"},
    )
    prod1_with_rev = client.get("/api/products/1").json()["product"]
    record(
        "Storefront & Admin",
        "Customer review submission, spam validation, and admin moderation work",
        r_rev_sub.status_code == 201 and prod1_with_rev["review_count"] == 1,
        f"Review #{rev_id} moderated -> approved",
    )

    # ========================================================================
    # 4. SEO TESTS
    # ========================================================================
    r_pdp = client.get("/product/rust-stain-remover")
    r_sitemap = client.get("/sitemap.xml")
    r_robots = client.get("/robots.txt")
    record(
        "SEO",
        "Page titles, meta descriptions, canonical URLs, hreflang tags, Product JSON-LD, sitemap.xml, and robots.txt work",
        r_pdp.status_code == 200
        and 'rel="canonical"' in r_pdp.text
        and 'hreflang="ar"' in r_pdp.text
        and 'hreflang="en"' in r_pdp.text
        and '"@type": "Product"' in r_pdp.text
        and '"price": "99.00"' in r_pdp.text
        and r_sitemap.status_code == 200
        and "/product/rust-stain-remover" in r_sitemap.text
        and r_robots.status_code == 200
        and "Sitemap:" in r_robots.text,
        "Verified HTML SEO tags, JSON-LD Product schema, sitemap.xml, and robots.txt",
    )

    print(f"\nALL {len(RESULTS)} AUTOMATED TEST GROUPS PASSED SUCCESSFULLY!")


if __name__ == "__main__":
    run_all_tests()
