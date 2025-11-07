import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { AIRecommendation, UserAnswer, Product } from '../../shared/models';
import { ProductLoaderService } from '../../features/catalog/services/product-loader.service';

@Injectable({
  providedIn: 'root'
})
export class GeminiAiService {
  private readonly GEMINI_API_KEY = 'AIzaSyB7wZAW5WQaRP86oPyTTz_2Lvj5uDxIJ0s';
  private readonly GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent';

  constructor(
    private http: HttpClient,
    private productLoader: ProductLoaderService
  ) {}

  /**
   * Generar recomendaciones de IA usando productos reales (API de Gemini temporalmente deshabilitada)
   */
  generateRecommendation(answers: UserAnswer[]): Observable<AIRecommendation> {
    // Usando temporalmente solo recomendaciones de productos reales para evitar errores de API
    console.log('Using real product recommendations based on user answers:', answers);

    // Retornar recomendaciones de respaldo que usan productos reales
    return of(this.createFallbackRecommendation(answers));

    // Código original de API de Gemini (comentado por ahora):
    /*
    const prompt = this.buildPrompt(answers);

    const requestBody = {
      contents: [{
        parts: [{
          text: prompt
        }]
      }],
      generationConfig: {
        temperature: 0.9,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 1024,
      }
    };

    const url = `${this.GEMINI_API_URL}?key=${this.GEMINI_API_KEY}`;

    return this.http.post<any>(url, requestBody).pipe(
      map(response => {
        console.log('Gemini API Response:', response);
        return this.parseGeminiResponse(response, answers);
      }),
      catchError(error => {
        console.error('Gemini API error:', error);
        console.log('Using fallback recommendations due to API error');
        return of(this.createFallbackRecommendation(answers));
      })
    );
    */
  }

  /**
   * Build the prompt for Gemini AI
   */
  private buildPrompt(answers: UserAnswer[]): string {
    console.log('Building prompt with answers:', answers);

    const answersText = answers.map(a => {
      const question = this.getQuestionText(a.questionId);
      const answer = this.getAnswerText(a.questionId, a.value);
      return `${question}: ${answer}`;
    }).join('\n');

    console.log('Answers text for AI:', answersText);

    return `Eres un experto en belleza y cosméticos de Lushka con 10 años de experiencia. Basado en las siguientes respuestas del usuario, recomienda productos MUY ESPECÍFICOS y personalizados:

${answersText}

INSTRUCCIONES IMPORTANTES:
1. Da recomendaciones DIFERENTES para cada combinación de respuestas
2. No repitas los mismos productos siempre
3. Adapta los productos específicamente a las respuestas del usuario
4. Usa nombres de productos realistas y específicos
5. Los precios deben variar según el presupuesto indicado
6. Incluye productos que resuelvan los problemas mencionados

Ejemplos de cómo adaptar:
- Si eligen skincare + anti-aging + piel seca → recomendar cremas con ácido hialurónico
- Si eligen makeup + piel grasa → recomendar bases mate oil-free
- Si eligen budget bajo → productos económicos $8-15mil
- Si eligen budget alto → productos premium $30-42mil

Responde ÚNICAMENTE en formato JSON así:
{
  "products": [
    {
      "id": "product1",
      "name": "Nombre ESPECÍFICO del producto",
      "description": "Descripción detallada que se relaciona con sus respuestas",
      "price": 95000,
      "category": "skincare/makeup/haircare/bodycare",
      "tags": ["tag1", "tag2", "tag3"]
    }
  ],
  "combos": [
    {
      "id": "combo1",
      "name": "Nombre del combo",
      "description": "Descripción del combo",
      "price": 180000,
      "originalPrice": 220000,
      "category": "combos",
      "tags": ["tag1", "tag2"]
    }
  ],
  "reasoning": "Explicación detallada de POR QUÉ estos productos específicos son perfectos para este usuario",
  "confidence": 0.85

RECUERDA: Personaliza las recomendaciones según las respuestas específicas del usuario. No des respuestas genéricas.`;
  }

  /**
   * Parse Gemini AI response
   */
  private parseGeminiResponse(response: any, answers: UserAnswer[]): AIRecommendation {
    try {
      const text = response.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!text) {
        throw new Error('No response text from Gemini');
      }

      // Extract JSON from the response
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No JSON found in response');
      }

      const aiResponse = JSON.parse(jsonMatch[0]);

