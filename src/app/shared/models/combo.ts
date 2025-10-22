import { Product } from './product';

export interface Combo {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice: number;
  images: string[];
  products: ComboProduct[];
  category: string;
  tags: string[];
  stock: number;
  featured: boolean;
  sku: string;
  discount?: {
    percentage: number;
    validUntil?: Date;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface ComboProduct {
  product: Product;
  quantity: number;
}
