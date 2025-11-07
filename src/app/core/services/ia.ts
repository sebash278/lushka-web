import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { AIQuestion, AIOption, UserAnswer, AIRecommendation, AIState } from '../../shared/models';
import { Product, Combo, ComboProduct } from '../../shared/models';
import { ProductLoaderService } from '../../features/catalog/services/product-loader.service';
import { GeminiAiService } from './gemini-ai.service';

@Injectable({
  providedIn: 'root'
})
export class IAService {
  private aiStateSubject = new BehaviorSubject<AIState>({
    currentQuestion: null,
    answers: [],
    recommendation: null,
    isCompleted: false,
    isLoading: false
  });

  public aiState$ = this.aiStateSubject.asObservable();

  constructor(
    private productLoader: ProductLoaderService,
    private geminiAiService: GeminiAiService
  ) {
    this.initializeAI();
  }

  // Preguntas predefinidas del cuestionario para productos de belleza
  private readonly questions: AIQuestion[] = [
    {
      id: 'q1',
      question: '¿Qué tipo de producto de belleza estás buscando?',
      currentStep: 1,
      totalSteps: 5,
      options: [
        { id: 'opt1', text: 'Skincare (Cuidado facial)', value: 'skincare' },
        { id: 'opt2', text: 'Maquillaje', value: 'makeup' },
        { id: 'opt3', text: 'Cuidado del cabello', value: 'haircare' },
        { id: 'opt4', text: 'Cuidado corporal', value: 'bodycare' }
      ]
    },
    {
      id: 'q2',
      question: '¿Cuál es tu presupuesto principal?',
      currentStep: 2,
      totalSteps: 5,
      options: [
        { id: 'opt1', text: '$8.000 - $15.000 (Económico)', value: 'budget-low' },
        { id: 'opt2', text: '$18.000 - $25.000 (Estándar)', value: 'budget-medium' },
        { id: 'opt3', text: '$30.000 - $42.000 (Premium)', value: 'budget-high' },
        { id: 'opt4', text: '$42.000+ (Lujo)', value: 'budget-premium' }
      ]
    },
    {
      id: 'q3',
      question: '¿Cuál es tu principal preocupación o necesidad?',
      currentStep: 3,
      totalSteps: 5,
      options: [
        { id: 'opt1', text: 'Hidratación', value: 'hydration' },
        { id: 'opt2', text: 'Anti-envejecimiento', value: 'anti-aging' },
        { id: 'opt3', text: 'Acné/Grasa', value: 'acne-oily' },
        { id: 'opt4', text: 'Sensibilidad', value: 'sensitive' }
      ]
    },
    {
      id: 'q4',
      question: '¿Qué tipo de piel tienes?',
      currentStep: 4,
      totalSteps: 5,
      options: [
        { id: 'opt1', text: 'Seca', value: 'dry' },
        { id: 'opt2', text: 'Grasa', value: 'oily' },
        { id: 'opt3', text: 'Mixta', value: 'combination' },
        { id: 'opt4', text: 'Normal', value: 'normal' }
      ]
    },
    {
      id: 'q5',
      question: '¿Qué tipo de ingredientes prefieres?',
      currentStep: 5,
      totalSteps: 5,
      options: [
        { id: 'opt1', text: 'Naturales/Orgánicos', value: 'natural' },
        { id: 'opt2', text: 'Dermatológicos', value: 'dermatological' },
        { id: 'opt3', text: 'Veganos', value: 'vegan' },
        { id: 'opt4', text: 'Sin preferencia', value: 'no-preference' }
      ]
    }
  ];

  
  /**
   * Inicializar el sistema de IA
   */
  private initializeAI(): void {
    if (this.questions.length > 0) {
      const initialState: AIState = {
        currentQuestion: this.questions[0],
        answers: [],
        recommendation: null,
        isCompleted: false,
        isLoading: false
      };
      this.aiStateSubject.next(initialState);
    }
  }

