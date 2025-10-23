import { Injectable } from '@angular/core';
import { CartSummary, CartItem } from '../../shared/models';
import { WhatsAppMessageRequest } from '../../shared/models/api';

@Injectable({
  providedIn: 'root'
})
export class WhatsAppService {
  private readonly WHATSAPP_BASE_URL = 'https://wa.me';
  private readonly COMPANY_PHONE = '+573143638924';
  constructor() { }

  /**
   * Enviar el carrito a WhatsApp
   * @param cartSummary Resumen del carrito
   * @param customerInfo Info del cliente
   */
  public sendCartToWhatsApp(
    cartSummary: CartSummary,
    customerInfo?: {
      name?: string;
      email?: string;
      phone?: string;
      address?: string;
    }
  ): void {
    const message = this.formatWhatsAppMessage(cartSummary, customerInfo);
    const whatsappUrl = this.buildWhatsAppUrl(message);
    this.openWhatsApp(whatsappUrl);
  }

  /**
   * Formatear el contenido a un mensaje
   */
  private formatWhatsAppMessage(
    cartSummary: CartSummary,
    customerInfo?: {
      name?: string;
      email?: string;
      phone?: string;
      address?: string;
    }
  ): string {
    let message = '🛒 *Nuevo Pedido - Lushka*\n\n';

    // Info del cliente
    if (customerInfo) {
      message += '👤 *Datos del Cliente:*\n';
      if (customerInfo.name) message += `• Nombre: ${customerInfo.name}\n`;
      if (customerInfo.email) message += `• Email: ${customerInfo.email}\n`;
      if (customerInfo.phone) message += `• Teléfono: ${customerInfo.phone}\n`;
      if (customerInfo.address) message += `• Dirección: ${customerInfo.address}\n`;
      message += '\n';
    }

    // Items del carrito
    message += '📦 *Detalles del Pedido:*\n';

    const products = cartSummary.items.filter(item => item.type === 'product');
    const combos = cartSummary.items.filter(item => item.type === 'combo');

    // Productos
    if (products.length > 0) {
      message += '\n🛍️ *Productos:*\n';
      products.forEach((item, index) => {
        message += `${index + 1}. ${item.product?.name}\n`;
        message += `   • Cantidad: ${item.quantity}\n`;
        message += `   • Precio unitario: $${item.unitPrice.toFixed(2)}\n`;
        message += `   • Subtotal: $${item.totalPrice.toFixed(2)}\n`;
        if (item.product?.sku) {
          message += `   • SKU: ${item.product.sku}\n`;
        }
        message += '\n';
      });
    }

    // Combos
    if (combos.length > 0) {
      message += '\n🎁 *Combos:*\n';
      combos.forEach((item, index) => {
        message += `${index + 1}. ${item.combo?.name}\n`;
        message += `   • Cantidad: ${item.quantity}\n`;
        message += `   • Precio unitario: $${item.unitPrice.toFixed(2)}\n`;
        message += `   • Subtotal: $${item.totalPrice.toFixed(2)}\n`;
        if (item.combo?.originalPrice && item.combo.originalPrice > item.combo.price) {
          const savings = item.combo.originalPrice - item.combo.price;
          message += `   • Ahorro: $${savings.toFixed(2)}\n`;
        }
        if (item.combo?.sku) {
          message += `   • SKU: ${item.combo.sku}\n`;
        }
        message += '\n';
      });
    }

    // Resumen de la orden
    message += '💰 *Resumen del Pedido:*\n';
    message += `• Subtotal: $${cartSummary.subtotal.toFixed(2)}\n`;
    if (cartSummary.discount > 0) {
      message += `• Descuento: -$${cartSummary.discount.toFixed(2)}\n`;
    }
    message += `• Total: $${cartSummary.total.toFixed(2)}\n`;
    message += `• Total de artículos: ${cartSummary.itemCount}\n\n`;

    // Footer
    message += '⏰ *Fecha del pedido:* ' + new Date().toLocaleString('es-ES') + '\n\n';
    message += '✨ *Gracias por tu compra!*';

    return this.encodeMessage(message);
  }

  private buildWhatsAppUrl(message: string): string {
    return `${this.WHATSAPP_BASE_URL}/${this.COMPANY_PHONE}?text=${message}`;
  }

  private encodeMessage(message: string): string {
    return encodeURIComponent(message);
  }

  /**
   * Abrir Whatsapp en nueva ventana
   */
  private openWhatsApp(url: string): void {
    window.open(url, '_blank');
  }

  /**
   * Enviar el mensaje
   */
  public sendCustomMessage(message: string): void {
    const encodedMessage = this.encodeMessage(message);
    const whatsappUrl = this.buildWhatsAppUrl(encodedMessage);
    this.openWhatsApp(whatsappUrl);
  }

  /**
   * Alternativo
   */
  public generateMessageFromCart(items: CartItem[]): string {
    const cartSummary: CartSummary = {
      subtotal: items.reduce((sum, item) => sum + item.totalPrice, 0),
      discount: 0,
      total: items.reduce((sum, item) => sum + item.totalPrice, 0),
      itemCount: items.reduce((sum, item) => sum + item.quantity, 0),
      items
    };

    return this.formatWhatsAppMessage(cartSummary);
  }

  /**
   * Revisar si whatsapp esta instalado (Moviles)
   */
  public isWhatsAppAvailable(): boolean {
    // Revisar si el usuario esta en movil
    const userAgent = navigator.userAgent || navigator.vendor;
    return /android|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent);
  }

  public getCompanyPhone(): string {
    return this.COMPANY_PHONE;
  }
}