      return {
        id: `rec_${Date.now()}`,
        products: aiResponse.products || [],
        combos: aiResponse.combos || [],
        reasoning: aiResponse.reasoning || 'Basado en tus preferencias personales',
        confidence: aiResponse.confidence || 0.75,
        answers,
        createdAt: new Date()
      };
    } catch (error) {
      console.error('Error parsing Gemini response:', error);
      return this.createFallbackRecommendation(answers);
    }
  }

  /**
   * Fallback recommendations if AI fails - uses real products with variety
   */
  private createFallbackRecommendation(answers: UserAnswer[]): AIRecommendation {
    const productType = answers.find(a => a.questionId === 'q1')?.value || 'skincare';
    const budget = answers.find(a => a.questionId === 'q2')?.value;
    const concern = answers.find(a => a.questionId === 'q3')?.value;
    const skinType = answers.find(a => a.questionId === 'q4')?.value;
    const ingredientType = answers.find(a => a.questionId === 'q5')?.value;

    console.log('=== AI FALLBACK DEBUG START ===');
    console.log('AI Fallback - User Answers:', answers);
    console.log('AI Fallback - Product Type:', productType);
    console.log('AI Fallback - Budget:', budget);
    console.log('AI Fallback - Concern:', concern);
    console.log('AI Fallback - Skin Type:', skinType);

    // Map questionnaire answers to real product categories
    const categoryMap: { [key: string]: string } = {
      'skincare': 'facial',
      'makeup': 'facial',
      'haircare': 'capilar',
      'bodycare': 'corporal'
    };

    const targetCategory = categoryMap[productType] || 'facial';
    console.log('AI Fallback - Target Category:', targetCategory);

    // Get real products from the target category that have valid images
    let availableProducts = this.productLoader.getProductsWithValidImagesByCategory(targetCategory);
    console.log('AI Fallback - Target Category:', targetCategory);
    console.log('AI Fallback - Available Products in Category:', availableProducts.length);
    console.log('AI Fallback - Category Products:', availableProducts.map(p => ({ id: p.id, name: p.name, category: p.category })));

    // If no products in target category, try facial as fallback
    if (availableProducts.length === 0) {
      console.log('AI Fallback - No products in target category, using facial as fallback');
      availableProducts = this.productLoader.getProductsWithValidImagesByCategory('facial');
      console.log('AI Fallback - Facial Products:', availableProducts.map(p => ({ id: p.id, name: p.name, category: p.category })));
    }

    // If still no products, try all categories EXCLUDING combos
    if (availableProducts.length === 0) {
      console.log('AI Fallback - No products in facial, using all non-combo products');
      const allProducts = this.productLoader.getProductsWithValidImages();
      console.log('AI Fallback - All valid products before filtering:', allProducts.map(p => ({ id: p.id, name: p.name, category: p.category })));
      availableProducts = allProducts.filter(product => product.category !== 'combos');
      console.log('AI Fallback - Available non-combo products:', availableProducts.length);
      console.log('AI Fallback - Final products after filtering:', availableProducts.map(p => ({ id: p.id, name: p.name, category: p.category })));
    }

    // Filter by budget if specified
    if (budget && availableProducts.length > 0) {
      const budgetRanges: { [key: string]: { min: number, max: number } } = {
        'budget-low': { min: 8000, max: 15000 },
        'budget-medium': { min: 18000, max: 25000 },
        'budget-high': { min: 30000, max: 42000 },
        'budget-premium': { min: 42000, max: Infinity }
      };

      const range = budgetRanges[budget];
      if (range) {
        const beforeBudget = availableProducts.length;
        availableProducts = availableProducts.filter(p =>
          p.price >= range.min && p.price <= range.max
        );
        console.log(`AI Fallback - Budget Filter (${budget}): ${beforeBudget} -> ${availableProducts.length} products`);
      }
    }

    // Filter by concern using tags
    if (concern && availableProducts.length > 0) {
      const concernTags: { [key: string]: string[] } = {
        'hydration': ['hidratación', 'hidratante'],
        'anti-aging': ['anti-envejecimiento', 'anti-edad'],
        'acne-oily': ['purificación', 'poros', 'grasa'],
        'sensitive': ['sensible', 'suave']
      };

      const relevantTags = concernTags[concern] || [];
      if (relevantTags.length > 0) {
        const beforeConcern = availableProducts.length;
        availableProducts = availableProducts.filter(p =>
          relevantTags.some(tag =>
            p.tags.some(productTag =>
              productTag.toLowerCase().includes(tag.toLowerCase()) ||
              tag.toLowerCase().includes(productTag.toLowerCase())
            )
          )
        );
        console.log(`AI Fallback - Concern Filter (${concern}): ${beforeConcern} -> ${availableProducts.length} products`);
      }
    }

    // Filter by skin type using tags
    if (skinType && availableProducts.length > 0) {
      const skinTypeTags: { [key: string]: string[] } = {
        'dry': ['seca', 'nutrición', 'hidratante'],
        'oily': ['grasa', 'purificación', 'control'],
        'combination': ['mixta', 'balance'],
        'normal': ['normal', 'suave', 'diario']
      };

      const relevantTags = skinTypeTags[skinType] || [];
      if (relevantTags.length > 0) {
        const beforeSkinType = availableProducts.length;
        availableProducts = availableProducts.filter(p =>
          relevantTags.some(tag =>
            p.tags.some(productTag =>
              productTag.toLowerCase().includes(tag.toLowerCase()) ||
              tag.toLowerCase().includes(productTag.toLowerCase())
            )
          )
        );
        console.log(`AI Fallback - Skin Type Filter (${skinType}): ${beforeSkinType} -> ${availableProducts.length} products`);
      }
    }

    // If no products after filtering, get all non-combo products as final fallback but RESPECT BUDGET
    if (availableProducts.length === 0) {
      console.log('AI Fallback - No products after filtering, getting all non-combo products as final fallback (respecting budget)');
      const allProducts = this.productLoader.getProductsWithValidImages();
      console.log('AI Fallback - All products from loader:', allProducts.map(p => ({ id: p.id, name: p.name, category: p.category, price: p.price })));
      availableProducts = allProducts.filter(product => product.category !== 'combos');

      // Apply budget filter even in fallback case
      if (budget) {
        const budgetRanges: { [key: string]: { min: number, max: number } } = {
          'budget-low': { min: 8000, max: 15000 },
          'budget-medium': { min: 18000, max: 25000 },
          'budget-high': { min: 30000, max: 42000 },
          'budget-premium': { min: 42000, max: Infinity }
        };

        const range = budgetRanges[budget];
        if (range) {
          const beforeBudget = availableProducts.length;
          availableProducts = availableProducts.filter(p =>
            p.price >= range.min && p.price <= range.max
          );
          console.log(`AI Fallback - Budget Filter Applied (${budget}): ${beforeBudget} -> ${availableProducts.length} products`);

          // If still no products in budget range, expand to next higher budget range
          if (availableProducts.length === 0) {
            console.log('AI Fallback - No products in selected budget, expanding to next range');
            if (budget === 'budget-premium') {
              // For premium, include products from $30k+
              availableProducts = allProducts.filter(product =>
                product.category !== 'combos' && product.price >= 30000
              );
            } else if (budget === 'budget-high') {
              // For high, include premium range too
              availableProducts = allProducts.filter(product =>
                product.category !== 'combos' && product.price >= 30000
              );
            } else if (budget === 'budget-medium') {
              // For medium, include high and premium
              availableProducts = allProducts.filter(product =>
                product.category !== 'combos' && product.price >= 18000
              );
            }
          }
        }
      }

      console.log('AI Fallback - Final fallback products available:', availableProducts.length);
      console.log('AI Fallback - Final fallback products:', availableProducts.map(p => ({ id: p.id, name: p.name, category: p.category, price: p.price })));
    }

    // Add variety - shuffle products based on user answers + time for variety
    if (availableProducts.length > 0) {
      const answerHash = answers.map(a => a.value).join('-');
      const timeSeed = Math.floor(Date.now() / 10000); // Changes every 10 seconds
      const seed = answerHash.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) + timeSeed;
      availableProducts.sort((a, b) => {
        const aHash = (a.id.charCodeAt(0) + seed) % availableProducts.length;
        const bHash = (b.id.charCodeAt(0) + seed) % availableProducts.length;
        return aHash - bHash;
      });
      console.log('AI Fallback - Shuffled products with time-based seed:', timeSeed);
    }

    // Limit to 3 products but ensure variety
    const fallbackProducts = availableProducts.slice(0, 3);
    console.log('AI Fallback - Final Products Selected:', fallbackProducts.map(p => ({ id: p.id, name: p.name, category: p.category })));
    console.log('=== AI FALLBACK DEBUG END ===');

    // Get combo products with valid images only if we have regular products
    let comboProducts: any[] = [];
    if (fallbackProducts.length < 3) {
      const comboProductsRaw = this.productLoader.getProductsWithValidImagesByCategory('combos')
        .filter(combo => combo.featured)
        .slice(0, 1);

      // Convert Product objects to Combo objects for compatibility
      comboProducts = comboProductsRaw.map(product => ({
        id: product.id,
        name: product.name,
        description: product.description,
        price: product.price,
        originalPrice: product.discount ? product.price * (1 + product.discount.percentage / 100) : product.price,
        images: product.images,
        category: product.category,
        tags: product.tags,
        stock: product.stock,
        featured: product.featured,
        sku: product.sku,
        createdAt: product.createdAt,
        updatedAt: product.updatedAt,
        discount: product.discount,
        // For combo products, we'll simulate the products array using tags
        products: product.tags.map((tag, index) => ({
          id: `${product.id}_${index}`,
          quantity: 1,
          product: {
            id: `${product.id}_${index}`,
            name: tag,
            description: `Producto ${tag} del combo ${product.name}`,
            price: product.price / product.tags.length,
            images: product.images,
            category: product.category,
            tags: [tag],
            stock: product.stock,
            featured: false,
            sku: `${product.sku}_${index}`,
            createdAt: product.createdAt,
            updatedAt: product.updatedAt
          } as Product
        }))
      }));
    }

    return {
      id: `rec_${Date.now()}`,
      products: fallbackProducts,
      combos: comboProducts,
      reasoning: this.generateReasoning(answers),
      confidence: 0.75,
      answers,
      createdAt: new Date()
    };
  }

  /**
   * Generate reasoning for fallback recommendations
   */
  private generateReasoning(answers: UserAnswer[]): string {
    const reasoning: string[] = [];

    const productType = answers.find(a => a.questionId === 'q1')?.value;
    const budget = answers.find(a => a.questionId === 'q2')?.value;
    const concern = answers.find(a => a.questionId === 'q3')?.value;

    if (productType) {
      const productTypeMap: { [key: string]: string } = {
        'skincare': 'cuidado facial (skincare)',
        'makeup': 'maquillaje',
        'haircare': 'cuidado del cabello',
        'bodycare': 'cuidado corporal'
      };
      reasoning.push(`Basado en tu interés en ${productTypeMap[productType]}`);
    }

    if (budget) {
      const budgetMap: { [key: string]: string } = {
        'budget-low': 'rango económico ($8k-$15k)',
        'budget-medium': 'rango estándar ($18k-$25k)',
        'budget-high': 'rango premium ($30k-$42k)',
        'budget-premium': 'rango de lujo ($42k+)'
      };
      reasoning.push(`con presupuesto en el ${budgetMap[budget]}`);
    }

    if (concern) {
      const concernMap: { [key: string]: string } = {
        'hydration': 'hidratación',
        'anti-aging': 'anti-envejecimiento',
        'acne-oily': 'control de acné y grasa',
        'sensitive': 'piel sensible'
      };
      reasoning.push(`para tratar ${concernMap[concern]}`);
    }

    return reasoning.join(', ') + '. Estos productos son perfectos para tus necesidades.';
  }

  /**
   * Get question text for prompt
   */
  private getQuestionText(questionId: string): string {
    const questions: { [key: string]: string } = {
      'q1': 'Tipo de producto',
      'q2': 'Presupuesto',
      'q3': 'Preocupación principal',
      'q4': 'Tipo de piel',
      'q5': 'Preferencia de ingredientes'
    };
    return questions[questionId] || questionId;
  }

  /**
   * Get answer text for prompt
   */
  private getAnswerText(questionId: string, value: string): string {
    const answerMaps: { [key: string]: { [key: string]: string } } = {
      'q1': {
        'skincare': 'Cuidado facial (skincare)',
        'makeup': 'Maquillaje',
        'haircare': 'Cuidado del cabello',
        'bodycare': 'Cuidado corporal'
      },
      'q2': {
        'budget-low': '$8.000 - $15.000 (Económico)',
        'budget-medium': '$18.000 - $25.000 (Estándar)',
        'budget-high': '$30.000 - $42.000 (Premium)',
        'budget-premium': '$42.000+ (Lujo)'
      },
      'q3': {
        'hydration': 'Hidratación',
        'anti-aging': 'Anti-envejecimiento',
        'acne-oily': 'Acné/Grasa',
        'sensitive': 'Sensibilidad'
      },
      'q4': {
        'dry': 'Piel seca',
        'oily': 'Piel grasa',
        'combination': 'Piel mixta',
        'normal': 'Piel normal'
      },
      'q5': {
        'natural': 'Naturales/Orgánicos',
        'dermatological': 'Dermatológicos',
        'vegan': 'Veganos',
        'no-preference': 'Sin preferencia'
      }
    };
    return answerMaps[questionId]?.[value] || value;
  }
}