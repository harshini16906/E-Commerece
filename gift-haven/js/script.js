// ================================
// Gift Haven - Main JavaScript
// ================================

// Initialize cart from localStorage
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Add event listeners when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Contact form submission
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', handleFormSubmit);
        setupContactFormValidation();
    }

    // Checkout button
    const checkoutBtn = document.querySelector('.btn-checkout');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', handleCheckout);
    }

    // Back to top button
    setupBackToTopButton();

    // Update cart display if on cart page
    updateCartDisplay();
    updateCartCount();

    // Scroll event for navbar and back-to-top
    window.addEventListener('scroll', handleScroll);
});

// ================================
// Add to Cart Function
// ================================
/**
 * Add a product to the shopping cart
 * @param {string} productName - Name of the product
 * @param {number} price - Price of the product (optional)
 */
function addToCart(productName, price = 0) {
    // Check if product already exists in cart
    const existingProduct = cart.find(item => item.name === productName);

    if (existingProduct) {
        existingProduct.quantity += 1;
        showNotification(`${productName} quantity updated!`);
    } else {
        cart.push({
            id: Date.now(),
            name: productName,
            price: price,
            quantity: 1
        });
        showNotification(`${productName} added to cart!`);
    }

    // Save cart to localStorage and update count
    saveCart();
    updateCartCount();
}

// ================================
// Save Cart to LocalStorage
// ================================
/**
 * Save cart data to browser's localStorage
 */
function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
}

// ================================
// Update Cart Count Display
// ================================
/**
 * Update the cart count badge in navigation
 */
function updateCartCount() {
    const cartCountEl = document.getElementById('cart-count');
    if (!cartCountEl) return;
    
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCountEl.textContent = totalItems;
    cartCountEl.style.display = totalItems > 0 ? 'inline-flex' : 'none';
}

// ================================
// Update Cart Display
// ================================
/**
 * Update the cart table and summary on cart page
 */