  /**
   * Obtener el estado actual de la IA
   */
  public getCurrentState(): AIState {
    return this.aiStateSubject.value;
  }

  /**
   * Responder a la pregunta actual
   */
  public answerQuestion(optionId: string): void {
    const currentState = this.aiStateSubject.value;

    if (!currentState.currentQuestion || currentState.isCompleted) {
      return;
    }

    const selectedOption = currentState.currentQuestion.options.find(opt => opt.id === optionId);
    if (!selectedOption) {
      return;
    }

    const newAnswer: UserAnswer = {
      questionId: currentState.currentQuestion.id,
      optionId: selectedOption.id,
      value: selectedOption.value,
      timestamp: new Date()
    };

    const updatedAnswers = [...currentState.answers, newAnswer];
    const nextQuestionIndex = this.questions.findIndex(q => q.id === currentState.currentQuestion!.id) + 1;

    if (nextQuestionIndex >= this.questions.length) {
      // Todas las preguntas respondidas - generar recomendación
      this.generateRecommendation(updatedAnswers);
    } else {
      // Continuar a la siguiente pregunta
      const nextState: AIState = {
        ...currentState,
        currentQuestion: this.questions[nextQuestionIndex],
        answers: updatedAnswers
      };
      this.aiStateSubject.next(nextState);
    }
  }

  /**
   * Retroceder a la pregunta anterior
   */
  public goBack(): void {
    const currentState = this.aiStateSubject.value;

    if (currentState.answers.length === 0) {
      return; // No hay retroceder más
    }

    if (currentState.isCompleted) {
      // Si está completado, volver a la última pregunta
      const lastAnswer = currentState.answers[currentState.answers.length - 1];
      const previousQuestionIndex = this.questions.findIndex(q => q.id === lastAnswer.questionId);
      const previousAnswers = currentState.answers.slice(0, -1);

      const nextState: AIState = {
        currentQuestion: this.questions[previousQuestionIndex],
        answers: previousAnswers,
        recommendation: null,
        isCompleted: false,
        isLoading: false
      };
      this.aiStateSubject.next(nextState);
    } else {
      // Retroceder una respuesta
      const previousAnswers = currentState.answers.slice(0, -1);
      const previousQuestionIndex = currentState.answers.length - 1;

      const nextState: AIState = {
        ...currentState,
        currentQuestion: this.questions[previousQuestionIndex],
        answers: previousAnswers
      };
      this.aiStateSubject.next(nextState);
    }
  }

  /**
   * Reiniciar el cuestionario
   */
  public reset(): void {
    this.initializeAI();
  }

  /**
   * Generar recomendación basada en las respuestas usando IA real
   */
  private generateRecommendation(answers: UserAnswer[]): void {
    // Indicar que se está cargando
    this.aiStateSubject.next({
      ...this.aiStateSubject.value,
      isLoading: true
    });

    // Usar IA real de Gemini
    this.geminiAiService.generateRecommendation(answers).subscribe({
      next: (recommendation) => {
        const finalState: AIState = {
          currentQuestion: null,
          answers,
          recommendation,
          isCompleted: true,
          isLoading: false
        };

        this.aiStateSubject.next(finalState);
      },
      error: (error) => {
        console.error('Error en generación de recomendación:', error);
        // Fallback a recomendación simulada
        const fallbackRecommendation = this.createRecommendation(answers);

        const finalState: AIState = {
          currentQuestion: null,
          answers,
          recommendation: fallbackRecommendation,
          isCompleted: true,
          isLoading: false
        };

        this.aiStateSubject.next(finalState);
      }
    });
  }

  /**
   * Crear recomendación basada en lógica de negocio
   */
  private createRecommendation(answers: UserAnswer[]): AIRecommendation {
    const recommendations = this.getProductRecommendations(answers);

    return {
      id: `rec_${Date.now()}`,
      products: recommendations.products,
      combos: recommendations.combos,
      reasoning: this.generateReasoning(answers),
      confidence: this.calculateConfidence(answers),
      answers,
      createdAt: new Date()
    };
  }

