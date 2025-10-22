import { Product } from './product';
import { Combo } from './combo';

export interface Cart {
  id: string;
  items: CartItem[];
  total: number;
  subtotal: number;
  discount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CartItem {
  id: string;
  type: 'product' | 'combo';
  product?: Product;
  combo?: Combo;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  addedAt: Date;
}

export interface CartSummary {
  subtotal: number;
  discount: number;
  total: number;
  itemCount: number;
  items: CartItem[];
}
