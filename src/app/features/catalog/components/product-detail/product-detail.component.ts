import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Product } from '../../../../shared/models';
import { ProductLoaderService } from '../../services/product-loader.service';
import { CartService } from '../../../../shared/services/cart.service';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css']
})
export class ProductDetailComponent implements OnInit {
  product: Product | null = null;
  loading: boolean = true;
  selectedImage: string = '';
  quantity: number = 1;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productLoader: ProductLoaderService,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    const productId = this.route.snapshot.paramMap.get('id');
    if (productId) {
      this.loadProduct(productId);
    } else {
      this.router.navigate(['/catalog']);
    }
  }

  private loadProduct(productId: string): void {
    // Simulate loading time
    setTimeout(() => {
      this.product = this.productLoader.getProductById(productId) ?? null;
      this.loading = false;

      if (this.product) {
        this.selectedImage = this.product.images[0];
      } else {
        this.router.navigate(['/catalog']);
      }
    }, 500);
  }

  selectImage(image: string): void {
    this.selectedImage = image;
  }

  increaseQuantity(): void {
    if (this.product && this.quantity < this.product.stock) {
      this.quantity++;
    }
  }

  decreaseQuantity(): void {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  addToCart(): void {
    if (this.product) {
      this.cartService.addToCart(this.product, this.quantity);
      // Show success feedback
      const successMessage = document.createElement('div');
      successMessage.className = 'cart-success-message';
      successMessage.innerHTML = `
        <i class="fas fa-check-circle"></i>
        ${this.quantity} ${this.product.name}(s) agregado(s) al carrito
      `;
      successMessage.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: #25D366;
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 50px;
        box-shadow: 0 4px 15px rgba(37, 211, 102, 0.3);
        z-index: 10000;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        font-family: 'Alegreya Sans', sans-serif;
        font-weight: 500;
        animation: slideInRight 0.3s ease;
      `;

      document.body.appendChild(successMessage);

      // Auto-remove after 3 seconds
      setTimeout(() => {
        successMessage.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
          document.body.removeChild(successMessage);
        }, 300);
      }, 3000);
    }
  }

  goBack(): void {
    this.router.navigate(['/catalog']);
  }

  formatPrice(price: number): string {
    return `$${price.toLocaleString('es-CO')}`;
  }

  getStockStatus(): string {
    if (!this.product) return '';

    if (this.product.stock === 0) {
      return 'Agotado';
    } else if (this.product.stock < 5) {
      return `¡Últimas ${this.product.stock} unidades!`;
    } else {
      return 'En stock';
    }
  }

  getStockStatusClass(): string {
    if (!this.product) return '';

    if (this.product.stock === 0) {
      return 'out-of-stock';
    } else if (this.product.stock < 5) {
      return 'low-stock';
    } else {
      return 'in-stock';
    }
  }
}