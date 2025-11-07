import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IAService } from '../../../../core/services/ia';
import { ProductLoaderService } from '../../../catalog/services/product-loader.service';
import { AIState, AIQuestion, AIRecommendation, Product } from '../../../../shared/models';
import { CartService } from '../../../../shared/services/cart.service';

@Component({
  selector: 'app-lushkai',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './lushkai.component.html',
  styleUrls: ['./lushkai.component.css']
})
export class LushkaiComponent implements OnInit {
  private iaService = inject(IAService);
  private cartService = inject(CartService);
  private productLoader = inject(ProductLoaderService);

  aiState: AIState | null = null;
  selectedOption: string | null = null;

  ngOnInit() {
    this.iaService.aiState$.subscribe(state => {
      this.aiState = state;
      this.selectedOption = null; // Reset selection when state changes
    });
  }

  selectOption(optionId: string): void {
    this.selectedOption = optionId;
  }

  submitAnswer(): void {
    if (this.selectedOption && this.aiState?.currentQuestion) {
      this.iaService.answerQuestion(this.selectedOption);
    }
  }

  goBack(): void {
    this.iaService.goBack();
  }

  reset(): void {
    this.iaService.reset();
  }

  addToCart(productId: string): void {
    const product = this.productLoader.getProductById(productId);
    if (product) {
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

  getProgress(): number {
    return this.iaService.getProgress();
  }

  canGoBack(): boolean {
    return this.iaService.canGoBack();
  }

  canAdvance(): boolean {
    return this.selectedOption !== null && this.iaService.canAdvance();
  }

  getConfidencePercentage(): number {
    if (!this.aiState?.recommendation) return 0;
    return Math.round(this.aiState.recommendation.confidence * 100);
  }
}