import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CategoryFiltersComponent } from './components/category-filters/category-filters';
import { ProductGridComponent } from './components/product-grid/product-grid';
import { SidebarFiltersComponent } from './components/sidebar-filters/sidebar-filters.component';
import { ProductLoaderService } from './services/product-loader.service';
import { Product } from '../../shared/models';
import { SidebarProductFilters } from '../../shared/models/product';

@Component({
  selector: 'app-catalog',
  standalone: true,
  imports: [CommonModule, CategoryFiltersComponent, ProductGridComponent, SidebarFiltersComponent],
  templateUrl: './catalog.component.html',
  styleUrl: './catalog.component.css'
})
export class CatalogComponent implements OnInit {
  selectedCategories: string[] = [];
  allProducts: Product[] = [];
  filteredProducts: Product[] = [];
  loading: boolean = true;
  sidebarFilters: SidebarProductFilters | null = null;

  constructor(private productLoader: ProductLoaderService) {
    console.log('CatalogComponent initialized!');
  }

  ngOnInit() {
    // Load all products initially
    setTimeout(() => {
      this.allProducts = this.productLoader.getProducts();
      this.filteredProducts = this.allProducts;
      this.loading = false;
      console.log('Products loaded:', this.allProducts.length);
    }, 1000); // Simulate loading time
  }

  onCategoriesChanged(categories: string[]) {
    this.selectedCategories = categories;
    console.log('Selected categories:', categories);
    this.applyFilters();
  }

  onFiltersChanged(filters: SidebarProductFilters) {
    this.sidebarFilters = filters;
    console.log('Sidebar filters changed:', filters);
    this.applyFilters();
  }

  private applyFilters() {
    console.log('Applying filters with categories:', this.selectedCategories, 'sidebar filters:', this.sidebarFilters);

    // Start with all products
    let products = this.allProducts;

    // Apply category filters
    if (this.selectedCategories.length > 0) {
      products = this.productLoader.getProductsByCategories(this.selectedCategories);
    }

    // Apply sidebar filters if they exist
    if (this.sidebarFilters) {
      const filters = this.sidebarFilters; // Create local variable for null safety
      products = products.filter(product => {
        // Price range filter
        if (filters.priceRanges.length > 0) {
          const inPriceRange = filters.priceRanges.some(range =>
            product.price >= range.min && product.price <= range.max
          );
          if (!inPriceRange) return false;
        }

        // Tags filter
        if (filters.tags.length > 0) {
          const hasMatchingTag = filters.tags.some(filterTag =>
            product.tags.some(productTag =>
              productTag.toLowerCase().includes(filterTag.toLowerCase()) ||
              filterTag.toLowerCase().includes(productTag.toLowerCase())
            )
          );
          if (!hasMatchingTag) return false;
        }

        // Product type filter
        if (filters.productTypes && filters.productTypes.length > 0) {
          const hasMatchingProductType = filters.productTypes.some(type =>
            this.productMatchesType(product, type)
          );
          if (!hasMatchingProductType) return false;
        }

        // Hair type filter
        if (filters.hairTypes && filters.hairTypes.length > 0) {
          const hasMatchingHairType = filters.hairTypes.some(type =>
            this.productMatchesHairType(product, type)
          );
          if (!hasMatchingHairType) return false;
        }

        // Skin type filter
        if (filters.skinTypes && filters.skinTypes.length > 0) {
          const hasMatchingSkinType = filters.skinTypes.some(type =>
            this.productMatchesSkinType(product, type)
          );
          if (!hasMatchingSkinType) return false;
        }

        // Featured filter
        if (filters.featuredOnly && !product.featured) {
          return false;
        }

        return true;
      });
    }

    this.filteredProducts = products;
    console.log('Final filtered products:', this.filteredProducts.length);
  }

  onProductSelected(product: Product) {
    // Handle product selection - navigate to product detail
    console.log('Product selected:', product.name);
  }

  private productMatchesType(product: Product, type: string): boolean {
    const name = product.name.toLowerCase();
    const description = product.description.toLowerCase();

    switch (type) {
      case 'shampoo':
        return name.includes('shampoo') || description.includes('shampoo');
      case 'acondicionador':
        return name.includes('acondicionador') || description.includes('acondicionador');
      case 'mascara-capilar':
        return name.includes('máscara') || name.includes('helado') || description.includes('máscara') || description.includes('helado');
      case 'aceite':
        return name.includes('aceite') || description.includes('aceite');
      case 'crema-peinar':
        return name.includes('crema') && (name.includes('peinar') || name.includes('ca') || description.includes('peinar'));
      case 'crema-corporal':
        return (name.includes('crema') || description.includes('crema')) &&
               (name.includes('corporal') || description.includes('corporal') || product.category === 'Corporal');
      case 'mantequilla':
        return name.includes('mantequilla') || description.includes('mantequilla');
      case 'exfoliante':
        return name.includes('exfoliante') || description.includes('exfoliante');
      case 'balsamo':
        return name.includes('bálsamo') || description.includes('bálsamo');
      case 'perfume':
        return name.includes('perfume') || description.includes('perfume');
      case 'suero-facial':
        return (name.includes('suero') || name.includes('serum')) && product.category === 'Facial';
      case 'espuma-facial':
        return name.includes('espuma') && product.category === 'Facial';
      default:
        return false;
    }
  }

  private productMatchesHairType(product: Product, hairType: string): boolean {
    if (product.category !== 'Capilar') return false;

    const name = product.name.toLowerCase();
    const description = product.description.toLowerCase();
    const tags = product.tags.map(tag => tag.toLowerCase());

    switch (hairType) {
      case 'normal':
        return tags.includes('normal') || description.includes('cabello normal');
      case 'graso':
        return name.includes('sin destellos') || tags.includes('control') || description.includes('cabello graso');
      case 'seco':
        return name.includes('con destellos') || tags.includes('hidratación') || tags.includes('nutrición') || description.includes('cabello seco');
      case 'castano':
        return name.includes('ca') || description.includes('cabello castaño');
      case 'rizado':
        return tags.includes('definición') || tags.includes('rizado') || description.includes('cabello rizado');
      default:
        return false;
    }
  }

  private productMatchesSkinType(product: Product, skinType: string): boolean {
    if (product.category === 'Capilar' || product.category === 'Combos') return false;

    const name = product.name.toLowerCase();
    const description = product.description.toLowerCase();
    const tags = product.tags.map(tag => tag.toLowerCase());

    switch (skinType) {
      case 'normal':
        return tags.includes('normal') || description.includes('piel normal');
      case 'grasa':
        return name.includes('con destellos') || tags.includes('control') || description.includes('piel grasa');
      case 'seca':
        return name.includes('sin destellos') || tags.includes('hidratación') || tags.includes('nutrición') || description.includes('piel seca');
      case 'mixta':
        return tags.includes('mixta') || description.includes('piel mixta');
      case 'sensible':
        return tags.includes('sensible') || description.includes('piel sensible');
      default:
        return false;
    }
  }
}