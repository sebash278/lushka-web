import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IAService } from '../../../../core/services/ia';
import { AIState, AIQuestion, AIRecommendation } from '../../../../shared/models';
import { CartService } from '../../../../core/services/cart';

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
    // This would need to be connected to actual products
    console.log('Adding to cart:', productId);
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