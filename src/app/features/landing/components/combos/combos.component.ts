import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { ProductLoaderService } from '../../../catalog/services/product-loader.service';
import { Product } from '../../../../shared/models';
import { DestroyRef } from '@angular/core';
import { CartService } from '../../../../shared/services/cart.service';

@Component({
  selector: 'app-combos',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './combos.component.html',
  styleUrls: ['./combos.component.css']
})
export class CombosComponent implements OnInit {
  private productLoader = inject(ProductLoaderService);
  private destroyRef = inject(DestroyRef);
  private router = inject(Router);
  private cartService = inject(CartService);

  featuredCombos: Product[] = [];
  currentSlide = 0;
  combosPerSlide = 2;
  totalSlides = 0;
  private autoSlideInterval: any;

  ngOnInit(): void {
    this.loadFeaturedCombos();
  }

  loadFeaturedCombos(): void {
    // Simulate loading time for better UX
    setTimeout(() => {
      // Get products from the 'combos' category with valid images
      this.featuredCombos = this.productLoader.getProductsWithValidImagesByCategory('combos');
      // Show featured combos first, then others
      const featuredProducts = this.productLoader.getFeaturedProductsWithValidImages().filter(p => p.category === 'combos');
      const otherProducts = this.featuredCombos.filter(p => !p.featured);
      this.featuredCombos = [...featuredProducts, ...otherProducts];
      this.calculateSlides();
      this.startAutoSlide();
    }, 700);
  }

  calculateSlides(): void {
    this.totalSlides = Math.ceil(this.featuredCombos.length / this.combosPerSlide);
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

  getCombosForCurrentSlide(): Product[] {
    const startIndex = this.currentSlide * this.combosPerSlide;
    const endIndex = startIndex + this.combosPerSlide;
    return this.featuredCombos.slice(startIndex, endIndex);
  }

  getSlideIndices(): number[] {
    return Array.from({ length: this.totalSlides }, (_, i) => i);
  }

  formatPrice(price: number): string {
    return `$${price.toLocaleString('es-CO')}`;
  }

  onComboClick(combo: Product): void {
    console.log('Combo clicked:', combo.name, 'ID:', combo.id);
    this.router.navigate(['/catalog', combo.id]);
  }

  getProductNames(combo: Product): string[] {
    // Since we're working with single products that are categorized as combos,
    // we'll return the tags as "product names" for display purposes
    return combo.tags;
  }

  addToCart(combo: Product, event: Event): void {
    event.stopPropagation(); // Prevent combo click navigation
    this.cartService.addToCart(combo, 1);

    // Show success feedback
    const successMessage = document.createElement('div');
    successMessage.className = 'cart-success-message';
    successMessage.innerHTML = `
      <i class="fas fa-check-circle"></i>
      ${combo.name} agregado al carrito
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