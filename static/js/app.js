/* ==========================================================================
   DIESEL POWER (الديزل باور) — BILINGUAL STOREFRONT & ADMIN APPLICATION
   ========================================================================== */

(function () {
  "use strict";

  const STORAGE_KEYS = {
    LANG: "dp_lang",
    CART: "dp_cart_v1",
    WISHLIST: "dp_wishlist_v1",
    DISCOUNT: "dp_discount_code",
    ORDER_TOKENS: "dp_order_tokens_v1",
  };

  const EXACT_USAGE_AR = [
    "بلل المنطقة الملطخة بالماء الساخن.",
    "ضع بضع قطرات من الديزل باور مباشرة على البقعة.",
    "اترك المنتج ل٣٠ ثانية ثم افرك البقعة برفق باستخدام فرشاة ناعمة.",
    "اشوف القطعة بالماء الفاتر، أو اغسلها في الغسالة كالمعتاد.",
  ];

  const EXACT_USAGE_EN = [
    "Wet the stained area with hot water.",
    "Apply a few drops of Diesel Power directly onto the stain.",
    "Leave the product for 30 seconds, then gently scrub the stain using a soft brush.",
    "Rinse the item with lukewarm water, or wash it in the washing machine as usual.",
  ];

  const I18N = {
    ar: {
      brand_ar: "الديزل باور",
      slogan: "استلمها جديدة",
      value_prop: "أفضل جودة، أمان عالي، سعر معقول.",
      brand_desc:
        "الديزل باور هو براند منظفات بجودة قياسية لإزالة أصعب البقع من الملابس والسجاد والانتريهات وجميع أنواع المفروشات دون التأثير على الأقمشة وألوانها.",
      top_bar_text: "الديزل باور — استلمها جديدة | أفضل جودة، أمان عالي، سعر معقول.",
      header_brand_sub: "الديزل باور • استلمها جديدة",
      nav_home: "الرئيسية",
      nav_shop: "المنتجات",
      nav_about: "من نحن",
      nav_wishlist: "المفضلة",
      nav_cart: "سلة التسوق",
      search_placeholder: "ابحث عن مزيل بقع...",
      lang_switch: "English",
      hero_headline: "ودّع أصعب البقع مع الديزل باور",
      hero_subtext: "حلول فعالة لإزالة البقع من الملابس والمنسوجات، بجودة عالية وسعر مناسب.",
      btn_shop_now: "تسوق الآن",
      btn_discover: "اكتشف منتجاتنا",
      featured_eyebrow: "منتجات الديزل باور",
      featured_title: "مجموعة قاهر البقع الفائقة",
      featured_subtitle: "خمسة منتجات متخصصة لإزالة أصعب البقع مع الحفاظ على الأقمشة والألوان",
      in_stock: "متوفر في المخزون",
      out_of_stock: "نفد من المخزون",
      discount_badge: "خصم",
      add_to_cart: "أضف إلى السلة",
      added_to_cart: "تمت الإضافة للسلة",
      view_details: "التفاصيل",
      size_label: "الحجم",
      category_label: "الفئة",
      benefits_eyebrow: "لماذا الديزل باور؟",
      benefits_title: "أفضل جودة، أمان عالي، سعر معقول.",
      benefit_1_title: "إزالة فعالة لأصعب البقع",
      benefit_1_desc: "تركيبة متطورة تعمل على تفكيك البقع الصعبة من الملابس والمفروشات بفعالية.",
      benefit_2_title: "عناية بالأقمشة والألوان",
      benefit_2_desc: "يحافظ على الأقمشة وثبات ألوانها عند استخدامه وفقاً للتعليمات الموضحة.",
      benefit_3_title: "مناسب للمنزل والمفروشات",
      benefit_3_desc: "مناسب للملابس والسجاد والانتريهات وجميع أنواع المفروشات المنزلية.",
      benefit_4_title: "سعر معقول وجودة قياسية",
      benefit_4_desc: "قيمة حقيقية تجمع بين الأداء القوي والسعر المناسب لكل بيت مصري.",
      usage_eyebrow: "طريقة الاستخدام",
      usage_title: "خطوات الاستخدام الصحيحة",
      usage_subtitle: "اتبع التعليمات التالية للحصول على أفضل نتيجة مع الحفاظ على الأقمشة",
      contact_eyebrow: "تواصل معنا",
      contact_title: "نحن في خدمتك دائماً",
      address_label: "العنوان",
      address_value: "شبرا الخيمة - محطة الكاوتش أمام مستشفى دار الحياة",
      phone_label: "الهاتف والواتساب",
      facebook_label: "صفحة فيسبوك الرسمية",
      call_now: "اتصل الآن",
      whatsapp_contact: "تواصل عبر واتساب",
      visit_facebook: "زيارة صفحتنا على فيسبوك",
      shop_title: "جميع منتجات الديزل باور",
      shop_subtitle: "اختر مزيل البقع المناسب لاحتياجاتك — الدفع عند الاستلام",
      filter_search: "البحث",
      filter_category: "الفئة",
      filter_all_categories: "جميع الفئات",
      filter_availability: "التوفر",
      filter_all: "الكل",
      filter_in_stock_only: "المتوفر فقط",
      filter_max_price: "أقصى سعر",
      filter_sort: "الترتيب حسب",
      sort_default: "الافتراضي",
      sort_price_asc: "السعر: من الأقل للأعلى",
      sort_price_desc: "السعر: من الأعلى للأقل",
      sort_name: "الاسم أبجدياً",
      no_products_found: "لا توجد منتجات مطابقة لخيارات البحث الحالية.",
      reset_filters: "إعادة ضبط الفلاتر",
      quantity: "الكمية",
      payment_cod_badge: "الدفع عند الاستلام (COD)",
      related_products: "منتجات أخرى من الديزل باور",
      reviews_title: "تقييمات وآراء العملاء",
      no_reviews_yet: "لا توجد تقييمات منشورة لهذا المنتج حتى الآن. كن أول من يشاركنا رأيه بعد التجربة!",
      write_review_title: "أضف تقييمك للمنتج",
      your_name: "الاسم",
      your_rating: "التقييم",
      your_review: "رأيك في المنتج",
      submit_review: "إرسال التقييم",
      wishlist_title: "قائمة المفضلة",
      wishlist_empty: "قائمة المفضلة فارغة حالياً.",
      remove: "حذف",
      cart_title: "سلة التسوق",
      cart_empty: "سلة التسوق فارغة حالياً.",
      continue_shopping: "مواصلة التسوق",
      order_summary: "ملخص الطلب",
      subtotal: "المجموع الفرعي",
      discount: "الخصم",
      delivery_fee: "مصاريف التوصيل",
      final_total: "الإجمالي النهائي",
      discount_code_label: "كود الخصم",
      discount_code_placeholder: "أدخل كود الخصم",
      apply_code: "تطبيق",
      remove_code: "إلغاء الكود",
      proceed_to_checkout: "إتمام الطلب",
      checkout_title: "إتمام الطلب والدفع عند الاستلام",
      customer_info_title: "بيانات التوصيل",
      customer_name: "اسم العميل بالكامل *",
      customer_name_ph: "أدخل اسمك ثلاثي",
      phone_number: "رقم الهاتف المحمول *",
      phone_number_ph: "010xxxxxxxx",
      governorate: "المحافظة *",
      select_governorate: "اختر المحافظة",
      delivery_address: "عنوان التوصيل بالتفصيل *",
      delivery_address_ph: "المنطقة، اسم الشارع، رقم العقار، الدور، علامة مميزة...",
      order_notes: "ملاحظات إضافية على الطلب (اختياري)",
      order_notes_ph: "أي تعليمات خاصة بموعد التوصيل...",
      payment_method_title: "طريقة الدفع",
      cod_description: "الدفع نقداً عند الاستلام (Cash on Delivery) عند وصول المندوب لعنوانك.",
      confirm_order_btn: "تأكيد الطلب الآن",
      submitting_order: "جاري تسجيل الطلب...",
      order_received_title: "تم استلام طلبك بنجاح وهو قيد التأكيد!",
      order_received_sub: "شكراً لثقتك في الديزل باور. تم تسجيل طلبك بنجاح وسيتم التواصل معك لتأكيد موعد التوصيل.",
      order_number_label: "رقم الطلب",
      ordered_items_label: "المنتجات المطلوبة",
      manual_whatsapp_help: "إذا رغبت في الاستفسار عن طلبك يدوياً عبر واتساب يمكنك الضغط على الزر التالي:",
      manual_whatsapp_btn: "التواصل يدوياً عبر واتساب بخصوص الطلب",
      status_Pending: "قيد الانتظار",
      status_Confirmed: "تم التأكيد",
      status_Processing: "جاري التجهيز",
      status_Shipped: "تم الشحن",
      status_Delivered: "تم التوصيل",
      status_Cancelled: "ملغي",
      footer_links_title: "روابط سريعة",
      footer_contact_title: "تواصل معنا",
      footer_privacy: "سياسة الخصوصية",
      footer_terms: "الشروط والأحكام",
      footer_copyright: "© 2026 Diesel Power (الديزل باور). جميع الحقوق محفوظة.",
    },
    en: {
      brand_ar: "الديزل باور",
      slogan: "Receive It Like New (استلمها جديدة)",
      value_prop: "Best Quality, High Safety, Reasonable Price.",
      brand_desc:
        "Diesel Power is a high-standard cleaning brand designed to remove the toughest stains from clothes, carpets, sofas, and all types of upholstery without affecting fabrics and their colors.",
      top_bar_text: "Diesel Power — Receive It Like New | Best Quality, High Safety, Reasonable Price.",
      header_brand_sub: "Stain & Clean • Receive It Like New",
      nav_home: "Home",
      nav_shop: "Shop",
      nav_about: "About Us",
      nav_wishlist: "Wishlist",
      nav_cart: "Shopping Cart",
      search_placeholder: "Search stain removers...",
      lang_switch: "العربية",
      hero_headline: "Say Goodbye to Tough Stains with Diesel Power",
      hero_subtext: "Effective stain removal solutions for clothing and textiles, with high quality and reasonable prices.",
      btn_shop_now: "Shop Now",
      btn_discover: "Discover Our Products",
      featured_eyebrow: "Diesel Power Catalog",
      featured_title: "Specialized Stain Remover Lineup",
      featured_subtitle: "Five specialized formulas designed to tackle tough stains while helping preserve fabrics and colors",
      in_stock: "In Stock",
      out_of_stock: "Out of Stock",
      discount_badge: "OFF",
      add_to_cart: "Add to Cart",
      added_to_cart: "Added to Cart",
      view_details: "Details",
      size_label: "Size",
      category_label: "Category",
      benefits_eyebrow: "Why Diesel Power?",
      benefits_title: "Best Quality, High Safety, Reasonable Price.",
      benefit_1_title: "Effective Stain Removal",
      benefit_1_desc: "Advanced formula engineered to break down stubborn stains on clothing and textiles.",
      benefit_2_title: "Care for Fabrics & Colors",
      benefit_2_desc: "Helps preserve fabrics and their colors when used according to the usage instructions.",
      benefit_3_title: "Suitable for Household Cleaning",
      benefit_3_desc: "Ideal for clothing, carpets, sofas, and household upholstery.",
      benefit_4_title: "Reasonable Prices",
      benefit_4_desc: "High-standard cleaning performance offered at an accessible price.",
      usage_eyebrow: "How to Use",
      usage_title: "Step-by-Step Usage Instructions",
      usage_subtitle: "Follow these four steps carefully for effective stain removal and fabric care",
      contact_eyebrow: "Contact Us",
      contact_title: "Get in Touch with Diesel Power",
      address_label: "Address",
      address_value: "Shubra El-Kheima - El-Kautsh Station in front of Dar Al-Hayat Hospital",
      phone_label: "Phone & WhatsApp",
      facebook_label: "Official Facebook Page",
      call_now: "Call Now",
      whatsapp_contact: "Chat on WhatsApp",
      visit_facebook: "Visit Facebook Page",
      shop_title: "Shop All Diesel Power Products",
      shop_subtitle: "Select the specialized stain remover for your needs — Cash on Delivery",
      filter_search: "Search",
      filter_category: "Category",
      filter_all_categories: "All Categories",
      filter_availability: "Availability",
      filter_all: "All",
      filter_in_stock_only: "In Stock Only",
      filter_max_price: "Max Price",
      filter_sort: "Sort By",
      sort_default: "Featured",
      sort_price_asc: "Price: Low to High",
      sort_price_desc: "Price: High to Low",
      sort_name: "Name (A-Z)",
      no_products_found: "No products match your current filter selection.",
      reset_filters: "Reset Filters",
      quantity: "Quantity",
      payment_cod_badge: "Cash on Delivery (COD)",
      related_products: "More Products from Diesel Power",
      reviews_title: "Customer Ratings & Reviews",
      no_reviews_yet: "No customer reviews have been published for this product yet. Share your experience!",
      write_review_title: "Submit a Product Review",
      your_name: "Your Name",
      your_rating: "Rating",
      your_review: "Your Review",
      submit_review: "Submit Review",
      wishlist_title: "Saved Wishlist",
      wishlist_empty: "Your wishlist is currently empty.",
      remove: "Remove",
      cart_title: "Shopping Cart",
      cart_empty: "Your shopping cart is currently empty.",
      continue_shopping: "Continue Shopping",
      order_summary: "Order Summary",
      subtotal: "Subtotal",
      discount: "Discount",
      delivery_fee: "Delivery Fee",
      final_total: "Final Total",
      discount_code_label: "Discount Code",
      discount_code_placeholder: "Enter discount code",
      apply_code: "Apply",
      remove_code: "Remove Code",
      proceed_to_checkout: "Proceed to Checkout",
      checkout_title: "Checkout (Cash on Delivery)",
      customer_info_title: "Delivery Information",
      customer_name: "Full Name *",
      customer_name_ph: "Enter your full name",
      phone_number: "Egyptian Mobile Number *",
      phone_number_ph: "010xxxxxxxx",
      governorate: "Governorate *",
      select_governorate: "Select Governorate",
      delivery_address: "Full Delivery Address *",
      delivery_address_ph: "District, street name, building number, floor, apartment, landmark...",
      order_notes: "Order Notes (Optional)",
      order_notes_ph: "Any special delivery instructions...",
      payment_method_title: "Payment Method",
      cod_description: "Cash on Delivery (COD) — Pay in cash when your order is delivered to your address.",
      confirm_order_btn: "Place Order (Cash on Delivery)",
      submitting_order: "Saving Order...",
      order_received_title: "Your Order Has Been Received & Is Awaiting Confirmation!",
      order_received_sub: "Thank you for shopping with Diesel Power. Your order has been recorded and is awaiting confirmation.",
      order_number_label: "Order Number",
      ordered_items_label: "Ordered Products",
      manual_whatsapp_help: "If you would like to contact us manually on WhatsApp regarding your order, click below:",
      manual_whatsapp_btn: "Contact Business Manually on WhatsApp",
      status_Pending: "Pending",
      status_Confirmed: "Confirmed",
      status_Processing: "Processing",
      status_Shipped: "Shipped",
      status_Delivered: "Delivered",
      status_Cancelled: "Cancelled",
      footer_links_title: "Quick Links",
      footer_contact_title: "Contact Us",
      footer_privacy: "Privacy Policy",
      footer_terms: "Terms & Conditions",
      footer_copyright: "© 2026 Diesel Power (الديزل باور). All rights reserved.",
    },
  };

  // Application State
  const state = {
    lang: "ar",
    settings: {
      delivery_fee: 70,
      governorates: [],
      phone: "01013514594",
      whatsapp: "+201013514594",
      facebook_url: "https://www.facebook.com/share/19Ci88PRDS/",
      address_ar: "شبرا الخيمة - محطة الكاوتش أمام مستشفى دار الحياة",
      address_en: "Shubra El-Kheima - El-Kautsh Station in front of Dar Al-Hayat Hospital",
    },
    products: [],
    categories: [],
    cart: [],
    wishlist: [],
    discountCode: "",
    cartServerCalc: null,
    checkoutIdempotencyKey: null,
    shopFilters: {
      q: "",
      category: "all",
      availability: "all",
      maxPrice: "",
      sort: "default",
    },
    admin: {
      authenticated: false,
      username: "",
      activeTab: "overview",
      overview: null,
      products: [],
      orders: [],
      discounts: [],
      reviews: [],
      orderFilters: { q: "", status: "all", date_from: "", date_to: "" },
    },
  };

  function t(key) {
    return (I18N[state.lang] && I18N[state.lang][key]) || I18N.ar[key] || key;
  }

  function escapeHtml(str) {
    if (str === null || str === undefined) return "";
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function toArabicDigits(numStr) {
    const map = ["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"];
    return String(numStr).replace(/\d/g, (d) => map[Number(d)]);
  }

  function formatPrice(val) {
    const num = Number(val || 0);
    const formatted = Number.isInteger(num) ? String(num) : num.toFixed(2).replace(/\.00$/, "");
    if (state.lang === "ar") {
      return `${toArabicDigits(formatted)} ج.م`;
    }
    return `EGP ${formatted}`;
  }

  function formatNumber(val) {
    const s = String(val);
    return state.lang === "ar" ? toArabicDigits(s) : s;
  }

  function showToast(msg, type = "info") {
    const container = document.getElementById("toast-container");
    if (!container) return;
    const el = document.createElement("div");
    el.className = `toast ${type === "error" ? "toast-error" : type === "success" ? "toast-success" : ""}`;
    el.textContent = msg;
    container.appendChild(el);
    setTimeout(() => {
      el.remove();
    }, 3600);
  }

  // LocalStorage Persistence
  function loadPersistedState() {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const urlLang = urlParams.get("lang");
      const savedLang = localStorage.getItem(STORAGE_KEYS.LANG);
      if (urlLang === "en" || urlLang === "ar") {
        state.lang = urlLang;
        localStorage.setItem(STORAGE_KEYS.LANG, urlLang);
      } else if (savedLang === "en" || savedLang === "ar") {
        state.lang = savedLang;
      } else {
        state.lang = "ar";
      }
    } catch (_) {
      state.lang = "ar";
    }

    try {
      const rawCart = JSON.parse(localStorage.getItem(STORAGE_KEYS.CART) || "[]");
      if (Array.isArray(rawCart)) {
        state.cart = rawCart.filter((i) => i && Number(i.product_id) > 0 && Number(i.quantity) > 0);
      }
    } catch (_) {
      state.cart = [];
    }

    try {
      const rawWish = JSON.parse(localStorage.getItem(STORAGE_KEYS.WISHLIST) || "[]");
      if (Array.isArray(rawWish)) {
        state.wishlist = rawWish.map((id) => Number(id)).filter((id) => id > 0);
      }
    } catch (_) {
      state.wishlist = [];
    }

    try {
      state.discountCode = localStorage.getItem(STORAGE_KEYS.DISCOUNT) || "";
    } catch (_) {
      state.discountCode = "";
    }
  }

  function saveCart() {
    try {
      localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(state.cart));
    } catch (_) {}
    updateHeaderBadges();
  }

  function saveWishlist() {
    try {
      localStorage.setItem(STORAGE_KEYS.WISHLIST, JSON.stringify(state.wishlist));
    } catch (_) {}
    updateHeaderBadges();
  }

  function saveOrderToken(orderNumber, token) {
    try {
      const map = JSON.parse(localStorage.getItem(STORAGE_KEYS.ORDER_TOKENS) || "{}");
      map[orderNumber] = token;
      localStorage.setItem(STORAGE_KEYS.ORDER_TOKENS, JSON.stringify(map));
    } catch (_) {}
  }

  function getSavedOrderToken(orderNumber) {
    try {
      const map = JSON.parse(localStorage.getItem(STORAGE_KEYS.ORDER_TOKENS) || "{}");
      return map[orderNumber] || "";
    } catch (_) {
      return "";
    }
  }

  function updateHeaderBadges() {
    const cartCount = state.cart.reduce((acc, item) => acc + Number(item.quantity || 0), 0);
    const wishCount = state.wishlist.length;
    const cartBadge = document.getElementById("cart-count-badge");
    const wishBadge = document.getElementById("wishlist-count-badge");
    if (cartBadge) cartBadge.textContent = String(cartCount);
    if (wishBadge) wishBadge.textContent = String(wishCount);
  }

  function applyLanguageToShell() {
    const htmlRoot = document.getElementById("html-root");
    if (htmlRoot) {
      htmlRoot.setAttribute("lang", state.lang);
      htmlRoot.setAttribute("dir", state.lang === "ar" ? "rtl" : "ltr");
    }

    const setText = (id, key) => {
      const el = document.getElementById(id);
      if (el) el.textContent = t(key);
    };

    setText("top-bar-text", "top_bar_text");
    setText("header-brand-sub", "header_brand_sub");
    setText("nav-home", "nav_home");
    setText("nav-shop", "nav_shop");
    setText("nav-about", "nav_about");
    setText("m-nav-home", "nav_home");
    setText("m-nav-shop", "nav_shop");
    setText("m-nav-about", "nav_about");
    setText("m-nav-wishlist", "nav_wishlist");
    setText("m-nav-cart", "nav_cart");
    setText("lang-switch-label", "lang_switch");

    const searchInput = document.getElementById("header-search-input");
    if (searchInput) searchInput.placeholder = t("search_placeholder");
    const mSearchInput = document.getElementById("mobile-search-input");
    if (mSearchInput) mSearchInput.placeholder = t("search_placeholder");

    setText("footer-slogan", "header_brand_sub");
    setText("footer-brand-desc", "brand_desc");
    setText("footer-value-prop", "value_prop");
    setText("footer-links-title", "footer_links_title");
    setText("f-link-home", "nav_home");
    setText("f-link-shop", "nav_shop");
    setText("f-link-about", "nav_about");
    setText("f-link-wishlist", "nav_wishlist");
    setText("f-link-cart", "nav_cart");
    setText("f-link-privacy", "footer_privacy");
    setText("f-link-terms", "footer_terms");
    setText("footer-contact-title", "footer_contact_title");
    setText("footer-address", "address_value");
    setText("footer-fb-link", "visit_facebook");
    setText("footer-copyright", "footer_copyright");
    setText("footer-b-privacy", "footer_privacy");
    setText("footer-b-terms", "footer_terms");
    setText("whatsapp-float-label", "whatsapp_contact");

    // Highlight active nav link
    const path = window.location.pathname;
    document.querySelectorAll(".nav-link").forEach((link) => {
      const target = link.getAttribute("data-nav");
      if (target === path || (target === "/shop" && path.startsWith("/product/"))) {
        link.classList.add("active");
      } else {
        link.classList.remove("active");
      }
    });
  }

  // Cart & Wishlist Actions
  function addToCart(productId, qty = 1) {
    const prod = state.products.find((p) => Number(p.id) === Number(productId));
    if (!prod) return;
    if (!prod.in_stock || Number(prod.stock_quantity) <= 0) {
      showToast(t("out_of_stock"), "error");
      return;
    }

    const existing = state.cart.find((i) => Number(i.product_id) === Number(productId));
    const currentQty = existing ? Number(existing.quantity) : 0;
    const desiredQty = currentQty + Number(qty);
    const maxStock = Number(prod.stock_quantity);

    if (desiredQty > maxStock) {
      showToast(
        state.lang === "ar"
          ? `الحد الأقصى المتاح في المخزون هو ${maxStock}`
          : `Maximum available stock is ${maxStock}`,
        "error"
      );
      if (existing) existing.quantity = maxStock;
      else state.cart.push({ product_id: Number(productId), quantity: maxStock });
    } else {
      if (existing) existing.quantity = desiredQty;
      else state.cart.push({ product_id: Number(productId), quantity: Number(qty) });
      showToast(
        `${t("added_to_cart")}: ${state.lang === "ar" ? prod.name_ar : prod.name_en}`,
        "success"
      );
    }
    state.checkoutIdempotencyKey = null;
    saveCart();
  }

  function updateCartQuantity(productId, newQty) {
    const qty = Number(newQty);
    if (qty <= 0) {
      state.cart = state.cart.filter((i) => Number(i.product_id) !== Number(productId));
    } else {
      const prod = state.products.find((p) => Number(p.id) === Number(productId));
      const maxStock = prod ? Number(prod.stock_quantity) : 99;
      const item = state.cart.find((i) => Number(i.product_id) === Number(productId));
      if (item) {
        item.quantity = Math.min(qty, Math.max(1, maxStock));
      }
    }
    state.checkoutIdempotencyKey = null;
    saveCart();
  }

  function toggleWishlist(productId) {
    const pid = Number(productId);
    const idx = state.wishlist.indexOf(pid);
    if (idx >= 0) {
      state.wishlist.splice(idx, 1);
      showToast(
        state.lang === "ar" ? "تمت الإزالة من المفضلة" : "Removed from wishlist"
      );
    } else {
      state.wishlist.push(pid);
      showToast(
        state.lang === "ar" ? "تمت الإضافة إلى المفضلة" : "Added to wishlist",
        "success"
      );
    }
    saveWishlist();
  }

  // Reusable Product Card Component
  function renderProductCard(p) {
    const name = state.lang === "ar" ? p.name_ar : p.name_en;
    const desc = state.lang === "ar" ? p.description_ar : p.description_en;
    const cat = state.lang === "ar" ? p.category_ar : p.category_en;
    const img = (p.images && p.images[0]) || "/static/images/logo.png";
    const isWished = state.wishlist.includes(Number(p.id));
    const hasDiscount = Number(p.original_price) > Number(p.current_price);
    const discPct = p.discount_percentage || 17.5;

    return `
      <article class="product-card" data-product-id="${p.id}">
        <div class="product-card-media">
          <div class="product-badges">
            ${
              hasDiscount
                ? `<span class="badge-discount">${
                    state.lang === "ar"
                      ? `${t("discount_badge")} ${formatNumber(discPct)}%`
                      : `${discPct}% ${t("discount_badge")}`
                  }</span>`
                : ""
            }
            <span class="badge-stock ${p.in_stock ? "badge-in-stock" : "badge-out-of-stock"}">
              ${p.in_stock ? t("in_stock") : t("out_of_stock")}
            </span>
          </div>
          <button
            type="button"
            class="wishlist-toggle-btn ${isWished ? "active" : ""}"
            data-action="toggle-wishlist"
            data-id="${p.id}"
            aria-label="Toggle Wishlist"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
          </button>
          <a href="/product/${escapeHtml(p.slug)}" data-nav="/product/${escapeHtml(p.slug)}" class="product-card-img-link">
            <img src="${escapeHtml(img)}" alt="${escapeHtml(name)} - Diesel Power" class="product-card-img" loading="lazy" />
          </a>
        </div>
        <div class="product-card-body">
          <div class="product-meta-row">
            <span>${escapeHtml(cat)}</span>
            <span class="product-size-tag" dir="ltr">${escapeHtml(p.size)}</span>
          </div>
          <h3 class="product-card-title">
            <a href="/product/${escapeHtml(p.slug)}" data-nav="/product/${escapeHtml(p.slug)}">${escapeHtml(name)}</a>
          </h3>
          <p class="product-card-desc">${escapeHtml(desc)}</p>
          <div class="product-price-row">
            <span class="price-current">${formatPrice(p.current_price)}</span>
            ${
              hasDiscount
                ? `<span class="price-original">${formatPrice(p.original_price)}</span>`
                : ""
            }
          </div>
          <div class="product-card-actions">
            <button
              type="button"
              class="btn btn-primary btn-sm"
              data-action="add-to-cart"
              data-id="${p.id}"
              ${!p.in_stock ? "disabled" : ""}
            >
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
              <span>${p.in_stock ? t("add_to_cart") : t("out_of_stock")}</span>
            </button>
            <a href="/product/${escapeHtml(p.slug)}" data-nav="/product/${escapeHtml(p.slug)}" class="btn btn-outline btn-sm">
              ${t("view_details")}
            </a>
          </div>
        </div>
      </article>
    `;
  }

  // --------------------------------------------------------------------------
  // PAGE RENDERERS
  // --------------------------------------------------------------------------

  function renderHomePage() {
    const main = document.getElementById("app-main");
    const products = state.products;
    const firstImg =
      (products[0] && products[0].images && products[0].images[0]) ||
      "/static/images/product-rust.jpg";
    const usageSteps = state.lang === "ar" ? EXACT_USAGE_AR : EXACT_USAGE_EN;

    main.innerHTML = `
      <!-- Hero Section -->
      <section class="hero-section">
        <div class="container hero-grid">
          <div class="hero-content">
            <div class="hero-badge-row">
              <span>DIESEL POWER</span>
              <span>•</span>
              <span>${escapeHtml(t("slogan"))}</span>
            </div>
            <h1 class="hero-headline">${escapeHtml(t("hero_headline"))}</h1>
            <p class="hero-subtext">${escapeHtml(t("hero_subtext"))}</p>
            <div class="hero-brand-box">
              <p style="font-weight:700;margin-bottom:4px;">${escapeHtml(t("brand_desc"))}</p>
              <p style="color:var(--primary);font-weight:800;">${escapeHtml(t("value_prop"))}</p>
            </div>
            <div class="hero-cta-group">
              <a href="/shop" data-nav="/shop" class="btn btn-primary">
                <span>${escapeHtml(t("btn_shop_now"))}</span>
              </a>
              <a href="#featured-products-section" class="btn btn-outline">
                <span>${escapeHtml(t("btn_discover"))}</span>
              </a>
            </div>
            <div class="hero-value-pills">
              <span class="value-pill">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                <span>220 ml</span>
              </span>
              <span class="value-pill">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                <span>${formatPrice(99)} <s style="color:var(--text-muted);font-weight:500;margin-inline-start:4px;">${formatPrice(120)}</s></span>
              </span>
              <span class="value-pill">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                <span>${escapeHtml(t("payment_cod_badge"))}</span>
              </span>
            </div>
          </div>

          <div class="hero-visual">
            <div class="hero-main-showcase">
              <img src="${escapeHtml(firstImg)}" alt="Diesel Power Stain Removers" id="hero-showcase-img" />
            </div>
            <div class="hero-thumbs-row">
              ${products
                .slice(0, 5)
                .map((p, idx) => {
                  const pImg = (p.images && p.images[0]) || "/static/images/logo.png";
                  const pName = state.lang === "ar" ? p.name_ar : p.name_en;
                  return `
                    <button
                      type="button"
                      class="hero-thumb-btn ${idx === 0 ? "active" : ""}"
                      data-action="hero-thumb"
                      data-img="${escapeHtml(pImg)}"
                      title="${escapeHtml(pName)}"
                    >
                      <img src="${escapeHtml(pImg)}" alt="${escapeHtml(pName)}" />
                    </button>
                  `;
                })
                .join("")}
            </div>
          </div>
        </div>
      </section>

      <!-- Featured Products Section -->
      <section class="section" id="featured-products-section">
        <div class="container">
          <div class="section-header">
            <span class="section-eyebrow">${escapeHtml(t("featured_eyebrow"))}</span>
            <h2 class="section-title">${escapeHtml(t("featured_title"))}</h2>
            <p class="section-subtitle">${escapeHtml(t("featured_subtitle"))}</p>
          </div>
          <div class="products-grid">
            ${products.map((p) => renderProductCard(p)).join("")}
          </div>
        </div>
      </section>

      <!-- Brand Benefits Section -->
      <section class="section section-subtle">
        <div class="container">
          <div class="section-header">
            <span class="section-eyebrow">${escapeHtml(t("benefits_eyebrow"))}</span>
            <h2 class="section-title">${escapeHtml(t("benefits_title"))}</h2>
            <p class="section-subtitle">${escapeHtml(t("brand_desc"))}</p>
          </div>
          <div class="benefits-grid">
            <div class="benefit-card">
              <div class="benefit-icon">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/></svg>
              </div>
              <h3 class="benefit-title">${escapeHtml(t("benefit_1_title"))}</h3>
              <p class="benefit-desc">${escapeHtml(t("benefit_1_desc"))}</p>
            </div>
            <div class="benefit-card">
              <div class="benefit-icon">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
              </div>
              <h3 class="benefit-title">${escapeHtml(t("benefit_2_title"))}</h3>
              <p class="benefit-desc">${escapeHtml(t("benefit_2_desc"))}</p>
            </div>
            <div class="benefit-card">
              <div class="benefit-icon">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
              </div>
              <h3 class="benefit-title">${escapeHtml(t("benefit_3_title"))}</h3>
              <p class="benefit-desc">${escapeHtml(t("benefit_3_desc"))}</p>
            </div>
            <div class="benefit-card">
              <div class="benefit-icon">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
              </div>
              <h3 class="benefit-title">${escapeHtml(t("benefit_4_title"))}</h3>
              <p class="benefit-desc">${escapeHtml(t("benefit_4_desc"))}</p>
            </div>
          </div>
        </div>
      </section>

      <!-- How to Use Section -->
      <section class="section">
        <div class="container">
          <div class="section-header">
            <span class="section-eyebrow">${escapeHtml(t("usage_eyebrow"))}</span>
            <h2 class="section-title">${escapeHtml(t("usage_title"))}</h2>
            <p class="section-subtitle">${escapeHtml(t("usage_subtitle"))}</p>
          </div>
          <div class="usage-steps-grid">
            ${usageSteps
              .map(
                (stepText, index) => `
              <div class="usage-step-card">
                <span class="usage-step-num">${formatNumber(index + 1)}</span>
                <p class="usage-step-text">${escapeHtml(stepText)}</p>
              </div>
            `
              )
              .join("")}
          </div>
        </div>
      </section>

      <!-- Contact Section -->
      <section class="section section-subtle">
        <div class="container">
          <div class="section-header">
            <span class="section-eyebrow">${escapeHtml(t("contact_eyebrow"))}</span>
            <h2 class="section-title">${escapeHtml(t("contact_title"))}</h2>
          </div>
          <div class="benefits-grid" style="grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));">
            <div class="benefit-card">
              <h3 class="benefit-title">${escapeHtml(t("address_label"))}</h3>
              <p class="benefit-desc" style="margin-bottom:14px;font-weight:700;color:var(--navy);">
                ${escapeHtml(t("address_value"))}
              </p>
            </div>
            <div class="benefit-card">
              <h3 class="benefit-title">${escapeHtml(t("phone_label"))}</h3>
              <p class="benefit-desc" dir="ltr" style="margin-bottom:14px;font-weight:800;font-size:1.15rem;color:var(--primary);">
                01013514594
              </p>
              <div style="display:flex;gap:10px;justify-content:center;flex-wrap:wrap;">
                <a href="tel:01013514594" class="btn btn-navy btn-sm">${escapeHtml(t("call_now"))}</a>
                <a href="https://wa.me/201013514594" target="_blank" rel="noopener noreferrer" class="btn btn-whatsapp btn-sm">${escapeHtml(t("whatsapp_contact"))}</a>
              </div>
            </div>
            <div class="benefit-card">
              <h3 class="benefit-title">${escapeHtml(t("facebook_label"))}</h3>
              <p class="benefit-desc" style="margin-bottom:14px;">Diesel Power — الديزل باور</p>
              <a href="https://www.facebook.com/share/19Ci88PRDS/" target="_blank" rel="noopener noreferrer" class="btn btn-primary btn-sm">
                ${escapeHtml(t("visit_facebook"))}
              </a>
            </div>
          </div>
        </div>
      </section>
    `;
  }

  function renderShopPage() {
    const main = document.getElementById("app-main");
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has("q")) {
      state.shopFilters.q = urlParams.get("q") || "";
    }

    main.innerHTML = `
      <section class="section">
        <div class="container">
          <div class="section-header">
            <span class="section-eyebrow">DIESEL POWER</span>
            <h1 class="section-title">${escapeHtml(t("shop_title"))}</h1>
            <p class="section-subtitle">${escapeHtml(t("shop_subtitle"))}</p>
          </div>

          <!-- Filter Toolbar -->
          <div class="shop-toolbar">
            <div class="filter-group">
              <label for="shop-filter-q">${escapeHtml(t("filter_search"))}</label>
              <input
                type="search"
                id="shop-filter-q"
                class="form-control"
                value="${escapeHtml(state.shopFilters.q)}"
                placeholder="${escapeHtml(t("search_placeholder"))}"
              />
            </div>
            <div class="filter-group">
              <label for="shop-filter-cat">${escapeHtml(t("filter_category"))}</label>
              <select id="shop-filter-cat" class="form-control">
                <option value="all">${escapeHtml(t("filter_all_categories"))}</option>
                ${state.categories
                  .map(
                    (c) => `
                  <option value="${escapeHtml(c.category_en)}" ${
                      state.shopFilters.category === c.category_en ? "selected" : ""
                    }>
                    ${escapeHtml(state.lang === "ar" ? c.category_ar : c.category_en)}
                  </option>
                `
                  )
                  .join("")}
              </select>
            </div>
            <div class="filter-group">
              <label for="shop-filter-avail">${escapeHtml(t("filter_availability"))}</label>
              <select id="shop-filter-avail" class="form-control">
                <option value="all" ${state.shopFilters.availability === "all" ? "selected" : ""}>${escapeHtml(t("filter_all"))}</option>
                <option value="in_stock" ${state.shopFilters.availability === "in_stock" ? "selected" : ""}>${escapeHtml(t("filter_in_stock_only"))}</option>
              </select>
            </div>
            <div class="filter-group">
              <label for="shop-filter-price">${escapeHtml(t("filter_max_price"))}</label>
              <input
                type="number"
                id="shop-filter-price"
                class="form-control"
                min="0"
                step="10"
                value="${escapeHtml(state.shopFilters.maxPrice)}"
                placeholder="${state.lang === "ar" ? "مثال: 150" : "e.g. 150"}"
              />
            </div>
            <div class="filter-group">
              <label for="shop-filter-sort">${escapeHtml(t("filter_sort"))}</label>
              <select id="shop-filter-sort" class="form-control">
                <option value="default" ${state.shopFilters.sort === "default" ? "selected" : ""}>${escapeHtml(t("sort_default"))}</option>
                <option value="price_asc" ${state.shopFilters.sort === "price_asc" ? "selected" : ""}>${escapeHtml(t("sort_price_asc"))}</option>
                <option value="price_desc" ${state.shopFilters.sort === "price_desc" ? "selected" : ""}>${escapeHtml(t("sort_price_desc"))}</option>
                <option value="name" ${state.shopFilters.sort === "name" ? "selected" : ""}>${escapeHtml(t("sort_name"))}</option>
              </select>
            </div>
          </div>

          <div id="shop-products-container"></div>
        </div>
      </section>
    `;

    const bindFilterEvents = () => {
      const qEl = document.getElementById("shop-filter-q");
      const catEl = document.getElementById("shop-filter-cat");
      const availEl = document.getElementById("shop-filter-avail");
      const priceEl = document.getElementById("shop-filter-price");
      const sortEl = document.getElementById("shop-filter-sort");

      const updateGrid = () => {
        state.shopFilters.q = qEl ? qEl.value.trim() : "";
        state.shopFilters.category = catEl ? catEl.value : "all";
        state.shopFilters.availability = availEl ? availEl.value : "all";
        state.shopFilters.maxPrice = priceEl ? priceEl.value.trim() : "";
        state.shopFilters.sort = sortEl ? sortEl.value : "default";
        renderFilteredShopGrid();
      };

      if (qEl) qEl.addEventListener("input", updateGrid);
      if (catEl) catEl.addEventListener("change", updateGrid);
      if (availEl) availEl.addEventListener("change", updateGrid);
      if (priceEl) priceEl.addEventListener("input", updateGrid);
      if (sortEl) sortEl.addEventListener("change", updateGrid);
    };

    bindFilterEvents();
    renderFilteredShopGrid();
  }

  function renderFilteredShopGrid() {
    const container = document.getElementById("shop-products-container");
    if (!container) return;

    let list = [...state.products];
    const f = state.shopFilters;

    if (f.q) {
      const qLower = f.q.toLowerCase();
      list = list.filter(
        (p) =>
          p.name_ar.toLowerCase().includes(qLower) ||
          p.name_en.toLowerCase().includes(qLower) ||
          p.description_ar.toLowerCase().includes(qLower) ||
          p.description_en.toLowerCase().includes(qLower) ||
          p.category_ar.toLowerCase().includes(qLower) ||
          p.category_en.toLowerCase().includes(qLower)
      );
    }

    if (f.category && f.category !== "all") {
      list = list.filter((p) => p.category_en === f.category || p.category_ar === f.category);
    }

    if (f.availability === "in_stock") {
      list = list.filter((p) => p.in_stock);
    }

    if (f.maxPrice !== "" && !Number.isNaN(Number(f.maxPrice))) {
      const maxP = Number(f.maxPrice);
      list = list.filter((p) => Number(p.current_price) <= maxP);
    }

    if (f.sort === "price_asc") {
      list.sort((a, b) => Number(a.current_price) - Number(b.current_price));
    } else if (f.sort === "price_desc") {
      list.sort((a, b) => Number(b.current_price) - Number(a.current_price));
    } else if (f.sort === "name") {
      list.sort((a, b) => {
        const na = state.lang === "ar" ? a.name_ar : a.name_en;
        const nb = state.lang === "ar" ? b.name_ar : b.name_en;
        return na.localeCompare(nb, state.lang);
      });
    }

    if (list.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <p style="font-weight:700;font-size:1.1rem;margin-bottom:14px;">${escapeHtml(t("no_products_found"))}</p>
          <button type="button" class="btn btn-outline btn-sm" id="reset-shop-filters-btn">${escapeHtml(t("reset_filters"))}</button>
        </div>
      `;
      const resetBtn = document.getElementById("reset-shop-filters-btn");
      if (resetBtn) {
        resetBtn.addEventListener("click", () => {
          state.shopFilters = { q: "", category: "all", availability: "all", maxPrice: "", sort: "default" };
          renderShopPage();
        });
      }
      return;
    }

    container.innerHTML = `
      <div class="products-grid">
        ${list.map((p) => renderProductCard(p)).join("")}
      </div>
    `;
  }

  async function renderProductDetailPage(slug) {
    const main = document.getElementById("app-main");
    main.innerHTML = `<div class="page-loader"><div class="spinner"></div></div>`;

    try {
      const res = await fetch(`/api/products/${encodeURIComponent(slug)}`);
      if (!res.ok) {
        main.innerHTML = `
          <div class="container section">
            <div class="empty-state">
              <h2>${state.lang === "ar" ? "المنتج غير موجود" : "Product Not Found"}</h2>
              <a href="/shop" data-nav="/shop" class="btn btn-primary" style="margin-top:16px;">${escapeHtml(t("continue_shopping"))}</a>
            </div>
          </div>
        `;
        return;
      }

      const data = await res.json();
      const p = data.product;
      const related = data.related_products || [];
      const name = state.lang === "ar" ? p.name_ar : p.name_en;
      const desc = state.lang === "ar" ? p.description_ar : p.description_en;
      const cat = state.lang === "ar" ? p.category_ar : p.category_en;
      const img = (p.images && p.images[0]) || "/static/images/logo.png";
      const usageList =
        state.lang === "ar"
          ? p.usage_instructions_ar && p.usage_instructions_ar.length
            ? p.usage_instructions_ar
            : EXACT_USAGE_AR
          : p.usage_instructions_en && p.usage_instructions_en.length
          ? p.usage_instructions_en
          : EXACT_USAGE_EN;
      const hasDiscount = Number(p.original_price) > Number(p.current_price);
      const isWished = state.wishlist.includes(Number(p.id));
      const reviews = p.reviews || [];

      main.innerHTML = `
        <section class="section">
          <div class="container">
            <div style="margin-bottom:20px;font-size:0.9rem;color:var(--text-muted);">
              <a href="/" data-nav="/">${escapeHtml(t("nav_home"))}</a> /
              <a href="/shop" data-nav="/shop">${escapeHtml(t("nav_shop"))}</a> /
              <strong style="color:var(--navy);">${escapeHtml(name)}</strong>
            </div>

            <div class="product-detail-layout">
              <div class="product-detail-gallery">
                <img src="${escapeHtml(img)}" alt="${escapeHtml(name)} - Diesel Power" class="product-detail-main-img" />
              </div>

              <div class="product-detail-info">
                <div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap;">
                  <span class="badge-pill">${escapeHtml(cat)}</span>
                  <span class="badge-stock ${p.in_stock ? "badge-in-stock" : "badge-out-of-stock"}">
                    ${p.in_stock ? t("in_stock") : t("out_of_stock")}
                  </span>
                  <span class="product-size-tag" dir="ltr">${escapeHtml(t("size_label"))}: ${escapeHtml(p.size)}</span>
                </div>

                <h1 class="product-detail-title">${escapeHtml(name)}</h1>

                <div class="product-detail-price-box">
                  <span class="product-detail-price-current">${formatPrice(p.current_price)}</span>
                  ${
                    hasDiscount
                      ? `
                        <span class="product-detail-price-orig">${formatPrice(p.original_price)}</span>
                        <span class="badge-discount">
                          ${
                            state.lang === "ar"
                              ? `${t("discount_badge")} ${formatNumber(p.discount_percentage)}%`
                              : `${p.discount_percentage}% ${t("discount_badge")}`
                          }
                        </span>
                      `
                      : ""
                  }
                  <span style="margin-inline-start:auto;font-size:0.86rem;font-weight:700;color:var(--navy);">
                    ${escapeHtml(t("payment_cod_badge"))}
                  </span>
                </div>

                <p style="font-size:1.05rem;color:var(--text-main);line-height:1.75;">
                  ${escapeHtml(desc)}
                </p>

                <!-- Quantity & Add to Cart -->
                <div style="display:flex;align-items:center;gap:14px;flex-wrap:wrap;padding:12px 0;">
                  <div class="qty-selector">
                    <button type="button" class="qty-btn" id="pdp-qty-minus" aria-label="Decrease">−</button>
                    <input type="number" id="pdp-qty-input" class="qty-input" value="1" min="1" max="${Math.max(1, p.stock_quantity)}" readonly />
                    <button type="button" class="qty-btn" id="pdp-qty-plus" aria-label="Increase">+</button>
                  </div>

                  <button
                    type="button"
                    class="btn btn-primary"
                    id="pdp-add-to-cart-btn"
                    style="flex:1;min-width:200px;"
                    ${!p.in_stock ? "disabled" : ""}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
                    <span>${p.in_stock ? t("add_to_cart") : t("out_of_stock")}</span>
                  </button>

                  <button
                    type="button"
                    class="btn btn-outline"
                    data-action="toggle-wishlist"
                    data-id="${p.id}"
                    aria-label="Wishlist"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="${isWished ? "#e11d48" : "none"}" stroke="${isWished ? "#e11d48" : "currentColor"}" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
                  </button>
                </div>

                <!-- Usage Instructions -->
                <div class="usage-box">
                  <h2 class="usage-box-title">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" stroke-width="2.2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                    <span>${escapeHtml(t("usage_eyebrow"))}</span>
                  </h2>
                  <ol class="usage-list">
                    ${usageList
                      .map(
                        (u, idx) => `
                      <li>
                        <span class="usage-list-num">${formatNumber(idx + 1)}</span>
                        <span>${escapeHtml(u)}</span>
                      </li>
                    `
                      )
                      .join("")}
                  </ol>
                </div>
              </div>
            </div>

            <!-- Customer Ratings & Reviews Section -->
            <div class="card-panel" style="margin-bottom:48px;">
              <h2 class="section-title" style="font-size:1.5rem;margin-bottom:20px;">
                ${escapeHtml(t("reviews_title"))}
                ${
                  reviews.length > 0
                    ? `<span style="font-size:1rem;color:var(--primary);font-weight:700;">(${formatNumber(p.average_rating)} ★ — ${formatNumber(reviews.length)})</span>`
                    : ""
                }
              </h2>

              <div class="reviews-grid">
                <div>
                  ${
                    reviews.length === 0
                      ? `<div class="empty-state"><p>${escapeHtml(t("no_reviews_yet"))}</p></div>`
                      : reviews
                          .map(
                            (r) => `
                        <div class="review-card">
                          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">
                            <strong style="color:var(--navy);">${escapeHtml(r.display_name)}</strong>
                            <span style="color:#f59e0b;font-weight:800;">${"★".repeat(r.rating)}${"☆".repeat(5 - r.rating)}</span>
                          </div>
                          <p style="font-size:0.94rem;color:var(--text-main);">${escapeHtml(r.review_text)}</p>
                          <small style="color:var(--text-muted);font-size:0.78rem;">${escapeHtml((r.created_at || "").slice(0, 10))}</small>
                        </div>
                      `
                          )
                          .join("")
                  }
                </div>

                <div>
                  <form id="review-submit-form" class="card-panel" style="background:var(--bg-subtle);">
                    <h3 style="font-size:1.15rem;font-weight:800;color:var(--navy);margin-bottom:14px;">
                      ${escapeHtml(t("write_review_title"))}
                    </h3>
                    <div class="form-field">
                      <label>${escapeHtml(t("your_rating"))} *</label>
                      <div class="star-rating-input" id="star-rating-widget">
                        ${[1, 2, 3, 4, 5]
                          .map(
                            (n) =>
                              `<button type="button" class="star-btn active" data-star="${n}">★</button>`
                          )
                          .join("")}
                      </div>
                      <input type="hidden" id="review-rating-val" value="5" />
                    </div>
                    <div class="form-field">
                      <label for="review-name-input">${escapeHtml(t("your_name"))} *</label>
                      <input type="text" id="review-name-input" class="form-control" required minlength="2" maxlength="80" />
                    </div>
                    <div class="form-field" style="display:none;">
                      <input type="text" id="review-honeypot" name="website" tabindex="-1" autocomplete="off" />
                    </div>
                    <div class="form-field">
                      <label for="review-text-input">${escapeHtml(t("your_review"))} *</label>
                      <textarea id="review-text-input" class="form-control" rows="3" required minlength="5" maxlength="1000"></textarea>
                    </div>
                    <div id="review-form-feedback" style="margin-bottom:10px;font-weight:700;font-size:0.9rem;"></div>
                    <button type="submit" class="btn btn-navy btn-sm">${escapeHtml(t("submit_review"))}</button>
                  </form>
                </div>
              </div>
            </div>

            <!-- Related Products -->
            ${
              related.length > 0
                ? `
              <div>
                <h2 class="section-title" style="font-size:1.5rem;margin-bottom:24px;">${escapeHtml(t("related_products"))}</h2>
                <div class="products-grid">
                  ${related.map((rp) => renderProductCard(rp)).join("")}
                </div>
              </div>
            `
                : ""
            }
          </div>
        </section>
      `;

      // Quantity handlers
      const qtyInput = document.getElementById("pdp-qty-input");
      const minusBtn = document.getElementById("pdp-qty-minus");
      const plusBtn = document.getElementById("pdp-qty-plus");
      const addBtn = document.getElementById("pdp-add-to-cart-btn");
      const maxQty = Math.max(1, Number(p.stock_quantity));

      if (minusBtn && qtyInput) {
        minusBtn.addEventListener("click", () => {
          const v = Math.max(1, Number(qtyInput.value) - 1);
          qtyInput.value = String(v);
        });
      }
      if (plusBtn && qtyInput) {
        plusBtn.addEventListener("click", () => {
          const v = Math.min(maxQty, Number(qtyInput.value) + 1);
          qtyInput.value = String(v);
        });
      }
      if (addBtn && qtyInput) {
        addBtn.addEventListener("click", () => {
          addToCart(p.id, Number(qtyInput.value || 1));
        });
      }

      // Star rating widget
      const starWidget = document.getElementById("star-rating-widget");
      const ratingValInput = document.getElementById("review-rating-val");
      if (starWidget && ratingValInput) {
        starWidget.addEventListener("click", (e) => {
          const btn = e.target.closest(".star-btn");
          if (!btn) return;
          const chosen = Number(btn.getAttribute("data-star"));
          ratingValInput.value = String(chosen);
          starWidget.querySelectorAll(".star-btn").forEach((b) => {
            const s = Number(b.getAttribute("data-star"));
            b.classList.toggle("active", s <= chosen);
          });
        });
      }

      // Review submit handler
      const revForm = document.getElementById("review-submit-form");
      if (revForm) {
        revForm.addEventListener("submit", async (e) => {
          e.preventDefault();
          const feedbackEl = document.getElementById("review-form-feedback");
          const payload = {
            rating: Number(document.getElementById("review-rating-val").value),
            display_name: document.getElementById("review-name-input").value.trim(),
            review_text: document.getElementById("review-text-input").value.trim(),
            website: document.getElementById("review-honeypot").value.trim(),
          };
          const resp = await fetch(`/api/products/${p.id}/reviews`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });
          const resJson = await resp.json();
          if (!resp.ok) {
            const errMsg = state.lang === "ar" ? resJson.error_ar : resJson.error_en;
            if (feedbackEl) {
              feedbackEl.style.color = "var(--danger)";
              feedbackEl.textContent = errMsg;
            }
          } else {
            const okMsg = state.lang === "ar" ? resJson.message_ar : resJson.message_en;
            if (feedbackEl) {
              feedbackEl.style.color = "var(--success)";
              feedbackEl.textContent = okMsg;
            }
            revForm.reset();
          }
        });
      }
    } catch (err) {
      main.innerHTML = `<div class="container section"><p>${escapeHtml(String(err))}</p></div>`;
    }
  }

  function renderAboutPage() {
    const main = document.getElementById("app-main");
    const usageSteps = state.lang === "ar" ? EXACT_USAGE_AR : EXACT_USAGE_EN;

    main.innerHTML = `
      <section class="section">
        <div class="container">
          <div class="section-header">
            <span class="section-eyebrow">DIESEL POWER • ${escapeHtml(t("brand_ar"))}</span>
            <h1 class="section-title">${escapeHtml(t("nav_about"))} — ${escapeHtml(t("slogan"))}</h1>
            <p class="section-subtitle" style="font-weight:700;color:var(--primary);">
              ${escapeHtml(t("value_prop"))}
            </p>
          </div>

          <div class="card-panel" style="max-width:880px;margin:0 auto 40px;padding:32px;">
            <div style="display:flex;align-items:center;gap:20px;flex-wrap:wrap;margin-bottom:24px;">
              <img src="/static/images/logo.png" alt="Diesel Power Official Logo" width="96" height="96" style="object-fit:contain;" />
              <div>
                <h2 style="font-size:1.5rem;font-weight:900;color:var(--navy);">DIESEL POWER — ${escapeHtml(t("brand_ar"))}</h2>
                <p style="color:var(--primary);font-weight:800;font-size:1.05rem;">${escapeHtml(t("slogan"))}</p>
              </div>
            </div>

            <p style="font-size:1.12rem;line-height:1.85;color:var(--text-main);margin-bottom:20px;font-weight:600;">
              ${escapeHtml(t("brand_desc"))}
            </p>

            <p style="font-size:1.05rem;line-height:1.8;color:var(--text-muted);margin-bottom:20px;">
              ${
                state.lang === "ar"
                  ? "يركز الديزل باور على تقديم حلول متخصصة لإزالة البقع الصعبة مثل بقع الصدأ، الزيوت والشحوم، الحبر، الدم والميك آب، وبقع الفاكهة والقهوة والشاي، مع الحرص على العناية بالأقمشة والحفاظ على ألوانها عند الاستخدام وفقاً للتعليمات الموضحة على العبوة."
                  : "Diesel Power focuses on providing specialized stain removal solutions for tough household stains—including rust, oil & grease, ink, blood & makeup, and fruit, coffee & tea—while helping care for fabrics and preserve their colors when used according to instructions."
              }
            </p>

            <div class="hero-brand-box" style="margin-bottom:0;">
              <strong style="font-size:1.1rem;color:var(--navy);">${escapeHtml(t("value_prop"))}</strong>
            </div>
          </div>

          <div class="benefits-grid" style="margin-bottom:48px;">
            <div class="benefit-card">
              <h3 class="benefit-title">${escapeHtml(t("benefit_1_title"))}</h3>
              <p class="benefit-desc">${escapeHtml(t("benefit_1_desc"))}</p>
            </div>
            <div class="benefit-card">
              <h3 class="benefit-title">${escapeHtml(t("benefit_2_title"))}</h3>
              <p class="benefit-desc">${escapeHtml(t("benefit_2_desc"))}</p>
            </div>
            <div class="benefit-card">
              <h3 class="benefit-title">${escapeHtml(t("benefit_3_title"))}</h3>
              <p class="benefit-desc">${escapeHtml(t("benefit_3_desc"))}</p>
            </div>
            <div class="benefit-card">
              <h3 class="benefit-title">${escapeHtml(t("benefit_4_title"))}</h3>
              <p class="benefit-desc">${escapeHtml(t("benefit_4_desc"))}</p>
            </div>
          </div>

          <div class="card-panel" style="max-width:880px;margin:0 auto;">
            <h2 class="usage-box-title" style="margin-bottom:16px;">${escapeHtml(t("usage_title"))}</h2>
            <ol class="usage-list">
              ${usageSteps
                .map(
                  (step, idx) => `
                <li>
                  <span class="usage-list-num">${formatNumber(idx + 1)}</span>
                  <span>${escapeHtml(step)}</span>
                </li>
              `
                )
                .join("")}
            </ol>
          </div>
        </div>
      </section>
    `;
  }

  function renderWishlistPage() {
    const main = document.getElementById("app-main");
    const wishedProducts = state.products.filter((p) => state.wishlist.includes(Number(p.id)));

    main.innerHTML = `
      <section class="section">
        <div class="container">
          <div class="section-header">
            <span class="section-eyebrow">DIESEL POWER</span>
            <h1 class="section-title">${escapeHtml(t("wishlist_title"))} (${formatNumber(wishedProducts.length)})</h1>
          </div>

          ${
            wishedProducts.length === 0
              ? `
            <div class="empty-state">
              <p style="font-size:1.1rem;font-weight:700;margin-bottom:16px;">${escapeHtml(t("wishlist_empty"))}</p>
              <a href="/shop" data-nav="/shop" class="btn btn-primary">${escapeHtml(t("btn_shop_now"))}</a>
            </div>
          `
              : `
            <div class="products-grid">
              ${wishedProducts.map((p) => renderProductCard(p)).join("")}
            </div>
          `
          }
        </div>
      </section>
    `;
  }

  async function syncCartWithServer(governorate = "") {
    const res = await fetch("/api/cart/calculate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        items: state.cart,
        discount_code: state.discountCode,
        governorate: governorate,
      }),
    });
    const data = await res.json();
    state.cartServerCalc = data;
    // Sync adjusted quantities if stock changed
    if (Array.isArray(data.items)) {
      state.cart = data.items.map((i) => ({
        product_id: i.product_id,
        quantity: i.quantity,
      }));
      saveCart();
    }
    return data;
  }

  async function renderCartPage() {
    const main = document.getElementById("app-main");
    if (state.cart.length === 0) {
      main.innerHTML = `
        <section class="section">
          <div class="container">
            <div class="section-header">
              <h1 class="section-title">${escapeHtml(t("cart_title"))}</h1>
            </div>
            <div class="empty-state">
              <p style="font-size:1.15rem;font-weight:700;margin-bottom:16px;">${escapeHtml(t("cart_empty"))}</p>
              <a href="/shop" data-nav="/shop" class="btn btn-primary">${escapeHtml(t("btn_shop_now"))}</a>
            </div>
          </div>
        </section>
      `;
      return;
    }

    main.innerHTML = `<div class="page-loader"><div class="spinner"></div></div>`;
    const calc = await syncCartWithServer();

    if (!calc.items || calc.items.length === 0) {
      main.innerHTML = `
        <section class="section">
          <div class="container">
            <div class="empty-state">
              <p style="font-size:1.15rem;font-weight:700;margin-bottom:16px;">${escapeHtml(t("cart_empty"))}</p>
              <a href="/shop" data-nav="/shop" class="btn btn-primary">${escapeHtml(t("btn_shop_now"))}</a>
            </div>
          </div>
        </section>
      `;
      return;
    }

    main.innerHTML = `
      <section class="section">
        <div class="container">
          <h1 class="section-title" style="margin-bottom:28px;">${escapeHtml(t("cart_title"))}</h1>

          <div class="cart-layout">
            <!-- Cart Items List -->
            <div class="card-panel">
              ${calc.items
                .map((item) => {
                  const itemName = state.lang === "ar" ? item.name_ar : item.name_en;
                  return `
                  <div class="cart-item-row" data-cart-pid="${item.product_id}">
                    <a href="/product/${escapeHtml(item.slug)}" data-nav="/product/${escapeHtml(item.slug)}">
                      <img src="${escapeHtml(item.image)}" alt="${escapeHtml(itemName)}" class="cart-item-img" />
                    </a>
                    <div>
                      <h3 style="font-size:1.05rem;font-weight:800;color:var(--navy);margin-bottom:4px;">
                        <a href="/product/${escapeHtml(item.slug)}" data-nav="/product/${escapeHtml(item.slug)}">${escapeHtml(itemName)}</a>
                      </h3>
                      <div style="font-size:0.85rem;color:var(--text-muted);margin-bottom:6px;" dir="ltr">${escapeHtml(item.size)}</div>
                      <div style="font-weight:800;color:var(--primary);">${formatPrice(item.unit_price)}</div>
                    </div>
                    <div class="qty-selector">
                      <button type="button" class="qty-btn" data-cart-action="dec" data-id="${item.product_id}">−</button>
                      <input type="text" class="qty-input" value="${formatNumber(item.quantity)}" readonly />
                      <button type="button" class="qty-btn" data-cart-action="inc" data-id="${item.product_id}">+</button>
                    </div>
                    <div style="text-align:end;min-width:105px;">
                      <div style="font-weight:900;color:var(--navy);font-size:1.05rem;margin-bottom:6px;">
                        ${formatPrice(item.line_total)}
                      </div>
                      <button type="button" class="btn btn-outline btn-sm" style="color:var(--danger);border-color:#fecaca;padding:4px 10px;min-height:30px;" data-cart-action="remove" data-id="${item.product_id}">
                        ${escapeHtml(t("remove"))}
                      </button>
                    </div>
                  </div>
                `;
                })
                .join("")}

              <div style="margin-top:20px;display:flex;justify-content:space-between;flex-wrap:wrap;gap:12px;">
                <a href="/shop" data-nav="/shop" class="btn btn-outline btn-sm">${escapeHtml(t("continue_shopping"))}</a>
              </div>
            </div>

            <!-- Order Summary & Discount Box -->
            <div class="card-panel">
              <h2 style="font-size:1.25rem;font-weight:900;color:var(--navy);margin-bottom:16px;">
                ${escapeHtml(t("order_summary"))}
              </h2>

              <!-- Discount Code Input -->
              <form id="cart-discount-form" style="margin-bottom:18px;">
                <label for="cart-discount-input" style="display:block;font-size:0.88rem;font-weight:700;margin-bottom:6px;">
                  ${escapeHtml(t("discount_code_label"))}
                </label>
                <div style="display:flex;gap:8px;">
                  <input
                    type="text"
                    id="cart-discount-input"
                    class="form-control"
                    value="${escapeHtml(state.discountCode)}"
                    placeholder="${escapeHtml(t("discount_code_placeholder"))}"
                    style="text-transform:uppercase;"
                  />
                  <button type="submit" class="btn btn-navy btn-sm">${escapeHtml(t("apply_code"))}</button>
                </div>
                ${
                  state.discountCode
                    ? `
                  <div style="margin-top:8px;font-size:0.86rem;font-weight:700;color:${
                    calc.discount_valid ? "var(--success)" : "var(--danger)"
                  };display:flex;justify-content:space-between;align-items:center;">
                    <span>${escapeHtml(
                      state.lang === "ar" ? calc.discount_message_ar : calc.discount_message_en
                    )}</span>
                    <button type="button" id="clear-discount-btn" style="background:none;border:none;color:var(--danger);cursor:pointer;text-decoration:underline;font-size:0.82rem;">
                      ${escapeHtml(t("remove_code"))}
                    </button>
                  </div>
                `
                    : ""
                }
              </form>

              <div class="summary-row">
                <span>${escapeHtml(t("subtotal"))}</span>
                <strong>${formatPrice(calc.subtotal)}</strong>
              </div>
              ${
                calc.discount_amount > 0
                  ? `
                <div class="summary-row" style="color:var(--success);font-weight:700;">
                  <span>${escapeHtml(t("discount"))} (${escapeHtml(calc.discount_code || "")})</span>
                  <span>− ${formatPrice(calc.discount_amount)}</span>
                </div>
              `
                  : ""
              }
              <div class="summary-row">
                <span>${escapeHtml(t("delivery_fee"))}</span>
                <strong>${formatPrice(calc.delivery_fee)}</strong>
              </div>
              <div class="summary-row total-row">
                <span>${escapeHtml(t("final_total"))}</span>
                <span style="color:var(--primary);">${formatPrice(calc.final_total)}</span>
              </div>

              <div style="margin-top:20px;">
                <a href="/checkout" data-nav="/checkout" class="btn btn-primary btn-block">
                  ${escapeHtml(t("proceed_to_checkout"))}
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    `;

    // Bind cart item quantity buttons
    main.querySelectorAll("[data-cart-action]").forEach((btn) => {
      btn.addEventListener("click", async () => {
        const act = btn.getAttribute("data-cart-action");
        const pid = Number(btn.getAttribute("data-id"));
        const existing = state.cart.find((i) => Number(i.product_id) === pid);
        if (!existing) return;
        if (act === "inc") updateCartQuantity(pid, existing.quantity + 1);
        else if (act === "dec") updateCartQuantity(pid, existing.quantity - 1);
        else if (act === "remove") updateCartQuantity(pid, 0);
        await renderCartPage();
      });
    });

    const discForm = document.getElementById("cart-discount-form");
    if (discForm) {
      discForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const codeVal = (document.getElementById("cart-discount-input").value || "").trim().toUpperCase();
        state.discountCode = codeVal;
        try {
          localStorage.setItem(STORAGE_KEYS.DISCOUNT, codeVal);
        } catch (_) {}
        await renderCartPage();
      });
    }

    const clearDiscBtn = document.getElementById("clear-discount-btn");
    if (clearDiscBtn) {
      clearDiscBtn.addEventListener("click", async () => {
        state.discountCode = "";
        try {
          localStorage.removeItem(STORAGE_KEYS.DISCOUNT);
        } catch (_) {}
        await renderCartPage();
      });
    }
  }

  async function renderCheckoutPage() {
    const main = document.getElementById("app-main");
    if (state.cart.length === 0) {
      navigateTo("/cart");
      return;
    }

    main.innerHTML = `<div class="page-loader"><div class="spinner"></div></div>`;
    const calc = await syncCartWithServer();

    if (!calc.items || calc.items.length === 0) {
      navigateTo("/cart");
      return;
    }

    if (!state.checkoutIdempotencyKey) {
      state.checkoutIdempotencyKey = `idem_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
    }

    const govList = state.settings.governorates || [];

    main.innerHTML = `
      <section class="section">
        <div class="container">
          <h1 class="section-title" style="margin-bottom:28px;">${escapeHtml(t("checkout_title"))}</h1>

          <div class="checkout-layout">
            <!-- Customer Delivery Form -->
            <form id="checkout-order-form" class="card-panel" novalidate>
              <h2 style="font-size:1.25rem;font-weight:900;color:var(--navy);margin-bottom:20px;">
                ${escapeHtml(t("customer_info_title"))}
              </h2>

              <div class="form-field">
                <label for="co-name">${escapeHtml(t("customer_name"))}</label>
                <input
                  type="text"
                  id="co-name"
                  class="form-control"
                  required
                  placeholder="${escapeHtml(t("customer_name_ph"))}"
                />
                <div class="field-error" id="err-customer_name"></div>
              </div>

              <div class="form-field">
                <label for="co-phone">${escapeHtml(t("phone_number"))}</label>
                <input
                  type="tel"
                  id="co-phone"
                  class="form-control"
                  dir="ltr"
                  required
                  placeholder="${escapeHtml(t("phone_number_ph"))}"
                />
                <div class="field-error" id="err-phone_number"></div>
              </div>

              <div class="form-field">
                <label for="co-gov">${escapeHtml(t("governorate"))}</label>
                <select id="co-gov" class="form-control" required>
                  <option value="">${escapeHtml(t("select_governorate"))}</option>
                  ${govList
                    .map(
                      (g) => `
                    <option value="${escapeHtml(g.id)}">
                      ${escapeHtml(state.lang === "ar" ? g.ar : g.en)}
                    </option>
                  `
                    )
                    .join("")}
                </select>
                <div class="field-error" id="err-governorate"></div>
              </div>

              <div class="form-field">
                <label for="co-address">${escapeHtml(t("delivery_address"))}</label>
                <textarea
                  id="co-address"
                  class="form-control"
                  rows="3"
                  required
                  placeholder="${escapeHtml(t("delivery_address_ph"))}"
                ></textarea>
                <div class="field-error" id="err-delivery_address"></div>
              </div>

              <div class="form-field">
                <label for="co-notes">${escapeHtml(t("order_notes"))}</label>
                <textarea
                  id="co-notes"
                  class="form-control"
                  rows="2"
                  placeholder="${escapeHtml(t("order_notes_ph"))}"
                ></textarea>
              </div>

              <!-- Discount Code at Checkout -->
              <div class="form-field" style="background:var(--bg-subtle);padding:14px;border-radius:var(--radius-sm);border:1px solid var(--border-color);">
                <label for="co-discount">${escapeHtml(t("discount_code_label"))}</label>
                <div style="display:flex;gap:8px;">
                  <input
                    type="text"
                    id="co-discount"
                    class="form-control"
                    value="${escapeHtml(state.discountCode)}"
                    placeholder="${escapeHtml(t("discount_code_placeholder"))}"
                    style="text-transform:uppercase;"
                  />
                  <button type="button" id="co-apply-discount-btn" class="btn btn-navy btn-sm">${escapeHtml(t("apply_code"))}</button>
                </div>
                <div id="co-discount-msg" style="margin-top:6px;font-size:0.85rem;font-weight:700;color:${
                  calc.discount_valid ? "var(--success)" : "var(--danger)"
                };">
                  ${
                    state.discountCode
                      ? escapeHtml(state.lang === "ar" ? calc.discount_message_ar : calc.discount_message_en)
                      : ""
                  }
                </div>
              </div>

              <!-- Payment Method -->
              <div style="margin:20px 0;padding:16px;background:var(--primary-light);border:1px solid var(--primary-border);border-radius:var(--radius-sm);">
                <div style="font-weight:900;color:var(--navy);margin-bottom:4px;">
                  ${escapeHtml(t("payment_method_title"))}: ${escapeHtml(t("payment_cod_badge"))}
                </div>
                <p style="font-size:0.9rem;color:var(--text-main);">
                  ${escapeHtml(t("cod_description"))}
                </p>
              </div>

              <div id="checkout-general-error" class="field-error" style="margin-bottom:14px;font-size:0.95rem;"></div>

              <button type="submit" id="checkout-submit-btn" class="btn btn-primary btn-block">
                ${escapeHtml(t("confirm_order_btn"))} — ${formatPrice(calc.final_total)}
              </button>
            </form>

            <!-- Order Summary Sidebar -->
            <div class="card-panel" id="checkout-summary-panel">
              <h2 style="font-size:1.25rem;font-weight:900;color:var(--navy);margin-bottom:16px;">
                ${escapeHtml(t("order_summary"))}
              </h2>
              <div style="display:flex;flex-direction:column;gap:12px;margin-bottom:16px;">
                ${calc.items
                  .map(
                    (item) => `
                  <div style="display:flex;justify-content:space-between;align-items:center;gap:10px;border-bottom:1px solid var(--border-color);padding-bottom:10px;">
                    <div style="display:flex;align-items:center;gap:10px;">
                      <img src="${escapeHtml(item.image)}" alt="" width="54" height="36" style="border-radius:6px;object-fit:cover;" />
                      <div>
                        <div style="font-weight:800;font-size:0.92rem;color:var(--navy);">
                          ${escapeHtml(state.lang === "ar" ? item.name_ar : item.name_en)}
                        </div>
                        <small style="color:var(--text-muted);">
                          ${formatNumber(item.quantity)} × ${formatPrice(item.unit_price)}
                        </small>
                      </div>
                    </div>
                    <strong style="color:var(--navy);">${formatPrice(item.line_total)}</strong>
                  </div>
                `
                  )
                  .join("")}
              </div>

              <div class="summary-row">
                <span>${escapeHtml(t("subtotal"))}</span>
                <strong id="co-sum-subtotal">${formatPrice(calc.subtotal)}</strong>
              </div>
              ${
                calc.discount_amount > 0
                  ? `
                <div class="summary-row" style="color:var(--success);font-weight:700;">
                  <span>${escapeHtml(t("discount"))} (${escapeHtml(calc.discount_code || "")})</span>
                  <span id="co-sum-discount">− ${formatPrice(calc.discount_amount)}</span>
                </div>
              `
                  : ""
              }
              <div class="summary-row">
                <span>${escapeHtml(t("delivery_fee"))}</span>
                <strong id="co-sum-delivery">${formatPrice(calc.delivery_fee)}</strong>
              </div>
              <div class="summary-row total-row">
                <span>${escapeHtml(t("final_total"))}</span>
                <span id="co-sum-total" style="color:var(--primary);">${formatPrice(calc.final_total)}</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    `;

    const applyDiscBtn = document.getElementById("co-apply-discount-btn");
    if (applyDiscBtn) {
      applyDiscBtn.addEventListener("click", async () => {
        const codeInput = document.getElementById("co-discount");
        const codeVal = (codeInput ? codeInput.value : "").trim().toUpperCase();
        state.discountCode = codeVal;
        try {
          if (codeVal) localStorage.setItem(STORAGE_KEYS.DISCOUNT, codeVal);
          else localStorage.removeItem(STORAGE_KEYS.DISCOUNT);
        } catch (_) {}
        await renderCheckoutPage();
      });
    }

    const checkoutForm = document.getElementById("checkout-order-form");
    if (checkoutForm) {
      let isSubmitting = false;
      checkoutForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        if (isSubmitting) return;

        // Clear errors
        ["customer_name", "phone_number", "governorate", "delivery_address"].forEach((f) => {
          const el = document.getElementById(`err-${f}`);
          if (el) el.textContent = "";
        });
        const genErr = document.getElementById("checkout-general-error");
        if (genErr) genErr.textContent = "";

        const customer_name = (document.getElementById("co-name").value || "").trim();
        const phone_number = (document.getElementById("co-phone").value || "").trim();
        const governorate = (document.getElementById("co-gov").value || "").trim();
        const delivery_address = (document.getElementById("co-address").value || "").trim();
        const notes = (document.getElementById("co-notes").value || "").trim();
        const discount_code = (document.getElementById("co-discount").value || "").trim().toUpperCase();

        // Client-side validation feedback
        const phoneRegex = /^(?:\+?20|0020|0)?1[0125]\d{8}$/;
        let hasErr = false;
        if (customer_name.length < 2) {
          document.getElementById("err-customer_name").textContent =
            state.lang === "ar" ? "يرجى إدخال اسم العميل بالكامل" : "Please enter your full name";
          hasErr = true;
        }
        if (!phoneRegex.test(phone_number.replace(/[\s\-()]/g, ""))) {
          document.getElementById("err-phone_number").textContent =
            state.lang === "ar"
              ? "يرجى إدخال رقم هاتف محمول مصري صحيح (مثال: 01012345678)"
              : "Please enter a valid Egyptian mobile number (e.g. 01012345678)";
          hasErr = true;
        }
        if (!governorate) {
          document.getElementById("err-governorate").textContent =
            state.lang === "ar" ? "يرجى اختيار المحافظة" : "Please select a governorate";
          hasErr = true;
        }
        if (delivery_address.length < 5) {
          document.getElementById("err-delivery_address").textContent =
            state.lang === "ar" ? "يرجى إدخال عنوان التوصيل بالتفصيل" : "Please enter your full delivery address";
          hasErr = true;
        }
        if (hasErr) return;

        isSubmitting = true;
        const submitBtn = document.getElementById("checkout-submit-btn");
        const origBtnText = submitBtn ? submitBtn.textContent : "";
        if (submitBtn) {
          submitBtn.disabled = true;
          submitBtn.textContent = t("submitting_order");
        }

        try {
          const res = await fetch("/api/orders", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              customer_name,
              phone_number,
              governorate,
              delivery_address,
              notes,
              discount_code: discount_code || null,
              idempotency_key: state.checkoutIdempotencyKey,
              items: state.cart,
            }),
          });
          const resData = await res.json();

          if (!res.ok) {
            const msg = state.lang === "ar" ? resData.error_ar : resData.error_en;
            if (resData.field && document.getElementById(`err-${resData.field}`)) {
              document.getElementById(`err-${resData.field}`).textContent = msg;
            } else if (genErr) {
              genErr.textContent = msg || "Order error";
            }
            showToast(msg || "Error", "error");
            isSubmitting = false;
            if (submitBtn) {
              submitBtn.disabled = false;
              submitBtn.textContent = origBtnText;
            }
            return;
          }

          // Order succeeded! Save token, clear cart, refresh bootstrap products, and navigate to confirmation
          const createdOrder = resData.order;
          if (createdOrder && createdOrder.access_token) {
            saveOrderToken(createdOrder.order_number, createdOrder.access_token);
          }
          state.cart = [];
          state.discountCode = "";
          state.checkoutIdempotencyKey = null;
          try {
            localStorage.removeItem(STORAGE_KEYS.CART);
            localStorage.removeItem(STORAGE_KEYS.DISCOUNT);
          } catch (_) {}
          updateHeaderBadges();
          await fetchBootstrap();

          navigateTo(
            `/order-confirmation/${encodeURIComponent(createdOrder.order_number)}?token=${encodeURIComponent(
              createdOrder.access_token || ""
            )}`
          );
        } catch (err) {
          if (genErr) genErr.textContent = String(err);
          isSubmitting = false;
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = origBtnText;
          }
        }
      });
    }
  }

  async function renderOrderConfirmationPage(orderNumber) {
    const main = document.getElementById("app-main");
    main.innerHTML = `<div class="page-loader"><div class="spinner"></div></div>`;

    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token") || getSavedOrderToken(orderNumber);

    try {
      const res = await fetch(
        `/api/orders/${encodeURIComponent(orderNumber)}?token=${encodeURIComponent(token)}`
      );
      if (!res.ok) {
        main.innerHTML = `
          <div class="container section">
            <div class="empty-state">
              <h2>${
                state.lang === "ar"
                  ? "لا يمكن عرض تفاصيل هذا الطلب أو غير مصرح بالوصول"
                  : "Order not found or unauthorized access"
              }</h2>
              <a href="/" data-nav="/" class="btn btn-primary" style="margin-top:16px;">${escapeHtml(t("nav_home"))}</a>
            </div>
          </div>
        `;
        return;
      }

      const data = await res.json();
      const o = data.order;
      const items = o.items || [];
      const waManualText =
        state.lang === "ar"
          ? `مرحباً الديزل باور، أود الاستفسار عن طلبي رقم ${o.order_number}`
          : `Hello Diesel Power, I would like to inquire about my order #${o.order_number}`;
      const waManualHref = `https://wa.me/201013514594?text=${encodeURIComponent(waManualText)}`;

      main.innerHTML = `
        <section class="section">
          <div class="container">
            <div class="confirmation-card">
              <div style="text-align:center;margin-bottom:28px;">
                <div class="confirmation-icon">
                  <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                </div>
                <h1 style="font-size:1.65rem;font-weight:900;color:var(--navy);margin-bottom:8px;">
                  ${escapeHtml(t("order_received_title"))}
                </h1>
                <p style="color:var(--text-muted);font-size:1rem;">
                  ${escapeHtml(t("order_received_sub"))}
                </p>
                <div style="margin-top:16px;display:inline-block;background:var(--primary-light);border:1px solid var(--primary-border);padding:8px 20px;border-radius:999px;font-weight:900;color:var(--navy);font-size:1.1rem;">
                  ${escapeHtml(t("order_number_label"))}: <span dir="ltr" style="color:var(--primary);">${escapeHtml(o.order_number)}</span>
                </div>
              </div>

              <!-- Delivery Details -->
              <div style="background:var(--bg-subtle);border:1px solid var(--border-color);border-radius:var(--radius-sm);padding:16px;margin-bottom:20px;">
                <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:12px;font-size:0.95rem;">
                  <div>
                    <strong style="color:var(--text-muted);display:block;">${escapeHtml(t("customer_name").replace(" *", ""))}</strong>
                    <span style="font-weight:800;color:var(--navy);">${escapeHtml(o.customer_name)}</span>
                  </div>
                  <div>
                    <strong style="color:var(--text-muted);display:block;">${escapeHtml(t("phone_number").replace(" *", ""))}</strong>
                    <span dir="ltr" style="font-weight:800;color:var(--navy);">${escapeHtml(o.phone_number)}</span>
                  </div>
                  <div>
                    <strong style="color:var(--text-muted);display:block;">${escapeHtml(t("governorate").replace(" *", ""))}</strong>
                    <span style="font-weight:800;color:var(--navy);">${escapeHtml(o.governorate)}</span>
                  </div>
                  <div>
                    <strong style="color:var(--text-muted);display:block;">${escapeHtml(t("delivery_address").replace(" *", ""))}</strong>
                    <span style="font-weight:800;color:var(--navy);">${escapeHtml(o.delivery_address)}</span>
                  </div>
                </div>
              </div>

              <!-- Ordered Items -->
              <h3 style="font-size:1.1rem;font-weight:800;color:var(--navy);margin-bottom:12px;">
                ${escapeHtml(t("ordered_items_label"))}
              </h3>
              <div style="border:1px solid var(--border-color);border-radius:var(--radius-sm);padding:12px 16px;margin-bottom:20px;">
                ${items
                  .map(
                    (item) => `
                  <div style="display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid var(--border-color);">
                    <div>
                      <strong style="color:var(--navy);">
                        ${escapeHtml(
                          state.lang === "ar"
                            ? item.product_name_ar_snapshot
                            : item.product_name_en_snapshot
                        )}
                      </strong>
                      <span style="color:var(--text-muted);font-size:0.9rem;margin-inline-start:8px;">
                        (${formatNumber(item.quantity)} × ${formatPrice(item.unit_price_snapshot)})
                      </span>
                    </div>
                    <strong style="color:var(--navy);">${formatPrice(item.line_total)}</strong>
                  </div>
                `
                  )
                  .join("")}

                <div class="summary-row" style="margin-top:8px;">
                  <span>${escapeHtml(t("subtotal"))}</span>
                  <strong>${formatPrice(o.subtotal)}</strong>
                </div>
                ${
                  Number(o.discount_amount) > 0
                    ? `
                  <div class="summary-row" style="color:var(--success);font-weight:700;">
                    <span>${escapeHtml(t("discount"))} (${escapeHtml(o.discount_code || "")})</span>
                    <span>− ${formatPrice(o.discount_amount)}</span>
                  </div>
                `
                    : ""
                }
                <div class="summary-row">
                  <span>${escapeHtml(t("delivery_fee"))}</span>
                  <strong>${formatPrice(o.delivery_fee)}</strong>
                </div>
                <div class="summary-row total-row">
                  <span>${escapeHtml(t("final_total"))} (${escapeHtml(t("payment_cod_badge"))})</span>
                  <span style="color:var(--primary);">${formatPrice(o.final_total)}</span>
                </div>
              </div>

              <!-- Optional Manual WhatsApp Contact -->
              <div style="text-align:center;background:#f0fdf4;border:1px solid #bbf7d0;border-radius:var(--radius-sm);padding:16px;margin-bottom:20px;">
                <p style="font-size:0.92rem;color:#166534;margin-bottom:10px;font-weight:600;">
                  ${escapeHtml(t("manual_whatsapp_help"))}
                </p>
                <a href="${escapeHtml(waManualHref)}" target="_blank" rel="noopener noreferrer" class="btn btn-whatsapp btn-sm">
                  ${escapeHtml(t("manual_whatsapp_btn"))}
                </a>
              </div>

              <div style="text-align:center;">
                <a href="/shop" data-nav="/shop" class="btn btn-primary">${escapeHtml(t("continue_shopping"))}</a>
              </div>
            </div>
          </div>
        </section>
      `;
    } catch (err) {
      main.innerHTML = `<div class="container section"><p>${escapeHtml(String(err))}</p></div>`;
    }
  }

  function renderLegalPage(type) {
    const main = document.getElementById("app-main");
    const isPrivacy = type === "privacy";

    if (isPrivacy) {
      main.innerHTML = `
        <section class="section">
          <div class="container">
            <div class="card-panel" style="max-width:860px;margin:0 auto;">
              <h1 class="section-title" style="margin-bottom:16px;">${escapeHtml(t("footer_privacy"))}</h1>
              <p style="margin-bottom:14px;">
                ${
                  state.lang === "ar"
                    ? "يلتزم متجر الديزل باور (Diesel Power) بحماية خصوصية بيانات العملاء. يتم جمع البيانات الضرورية فقط لتنفيذ وتوصيل الطلبات (الاسم، رقم الهاتف، المحافظة، وعنوان التوصيل)."
                    : "Diesel Power respects your privacy. We only collect information necessary to process and deliver your orders (name, phone number, governorate, and delivery address)."
                }
              </p>
              <p>
                ${
                  state.lang === "ar"
                    ? "لا يتم مشاركة بياناتك الشخصية مع أي أطراف غير مصرح لها، وتُستخدم حصرياً لتأكيد الطلبات وتوصيلها لعملائنا."
                    : "Your personal order data is never sold or shared with unauthorized third parties and is strictly used for order fulfillment and customer support."
                }
              </p>
            </div>
          </div>
        </section>
      `;
    } else {
      main.innerHTML = `
        <section class="section">
          <div class="container">
            <div class="card-panel" style="max-width:860px;margin:0 auto;">
              <h1 class="section-title" style="margin-bottom:16px;">${escapeHtml(t("footer_terms"))}</h1>
              <p style="margin-bottom:14px;">
                ${
                  state.lang === "ar"
                    ? "جميع المنتجات المعروضة على الموقع أصلية من براند الديزل باور (Diesel Power). يتم الدفع نقداً عند الاستلام (Cash on Delivery) بالعملة المحلية (الجنيه المصري EGP)."
                    : "All products listed on this website are official Diesel Power products. Orders are paid via Cash on Delivery (COD) in Egyptian Pounds (EGP)."
                }
              </p>
              <p>
                ${
                  state.lang === "ar"
                    ? "يرجى اتباع تعليمات الاستخدام الموضحة على العبوة وصفحة المنتج للحصول على أفضل النتائج والحفاظ على الأقمشة والألوان."
                    : "Please follow the product usage instructions displayed on the bottle and product detail page for optimal stain removal and fabric care."
                }
              </p>
            </div>
          </div>
        </section>
      `;
    }
  }

  // --------------------------------------------------------------------------
  // ADMIN DASHBOARD (/admin)
  // --------------------------------------------------------------------------

  async function renderAdminPage() {
    const main = document.getElementById("app-main");
    main.innerHTML = `<div class="page-loader"><div class="spinner"></div></div>`;

    try {
      const meRes = await fetch("/api/admin/me");
      if (!meRes.ok) {
        state.admin.authenticated = false;
        renderAdminLogin();
        return;
      }
      const meData = await meRes.json();
      state.admin.authenticated = true;
      state.admin.username = meData.username;
      await renderAdminDashboardShell();
    } catch (_) {
      renderAdminLogin();
    }
  }

  function renderAdminLogin() {
    const main = document.getElementById("app-main");
    main.innerHTML = `
      <section class="section">
        <div class="container">
          <div class="card-panel" style="max-width:440px;margin:20px auto;padding:32px;">
            <div style="text-align:center;margin-bottom:24px;">
              <img src="/static/images/logo.png" alt="Diesel Power" width="76" height="76" style="margin:0 auto 12px;" />
              <h1 style="font-size:1.45rem;font-weight:900;color:var(--navy);">
                ${state.lang === "ar" ? "تسجيل دخول لوحة التحكم" : "Admin Dashboard Login"}
              </h1>
              <p style="font-size:0.9rem;color:var(--text-muted);">Diesel Power — الديزل باور</p>
            </div>

            <form id="admin-login-form">
              <div class="form-field">
                <label for="admin-user">${state.lang === "ar" ? "اسم المستخدم" : "Username"}</label>
                <input type="text" id="admin-user" class="form-control" required autocomplete="username" />
              </div>
              <div class="form-field">
                <label for="admin-pass">${state.lang === "ar" ? "كلمة المرور" : "Password"}</label>
                <input type="password" id="admin-pass" class="form-control" required autocomplete="current-password" />
              </div>
              <div id="admin-login-error" class="field-error" style="margin-bottom:12px;"></div>
              <button type="submit" class="btn btn-primary btn-block">
                ${state.lang === "ar" ? "دخول" : "Sign In"}
              </button>
            </form>
          </div>
        </div>
      </section>
    `;

    const form = document.getElementById("admin-login-form");
    if (form) {
      form.addEventListener("submit", async (e) => {
        e.preventDefault();
        const errEl = document.getElementById("admin-login-error");
        if (errEl) errEl.textContent = "";
        const username = document.getElementById("admin-user").value.trim();
        const password = document.getElementById("admin-pass").value;

        const res = await fetch("/api/admin/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, password }),
        });
        const data = await res.json();
        if (!res.ok) {
          if (errEl) errEl.textContent = state.lang === "ar" ? data.error_ar : data.error_en;
          return;
        }
        state.admin.authenticated = true;
        state.admin.username = data.username;
        await renderAdminDashboardShell();
      });
    }
  }

  async function renderAdminDashboardShell() {
    const main = document.getElementById("app-main");
    const isAr = state.lang === "ar";
    const tab = state.admin.activeTab || "overview";

    main.innerHTML = `
      <div class="container admin-shell">
        <aside class="admin-sidebar">
          <div style="padding:8px 10px 16px;border-bottom:1px solid rgba(255,255,255,0.12);margin-bottom:8px;">
            <div style="font-weight:900;font-size:1.1rem;color:#fff;">DIESEL POWER</div>
            <div style="font-size:0.82rem;color:#38bdf8;">
              ${isAr ? `مرحباً، ${escapeHtml(state.admin.username)}` : `Welcome, ${escapeHtml(state.admin.username)}`}
            </div>
          </div>

          <button type="button" class="admin-nav-btn ${tab === "overview" ? "active" : ""}" data-admin-tab="overview">
            <span>${isAr ? "نظرة عامة" : "Overview"}</span>
          </button>
          <button type="button" class="admin-nav-btn ${tab === "orders" ? "active" : ""}" data-admin-tab="orders">
            <span>${isAr ? "إدارة الطلبات" : "Orders"}</span>
          </button>
          <button type="button" class="admin-nav-btn ${tab === "products" ? "active" : ""}" data-admin-tab="products">
            <span>${isAr ? "المنتجات والمخزون" : "Products & Inventory"}</span>
          </button>
          <button type="button" class="admin-nav-btn ${tab === "delivery" ? "active" : ""}" data-admin-tab="delivery">
            <span>${isAr ? "إعدادات التوصيل" : "Delivery Settings"}</span>
          </button>
          <button type="button" class="admin-nav-btn ${tab === "discounts" ? "active" : ""}" data-admin-tab="discounts">
            <span>${isAr ? "أكواد الخصم" : "Discount Codes"}</span>
          </button>
          <button type="button" class="admin-nav-btn ${tab === "reviews" ? "active" : ""}" data-admin-tab="reviews">
            <span>${isAr ? "تقييمات العملاء" : "Customer Reviews"}</span>
          </button>
          <button type="button" class="admin-nav-btn ${tab === "reports" ? "active" : ""}" data-admin-tab="reports">
            <span>${isAr ? "تقارير المبيعات" : "Sales Reports"}</span>
          </button>

          <hr style="border-color:rgba(255,255,255,0.12);margin:10px 0;" />
          <button type="button" class="admin-nav-btn" id="admin-logout-btn" style="color:#fca5a5;">
            <span>${isAr ? "تسجيل الخروج" : "Logout"}</span>
          </button>
        </aside>

        <section id="admin-tab-content" class="card-panel">
          <div class="page-loader"><div class="spinner"></div></div>
        </section>
      </div>
      <div id="admin-modal-root"></div>
    `;

    main.querySelectorAll("[data-admin-tab]").forEach((btn) => {
      btn.addEventListener("click", () => {
        state.admin.activeTab = btn.getAttribute("data-admin-tab");
        renderAdminDashboardShell();
      });
    });

    const logoutBtn = document.getElementById("admin-logout-btn");
    if (logoutBtn) {
      logoutBtn.addEventListener("click", async () => {
        await fetch("/api/admin/logout", { method: "POST" });
        state.admin.authenticated = false;
        renderAdminLogin();
      });
    }

    if (tab === "overview") await renderAdminOverviewTab();
    else if (tab === "orders") await renderAdminOrdersTab();
    else if (tab === "products") await renderAdminProductsTab();
    else if (tab === "delivery") await renderAdminDeliveryTab();
    else if (tab === "discounts") await renderAdminDiscountsTab();
    else if (tab === "reviews") await renderAdminReviewsTab();
    else if (tab === "reports") await renderAdminReportsTab();
  }

  async function renderAdminOverviewTab() {
    const box = document.getElementById("admin-tab-content");
    const isAr = state.lang === "ar";
    const res = await fetch("/api/admin/overview");
    const d = await res.json();
    state.admin.overview = d;

    box.innerHTML = `
      <h2 style="font-size:1.4rem;font-weight:900;color:var(--navy);margin-bottom:20px;">
        ${isAr ? "ملخص المتجر والأداء" : "Store Overview & KPIs"}
      </h2>

      <div class="kpi-grid">
        <div class="kpi-card">
          <div class="kpi-label">${isAr ? "إجمالي الطلبات" : "Total Orders"}</div>
          <div class="kpi-value">${formatNumber(d.total_orders)}</div>
        </div>
        <div class="kpi-card">
          <div class="kpi-label">${isAr ? "إجمالي المبيعات المعتمدة" : "Total Net Sales"}</div>
          <div class="kpi-value" style="color:var(--primary);">${formatPrice(d.total_sales)}</div>
        </div>
        <div class="kpi-card">
          <div class="kpi-label">${isAr ? "طلبات قيد الانتظار" : "Pending Orders"}</div>
          <div class="kpi-value" style="color:var(--warning);">${formatNumber(d.pending_orders)}</div>
        </div>
        <div class="kpi-card">
          <div class="kpi-label">${isAr ? "طلبات مكتملة (تم التوصيل)" : "Completed Orders"}</div>
          <div class="kpi-value" style="color:var(--success);">${formatNumber(d.completed_orders)}</div>
        </div>
      </div>

      ${
        d.low_stock_products && d.low_stock_products.length > 0
          ? `
        <div style="background:var(--warning-bg);border:1px solid #fde68a;border-radius:var(--radius-sm);padding:14px 18px;margin-bottom:24px;">
          <h3 style="font-size:1rem;font-weight:800;color:var(--warning);margin-bottom:8px;">
            ${isAr ? "تنبيهات انخفاض المخزون" : "Low-Stock Alerts"}
          </h3>
          <ul style="padding-inline-start:18px;font-size:0.92rem;">
            ${d.low_stock_products
              .map(
                (lp) =>
                  `<li><strong>${escapeHtml(isAr ? lp.name_ar : lp.name_en)}</strong>: ${formatNumber(
                    lp.stock_quantity
                  )} ${isAr ? "عبوة متبقية" : "units left"}</li>`
              )
              .join("")}
          </ul>
        </div>
      `
          : ""
      }

      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:24px;">
        <div>
          <h3 style="font-size:1.1rem;font-weight:800;color:var(--navy);margin-bottom:12px;">
            ${isAr ? "المنتجات الأكثر مبيعاً" : "Best-Selling Products"}
          </h3>
          ${
            !d.best_selling_products || d.best_selling_products.length === 0
              ? `<p style="color:var(--text-muted);font-size:0.9rem;">${isAr ? "لا توجد مبيعات مسجلة بعد" : "No sales recorded yet"}</p>`
              : `
            <div class="table-responsive">
              <table class="data-table">
                <thead>
                  <tr>
                    <th>${isAr ? "المنتج" : "Product"}</th>
                    <th>${isAr ? "الكمية المباعة" : "Qty Sold"}</th>
                    <th>${isAr ? "الإيراد" : "Revenue"}</th>
                  </tr>
                </thead>
                <tbody>
                  ${d.best_selling_products
                    .map(
                      (bp) => `
                    <tr>
                      <td><strong>${escapeHtml(isAr ? bp.name_ar : bp.name_en)}</strong></td>
                      <td>${formatNumber(bp.total_quantity_sold)}</td>
                      <td>${formatPrice(bp.total_revenue)}</td>
                    </tr>
                  `
                    )
                    .join("")}
                </tbody>
              </table>
            </div>
          `
          }
        </div>

        <div>
          <h3 style="font-size:1.1rem;font-weight:800;color:var(--navy);margin-bottom:12px;">
            ${isAr ? "أحدث الطلبات" : "Recent Orders"}
          </h3>
          ${
            !d.recent_orders || d.recent_orders.length === 0
              ? `<p style="color:var(--text-muted);font-size:0.9rem;">${isAr ? "لا توجد طلبات حتى الآن" : "No orders yet"}</p>`
              : `
            <div class="table-responsive">
              <table class="data-table">
                <thead>
                  <tr>
                    <th>${isAr ? "رقم الطلب" : "Order #"}</th>
                    <th>${isAr ? "العميل" : "Customer"}</th>
                    <th>${isAr ? "الإجمالي" : "Total"}</th>
                    <th>${isAr ? "الحالة" : "Status"}</th>
                  </tr>
                </thead>
                <tbody>
                  ${d.recent_orders
                    .map(
                      (ro) => `
                    <tr>
                      <td dir="ltr"><strong>${escapeHtml(ro.order_number)}</strong></td>
                      <td>${escapeHtml(ro.customer_name)}</td>
                      <td>${formatPrice(ro.final_total)}</td>
                      <td><span class="status-badge status-${escapeHtml(ro.order_status)}">${escapeHtml(
                        t("status_" + ro.order_status)
                      )}</span></td>
                    </tr>
                  `
                    )
                    .join("")}
                </tbody>
              </table>
            </div>
          `
          }
        </div>
      </div>
    `;
  }

  async function renderAdminOrdersTab() {
    const box = document.getElementById("admin-tab-content");
    const isAr = state.lang === "ar";
    const f = state.admin.orderFilters;

    const params = new URLSearchParams();
    if (f.q) params.set("q", f.q);
    if (f.status && f.status !== "all") params.set("status", f.status);
    if (f.date_from) params.set("date_from", f.date_from);
    if (f.date_to) params.set("date_to", f.date_to);

    const res = await fetch(`/api/admin/orders?${params.toString()}`);
    const data = await res.json();
    state.admin.orders = data.orders || [];

    const statuses = ["Pending", "Confirmed", "Processing", "Shipped", "Delivered", "Cancelled"];

    box.innerHTML = `
      <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px;margin-bottom:20px;">
        <h2 style="font-size:1.4rem;font-weight:900;color:var(--navy);">
          ${isAr ? "إدارة الطلبات" : "Order Management"} (${formatNumber(state.admin.orders.length)})
        </h2>
        <a href="/api/admin/orders/export?${params.toString()}" class="btn btn-navy btn-sm" target="_blank">
          ${isAr ? "تصدير إلى Excel (CSV)" : "Export Orders (CSV)"}
        </a>
      </div>

      <!-- Order Search & Filters -->
      <form id="admin-order-filter-form" class="shop-toolbar" style="grid-template-columns:repeat(auto-fit,minmax(160px,1fr));margin-bottom:20px;">
        <div class="filter-group">
          <label>${isAr ? "بحث (رقم الطلب / الاسم / الهاتف)" : "Search (# / Name / Phone)"}</label>
          <input type="search" id="ao-q" class="form-control" value="${escapeHtml(f.q)}" />
        </div>
        <div class="filter-group">
          <label>${isAr ? "الحالة" : "Status"}</label>
          <select id="ao-status" class="form-control">
            <option value="all">${isAr ? "الكل" : "All"}</option>
            ${statuses
              .map(
                (s) =>
                  `<option value="${s}" ${f.status === s ? "selected" : ""}>${escapeHtml(
                    t("status_" + s)
                  )}</option>`
              )
              .join("")}
          </select>
        </div>
        <div class="filter-group">
          <label>${isAr ? "من تاريخ" : "From Date"}</label>
          <input type="date" id="ao-from" class="form-control" value="${escapeHtml(f.date_from)}" />
        </div>
        <div class="filter-group">
          <label>${isAr ? "إلى تاريخ" : "To Date"}</label>
          <input type="date" id="ao-to" class="form-control" value="${escapeHtml(f.date_to)}" />
        </div>
        <div class="filter-group">
          <button type="submit" class="btn btn-primary btn-sm btn-block">${isAr ? "تطبيق الفلتر" : "Filter"}</button>
        </div>
      </form>

      <div class="table-responsive">
        <table class="data-table">
          <thead>
            <tr>
              <th>${isAr ? "رقم الطلب" : "Order #"}</th>
              <th>${isAr ? "التاريخ" : "Date"}</th>
              <th>${isAr ? "العميل" : "Customer"}</th>
              <th>${isAr ? "الهاتف" : "Phone"}</th>
              <th>${isAr ? "المحافظة" : "Governorate"}</th>
              <th>${isAr ? "التوصيل" : "Delivery"}</th>
              <th>${isAr ? "الإجمالي" : "Total"}</th>
              <th>${isAr ? "الحالة" : "Status"}</th>
              <th>${isAr ? "إجراءات" : "Actions"}</th>
            </tr>
          </thead>
          <tbody>
            ${
              state.admin.orders.length === 0
                ? `<tr><td colspan="9" style="text-align:center;padding:24px;">${
                    isAr ? "لا توجد طلبات مطابقة" : "No matching orders"
                  }</td></tr>`
                : state.admin.orders
                    .map(
                      (o) => `
                  <tr>
                    <td dir="ltr"><strong>${escapeHtml(o.order_number)}</strong></td>
                    <td dir="ltr">${escapeHtml((o.created_at || "").slice(0, 16).replace("T", " "))}</td>
                    <td>${escapeHtml(o.customer_name)}</td>
                    <td dir="ltr">${escapeHtml(o.phone_number)}</td>
                    <td>${escapeHtml(o.governorate)}</td>
                    <td>${formatPrice(o.delivery_fee)}</td>
                    <td><strong>${formatPrice(o.final_total)}</strong></td>
                    <td>
                      <select class="form-control" style="min-height:34px;padding:4px 8px;font-size:0.84rem;" data-order-status-select="${o.id}">
                        ${statuses
                          .map(
                            (s) =>
                              `<option value="${s}" ${o.order_status === s ? "selected" : ""}>${escapeHtml(
                                t("status_" + s)
                              )}</option>`
                          )
                          .join("")}
                      </select>
                    </td>
                    <td>
                      <button type="button" class="btn btn-outline btn-sm" data-view-order="${o.id}">
                        ${isAr ? "عرض وتعديل" : "Details"}
                      </button>
                    </td>
                  </tr>
                `
                    )
                    .join("")
            }
          </tbody>
        </table>
      </div>
    `;

    const filterForm = document.getElementById("admin-order-filter-form");
    if (filterForm) {
      filterForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        state.admin.orderFilters = {
          q: document.getElementById("ao-q").value.trim(),
          status: document.getElementById("ao-status").value,
          date_from: document.getElementById("ao-from").value,
          date_to: document.getElementById("ao-to").value,
        };
        await renderAdminOrdersTab();
      });
    }

    box.querySelectorAll("[data-order-status-select]").forEach((sel) => {
      sel.addEventListener("change", async () => {
        const oid = Number(sel.getAttribute("data-order-status-select"));
        const newStatus = sel.value;
        const r = await fetch(`/api/admin/orders/${oid}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ order_status: newStatus }),
        });
        if (r.ok) {
          showToast(isAr ? "تم تحديث حالة الطلب" : "Order status updated", "success");
          await fetchBootstrap();
          await renderAdminOrdersTab();
        } else {
          const err = await r.json();
          showToast(isAr ? err.error_ar : err.error_en, "error");
          await renderAdminOrdersTab();
        }
      });
    });

    box.querySelectorAll("[data-view-order]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const oid = Number(btn.getAttribute("data-view-order"));
        const ord = state.admin.orders.find((x) => Number(x.id) === oid);
        if (ord) openAdminOrderModal(ord);
      });
    });
  }

  function openAdminOrderModal(o) {
    const modalRoot = document.getElementById("admin-modal-root");
    const isAr = state.lang === "ar";
    const statuses = ["Pending", "Confirmed", "Processing", "Shipped", "Delivered", "Cancelled"];

    modalRoot.innerHTML = `
      <div class="modal-backdrop" id="order-modal-backdrop">
        <div class="modal-box">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;">
            <h3 style="font-size:1.25rem;font-weight:900;color:var(--navy);">
              ${isAr ? "تفاصيل الطلب" : "Order Details"} — <span dir="ltr">${escapeHtml(o.order_number)}</span>
            </h3>
            <button type="button" class="btn btn-outline btn-sm" id="close-order-modal-btn">✕</button>
          </div>

          <form id="admin-edit-order-form">
            <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:12px;">
              <div class="form-field">
                <label>${isAr ? "اسم العميل" : "Customer Name"}</label>
                <input type="text" id="mod-o-name" class="form-control" value="${escapeHtml(o.customer_name)}" required />
              </div>
              <div class="form-field">
                <label>${isAr ? "رقم الهاتف" : "Phone"}</label>
                <input type="text" id="mod-o-phone" class="form-control" dir="ltr" value="${escapeHtml(o.phone_number)}" required />
              </div>
              <div class="form-field">
                <label>${isAr ? "المحافظة" : "Governorate"}</label>
                <input type="text" id="mod-o-gov" class="form-control" value="${escapeHtml(o.governorate)}" required />
              </div>
              <div class="form-field">
                <label>${isAr ? "حالة الطلب" : "Order Status"}</label>
                <select id="mod-o-status" class="form-control">
                  ${statuses
                    .map(
                      (s) =>
                        `<option value="${s}" ${o.order_status === s ? "selected" : ""}>${escapeHtml(
                          t("status_" + s)
                        )}</option>`
                    )
                    .join("")}
                </select>
              </div>
            </div>

            <div class="form-field">
              <label>${isAr ? "عنوان التوصيل" : "Delivery Address"}</label>
              <textarea id="mod-o-addr" class="form-control" rows="2">${escapeHtml(o.delivery_address)}</textarea>
            </div>

            <div class="form-field">
              <label>${isAr ? "ملاحظات" : "Notes"}</label>
              <textarea id="mod-o-notes" class="form-control" rows="2">${escapeHtml(o.notes || "")}</textarea>
            </div>

            <div style="background:var(--bg-subtle);padding:14px;border-radius:var(--radius-sm);margin-bottom:16px;">
              <h4 style="margin-bottom:8px;color:var(--navy);">${isAr ? "المنتجات" : "Ordered Items"}</h4>
              ${(o.items || [])
                .map(
                  (i) => `
                <div style="display:flex;justify-content:space-between;padding:6px 0;border-bottom:1px solid var(--border-color);">
                  <span>${escapeHtml(isAr ? i.product_name_ar_snapshot : i.product_name_en_snapshot)} × ${i.quantity} (@ ${formatPrice(i.unit_price_snapshot)})</span>
                  <strong>${formatPrice(i.line_total)}</strong>
                </div>
              `
                )
                .join("")}
              <div style="margin-top:10px;font-size:0.9rem;">
                <div>${isAr ? "المجموع الفرعي" : "Subtotal"}: <strong>${formatPrice(o.subtotal)}</strong></div>
                <div>${isAr ? "الخصم" : "Discount"}: <strong>${formatPrice(o.discount_amount)}</strong></div>
                <div>${isAr ? "مصاريف التوصيل المحفوظة" : "Saved Delivery Fee"}: <strong>${formatPrice(o.delivery_fee)}</strong></div>
                <div style="font-size:1.1rem;color:var(--primary);margin-top:4px;">
                  ${isAr ? "الإجمالي النهائي" : "Final Total"}: <strong>${formatPrice(o.final_total)}</strong>
                </div>
              </div>
            </div>

            <div style="display:flex;justify-content:flex-end;gap:10px;">
              <button type="submit" class="btn btn-primary btn-sm">${isAr ? "حفظ التعديلات" : "Save Changes"}</button>
            </div>
          </form>
        </div>
      </div>
    `;

    document.getElementById("close-order-modal-btn").addEventListener("click", () => {
      modalRoot.innerHTML = "";
    });

    document.getElementById("admin-edit-order-form").addEventListener("submit", async (e) => {
      e.preventDefault();
      const payload = {
        customer_name: document.getElementById("mod-o-name").value.trim(),
        phone_number: document.getElementById("mod-o-phone").value.trim(),
        governorate: document.getElementById("mod-o-gov").value.trim(),
        order_status: document.getElementById("mod-o-status").value,
        delivery_address: document.getElementById("mod-o-addr").value.trim(),
        notes: document.getElementById("mod-o-notes").value.trim(),
      };
      const r = await fetch(`/api/admin/orders/${o.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (r.ok) {
        modalRoot.innerHTML = "";
        showToast(isAr ? "تم تحديث الطلب بنجاح" : "Order updated successfully", "success");
        await fetchBootstrap();
        await renderAdminOrdersTab();
      } else {
        const err = await r.json();
        showToast(isAr ? err.error_ar : err.error_en, "error");
      }
    });
  }

  async function renderAdminProductsTab() {
    const box = document.getElementById("admin-tab-content");
    const isAr = state.lang === "ar";
    const res = await fetch("/api/admin/products");
    const data = await res.json();
    state.admin.products = data.products || [];

    box.innerHTML = `
      <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px;margin-bottom:20px;">
        <h2 style="font-size:1.4rem;font-weight:900;color:var(--navy);">
          ${isAr ? "إدارة المنتجات والمخزون" : "Product & Inventory Management"}
        </h2>
        <button type="button" class="btn btn-primary btn-sm" id="admin-add-product-btn">
          + ${isAr ? "إضافة منتج جديد" : "Add New Product"}
        </button>
      </div>

      <div class="table-responsive">
        <table class="data-table">
          <thead>
            <tr>
              <th>${isAr ? "الصورة" : "Image"}</th>
              <th>${isAr ? "الاسم (عربي / EN)" : "Name (AR / EN)"}</th>
              <th>${isAr ? "الحجم" : "Size"}</th>
              <th>${isAr ? "السعر الحالي" : "Current Price"}</th>
              <th>${isAr ? "السعر الأصلي" : "Original Price"}</th>
              <th>${isAr ? "المخزون" : "Stock"}</th>
              <th>${isAr ? "الحالة" : "Status"}</th>
              <th>${isAr ? "إجراءات" : "Actions"}</th>
            </tr>
          </thead>
          <tbody>
            ${state.admin.products
              .map(
                (p) => `
              <tr>
                <td>
                  <img src="${escapeHtml((p.images && p.images[0]) || "/static/images/logo.png")}" alt="" width="64" height="40" style="object-fit:cover;border-radius:6px;" />
                </td>
                <td>
                  <div><strong>${escapeHtml(p.name_ar)}</strong></div>
                  <small style="color:var(--text-muted);">${escapeHtml(p.name_en)}</small>
                </td>
                <td dir="ltr">${escapeHtml(p.size)}</td>
                <td><strong>${formatPrice(p.current_price)}</strong></td>
                <td><s>${formatPrice(p.original_price)}</s></td>
                <td><strong>${formatNumber(p.stock_quantity)}</strong></td>
                <td>
                  <span class="badge-stock ${p.in_stock ? "badge-in-stock" : "badge-out-of-stock"}">
                    ${escapeHtml(p.availability)}
                  </span>
                </td>
                <td>
                  <div style="display:flex;gap:6px;">
                    <button type="button" class="btn btn-outline btn-sm" data-edit-prod="${p.id}">
                      ${isAr ? "تعديل" : "Edit"}
                    </button>
                    <button type="button" class="btn btn-outline btn-sm" style="color:var(--danger);border-color:#fecaca;" data-del-prod="${p.id}">
                      ${isAr ? "حذف" : "Delete"}
                    </button>
                  </div>
                </td>
              </tr>
            `
              )
              .join("")}
          </tbody>
        </table>
      </div>
    `;

    document.getElementById("admin-add-product-btn").addEventListener("click", () => {
      openAdminProductModal(null);
    });

    box.querySelectorAll("[data-edit-prod]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const pid = Number(btn.getAttribute("data-edit-prod"));
        const prod = state.admin.products.find((x) => Number(x.id) === pid);
        if (prod) openAdminProductModal(prod);
      });
    });

    box.querySelectorAll("[data-del-prod]").forEach((btn) => {
      btn.addEventListener("click", async () => {
        const pid = Number(btn.getAttribute("data-del-prod"));
        const r = await fetch(`/api/admin/products/${pid}`, { method: "DELETE" });
        if (r.ok) {
          showToast(isAr ? "تم حذف المنتج" : "Product deleted", "success");
          await fetchBootstrap();
          await renderAdminProductsTab();
        }
      });
    });
  }

  function openAdminProductModal(prod) {
    const modalRoot = document.getElementById("admin-modal-root");
    const isAr = state.lang === "ar";
    const isEdit = Boolean(prod);

    const p = prod || {
      name_ar: "",
      name_en: "",
      description_ar:
        "الديزل باور مزيل بقع فائق القوة، صمم لإزالة أصعب البقع من الملابس والمنسوجات بفضل تركيبته المتطورة التي تعمل على تفكيك البقع بفعالية، مع الحفاظ على الأقمشة والألوان عند استخدامه وفقا للتعليمات.",
      description_en: "",
      category_ar: "مزيلات بقع",
      category_en: "Stain Removers",
      size: "220 ml",
      current_price: 99,
      original_price: 120,
      stock_quantity: 100,
      availability: "in_stock",
      images: ["/static/images/product-rust.jpg"],
      usage_instructions_ar: EXACT_USAGE_AR,
      usage_instructions_en: EXACT_USAGE_EN,
    };

    modalRoot.innerHTML = `
      <div class="modal-backdrop">
        <div class="modal-box">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;">
            <h3 style="font-size:1.25rem;font-weight:900;color:var(--navy);">
              ${isEdit ? (isAr ? "تعديل المنتج" : "Edit Product") : isAr ? "إضافة منتج جديد" : "Add Product"}
            </h3>
            <button type="button" class="btn btn-outline btn-sm" id="close-prod-modal-btn">✕</button>
          </div>

          <form id="admin-prod-form">
            <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:12px;">
              <div class="form-field">
                <label>${isAr ? "الاسم بالعربية *" : "Arabic Name *"}</label>
                <input type="text" id="mp-name-ar" class="form-control" value="${escapeHtml(p.name_ar)}" required />
              </div>
              <div class="form-field">
                <label>${isAr ? "الاسم بالإنجليزية *" : "English Name *"}</label>
                <input type="text" id="mp-name-en" class="form-control" value="${escapeHtml(p.name_en)}" required />
              </div>
              <div class="form-field">
                <label>${isAr ? "الفئة بالعربية" : "Arabic Category"}</label>
                <input type="text" id="mp-cat-ar" class="form-control" value="${escapeHtml(p.category_ar)}" required />
              </div>
              <div class="form-field">
                <label>${isAr ? "الفئة بالإنجليزية" : "English Category"}</label>
                <input type="text" id="mp-cat-en" class="form-control" value="${escapeHtml(p.category_en)}" required />
              </div>
              <div class="form-field">
                <label>${isAr ? "الحجم" : "Size"}</label>
                <input type="text" id="mp-size" class="form-control" dir="ltr" value="${escapeHtml(p.size)}" required />
              </div>
              <div class="form-field">
                <label>${isAr ? "السعر الحالي (EGP) *" : "Current Price (EGP) *"}</label>
                <input type="number" step="0.01" min="0" id="mp-price-curr" class="form-control" value="${p.current_price}" required />
              </div>
              <div class="form-field">
                <label>${isAr ? "السعر الأصلي قبل الخصم (EGP)" : "Original Price (EGP)"}</label>
                <input type="number" step="0.01" min="0" id="mp-price-orig" class="form-control" value="${p.original_price}" required />
              </div>
              <div class="form-field">
                <label>${isAr ? "كمية المخزون *" : "Stock Quantity *"}</label>
                <input type="number" min="0" id="mp-stock" class="form-control" value="${p.stock_quantity}" required />
              </div>
              <div class="form-field">
                <label>${isAr ? "حالة التوفر" : "Availability"}</label>
                <select id="mp-avail" class="form-control">
                  <option value="in_stock" ${p.availability === "in_stock" ? "selected" : ""}>in_stock (${isAr ? "متوفر" : "In Stock"})</option>
                  <option value="out_of_stock" ${p.availability === "out_of_stock" ? "selected" : ""}>out_of_stock (${isAr ? "نفد" : "Out of Stock"})</option>
                  <option value="disabled" ${p.availability === "disabled" ? "selected" : ""}>disabled (${isAr ? "مخفي" : "Disabled"})</option>
                </select>
              </div>
            </div>

            <div class="form-field">
              <label>${isAr ? "رابط الصورة أو رفع صورة جديدة" : "Product Image URL / Upload"}</label>
              <div style="display:flex;gap:8px;align-items:center;">
                <input type="text" id="mp-image-url" class="form-control" dir="ltr" value="${escapeHtml((p.images && p.images[0]) || "")}" required />
                <input type="file" id="mp-image-file" accept=".jpg,.jpeg,.png,.webp" style="max-width:200px;" />
              </div>
            </div>

            <div class="form-field">
              <label>${isAr ? "الوصف بالعربية" : "Arabic Description"}</label>
              <textarea id="mp-desc-ar" class="form-control" rows="2" required>${escapeHtml(p.description_ar)}</textarea>
            </div>

            <div class="form-field">
              <label>${isAr ? "الوصف بالإنجليزية" : "English Description"}</label>
              <textarea id="mp-desc-en" class="form-control" rows="2" required>${escapeHtml(p.description_en)}</textarea>
            </div>

            <div class="form-field">
              <label>${isAr ? "تعليمات الاستخدام بالعربية (سطر لكل خطوة)" : "Arabic Usage Instructions (one per line)"}</label>
              <textarea id="mp-usage-ar" class="form-control" rows="4">${escapeHtml((p.usage_instructions_ar || []).join("\n"))}</textarea>
            </div>

            <div class="form-field">
              <label>${isAr ? "تعليمات الاستخدام بالإنجليزية (سطر لكل خطوة)" : "English Usage Instructions (one per line)"}</label>
              <textarea id="mp-usage-en" class="form-control" rows="4">${escapeHtml((p.usage_instructions_en || []).join("\n"))}</textarea>
            </div>

            <div style="display:flex;justify-content:flex-end;gap:10px;">
              <button type="submit" class="btn btn-primary btn-sm">${isAr ? "حفظ المنتج" : "Save Product"}</button>
            </div>
          </form>
        </div>
      </div>
    `;

    document.getElementById("close-prod-modal-btn").addEventListener("click", () => {
      modalRoot.innerHTML = "";
    });

    const fileInput = document.getElementById("mp-image-file");
    if (fileInput) {
      fileInput.addEventListener("change", async () => {
        if (!fileInput.files || !fileInput.files[0]) return;
        const fd = new FormData();
        fd.append("file", fileInput.files[0]);
        const upRes = await fetch("/api/admin/upload", {
          method: "POST",
          body: fd,
        });
        const upData = await upRes.json();
        if (upRes.ok && upData.url) {
          document.getElementById("mp-image-url").value = upData.url;
          showToast(isAr ? "تم رفع الصورة بنجاح" : "Image uploaded successfully", "success");
        } else {
          showToast(isAr ? upData.error_ar : upData.error_en, "error");
        }
      });
    }

    document.getElementById("admin-prod-form").addEventListener("submit", async (e) => {
      e.preventDefault();
      const payload = {
        name_ar: document.getElementById("mp-name-ar").value.trim(),
        name_en: document.getElementById("mp-name-en").value.trim(),
        category_ar: document.getElementById("mp-cat-ar").value.trim(),
        category_en: document.getElementById("mp-cat-en").value.trim(),
        size: document.getElementById("mp-size").value.trim(),
        current_price: Number(document.getElementById("mp-price-curr").value),
        original_price: Number(document.getElementById("mp-price-orig").value),
        stock_quantity: Number(document.getElementById("mp-stock").value),
        availability: document.getElementById("mp-avail").value,
        images: [document.getElementById("mp-image-url").value.trim()],
        description_ar: document.getElementById("mp-desc-ar").value.trim(),
        description_en: document.getElementById("mp-desc-en").value.trim(),
        usage_instructions_ar: document.getElementById("mp-usage-ar").value,
        usage_instructions_en: document.getElementById("mp-usage-en").value,
      };

      const url = isEdit ? `/api/admin/products/${prod.id}` : "/api/admin/products";
      const method = isEdit ? "PUT" : "POST";
      const r = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (r.ok) {
        modalRoot.innerHTML = "";
        showToast(isAr ? "تم حفظ المنتج بنجاح" : "Product saved successfully", "success");
        await fetchBootstrap();
        await renderAdminProductsTab();
      } else {
        const err = await r.json();
        showToast(isAr ? err.error_ar : err.error_en, "error");
      }
    });
  }

  async function renderAdminDeliveryTab() {
    const box = document.getElementById("admin-tab-content");
    const isAr = state.lang === "ar";
    const res = await fetch("/api/admin/settings");
    const data = await res.json();
    const s = data.settings || {};

    box.innerHTML = `
      <h2 style="font-size:1.4rem;font-weight:900;color:var(--navy);margin-bottom:16px;">
        ${isAr ? "إعدادات مصاريف التوصيل والمتجر" : "Delivery Fee & Store Settings"}
      </h2>
      <p style="color:var(--text-muted);margin-bottom:20px;">
        ${
          isAr
            ? "سعر التوصيل الافتراضي يطبق فوراً على جميع الطلبات الجديدة عند الدفع، مع الحفاظ على أسعار التوصيل التاريخية للطلبات السابقة دون تغيير."
            : "Changing the default delivery fee immediately applies to new checkout calculations while preserving historical order delivery fees."
        }
      </p>

      <form id="admin-delivery-settings-form" style="max-width:520px;">
        <div class="form-field">
          <label for="adm-delivery-fee">
            ${isAr ? "سعر التوصيل الافتراضي للطلب (ج.م / EGP) *" : "Default Delivery Fee per Order (EGP) *"}
          </label>
          <input
            type="number"
            step="0.5"
            min="0"
            id="adm-delivery-fee"
            class="form-control"
            value="${s.delivery_fee !== undefined ? s.delivery_fee : 70}"
            required
          />
        </div>

        <div class="form-field">
          <label for="adm-low-stock">
            ${isAr ? "حد التنبيه لانخفاض المخزون" : "Low-Stock Alert Threshold"}
          </label>
          <input
            type="number"
            min="0"
            id="adm-low-stock"
            class="form-control"
            value="${s.low_stock_threshold !== undefined ? s.low_stock_threshold : 10}"
          />
        </div>

        <div id="adm-delivery-confirmation" style="margin-bottom:14px;font-weight:800;color:var(--success);"></div>

        <button type="submit" class="btn btn-primary" id="adm-save-delivery-btn">
          ${isAr ? "حفظ سعر التوصيل والإعدادات" : "Save Delivery Fee & Settings"}
        </button>
      </form>
    `;

    const form = document.getElementById("admin-delivery-settings-form");
    if (form) {
      form.addEventListener("submit", async (e) => {
        e.preventDefault();
        const feeVal = Number(document.getElementById("adm-delivery-fee").value);
        const lowStockVal = Number(document.getElementById("adm-low-stock").value);
        const confEl = document.getElementById("adm-delivery-confirmation");

        const r = await fetch("/api/admin/settings", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            delivery_fee: feeVal,
            low_stock_threshold: lowStockVal,
          }),
        });
        const resData = await r.json();
        if (r.ok) {
          state.settings = resData.settings;
          const msg = isAr ? resData.message_ar : resData.message_en;
          if (confEl) confEl.textContent = msg;
          showToast(msg, "success");
        } else {
          const errMsg = isAr ? resData.error_ar : resData.error_en;
          showToast(errMsg, "error");
        }
      });
    }
  }

  async function renderAdminDiscountsTab() {
    const box = document.getElementById("admin-tab-content");
    const isAr = state.lang === "ar";
    const res = await fetch("/api/admin/discounts");
    const data = await res.json();
    state.admin.discounts = data.discounts || [];

    box.innerHTML = `
      <h2 style="font-size:1.4rem;font-weight:900;color:var(--navy);margin-bottom:20px;">
        ${isAr ? "إدارة أكواد الخصم" : "Discount Codes Management"}
      </h2>

      <form id="admin-create-discount-form" class="shop-toolbar" style="grid-template-columns:repeat(auto-fit,minmax(150px,1fr));margin-bottom:24px;">
        <div class="filter-group">
          <label>${isAr ? "الكود *" : "Code *"}</label>
          <input type="text" id="ad-code" class="form-control" placeholder="DIESEL10" style="text-transform:uppercase;" required />
        </div>
        <div class="filter-group">
          <label>${isAr ? "النوع" : "Type"}</label>
          <select id="ad-type" class="form-control">
            <option value="percentage">${isAr ? "نسبة مئوية (%)" : "Percentage (%)"}</option>
            <option value="fixed">${isAr ? "مبلغ ثابت (EGP)" : "Fixed Amount (EGP)"}</option>
          </select>
        </div>
        <div class="filter-group">
          <label>${isAr ? "القيمة *" : "Value *"}</label>
          <input type="number" step="0.5" min="1" id="ad-val" class="form-control" placeholder="10" required />
        </div>
        <div class="filter-group">
          <label>${isAr ? "تاريخ الانتهاء" : "Expiry Date"}</label>
          <input type="date" id="ad-exp" class="form-control" />
        </div>
        <div class="filter-group">
          <label>${isAr ? "الحد الأقصى للاستخدام" : "Usage Limit"}</label>
          <input type="number" min="1" id="ad-limit" class="form-control" placeholder="${isAr ? "غير محدود" : "Unlimited"}" />
        </div>
        <div class="filter-group">
          <button type="submit" class="btn btn-primary btn-sm btn-block">+ ${isAr ? "إضافة كود" : "Create Code"}</button>
        </div>
      </form>

      <div class="table-responsive">
        <table class="data-table">
          <thead>
            <tr>
              <th>${isAr ? "الكود" : "Code"}</th>
              <th>${isAr ? "النوع والقيمة" : "Discount"}</th>
              <th>${isAr ? "تاريخ الانتهاء" : "Expiry"}</th>
              <th>${isAr ? "مرات الاستخدام" : "Usage"}</th>
              <th>${isAr ? "الحالة" : "Status"}</th>
              <th>${isAr ? "إجراءات" : "Actions"}</th>
            </tr>
          </thead>
          <tbody>
            ${
              state.admin.discounts.length === 0
                ? `<tr><td colspan="6" style="text-align:center;padding:20px;">${
                    isAr ? "لا توجد أكواد خصم حالياً" : "No discount codes created yet"
                  }</td></tr>`
                : state.admin.discounts
                    .map(
                      (d) => `
                  <tr>
                    <td dir="ltr"><strong>${escapeHtml(d.code)}</strong></td>
                    <td>
                      ${
                        d.discount_type === "percentage"
                          ? `${formatNumber(d.discount_value)}%`
                          : formatPrice(d.discount_value)
                      }
                    </td>
                    <td dir="ltr">${escapeHtml(d.expiry_date || (isAr ? "مفتوح" : "No expiry"))}</td>
                    <td>${formatNumber(d.used_count)} / ${
                        d.usage_limit ? formatNumber(d.usage_limit) : "∞"
                      }</td>
                    <td>
                      <span class="badge-stock ${d.is_active ? "badge-in-stock" : "badge-out-of-stock"}">
                        ${d.is_active ? (isAr ? "مفعل" : "Active") : isAr ? "معطل" : "Inactive"}
                      </span>
                    </td>
                    <td>
                      <div style="display:flex;gap:6px;">
                        <button type="button" class="btn btn-outline btn-sm" data-toggle-disc="${d.id}" data-active="${d.is_active ? 1 : 0}">
                          ${d.is_active ? (isAr ? "تعطيل" : "Deactivate") : isAr ? "تفعيل" : "Activate"}
                        </button>
                        <button type="button" class="btn btn-outline btn-sm" style="color:var(--danger);border-color:#fecaca;" data-del-disc="${d.id}">
                          ${isAr ? "حذف" : "Delete"}
                        </button>
                      </div>
                    </td>
                  </tr>
                `
                    )
                    .join("")
            }
          </tbody>
        </table>
      </div>
    `;

    document.getElementById("admin-create-discount-form").addEventListener("submit", async (e) => {
      e.preventDefault();
      const payload = {
        code: document.getElementById("ad-code").value.trim().toUpperCase(),
        discount_type: document.getElementById("ad-type").value,
        discount_value: Number(document.getElementById("ad-val").value),
        expiry_date: document.getElementById("ad-exp").value || null,
        usage_limit: document.getElementById("ad-limit").value || null,
        is_active: true,
      };
      const r = await fetch("/api/admin/discounts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const resData = await r.json();
      if (r.ok) {
        showToast(isAr ? "تم إنشاء كود الخصم" : "Discount code created", "success");
        await renderAdminDiscountsTab();
      } else {
        showToast(isAr ? resData.error_ar : resData.error_en, "error");
      }
    });

    box.querySelectorAll("[data-toggle-disc]").forEach((btn) => {
      btn.addEventListener("click", async () => {
        const id = Number(btn.getAttribute("data-toggle-disc"));
        const curr = Number(btn.getAttribute("data-active")) === 1;
        await fetch(`/api/admin/discounts/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ is_active: !curr }),
        });
        await renderAdminDiscountsTab();
      });
    });

    box.querySelectorAll("[data-del-disc]").forEach((btn) => {
      btn.addEventListener("click", async () => {
        const id = Number(btn.getAttribute("data-del-disc"));
        await fetch(`/api/admin/discounts/${id}`, { method: "DELETE" });
        await renderAdminDiscountsTab();
      });
    });
  }

  async function renderAdminReviewsTab() {
    const box = document.getElementById("admin-tab-content");
    const isAr = state.lang === "ar";
    const res = await fetch("/api/admin/reviews");
    const data = await res.json();
    state.admin.reviews = data.reviews || [];

    box.innerHTML = `
      <h2 style="font-size:1.4rem;font-weight:900;color:var(--navy);margin-bottom:20px;">
        ${isAr ? "مراجعة تقييمات العملاء" : "Customer Reviews Moderation"}
      </h2>

      <div class="table-responsive">
        <table class="data-table">
          <thead>
            <tr>
              <th>${isAr ? "المنتج" : "Product"}</th>
              <th>${isAr ? "العميل" : "Customer"}</th>
              <th>${isAr ? "التقييم" : "Rating"}</th>
              <th>${isAr ? "التعليق" : "Comment"}</th>
              <th>${isAr ? "الحالة" : "Status"}</th>
              <th>${isAr ? "إجراءات" : "Actions"}</th>
            </tr>
          </thead>
          <tbody>
            ${
              state.admin.reviews.length === 0
                ? `<tr><td colspan="6" style="text-align:center;padding:20px;">${
                    isAr ? "لا توجد تقييمات مرسلة حتى الآن" : "No reviews submitted yet"
                  }</td></tr>`
                : state.admin.reviews
                    .map(
                      (rv) => `
                  <tr>
                    <td><strong>${escapeHtml(isAr ? rv.product_name_ar : rv.product_name_en)}</strong></td>
                    <td>${escapeHtml(rv.display_name)}</td>
                    <td style="color:#f59e0b;font-weight:800;">${"★".repeat(rv.rating)}</td>
                    <td>${escapeHtml(rv.review_text)}</td>
                    <td><strong>${escapeHtml(rv.moderation_status)}</strong></td>
                    <td>
                      <div style="display:flex;gap:6px;">
                        <button type="button" class="btn btn-primary btn-sm" data-mod-rev="${rv.id}" data-status="approved">
                          ${isAr ? "موافقة" : "Approve"}
                        </button>
                        <button type="button" class="btn btn-outline btn-sm" data-mod-rev="${rv.id}" data-status="rejected">
                          ${isAr ? "رفض" : "Reject"}
                        </button>
                        <button type="button" class="btn btn-outline btn-sm" style="color:var(--danger);" data-del-rev="${rv.id}">
                          ${isAr ? "حذف" : "Delete"}
                        </button>
                      </div>
                    </td>
                  </tr>
                `
                    )
                    .join("")
            }
          </tbody>
        </table>
      </div>
    `;

    box.querySelectorAll("[data-mod-rev]").forEach((btn) => {
      btn.addEventListener("click", async () => {
        const rid = Number(btn.getAttribute("data-mod-rev"));
        const st = btn.getAttribute("data-status");
        await fetch(`/api/admin/reviews/${rid}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ moderation_status: st }),
        });
        await fetchBootstrap();
        await renderAdminReviewsTab();
      });
    });

    box.querySelectorAll("[data-del-rev]").forEach((btn) => {
      btn.addEventListener("click", async () => {
        const rid = Number(btn.getAttribute("data-del-rev"));
        await fetch(`/api/admin/reviews/${rid}`, { method: "DELETE" });
        await fetchBootstrap();
        await renderAdminReviewsTab();
      });
    });
  }

  async function renderAdminReportsTab() {
    const box = document.getElementById("admin-tab-content");
    const isAr = state.lang === "ar";
    const res = await fetch("/api/admin/overview");
    const d = await res.json();

    box.innerHTML = `
      <h2 style="font-size:1.4rem;font-weight:900;color:var(--navy);margin-bottom:20px;">
        ${isAr ? "تقارير المبيعات والإيرادات التفصيلية" : "Detailed Sales & Revenue Reports"}
      </h2>

      <div class="kpi-grid">
        <div class="kpi-card">
          <div class="kpi-label">${isAr ? "إجمالي قيمة المنتجات (قبل الخصم)" : "Gross Product Value"}</div>
          <div class="kpi-value">${formatPrice(d.gross_product_sales)}</div>
        </div>
        <div class="kpi-card">
          <div class="kpi-label">${isAr ? "إجمالي الخصومات المطبقة" : "Total Discounts"}</div>
          <div class="kpi-value" style="color:var(--success);">− ${formatPrice(d.total_discounts)}</div>
        </div>
        <div class="kpi-card">
          <div class="kpi-label">${isAr ? "إجمالي رسوم التوصيل" : "Total Delivery Fees"}</div>
          <div class="kpi-value">${formatPrice(d.total_delivery_fees)}</div>
        </div>
        <div class="kpi-card">
          <div class="kpi-label">${isAr ? "صافي الإيرادات (بدون الملغي)" : "Net Active Revenue"}</div>
          <div class="kpi-value" style="color:var(--primary);">${formatPrice(d.total_sales)}</div>
        </div>
        <div class="kpi-card">
          <div class="kpi-label">${isAr ? "قيمة الطلبات الملغاة" : "Cancelled Orders Value"}</div>
          <div class="kpi-value" style="color:var(--danger);">${formatPrice(d.cancelled_orders_value)}</div>
        </div>
      </div>

      <h3 style="font-size:1.15rem;font-weight:800;color:var(--navy);margin:24px 0 12px;">
        ${isAr ? "المبيعات حسب التاريخ" : "Sales by Date"}
      </h3>
      <div class="table-responsive" style="margin-bottom:28px;">
        <table class="data-table">
          <thead>
            <tr>
              <th>${isAr ? "التاريخ" : "Date"}</th>
              <th>${isAr ? "عدد الطلبات" : "Orders"}</th>
              <th>${isAr ? "إجمالي المنتجات" : "Gross Sales"}</th>
              <th>${isAr ? "الخصومات" : "Discounts"}</th>
              <th>${isAr ? "التوصيل" : "Delivery Fees"}</th>
              <th>${isAr ? "صافي الإيراد" : "Net Revenue"}</th>
              <th>${isAr ? "الملغي" : "Cancelled"}</th>
            </tr>
          </thead>
          <tbody>
            ${
              !d.sales_by_date || d.sales_by_date.length === 0
                ? `<tr><td colspan="7" style="text-align:center;padding:20px;">${
                    isAr ? "لا توجد بيانات" : "No data yet"
                  }</td></tr>`
                : d.sales_by_date
                    .map(
                      (row) => `
                  <tr>
                    <td dir="ltr"><strong>${escapeHtml(row.date)}</strong></td>
                    <td>${formatNumber(row.order_count)}</td>
                    <td>${formatPrice(row.gross_sales)}</td>
                    <td>${formatPrice(row.discounts)}</td>
                    <td>${formatPrice(row.delivery_fees)}</td>
                    <td><strong>${formatPrice(row.net_revenue)}</strong></td>
                    <td style="color:var(--danger);">${formatPrice(row.cancelled_total)}</td>
                  </tr>
                `
                    )
                    .join("")
            }
          </tbody>
        </table>
      </div>

      <h3 style="font-size:1.15rem;font-weight:800;color:var(--navy);margin:24px 0 12px;">
        ${isAr ? "الطلبات حسب الحالة" : "Orders by Status"}
      </h3>
      <div class="table-responsive">
        <table class="data-table">
          <thead>
            <tr>
              <th>${isAr ? "الحالة" : "Status"}</th>
              <th>${isAr ? "عدد الطلبات" : "Order Count"}</th>
              <th>${isAr ? "إجمالي القيمة" : "Total Value"}</th>
            </tr>
          </thead>
          <tbody>
            ${(d.orders_by_status || [])
              .map(
                (st) => `
              <tr>
                <td><span class="status-badge status-${escapeHtml(st.order_status)}">${escapeHtml(
                  t("status_" + st.order_status)
                )}</span></td>
                <td>${formatNumber(st.count)}</td>
                <td>${formatPrice(st.total)}</td>
              </tr>
            `
              )
              .join("")}
          </tbody>
        </table>
      </div>
    `;
  }

  // --------------------------------------------------------------------------
  // ROUTER & INITIALIZATION
  // --------------------------------------------------------------------------

  async function fetchBootstrap() {
    const res = await fetch("/api/bootstrap");
    if (res.ok) {
      const data = await res.json();
      state.settings = data.settings || state.settings;
      state.products = data.products || [];
      state.categories = data.categories || [];
    }
  }

  function navigateTo(url, push = true) {
    if (push) {
      window.history.pushState({}, "", url);
    }
    const mobileDrawer = document.getElementById("mobile-drawer");
    if (mobileDrawer) mobileDrawer.hidden = true;
    window.scrollTo({ top: 0, behavior: "smooth" });
    routeCurrentUrl();
  }

  async function routeCurrentUrl() {
    applyLanguageToShell();
    updateHeaderBadges();
    const path = window.location.pathname;

    if (path === "/" || path === "") {
      renderHomePage();
    } else if (path === "/shop") {
      renderShopPage();
    } else if (path.startsWith("/product/")) {
      const slug = decodeURIComponent(path.split("/product/")[1] || "").replace(/\/$/, "");
      await renderProductDetailPage(slug);
    } else if (path === "/about") {
      renderAboutPage();
    } else if (path === "/wishlist") {
      renderWishlistPage();
    } else if (path === "/cart") {
      await renderCartPage();
    } else if (path === "/checkout") {
      await renderCheckoutPage();
    } else if (path.startsWith("/order-confirmation/")) {
      const ordNum = decodeURIComponent(path.split("/order-confirmation/")[1] || "").replace(/\/$/, "");
      await renderOrderConfirmationPage(ordNum);
    } else if (path === "/privacy") {
      renderLegalPage("privacy");
    } else if (path === "/terms") {
      renderLegalPage("terms");
    } else if (path.startsWith("/admin")) {
      await renderAdminPage();
    } else {
      renderHomePage();
    }
  }

  function bindGlobalEvents() {
    // Intercept internal navigation links
    document.addEventListener("click", (e) => {
      const navLink = e.target.closest("[data-nav]");
      if (navLink) {
        e.preventDefault();
        const targetUrl = navLink.getAttribute("data-nav");
        navigateTo(targetUrl);
        return;
      }

      const addCartBtn = e.target.closest('[data-action="add-to-cart"]');
      if (addCartBtn) {
        e.preventDefault();
        const pid = Number(addCartBtn.getAttribute("data-id"));
        addToCart(pid, 1);
        return;
      }

      const wishBtn = e.target.closest('[data-action="toggle-wishlist"]');
      if (wishBtn) {
        e.preventDefault();
        const pid = Number(wishBtn.getAttribute("data-id"));
        toggleWishlist(pid);
        routeCurrentUrl();
        return;
      }

      const heroThumb = e.target.closest('[data-action="hero-thumb"]');
      if (heroThumb) {
        e.preventDefault();
        const imgUrl = heroThumb.getAttribute("data-img");
        const showcase = document.getElementById("hero-showcase-img");
        if (showcase && imgUrl) showcase.src = imgUrl;
        document.querySelectorAll('[data-action="hero-thumb"]').forEach((b) => b.classList.remove("active"));
        heroThumb.classList.add("active");
      }
    });

    // Language switcher
    const langBtn = document.getElementById("lang-switch-btn");
    if (langBtn) {
      langBtn.addEventListener("click", () => {
        state.lang = state.lang === "ar" ? "en" : "ar";
        try {
          localStorage.setItem(STORAGE_KEYS.LANG, state.lang);
        } catch (_) {}
        routeCurrentUrl();
      });
    }

    // Mobile menu toggle
    const mobileMenuBtn = document.getElementById("mobile-menu-btn");
    const mobileDrawer = document.getElementById("mobile-drawer");
    if (mobileMenuBtn && mobileDrawer) {
      mobileMenuBtn.addEventListener("click", () => {
        const isHidden = mobileDrawer.hidden;
        mobileDrawer.hidden = !isHidden;
        mobileMenuBtn.setAttribute("aria-expanded", String(isHidden));
      });
    }

    // Header & Mobile search forms
    const headerSearchForm = document.getElementById("header-search-form");
    if (headerSearchForm) {
      headerSearchForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const q = (document.getElementById("header-search-input").value || "").trim();
        state.shopFilters.q = q;
        navigateTo(`/shop?q=${encodeURIComponent(q)}`);
      });
    }

    const mobileSearchForm = document.getElementById("mobile-search-form");
    if (mobileSearchForm) {
      mobileSearchForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const q = (document.getElementById("mobile-search-input").value || "").trim();
        state.shopFilters.q = q;
        navigateTo(`/shop?q=${encodeURIComponent(q)}`);
      });
    }

    window.addEventListener("popstate", () => {
      routeCurrentUrl();
    });
  }

  async function initApp() {
    loadPersistedState();
    applyLanguageToShell();
    updateHeaderBadges();
    bindGlobalEvents();
    await fetchBootstrap();
    await routeCurrentUrl();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initApp);
  } else {
    initApp();
  }
})();
