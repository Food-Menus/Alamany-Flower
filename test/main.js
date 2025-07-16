document.addEventListener('DOMContentLoaded', function() {
  // تنشيط الشريط الجانبي
  const sidebarToggle = document.querySelector('.sidebar-toggle');
  const sidebar = document.querySelector('.sidebar');
  const sidebarOverlay = document.querySelector('.sidebar-overlay');
  const closeSidebar = document.querySelector('.close-sidebar');

  sidebarToggle.addEventListener('click', function() {
    sidebar.classList.add('active');
    sidebarOverlay.classList.add('active');
  });

  closeSidebar.addEventListener('click', function() {
    sidebar.classList.remove('active');
    sidebarOverlay.classList.remove('active');
  });

  sidebarOverlay.addEventListener('click', function() {
    sidebar.classList.remove('active');
    sidebarOverlay.classList.remove('active');
  });

  // عرض العروض التلقائي
  let currentSlide = 0;
  const slides = document.querySelectorAll('.offer-slide');
  
  function showSlide(n) {
    slides.forEach(slide => slide.classList.remove('active'));
    currentSlide = (n + slides.length) % slides.length;
    slides[currentSlide].classList.add('active');
  }

  function nextSlide() {
    showSlide(currentSlide + 1);
  }

  // تغيير الشريحة كل 3 ثواني
  let slideInterval = setInterval(nextSlide, 3000);

  // إيقاف التمرير التلقائي عند التفاعل مع الشريحة
  const offersSlider = document.querySelector('.offers-slider');
  offersSlider.addEventListener('mouseenter', () => clearInterval(slideInterval));
  offersSlider.addEventListener('mouseleave', () => slideInterval = setInterval(nextSlide, 3000));

  // إدارة الإعجابات والسلة
  const likeButtons = document.querySelectorAll('.like');
  const addToCartButtons = document.querySelectorAll('.add-to-cart');

  likeButtons.forEach(button => {
    button.addEventListener('click', function() {
      // هنا سيتم إضافة المنتج إلى قائمة الإعجابات في localStorage
      const productCard = this.closest('.product-card');
      const productName = productCard.querySelector('.product-name').textContent;
      const productPrice = productCard.querySelector('.product-price').textContent;
      
      let likes = JSON.parse(localStorage.getItem('likes')) || [];
      likes.push({ name: productName, price: productPrice });
      localStorage.setItem('likes', JSON.stringify(likes));
      
      this.innerHTML = '<i class="fas fa-heart"></i> تم الإعجاب';
      this.style.backgroundColor = '#E91E63';
    });
  });

  addToCartButtons.forEach(button => {
    button.addEventListener('click', function() {
      // هنا سيتم إضافة المنتج إلى سلة التسوق في localStorage
      const productCard = this.closest('.product-card');
      const productName = productCard.querySelector('.product-name').textContent;
      const productPrice = productCard.querySelector('.product-price').textContent;
      
      let cart = JSON.parse(localStorage.getItem('cart')) || [];
      cart.push({ name: productName, price: productPrice });
      localStorage.setItem('cart', JSON.stringify(cart));
      
      this.innerHTML = '<i class="fas fa-check"></i> تمت الإضافة';
      this.style.backgroundColor = '#4CAF50';
      
      // تحديث عداد السلة
      updateCartCounter();
    });
  });

  // تحديث عداد السلة
  function updateCartCounter() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartCounter = document.querySelector('.cart-counter');
    if (cartCounter) {
      cartCounter.textContent = cart.length;
    }
  }

  // تنشيط عنصر التنقل الحالي
  const navItems = document.querySelectorAll('.nav-item');
  navItems.forEach(item => {
    item.addEventListener('click', function() {
      navItems.forEach(nav => nav.classList.remove('active'));
      this.classList.add('active');
    });
  });

  // تحميل الصفحة الأولى
  updateCartCounter();
});