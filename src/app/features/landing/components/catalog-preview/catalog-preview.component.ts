import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ProductService } from '../../../../shared/services/product.service';
import { Product } from '../../../../shared/models/product';
import { DestroyRef } from '@angular/core';

@Component({
  selector: 'app-catalog-preview',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './catalog-preview.component.html',
  styleUrls: ['./catalog-preview.component.css']
})
export class CatalogPreviewComponent implements OnInit {
  private productService = inject(ProductService);
  private destroyRef = inject(DestroyRef);

  featuredProducts: Product[] = [];
  currentSlide = 0;
  productsPerSlide = 3;
  totalSlides = 0;

  ngOnInit(): void {
    this.loadFeaturedProducts();
  }

  loadFeaturedProducts(): void {
    this.productService.getProducts().subscribe(products => {
      this.featuredProducts = this.productService.getFeaturedProducts();
      this.calculateSlides();
      this.startAutoSlide();
    });
  }

  calculateSlides(): void {
    this.totalSlides = Math.ceil(this.featuredProducts.length / this.productsPerSlide);
  }

  startAutoSlide(): void {
    const interval = setInterval(() => {
      this.nextSlide();
    }, 5000);

    this.destroyRef.onDestroy(() => {
      clearInterval(interval);
    });
  }

  nextSlide(): void {
    this.currentSlide = (this.currentSlide + 1) % this.totalSlides;
  }

  previousSlide(): void {
    this.currentSlide = (this.currentSlide - 1 + this.totalSlides) % this.totalSlides;
  }

  goToSlide(index: number): void {
    this.currentSlide = index;
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
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  }

  onProductClick(product: Product): void {
    // TODO: Navigate to individual product page when implemented
    console.log('Product clicked:', product.name, 'ID:', product.id);
    // Future implementation: this.router.navigate(['/product', product.id]);
  }
}