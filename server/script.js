document.addEventListener('DOMContentLoaded', () => {

    // --- Side Menu Functionality ---
    const hamburgerBtn = document.querySelector('.hamburger-menu-btn');
    const sideMenu = document.querySelector('.side-menu');
    const closeSideMenuBtn = document.querySelector('.close-side-menu');

    hamburgerBtn.addEventListener('click', () => {
        sideMenu.classList.add('open');
    });

    closeSideMenuBtn.addEventListener('click', () => {
        sideMenu.classList.remove('open');
    });

    // Close side menu if clicked outside
    document.addEventListener('click', (e) => {
        if (!sideMenu.contains(e.target) && !hamburgerBtn.contains(e.target) && sideMenu.classList.contains('open')) {
            sideMenu.classList.remove('open');
        }
    });

    // --- Offers Slider Functionality ---
    const offersSlider = document.querySelector('.offers-slider');
    const offerItems = document.querySelectorAll('.offer-item');
    const sliderDots = document.querySelectorAll('.slider-controls .dot');
    let currentSlide = 0;
    let slideInterval;

    function showSlide(index) {
        if (index >= offerItems.length) {
            currentSlide = 0;
        } else if (index < 0) {
            currentSlide = offerItems.length - 1;
        } else {
            currentSlide = index;
        }

        offersSlider.style.transform = `translateX(-${currentSlide * 100}%)`;

        // Update active dot
        sliderDots.forEach((dot, i) => {
            if (i === currentSlide) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
    }

    function startSlider() {
        slideInterval = setInterval(() => {
            showSlide(currentSlide + 1);
        }, 3000); // Change slide every 3 seconds
    }

    function stopSlider() {
        clearInterval(slideInterval);
    }

    // Manual slide control (dots)
    sliderDots.forEach(dot => {
        dot.addEventListener('click', (e) => {
            stopSlider();
            showSlide(parseInt(e.target.dataset.slide));
            startSlider(); // Restart slider after manual control
        });
    });

    // Initialize slider
    showSlide(currentSlide);
    startSlider();

    // Pause on hover
    offersSlider.addEventListener('mouseenter', stopSlider);
    offersSlider.addEventListener('mouseleave', startSlider);


    // --- Local Storage for Cart and Wishlist ---
    const productsContainer = document.querySelector('.best-sellers-section .products-grid') ||
                              document.querySelector('.suggestions-section .suggestions-slider'); // Get relevant product container

    // Function to get product data from the card
    function getProductData(productCard) {
        return {
            id: productCard.dataset.productId,
            name: productCard.querySelector('h3').textContent,
            image: productCard.querySelector('img').src,
            oldPrice: productCard.querySelector('.old-price') ? productCard.querySelector('.old-price').textContent : '',
            currentPrice: productCard.querySelector('.current-price').textContent,
        };
    }

    // Add to Cart functionality
    document.querySelectorAll('.add-to-cart-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            const productCard = e.target.closest('.product-card');
            if (productCard) {
                const product = getProductData(productCard);
                let cart = JSON.parse(localStorage.getItem('cart')) || [];
                const existingProductIndex = cart.findIndex(item => item.id === product.id);

                if (existingProductIndex > -1) {
                    cart[existingProductIndex].quantity = (cart[existingProductIndex].quantity || 1) + 1;
                } else {
                    product.quantity = 1;
                    cart.push(product);
                }
                localStorage.setItem('cart', JSON.stringify(cart));
                alert(`${product.name} تمت إضافته إلى السلة!`); // Replace with a nicer notification
            }
        });
    });

    // Add to Wishlist functionality
    document.querySelectorAll('.add-to-wishlist-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            const productCard = e.target.closest('.product-card');
            if (productCard) {
                const product = getProductData(productCard);
                let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
                const existingProductIndex = wishlist.findIndex(item => item.id === product.id);

                if (existingProductIndex > -1) {
                    wishlist.splice(existingProductIndex, 1); // Remove if already in wishlist
                    button.classList.remove('liked');
                    alert(`${product.name} تمت إزالته من الإعجابات.`); // Replace with a nicer notification
                } else {
                    wishlist.push(product);
                    button.classList.add('liked');
                    alert(`${product.name} تمت إضافته إلى الإعجابات!`); // Replace with a nicer notification
                }
                localStorage.setItem('wishlist', JSON.stringify(wishlist));
            }
        });
    });

    // Initialize wishlist buttons state on page load
    document.querySelectorAll('.add-to-wishlist-btn').forEach(button => {
        const productCard = button.closest('.product-card');
        if (productCard) {
            const productId = productCard.dataset.productId;
            const wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
            if (wishlist.some(item => item.id === productId)) {
                button.classList.add('liked');
            }
        }
    });

    // Handle remove from wishlist button on wishlist.html
    document.querySelectorAll('.remove-from-wishlist-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            const productCard = e.target.closest('.product-card');
            if (productCard) {
                const productId = productCard.dataset.productId;
                let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
                wishlist = wishlist.filter(item => item.id !== productId);
                localStorage.setItem('wishlist', JSON.stringify(wishlist));
                productCard.remove(); // Remove the card from the DOM
                if (wishlist.length === 0) {
                    document.getElementById('wishlist-products-container').querySelector('.empty-message').style.display = 'block';
                }
                alert('تمت إزالة المنتج من قائمة الإعجابات.');
            }
        });
    });

    // Handle remove from cart, increase/decrease quantity on cart.html
    document.querySelectorAll('.remove-from-cart-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            const productCard = e.target.closest('.product-card');
            if (productCard) {
                const productId = productCard.dataset.productId;
                let cart = JSON.parse(localStorage.getItem('cart')) || [];
                cart = cart.filter(item => item.id !== productId);
                localStorage.setItem('cart', JSON.stringify(cart));
                productCard.remove(); // Remove the card from the DOM
                updateCartTotal();
                if (cart.length === 0) {
                    document.getElementById('cart-products-container').querySelector('.empty-message').style.display = 'block';
                }
                alert('تمت إزالة المنتج من السلة.');
            }
        });
    });

    document.querySelectorAll('.increase-quantity-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            const productId = e.target.dataset.productId;
            let cart = JSON.parse(localStorage.getItem('cart')) || [];
            const productIndex = cart.findIndex(item => item.id === productId);
            if (productIndex > -1) {
                cart[productIndex].quantity = (cart[productIndex].quantity || 1) + 1;
                localStorage.setItem('cart', JSON.stringify(cart));
                e.target.previousElementSibling.textContent = cart[productIndex].quantity;
                updateCartTotal();
            }
        });
    });

    document.querySelectorAll('.decrease-quantity-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            const productId = e.target.dataset.productId;
            let cart = JSON.parse(localStorage.getItem('cart')) || [];
            const productIndex = cart.findIndex(item => item.id === productId);
            if (productIndex > -1) {
                if (cart[productIndex].quantity > 1) {
                    cart[productIndex].quantity--;
                    localStorage.setItem('cart', JSON.stringify(cart));
                    e.target.nextElementSibling.textContent = cart[productIndex].quantity;
                    updateCartTotal();
                } else {
                    // Remove item if quantity is 1 and user tries to decrease
                    cart = cart.filter(item => item.id !== productId);
                    localStorage.setItem('cart', JSON.stringify(cart));
                    e.target.closest('.product-card').remove();
                    updateCartTotal();
                    if (cart.length === 0) {
                        document.getElementById('cart-products-container').querySelector('.empty-message').style.display = 'block';
                    }
                }
            }
        });
    });

    function updateCartTotal() {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        let total = 0;
        cart.forEach(product => {
            total += parseFloat(product.currentPrice) * (product.quantity || 1);
        });
        document.getElementById('cart-total').textContent = total.toFixed(2);
    }
    // Call updateCartTotal initially for cart page
    if (document.getElementById('cart-total')) {
        updateCartTotal();
    }


    // --- Suggestions Slider (Swiping/Dragging) ---
    const suggestionsSlider = document.querySelector('.suggestions-slider');
    let isDragging = false;
    let startPos = 0;
    let scrollLeft = 0;

    if (suggestionsSlider) { // Ensure slider exists before attaching listeners
        suggestionsSlider.addEventListener('mousedown', (e) => {
            isDragging = true;
            suggestionsSlider.classList.add('active-drag');
            startPos = e.pageX - suggestionsSlider.offsetLeft;
            scrollLeft = suggestionsSlider.scrollLeft;
        });

        suggestionsSlider.addEventListener('mouseleave', () => {
            isDragging = false;
            suggestionsSlider.classList.remove('active-drag');
        });

        suggestionsSlider.addEventListener('mouseup', () => {
            isDragging = false;
            suggestionsSlider.classList.remove('active-drag');
        });

        suggestionsSlider.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            e.preventDefault();
            const x = e.pageX - suggestionsSlider.offsetLeft;
            const walk = (x - startPos) * 1.5; // Multiplier for faster scroll
            suggestionsSlider.scrollLeft = scrollLeft - walk;
        });

        // Touch events for mobile
        suggestionsSlider.addEventListener('touchstart', (e) => {
            isDragging = true;
            startPos = e.touches[0].pageX - suggestionsSlider.offsetLeft;
            scrollLeft = suggestionsSlider.scrollLeft;
        });

        suggestionsSlider.addEventListener('touchend', () => {
            isDragging = false;
        });

        suggestionsSlider.addEventListener('touchmove', (e) => {
            if (!isDragging) return;
            const x = e.touches[0].pageX - suggestionsSlider.offsetLeft;
            const walk = (x - startPos) * 1.5;
            suggestionsSlider.scrollLeft = scrollLeft - walk;
        });
    }

});


