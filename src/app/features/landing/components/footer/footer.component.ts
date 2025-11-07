import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent {

  quickLinks = [
    { label: 'Inicio', path: '/' },
    { label: 'Catálogo', path: '/catalog' },
    { label: 'LushkAI', fragment: 'lushkai' },
    { label: 'Contacto', fragment: 'contact' }
  ];

  contactInfo = {
    phone: '+57 314 3638924'
  };

  socialLinks = [
    {
      name: 'TikTok',
      icon: 'fab fa-tiktok',
      url: 'https://www.tiktok.com/@lushka_beauty?is_from_webapp=1&sender_device=pc',
      bgColor: 'bg-black'
    },
    {
      name: 'Instagram',
      icon: 'fab fa-instagram',
      url: 'https://www.instagram.com/lushka_beauty/',
      bgColor: 'bg-pink-600'
    },
    {
      name: 'WhatsApp',
      icon: 'fab fa-whatsapp',
      url: 'https://wa.me/573143638924',
      bgColor: 'bg-green-600'
    }
  ];

  currentYear: number = new Date().getFullYear();

  openSocialLink(url: string): void {
    window.open(url, '_blank');
  }
}