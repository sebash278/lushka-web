import { Component, EventEmitter, Output, Input, SimpleChanges, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarProductFilters, PriceRange } from '../../../../shared/models/product';

@Component({
  selector: 'app-sidebar-filters',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sidebar-filters.component.html',
  styleUrls: ['./sidebar-filters.component.css']
})
export class SidebarFiltersComponent implements OnChanges {
  @Input() selectedCategories: string[] = [];
  @Output() filtersChanged = new EventEmitter<SidebarProductFilters>();

  // Filter state
  selectedPriceRanges: string[] = [];
  selectedTags: string[] = [];
  showFeaturedOnly = false;
  selectedProductTypes: string[] = [];
  selectedHairTypes: string[] = [];
  selectedSkinTypes: string[] = [];

  // Available options based on product analysis
  priceRanges = [
    { id: 'economico', label: 'Económico ($8k - $15k)', min: 8000, max: 15000 },
    { id: 'estandar', label: 'Estándar ($18k - $25k)', min: 18000, max: 25000 },
    { id: 'premium', label: 'Premium ($30k - $42k)', min: 30000, max: 42000 }
  ];

  popularTags = [
    { id: 'hidratación', label: 'Hidratación', count: 8 },
    { id: 'tratamiento', label: 'Tratamiento', count: 3 },
    { id: 'natural', label: 'Natural', count: 2 },
    { id: 'brillo', label: 'Brillo', count: 4 },
    { id: 'suavidad', label: 'Suavidad', count: 3 },
    { id: 'nutrición', label: 'Nutrición', count: 2 },
    { id: 'limpieza', label: 'Limpieza', count: 2 }
  ];

  // Product type filters
  productTypes = [
    { id: 'shampoo', label: 'Shampoo', count: 1 },
    { id: 'acondicionador', label: 'Acondicionador', count: 1 },
    { id: 'mascara-capilar', label: 'Máscara Capilar', count: 3 },
    { id: 'aceite', label: 'Aceite', count: 1 },
    { id: 'crema-peinar', label: 'Crema para Peinar', count: 3 },
    { id: 'crema-corporal', label: 'Crema Corporal', count: 3 },
    { id: 'mantequilla', label: 'Mantequilla Corporal', count: 3 },
    { id: 'exfoliante', label: 'Exfoliante', count: 1 },
    { id: 'balsamo', label: 'Bálsamo', count: 2 },
    { id: 'perfume', label: 'Perfume', count: 2 },
    { id: 'suero-facial', label: 'Suero Facial', count: 1 },
    { id: 'espuma-facial', label: 'Espuma Facial', count: 1 }
  ];

  // Hair type filters
  hairTypes = [
    { id: 'normal', label: 'Cabello Normal', count: 5 },
    { id: 'graso', label: 'Cabello Graso', count: 3 },
    { id: 'seco', label: 'Cabello Seco', count: 4 },
    { id: 'castano', label: 'Cabello Castaño', count: 2 },
    { id: 'rizado', label: 'Cabello Rizado', count: 3 }
  ];

  // Skin type filters
  skinTypes = [
    { id: 'normal', label: 'Piel Normal', count: 8 },
    { id: 'grasa', label: 'Piel Grasa', count: 4 },
    { id: 'seca', label: 'Piel Seca', count: 6 },
    { id: 'mixta', label: 'Piel Mixta', count: 5 },
    { id: 'sensible', label: 'Piel Sensible', count: 3 }
  ];

  // Dynamic filter options based on selected categories
  get visibleProductTypes() {
    if (this.selectedCategories.length === 0) {
      return this.productTypes;
    }

    return this.productTypes.filter(type => {
      if (this.selectedCategories.includes('Capilar')) {
        return ['shampoo', 'acondicionador', 'mascara-capilar', 'aceite', 'crema-peinar'].includes(type.id);
      }
      if (this.selectedCategories.includes('Corporal')) {
        return ['crema-corporal', 'mantequilla', 'exfoliante', 'balsamo', 'perfume'].includes(type.id);
      }
      if (this.selectedCategories.includes('Facial')) {
        return ['suero-facial', 'espuma-facial'].includes(type.id);
      }
      if (this.selectedCategories.includes('Combos')) {
        return []; // Combos have their own special filtering
      }
      return this.productTypes;
    });
  }

