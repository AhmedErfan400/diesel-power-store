# Diesel Power (الديزل باور) — Deployment, SEO & Google Search Console Guide

## 1. Local & Production Setup Instructions

### Project Directory
All application code, static assets, database configuration, and tests are located in:
`e:\بابا\الصابون\اعلانات الصفحة\diesel_power_store`

### Environment Variables (`.env`)
Configure the following server-side variables in `.env` (never exposed to browser clients):
```env
ADMIN_USERNAME=admin
ADMIN_PASSWORD=DieselPower@2026!
JWT_SECRET_KEY=replace_with_a_64_char_random_hex_secret_in_production
SITE_URL=https://your-domain.com
PORT=8000
```
> **Important Security Note**: Before deploying to a public server, update `ADMIN_PASSWORD` and `JWT_SECRET_KEY` in `.env` (or in your hosting provider's environment settings).

### Running Locally
1. Double-click `start_store.bat` or run:
   ```powershell
   cd "e:\بابا\الصابون\اعلانات الصفحة\diesel_power_store"
   python app.py
   ```
2. Open the storefront at: `http://localhost:8000`
3. Open the Admin Dashboard at: `http://localhost:8000/admin`
4. Run the automated verification test suite at any time with:
   ```powershell
   python "e:\بابا\الصابون\اعلانات الصفحة\diesel_power_store\run_tests.py"
   ```

---

## 2. Deploying the Website to Production

You can deploy the `diesel_power_store` folder to any Python ASGI-compatible cloud host (such as **Render**, **Railway**, **Fly.io**, **DigitalOcean App Platform**, or a **Linux VPS** with Nginx + Systemd):

1. **Start Command**:
   ```bash
   uvicorn app:app --host 0.0.0.0 --port $PORT
   ```
2. **Persistent Storage**:
   - Mount a persistent volume/disk for `diesel_power.db` and `static/uploads/` so orders, inventory updates, and uploaded product images persist across container restarts.
   - Alternatively, if migrating to **Supabase PostgreSQL**, execute `supabase_schema_and_rls.sql` in the Supabase SQL Editor to create all tables with Row-Level Security (RLS) enabled.
3. **Environment Variables**:
   - Set `ADMIN_USERNAME`, `ADMIN_PASSWORD`, `JWT_SECRET_KEY`, and `SITE_URL` (your live `https://...` domain) in your hosting dashboard.

---

## 3. Connecting a Custom Domain

If you have or purchase a custom domain (e.g., `dieselpower-eg.com`):
1. In your hosting provider's dashboard, add your custom domain (`dieselpower-eg.com` and `www.dieselpower-eg.com`).
2. Open your domain registrar's **DNS Management** panel and add:
   - An **`A` record** for `@` pointing to your host's IP address (or ALIAS/ANAME record).
   - A **`CNAME` record** for `www` pointing to your hosting target.
3. Enable automatic **HTTPS / SSL (Let's Encrypt)** in your hosting panel.
4. Set `SITE_URL=https://dieselpower-eg.com` in your production environment variables so canonical URLs, Open Graph tags, `robots.txt`, and `sitemap.xml` automatically output your official domain.

---

## 4. Configuring Google Search Console & Submitting the Sitemap

1. Visit [Google Search Console](https://search.google.com/search-console) and sign in with your Google account.
2. Click **Add Property**:
   - Select **Domain** (recommended, verified via a DNS TXT record) or **URL Prefix** (`https://your-domain.com`).
3. Complete verification using the DNS TXT record or HTML tag method provided by Google.
4. Once verified, open **Sitemaps** in the left sidebar of Google Search Console.
5. Under **Add a new sitemap**, enter:
   ```text
   sitemap.xml
   ```
   and click **Submit**.
6. Google Search Console will read `https://your-domain.com/sitemap.xml`, which dynamically lists the homepage, shop, about page, legal pages, and all active product URLs (`/product/rust-stain-remover`, `/product/oil-and-grease-stain-remover`, `/product/ink-stain-remover`, `/product/blood-and-makeup-stain-remover`, `/product/fruit-coffee-and-tea-stain-remover`) along with `hreflang="ar"` and `hreflang="en"` annotations.

---

## 5. Checking Google Indexing Status

1. In Google Search Console, open the **URL Inspection** tool at the top bar.
2. Paste your homepage URL (`https://your-domain.com/`) or any product URL (e.g. `https://your-domain.com/product/rust-stain-remover`) and press Enter.
3. Click **Request Indexing** for your primary pages to queue them for Googlebot crawling.
4. Monitor ongoing indexing health under **Indexing → Pages** and structured data health under **Enhancements / Shopping → Product snippets**.
5. *Note*: Search indexing timelines and rankings are determined by Google's crawlers and algorithms; no website can guarantee immediate indexing or fixed ranking positions.
