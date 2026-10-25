import os
import json
import sqlite3
import hashlib
import secrets
from datetime import datetime, timezone
from typing import Dict, Any, List, Optional, Tuple

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DB_PATH = os.environ.get("DIESEL_POWER_DB_PATH", os.path.join(BASE_DIR, "diesel_power.db"))
ENV_PATH = os.path.join(BASE_DIR, ".env")


def load_dotenv_file():
    if os.path.exists(ENV_PATH):
        with open(ENV_PATH, "r", encoding="utf-8") as f:
            for line in f:
                line = line.strip()
                if not line or line.startswith("#") or "=" not in line:
                    continue
                k, v = line.split("=", 1)
                k = k.strip()
                v = v.strip().strip('"').strip("'")
                if k not in os.environ:
                    os.environ[k] = v


load_dotenv_file()

EXACT_USAGE_AR = [
    "بلل المنطقة الملطخة بالماء الساخن.",
    "ضع بضع قطرات من الديزل باور مباشرة على البقعة.",
    "اترك المنتج ل٣٠ ثانية ثم افرك البقعة برفق باستخدام فرشاة ناعمة.",
    "اشوف القطعة بالماء الفاتر، أو اغسلها في الغسالة كالمعتاد.",
]

EXACT_USAGE_EN = [
    "Wet the stained area with hot water.",
    "Apply a few drops of Diesel Power directly onto the stain.",
    "Leave the product for 30 seconds, then gently scrub the stain using a soft brush.",
    "Rinse the item with lukewarm water, or wash it in the washing machine as usual.",
]

GENERAL_DESCRIPTION_AR = (
    "الديزل باور مزيل بقع فائق القوة، صمم لإزالة أصعب البقع من الملابس والمنسوجات "
    "بفضل تركيبته المتطورة التي تعمل على تفكيك البقع بفعالية، مع الحفاظ على الأقمشة "
    "والألوان عند استخدامه وفقا للتعليمات."
)

INITIAL_PRODUCTS = [
    {
        "slug": "rust-stain-remover",
        "name_ar": "مزيل بقع الصدأ",
        "name_en": "Rust Stain Remover",
        "description_ar": GENERAL_DESCRIPTION_AR,
        "description_en": (
            "Diesel Power Rust Stain Remover is designed to tackle stubborn rust stains on "
            "clothing and textiles. Its formula helps break down stains while helping preserve "
            "fabrics and colors when used according to the instructions."
        ),
        "category_ar": "مزيلات بقع",
        "category_en": "Stain Removers",
        "size": "220 ml",
        "current_price": 99.0,
        "original_price": 120.0,
        "images": ["/static/images/product-rust.jpg"],
        "stock_quantity": 100,
        "availability": "in_stock",
        "usage_instructions_ar": EXACT_USAGE_AR,
        "usage_instructions_en": EXACT_USAGE_EN,
    },
    {
        "slug": "oil-and-grease-stain-remover",
        "name_ar": "مزيل بقع الزيوت والشحوم",
        "name_en": "Oil & Grease Stain Remover",
        "description_ar": GENERAL_DESCRIPTION_AR,
        "description_en": (
            "Diesel Power Oil & Grease Stain Remover is designed to tackle stubborn oil and "
            "grease stains on clothing and textiles. Its formula helps break down stains while "
            "helping preserve fabrics and colors when used according to the instructions."
        ),
        "category_ar": "مزيلات بقع",
        "category_en": "Stain Removers",
        "size": "220 ml",
        "current_price": 99.0,
        "original_price": 120.0,
        "images": ["/static/images/product-oil-grease.jpg"],
        "stock_quantity": 100,
        "availability": "in_stock",
        "usage_instructions_ar": EXACT_USAGE_AR,
        "usage_instructions_en": EXACT_USAGE_EN,
    },
    {
        "slug": "ink-stain-remover",
        "name_ar": "مزيل بقع الحبر",
        "name_en": "Ink Stain Remover",
        "description_ar": GENERAL_DESCRIPTION_AR,
        "description_en": (
            "Diesel Power Ink Stain Remover is designed to tackle stubborn ink stains on "
            "clothing and textiles. Its formula helps break down stains while helping preserve "
            "fabrics and colors when used according to the instructions."
        ),
        "category_ar": "مزيلات بقع",
        "category_en": "Stain Removers",
        "size": "220 ml",
        "current_price": 99.0,
        "original_price": 120.0,
        "images": ["/static/images/product-ink.jpg"],
        "stock_quantity": 100,
        "availability": "in_stock",
        "usage_instructions_ar": EXACT_USAGE_AR,
        "usage_instructions_en": EXACT_USAGE_EN,
    },
    {
        "slug": "blood-and-makeup-stain-remover",
        "name_ar": "مزيل بقع الدم والميك آب",
        "name_en": "Blood & Makeup Stain Remover",
        "description_ar": GENERAL_DESCRIPTION_AR,
        "description_en": (
            "Diesel Power Blood & Makeup Stain Remover is designed to tackle stubborn blood and "
            "makeup stains on clothing and textiles. Its formula helps break down stains while "
            "helping preserve fabrics and colors when used according to the instructions."
        ),
        "category_ar": "مزيلات بقع",
        "category_en": "Stain Removers",
        "size": "220 ml",
        "current_price": 99.0,
        "original_price": 120.0,
        "images": ["/static/images/product-blood-makeup.jpg"],
        "stock_quantity": 100,
        "availability": "in_stock",
        "usage_instructions_ar": EXACT_USAGE_AR,
        "usage_instructions_en": EXACT_USAGE_EN,
    },
    {
        "slug": "fruit-coffee-and-tea-stain-remover",
        "name_ar": "مزيل بقع الفاكهة والقهوة والشاي",
        "name_en": "Fruit, Coffee & Tea Stain Remover",
        "description_ar": GENERAL_DESCRIPTION_AR,
        "description_en": (
            "Diesel Power Fruit, Coffee & Tea Stain Remover is designed to tackle stubborn "
            "fruit, coffee, and tea stains on clothing and textiles. Its formula helps break "
            "down stains while helping preserve fabrics and colors when used according to the instructions."
        ),
        "category_ar": "مزيلات بقع",
        "category_en": "Stain Removers",
        "size": "220 ml",
        "current_price": 99.0,
        "original_price": 120.0,
        "images": ["/static/images/product-fruit-coffee-tea.jpg"],
        "stock_quantity": 100,
        "availability": "in_stock",
        "usage_instructions_ar": EXACT_USAGE_AR,
        "usage_instructions_en": EXACT_USAGE_EN,
    },
]