function updateCartDisplay() {
    const cartItems = document.getElementById('cart-items');
    
    if (!cartItems) return; // Not on cart page

    // Clear existing items
    cartItems.innerHTML = '';

    if (cart.length === 0) {
        cartItems.innerHTML = '<tr><td colspan="5" class="empty-cart">Your cart is empty. <a href="products.html">Continue shopping</a></td></tr>';
        updateCartSummary(0, 0, 0);
        return;
    }

    let subtotal = 0;

    // Display each cart item
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        subtotal += itemTotal;

        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.name}</td>
            <td>$${item.price.toFixed(2)}</td>
            <td>
                <input type="number" value="${item.quantity}" min="1" 
                       onchange="updateQuantity(${item.id}, this.value)">
            </td>
            <td>$${itemTotal.toFixed(2)}</td>
            <td>
                <button class="btn btn-secondary" onclick="removeFromCart(${item.id})">
                    Remove
                </button>
            </td>
        `;
        cartItems.appendChild(row);
    });

    updateCartSummary(subtotal);
}

// ================================
// Update Cart Summary
// ================================
/**
 * Update the cart totals (subtotal, shipping, tax, total)
 * @param {number} subtotal - Subtotal amount
 */
function updateCartSummary(subtotal) {
    const shipping = subtotal > 0 ? 10 : 0; // Free shipping over $50
    const tax = subtotal * 0.08; // 8% tax
    const total = subtotal + shipping + tax;

    // Update summary display
    const subtotalEl = document.getElementById('subtotal');
    const shippingEl = document.getElementById('shipping');
    const taxEl = document.getElementById('tax');
    const totalEl = document.getElementById('total');

    if (subtotalEl) subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
    if (shippingEl) shippingEl.textContent = `$${shipping.toFixed(2)}`;
    if (taxEl) taxEl.textContent = `$${tax.toFixed(2)}`;
    if (totalEl) totalEl.textContent = `$${total.toFixed(2)}`;
}

// ================================
// Update Product Quantity
// ================================
/**
 * Update the quantity of a product in the cart
 * @param {number} productId - ID of the product
 * @param {number} newQuantity - New quantity value
 */
function updateQuantity(productId, newQuantity) {
    const product = cart.find(item => item.id === productId);
    
    if (product) {
        newQuantity = parseInt(newQuantity);
        
        if (newQuantity > 0) {
            product.quantity = newQuantity;
            saveCart();
            updateCartDisplay();
        } else {
            removeFromCart(productId);
        }
    }
}

// ================================
// Remove from Cart
// ================================
/**
 * Remove a product from the cart
 * @param {number} productId - ID of the product to remove
 */
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    updateCartDisplay();
    showNotification('Item removed from cart!');
}

// ================================
// Handle Checkout
// ================================
/**
 * Process checkout (placeholder function)
 */
function handleCheckout() {
    if (cart.length === 0) {
        showNotification('Your cart is empty!');
        return;
    }

    showNotification('Proceeding to checkout... (This is a demo)', 'success');
    
    // In a real application, this would redirect to checkout page
    // or process payment
    setTimeout(() => {
        // alert('Thank you for your purchase!');
        // cart = [];
        // saveCart();
        // updateCartDisplay();
    }, 2000);
}

// ================================
// Contact Form Validation Setup
// ================================
/**
 * Setup real-time validation for contact form fields
 */
function setupContactFormValidation() {
    const form = document.getElementById('contactForm');
    if (!form) return;

    const inputs = form.querySelectorAll('input[type="text"], input[type="email"], input[type="tel"], textarea');
    
    inputs.forEach(input => {
        // Validate on blur
        input.addEventListener('blur', function() {
            validateField(this);
        });

        // Remove error on focus
        input.addEventListener('focus', function() {
            clearFieldError(this);
        });
    });
}

/**
 * Validate individual form field
 * @param {HTMLElement} field - Form field element
 * @returns {boolean} - True if valid, false otherwise
 */
function validateField(field) {
    const fieldName = field.getAttribute('name');
    const value = field.value.trim();
    let isValid = true;
    let errorMessage = '';

    switch(fieldName) {
        case 'name':
            if (value.length < 2) {
                isValid = false;
                errorMessage = 'Name must be at least 2 characters';
            }
            break;
        case 'email':
            if (!isValidEmail(value)) {
                isValid = false;
                errorMessage = 'Please enter a valid email address';
            }
            break;
        case 'subject':
            if (value.length < 5) {
                isValid = false;
                errorMessage = 'Subject must be at least 5 characters';
            }
            break;
        case 'message':
            if (value.length < 10) {
                isValid = false;
                errorMessage = 'Message must be at least 10 characters';
            }
            break;
    }

    if (!isValid) {
        showFieldError(field, errorMessage);
    }

    return isValid;
}

/**
 * Show error message for a field
 * @param {HTMLElement} field - Form field element
 * @param {string} message - Error message
 */
function showFieldError(field, message) {
    field.classList.add('error');
    const fieldName = field.getAttribute('name');
    const errorEl = document.getElementById(`${fieldName}Error`);
    if (errorEl) {
        errorEl.textContent = message;
        errorEl.classList.add('show');
    }
}

/**
 * Clear error for a field
 * @param {HTMLElement} field - Form field element
 */
function clearFieldError(field) {
    field.classList.remove('error');
    const fieldName = field.getAttribute('name');
    const errorEl = document.getElementById(`${fieldName}Error`);
    if (errorEl) {
        errorEl.textContent = '';
        errorEl.classList.remove('show');
    }
}

// ================================
// Contact Form Submission
// ================================
/**
 * Handle contact form submission with validation
 * @param {Event} event - Form submit event
 */
function handleFormSubmit(event) {
    event.preventDefault();

    const form = document.getElementById('contactForm');
    const nameField = document.getElementById('name');
    const emailField = document.getElementById('email');
    const subjectField = document.getElementById('subject');
    const messageField = document.getElementById('message');

    // Validate all fields
    const isNameValid = validateField(nameField);
    const isEmailValid = validateField(emailField);
    const isSubjectValid = validateField(subjectField);
    const isMessageValid = validateField(messageField);

    if (!isNameValid || !isEmailValid || !isSubjectValid || !isMessageValid) {
        showNotification('Please fix the errors in the form', 'error');
        return;
    }

    // Get form data
    const formData = {
        name: nameField.value.trim(),
        email: emailField.value.trim(),
        phone: document.getElementById('phone').value.trim(),
        subject: subjectField.value.trim(),
        message: messageField.value.trim()
    };

    // Log form data (in real application, send to server)
    console.log('📧 Message Sent:', formData);

    // Hide form and show success message
    form.style.display = 'none';
    const successMsg = document.getElementById('successMessage');
    if (successMsg) {
        successMsg.style.display = 'flex';
    }

    // Show notification
    showNotification('Message sent successfully! We will get back to you within 24 hours.', 'success');

    // Reset form after 3 seconds
    setTimeout(() => {
        form.reset();
        form.style.display = 'block';
        if (successMsg) {
            successMsg.style.display = 'none';
        }
    }, 5000);
}

// ================================
// Email Validation
// ================================
/**
 * Validate email format
 * @param {string} email - Email address to validate
 * @returns {boolean} - True if valid, false otherwise
 */
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// ================================
// Notification System
// ================================
/**
 * Show a temporary notification message
 * @param {string} message - Message to display
 * @param {string} type - Type of notification: 'info', 'success', 'error'
 */
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        background-color: ${getNotificationColor(type)};
        color: white;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        font-weight: 600;
        z-index: 1000;
        animation: slideIn 0.3s ease;
    `;

    document.body.appendChild(notification);

    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// ================================
// Get Notification Color
// ================================
/**
 * Get the color for notification type
 * @param {string} type - Type of notification
 * @returns {string} - Color code
 */
function getNotificationColor(type) {
    const colors = {
        'info': '#2196F3',
        'success': '#4CAF50',
        'error': '#f44336'
    };
    return colors[type] || colors['info'];
}

// ================================
// CSS Animations (inject into document)
// ================================
/**
 * Add slide animations to document
 */
function injectAnimations() {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from {
                transform: translateX(400px);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }

        @keyframes slideOut {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(400px);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
}

// Inject animations when page loads
injectAnimations();

// ================================
// Back to Top Button Functions
// ================================
/**
 * Setup back to top button functionality
 */
function setupBackToTopButton() {
    const backToTopBtn = document.getElementById('backToTop');
    if (!backToTopBtn) return;

    // Show/hide button based on scroll position
    window.addEventListener('scroll', handleScroll);
}

/**
 * Handle scroll events for back-to-top and navbar effects
 */
function handleScroll() {
    const backToTopBtn = document.getElementById('backToTop');
    if (backToTopBtn) {
        if (window.scrollY > 300) {
            backToTopBtn.classList.add('show');
        } else {
            backToTopBtn.classList.remove('show');
        }
    }

    // Add scroll effect to navbar
    const navbar = document.getElementById('navbar');
    if (navbar) {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }
}

/**
 * Scroll to top of page smoothly
 */
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// ================================
// Console Message for Developers
// ================================
console.log('%c🎁 Welcome to Gift Haven!', 'font-size: 24px; color: #d81b60; font-weight: bold;');
console.log('For debugging, use: cart (to view cart), saveCart(), updateCartDisplay()');