// --- Language Switcher Functionality ---
const languageSwitcherBtn = document.getElementById('language-switcher');
const htmlElement = document.documentElement; // يمثل عنصر <html> في الصفحة

// قاموس الترجمات
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
        allRightsReserved: "© 2025 قصر زهور الأماني. جميع الحقوق محفوظة.",
        clickHere: "اضغط هنا",
        addToCart: "اضافة",
        addToWishlist: "إعجاب", // هذه للعنصر الذي فيه أيقونة قلب فقط
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

        // أمثلة لعروض محددة (استخدم فقط تلك التي تظهر في HTML)
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

        // نصوص المنتجات في (الأكثر مبيعًا، الاقتراحات)
        product1Title: "باقة الورد الأحمر",
        priceOld1: "150 جنيه",
        priceCurrent1: "120 جنيه",
        product2Title: "تنسيقة زهور الربيع",
        priceOld2: "200 جنيه",
        priceCurrent2: "180 جنيه",
        product3Title: "باقة زفاف بيضاء",
        priceOld3: "500 جنيه",
        priceCurrent3: "450 جنيه",
        product4Title: "صندوق هدايا زهور",
        priceOld4: "100 جنيه",
        priceCurrent4: "80 جنيه",
        product5Title: "ورد جوري مميز",
        priceOld5: "90 جنيه",
        priceCurrent5: "75 جنيه",
        product6Title: "باقة توليب ملونة",
        priceOld6: "180 جنيه",
        priceCurrent6: "160 جنيه",

        // رسائل تأكيدية (هذه تظهر عادة في تنبيهات أو رسائل مؤقتة)
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
        allRightsReserved: "© 2025 Amani Flowers Palace. All Rights Reserved.",
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

        // Product texts (Best Sellers, Suggestions)
        product1Title: "Red Rose Bouquet",
        priceOld1: "150 EGP",
        priceCurrent1: "120 EGP",
        product2Title: "Spring Flower Arrangement",
        priceOld2: "200 EGP",
        priceCurrent2: "180 EGP",
        product3Title: "White Wedding Bouquet",
        priceOld3: "500 EGP",
        priceCurrent3: "450 EGP",
        product4Title: "Flower Gift Box",
        priceOld4: "100 EGP",
        priceCurrent4: "80 EGP",
        product5Title: "Special Rose",
        priceOld5: "90 EGP",
        priceCurrent5: "75 EGP",
        product6Title: "Colorful Tulip Bouquet",
        priceOld6: "180 EGP",
        priceCurrent6: "160 EGP",

        // Confirmation messages
        productAddedToCart: "Added to cart!",
        productAddedToWishlist: "Added to wishlist!",
        productRemovedFromWishlist: "Removed from wishlist.",
        productRemovedFromCart: "Product removed from cart."
    }
};

