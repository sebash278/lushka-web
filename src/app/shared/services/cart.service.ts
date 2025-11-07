import { Injectable, signal, computed } from '@angular/core';
import { Product } from '../models/product';
import { Cart, CartItem, CartSummary } from '../models/cart';

export interface CartState {
  items: CartItem[];
  isOpen: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  // Usando señales de Angular para manejo de estado reactivo
  private cartState = signal<CartState>({
    items: [],
    isOpen: false
  });

  // Señales computadas públicas para que los componentes se suscriban
  cartItems = computed(() => this.cartState().items);
  cartItemCount = computed(() =>
    this.cartState().items.reduce((total, item) => total + item.quantity, 0)
  );
  cartTotal = computed(() =>
    this.cartState().items.reduce((total, item) => total + (item.totalPrice || 0), 0)
  );
  isCartOpen = computed(() => this.cartState().isOpen);

  constructor() {
    this.loadCartFromStorage();
  }

  // Agregar producto al carrito
  addToCart(product: Product, quantity: number = 1): void {
    const currentState = this.cartState();
    const existingItemIndex = currentState.items.findIndex(item =>
      item.type === 'product' && item.product?.id === product.id
    );

    let updatedItems: CartItem[];

    if (existingItemIndex >= 0) {
      // Actualizar item existente
      updatedItems = [...currentState.items];
      const existingItem = updatedItems[existingItemIndex];
      const newQuantity = Math.min(existingItem.quantity + quantity, product.stock);

      updatedItems[existingItemIndex] = {
        ...existingItem,
        quantity: newQuantity,
        totalPrice: newQuantity * (product.price * this.getDiscountMultiplier(product))
      };
    } else {
      // Agregar nuevo item
      const finalPrice = product.price * this.getDiscountMultiplier(product);
      const newItem: CartItem = {
        id: this.generateCartItemId(),
        type: 'product',
        product: product,
        quantity: Math.min(quantity, product.stock),
        unitPrice: product.price,
        totalPrice: Math.min(quantity, product.stock) * finalPrice,
        addedAt: new Date()
      };
      updatedItems = [...currentState.items, newItem];
    }

    this.updateCartState(updatedItems);
    this.saveCartToStorage();
  }

  // Eliminar item del carrito
  removeFromCart(itemId: string): void {
    const currentState = this.cartState();
    const updatedItems = currentState.items.filter(item => item.id !== itemId);
    this.updateCartState(updatedItems);
    this.saveCartToStorage();
  }

  // Actualizar cantidad del item
  updateQuantity(itemId: string, quantity: number): void {
    const currentState = this.cartState();
    const updatedItems = currentState.items.map(item => {
      if (item.id === itemId) {
        const maxQuantity = item.product ? item.product.stock : 999;
        const finalQuantity = Math.max(1, Math.min(quantity, maxQuantity));
        const unitPrice = item.product ? item.product.price * this.getDiscountMultiplier(item.product) : item.unitPrice;

        return {
          ...item,
          quantity: finalQuantity,
          totalPrice: finalQuantity * unitPrice
        };
      }
      return item;
    });
    this.updateCartState(updatedItems);
    this.saveCartToStorage();
  }

  // Limpiar carrito completo
  clearCart(): void {
    this.updateCartState([]);
    this.saveCartToStorage();
  }

  // Alternar visibilidad del carrito
  toggleCart(): void {
    const currentState = this.cartState();
    this.cartState.set({
      ...currentState,
      isOpen: !currentState.isOpen
    });
  }

  // Abrir carrito
  openCart(): void {
    const currentState = this.cartState();
    this.cartState.set({
      ...currentState,
      isOpen: true
    });
  }

  // Cerrar carrito
  closeCart(): void {
    const currentState = this.cartState();
    this.cartState.set({
      ...currentState,
      isOpen: false
    });
  }

  // Obtener resumen del carrito
  getCartSummary(): CartSummary {
    const items = this.cartItems();
    const subtotal = items.reduce((total, item) => total + (item.totalPrice || 0), 0);

    return {
      subtotal,
      discount: 0, // Puede extenderse para lógica de descuentos futuros
      total: subtotal,
      itemCount: this.cartItemCount(),
      items
    };
  }

  // Formatear precio para mostrar
  formatPrice(price: number): string {
    return `$${price.toLocaleString('es-CO')}`;
  }

  // Generar mensaje de WhatsApp
  generateWhatsAppMessage(): string {
    const summary = this.getCartSummary();
    if (summary.items.length === 0) return '';

    let message = '🌸 *¡Hola! Quiero realizar un pedido de Lushka* 🌸\n\n';
    message += '*📋 Detalles del pedido:*\n\n';

    summary.items.forEach((item, index) => {
      const product = item.product;
      if (product) {
        message += `${index + 1}. *${product.name}*\n`;
        message += `   Cantidad: ${item.quantity}\n`;
        message += `   Precio: ${this.formatPrice(item.totalPrice || 0)}\n`;
        if (product.discount) {
          message += `   🎁 Descuento: -${product.discount.percentage}%\n`;
        }
        message += '\n';
      }
    });

    message += '*💰 Resumen del pedido:*\n';
    message += `Subtotal: ${this.formatPrice(summary.subtotal)}\n`;
    message += `Total: ${this.formatPrice(summary.total)}\n\n`;
    message += '*📍 Datos para envío:*\n';
    message += 'Por favor, indícame tus datos para completar el pedido:\n';
    message += '- Nombre completo\n';
    message += '- Dirección de envío\n';
    message += '- Teléfono de contacto\n';
    message += '- Método de pago preferido\n\n';
    message += '¡Gracias! ✨';

    return encodeURIComponent(message);
  }

  // Open WhatsApp with cart message
  openWhatsApp(): void {
    const message = this.generateWhatsAppMessage();
    const phoneNumber = '573143638924'; // Updated WhatsApp number
    const url = `https://wa.me/${phoneNumber}?text=${message}`;
    window.open(url, '_blank');
  }

  // Private helper methods
  private updateCartState(items: CartItem[]): void {
    const currentState = this.cartState();
    this.cartState.set({
      ...currentState,
      items
    });
  }

  private generateCartItemId(): string {
    return `cart_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private getDiscountMultiplier(product: Product): number {
    if (product.discount) {
      return 1 - (product.discount.percentage / 100);
    }
    return 1;
  }

  private saveCartToStorage(): void {
    const currentState = this.cartState();
    const cartData = {
      items: currentState.items,
      savedAt: new Date().toISOString()
    };
    localStorage.setItem('lushka_cart', JSON.stringify(cartData));
  }

  private loadCartFromStorage(): void {
    try {
      const savedCart = localStorage.getItem('lushka_cart');
      if (savedCart) {
        const cartData = JSON.parse(savedCart);
        const savedDate = new Date(cartData.savedAt);
        const now = new Date();
        const hoursDiff = (now.getTime() - savedDate.getTime()) / (1000 * 60 * 60);

        // Only restore cart if it's less than 24 hours old
        if (hoursDiff < 24 && cartData.items && Array.isArray(cartData.items)) {
          const validItems = cartData.items.filter((item: CartItem) =>
            item && item.id && item.quantity > 0
          );
          this.updateCartState(validItems);
        }
      }
    } catch (error) {
      console.warn('Error loading cart from storage:', error);
      this.clearCart();
    }
  }
}