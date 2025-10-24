# 📦 Guía de Gestión de Productos y Combos Lushka

Esta guía te ayuda a administrar los productos y combos de forma centralizada para que estén disponibles tanto en el catálogo como en las respuestas de IA.

## 🗂️ Estructura Actual

### Ubicación Central Productos
**Archivo**: `src/app/shared/services/product.service.ts`
**Modelo**: `src/app/shared/models/product.ts`

### Ubicación Central Combos
**Archivo**: `src/app/shared/services/combo.service.ts`
**Modelo**: `src/app/shared/models/combo.ts`

## ➕ Cómo Agregar Productos Manualmente

### Paso 1: Abrir el Servicio de Productos
Ve a `src/app/shared/services/product.service.ts` y busca la función `getSampleProducts()`.

### Paso 2: Agregar Nuevo Producto
Copia esta plantilla y ajústala:

```typescript
{
  id: 'nuevo-id-unico', // ID único (sin espacios)
  name: 'Nombre del Producto',
  description: 'Descripción detallada del producto (máximo 2-3 frases)',
  price: 99999, // Precio en pesos colombianos (número, sin formato)
  images: ['nombre-imagen-1.jpg', 'nombre-imagen-2.jpg'], // Nombres de archivos de imagen
  category: 'Categoría', // Categoría principal
  subcategory: 'Subcategoría', // (Opcional) Subcategoría más específica
  tags: ['tag1', 'tag2', 'tag3', 'tag4'], // Palabras clave para búsqueda y filtrado
  stock: 50, // Cantidad disponible
  featured: true, // true si quieres que aparezca en la página principal
  sku: 'SKU-UNICO-001', // Código de producto único
  discount: { // (Opcional) Descuento
    percentage: 20, // Porcentaje de descuento
    validUntil: new Date('2024-12-31') // (Opcional) Fecha de vencimiento
  },
  createdAt: new Date(),
  updatedAt: new Date()
}
```

## 🏷️ Categorías Disponibles

- **Facial**: Productos para el rostro (sueros, cremas, limpiadores, etc.)
- **Labios**: Bálsamos, labiales, etc.
- **Corporal**: Cremas corporales, aceites, exfoliantes, etc.
- **Cabello**: (Para uso futuro)
- **Maquillaje**: (Para uso futuro)

## 🏷️ Tags Recomendados

### Tags por Función
- `hidratación`, `hidratante`
- `anti-envejecimiento`, `anti-edad`
- `purificación`, `poros`, `detox`
- `reparación`, `nutrición`
- `exfoliación`, `renovación`
- `protección`, `barreira`

### Tags por Tipo
- `serum`, `crema`, `loción`, `aceite`
- `mascarilla`, `exfoliante`, `tónico`
- `bálsamo`, `contorno de ojos`

### Tags por Ingrediente
- `rosa mosqueta`, `argán`, `coco`, `karité`
- `ácido hialurónico`, `vitamina C`, `retinol`
- `arcilla`, `carbón activado`, `miel`

## 🎯 Cómo Funciona con la IA

La IA usa estos criterios para recomendar productos:

1. **Categoría**: Basada en la respuesta "Qué tipo de producto buscas"
2. **Presupuesto**: Filtra por rangos de precio
3. **Tags**: Coincide con preocupaciones específicas (hidratación, anti-edad, etc.)
4. **Productos Destacados**: Prioriza productos con `featured: true`

## 📸 Gestión de Imágenes

1. Coloca las imágenes en: `src/assets/images/products/`
2. Usa nombres descriptivos (ej: `serum-rosa-mosqueta-1.jpg`)
3. Nombra las imágenes en el array `images` sin la ruta completa
4. Formatos recomendados: JPG, PNG, WebP

## 🎁 Cómo Agregar Combos Manualmente

### Paso 1: Abrir el Servicio de Combos
Ve a `src/app/shared/services/combo.service.ts` y busca la función `getSampleCombos()`.

### Paso 2: Agregar Nuevo Combo
Copia esta plantilla y ajústala:

