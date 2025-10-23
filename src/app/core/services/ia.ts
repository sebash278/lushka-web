import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { AIQuestion, AIOption, UserAnswer, AIRecommendation, AIState } from '../../shared/models';
import { Product, Combo } from '../../shared/models';

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
        { id: 'opt1', text: '$20.000 - $50.000', value: 'budget-low' },
        { id: 'opt2', text: '$50.000 - $150.000', value: 'budget-medium' },
        { id: 'opt3', text: '$150.000 - $300.000', value: 'budget-high' },
        { id: 'opt4', text: '$300.000+', value: 'budget-premium' }
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

  constructor() {
    this.initializeAI();
  }

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
   * Generar recomendación basada en las respuestas
   */
  private generateRecommendation(answers: UserAnswer[]): void {
    // Indicar que se está cargando
    this.aiStateSubject.next({
      ...this.aiStateSubject.value,
      isLoading: true
    });

    // Simular tiempo de procesamiento
    setTimeout(() => {
      const recommendation = this.createRecommendation(answers);

      const finalState: AIState = {
        currentQuestion: null,
        answers,
        recommendation,
        isCompleted: true,
        isLoading: false
      };

      this.aiStateSubject.next(finalState);
    }, 1500); // Simular 1.5 segundos de procesamiento
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
    // Lógica simplificada - en producción esto podría conectar a un backend con ML
    const productType = answers.find(a => a.questionId === 'q1')?.value;
    const budget = answers.find(a => a.questionId === 'q2')?.value;
    const concern = answers.find(a => a.questionId === 'q3')?.value;
    const skinType = answers.find(a => a.questionId === 'q4')?.value;
    const ingredientType = answers.find(a => a.questionId === 'q5')?.value;

    // Productos recomendados (simulados)
    const products: Product[] = [];
    const combos: Combo[] = [];

    // Ejemplo de productos skincare basados en respuestas
    if (productType === 'skincare' && budget === 'budget-medium') {
      products.push(
        {
          id: 'skincare1',
          name: 'Sérum Hidratante de Ácido Hialurónico',
          description: 'Hidratación profunda para piel normal a seca',
          price: 85000,
          images: ['serum1.jpg'],
          category: 'skincare',
          tags: ['hydration', 'serum', 'hyaluronic-acid'],
          stock: 25,
          featured: true,
          sku: 'SK-HA-SERUM-30',
          createdAt: new Date(),
          updatedAt: new Date()
        }
      );
    }

    if (productType === 'skincare' && concern === 'anti-aging') {
      products.push(
        {
          id: 'skincare2',
          name: 'Crema Anti-Edad con Retinol',
          description: 'Reduce arrugas y líneas de expresión',
          price: 125000,
          images: ['cream1.jpg'],
          category: 'skincare',
          tags: ['anti-aging', 'retinol', 'night-cream'],
          stock: 18,
          featured: true,
          sku: 'SK-RETINOL-50',
          createdAt: new Date(),
          updatedAt: new Date()
        }
      );
    }

    if (productType === 'makeup' && skinType === 'oily') {
      products.push(
        {
          id: 'makeup1',
          name: 'Base Mate Control Grasa',
          description: 'Acabado mate y control de brillo para piel grasa',
          price: 95000,
          images: ['foundation1.jpg'],
          category: 'makeup',
          tags: ['foundation', 'matte', 'oil-control'],
          stock: 30,
          featured: true,
          sku: 'MU-FND-MATE-30',
          createdAt: new Date(),
          updatedAt: new Date()
        }
      );
    }

    if (productType === 'haircare' && concern === 'hydration') {
      products.push(
        {
          id: 'haircare1',
          name: 'Mascarilla Capilar Hidratante',
          description: 'Nutrición intensiva para cabello seco y dañado',
          price: 65000,
          images: ['mask1.jpg'],
          category: 'haircare',
          tags: ['hair-mask', 'hydration', 'repair'],
          stock: 22,
          featured: true,
          sku: 'HC-MASK-HYD-200',
          createdAt: new Date(),
          updatedAt: new Date()
        }
      );
    }

    // Ejemplo de combos de belleza
    if (productType === 'skincare') {
      combos.push(
        {
          id: 'combo1',
          name: 'Kit Skincare Básico',
          description: 'Limpiador + Tónico + Hidratante',
          price: 180000,
          originalPrice: 220000,
          images: ['combo1.jpg'],
          products: [],
          category: 'combos',
          tags: ['skincare', 'routine', 'starter-kit'],
          stock: 15,
          featured: true,
          sku: 'COMBO-SKIN-BASIC',
          createdAt: new Date(),
          updatedAt: new Date()
        }
      );
    }

    if (productType === 'makeup') {
      combos.push(
        {
          id: 'combo2',
          name: 'Kit Makeup Natural',
          description: 'Base + Corrector + Máscara + Labial',
          price: 150000,
          originalPrice: 185000,
          images: ['combo2.jpg'],
          products: [],
          category: 'combos',
          tags: ['makeup', 'natural-look', 'complete-set'],
          stock: 12,
          featured: true,
          sku: 'COMBO-MU-NATURAL',
          createdAt: new Date(),
          updatedAt: new Date()
        }
      );
    }

    return { products, combos };
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
        'budget-low': 'rango económico',
        'budget-medium': 'rango medio',
        'budget-high': 'rango alto',
        'budget-premium': 'rango premium'
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