EGYPT_GOVERNORATES = [
    {"id": "Cairo", "ar": "القاهرة", "en": "Cairo"},
    {"id": "Giza", "ar": "الجيزة", "en": "Giza"},
    {"id": "Qalyubia", "ar": "القليوبية", "en": "Qalyubia"},
    {"id": "Alexandria", "ar": "الإسكندرية", "en": "Alexandria"},
    {"id": "Dakahlia", "ar": "الدقهلية", "en": "Dakahlia"},
    {"id": "Red Sea", "ar": "البحر الأحمر", "en": "Red Sea"},
    {"id": "Beheira", "ar": "البحيرة", "en": "Beheira"},
    {"id": "Fayoum", "ar": "الفيوم", "en": "Fayoum"},
    {"id": "Gharbia", "ar": "الغربية", "en": "Gharbia"},
    {"id": "Ismailia", "ar": "الإسماعيلية", "en": "Ismailia"},
    {"id": "Menofia", "ar": "المنوفية", "en": "Menofia"},
    {"id": "Minya", "ar": "المنيا", "en": "Minya"},
    {"id": "New Valley", "ar": "الوادي الجديد", "en": "New Valley"},
    {"id": "Suez", "ar": "السويس", "en": "Suez"},
    {"id": "Aswan", "ar": "أسوان", "en": "Aswan"},
    {"id": "Assiut", "ar": "أسيوط", "en": "Assiut"},
    {"id": "Beni Suef", "ar": "بني سويف", "en": "Beni Suef"},
    {"id": "Port Said", "ar": "بورسعيد", "en": "Port Said"},
    {"id": "Damietta", "ar": "دمياط", "en": "Damietta"},
    {"id": "Sharkia", "ar": "الشرقية", "en": "Sharkia"},
    {"id": "South Sinai", "ar": "جنوب سيناء", "en": "South Sinai"},
    {"id": "Kafr El Sheikh", "ar": "كفر الشيخ", "en": "Kafr El Sheikh"},
    {"id": "Matrouh", "ar": "مطروح", "en": "Matrouh"},
    {"id": "Luxor", "ar": "الأقصر", "en": "Luxor"},
    {"id": "Qena", "ar": "قنا", "en": "Qena"},
    {"id": "North Sinai", "ar": "شمال سيناء", "en": "North Sinai"},
    {"id": "Sohag", "ar": "سوهاج", "en": "Sohag"},
]


