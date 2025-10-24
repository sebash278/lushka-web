import { Injectable } from '@angular/core';
import { Combo, ComboProduct } from '../models/combo';
import { ProductService } from './product.service';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ComboService {
  private combos: Combo[] = [];
  private combosSubject = new BehaviorSubject<Combo[]>(this.combos);

  constructor(private productService: ProductService) {
    this.initializeCombos();
  }

  getCombos(): Observable<Combo[]> {
    return this.combosSubject.asObservable();
  }

  getAllCombos(): Combo[] {
    return this.combos;
  }

  getComboById(id: string): Combo | undefined {
    return this.combos.find(combo => combo.id === id);
  }

  getFeaturedCombos(): Combo[] {
    return this.combos.filter(combo => combo.featured);
  }

  getCombosByCategory(category: string): Combo[] {
    return this.combos.filter(combo => combo.category === category);
  }

  searchCombos(query: string): Combo[] {
    const lowercaseQuery = query.toLowerCase();
    return this.combos.filter(combo =>
      combo.name.toLowerCase().includes(lowercaseQuery) ||
      combo.description.toLowerCase().includes(lowercaseQuery) ||
      combo.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
    );
  }

  getCombosByTags(tags: string[]): Combo[] {
    return this.combos.filter(combo =>
      tags.some(tag => combo.tags.includes(tag))
    );
  }

  // Private methods
  private initializeCombos(): void {
    this.combos = this.getSampleCombos();
    this.combosSubject.next(this.combos);
  }

  private getSampleCombos(): Combo[] {
    const allProducts = this.productService.getAllProducts();

    return [
      {
        id: 'combo-skincare-rutina',
        name: 'Kit Rutina Skincare Completa',
        description: 'Todo lo necesario para una rutina facial completa: limpieza, hidratación y protección.',
        price: 152000,
        originalPrice: 195000,
        images: ['combo-skincare-rutina.jpg'],
        products: this.createComboProducts([
          '2', // Mascarilla Purificante de Arcilla
          '1', // Serum Hidratante de Rosa
          '3'  // Crema Contorno de Ojos
        ], allProducts),
        category: 'Skincare',
        tags: ['rutina completa', 'skincare', 'limpieza', 'hidratación', 'anti-edad'],
        stock: 15,
        featured: true,
        sku: 'COMBO-SKIN-RUTINA-001',
        discount: {
          percentage: 22,
          validUntil: new Date('2024-12-31')
        },
        createdAt: new Date('2024-03-01'),
        updatedAt: new Date('2024-03-01')
      },
      {
        id: 'combo-hidratacion-intensa',
        name: 'Pack Hidratación Intensa',
        description: 'Tratamiento intensivo para piel seca y deshidratada con fórmulas naturales.',
        price: 95000,
        originalPrice: 120000,
        images: ['combo-hidratacion-intensa.jpg'],
        products: this.createComboProducts([
          '1', // Serum Hidratante de Rosa
          '6'  // Aceite Corporal de Argán
        ], allProducts),
        category: 'Hidratación',
        tags: ['hidratación', 'piel seca', 'nutrición', 'natural'],
        stock: 20,
        featured: true,
        sku: 'COMBO-HIDR-INTENSA-002',
        discount: {
          percentage: 21
        },
        createdAt: new Date('2024-03-05'),
        updatedAt: new Date('2024-03-05')
      },
      {
        id: 'combo-cuidado-labios',
        name: 'Kit Cuidado de Labios Premium',
        description: 'Tratamiento completo para labios suaves, hidratados y saludables.',
        price: 35000,
        originalPrice: 45000,
        images: ['combo-labios-premium.jpg'],
        products: this.createComboProducts([
          '4'  // Bálsamo Labial con Miel
        ], allProducts),
        category: 'Labios',
        tags: ['labios', 'bálsamo', 'hidratación', 'reparación'],
        stock: 25,
        featured: false,
        sku: 'COMBO-LAB-PREMIUM-003',
        discount: {
          percentage: 22
        },
        createdAt: new Date('2024-03-10'),
        updatedAt: new Date('2024-03-10')
      },
      {
        id: 'combo-exfoliacion-corporal',
        name: 'Kit Exfoliación Corporal Spa',
        description: 'Experiencia spa en casa con exfoliación y nutrición para piel suave.',
        price: 52000,
        originalPrice: 65000,
        images: ['combo-exfoliacion-spa.jpg'],
        products: this.createComboProducts([
          '5', // Exfoliante Corporal de Azúcar
          '6'  // Aceite Corporal de Argán
        ], allProducts),
        category: 'Corporal',
        tags: ['exfoliación', 'cuerpo', 'spa', 'piel suave', 'nutrición'],
        stock: 18,
        featured: true,
        sku: 'COMBO-EXF-SPA-004',
        discount: {
          percentage: 20
        },
        createdAt: new Date('2024-03-15'),
        updatedAt: new Date('2024-03-15')
      },
      {
        id: 'combo-anti-edad-completo',
        name: 'Sistema Anti-Edad Premium',
        description: 'Tratamiento anti-edad completo con ingredientes activos probados.',
        price: 145000,
        originalPrice: 185000,
        images: ['combo-anti-edad-premium.jpg'],
        products: this.createComboProducts([
          '1', // Serum Hidratante de Rosa
          '3'  // Crema Contorno de Ojos
        ], allProducts),
        category: 'Anti-Edad',
        tags: ['anti-edad', 'arrugas', 'premium', 'tratamiento'],
        stock: 12,
        featured: true,
        sku: 'COMBO-ANTI-AGE-005',
        discount: {
          percentage: 22
        },
        createdAt: new Date('2024-03-20'),
        updatedAt: new Date('2024-03-20')
      }
    ];
  }

  private createComboProducts(productIds: string[], allProducts: any[]): ComboProduct[] {
    return productIds.map(id => {
      const product = allProducts.find(p => p.id === id);
      if (!product) {
        throw new Error(`Product with ID ${id} not found`);
      }
      return {
        product: product,
        quantity: 1
      };
    });
  }
}