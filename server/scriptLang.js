// --- Language Switcher Functionality ---
const languageSwitcherBtn = document.getElementById('language-switcher');
const htmlElement = document.documentElement; // يمثل عنصر <html> في الصفحة

// قاموس الترجمات (مثال، تحتاج لإضافة كل النصوص الموجودة في صفحاتك)
const translations = {
    ar: {
        // عام
        brandName: "قصر زهور الأماني",
        home: "الرئيسية",
        likes: "الإعجابات",
        cart: "السلة",
        admin: "المدير",
        menu: "القائمة",
        aboutUs: "من نحن",
        contactUs: "اتصل بنا",
        privacyPolicy: "سياسة الخصوصية",
        faq: "الأسئلة الشائعة",
        adminDashboard: "لوحة تحكم المدير",
        allRightsReserved: "جميع الحقوق محفوظة.",
        clickHere: "اضغط هنا",
        addToCart: "أضف للسلة",
        addToWishlist: "إعجاب",
        removeFromWishlist: "إزالة",
        removeFromCart: "إزالة",
        emptyWishlist: "لا توجد منتجات في قائمة الإعجابات.",
        emptyCart: "سلتك فارغة.",
        cartTotal: "إجمالي السلة:",
        checkout: "إتمام الشراء",
        login: "تسجيل الدخول",
        username: "اسم المستخدم:",
        password: "كلمة المرور:",
        loginSuccess: "تم تسجيل الدخول بنجاح! جاري التوجيه...",
        loginError: "اسم المستخدم أو كلمة المرور غير صحيحة.",
        
        // الصفحة الرئيسية
        offersTitle: "عروضنا المميزة",
        adsTitle: "إعلانات",
        categoriesTitle: "أنواع الزهور",
        bestSellersTitle: "الأكثر مبيعًا",
        suggestionsTitle: "اقتراحات لك",
        locationTitle: "موقعنا",
        
        // أمثلة لعروض محددة
        engagementRoses: "ورد الخطوبة",
        engagementRosesDesc: "أجمل باقات الورد لمناسباتكم السعيدة.",
        eventFlowers: "زهور المناسبات",
        eventFlowersDesc: "تشكيلة واسعة من الزهور لكل مناسبة.",
        graduationBouquets: "باقات التخرج",
        graduationBouquetsDesc: "احتفل بتخرجك مع باقاتنا الفريدة.",

        // أمثلة لأنواع الزهور
        naturalRoses: "ورد طبيعي",
        artificialRoses: "ورد صناعي",
        indoorPlants: "نباتات داخلية",
        readyBouquets: "باقات جاهزة",
        gifts: "هدايا",
        specialArrangements: "تنسيقات خاصة",
        supplies: "مستلزمات",
        trees: "أشجار",
        rareFlowers: "أزهار نادرة",

        // رسائل تأكيدية
        productAddedToCart: "تمت إضافته إلى السلة!",
        productAddedToWishlist: "تمت إضافته إلى الإعجابات!",
        productRemovedFromWishlist: "تمت إزالته من الإعجابات.",
        productRemovedFromCart: "تمت إزالة المنتج من السلة."
    },
    en: {
        // General
        brandName: "Amani Flowers Palace",
        home: "Home",
        likes: "Likes",
        cart: "Cart",
        admin: "Admin",
        menu: "Menu",
        aboutUs: "About Us",
        contactUs: "Contact Us",
        privacyPolicy: "Privacy Policy",
        faq: "FAQ",
        adminDashboard: "Admin Dashboard",
        allRightsReserved: "All Rights Reserved.",
        clickHere: "Click Here",
        addToCart: "Add to Cart",
        addToWishlist: "Like",
        removeFromWishlist: "Remove",
        removeFromCart: "Remove",
        emptyWishlist: "No products in your wishlist.",
        emptyCart: "Your cart is empty.",
        cartTotal: "Cart Total:",
        checkout: "Checkout",
        login: "Login",
        username: "Username:",
        password: "Password:",
        loginSuccess: "Login successful! Redirecting...",
        loginError: "Incorrect username or password.",

        // Home Page
        offersTitle: "Our Special Offers",
        adsTitle: "Advertisements",
        categoriesTitle: "Flower Types",
        bestSellersTitle: "Best Sellers",
        suggestionsTitle: "Suggestions for You",
        locationTitle: "Our Location",

        // Specific offers examples
        engagementRoses: "Engagement Roses",
        engagementRosesDesc: "The most beautiful rose bouquets for your happy occasions.",
        eventFlowers: "Event Flowers",
        eventFlowersDesc: "A wide selection of flowers for every occasion.",
        graduationBouquets: "Graduation Bouquets",
        graduationBouquetsDesc: "Celebrate your graduation with our unique bouquets.",

        // Flower types examples
        naturalRoses: "Natural Roses",
        artificialRoses: "Artificial Roses",
        indoorPlants: "Indoor Plants",
        readyBouquets: "Ready Bouquets",
        gifts: "Gifts",
        specialArrangements: "Special Arrangements",
        supplies: "Supplies",
        trees: "Trees",
        rareFlowers: "Rare Flowers",

        // Confirmation messages
        productAddedToCart: "added to cart!",
        productAddedToWishlist: "added to wishlist!",
        productRemovedFromWishlist: "removed from wishlist.",
        productRemovedFromCart: "Product removed from cart."
    }
};