def utc_now_iso() -> str:
    return datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")


def hash_password(password: str, salt: Optional[str] = None) -> str:
    if salt is None:
        salt = secrets.token_hex(16)
    dk = hashlib.pbkdf2_hmac("sha256", password.encode("utf-8"), salt.encode("utf-8"), 200_000)
    return f"pbkdf2_sha256$200000${salt}${dk.hex()}"


def verify_password(password: str, stored_hash: str) -> bool:
    try:
        algo, iterations_str, salt, hash_hex = stored_hash.split("$", 3)
        dk = hashlib.pbkdf2_hmac(
            "sha256",
            password.encode("utf-8"),
            salt.encode("utf-8"),
            int(iterations_str),
        )
        return secrets.compare_digest(dk.hex(), hash_hex)
    except Exception:
        return False


def get_connection() -> sqlite3.Connection:
    conn = sqlite3.connect(DB_PATH, timeout=30.0, isolation_level=None)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA foreign_keys = ON;")
    conn.execute("PRAGMA journal_mode = WAL;")
    return conn


def init_db():
    conn = get_connection()
    try:
        conn.executescript(
            """
            CREATE TABLE IF NOT EXISTS products (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                slug TEXT UNIQUE NOT NULL,
                name_ar TEXT NOT NULL,
                name_en TEXT NOT NULL,
                description_ar TEXT NOT NULL,
                description_en TEXT NOT NULL,
                category_ar TEXT NOT NULL,
                category_en TEXT NOT NULL,
                size TEXT NOT NULL,
                current_price REAL NOT NULL CHECK(current_price >= 0),
                original_price REAL NOT NULL CHECK(original_price >= 0),
                images TEXT NOT NULL,
                stock_quantity INTEGER NOT NULL DEFAULT 0 CHECK(stock_quantity >= 0),
                availability TEXT NOT NULL DEFAULT 'in_stock' CHECK(availability IN ('in_stock', 'out_of_stock', 'disabled')),
                usage_instructions_ar TEXT NOT NULL,
                usage_instructions_en TEXT NOT NULL,
                created_at TEXT NOT NULL,
                updated_at TEXT NOT NULL
            );

            CREATE TABLE IF NOT EXISTS orders (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                order_number TEXT UNIQUE NOT NULL,
                idempotency_key TEXT UNIQUE,
                access_token TEXT NOT NULL,
                customer_name TEXT NOT NULL,
                phone_number TEXT NOT NULL,
                governorate TEXT NOT NULL,
                delivery_address TEXT NOT NULL,
                notes TEXT DEFAULT '',
                subtotal REAL NOT NULL CHECK(subtotal >= 0),
                discount_code TEXT DEFAULT NULL,
                discount_amount REAL NOT NULL DEFAULT 0 CHECK(discount_amount >= 0),
                delivery_fee REAL NOT NULL CHECK(delivery_fee >= 0),
                final_total REAL NOT NULL CHECK(final_total >= 0),
                payment_method TEXT NOT NULL DEFAULT 'COD',
                order_status TEXT NOT NULL DEFAULT 'Pending' CHECK(order_status IN ('Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered', 'Cancelled')),
                stock_restored INTEGER NOT NULL DEFAULT 0,
                created_at TEXT NOT NULL,
                updated_at TEXT NOT NULL
            );

            CREATE TABLE IF NOT EXISTS order_items (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                order_id INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
                product_id INTEGER REFERENCES products(id) ON DELETE SET NULL,
                product_name_ar_snapshot TEXT NOT NULL,
                product_name_en_snapshot TEXT NOT NULL,
                product_name_snapshot TEXT NOT NULL,
                unit_price_snapshot REAL NOT NULL CHECK(unit_price_snapshot >= 0),
                quantity INTEGER NOT NULL CHECK(quantity > 0),
                line_total REAL NOT NULL CHECK(line_total >= 0)
            );

            CREATE TABLE IF NOT EXISTS discount_codes (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                code TEXT UNIQUE NOT NULL,
                discount_type TEXT NOT NULL CHECK(discount_type IN ('percentage', 'fixed')),
                discount_value REAL NOT NULL CHECK(discount_value > 0),
                min_order_amount REAL NOT NULL DEFAULT 0 CHECK(min_order_amount >= 0),
                expiry_date TEXT DEFAULT NULL,
                usage_limit INTEGER DEFAULT NULL,
                used_count INTEGER NOT NULL DEFAULT 0 CHECK(used_count >= 0),
                is_active INTEGER NOT NULL DEFAULT 1,
                created_at TEXT NOT NULL
            );

            CREATE TABLE IF NOT EXISTS reviews (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
                rating INTEGER NOT NULL CHECK(rating >= 1 AND rating <= 5),
                review_text TEXT NOT NULL,
                display_name TEXT NOT NULL,
                moderation_status TEXT NOT NULL DEFAULT 'pending' CHECK(moderation_status IN ('pending', 'approved', 'rejected')),
                ip_hash TEXT DEFAULT '',
                created_at TEXT NOT NULL
            );

            CREATE TABLE IF NOT EXISTS store_settings (
                key TEXT PRIMARY KEY,
                value TEXT NOT NULL,
                updated_at TEXT NOT NULL
            );

            CREATE TABLE IF NOT EXISTS admin_users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username TEXT UNIQUE NOT NULL,
                password_hash TEXT NOT NULL,
                created_at TEXT NOT NULL
            );
            """
        )

        conn.execute("BEGIN IMMEDIATE;")
        now = utc_now_iso()

        # Seed initial products if products table is empty
        count_row = conn.execute("SELECT COUNT(*) AS cnt FROM products").fetchone()
        if count_row["cnt"] == 0:
            for prod in INITIAL_PRODUCTS:
                conn.execute(
                    """
                    INSERT INTO products (
                        slug, name_ar, name_en, description_ar, description_en,
                        category_ar, category_en, size, current_price, original_price,
                        images, stock_quantity, availability, usage_instructions_ar,
                        usage_instructions_en, created_at, updated_at
                    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                    """,
                    (
                        prod["slug"],
                        prod["name_ar"],
                        prod["name_en"],
                        prod["description_ar"],
                        prod["description_en"],
                        prod["category_ar"],
                        prod["category_en"],
                        prod["size"],
                        prod["current_price"],
                        prod["original_price"],
                        json.dumps(prod["images"], ensure_ascii=False),
                        prod["stock_quantity"],
                        prod["availability"],
                        json.dumps(prod["usage_instructions_ar"], ensure_ascii=False),
                        json.dumps(prod["usage_instructions_en"], ensure_ascii=False),
                        now,
                        now,
                    ),
                )

        # Seed store settings if missing
        default_settings = {
            "delivery_fee": "70",
            "governorate_delivery_fees": json.dumps({}, ensure_ascii=False),
            "currency_code": "EGP",
            "currency_symbol_ar": "ج.م",
            "currency_symbol_en": "EGP",
            "phone": "01013514594",
            "whatsapp": "+201013514594",
            "facebook_url": "https://www.facebook.com/share/19Ci88PRDS/",
            "address_ar": "شبرا الخيمة - محطة الكاوتش أمام مستشفى دار الحياة",
            "address_en": "Shubra El-Kheima - El-Kautsh Station in front of Dar Al-Hayat Hospital",
            "brand_name_en": "Diesel Power",
            "brand_name_ar": "الديزل باور",
            "slogan_ar": "استلمها جديدة",
            "slogan_en": "Receive It Like New",
            "low_stock_threshold": "10",
        }
        for k, v in default_settings.items():
            conn.execute(
                "INSERT OR IGNORE INTO store_settings (key, value, updated_at) VALUES (?, ?, ?)",
                (k, v, now),
            )

        # Seed admin user from environment variables
        admin_user = os.environ.get("ADMIN_USERNAME", "admin")
        admin_pass = os.environ.get("ADMIN_PASSWORD", "DieselPower@2026!")
        existing_admin = conn.execute(
            "SELECT id FROM admin_users WHERE username = ?", (admin_user,)
        ).fetchone()
        if not existing_admin:
            conn.execute(
                "INSERT INTO admin_users (username, password_hash, created_at) VALUES (?, ?, ?)",
                (admin_user, hash_password(admin_pass), now),
            )

        conn.execute("COMMIT;")
    except Exception:
        conn.execute("ROLLBACK;")
        raise
    finally:
        conn.close()


