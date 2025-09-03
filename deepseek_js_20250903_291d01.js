// Cart functionality
let cart = [];
let selectedPaymentMethod = 'cashapp';

// DOM Elements
const cartContainer = document.getElementById('cart-container');
const cartIcon = document.getElementById('cart-icon');
const cartCount = document.getElementById('cart-count');
const cartItems = document.getElementById('cart-items');
const cartTotal = document.getElementById('cart-total');
const closeCart = document.getElementById('close-cart');
const checkoutBtn = document.getElementById('checkout-btn');
const paymentSection = document.getElementById('payment-section');
const paymentMethods = document.querySelectorAll('.payment-method');
const completePaymentBtn = document.getElementById('complete-payment-btn');

// Toggle cart visibility
cartIcon.addEventListener('click', (e) => {
    e.preventDefault();
    cartContainer.style.display = cartContainer.style.display === 'block' ? 'none' : 'block';
});

closeCart.addEventListener('click', () => {
    cartContainer.style.display = 'none';
});

// Add to cart functionality
document.querySelectorAll('.pricing-card').forEach(card => {
    const button = card.querySelector('.add-to-cart');
    button.addEventListener('click', (e) => {
        e.stopPropagation();
        const product = card.dataset.product;
        const price = parseFloat(card.dataset.price);
        const name = card.querySelector('.plan-name').textContent;
        
        // Check if product is already in cart
        const existingItem = cart.find(item => item.product === product);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({
                product: product,
                name: name,
                price: price,
                quantity: 1
            });
        }
        
        updateCart();
        cartContainer.style.display = 'block';
        
        // Show confirmation
        button.innerHTML = '<i class="fas fa-check"></i> ADDED TO CART';
        setTimeout(() => {
            button.innerHTML = 'ADD TO CART';
        }, 2000);
    });
});

// Update cart UI
function updateCart() {
    cartItems.innerHTML = '';
    let total = 0;
    let count = 0;
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<p style="color: var(--gray); text-align: center; padding: 20px 0;">Your cart is empty</p>';
    } else {
        cart.forEach(item => {
            const itemTotal = item.price * item.quantity;
            total += itemTotal;
            count += item.quantity;
            
            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            cartItem.innerHTML = `
                <div class="cart-item-name">${item.name} x${item.quantity}</div>
                <div class="cart-item-price">$${itemTotal.toFixed(2)}</div>
            `;
            
            cartItems.appendChild(cartItem);
        });
    }
    
    cartTotal.textContent = `$${total.toFixed(2)}`;
    cartCount.textContent = count;
}

// Checkout process
checkoutBtn.addEventListener('click', () => {
    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }
    
    cartContainer.style.display = 'none';
    paymentSection.style.display = 'block';
    
    // Scroll to payment section
    paymentSection.scrollIntoView({ behavior: 'smooth' });
});

// Payment method selection
paymentMethods.forEach(method => {
    method.addEventListener('click', () => {
        // Remove selected class from all methods
        paymentMethods.forEach(m => m.classList.remove('selected'));
        
        // Add selected class to clicked method
        method.classList.add('selected');
        
        // Update selected payment method
        selectedPaymentMethod = method.dataset.method;
        
        // Show appropriate payment details
        document.querySelectorAll('.payment-method-details').forEach(detail => {
            detail.style.display = 'none';
        });
        
        if (selectedPaymentMethod === 'crypto') {
            document.getElementById('crypto-details').style.display = 'block';
        } else if (selectedPaymentMethod === 'robux') {
            document.getElementById('robux-details').style.display = 'block';
        } else if (selectedPaymentMethod === 'cashapp') {
            document.getElementById('cashapp-details').style.display = 'block';
        }
    });
});