// وظيفة لتغيير لغة الموقع
function setLanguage(lang) {
    // 1. تغيير اتجاه الصفحة (RTL/LTR) وسمة اللغة
    htmlElement.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
    htmlElement.setAttribute('lang', lang);

    // 2. تحديث النصوص بناءً على اللغة المختارة باستخدام data-translate-key
    const currentTranslations = translations[lang];

    // تحديث جميع العناصر التي تحتوي على data-translate-key
    document.querySelectorAll('[data-translate-key]').forEach(element => {
        const key = element.dataset.translateKey;
        if (currentTranslations[key]) {
            // معالجة خاصة للأزرار التي تحتوي على أيقونات ونص
            if (element.classList.contains('add-to-cart-btn') || element.classList.contains('add-to-wishlist-btn') ||
                element.classList.contains('remove-from-wishlist-btn') || element.classList.contains('remove-from-cart-btn')) {
                const icon = element.querySelector('i');
                element.innerHTML = ''; // إزالة النص القديم
                if (icon) {
                    element.appendChild(icon); // إضافة الأيقونة مرة أخرى
                }
                element.innerHTML += ` ${currentTranslations[key]}`; // إضافة النص الجديد
            }
            // معالجة خاصة لرسائل الأسعار (لضمان بقاء الأرقام إذا كانت جزءًا من النص المترجم)
            else if (element.classList.contains('old-price') || element.classList.contains('current-price')) {
                 // إذا كانت الترجمة تتضمن وحدة العملة، سنقوم بتحديثها بالكامل
                 // وإلا، سنعتبر الرقم ثابتًا ونترجم النص المحيط به فقط
                 element.textContent = currentTranslations[key];
            }
            else {
                element.textContent = currentTranslations[key];
            }
        }
    });

    // تحديث نص زر تبديل اللغة نفسه
    languageSwitcherBtn.textContent = lang === 'ar' ? 'EN / عربي' : 'AR / English';

    // تخزين اللغة المفضلة في Local Storage
    localStorage.setItem('preferredLang', lang);

    // ملاحظة: إذا كان لديك أي محتوى يتم إنشاؤه ديناميكيًا بعد تحميل الصفحة
    // مثل إضافة منتجات من سلة التسوق أو قائمة الإعجابات، فستحتاج إلى
    // إعادة استدعاء وظيفة تحديث السلة/الإعجابات بعد تغيير اللغة
    // لضمان أن النصوص المضافة حديثًا تظهر باللغة الصحيحة.
    // مثال: if (typeof updateCartDisplay === 'function') updateCartDisplay();
    // if (typeof updateWishlistDisplay === 'function') updateWishlistDisplay();
}