  /**
   * Obtener recomendaciones de productos basadas en las respuestas
   */
  private getProductRecommendations(answers: UserAnswer[]): { products: Product[], combos: Combo[] } {
    const productType = answers.find(a => a.questionId === 'q1')?.value;
    const budget = answers.find(a => a.questionId === 'q2')?.value;
    const concern = answers.find(a => a.questionId === 'q3')?.value;
    const skinType = answers.find(a => a.questionId === 'q4')?.value;
    const ingredientType = answers.find(a => a.questionId === 'q5')?.value;

    // Obtener productos del servicio centralizado que tienen imágenes válidas
    const allProducts = this.productLoader.getProductsWithValidImages();
    let recommendedProducts = this.filterProductsByAnswers(allProducts, answers);

    // Limitar a máximo 4 productos recomendados
    recommendedProducts = recommendedProducts.slice(0, 4);

    // Generar combos (simulados por ahora, ya que no tenemos un servicio de combos)
    const combos = this.generateCombos(productType, recommendedProducts);

    return { products: recommendedProducts, combos };
  }

  /**
   * Filtrar productos basados en las respuestas del cuestionario
   */
  private filterProductsByAnswers(products: Product[], answers: UserAnswer[]): Product[] {
    const productType = answers.find(a => a.questionId === 'q1')?.value;
    const budget = answers.find(a => a.questionId === 'q2')?.value;
    const concern = answers.find(a => a.questionId === 'q3')?.value;
    const skinType = answers.find(a => a.questionId === 'q4')?.value;
    const ingredientType = answers.find(a => a.questionId === 'q5')?.value;

    let filteredProducts = [...products];

    // Filtrar por tipo de producto
    if (productType) {
      const categoryMap: { [key: string]: string[] } = {
        'skincare': ['facial'],
        'makeup': ['facial'], // Facial products include makeup-like items
        'haircare': ['capilar'],
        'bodycare': ['corporal'],
        'combos': ['combos']
      };

      const relevantCategories = categoryMap[productType] || [];
      if (relevantCategories.length > 0) {
        filteredProducts = filteredProducts.filter(p => relevantCategories.includes(p.category));
      }
    }

    // Filtrar por presupuesto
    if (budget) {
      const budgetRanges: { [key: string]: { min: number, max: number } } = {
        'budget-low': { min: 8000, max: 15000 },
        'budget-medium': { min: 18000, max: 25000 },
        'budget-high': { min: 30000, max: 42000 },
        'budget-premium': { min: 42000, max: Infinity }
      };

      const range = budgetRanges[budget];
      if (range) {
        filteredProducts = filteredProducts.filter(p =>
          p.price >= range.min && p.price <= range.max
        );
      }
    }

    // Filtrar por preocupación/concern usando tags
    if (concern) {
      const concernTags: { [key: string]: string[] } = {
        'hydration': ['hidratación', 'hidratante'],
        'anti-aging': ['anti-envejecimiento', 'anti-edad'],
        'acne-oily': ['purificación', 'poros', 'grasa'],
        'sensitive': ['sensible', 'suave']
      };

      const relevantTags = concernTags[concern] || [];
      if (relevantTags.length > 0) {
        filteredProducts = filteredProducts.filter(p =>
          relevantTags.some(tag =>
            p.tags.some(productTag =>
              productTag.toLowerCase().includes(tag.toLowerCase()) ||
              tag.toLowerCase().includes(productTag.toLowerCase())
            )
          )
        );
      }
    }

    // Priorizar productos destacados
    filteredProducts.sort((a, b) => {
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      return 0;
    });

    return filteredProducts;
  }

