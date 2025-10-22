import { Product } from './product';
import { Combo } from './combo';

export interface AIQuestion {
  id: string;
  question: string;
  options: AIOption[];
  currentStep: number;
  totalSteps: number;
}

export interface AIOption {
  id: string;
  text: string;
  value: string;
  nextQuestionId?: string;
}

export interface UserAnswer {
  questionId: string;
  optionId: string;
  value: string;
  timestamp: Date;
}

export interface AIRecommendation {
  id: string;
  products: Product[];
  combos: Combo[];
  reasoning: string;
  confidence: number;
  answers: UserAnswer[];
  createdAt: Date;
}

export interface AIState {
  currentQuestion: AIQuestion | null;
  answers: UserAnswer[];
  recommendation: AIRecommendation | null;
  isCompleted: boolean;
  isLoading: boolean;
}