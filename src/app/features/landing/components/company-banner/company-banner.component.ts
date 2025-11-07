import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-company-banner',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './company-banner.component.html',
  styleUrls: ['./company-banner.component.css']
})
export class CompanyBannerComponent {

  onCtaClick(): void {
    // TODO: Navigate to appropriate page when implemented
    console.log('Banner CTA clicked');
    // Future implementation: this.router.navigate(['/contact']);
  }
}