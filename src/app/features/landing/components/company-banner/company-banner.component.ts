import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-company-banner',
  standalone: true,
  imports: [CommonModule, RouterLink],
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