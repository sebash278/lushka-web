export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  category: string;
  subcategory?: string;
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

export interface PriceRange {
  id: string;
  label: string;
  min: number;
  max: number;
}

export interface SidebarProductFilters {
  priceRanges: PriceRange[];
  tags: string[];
  featuredOnly: boolean;
  productTypes?: string[];
  hairTypes?: string[];
  skinTypes?: string[];
}
