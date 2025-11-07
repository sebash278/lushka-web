import { Component, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../services/cart.service';
import { CartItem } from '../../models/cart';

@Component({
  selector: 'app-cart-sidebar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './cart-sidebar.component.html',
  styleUrls: ['./cart-sidebar.component.css']
})
export class CartSidebarComponent {
  cartItems = computed(() => this.cartService.cartItems());
  cartTotal = computed(() => this.cartService.cartTotal());
  cartItemCount = computed(() => this.cartService.cartItemCount());

  constructor(public cartService: CartService) {}

  updateQuantity(item: CartItem, eventOrChange: Event | number): void {
    let newQuantity: number;

    if (typeof eventOrChange === 'number') {
      // Handle increment/decrement buttons
      newQuantity = item.quantity + eventOrChange;
    } else {
      // Handle direct input
      const input = eventOrChange.target as HTMLInputElement;
      newQuantity = parseInt(input.value) || 1;
    }

    this.cartService.updateQuantity(item.id, newQuantity);
  }

  removeFromCart(itemId: string): void {
    this.cartService.removeFromCart(itemId);
  }

  clearCart(): void {
    if (confirm('¿Estás segura de que quieres vaciar el carrito?')) {
      this.cartService.clearCart();
    }
  }

  closeCart(): void {
    this.cartService.closeCart();
  }

  openWhatsApp(): void {
    this.cartService.openWhatsApp();
  }

  formatPrice(price: number): string {
    return this.cartService.formatPrice(price);
  }

  getProductImage(item: CartItem): string {
    if (item.product && item.product.images.length > 0) {
      return item.product.images[0];
    }
    return '/images/placeholder.jpg';
  }

  getProductName(item: CartItem): string {
    if (item.product) {
      return item.product.name;
    }
    return 'Producto';
  }

  getMaxQuantity(item: CartItem): number {
    if (item.product) {
      return item.product.stock;
    }
    return 999;
  }
}