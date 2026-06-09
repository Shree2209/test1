// ============================================
// OVERSIZED - Shopping Cart Module
// ============================================

class Cart {
    constructor() {
        this.items = [];
        try {
            const stored = localStorage.getItem('oversized_cart');
            if (stored) {
                this.items = JSON.parse(stored);
            }
        } catch (e) {
            console.warn('Could not load cart from localStorage:', e);
            this.items = [];
        }
        this.listeners = [];
        this.init();
    }

    init() {
        this.updateCartUI();
        this.bindEvents();
    }

    bindEvents() {
        const cartBtn = document.getElementById('cartBtn');
        const cartClose = document.getElementById('cartClose');
        const cartOverlay = document.getElementById('cartOverlay');
        const continueShopping = document.getElementById('continueShopping');
        const checkoutBtn = document.getElementById('checkoutBtn');

        if (cartBtn) cartBtn.addEventListener('click', () => this.openCart());
        if (cartClose) cartClose.addEventListener('click', () => this.closeCart());
        if (cartOverlay) cartOverlay.addEventListener('click', () => this.closeCart());
        if (continueShopping) continueShopping.addEventListener('click', () => this.closeCart());

        // Checkout
        if (checkoutBtn) {
            checkoutBtn.addEventListener('click', () => {
                this.closeCart();
                if (typeof openCheckout === 'function') {
                    openCheckout();
                }
            });
        }
    }

    addItem(product, color, size, qty) {
        qty = qty || 1;
        const existingItem = this.items.find(
            item => item.id === product.id && item.color === color && item.size === size
        );

        if (existingItem) {
            existingItem.qty += qty;
        } else {
            this.items.push({
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.image,
                color: color,
                size: size,
                qty: qty
            });
        }

        this.save();
        this.updateCartUI();
        this.showToast(product.name + ' added to cart');
    }

    removeItem(index) {
        if (index >= 0 && index < this.items.length) {
            this.items.splice(index, 1);
            this.save();
            this.updateCartUI();
        }
    }

    updateQty(index, qty) {
        if (index < 0 || index >= this.items.length) return;

        if (qty < 1) {
            this.removeItem(index);
            return;
        }
        this.items[index].qty = qty;
        this.save();
        this.updateCartUI();
    }

    getSubtotal() {
        return this.items.reduce(function(sum, item) {
            return sum + (item.price * item.qty);
        }, 0);
    }

    getCount() {
        return this.items.reduce(function(sum, item) {
            return sum + item.qty;
        }, 0);
    }

    save() {
        try {
            localStorage.setItem('oversized_cart', JSON.stringify(this.items));
        } catch (e) {
            console.warn('Could not save cart to localStorage:', e);
        }
        this.notifyListeners();
    }

