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