// وظيفة لتغيير لغة الموقع
function setLanguage(lang) {
    // 1. تغيير اتجاه الصفحة (RTL/LTR)
    htmlElement.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');

    // 2. تحديث النصوص بناءً على اللغة المختارة
    const currentTranslations = translations[lang];

    // Navbar Brand Name
    document.querySelector('.navbar .brand-name').textContent = currentTranslations.brandName;

    // Bottom Navigation Bar
    document.querySelector('.bottom-nav a[href="index.html"] span').textContent = currentTranslations.home;
    document.querySelector('.bottom-nav a[href="wishlist.html"] span').textContent = currentTranslations.likes;
    document.querySelector('.bottom-nav a[href="cart.html"] span').textContent = currentTranslations.cart;
    document.querySelector('.bottom-nav a[href="admin-login.html"] span').textContent = currentTranslations.admin;
    document.querySelector('.bottom-nav .hamburger-menu-btn span').textContent = currentTranslations.menu;

    // Side Menu Links (you might need to adjust selectors based on your HTML)
    const sideMenuLinks = document.querySelectorAll('.side-menu ul li a');
    if (sideMenuLinks[0]) sideMenuLinks[0].textContent = currentTranslations.aboutUs;
    if (sideMenuLinks[1]) sideMenuLinks[1].textContent = currentTranslations.contactUs;
    if (sideMenuLinks[2]) sideMenuLinks[2].textContent = currentTranslations.privacyPolicy;
    if (sideMenuLinks[3]) sideMenuLinks[3].textContent = currentTranslations.faq;
    if (sideMenuLinks[4] && window.location.pathname.includes('index.html')) { // Only show on index for admin dashboard example
        sideMenuLinks[4].textContent = currentTranslations.adminDashboard;
    }


    // Footer
    document.querySelector('.site-footer p').textContent = `© 2025 ${currentTranslations.brandName}. ${currentTranslations.allRightsReserved}`;

    // Common buttons/elements
    document.querySelectorAll('.call-to-action').forEach(btn => btn.textContent = currentTranslations.clickHere);
    document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
        // Keep the icon, just change the text
        const icon = btn.querySelector('i');
        btn.innerHTML = ''; // Clear current content
        if (icon) btn.appendChild(icon);
        btn.innerHTML += ` ${currentTranslations.addToCart}`;
    });
    document.querySelectorAll('.add-to-wishlist-btn').forEach(btn => {
        // For wishlist, if it's just an icon, you might just change its title or keep it.
        // Assuming it's an icon, we just set title or no change needed if text is not visible.
        // If you want text to appear:
        // const icon = btn.querySelector('i');
        // btn.innerHTML = '';
        // if (icon) btn.appendChild(icon);
        // btn.innerHTML += ` ${currentTranslations.addToWishlist}`;
    });
    // For remove buttons in cart/wishlist pages
    document.querySelectorAll('.remove-from-wishlist-btn').forEach(btn => {
        const icon = btn.querySelector('i');
        btn.innerHTML = '';
        if (icon) btn.appendChild(icon);
        btn.innerHTML += ` ${currentTranslations.removeFromWishlist}`;
    });
    document.querySelectorAll('.remove-from-cart-btn').forEach(btn => {
        const icon = btn.querySelector('i');
        btn.innerHTML = '';
        if (icon) btn.appendChild(icon);
        btn.innerHTML += ` ${currentTranslations.removeFromCart}`;
    });


    // Page specific titles (h2)
    const pageTitleMap = {
        'index.html': {
            '.offers-section h2': currentTranslations.offersTitle,
            '.ads-section h2': currentTranslations.adsTitle,
            '.categories-section h2': currentTranslations.categoriesTitle,
            '.best-sellers-section h2': currentTranslations.bestSellersTitle,
            '.suggestions-section h2': currentTranslations.suggestionsTitle,
            '.location-section h2': currentTranslations.locationTitle
        },
        'wishlist.html': {
            '.wishlist-section h2': currentTranslations.likes
        },
        'cart.html': {
            '.cart-section h2': currentTranslations.cart,
            '.cart-summary h3': `${currentTranslations.cartTotal} <span id="cart-total"></span>`
        },
        'admin-login.html': {
            '.admin-login-section h2': currentTranslations.login
        }
    };

    const currentPage = window.location.pathname.split('/').pop();
    if (pageTitleMap[currentPage]) {
        for (const selector in pageTitleMap[currentPage]) {
            const element = document.querySelector(selector);
            if (element) {
                if (selector === '.cart-summary h3') { // Special handling for cart total span
                    element.innerHTML = pageTitleMap[currentPage][selector];
                    // Re-update cart total after translation, if on cart page
                    if (currentPage === 'cart.html') {
                        // This might need a slight delay or call updateCartTotal directly if it's already defined
                        setTimeout(updateCartTotal, 0); // Ensure updateCartTotal is called after HTML is set
                    }
                } else {
                    element.textContent = pageTitleMap[currentPage][selector];
                }
            }
        }
    }

    // Category items text
    document.querySelectorAll('.categories-grid .category-item span').forEach(span => {
        // This requires careful mapping. You might need data attributes or a more robust system.
        // For simplicity, let's assume order matches or map via class/id if more complex.
        const originalText = span.textContent;
        // Example: if(originalText === "ورد طبيعي") span.textContent = currentTranslations.naturalRoses;
        // This part needs to be specifically handled as per your actual category names.
        // A better approach is to add a data-key attribute to each element that needs translation
        // e.g., <span data-translate-key="naturalRoses">ورد طبيعي</span>
        // Then loop: document.querySelectorAll('[data-translate-key]').forEach(el => { el.textContent = currentTranslations[el.dataset.translateKey]; });
    });

    // Login form labels (admin-login.html)
    const usernameLabel = document.querySelector('.login-form label[for="username"]');
    if (usernameLabel) usernameLabel.textContent = currentTranslations.username;
    const passwordLabel = document.querySelector('.login-form label[for="password"]');
    if (passwordLabel) passwordLabel.textContent = currentTranslations.password;
    const loginBtn = document.querySelector('.login-form .login-btn');
    if (loginBtn) loginBtn.textContent = currentTranslations.login;
    const emptyMessageWishlist = document.querySelector('.wishlist-section .empty-message');
    if (emptyMessageWishlist) emptyMessageWishlist.textContent = currentTranslations.emptyWishlist;
    const emptyMessageCart = document.querySelector('.cart-section .empty-message');
    if (emptyMessageCart) emptyMessageCart.textContent = currentTranslations.emptyCart;


    // Update the button text itself
    languageSwitcherBtn.textContent = lang === 'ar' ? 'EN / عربي' : 'AR / English';

    // Store preferred language in Local Storage
    localStorage.setItem('preferredLang', lang);
}

