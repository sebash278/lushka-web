import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { DestroyRef } from '@angular/core';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './hero.component.html',
  styleUrls: ['./hero.component.css']
})
export class HeroComponent {
  private destroyRef = inject(DestroyRef);

  currentSlide = 0;

  heroSlides = [
    {
      phrase: 'Descubre la belleza natural con productos de alta calidad',
      subtext: 'Cuidados exclusivos para tu piel'
    },
    {
      phrase: 'Transforma tu rutina de belleza con Lushka',
      subtext: 'Productos naturales y efectivos'
    },
    {
      phrase: 'La ciencia de la belleza en tus manos',
      subtext: 'Innovación y tradición en cada producto'
    }
  ];

  constructor() {
    this.startAutoSlide();
  }

  startAutoSlide() {
    const interval = setInterval(() => {
      this.nextSlide();
    }, 4000);

    this.destroyRef.onDestroy(() => {
      clearInterval(interval);
    });
  }

  nextSlide() {
    this.currentSlide = (this.currentSlide + 1) % this.heroSlides.length;
  }

  previousSlide() {
    this.currentSlide = (this.currentSlide - 1 + this.heroSlides.length) % this.heroSlides.length;
  }

  goToSlide(index: number) {
    this.currentSlide = index;
  }
}