import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

import { CartService } from './services/cart';
import { WhatsAppService } from './services/whatsapp';
import { IAService } from './services/ia';
import { Storage } from './services/storage';

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
    Storage
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
        Storage
      ]
    };
  }
}