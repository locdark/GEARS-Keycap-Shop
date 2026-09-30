// ============================================================================
// GEARS KEYCAP SHOP - PRODUCT SERVICE (OOP SINGLETON)
// Quan ly danh muc san pham Keycap, ton kho, phan loai, loc tim kiem
// ============================================================================

class ProductService {
    constructor(storageService) {
        if (ProductService.instance) {
            return ProductService.instance;
        }
        this._storage = storageService || (typeof StorageService !== 'undefined' ? StorageService.getInstance() : null);
        ProductService.instance = this;
    }

    static getInstance(storageService) {
        if (!ProductService.instance) {
            ProductService.instance = new ProductService(storageService);
        }
        return ProductService.instance;
    }

    getAll() {
        return this._getStorage().get('product', []);
    }

    getById(id) {
        const products = this.getAll();
        return products.find(p => String(p.id) === String(id)) || null;
    }

    filterByCategory(category) {
        const products = this.getAll();
        if (!category || category === 'all' || category === 'ALL') {
            return products;
        }
        return products.filter(p => (p.type || '').toLowerCase() === category.toLowerCase());
    }

    search(keyword, category = null) {
        let products = this.getAll();
        if (category && category !== 'all' && category !== 'ALL') {
            products = products.filter(p => (p.type || '').toLowerCase() === category.toLowerCase());
        }
        if (!keyword || !keyword.trim()) {
            return products;
        }
        const q = keyword.toLowerCase().trim();
        return products.filter(p => 
            (p.name && p.name.toLowerCase().includes(q)) ||
            (p.description && p.description.toLowerCase().includes(q)) ||
            (String(p.id).includes(q))
        );
    }

    add(productData) {
        const products = this.getAll();
        const maxId = products.reduce((max, p) => Math.max(max, Number(p.id) || 0), 0);
        const newProduct = {
            id: maxId + 1,
            name: productData.name.trim(),
            type: productData.type || 'Other',
            price: Number(productData.price) || 0,
            costPrice: Number(productData.costPrice) || Math.round((Number(productData.price) || 0) * 0.65),
            stock: Number(productData.stock) || 0,
            img: productData.img || './assets/img/ShortCut_Icon.png',
            description: productData.description || '',
            supplierId: productData.supplierId || 1
        };

        products.push(newProduct);
        this._getStorage().set('product', products);
        return newProduct;
    }

    update(id, productData) {
        const products = this.getAll();
        const index = products.findIndex(p => String(p.id) === String(id));
        if (index === -1) return null;

        products[index] = {
            ...products[index],
            name: productData.name !== undefined ? productData.name.trim() : products[index].name,
            type: productData.type !== undefined ? productData.type : products[index].type,
            price: productData.price !== undefined ? Number(productData.price) : products[index].price,
            costPrice: productData.costPrice !== undefined ? Number(productData.costPrice) : products[index].costPrice,
            stock: productData.stock !== undefined ? Number(productData.stock) : products[index].stock,
            img: productData.img !== undefined ? productData.img : products[index].img,
            description: productData.description !== undefined ? productData.description : products[index].description,
            supplierId: productData.supplierId !== undefined ? productData.supplierId : products[index].supplierId
        };

        this._getStorage().set('product', products);
        return products[index];
    }

    delete(id) {
        const products = this.getAll();
        const filtered = products.filter(p => String(p.id) !== String(id));
        if (filtered.length !== products.length) {
            this._getStorage().set('product', filtered);
            return true;
        }
        return false;
    }

    adjustStock(id, delta) {
        const products = this.getAll();
        const product = products.find(p => String(p.id) === String(id));
        if (!product) return null;

        product.stock = Math.max(0, (product.stock || 0) + delta);
        this._getStorage().set('product', products);
        return product;
    }

    resolveImgPath(imgSrc, context = 'admin') {
        if (!imgSrc || typeof imgSrc !== 'string') {
            return context === 'admin' ? '../img/ShortCut_Icon.png' : './assets/img/ShortCut_Icon.png';
        }

        const trimmed = imgSrc.trim();
        if (trimmed.startsWith('data:image/') || trimmed.startsWith('blob:') || trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
            return trimmed;
        }

        if (context === 'admin') {
            if (trimmed.startsWith('./assets/img/')) {
                return trimmed.replace('./assets/img/', '../img/');
            }
            if (trimmed.startsWith('assets/img/')) {
                return trimmed.replace('assets/img/', '../img/');
            }
            if (trimmed.startsWith('/assets/img/')) {
                return trimmed.replace('/assets/img/', '../img/');
            }
            if (trimmed.startsWith('./img/')) {
                return trimmed.replace('./img/', '../img/');
            }
            if (!trimmed.startsWith('../img/') && !trimmed.startsWith('./') && !trimmed.startsWith('../')) {
                return '../img/' + trimmed;
            }
            return trimmed;
        } else {
            // Client Store context
            if (trimmed.startsWith('../img/')) {
                return trimmed.replace('../img/', './assets/img/');
            }
            if (trimmed.startsWith('/assets/img/')) {
                return '.' + trimmed;
            }
            if (!trimmed.startsWith('./') && !trimmed.startsWith('../') && !trimmed.startsWith('assets/')) {
                return './assets/img/' + trimmed;
            }
            return trimmed;
        }
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
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = ProductService;
}
if (typeof window !== 'undefined') {
    window.ProductService = ProductService;
}
