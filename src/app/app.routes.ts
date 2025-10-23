import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./features/landing/landing.module').then(m => m.LandingModule)
  },
  {
    path: 'catalog',
    loadChildren: () => import('./features/catalog/catalog.module').then(m => m.CatalogModule)
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