  get visibleHairTypes() {
    if (this.selectedCategories.length === 0 || this.selectedCategories.includes('Capilar')) {
      return this.hairTypes;
    }
    return [];
  }

  get visibleSkinTypes() {
    if (this.selectedCategories.length === 0 ||
        this.selectedCategories.includes('Corporal') ||
        this.selectedCategories.includes('Facial')) {
      return this.skinTypes;
    }
    return [];
  }

  onPriceRangeChange(rangeId: string, checked: boolean): void {
    if (checked) {
      this.selectedPriceRanges.push(rangeId);
    } else {
      this.selectedPriceRanges = this.selectedPriceRanges.filter(id => id !== rangeId);
    }
    this.emitFilters();
  }

  onTagChange(tagId: string, checked: boolean): void {
    if (checked) {
      this.selectedTags.push(tagId);
    } else {
      this.selectedTags = this.selectedTags.filter(id => id !== tagId);
    }
    this.emitFilters();
  }

  onFeaturedChange(checked: boolean): void {
    this.showFeaturedOnly = checked;
    this.emitFilters();
  }

  onProductTypeChange(typeId: string, checked: boolean): void {
    if (checked) {
      this.selectedProductTypes.push(typeId);
    } else {
      this.selectedProductTypes = this.selectedProductTypes.filter(id => id !== typeId);
    }
    this.emitFilters();
  }

  onHairTypeChange(typeId: string, checked: boolean): void {
    if (checked) {
      this.selectedHairTypes.push(typeId);
    } else {
      this.selectedHairTypes = this.selectedHairTypes.filter(id => id !== typeId);
    }
    this.emitFilters();
  }

  onSkinTypeChange(typeId: string, checked: boolean): void {
    if (checked) {
      this.selectedSkinTypes.push(typeId);
    } else {
      this.selectedSkinTypes = this.selectedSkinTypes.filter(id => id !== typeId);
    }
    this.emitFilters();
  }

  clearAllFilters(): void {
    this.selectedPriceRanges = [];
    this.selectedTags = [];
    this.selectedProductTypes = [];
    this.selectedHairTypes = [];
    this.selectedSkinTypes = [];
    this.showFeaturedOnly = false;
    this.emitFilters();
  }

  clearIrrelevantFilters(): void {
    // Clear product type filters that are no longer visible
    this.selectedProductTypes = this.selectedProductTypes.filter(id =>
      this.visibleProductTypes.some(type => type.id === id)
    );

    // Clear hair type filters if hair types are not visible
    if (this.visibleHairTypes.length === 0) {
      this.selectedHairTypes = [];
    }

    // Clear skin type filters if skin types are not visible
    if (this.visibleSkinTypes.length === 0) {
      this.selectedSkinTypes = [];
    }

    this.emitFilters();
  }

  private emitFilters(): void {
    const filters: SidebarProductFilters = {
      priceRanges: this.selectedPriceRanges.map(id =>
        this.priceRanges.find(range => range.id === id)!
      ),
      tags: this.selectedTags,
      productTypes: this.selectedProductTypes,
      hairTypes: this.selectedHairTypes,
      skinTypes: this.selectedSkinTypes,
      featuredOnly: this.showFeaturedOnly
    };
    this.filtersChanged.emit(filters);
  }

  hasActiveFilters(): boolean {
    return this.selectedPriceRanges.length > 0 ||
           this.selectedTags.length > 0 ||
           this.selectedProductTypes.length > 0 ||
           this.selectedHairTypes.length > 0 ||
           this.selectedSkinTypes.length > 0 ||
           this.showFeaturedOnly;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['selectedCategories']) {
      // Clear irrelevant filters when categories change
      this.clearIrrelevantFilters();
    }
  }
}