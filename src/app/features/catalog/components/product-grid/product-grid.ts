import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Product } from '../../../../shared/models';

@Component({
  selector: 'app-product-grid',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-grid.html',
  styleUrl: './product-grid.css'
})
export class ProductGridComponent {
  @Input() products: Product[] = [];
  @Input() loading: boolean = false;
  @Output() productSelected = new EventEmitter<Product>();

  constructor(private router: Router) {}

  onProductClick(product: Product) {
    this.productSelected.emit(product);
    this.router.navigate(['/catalog', product.id]);
  }

  formatPrice(price: number): string {
    return `$${price.toLocaleString('es-CO')}`;
  }

  truncateText(text: string, maxLength: number): string {
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  }
}