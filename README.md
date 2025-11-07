# Lushka - Tienda de Productos de Belleza

Catálogo online de productos de belleza y cuidado personal con sistema de recomendaciones inteligentes y experiencia de compra moderna.

## Características Principales

### Catálogo de Productos
- **Visualización completa**: Catálogo interactivo con imágenes, descripciones detalladas y precios en pesos colombianos
- **Filtros avanzados**: Sistema de filtrado por categoría, rango de precio, tipo de producto y características específicas
- **Búsqueda inteligente**: Búsqueda por nombre, descripción o etiquetas de productos
- **Detalles del producto**: Páginas individuales con información completa, stock y disponibilidad

### Sistema de Recomendaciones IA
- **Cuestionario personalizado**: Asistente virtual que guía al usuario a través de preguntas sobre preferencias
- **Recomendaciones inteligentes**: Algoritmo que analiza respuestas para sugerir productos adecuados
- **Filtros contextuales**: Las recomendaciones consideran tipo de piel, presupuesto, preocupaciones específicas e ingredientes preferidos

### Carrito de Compras
- **Gestión en tiempo real**: Carrito lateral con actualización instantánea de productos y totales
- **Control de cantidades**: Incremento/decremento de unidades con validación de stock
- **Resumen de compra**: Visualización clara de subtotal, descuentos y total final
- **Persistencia local**: Los productos del carrito se mantienen entre sesiones

### Integración con WhatsApp
- **Generación automática**: Creación de mensaje personalizado con detalles del carrito
- **Formato optimizado**: Mensaje estructurado con productos, cantidades, precios y totales
- **Acceso directo**: Redirección automática a WhatsApp con el pedido preformateado

### Experiencia de Usuario
- **Diseño responsive**: Adaptable a todos los dispositivos (móvil, tablet, desktop)
- **Navegación fluida**: Transiciones suaves y carga rápida de contenido
- **Interfaz intuitiva**: Diseño centrado en el usuario con facilidad de uso
- **Feedback visual**: Indicadores de estado, carga y confirmación de acciones

## Arquitectura Técnica

### Frontend
- **Framework**: Angular 20 con componentes standalone
- **Estilos**: CSS3 con diseño personalizado y sistema de colores coherente
- **Componentes**: Arquitectura modular con componentes reutilizables
- **Estado**: Gestión reactiva con servicios y BehaviorSubjects

### Datos y Servicios
- **Catálogo de productos**: Servicio centralizado con productos predefinidos
- **Sistema de IA**: Algoritmo de recomendaciones basado en reglas y filtros
- **Gestión de carrito**: Servicio con persistencia en localStorage
- **Comunicación externa**: Servicio de integración con WhatsApp

### Categorías de Productos
- **Capilar**: Shampoos, acondicionadores, tratamientos y cremas para peinar
- **Corporal**: Aceites, cremas, velas corporales y productos hidratantes
- **Facial**: Espumas, sueros y tratamientos específicos para el rostro
- **Combos**: Kits especializados con múltiples productos coordinados
- **Personal**: Productos para bienestar y cuidado personal

## Instalación y Desarrollo

### Prerrequisitos
- Node.js 18.x o superior
- Angular CLI 20.x
- NPM o Yarn

### Instalación
```bash
# Clonar el repositorio
git clone [url-del-repositorio]
cd lushka-web

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
ng serve
```

Acceder a la aplicación en `http://localhost:4200/`

### Construcción para Producción
```bash
# Construir proyecto para producción
ng build --configuration production

# Los archivos generados estarán en la carpeta dist/
```

## Estructura del Proyecto

```
src/
├── app/
│   ├── core/                    # Servicios principales
│   │   └── services/           # Lógica de negocio
│   ├── features/               # Funcionalidades principales
│   │   ├── catalog/           # Catálogo de productos
│   │   ├── landing/           # Página principal
│   │   └── checkout/          # Proceso de compra
│   └── shared/                # Componentes compartidos
│       ├── components/        # UI reutilizable
│       ├── models/           # Tipos de datos
│       └── services/         # Servicios auxiliares
├── assets/                   # Recursos estáticos
└── public/                   # Archivos públicos
```

## Gestión de Productos

### Adición de Productos
Los productos se gestionan a través del servicio `ProductLoaderService` ubicado en:
`src/app/features/catalog/services/product-loader.service.ts`

### Estructura de Producto
Cada producto incluye:
- Información básica (id, nombre, descripción, precio)
- Imágenes y categorías
- Etiquetas para filtrado
- Stock y disponibilidad
- Metadatos (SKU, fechas de creación/actualización)

## Características Técnicas

- **Rendimiento optimizado**: Lazy loading y optimización de imágenes
- **Accesibilidad**: Estructura semántica HTML5 y atributos ARIA
- **SEO meta tags**: Optimización básica para motores de búsqueda
- **Manejo de errores**: Sistema de fallback para productos no encontrados
- **Validación de formularios**: Controles de entrada y validación en tiempo real
- **Sistema de filtros**: Lógica de filtrado compleja con múltiples criterios

## Licencia

Proyecto desarrollado como plataforma de e-commerce para productos de belleza y cuidado personal.