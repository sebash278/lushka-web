import { Component, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-cart-icon',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cart-icon.component.html',
  styleUrls: ['./cart-icon.component.css']
})
export class CartIconComponent {
  cartItemCount = computed(() => this.cartService.cartItemCount());
  cartTotal = computed(() => this.cartService.cartTotal());

  constructor(private cartService: CartService) {}

  openCart(): void {
    this.cartService.openCart();
  }
}