// Complete payment process
completePaymentBtn.addEventListener('click', () => {
    const email = document.getElementById('email').value;
    
    if (!email) {
        alert('Please enter your email address');
        return;
    }
    
    // Validate payment method specific details
    if (selectedPaymentMethod === 'cashapp') {
        const cashappId = document.getElementById('cashapp-id').value;
        if (!cashappId) {
            alert('Please enter your CashApp ID');
            return;
        }
    } else if (selectedPaymentMethod === 'crypto') {
        const walletAddress = document.getElementById('crypto-wallet').value;
        if (!walletAddress) {
            alert('Please enter your wallet address');
            return;
        }
    } else if (selectedPaymentMethod === 'robux') {
        const robloxUser = document.getElementById('roblox-user').value;
        if (!robloxUser) {
            alert('Please enter your Roblox username');
            return;
        }
    }
    
    // Show processing overlay
    const overlay = document.createElement('div');
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.95)';
    overlay.style.display = 'flex';
    overlay.style.justifyContent = 'center';
    overlay.style.alignItems = 'center';
    overlay.style.zIndex = '1000';
    overlay.style.flexDirection = 'column';
    overlay.style.gap = '20px';
    
    const message = document.createElement('div');
    message.style.color = 'white';
    message.style.fontSize = '2rem';
    message.style.textAlign = 'center';
    message.innerHTML = 'Processing your payment...';
    
    const spinner = document.createElement('div');
    spinner.style.width = '50px';
    spinner.style.height = '50px';
    spinner.style.border = '5px solid rgba(255, 255, 255, 0.3)';
    spinner.style.borderRadius = '50%';
    spinner.style.borderTop = '5px solid var(--accent)';
    spinner.style.animation = 'spin 1s linear infinite';
    
    overlay.appendChild(message);
    overlay.appendChild(spinner);
    document.body.appendChild(overlay);
    
    // Simulate payment processing
    setTimeout(() => {
        message.innerHTML = 'Payment successful!<br><span style="font-size: 1rem;">Your product will be delivered via email.</span>';
        spinner.style.display = 'none';
        
        // Clear cart
        cart = [];
        updateCart();
        
        const closeBtn = document.createElement('button');
        closeBtn.textContent = 'Continue';
        closeBtn.style.padding = '10px 30px';
        closeBtn.style.background = 'var(--accent)';
        closeBtn.style.color = 'white';
        closeBtn.style.border = 'none';
        closeBtn.style.borderRadius = '50px';
        closeBtn.style.cursor = 'pointer';
        closeBtn.style.marginTop = '20px';
        closeBtn.onclick = function() {
            document.body.removeChild(overlay);
            paymentSection.style.display = 'none';
            
            // Reset form
            document.getElementById('email').value = '';
            document.getElementById('cashapp-id').value = '';
            document.getElementById('crypto-wallet').value = '';
            document.getElementById('roblox-user').value = '';
            
            // Scroll to top
            window.scrollTo({ top: 0, behavior: 'smooth' });
        };
        
        overlay.appendChild(closeBtn);
    }, 3000);
});

// FAQ toggle functionality
document.querySelectorAll('.faq-question').forEach(question => {
    question.addEventListener('click', () => {
        const answer = question.nextElementSibling;
        const icon = question.querySelector('i');
        
        if (answer.style.display === 'block') {
            answer.style.display = 'none';
            icon.classList.remove('fa-chevron-up');
            icon.classList.add('fa-chevron-down');
        } else {
            answer.style.display = 'block';
            icon.classList.remove('fa-chevron-down');
            icon.classList.add('fa-chevron-up');
        }
    });
});

// Pause animation on hover
const logo = document.querySelector('.spinning-logo');
logo.addEventListener('mouseenter', () => {
    logo.style.animationPlayState = 'paused';
});

logo.addEventListener('mouseleave', () => {
    logo.style.animationPlayState = 'running';
});

// Animate elements on scroll
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animation = 'fadeIn 1s forwards';
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe all feature cards and game cards
document.querySelectorAll('.feature-card, .game-card, .testimonial-card').forEach(el => {
    el.style.opacity = '0';
    observer.observe(el);
});

// Initialize with CashApp as default
document.querySelector('[data-method="cashapp"]').classList.add('selected');

// Initialize cart
updateCart();

// Animations
const style = document.createElement('style');
style.textContent = `
    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
    
    @keyframes pulse {
        0% { transform: scale(1); opacity: 0.7; }
        70% { transform: scale(2.5); opacity: 0; }
        100% { transform: scale(2.5); opacity: 0; }
    }
    
    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
    }
    
    @media (max-width: 768px) {
        header {
            padding: 15px 20px;
            flex-direction: column;
            gap: 15px;
        }
        
        h1 {
            font-size: 2.5rem;
        }
        
        .tagline {
            font-size: 1.1rem;
        }
        
        .pricing-card.popular {
            transform: scale(1);
        }
        
        .pricing-card.popular:hover {
            transform: translateY(-5px);
        }
        
        .pricing-card.popular::after {
            font-size: 0.7rem;
            right: -38px;
            padding: 4px 35px;
        }
        
        .games-grid {
            grid-template-columns: 1fr;
        }
        
        .features-grid {
            grid-template-columns: 1fr;
        }
        
        .comparison-table {
            font-size: 0.9rem;
        }
        
        .payment-methods {
            grid-template-columns: 1fr;
        }
        
        .form-row {
            flex-direction: column;
            gap: 0;
        }
        
        .footer-content {
            flex-direction: column;
            gap: 30px;
        }
        
        .footer-column {
            text-align: center;
        }
        
        .cart-container {
            position: static;
            width: 100%;
            margin-bottom: 30px;
        }
    }
`;
document.head.appendChild(style);