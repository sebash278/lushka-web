import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CATEGORIES, Category } from '../../../../shared/models';

@Component({
  selector: 'app-category-filters',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './category-filters.html',
  styleUrl: './category-filters.css'
})
export class CategoryFiltersComponent {
  categories: Category[] = CATEGORIES;
  @Output() categorySelected = new EventEmitter<string[]>();

  onCategoryClick(category: Category) {
    category.isActive = !category.isActive;
    this.emitSelectedCategories();
  }

  getSelectedCategories(): string[] {
    return this.categories
      .filter(cat => cat.isActive)
      .map(cat => cat.id);
  }

  private emitSelectedCategories() {
    this.categorySelected.emit(this.getSelectedCategories());
  }
}