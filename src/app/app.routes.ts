import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./features/landing/landing.module').then(m => m.LandingModule)
  },
  {
    path: 'catalog',
    loadComponent: () => import('./features/catalog/catalog.component').then(c => c.CatalogComponent)
  },
  {
    path: 'catalog/:id',
    loadComponent: () => import('./features/catalog/components/product-detail/product-detail.component').then(c => c.ProductDetailComponent)
  },
  {
    path: 'checkout',
    loadChildren: () => import('./features/checkout/checkout.module').then(m => m.CheckoutModule)
  },
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full'
  }
];