  /**
   * Generar combos basados en productos recomendados y respuestas del usuario
   */
  private generateCombos(productType: string | undefined, products: Product[]): Combo[] {
    const allCombos = this.productLoader.getProductsWithValidImagesByCategory('combos');
    let recommendedCombos: Combo[] = [];

    // Convert Product objects to Combo objects for compatibility
    const comboProducts: Combo[] = allCombos.map(product => ({
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

    // Filtrar combos basados en el tipo de producto seleccionado
    if (productType) {
      const categoryMap: { [key: string]: string[] } = {
        'skincare': ['facial'],
        'makeup': ['facial'],
        'haircare': ['capilar'],
        'bodycare': ['corporal'],
        'combos': ['combos']
      };

      const relevantCategories = categoryMap[productType] || [];
      recommendedCombos = comboProducts.filter(combo =>
        relevantCategories.includes(combo.category) ||
        relevantCategories.some(cat => combo.tags.some(tag => tag.toLowerCase().includes(cat.toLowerCase())))
      );
    } else {
      // Si no hay tipo específico, mostrar combos destacados
      recommendedCombos = comboProducts.filter(combo => combo.featured);
    }

    // Priorizar combos que coinciden con productos recomendados por categoría
    if (products.length > 0) {
      const productCategories = [...new Set(products.map(p => p.category))];
      const combosWithScore = recommendedCombos.map(combo => ({
        ...combo,
        relevanceScore: productCategories.includes(combo.category) ? 2 : 0
      }));

      combosWithScore.sort((a, b) => (b.relevanceScore || 0) - (a.relevanceScore || 0));

      // Remove the temporary relevanceScore and return clean combos
      recommendedCombos = combosWithScore.map(({ relevanceScore, ...combo }) => combo) as Combo[];
    }

    // Limitar a máximo 2 combos recomendados
    return recommendedCombos.slice(0, 2);
  }

  /**
   * Generar explicación de las recomendaciones
   */
  private generateReasoning(answers: UserAnswer[]): string {
    const reasoning: string[] = [];

    const productType = answers.find(a => a.questionId === 'q1')?.value;
    const budget = answers.find(a => a.questionId === 'q2')?.value;
    const concern = answers.find(a => a.questionId === 'q3')?.value;
    const skinType = answers.find(a => a.questionId === 'q4')?.value;

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

    if (skinType) {
      const skinTypeMap: { [key: string]: string } = {
        'dry': 'piel seca',
        'oily': 'piel grasa',
        'combination': 'piel mixta',
        'normal': 'piel normal'
      };
      reasoning.push(`adecuados para ${skinTypeMap[skinType]}`);
    }

    return reasoning.join(', ') + '. Estos productos cumplen con tus criterios principales.';
  }

  /**
   * Calcular confianza de las recomendaciones
   */
  private calculateConfidence(answers: UserAnswer[]): number {
    // Lógica simplificada para calcular confianza
    let confidence = 0.75; // Base confidence

    // Aumentar confianza si hay respuestas específicas
    const hasSpecificIngredient = answers.some(a => a.value !== 'no-preference');
    if (hasSpecificIngredient) confidence += 0.10;

    const hasSpecificBudget = answers.some(a => a.questionId === 'q2');
    if (hasSpecificBudget) confidence += 0.10;

    const hasSpecificConcern = answers.some(a => a.questionId === 'q3');
    if (hasSpecificConcern) confidence += 0.05;

    return Math.min(confidence, 0.90); // Máximo 90% para beauty products
  }

  /**
   * Obtener progreso actual (porcentaje)
   */
  public getProgress(): number {
    const currentState = this.aiStateSubject.value;
    if (currentState.isCompleted) return 100;

    const totalQuestions = this.questions.length;
    const answeredQuestions = currentState.answers.length;
    return (answeredQuestions / totalQuestions) * 100;
  }

  /**
   * Verificar si puede retroceder
   */
  public canGoBack(): boolean {
    const currentState = this.aiStateSubject.value;
    return currentState.answers.length > 0;
  }

  /**
   * Verificar si puede avanzar
   */
  public canAdvance(): boolean {
    const currentState = this.aiStateSubject.value;
    return !currentState.isLoading && !currentState.isCompleted;
  }
}