// عند تحميل الصفحة، تحقق من اللغة المفضلة المخزنة
const storedLang = localStorage.getItem('preferredLang') || 'ar'; // الافتراضي هو عربي
setLanguage(storedLang); // طبق اللغة عند التحميل

// استمع لحدث النقر على زر تبديل اللغة
if (languageSwitcherBtn) {
    languageSwitcherBtn.addEventListener('click', () => {
        const currentLang = htmlElement.getAttribute('dir') === 'rtl' ? 'ar' : 'en';
        const newLang = currentLang === 'ar' ? 'en' : 'ar';
        setLanguage(newLang);
    });
}

// ملاحظة هامة: يجب أن يتم استدعاء دالة `updateCartTotal` مرة أخرى
// بعد تغيير اللغة في صفحة السلة لضمان تحديث الإجمالي بالنص الصحيح.
// تأكد أن `updateCartTotal` هي دالة عامة أو يمكن الوصول إليها هنا.
// إذا كانت `updateCartTotal` معرفة داخل `DOMContentLoaded`،
// ستحتاج إلى جعلها قابلة للوصول عالميًا أو إعادة هيكلة الكود.
// الكود أعلاه يفترض أنها دالة معرفة في النطاق العام أو ضمن الدالة الرئيسية
// لـ DOMContentLoaded حيث يمكن الوصول إليها.