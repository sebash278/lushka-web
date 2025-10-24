import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ComboService } from '../../../../shared/services/combo.service';
import { Combo } from '../../../../shared/models/combo';
import { DestroyRef } from '@angular/core';

@Component({
  selector: 'app-combos',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './combos.component.html',
  styleUrls: ['./combos.component.css']
})
export class CombosComponent implements OnInit {
  private comboService = inject(ComboService);
  private destroyRef = inject(DestroyRef);

  featuredCombos: Combo[] = [];
  currentSlide = 0;
  combosPerSlide = 2;
  totalSlides = 0;

  ngOnInit(): void {
    this.loadFeaturedCombos();
  }

  loadFeaturedCombos(): void {
    this.comboService.getCombos().subscribe(combos => {
      this.featuredCombos = this.comboService.getFeaturedCombos();
      this.calculateSlides();
      this.startAutoSlide();
    });
  }

  calculateSlides(): void {
    this.totalSlides = Math.ceil(this.featuredCombos.length / this.combosPerSlide);
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

  getCombosForCurrentSlide(): Combo[] {
    const startIndex = this.currentSlide * this.combosPerSlide;
    const endIndex = startIndex + this.combosPerSlide;
    return this.featuredCombos.slice(startIndex, endIndex);
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

  calculateDiscountPercentage(originalPrice: number, discountedPrice: number): number {
    return Math.round(((originalPrice - discountedPrice) / originalPrice) * 100);
  }

  onComboClick(combo: Combo): void {
    // TODO: Navigate to individual combo page when implemented
    console.log('Combo clicked:', combo.name, 'ID:', combo.id);
    // Future implementation: this.router.navigate(['/combo', combo.id]);
  }

  getProductNames(combo: Combo): string[] {
    return combo.products.map(cp => cp.product.name);
  }
}