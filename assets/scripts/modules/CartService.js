// ============================================================================
// GEARS KEYCAP SHOP - CART SERVICE (OOP SINGLETON)
// Quan ly gio hang khach hang, ho tro them gio hang khong can dang nhap
// ============================================================================

class CartService {
    constructor(storageService, productService) {
        if (CartService.instance) {
            return CartService.instance;
        }
        this._storage = storageService || (typeof StorageService !== 'undefined' ? StorageService.getInstance() : null);
        this._productService = productService || (typeof ProductService !== 'undefined' ? ProductService.getInstance() : null);
        this._cartKey = 'cart';
        this._discountPercent = 0;
        CartService.instance = this;
    }

    static getInstance(storageService, productService) {
        if (!CartService.instance) {
            CartService.instance = new CartService(storageService, productService);
        }
        return CartService.instance;
    }

    getCart() {
        return this._getStorage().get(this._cartKey, []);
    }

    saveCart(cartItems) {
        return this._getStorage().set(this._cartKey, cartItems);
    }

    /**
     * Them san pham vao gio hang (ho tro khach vang lai khong can dang nhap)
     */
    addItem(productId, quantity = 1) {
        const pService = this._getProductService();
        const product = pService.getById(productId);
        if (!product) {
            return { success: false, message: 'Không tìm thấy sản phẩm!' };
        }

        const qtyToAdd = Math.max(1, Number(quantity) || 1);
        const cart = this.getCart();
        const existingIndex = cart.findIndex(item => String(item.id) === String(productId));

        if (existingIndex !== -1) {
            cart[existingIndex].quantity += qtyToAdd;
        } else {
            cart.push({
                id: product.id,
                name: product.name,
                price: product.price,
                costPrice: product.costPrice || Math.round(product.price * 0.65),
                img: product.img,
                type: product.type,
                quantity: qtyToAdd
            });
        }

        this.saveCart(cart);
        return { success: true, cart: cart, addedItem: product, totalCount: this.getTotalCount() };
    }

    updateQuantity(productId, quantity) {
        const cart = this.getCart();
        const item = cart.find(i => String(i.id) === String(productId));
        if (!item) return false;

        const newQty = Number(quantity);
        if (newQty <= 0) {
            return this.removeItem(productId);
        } else {
            item.quantity = newQty;
            this.saveCart(cart);
            return true;
        }
    }

    removeItem(productId) {
        let cart = this.getCart();
        const initialLen = cart.length;
        cart = cart.filter(i => String(i.id) !== String(productId));
        if (cart.length !== initialLen) {
            this.saveCart(cart);
            return true;
        }
        return false;
    }

    clear() {
        this.saveCart([]);
        this._discountPercent = 0;
        return true;
    }

    getTotalCount() {
        const cart = this.getCart();
        return cart.reduce((sum, item) => sum + (Number(item.quantity) || 0), 0);
    }

    getSubtotal() {
        const cart = this.getCart();
        return cart.reduce((sum, item) => sum + (Number(item.price) || 0) * (Number(item.quantity) || 0), 0);
    }

    setDiscountPercent(percent) {
        this._discountPercent = Math.min(100, Math.max(0, Number(percent) || 0));
    }

    getDiscountAmount() {
        const subtotal = this.getSubtotal();
        return Math.round(subtotal * (this._discountPercent / 100));
    }

    getTotalAmount() {
        return Math.max(0, this.getSubtotal() - this.getDiscountAmount());
    }

    _getStorage() {
        if (!this._storage) {
            this._storage = (typeof StorageService !== 'undefined') ? StorageService.getInstance() : {
                get: (k, def) => {
                    try { const r = localStorage.getItem(k); return r ? JSON.parse(r) : def; } catch (e) { return def; }
                },
                set: (k, v) => {
                    try { localStorage.setItem(k, JSON.stringify(v)); return true; } catch (e) { return false; }
                }
            };
        }
        return this._storage;
    }

    _getProductService() {
        if (!this._productService) {
            this._productService = (typeof ProductService !== 'undefined') ? ProductService.getInstance() : {
                getById: (id) => {
                    const products = this._getStorage().get('product', []);
                    return products.find(p => String(p.id) === String(id)) || null;
                }
            };
        }
        return this._productService;
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = CartService;
}
if (typeof window !== 'undefined') {
    window.CartService = CartService;
}
