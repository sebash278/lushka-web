import { Product } from './product';
import { Combo } from './combo';
import { Cart, CartSummary } from './cart';
import { AIQuestion, AIRecommendation } from './ai';

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  errors?: string[];
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ProductFilters {
  category?: string;
  subcategory?: string;
  tags?: string[];
  minPrice?: number;
  maxPrice?: number;
  featured?: boolean;
  inStock?: boolean;
  search?: string;
}

export interface CatalogResponse {
  products: Product[];
  combos: Combo[];
  featuredProducts: Product[];
  featuredCombos: Combo[];
  categories: string[];
  pagination: PaginatedResponse<Product | Combo>;
}

export interface WhatsAppMessageRequest {
  products: Array<{
    id: string;
    name: string;
    quantity: number;
    price: number;
  }>;
  combos: Array<{
    id: string;
    name: string;
    quantity: number;
    price: number;
  }>;
  total: number;
  customerInfo?: {
    name: string;
    email?: string;
    phone?: string;
  };
}

export interface ContactInfo {
  phone: string;
  email: string;
  address: string;
  whatsapp: string;
  socialMedia?: {
    instagram?: string;
    facebook?: string;
    twitter?: string;
  };
  workingHours: {
    weekdays: string;
    weekends: string;
  };
}

export interface HeroCarouselItem {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  ctaText: string;
  ctaLink: string;
  order: number;
  active: boolean;
}