def format_product_row(row: sqlite3.Row, approved_reviews: Optional[List[Dict[str, Any]]] = None) -> Dict[str, Any]:
    d = dict(row)
    d["images"] = json.loads(d["images"]) if isinstance(d["images"], str) else d["images"]
    d["usage_instructions_ar"] = (
        json.loads(d["usage_instructions_ar"])
        if isinstance(d["usage_instructions_ar"], str)
        else d["usage_instructions_ar"]
    )
    d["usage_instructions_en"] = (
        json.loads(d["usage_instructions_en"])
        if isinstance(d["usage_instructions_en"], str)
        else d["usage_instructions_en"]
    )
    curr = float(d["current_price"])
    orig = float(d["original_price"])
    if orig > curr and orig > 0:
        disc_pct = round(((orig - curr) / orig) * 100, 1)
    else:
        disc_pct = 0.0
    d["discount_percentage"] = disc_pct
    d["in_stock"] = d["availability"] == "in_stock" and int(d["stock_quantity"]) > 0
    if approved_reviews is not None:
        d["reviews"] = approved_reviews
        if len(approved_reviews) > 0:
            d["average_rating"] = round(
                sum(r["rating"] for r in approved_reviews) / len(approved_reviews), 1
            )
            d["review_count"] = len(approved_reviews)
        else:
            d["average_rating"] = 0.0
            d["review_count"] = 0
    return d


