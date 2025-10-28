import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeroComponent } from './components/hero/hero.component';
import { LushkaiComponent } from './components/lushkai/lushkai.component';
import { CompanyBannerComponent } from './components/company-banner/company-banner.component';
import { CatalogPreviewComponent } from './components/catalog-preview/catalog-preview.component';
import { CombosComponent } from './components/combos/combos.component';
import { ContactInfoComponent } from './components/contact-info/contact-info.component';
import { FooterComponent } from './components/footer/footer.component';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, HeroComponent, LushkaiComponent, CompanyBannerComponent, CatalogPreviewComponent, CombosComponent, ContactInfoComponent, FooterComponent],
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css']
})
export class LandingComponent {
  title = 'Welcome to Lushka!';
}