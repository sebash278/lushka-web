import { TestBed } from '@angular/core/testing';
import { of, take } from 'rxjs';

import { CartService } from './cart';
import { Product } from '../../shared/models/product';
import { Combo } from '../../shared/models/combo';

describe('CartService', () => {
  let service: CartService;
  let localStorageMock: {
    getItem: jasmine.Spy;
    setItem: jasmine.Spy;
    removeItem: jasmine.Spy;
    clear: jasmine.Spy;
  };

  const mockProduct: Product = {
    id: 'product1',
    name: 'Test Product',
    description: 'Test Description',
    price: 10.99,
    images: ['image1.jpg'],
    category: 'electronics',
    tags: [],
    stock: 100,
    featured: false,
    sku: 'TEST-001',
    createdAt: new Date(),
    updatedAt: new Date()
  };

  const mockCombo: Combo = {
    id: 'combo1',
    name: 'Test Combo',
    description: 'Test Combo Description',
    price: 15.99,
    originalPrice: 20.00,
    images: ['combo1.jpg'],
    products: [],
    category: 'electronics',
    tags: [],
    stock: 50,
    featured: false,
    sku: 'COMBO-001',
    createdAt: new Date(),
    updatedAt: new Date()
  };

  beforeEach(() => {
    localStorageMock = {
      getItem: jasmine.createSpy('getItem'),
      setItem: jasmine.createSpy('setItem'),
      removeItem: jasmine.createSpy('removeItem'),
      clear: jasmine.createSpy('clear')
    };

    Object.defineProperty(window, 'localStorage', {
      value: localStorageMock,
      writable: true
    });

    TestBed.configureTestingModule({});
    service = TestBed.inject(CartService);
    localStorageMock.getItem.and.returnValue(null);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should initialize with empty cart', (done) => {
    service.cart$.subscribe(cart => {
      expect(cart.items).toEqual([]);
      expect(cart.total).toBe(0);
      expect(cart.subtotal).toBe(0);
      expect(cart.discount).toBe(0);
      done();
    });
  });

  describe('Product Management', () => {
    it('should add a product to cart', (done) => {
      service.addProduct(mockProduct, 1);

      service.cart$.subscribe(cart => {
        expect(cart.items).toHaveSize(1);
        expect(cart.items[0].product?.id).toBe(mockProduct.id);
        expect(cart.items[0].quantity).toBe(1);
        expect(cart.items[0].totalPrice).toBe(mockProduct.price);
        expect(cart.total).toBe(mockProduct.price);
        expect(cart.subtotal).toBe(mockProduct.price);
        expect(localStorageMock.setItem).toHaveBeenCalled();
        done();
      });
    });

    it('should increase quantity when adding same product again', (done) => {
      service.addProduct(mockProduct, 1);
      service.addProduct(mockProduct, 2);

      service.cart$.subscribe(cart => {
        expect(cart.items).toHaveSize(1);
        expect(cart.items[0].quantity).toBe(3);
        expect(cart.items[0].totalPrice).toBe(mockProduct.price * 3);
        expect(cart.total).toBe(mockProduct.price * 3);
        done();
      });
    });

    it('should add multiple different products', (done) => {
      const anotherProduct = { ...mockProduct, id: 'product2', price: 5.99 };

      service.addProduct(mockProduct, 1);
      service.addProduct(anotherProduct, 2);

      service.cart$.subscribe(cart => {
        expect(cart.items).toHaveSize(2);
        expect(cart.total).toBe(10.99 + (5.99 * 2));
        expect(cart.subtotal).toBe(10.99 + (5.99 * 2));
        done();
      });
    });
  });

  describe('Combo Management', () => {
    it('should add a combo to cart', (done) => {
      service.addCombo(mockCombo, 1);

      service.cart$.subscribe(cart => {
        expect(cart.items).toHaveSize(1);
        expect(cart.items[0].combo?.id).toBe(mockCombo.id);
        expect(cart.items[0].quantity).toBe(1);
        expect(cart.items[0].totalPrice).toBe(mockCombo.price);
        expect(cart.total).toBe(mockCombo.price);
        done();
      });
    });

    it('should increase quantity when adding same combo again', (done) => {
      service.addCombo(mockCombo, 1);
      service.addCombo(mockCombo, 3);

      service.cart$.subscribe(cart => {
        expect(cart.items).toHaveSize(1);
        expect(cart.items[0].quantity).toBe(4);
        expect(cart.items[0].totalPrice).toBe(mockCombo.price * 4);
        expect(cart.total).toBe(mockCombo.price * 4);
        done();
      });
    });
  });

  describe('Item Management', () => {
    beforeEach(() => {
      service.addProduct(mockProduct, 2);
      service.addCombo(mockCombo, 1);
    });

    it('should update item quantity', (done) => {
      // Get initial cart and find product item
      service.cart$.pipe(take(1)).subscribe(cart => {
        const productItem = cart.items.find(item => item.type === 'product');
        expect(productItem).toBeDefined();

        if (productItem) {
          // Update quantity
          service.updateItemQuantity(productItem.id, 5);

          // Check updated cart
          service.cart$.pipe(take(1)).subscribe(updatedCart => {
            const updatedProductItem = updatedCart.items.find(item => item.type === 'product');
            expect(updatedProductItem?.quantity).toBe(5);
            expect(updatedProductItem?.totalPrice).toBe(mockProduct.price * 5);
            done();
          });
        }
      });
    });

    it('should remove item when quantity is 0 or less', (done) => {
      service.cart$.pipe(take(1)).subscribe(cart => {
        const productItem = cart.items.find(item => item.type === 'product');
        expect(productItem).toBeDefined();

        if (productItem) {
          // Set quantity to 0 (should remove item)
          service.updateItemQuantity(productItem.id, 0);

          // Check updated cart
          service.cart$.pipe(take(1)).subscribe(updatedCart => {
            expect(updatedCart.items).toHaveSize(1);
            expect(updatedCart.items[0].type).toBe('combo');
            expect(updatedCart.items[0].combo?.id).toBe(mockCombo.id);
            done();
          });
        }
      });
    });

    it('should remove item by ID', (done) => {
      service.cart$.pipe(take(1)).subscribe(cart => {
        const productItem = cart.items.find(item => item.type === 'product');
        expect(productItem).toBeDefined();

        if (productItem) {
          // Remove item by ID
          service.removeItem(productItem.id);

          // Check updated cart
          service.cart$.pipe(take(1)).subscribe(updatedCart => {
            expect(updatedCart.items).toHaveSize(1);
            expect(updatedCart.items[0].type).toBe('combo');
            expect(updatedCart.items[0].combo?.id).toBe(mockCombo.id);
            done();
          });
        }
      });
    });

    it('should clear cart', (done) => {
      // Clear cart
      service.clearCart();

      // Check that cart is empty
      service.cart$.pipe(take(1)).subscribe(cart => {
        expect(cart.items).toEqual([]);
        expect(cart.total).toBe(0);
        expect(cart.subtotal).toBe(0);
        done();
      });
    });
  });

  describe('Cart Summary', () => {
    beforeEach(() => {
      service.addProduct(mockProduct, 2);
      service.addCombo(mockCombo, 1);
    });

    it('should return correct cart summary', () => {
      const summary = service.getCartSummary();

      expect(summary.subtotal).toBe((mockProduct.price * 2) + mockCombo.price);
      expect(summary.discount).toBe(0);
      expect(summary.total).toBe((mockProduct.price * 2) + mockCombo.price);
      expect(summary.itemCount).toBe(3);
      expect(summary.items).toHaveSize(2);
    });
  });

  describe('Utility Methods', () => {
    beforeEach(() => {
      service.addProduct(mockProduct, 2);
    });

    it('should return item quantity for existing product', () => {
      const quantity = service.getItemQuantity(mockProduct.id);
      expect(quantity).toBe(2);
    });

    it('should return 0 for non-existing product', () => {
      const quantity = service.getItemQuantity('non-existing-id');
      expect(quantity).toBe(0);
    });

    it('should return true for product in cart', () => {
      const inCart = service.isInCart(mockProduct.id);
      expect(inCart).toBe(true);
    });

    it('should return false for product not in cart', () => {
      const inCart = service.isInCart('non-existing-id');
      expect(inCart).toBe(false);
    });
  });

  describe('Storage Management', () => {
    it('should load cart from localStorage on initialization', () => {
      const mockCart = {
        id: 'stored-cart',
        items: [],
        total: 25.99,
        subtotal: 25.99,
        discount: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      localStorageMock.getItem.and.returnValue(JSON.stringify(mockCart));

      TestBed.resetTestingModule();
      TestBed.configureTestingModule({
        providers: []
      });
      service = TestBed.inject(CartService);

      expect(localStorageMock.getItem).toHaveBeenCalledWith('lushka_cart');
    });

    it('should handle localStorage errors gracefully', () => {
      localStorageMock.getItem.and.throwError('Storage error');

      expect(() => {
        TestBed.resetTestingModule();
        TestBed.configureTestingModule({});
        service = TestBed.inject(CartService);
      }).not.toThrow();
    });
  });
});