def get_store_settings(conn: Optional[sqlite3.Connection] = None) -> Dict[str, Any]:
    close_conn = False
    if conn is None:
        conn = get_connection()
        close_conn = True
    try:
        rows = conn.execute("SELECT key, value FROM store_settings").fetchall()
        settings: Dict[str, Any] = {r["key"]: r["value"] for r in rows}
        settings["delivery_fee"] = float(settings.get("delivery_fee", 70.0))
        settings["low_stock_threshold"] = int(settings.get("low_stock_threshold", 10))
        try:
            settings["governorate_delivery_fees"] = json.loads(
                settings.get("governorate_delivery_fees", "{}")
            )
        except Exception:
            settings["governorate_delivery_fees"] = {}
        settings["governorates"] = EGYPT_GOVERNORATES
        return settings
    finally:
        if close_conn:
            conn.close()


def calculate_delivery_fee_for_governorate(
    settings: Dict[str, Any], governorate: Optional[str] = None
) -> float:
    gov_fees = settings.get("governorate_delivery_fees") or {}
    if governorate and governorate in gov_fees:
        try:
            fee = float(gov_fees[governorate])
            if fee >= 0:
                return round(fee, 2)
        except (ValueError, TypeError):
            pass
    return round(float(settings.get("delivery_fee", 70.0)), 2)


def validate_discount_code(
    conn: sqlite3.Connection, code: str, subtotal: float
) -> Tuple[bool, str, str, float, Optional[Dict[str, Any]]]:
    """
    Returns (is_valid, message_ar, message_en, discount_amount, discount_row_dict)
    """
    clean_code = (code or "").strip().upper()
    if not clean_code:
        return False, "يرجى إدخال كود الخصم", "Please enter a discount code", 0.0, None

    row = conn.execute(
        "SELECT * FROM discount_codes WHERE UPPER(code) = ?", (clean_code,)
    ).fetchone()
    if not row:
        return False, "كود الخصم غير صحيح", "Invalid discount code", 0.0, None

    disc = dict(row)
    if not disc["is_active"]:
        return False, "كود الخصم غير مفعل حالياً", "This discount code is inactive", 0.0, None

    if disc["expiry_date"]:
        now_str = utc_now_iso()[:10]
        exp_str = str(disc["expiry_date"])[:10]
        if now_str > exp_str:
            return False, "انتهت صلاحية كود الخصم", "This discount code has expired", 0.0, None

    if disc["usage_limit"] is not None and int(disc["used_count"]) >= int(disc["usage_limit"]):
        return (
            False,
            "تم الوصول للحد الأقصى لاستخدام هذا الكود",
            "This discount code has reached its usage limit",
            0.0,
            None,
        )

    min_order = float(disc.get("min_order_amount") or 0.0)
    if subtotal < min_order:
        return (
            False,
            f"الحد الأدنى للطلب لاستخدام هذا الكود هو {min_order:.0f} ج.م",
            f"Minimum order amount for this code is EGP {min_order:.0f}",
            0.0,
            None,
        )

    val = float(disc["discount_value"])
    if disc["discount_type"] == "percentage":
        if val <= 0 or val > 100:
            return False, "قيمة الخصم غير صالحة", "Invalid discount configuration", 0.0, None
        discount_amount = round(subtotal * (val / 100.0), 2)
    else:
        discount_amount = round(min(val, subtotal), 2)

    discount_amount = max(0.0, min(discount_amount, subtotal))
    return (
        True,
        "تم تطبيق كود الخصم بنجاح",
        "Discount code applied successfully",
        discount_amount,
        disc,
    )
