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
    { label: 'Productos', path: '/products' },
    { label: 'Sobre Nosotros', path: '/about' },
    { label: 'Contacto', path: '/contact' }
  ];

  contactInfo = {
    phone: '+57 300 123 4567',
    email: 'contacto@lushka.com',
    address: 'Calle 123 #45-67, Bogotá, Colombia'
  };

  socialLinks = [
    {
      name: 'Facebook',
      icon: 'fab fa-facebook-f',
      url: 'https://facebook.com/lushka',
      bgColor: 'bg-blue-600'
    },
    {
      name: 'Instagram',
      icon: 'fab fa-instagram',
      url: 'https://instagram.com/lushka',
      bgColor: 'bg-pink-600'
    },
    {
      name: 'WhatsApp',
      icon: 'fab fa-whatsapp',
      url: 'https://wa.me/573001234567',
      bgColor: 'bg-green-600'
    }
  ];

  currentYear: number = new Date().getFullYear();

  openSocialLink(url: string): void {
    window.open(url, '_blank');
  }
}