```typescript
{
  id: 'combo-id-unico', // ID único (sin espacios)
  name: 'Nombre del Combo',
  description: 'Descripción detallada del combo y sus beneficios',
  price: 150000, // Precio con descuento en COP
  originalPrice: 200000, // Precio original sin descuento
  images: ['combo-imagen.jpg'], // Nombre de archivo de imagen
  products: this.createComboProducts(['1', '2'], allProducts), // IDs de productos
  category: 'Categoría', // Skincare, Corporal, Labios, etc.
  tags: ['tag1', 'tag2', 'tag3'], // Palabras clave para búsqueda
  stock: 15, // Cantidad disponible
  featured: true, // true si quieres que aparezca en la página principal
  sku: 'COMBO-UNICO-001', // Código de combo único
  discount: { // (Opcional) Información de descuento
    percentage: 25, // Porcentaje de descuento
    validUntil: new Date('2024-12-31') // (Opcional) Fecha de vencimiento
  },
  createdAt: new Date(),
  updatedAt: new Date()
}
```

### Paso 3: Referenciar Productos Existentes
En la línea `products: this.createComboProducts(['1', '2'], allProducts)`:
- Reemplaza `['1', '2']` con los IDs de los productos que quieres incluir
- Usa los IDs de productos que ya existen en el `product.service.ts`

## 🏷️ Categorías de Combos

- **Skincare**: Combos de cuidado facial
- **Hidratación**: Combos especializados en hidratación
- **Corporal**: Combos para el cuerpo
- **Anti-Edad**: Combos anti-envejecimiento
- **Labios**: Combos de cuidado labial

## 🔄 Actualización Automática

Cuando modificas productos o combos en los servicios:
- ✅ Se actualizan automáticamente en el catálogo
- ✅ Se actualizan en las recomendaciones de IA
- ✅ Se actualizan en la vista previa del catálogo
- ✅ Se actualizan en la sección de combos
- ✅ Se mantienen sincronizados todos los componentes

## 📝 Ejemplos de Productos por Categoría

### Producto Facial
```typescript
{
  id: 'facial-001',
  name: 'Sérum Iluminador Vitamina C',
  description: 'Sérum potente con vitamina C que ilumina y unifica el tono de piel.',
  price: 68000,
  images: ['serum-vitamina-c-1.jpg'],
  category: 'Facial',
  subcategory: 'Sueros',
  tags: ['iluminación', 'vitamina C', 'antioxidante', 'manchas'],
  stock: 35,
  featured: true,
  sku: 'FAC-VITC-SERUM-30',
  createdAt: new Date(),
  updatedAt: new Date()
}
```

### Producto Labios
```typescript
{
  id: 'labios-001',
  name: 'Bálsamo Reparador con Miel',
  description: 'Bálsamo nutritivo con miel orgánica para labios secos y agrietados.',
  price: 15000,
  images: ['balsamo-miel-1.jpg'],
  category: 'Labios',
  subcategory: 'Bálsamos',
  tags: ['reparación', 'miel', 'hidratación', 'nutrición'],
  stock: 60,
  featured: false,
  sku: 'LAB-MIEL-BALS-15',
  createdAt: new Date(),
  updatedAt: new Date()
}
```

## ⚡ Tips para Buenas Prácticas

1. **IDs Únicos**: Usa IDs descriptivos y únicos
2. **Stock Real**: Mantén el stock actualizado
3. **Tags Relevantes**: Usa tags que coincidan con las preguntas del cuestionario IA
4. **Destacados**: Selecciona solo 3-4 productos como `featured: true`
5. **Descripciones Claras**: Sé específico pero conciso
6. **Precios Consistentes**: Usa números reales en COP

## 🚀 Próximos Pasos

1. Agrega tus productos siguiendo esta guía
2. Actualiza los tags para que coincidan con las necesidades del cuestionario
3. Marca como `featured` los productos que quieres en la página principal
4. Prueba las recomendaciones de IA para verificar que funcionen correctamente

---

**¿Necesitas ayuda?** Revisa los productos de ejemplo ya incluidos en el servicio como referencia.