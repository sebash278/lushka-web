import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { AIRecommendation, UserAnswer } from '../../shared/models';

@Injectable({
  providedIn: 'root'
})
export class GeminiAiService {
  private readonly GEMINI_API_KEY = 'AIzaSyB7wZAW5WQaRP86oPyTTz_2Lvj5uDxIJ0s';
  private readonly GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent';

  constructor(private http: HttpClient) {}

  /**
   * Generate real AI recommendations using Gemini
   */
  generateRecommendation(answers: UserAnswer[]): Observable<AIRecommendation> {
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
        // Fallback to mock recommendations if API fails
        return of(this.createFallbackRecommendation(answers));
      })
    );
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
- Si eligen budget bajo → productos entre $20-50mil
- Si eligen budget alto → productos premium $150-300mil

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
   * Fallback recommendations if AI fails
   */
  private createFallbackRecommendation(answers: UserAnswer[]): AIRecommendation {
    const productType = answers.find(a => a.questionId === 'q1')?.value || 'skincare';

    const fallbackProducts = [
      {
        id: 'fallback1',
        name: 'Sérum Vitalidad',
        description: 'Sérum hidratante con vitamina C para todo tipo de piel',
        price: 85000,
        images: ['serum-vitalidad.jpg'],
        category: productType,
        tags: ['hydration', 'vitamin-c', 'serum'],
        stock: 25,
        featured: true,
        sku: 'SK-VITA-30',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'fallback2',
        name: 'Crema Nutritiva',
        description: 'Crema facial nutritiva con ingredientes naturales',
        price: 75000,
        images: ['crema-nutritiva.jpg'],
        category: productType,
        tags: ['nutrition', 'natural', 'daily-care'],
        stock: 30,
        featured: true,
        sku: 'SK-NUTRI-50',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    return {
      id: `rec_${Date.now()}`,
      products: fallbackProducts,
      combos: [],
      reasoning: 'Recomendaciones basadas en tus preferencias de belleza',
      confidence: 0.60,
      answers,
      createdAt: new Date()
    };
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
        'budget-low': '$20.000 - $50.000',
        'budget-medium': '$50.000 - $150.000',
        'budget-high': '$150.000 - $300.000',
        'budget-premium': '$300.000+'
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