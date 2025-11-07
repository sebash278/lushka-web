import { Injectable } from '@angular/core';
import { Product } from '../../../shared/models';

@Injectable({
  providedIn: 'root'
})
export class ProductLoaderService {
  private products: Product[] = [];

  constructor() {
    this.loadProducts();
  }

  private loadProducts(): void {
    // Capilar Products - Precios en COP (Pesos Colombianos)
    this.products.push(
      {
        id: 'aceite-capilar',
        name: 'Aceite Capilar',
        description: 'Aceite capilar ligero que controla frizz, sella puntas y aporta brillo intenso sin dejar grasa.\n\n💛 Argán: Brillo espejo, suavidad y reparación\n💚 Aguacate: Nutrición profunda, fortalece y previene quiebre',
        price: 10000,
        images: ['/Productos/Capilar/AceiteCapilar.jpg'],
        category: 'capilar',
        tags: ['nutrición', 'brillo', 'tratamiento', 'argán', 'aguacate'],
        stock: 50,
        featured: false,
        sku: 'CAP001',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'acondicionador',
        name: 'Acondicionador',
        description: 'Acondicionador nutritivo que deja tu cabello suave, brillante y manejable.\nFortalece la fibra capilar, hidrata profundamente y ayuda a reducir el frizz.\n\n💗 Miel, pétalos de rosas y aminoácidos: Nutrición intensa, suavidad y brillo\n💙 Aguacate y Argán: Hidratación profunda, reparación y restauración\n💜 Piña y banano: Revitaliza, fortalece y promueve el crecimiento natural del cabello',
        price: 20000,
        images: ['/Productos/Capilar/Acondicionador.png'],
        category: 'capilar',
        tags: ['desenredante', 'suavizante', 'nutritivo', 'miel', 'rosas', 'aminoácidos', 'aguacate', 'argán', 'piña', 'banano'],
        stock: 40,
        featured: false,
        sku: 'CAP002',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'aguacate',
        name: 'Tratamiento de Aguacate',
        description: 'Tratamiento capilar de aguacate que nutre a profundidad y restaura cabellos dañados.\nAporta elasticidad, suavidad y brillo, ideal para cabello seco o decolorado.',
        price: 15000,
        images: ['/Productos/Capilar/Aguacate.jpg'],
        category: 'capilar',
        tags: ['hidratación', 'natural', 'tratamiento', 'aguacate', 'nutrición', 'reparación'],
        stock: 30,
        featured: true,
        sku: 'CAP003',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'crema-peinar',
        name: 'Crema para Peinar',
        description: 'Crema para peinar sin sal que define, hidrata y controla el frizz sin dejar el cabello pesado.\nPerfecta para uso diario, aporta brillo, suavidad y protección térmica.\n\n💗 Miel, pétalos de rosas y aminoácidos: Brillo natural, suavidad y reparación\n💙 Aguacate y Argán: Hidratación profunda, control del frizz y elasticidad\n💜 Piña y banano: Fortalece la hebra, ayuda al crecimiento y reduce puntas abiertas',
        price: 10000,
        images: ['/Productos/Capilar/CremaPeinar.png'],
        category: 'capilar',
        tags: ['peinado', 'brillo', 'facilidad', 'sin sal', 'definición', 'hidratación', 'frizz'],
        stock: 45,
        featured: false,
        sku: 'CAP005',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'helado',
        name: 'Tratamiento Helado Capilar',
        description: 'Tratamiento capilar tipo mascarilla helado.\nAporta suavidad extrema, brillo instantáneo y reparación profunda en cabellos resecos y maltratados.',
        price: 15000,
        images: ['/Productos/Capilar/Helado.jpg'],
        category: 'capilar',
        tags: ['refrescante', 'tratamiento', 'suavidad', 'reparación', 'brillo'],
        stock: 25,
        featured: true,
        sku: 'CAP006',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'nutella',
        name: 'Tratamiento Nutella',
        description: 'Tratamiento capilar ultra nutritivo inspirado en la suavidad del chocolate.\nRepara puntas abiertas, hidrata profundamente y deja el cabello sedoso, brillante y manejable.',
        price: 15000,
        images: ['/Productos/Capilar/Nutella.jpg'],
        category: 'capilar',
        tags: ['nutritiva', 'dulce', 'brillo', 'reparación', 'hidratación'],
        stock: 20,
        featured: false,
        sku: 'CAP007',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'shampoo',
        name: 'Shampoo',
        description: 'Shampoo sin sal que limpia suavemente sin resecar, fortalece y revitaliza tu cabello.\nAyuda a reducir caída, aporta brillo y favorece el crecimiento saludable.\n\n💗 Miel, pétalos de rosas y aminoácidos: Nutre, hidrata y fortalece\n💙 Carbón activado y Bambú: Limpieza profunda, controla grasa y desintoxica\n💜 Cebolla y Biotina: Estimula el crecimiento, fortalece y reduce la caída',
        price: 20000,
        images: ['/Productos/Capilar/shampoo.png'],
        category: 'capilar',
        tags: ['limpieza', 'profesional', 'suavidad', 'sin sal', 'fortalece', 'revitaliza', 'crecimiento'],
        stock: 60,
        featured: false,
        sku: 'CAP008',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    );

    // Combos Products - Precios en COP (Pesos Colombianos)
    this.products.push(
      {
        id: 'bucal',
        name: 'Set de Bálsamos Bucales',
        description: 'Set de bálsamos bucales hidratantes.\nDeja labios suaves, frescos y deliciosos.\n\n💛 Piña colada\n💙 Blue Berry\n💗 Sandía\n💙 Menta\n💚 Hierbabuena\n❤️ Durazno\n💜 Uva',
        price: 20000,
        images: ['/Productos/Combos/bucal.jpg'],
        category: 'combos',
        tags: ['higiene', 'bucal', 'combo', 'bálsamos', 'hidratantes'],
        stock: 15,
        featured: true,
        sku: 'COM001',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'carrito',
        name: 'Set Aromático',
        description: 'Set aromático con fragancias únicas y elegantes.\nIdeal para regalo o uso diario.\n\n💗 Vainilla / Sándalo\n💙 Fresco / Amaderado\n💚 Fresco / Floral\n❤️ Flores / Jazmín\n💜 Dulce / Delicado',
        price: 25000,
        images: ['/Productos/Combos/Carrito.jpg'],
        category: 'combos',
        tags: ['belleza', 'esencial', 'carrito', 'aromático', 'fragancias'],
        stock: 5,
        featured: true,
        sku: 'COM003',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'casa-amarilla',
        name: 'Kit Capilar Amarillo',
        description: 'Kit capilar sin sal: Shampoo + Acondicionador + Crema para peinar.\nCon pétalos de rosas, aminoácidos y miel.\nFortalece, nutre e hidrata profundamente.',
        price: 40000,
        images: ['/Productos/Combos/CasaAmarilla.jpg'],
        category: 'combos',
        tags: ['presentación', 'regalo', 'amarillo', 'kit capilar', 'sin sal', 'rosas', 'aminoácidos', 'miel'],
        stock: 12,
        featured: false,
        sku: 'COM004',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'casa-rosada',
        name: 'Kit Capilar Rosa',
        description: 'Kit capilar sin sal: Shampoo + Acondicionador + Crema para peinar.\nCon cebolla y biotina.\nEvita la caída, estimula crecimiento y aporta brillo.',
        price: 40000,
        images: ['/Productos/Combos/CasaRosada.jpg'],
        category: 'combos',
        tags: ['presentación', 'regalo', 'rosa', 'kit capilar', 'sin sal', 'cebolla', 'biotina', 'crecimiento'],
        stock: 12,
        featured: false,
        sku: 'COM005',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'casa-verde',
        name: 'Kit Capilar Verde',
        description: 'Kit capilar sin sal: Shampoo + Acondicionador + Crema para peinar.\nCon carbón y bambú.\nExfolia, limpia y purifica profundamente.',
        price: 40000,
        images: ['/Productos/Combos/CasaVerde.jpg'],
        category: 'combos',
        tags: ['presentación', 'regalo', 'verde', 'kit capilar', 'sin sal', 'carbón', 'bambú', 'purifica'],
        stock: 12,
        featured: false,
        sku: 'COM006',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'shine-box',
        name: 'Shine Box',
        description: 'Caja con Splash con destellos, mantequilla iluminadora y fresita doble hidratante.\nPiel luminosa, suave y perfumada todo el día.',
        price: 30000,
        images: ['/Productos/Combos/shineBox.jpg'],
        category: 'combos',
        tags: ['premium', 'brillo', 'caja', 'destellos', 'mantequilla', 'fresita', 'luminosa'],
        stock: 8,
        featured: false,
        sku: 'COM007',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    );

    // Corporal Products - Precios en COP (Pesos Colombianos)
    this.products.push(
      {
        id: 'almendra',
        name: 'Aceite Corporal de Almendra',
        description: 'Aceite corporal hidratante, ayuda a reducir estrías y celulitis.\nAporta elasticidad y suavidad a la piel.',
        price: 15000,
        images: ['/Productos/Corporal/almendra.jpg'],
        category: 'corporal',
        tags: ['almendra', 'suavidad', 'nutrición', 'estrías', 'celulitis', 'elasticidad'],
        stock: 35,
        featured: true,
        sku: 'COR001',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'boca',
        name: 'Bálsamo Labial',
        description: 'Bálsamo labial hidratante con aromas irresistibles.\nRepara, suaviza y deja brillo natural.\n\n💛 Piña colada\n💙 Blue Berry\n💗 Sandía\n💙 Menta\n💚 Hierbabuena\n❤️ Durazno\n💜 Uva',
        price: 8000,
        images: ['/Productos/Corporal/boca.jpg'],
        category: 'corporal',
        tags: ['labios', 'hidratación', 'bálsamo', 'repara', 'suaviza', 'brillo'],
        stock: 50,
        featured: false,
        sku: 'COR002',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'chocolate',
        name: 'Aceite Corporal de Chocolate',
        description: 'Aceite corporal para masajes, hidratante y afrodisíaco.\nTextura suave y aroma cálido irresistible.',
        price: 15000,
        images: ['/Productos/Corporal/chocolate.jpg'],
        category: 'corporal',
        tags: ['mascarilla', 'chocolate', 'antioxidante', 'masajes', 'afrodisíaco'],
        stock: 30,
        featured: false,
        sku: 'COR003',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'coco',
        name: 'Aceite Corporal de Coco',
        description: 'Aceite corporal hidratante que mejora la textura de la piel.\nTambién funciona como desmaquillante natural.',
        price: 15000,
        images: ['/Productos/Corporal/coco.jpg'],
        category: 'corporal',
        tags: ['coco', 'hidratación', 'natural', 'desmaquillante'],
        stock: 40,
        featured: false,
        sku: 'COR004',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'crema',
        name: 'Crema Corporal',
        description: 'Crema corporal hidratante de rápida absorción.\nSuaviza la piel, mejora textura y deja aroma duradero.\n\n💗 Coqueta: Delicada, dulce, suave\n💜 Delicada: Floral, fresca\n💗 Divertida: Bombombun, dulce e intenso',
        price: 15000,
        images: ['/Productos/Corporal/crema.png'],
        category: 'corporal',
        tags: ['hidratación', 'diario', 'suave', 'rápida absorción'],
        stock: 45,
        featured: false,
        sku: 'COR005',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'despigmentante',
        name: 'Crema Despigmentante',
        description: 'Crema para unificar tono de piel',
        price: 42000,
        images: ['/Productos/Corporal/despigmentante.jpg'],
        category: 'corporal',
        tags: ['despigmentante', 'unificar', 'piel'],
        stock: 25,
        featured: true,
        sku: 'COR006',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'dulces',
        name: 'Dulces Hidratantes',
        description: 'Caja de 18 dulces hidratantes para la piel.\nTextura cremosa, deja piel suave, brillante y perfumada.',
        price: 10000,
        images: ['/Productos/Corporal/dulces.jpg'],
        category: 'corporal',
        tags: ['mantequilla', 'dulce', 'hidratación', 'cremosa'],
        stock: 30,
        featured: false,
        sku: 'COR007',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'feromonas',
        name: 'Splash Corporal con Feromonas',
        description: 'Splash corporal con feromonas, aroma duradero y fijación alta.\nEstimula confianza, atractivo y energía personal.\n\n💗 Divertida: Vainilla / Sándalo\n💙 Soñadora: Fresco / Amaderado\n💚 Delicada: Fresco / Floral\n❤️ Radiante: Flores / Jazmín\n💜 Auténtica: Dulce / Delicado',
        price: 10000,
        images: ['/Productos/Corporal/feromonas.jpg'],
        category: 'corporal',
        tags: ['feromonas', 'perfume', 'atracción', 'confianza', 'energía'],
        stock: 20,
        featured: false,
        sku: 'COR008',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'intimo',
        name: 'Gel Íntimo',
        description: 'Gel para higiene íntima',
        price: 18000,
        images: ['/Productos/Corporal/intimo.png'],
        category: 'corporal',
        tags: ['íntimo', 'higiene', 'suave'],
        stock: 40,
        featured: false,
        sku: 'COR009',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'mantequilla-azul',
        name: 'Mantequilla Corporal Azul',
        description: 'Mantequilla corporal cremosa y ultra hidratante.\nNutre la piel, mejora elasticidad y deja aroma suave.',
        price: 15000,
        images: ['/Productos/Corporal/mantequillaAzul.jpg'],
        category: 'corporal',
        tags: ['mantequilla', 'azul', 'hidratación', 'cremosa', 'ultra hidratante'],
        stock: 25,
        featured: false,
        sku: 'COR010',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'mantequilla-morada',
        name: 'Mantequilla Corporal Morada',
        description: 'Mantequilla corporal nutritiva ideal para piel seca.\nSuaviza, repara y deja textura sedosa y luminosa.',
        price: 15000,
        images: ['/Productos/Corporal/mantequillaMorada.jpg'],
        category: 'corporal',
        tags: ['mantequilla', 'morada', 'hidratación', 'nutritiva', 'piel seca'],
        stock: 25,
        featured: false,
        sku: 'COR011',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'mantequilla-rosada',
        name: 'Mantequilla Corporal Rosada',
        description: 'Mantequilla corporal hidratante con acabado aterciopelado.\nAporta suavidad, brillo natural y perfume dulce.',
        price: 15000,
        images: ['/Productos/Corporal/MantequillaRosada.jpg'],
        category: 'corporal',
        tags: ['mantequilla', 'rosa', 'hidratación', 'aterciopelado', 'brillo natural'],
        stock: 25,
        featured: false,
        sku: 'COR012',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'naranja',
        name: 'Aceite Corporal de Naranja',
        description: 'Aceite corporal aromático para masajes.\nHidrata, suaviza y aporta antioxidantes a la piel.',
        price: 15000,
        images: ['/Productos/Corporal/naranja.jpg'],
        category: 'corporal',
        tags: ['naranja', 'vitamina C', 'energizante', 'antioxidantes', 'masajes'],
        stock: 30,
        featured: false,
        sku: 'COR013',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'per-destellos',
        name: 'Perfume con Destellos',
        description: 'Perfume con destellos que deja brillo sutil en la piel.\nAroma glamuroso, dulce y femenino con larga duración.',
        price: 13000,
        images: ['/Productos/Corporal/PerDestellos.jpg'],
        category: 'corporal',
        tags: ['piel', 'destellos', 'especial', 'brillo', 'glamuroso'],
        stock: 20,
        featured: false,
        sku: 'COR014',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'perfume',
        name: 'Perfume',
        description: 'Perfume con fragancia duradera, elegante y envolvente.\nIdeal para uso diario y ocasiones especiales.',
        price: 12000,
        images: ['/Productos/Corporal/perfume.jpg'],
        category: 'corporal',
        tags: ['fragancia', 'larga duración', 'elegante', 'envolvente'],
        stock: 35,
        featured: false,
        sku: 'COR015',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'velas',
        name: 'Velas Corporales',
        description: 'Velas corporales que se derriten en aceite tibio para masajes e hidratación profunda.\nDejan la piel suave, perfumada y luminosa.\n\n💛 Poderosa: Maracuyá\n💗 Divertida: Sandía\n💙 Delicada: Durazno\n❤️ Pasión: Durazno\n💜 Radiante: Limón',
        price: 15000,
        images: ['/Productos/Corporal/velas.jpg'],
        category: 'corporal',
        tags: ['velas', 'aromáticas', 'ambiente', 'masajes', 'hidratación'],
        stock: 40,
        featured: false,
        sku: 'COR016',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'zanahoria',
        name: 'Aceite Corporal de Zanahoria',
        description: 'Aceite corporal hidratante que aporta brillo natural.\nBronceador natural y nutritivo para la piel.',
        price: 15000,
        images: ['/Productos/Corporal/zanahoria.jpg'],
        category: 'corporal',
        tags: ['mascarilla', 'zanahoria', 'vitaminas', 'brillo natural', 'bronceador'],
        stock: 25,
        featured: false,
        sku: 'COR017',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    );

    // Facial Products - Precios en COP (Pesos Colombianos)
    this.products.push(
      {
        id: 'espuma',
        name: 'Espuma Facial',
        description: 'Espuma facial suave que limpia profundamente sin resecar.\nElimina impurezas, controla grasa y deja piel fresca.\n\n💗 Rosas\n💚 Aloe Vera\n🤍 Arroz\n🖤 Carbón\n💜 Uva',
        price: 15000,
        images: ['/Productos/Facial/espuma.jpg'],
        category: 'facial',
        tags: ['limpieza', 'espuma', 'facial', 'rosas', 'aloe vera', 'arroz', 'carbón', 'uva'],
        stock: 35,
        featured: true,
        sku: 'FAC001',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'pestanas',
        name: 'Tratamiento para Pestañas',
        description: 'Tratamiento natural para crecimiento de pestañas.\nHecho a base de aceite de coco, vitamina E, aceite de castor y aguacate.\nNutre, fortalece y estimula el crecimiento.',
        price: 14000,
        images: ['/Productos/Facial/pestañas.jpg'],
        category: 'facial',
        tags: ['pestañas', 'crecimiento', 'nutritivo', 'coco', 'vitamina E', 'castor', 'aguacate'],
        stock: 25,
        featured: true,
        sku: 'FAC002',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    );

    // Personal Products - Precios en COP (Pesos Colombianos)
    this.products.push(
      {
        id: 'reto',
        name: 'Reto de Amor Propio',
        description: 'Reto de amor propio diseñado para fortalecer autoestima.\nEjercicios diarios para conectar contigo y mejorar bienestar emocional.',
        price: 30000,
        images: ['/Productos/Personal/reto.jpg'],
        category: 'personal',
        tags: ['reto', 'desafío', 'kit', 'amor propio', 'autoestima', 'bienestar emocional'],
        stock: 15,
        featured: true,
        sku: 'PER001',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    );
  }

  getProducts(): Product[] {
    return this.products;
  }

  getProductsByCategory(category: string): Product[] {
    return this.products.filter(product => product.category === category);
  }

  getProductsByCategories(categories: string[]): Product[] {
    return this.products.filter(product => categories.includes(product.category));
  }

  getProductById(id: string): Product | undefined {
    return this.products.find(product => product.id === id);
  }

  searchProducts(query: string): Product[] {
    const lowerQuery = query.toLowerCase();
    return this.products.filter(product =>
      product.name.toLowerCase().includes(lowerQuery) ||
      product.description.toLowerCase().includes(lowerQuery) ||
      product.tags.some((tag: string) => tag.toLowerCase().includes(lowerQuery))
    );
  }

  getFeaturedProducts(): Product[] {
    return this.products.filter(product => product.featured);
  }

  /**
   * Get products that have existing image files
   * This ensures we only recommend products with actual images
   */
  getProductsWithValidImages(): Product[] {
    // List of actual image files that exist (with leading slash to match ProductLoaderService paths)
    const validImages = [
      '/Productos/Capilar/AceiteCapilar.jpg',
      '/Productos/Capilar/Acondicionador.png',
      '/Productos/Capilar/Aguacate.jpg',
      '/Productos/Capilar/CremaPeinar.png',
      '/Productos/Capilar/Helado.jpg',
      '/Productos/Capilar/Nutella.jpg',
      '/Productos/Capilar/shampoo.png',
      '/Productos/Combos/bucal.jpg',
      '/Productos/Combos/Carrito.jpg',
      '/Productos/Combos/CasaAmarilla.jpg',
      '/Productos/Combos/CasaRosada.jpg',
      '/Productos/Combos/CasaVerde.jpg',
      '/Productos/Combos/shineBox.jpg',
      '/Productos/Corporal/almendra.jpg',
      '/Productos/Corporal/boca.jpg',
      '/Productos/Corporal/chocolate.jpg',
      '/Productos/Corporal/coco.jpg',
      '/Productos/Corporal/crema.png',
      '/Productos/Corporal/despigmentante.jpg',
      '/Productos/Corporal/dulces.jpg',
      '/Productos/Corporal/feromonas.jpg',
      '/Productos/Corporal/intimo.png',
      '/Productos/Corporal/mantequillaAzul.jpg',
      '/Productos/Corporal/mantequillaMorada.jpg',
      '/Productos/Corporal/MantequillaRosada.jpg',
      '/Productos/Corporal/naranja.jpg',
      '/Productos/Corporal/PerDestellos.jpg',
      '/Productos/Corporal/perfume.jpg',
      '/Productos/Corporal/velas.jpg',
      '/Productos/Corporal/zanahoria.jpg',
      '/Productos/Facial/espuma.jpg',
      '/Productos/Facial/pestañas.jpg',
      '/Productos/Personal/reto.jpg'
    ];

    return this.products.filter(product =>
      product.images &&
      product.images.length > 0 &&
      product.images.some(image => validImages.includes(image))
    );
  }

  /**
   * Get products by category that have valid images
   */
  getProductsWithValidImagesByCategory(category: string): Product[] {
    return this.getProductsWithValidImages().filter(product => product.category === category);
  }

  /**
   * Get featured products that have valid images
   */
  getFeaturedProductsWithValidImages(): Product[] {
    return this.getProductsWithValidImages().filter(product => product.featured);
  }
}