// دالة لمعالجة فتح/إغلاق القائمة الجانبية (من الكود الأصلي لديك)
function setupSideMenu() {
    const hamburgerBtn = document.querySelector('.hamburger-menu-btn');
    const sideMenu = document.querySelector('.side-menu');
    const closeSideMenuBtn = document.querySelector('.close-side-menu');

    if (hamburgerBtn && sideMenu && closeSideMenuBtn) {
        hamburgerBtn.addEventListener('click', () => {
            sideMenu.classList.add('open');
        });

        closeSideMenuBtn.addEventListener('click', () => {
            sideMenu.classList.remove('open');
        });

        // Close side menu when clicking outside (optional, but good UX)
        document.addEventListener('click', (event) => {
            if (!sideMenu.contains(event.target) && !hamburgerBtn.contains(event.target) && sideMenu.classList.contains('open')) {
                sideMenu.classList.remove('open');
            }
        });
    }
}


// دالة للتعامل مع السلايدر (Offers Slider)
function setupOffersSlider() {
    const offersSlider = document.querySelector('.offers-slider');
    const offerItems = document.querySelectorAll('.offer-item');
    const dots = document.querySelectorAll('.slider-controls .dot');
    let currentIndex = 0;

    function updateSlider() {
        if (!offersSlider || offerItems.length === 0) return;

        const offset = -currentIndex * 100; // 100% for each slide
        offersSlider.style.transform = `translateX(${offset}%)`;

        dots.forEach((dot, index) => {
            if (index === currentIndex) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
    }

    dots.forEach(dot => {
        dot.addEventListener('click', (e) => {
            currentIndex = parseInt(e.target.dataset.slide);
            updateSlider();
        });
    });

    // Optional: Auto-slide
    // setInterval(() => {
    //     currentIndex = (currentIndex + 1) % offerItems.length;
    //     updateSlider();
    // }, 5000); // Change slide every 5 seconds

    // Initial update
    updateSlider();
}


// وظيفة للتعامل مع إضافة المنتجات إلى السلة (Cart functionality)
function setupCartFunctionality() {
    // هذه مجرد وظيفة وهمية، تحتاج إلى ربطها بـ Local Storage
    // أو قاعدة بيانات حقيقية
    document.querySelectorAll('.add-to-cart-btn').forEach(button => {
        button.addEventListener('click', (event) => {
            const productCard = event.target.closest('.product-card');
            const productId = productCard.dataset.productId;
            const productName = productCard.querySelector('h3').textContent;
            const productPrice = productCard.querySelector('.current-price').textContent;

            // يمكنك إضافة منطق هنا لإضافة المنتج إلى Local Storage
            // أو إرساله إلى السيرفر
            console.log(`Product Added: ID ${productId}, Name: ${productName}, Price: ${productPrice}`);
            alert(translations[localStorage.getItem('preferredLang') || 'ar'].productAddedToCart); // رسالة تأكيد مترجمة
        });
    });
}

// وظيفة للتعامل مع قائمة الإعجابات (Wishlist functionality)
function setupWishlistFunctionality() {
    document.querySelectorAll('.add-to-wishlist-btn').forEach(button => {
        button.addEventListener('click', (event) => {
            const productCard = event.target.closest('.product-card');
            const productId = productCard.dataset.productId;
            const productName = productCard.querySelector('h3').textContent;

            // تبديل حالة الإعجاب
            button.classList.toggle('liked');
            if (button.classList.contains('liked')) {
                console.log(`Product Liked: ID ${productId}, Name: ${productName}`);
                alert(translations[localStorage.getItem('preferredLang') || 'ar'].productAddedToWishlist);
            } else {
                console.log(`Product Unliked: ID ${productId}, Name: ${productName}`);
                alert(translations[localStorage.getItem('preferredLang') || 'ar'].productRemovedFromWishlist);
            }
        });
    });
}


// عند تحميل الصفحة بالكامل
document.addEventListener('DOMContentLoaded', () => {
    // تهيئة وظائف تبديل اللغة أولاً
    // استرجع اللغة المفضلة المخزنة، أو استخدم "ar" كافتراضي
    const storedLang = localStorage.getItem('preferredLang') || 'ar';
    setLanguage(storedLang); // طبق اللغة عند التحميل الأولي للصفحة

    // أضف مستمع الحدث لزر تبديل اللغة
    if (languageSwitcherBtn) {
        languageSwitcherBtn.addEventListener('click', () => {
            const currentLang = htmlElement.getAttribute('dir') === 'rtl' ? 'ar' : 'en';
            const newLang = currentLang === 'ar' ? 'en' : 'ar';
            setLanguage(newLang); // غير اللغة عند النقر
        });
    }

    // تهيئة باقي وظائف الصفحة
    setupSideMenu();
    setupOffersSlider();
    setupCartFunctionality(); // تأكد من استدعائها
    setupWishlistFunctionality(); // تأكد من استدعائها

    // يمكنك إضافة وظائف تهيئة أخرى هنا للصفحة الرئيسية إذا كانت موجودة
});

// هذا الكود يمكن أن يكون في ملف منفصل لصفحات السلة/الإعجابات
// إذا كانت لديك صفحات منفصلة لهم

// وظائف مساعدة (مثال فقط، تحتاج إلى تنفيذها بالكامل لصفحات السلة/الإعجابات)
function updateCartTotal() {
    // هذه وظيفة وهمية، تحتاج إلى قراءة عناصر السلة من Local Storage
    // وحساب الإجمالي الفعلي.
    const cartTotalElement = document.getElementById('cart-total');
    if (cartTotalElement) {
        // افترض أن لديك دالة تجلب الإجمالي، مثلاً getCartTotalPrice()
        // cartTotalElement.textContent = `${getCartTotalPrice()} جنيه`;
        cartTotalElement.textContent = "0 جنيه"; // Placeholder
    }
}

// هذه الدالة ستكون في صفحة السلة cart.html
// document.addEventListener('DOMContentLoaded', () => {
//     if (document.body.classList.contains('cart-page')) { // استخدم فئة لتحديد الصفحة
//         // تحميل عناصر السلة من Local Storage وعرضها
//         // تحديث الإجمالي بعد التحميل
//         updateCartTotal();
//     }
// });