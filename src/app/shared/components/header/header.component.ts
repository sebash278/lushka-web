import { Component, inject, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CartService } from '../../../core/services/cart';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements AfterViewInit, OnDestroy {
  private cartService = inject(CartService);
  cartCount: number = 0;
  private scrollListener!: () => void;

  constructor() {
    this.cartService.cart$.subscribe(cart => {
      this.cartCount = cart.items.length;
    });
  }

  ngAfterViewInit() {
    this.scrollListener = this.onScroll.bind(this);
    window.addEventListener('scroll', this.scrollListener);
  }

  ngOnDestroy() {
    if (this.scrollListener) {
      window.removeEventListener('scroll', this.scrollListener);
    }
  }

  private onScroll() {
    const sections = ['lushkai', 'combos', 'contact'];
    const indicator = document.getElementById('sectionIndicator');

    if (!indicator) return;

    let currentSection = '';
    const scrollPosition = window.scrollY + 100;

    for (const section of sections) {
      const element = document.getElementById(section);
      if (element) {
        const elementTop = element.offsetTop;
        const elementBottom = elementTop + element.offsetHeight;

        if (scrollPosition >= elementTop && scrollPosition < elementBottom) {
          currentSection = section;
          break;
        }
      }
    }

    // Update nav items active state
    document.querySelectorAll('.nav-item').forEach(item => {
      item.classList.remove('active');
      const section = item.getAttribute('data-section');
      if (section === currentSection) {
        item.classList.add('active');
      }
    });

    // Position the indicator line
    const activeItem = document.querySelector('.nav-item.active') as HTMLElement;
    if (activeItem && indicator) {
      const left = activeItem.offsetLeft + (activeItem.offsetWidth / 2) - (indicator.offsetWidth / 2);
      indicator.style.left = `${left}px`;
      indicator.style.opacity = '1';
    }
  }
}