    openCart() {
        const sidebar = document.getElementById('cartSidebar');
        if (sidebar) {
            sidebar.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    }

    closeCart() {
        const sidebar = document.getElementById('cartSidebar');
        if (sidebar) {
            sidebar.classList.remove('active');
            document.body.style.overflow = '';
        }
    }

    updateCartUI() {
        const cartItems = document.getElementById('cartItems');
        const cartCount = document.getElementById('cartCount');
        const cartSubtotal = document.getElementById('cartSubtotal');
        const count = this.getCount();

        if (cartCount) {
            cartCount.textContent = count;
            cartCount.classList.toggle('visible', count > 0);
        }

        if (cartSubtotal) {
            cartSubtotal.textContent = '$' + this.getSubtotal().toFixed(2);
        }

        if (!cartItems) return;

        if (this.items.length === 0) {
            cartItems.innerHTML = '<div class="cart-empty"><p>Your cart is empty</p><p style="font-size: 0.8rem; margin-top: 0.5rem;">Add some tees to get started</p></div>';
        } else {
            cartItems.innerHTML = this.items.map(function(item, index) {
                return '<div class="cart-item">' +
                    '<img src="' + item.image + '" alt="' + item.name + '" class="cart-item-img">' +
                    '<div class="cart-item-details">' +
                        '<div>' +
                            '<div class="cart-item-name">' + item.name + '</div>' +
                            '<div class="cart-item-variant">' + item.color + ' / ' + item.size + '</div>' +
                        '</div>' +
                        '<div class="cart-item-actions">' +
                            '<div class="cart-item-qty">' +
                                '<button class="qty-btn" data-action="decrease" data-index="' + index + '">-</button>' +
                                '<span>' + item.qty + '</span>' +
                                '<button class="qty-btn" data-action="increase" data-index="' + index + '">+</button>' +
                            '</div>' +
                            '<span class="cart-item-price">$' + (item.price * item.qty).toFixed(2) + '</span>' +
                        '</div>' +
                    '</div>' +
                    '<button class="cart-item-remove" data-action="remove" data-index="' + index + '">' +
                        '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>' +
                    '</button>' +
                '</div>';
            }).join('');

            // Bind quantity buttons
            cartItems.querySelectorAll('.qty-btn, .cart-item-remove').forEach(function(btn) {
                btn.addEventListener('click', function(e) {
                    const index = parseInt(e.currentTarget.dataset.index);
                    const action = e.currentTarget.dataset.action;

                    if (action === 'increase') {
                        this.updateQty(index, this.items[index].qty + 1);
                    } else if (action === 'decrease') {
                        this.updateQty(index, this.items[index].qty - 1);
                    } else if (action === 'remove') {
                        this.removeItem(index);
                    }
                }.bind(this));
            }.bind(this));
        }
    }

    showToast(message) {
        const toast = document.getElementById('toast');
        const toastMessage = document.getElementById('toastMessage');

        if (!toast || !toastMessage) return;

        toastMessage.textContent = message;
        toast.classList.add('active', 'success');

        setTimeout(function() {
            toast.classList.remove('active', 'success');
        }, 3000);
    }

    notifyListeners() {
        this.listeners.forEach(function(listener) {
            listener(this.items);
        }.bind(this));
    }

    onChange(listener) {
        this.listeners.push(listener);
    }
}

// Checkout functionality
var checkoutStep = 1;

function openCheckout() {
    const modal = document.getElementById('checkoutModal');
    if (!modal) return;
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    updateCheckoutStep(1);
    renderOrderSummary();
}

function closeCheckout() {
    const modal = document.getElementById('checkoutModal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
    checkoutStep = 1;
}

function updateCheckoutStep(step) {
    checkoutStep = step;

    // Update step indicators
    document.querySelectorAll('.step').forEach(function(el, i) {
        el.classList.remove('active', 'completed');
        if (i + 1 < step) el.classList.add('completed');
        if (i + 1 === step) el.classList.add('active');
    });

    // Show current form step
    document.querySelectorAll('.form-step').forEach(function(el, i) {
        el.classList.toggle('active', i + 1 === step);
    });
}

function renderOrderSummary() {
    const summary = document.getElementById('orderSummary');
    if (!summary || typeof cart === 'undefined') return;

    const subtotal = cart.getSubtotal();
    const shipping = subtotal > 100 ? 0 : 8;
    const total = subtotal + shipping;

    var itemsHtml = cart.items.map(function(item) {
        return '<div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem; font-size: 0.85rem;">' +
            '<span>' + item.name + ' x' + item.qty + '</span>' +
            '<span>$' + (item.price * item.qty).toFixed(2) + '</span>' +
        '</div>';
    }).join('');

    summary.innerHTML = '<div style="margin-bottom: 1rem;">' +
        '<h4 style="margin-bottom: 1rem; font-size: 0.9rem;">Order Summary</h4>' +
        itemsHtml +
    '</div>' +
    '<div style="border-top: 1px solid var(--color-border); padding-top: 1rem;">' +
        '<div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem; font-size: 0.85rem; color: var(--color-text-secondary);">' +
            '<span>Subtotal</span>' +
            '<span>$' + subtotal.toFixed(2) + '</span>' +
        '</div>' +
        '<div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem; font-size: 0.85rem; color: var(--color-text-secondary);">' +
            '<span>Shipping</span>' +
            '<span>' + (shipping === 0 ? 'FREE' : '$' + shipping.toFixed(2)) + '</span>' +
        '</div>' +
        '<div style="display: flex; justify-content: space-between; margin-top: 1rem; padding-top: 1rem; border-top: 1px solid var(--color-border); font-weight: 600;">' +
            '<span>Total</span>' +
            '<span style="font-family: var(--font-display); font-size: 1.5rem; color: var(--color-accent);">$' + total.toFixed(2) + '</span>' +
        '</div>' +
    '</div>';
}

// Initialize cart
var cart = new Cart();

// Checkout event listeners
document.addEventListener('DOMContentLoaded', function() {
    const checkoutClose = document.getElementById('checkoutClose');
    const checkoutOverlay = document.getElementById('checkoutOverlay');

    if (checkoutClose) checkoutClose.addEventListener('click', closeCheckout);
    if (checkoutOverlay) checkoutOverlay.addEventListener('click', closeCheckout);

    document.querySelectorAll('.next-step').forEach(function(btn) {
        btn.addEventListener('click', function() {
            if (checkoutStep < 3) {
                updateCheckoutStep(checkoutStep + 1);
            }
        });
    });

    const checkoutForm = document.getElementById('checkoutForm');
    if (checkoutForm) {
        checkoutForm.addEventListener('submit', function(e) {
            e.preventDefault();
            if (typeof cart !== 'undefined') {
                cart.showToast('Order placed successfully!');
            }
            closeCheckout();
            if (typeof cart !== 'undefined') {
                cart.items = [];
                cart.save();
                cart.updateCartUI();
            }
        });
    }
});
