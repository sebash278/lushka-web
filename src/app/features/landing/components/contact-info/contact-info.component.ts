import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-contact-info',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './contact-info.component.html',
  styleUrls: ['./contact-info.component.css']
})
export class ContactInfoComponent {

  whatsappNumber: string = '+57 314 3638924';
  whatsappLink: string = 'https://wa.me/573001234567';
  email: string = 'contacto@lushka.com';

  contactInfo = [
    {
      icon: '💬',
      title: 'WhatsApp',
      content: this.whatsappNumber,
      link: this.whatsappLink,
      action: 'Escríbenos ahora'
    },
    {
      icon: '📧',
      title: 'Email',
      content: this.email,
      link: `mailto:${this.email}`,
      action: 'Envíanos un correo'
    }
  ];

  openWhatsApp(): void {
    window.open(this.whatsappLink, '_blank');
  }

  openEmail(): void {
    window.open(`mailto:${this.email}`, '_blank');
  }
}
