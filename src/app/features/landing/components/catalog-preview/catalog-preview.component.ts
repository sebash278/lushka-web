import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { ProductLoaderService } from '../../../catalog/services/product-loader.service';
import { Product } from '../../../../shared/models';
import { DestroyRef } from '@angular/core';
import { CartService } from '../../../../shared/services/cart.service';

@Component({
  selector: 'app-catalog-preview',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './catalog-preview.component.html',
  styleUrls: ['./catalog-preview.component.css']
})
export class CatalogPreviewComponent implements OnInit {
  private productLoader = inject(ProductLoaderService);
  private destroyRef = inject(DestroyRef);
  private router = inject(Router);
  private cartService = inject(CartService);

  featuredProducts: Product[] = [];
  currentSlide = 0;
  productsPerSlide = 3;
  totalSlides = 0;
  private autoSlideInterval: any;

  ngOnInit(): void {
    this.loadFeaturedProducts();
  }

  loadFeaturedProducts(): void {
    // Simulate loading time for better UX
    setTimeout(() => {
      this.featuredProducts = this.productLoader.getFeaturedProductsWithValidImages();
      this.calculateSlides();
      this.startAutoSlide();
    }, 500);
  }

  calculateSlides(): void {
    this.totalSlides = Math.ceil(this.featuredProducts.length / this.productsPerSlide);
  }

  startAutoSlide(): void {
    this.stopAutoSlide(); // Clear any existing interval
    this.autoSlideInterval = setInterval(() => {
      this.nextSlideAuto(); // Use auto version that doesn't reset timer
    }, 5000);

    this.destroyRef.onDestroy(() => {
      this.stopAutoSlide();
    });
  }

  stopAutoSlide(): void {
    if (this.autoSlideInterval) {
      clearInterval(this.autoSlideInterval);
      this.autoSlideInterval = null;
    }
  }

  resetAutoSlide(): void {
    this.startAutoSlide();
  }

  nextSlideAuto(): void {
    // This method is used by auto-slide only - doesn't reset timer
    this.currentSlide = (this.currentSlide + 1) % this.totalSlides;
  }

  nextSlide(): void {
    this.currentSlide = (this.currentSlide + 1) % this.totalSlides;
    this.resetAutoSlide(); // Reset timer after manual navigation
  }

  previousSlide(): void {
    this.currentSlide = (this.currentSlide - 1 + this.totalSlides) % this.totalSlides;
    this.resetAutoSlide(); // Reset timer after manual navigation
  }

  goToSlide(index: number): void {
    this.currentSlide = index;
    this.resetAutoSlide(); // Reset timer after manual navigation
  }

  getProductsForCurrentSlide(): Product[] {
    const startIndex = this.currentSlide * this.productsPerSlide;
    const endIndex = startIndex + this.productsPerSlide;
    return this.featuredProducts.slice(startIndex, endIndex);
  }

  getSlideIndices(): number[] {
    return Array.from({ length: this.totalSlides }, (_, i) => i);
  }

  formatPrice(price: number): string {
    return `$${price.toLocaleString('es-CO')}`;
  }

  onProductClick(product: Product): void {
    console.log('Product clicked:', product.name, 'ID:', product.id);
    this.router.navigate(['/catalog', product.id]);
  }

  addToCart(product: Product, event: Event): void {
    event.stopPropagation(); // Prevent product click navigation
    this.cartService.addToCart(product, 1);

    // Show success feedback
    const successMessage = document.createElement('div');
    successMessage.className = 'cart-success-message';
    successMessage.innerHTML = `
      <i class="fas fa-check-circle"></i>
      ${product.name} agregado al carrito
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
        if (document.body.contains(successMessage)) {
          document.body.removeChild(successMessage);
        }
      }, 300);
    }, 3000);
  }
}