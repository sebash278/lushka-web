import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

import { CartService } from './services/cart.service';
import { WhatsAppService } from './services/whatsapp.service';
import { IAService } from './services/ia.service';
import { StorageService } from './services/storage.service';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    HttpClientModule
  ],
  providers: [
    CartService,
    WhatsAppService,
    IAService,
    StorageService
  ],
  exports: []
})
export class CoreModule {
  static forRoot() {
    return {
      ngModule: CoreModule,
      providers: [
        CartService,
        WhatsAppService,
        IAService,
        StorageService
      ]
    };
  }
}