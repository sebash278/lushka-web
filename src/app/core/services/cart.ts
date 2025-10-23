import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Cart, CartItem, CartSummary } from '../../shared/models';
import { Product } from '../../shared/models/product';
import { Combo } from '../../shared/models/combo';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private readonly STORAGE_KEY = 'lushka_cart';
  private cartSubject = new BehaviorSubject<Cart>(this.getInitialCart());
  public cart$ = this.cartSubject.asObservable();

  constructor() {
    this.loadCartFromStorage();
  }

  private getInitialCart(): Cart {
    return {
      id: this.generateId(),
      items: [],
      total: 0,
      subtotal: 0,
      discount: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    };
  }

  private generateId(): string {
    return `cart_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private loadCartFromStorage(): void {
    try {
      const storedCart = localStorage.getItem(this.STORAGE_KEY);
      if (storedCart) {
        const parsedCart = JSON.parse(storedCart);
        parsedCart.createdAt = new Date(parsedCart.createdAt);
        parsedCart.updatedAt = new Date(parsedCart.updatedAt);
        this.cartSubject.next(parsedCart);
      }
    } catch (error) {
      console.warn('Error loading cart from storage:', error);
    }
  }

  private saveCartToStorage(): void {
    try {
      const cart = this.cartSubject.value;
      const cartForStorage = {
        ...cart,
        createdAt: cart.createdAt.toISOString(),
        updatedAt: cart.updatedAt.toISOString()
      };
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(cartForStorage));
    } catch (error) {
      console.warn('Error saving cart to storage:', error);
    }
  }

  private updateCart(items: CartItem[]): void {
    const subtotal = items.reduce((sum, item) => sum + item.totalPrice, 0);
    const discount = 0; // TODO: logica del descuento

    const updatedCart: Cart = {
      ...this.cartSubject.value,
      items,
      subtotal,
      discount,
      total: subtotal - discount,
      updatedAt: new Date()
    };

    this.cartSubject.next(updatedCart);
    this.saveCartToStorage();
  }

  public addProduct(product: Product, quantity: number = 1): void {
    const cart = this.cartSubject.value;
    const existingItem = cart.items.find(item =>
      item.type === 'product' && item.product?.id === product.id
    );

    let items: CartItem[];

    if (existingItem) {
      items = cart.items.map(item =>
        item.id === existingItem.id
          ? {
              ...item,
              quantity: item.quantity + quantity,
              totalPrice: (item.quantity + quantity) * item.unitPrice
            }
          : item
      );
    } else {
      const newItem: CartItem = {
        id: this.generateId(),
        type: 'product',
        product,
        quantity,
        unitPrice: product.price,
        totalPrice: product.price * quantity,
        addedAt: new Date()
      };
      items = [...cart.items, newItem];
    }

    this.updateCart(items);
  }

  public addCombo(combo: Combo, quantity: number = 1): void {
    const cart = this.cartSubject.value;
    const existingItem = cart.items.find(item =>
      item.type === 'combo' && item.combo?.id === combo.id
    );

    let items: CartItem[];

    if (existingItem) {
      items = cart.items.map(item =>
        item.id === existingItem.id
          ? {
              ...item,
              quantity: item.quantity + quantity,
              totalPrice: (item.quantity + quantity) * item.unitPrice
            }
          : item
      );
    } else {
      const newItem: CartItem = {
        id: this.generateId(),
        type: 'combo',
        combo,
        quantity,
        unitPrice: combo.price,
        totalPrice: combo.price * quantity,
        addedAt: new Date()
      };
      items = [...cart.items, newItem];
    }

    this.updateCart(items);
  }

  public updateItemQuantity(itemId: string, quantity: number): void {
    const cart = this.cartSubject.value;
    const item = cart.items.find(item => item.id === itemId);

    if (!item) return;

    if (quantity <= 0) {
      this.removeItem(itemId);
      return;
    }

    const items = cart.items.map(cartItem =>
      cartItem.id === itemId
        ? {
            ...cartItem,
            quantity,
            totalPrice: quantity * cartItem.unitPrice
          }
        : cartItem
    );

    this.updateCart(items);
  }

  public removeItem(itemId: string): void {
    const cart = this.cartSubject.value;
    const items = cart.items.filter(item => item.id !== itemId);
    this.updateCart(items);
  }

  public clearCart(): void {
    this.updateCart([]);
  }

  public getCartSummary(): CartSummary {
    const cart = this.cartSubject.value;
    return {
      subtotal: cart.subtotal,
      discount: cart.discount,
      total: cart.total,
      itemCount: cart.items.reduce((sum, item) => sum + item.quantity, 0),
      items: cart.items
    };
  }

  public getItemQuantity(productId: string): number {
    const cart = this.cartSubject.value;
    const item = cart.items.find(item =>
      (item.type === 'product' && item.product?.id === productId) ||
      (item.type === 'combo' && item.combo?.id === productId)
    );
    return item?.quantity || 0;
  }

  public isInCart(productId: string): boolean {
    return this.getItemQuantity(productId) > 0;
  }
}
