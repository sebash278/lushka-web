import { Injectable } from '@angular/core';
import { Product } from '../models/product';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private products: Product[] = [];
  private productsSubject = new BehaviorSubject<Product[]>(this.products);

  constructor() {
    this.initializeProducts();
  }

  getProducts(): Observable<Product[]> {
    return this.productsSubject.asObservable();
  }

  getAllProducts(): Product[] {
    return this.products;
  }

  getProductById(id: string): Product | undefined {
    return this.products.find(product => product.id === id);
  }

  getProductsByCategory(category: string): Product[] {
    return this.products.filter(product => product.category === category);
  }

  getFeaturedProducts(): Product[] {
    return this.products.filter(product => product.featured);
  }

  searchProducts(query: string): Product[] {
    const lowercaseQuery = query.toLowerCase();
    return this.products.filter(product =>
      product.name.toLowerCase().includes(lowercaseQuery) ||
      product.description.toLowerCase().includes(lowercaseQuery) ||
      product.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
    );
  }

  getProductsByTags(tags: string[]): Product[] {
    return this.products.filter(product =>
      tags.some(tag => product.tags.includes(tag))
    );
  }

  // Private methods
  private initializeProducts(): void {
    this.products = this.getSampleProducts();
    this.productsSubject.next(this.products);
  }

  private getSampleProducts(): Product[] {
    return [
      {
        id: '1',
        name: 'Serum Hidratante de Rosa',
        description: 'Potente serum con extracto de rosa mosqueta que hidrata profundamente y reduce arrugas.',
        price: 45.99,
        images: ['serum-rosa-1.jpg', 'serum-rosa-2.jpg'],
        category: 'Facial',
        subcategory: 'Sueros',
        tags: ['hidratación', 'anti-envejecimiento', 'rosa mosqueta', 'vitamina C'],
        stock: 25,
        featured: true,
        sku: 'LUSH-SER-001',
        createdAt: new Date('2024-01-15'),
        updatedAt: new Date('2024-01-15')
      },
      {
        id: '2',
        name: 'Mascarilla Purificante de Arcilla',
        description: 'Mascarilla detox con arcilla kaolín y carbón activado para limpiar poros en profundidad.',
        price: 28.50,
        images: ['masc-arcilla-1.jpg', 'masc-arcilla-2.jpg'],
        category: 'Facial',
        subcategory: 'Mascarillas',
        tags: ['purificación', 'poros', 'arcilla', 'detox', 'grasa mixta'],
        stock: 40,
        featured: true,
        sku: 'LUSH-MAS-001',
        createdAt: new Date('2024-01-20'),
        updatedAt: new Date('2024-01-20')
      },
      {
        id: '3',
        name: 'Crema Contorno de Ojos',
        description: 'Contorno de ojos con péptidos y café para reducir ojeras y bolsas.',
        price: 38.75,
        images: ['crema-ojos-1.jpg', 'crema-ojos-2.jpg'],
        category: 'Facial',
        subcategory: 'Contorno de ojos',
        tags: ['ojeras', 'bolsas', 'péptidos', 'café', 'anti-edad'],
        stock: 30,
        featured: false,
        sku: 'LUSH-OJOS-001',
        createdAt: new Date('2024-02-01'),
        updatedAt: new Date('2024-02-01')
      },
      {
        id: '4',
        name: 'Bálsamo Labial con Miel',
        description: 'Bálsamo reparador con miel orgánica y manteca de karité para labios agrietados.',
        price: 12.99,
        images: ['balsamo-labios-1.jpg', 'balsamo-labios-2.jpg'],
        category: 'Labios',
        subcategory: 'Bálsamos',
        tags: ['reparación', 'miel', 'karité', 'hidratación', 'labios secos'],
        stock: 60,
        featured: true,
        sku: 'LUSH-LAB-001',
        createdAt: new Date('2024-02-10'),
        updatedAt: new Date('2024-02-10')
      },
      {
        id: '5',
        name: 'Exfoliante Corporal de Azúcar',
        description: 'Exfoliante suave con azúcar moreno y aceite de coco para piel suave y luminosa.',
        price: 24.99,
        images: ['exf-corporal-1.jpg', 'exf-corporal-2.jpg'],
        category: 'Corporal',
        subcategory: 'Exfoliantes',
        tags: ['exfoliación', 'azúcar', 'coco', 'hidratación', 'piel suave'],
        stock: 35,
        featured: false,
        sku: 'LUSH-EXF-001',
        createdAt: new Date('2024-02-15'),
        updatedAt: new Date('2024-02-15')
      },
      {
        id: '6',
        name: 'Aceite Corporal de Argán',
        description: 'Aceite secante de argán puro que nutre la piel sin sensación grasosa.',
        price: 32.00,
        images: ['aceite-argan-1.jpg', 'aceite-argan-2.jpg'],
        category: 'Corporal',
        subcategory: 'Aceites',
        tags: ['nutrición', 'argán', 'secante', 'elasticidad', 'anti-estrías'],
        stock: 20,
        featured: true,
        sku: 'LUSH-ACE-001',
        createdAt: new Date('2024-03-01'),
        updatedAt: new Date('2024-03-01')
      }
    ];
  }
}