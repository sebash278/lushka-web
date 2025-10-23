import { TestBed } from '@angular/core/testing';

import { WhatsAppService } from './whatsapp';
import { CartSummary } from '../../shared/models';
import { Product } from '../../shared/models/product';
import { Combo } from '../../shared/models/combo';

describe('WhatsAppService', () => {
  let service: WhatsAppService;
  let windowOpenSpy: jasmine.Spy;

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

  const mockCartSummary: CartSummary = {
    subtotal: 37.97,
    discount: 0,
    total: 37.97,
    itemCount: 4,
    items: [
      {
        id: 'item1',
        type: 'product',
        product: mockProduct,
        quantity: 2,
        unitPrice: 10.99,
        totalPrice: 21.98,
        addedAt: new Date()
      },
      {
        id: 'item2',
        type: 'combo',
        combo: mockCombo,
        quantity: 1,
        unitPrice: 15.99,
        totalPrice: 15.99,
        addedAt: new Date()
      }
    ]
  };

  beforeEach(() => {
    windowOpenSpy = spyOn(window, 'open');

    TestBed.configureTestingModule({});
    service = TestBed.inject(WhatsAppService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('sendCartToWhatsApp', () => {
    it('should open WhatsApp with formatted message', () => {
      service.sendCartToWhatsApp(mockCartSummary);

      expect(windowOpenSpy).toHaveBeenCalledWith(
        jasmine.stringContaining('https://wa.me/+573143638924'),
        '_blank'
      );
    });

    it('should include customer information in message', () => {
      const customerInfo = {
        name: 'John Doe',
        email: 'john@example.com',
        phone: '+1234567890',
        address: '123 Main St'
      };

      service.sendCartToWhatsApp(mockCartSummary, customerInfo);

      const whatsappUrl = (windowOpenSpy as jasmine.Spy).calls.first().args[0];
      expect(whatsappUrl).toContain('John%20Doe');
      expect(whatsappUrl).toContain('john%40example.com');
      expect(whatsappUrl).toContain('123%20Main%20St');
    });

    it('should handle empty customer information', () => {
      service.sendCartToWhatsApp(mockCartSummary);

      expect(windowOpenSpy).toHaveBeenCalledWith(
        jasmine.stringContaining('https://wa.me/+573143638924'),
        '_blank'
      );
    });
  });

  describe('Message Formatting', () => {
    it('should format cart summary correctly', () => {
      const message = service.generateMessageFromCart(mockCartSummary.items);

      expect(message).toContain('Nuevo%20Pedido%20-%20Lushka');
      expect(message).toContain('Detalles%20del%20Pedido');
      expect(message).toContain('Resumen%20del%20Pedido');
    });

    it('should include product details in message', () => {
      const message = service.generateMessageFromCart(mockCartSummary.items);

      expect(message).toContain('Test%20Product');
      expect(message).toContain('10.99');
      expect(message).toContain('TEST-001');
    });

    it('should include combo details in message', () => {
      const message = service.generateMessageFromCart(mockCartSummary.items);

      expect(message).toContain('Test%20Combo');
      expect(message).toContain('15.99');
      expect(message).toContain('COMBO-001');
    });

    it('should show savings for discounted combos', () => {
      const message = service.generateMessageFromCart(mockCartSummary.items);

      expect(message).toContain('4.01'); // 20.00 - 15.99 = 4.01 savings
    });

    it('should include order summary', () => {
      const message = service.generateMessageFromCart(mockCartSummary.items);

      expect(message).toContain('37.97'); // Total
      expect(message).toContain('4'); // Item count
    });
  });

  describe('sendCustomMessage', () => {
    it('should send custom message to WhatsApp', () => {
      const customMessage = 'Hello, I need help with my order';

      service.sendCustomMessage(customMessage);

      expect(windowOpenSpy).toHaveBeenCalledWith(
        jasmine.stringContaining('https://wa.me/+573143638924'),
        '_blank'
      );
      expect(windowOpenSpy).toHaveBeenCalledWith(
        jasmine.stringContaining(encodeURIComponent(customMessage)),
        '_blank'
      );
    });
  });

  describe('Utility Methods', () => {
    it('should return company phone number', () => {
      expect(service.getCompanyPhone()).toBe('+573143638924');
    });

    it('should detect mobile device correctly', () => {
      // Mock mobile user agent
      Object.defineProperty(navigator, 'userAgent', {
        value: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)',
        configurable: true
      });

      expect(service.isWhatsAppAvailable()).toBe(true);
    });

    it('should detect desktop device correctly', () => {
      // Mock desktop user agent
      Object.defineProperty(navigator, 'userAgent', {
        value: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        configurable: true
      });

      expect(service.isWhatsAppAvailable()).toBe(false);
    });

    it('should handle missing navigator user agent', () => {
      // Mock missing user agent
      Object.defineProperty(navigator, 'userAgent', {
        value: undefined,
        configurable: true
      });

      expect(service.isWhatsAppAvailable()).toBe(false);
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty cart', () => {
      const emptyCart: CartSummary = {
        subtotal: 0,
        discount: 0,
        total: 0,
        itemCount: 0,
        items: []
      };

      service.sendCartToWhatsApp(emptyCart);

      expect(windowOpenSpy).toHaveBeenCalledWith(
        jasmine.stringContaining('https://wa.me/+573143638924'),
        '_blank'
      );
    });

    it('should handle cart with discount', () => {
      const cartWithDiscount: CartSummary = {
        ...mockCartSummary,
        discount: 5.00,
        total: 32.97
      };

      service.sendCartToWhatsApp(cartWithDiscount);

      expect(windowOpenSpy).toHaveBeenCalledWith(
        jasmine.stringContaining('https://wa.me/+573143638924'),
        '_blank'
      );
    });

    it('should handle cart with only products', () => {
      const productsOnlyCart: CartSummary = {
        subtotal: 21.98,
        discount: 0,
        total: 21.98,
        itemCount: 2,
        items: [
          {
            id: 'item1',
            type: 'product',
            product: mockProduct,
            quantity: 2,
            unitPrice: 10.99,
            totalPrice: 21.98,
            addedAt: new Date()
          }
        ]
      };

      service.sendCartToWhatsApp(productsOnlyCart);

      expect(windowOpenSpy).toHaveBeenCalledWith(
        jasmine.stringContaining('https://wa.me/+573143638924'),
        '_blank'
      );
    });

    it('should handle cart with only combos', () => {
      const combosOnlyCart: CartSummary = {
        subtotal: 15.99,
        discount: 0,
        total: 15.99,
        itemCount: 1,
        items: [
          {
            id: 'item1',
            type: 'combo',
            combo: mockCombo,
            quantity: 1,
            unitPrice: 15.99,
            totalPrice: 15.99,
            addedAt: new Date()
          }
        ]
      };

      service.sendCartToWhatsApp(combosOnlyCart);

      expect(windowOpenSpy).toHaveBeenCalledWith(
        jasmine.stringContaining('https://wa.me/+573143638924'),
        '_blank'
      );
    });
  });
});
