import { TestBed } from '@angular/core/testing';
import { of, take } from 'rxjs';

import { IAService } from './ia';
import { AIState } from '../../shared/models';

describe('IAService', () => {
  let service: IAService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: []
    });
    service = TestBed.inject(IAService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('Initial State', () => {
    it('should initialize with first question', (done) => {
      service.aiState$.pipe(take(1)).subscribe(state => {
        expect(state.currentQuestion).toBeTruthy();
        expect(state.currentQuestion?.id).toBe('q1');
        expect(state.currentQuestion?.question).toContain('¿Qué tipo de producto de belleza');
        expect(state.answers).toEqual([]);
        expect(state.recommendation).toBeNull();
        expect(state.isCompleted).toBeFalse();
        expect(state.isLoading).toBeFalse();
        done();
      });
    });

    it('should have 5 predefined questions', (done) => {
      service.aiState$.pipe(take(1)).subscribe(state => {
        expect(state.currentQuestion?.totalSteps).toBe(5);
        expect(state.currentQuestion?.currentStep).toBe(1);
        expect(state.currentQuestion?.options).toHaveSize(4);
        done();
      });
    });
  });

  describe('Answer Questions', () => {
    it('should record answer and move to next question', (done) => {
      service.aiState$.pipe(take(1)).subscribe(initialState => {
        // Answer first question
        service.answerQuestion('opt2'); // Select "Maquillaje"

        // Check updated state
        setTimeout(() => {
          service.getCurrentState();
          const currentState = service.getCurrentState();
          expect(currentState.currentQuestion?.id).toBe('q2');
          expect(currentState.answers).toHaveSize(1);
          expect(currentState.answers[0].questionId).toBe('q1');
          expect(currentState.answers[0].value).toBe('makeup');
          done();
        }, 100);
      });
    });

    it('should handle invalid option ID', (done) => {
      service.aiState$.pipe(take(1)).subscribe(initialState => {
        const initialAnswers = initialState.answers.length;

        // Try to answer with invalid option
        service.answerQuestion('invalid-option');

        // Check that state hasn't changed
        setTimeout(() => {
          const currentState = service.getCurrentState();
          expect(currentState.answers.length).toBe(initialAnswers);
          done();
        }, 100);
      });
    });
  });

  describe('Navigation', () => {
    it('should go back to previous question', (done) => {
      service.aiState$.pipe(take(1)).subscribe(initialState => {
        // First answer a question
        service.answerQuestion('opt1'); // Skincare

        // Then go back
        setTimeout(() => {
          service.goBack();

          // Check state after back
          setTimeout(() => {
            const currentState = service.getCurrentState();
            expect(currentState.currentQuestion?.id).toBe('q1');
            expect(currentState.answers).toHaveSize(0);
            done();
          }, 100);
        }, 100);
      });
    });

    it('should not go back from first question', (done) => {
      service.aiState$.pipe(take(1)).subscribe(initialState => {
        // Try to go back from first question
        service.goBack();

        // Check state after short delay
        setTimeout(() => {
          const currentState = service.getCurrentState();
          expect(currentState.currentQuestion?.id).toBe('q1');
          expect(currentState.answers).toHaveSize(0);
          done();
        }, 100);
      });
    });

    it('should reset to initial state', (done) => {
      service.aiState$.pipe(take(1)).subscribe(initialState => {
        // First answer a question
        service.answerQuestion('opt1'); // Skincare

        // Then reset
        setTimeout(() => {
          service.reset();

          // Check state after reset
          setTimeout(() => {
            const currentState = service.getCurrentState();
            expect(currentState.currentQuestion?.id).toBe('q1');
            expect(currentState.answers).toHaveSize(0);
            expect(currentState.isCompleted).toBeFalse();
            expect(currentState.recommendation).toBeNull();
            done();
          }, 100);
        }, 100);
      });
    });
  });

  describe('Progress and State Helpers', () => {
    it('should calculate progress correctly', (done) => {
      service.aiState$.pipe(take(1)).subscribe(initialState => {
        expect(service.getProgress()).toBe(0);

        // Answer first question
        service.answerQuestion('opt1');

        // Check progress after answering
        setTimeout(() => {
          service.getCurrentState();
          expect(service.getProgress()).toBe(20); // 1/5 * 100
          done();
        }, 100);
      });
    });

    it('should handle canGoBack correctly', (done) => {
      service.aiState$.pipe(take(1)).subscribe(initialState => {
        expect(service.canGoBack()).toBeFalse();

        // Answer a question
        service.answerQuestion('opt1');

        // Check canGoBack after answering
        setTimeout(() => {
          service.getCurrentState();
          expect(service.canGoBack()).toBeTrue();
          done();
        }, 100);
      });
    });

    it('should handle canAdvance correctly', (done) => {
      service.aiState$.pipe(take(1)).subscribe(initialState => {
        expect(service.canAdvance()).toBeTrue();
        done();
      });
    });
  });

  describe('Recommendation Logic', () => {
    it('should generate recommendation with products and combos', (done) => {
      let completed = false;

      service.aiState$.subscribe(state => {
        // Prevent multiple calls to done
        if (completed) return;

        // Simulate answering all questions for skincare recommendation
        if (state.currentQuestion?.id === 'q1') {
          service.answerQuestion('opt1'); // Skincare
        } else if (state.currentQuestion?.id === 'q2') {
          service.answerQuestion('opt2'); // Medium budget
        } else if (state.currentQuestion?.id === 'q3') {
          service.answerQuestion('opt2'); // Anti-aging
        } else if (state.currentQuestion?.id === 'q4') {
          service.answerQuestion('opt1'); // Dry skin
        } else if (state.currentQuestion?.id === 'q5') {
          service.answerQuestion('opt2'); // Dermatological
        } else if (state.isCompleted && !completed) {
          completed = true;

          const recommendation = state.recommendation;
          if (recommendation) {
            expect(recommendation.products.length).toBeGreaterThan(0);
            expect(recommendation.combos.length).toBeGreaterThan(0);
            expect(recommendation.reasoning).toContain('cuidado facial');
            expect(recommendation.confidence).toBeGreaterThan(0.7);
            expect(recommendation.answers).toHaveSize(5);
            expect(recommendation.createdAt).toBeInstanceOf(Date);
            done();
          }
        }
      });
    });
  });

  describe('Edge Cases', () => {
    it('should handle answering when completed', (done) => {
      let testCompleted = false;

      service.aiState$.subscribe(state => {
        // Answer all questions quickly
        if (state.currentQuestion?.id === 'q1') {
          service.answerQuestion('opt1');
        } else if (state.currentQuestion?.id === 'q2') {
          service.answerQuestion('opt1');
        } else if (state.currentQuestion?.id === 'q3') {
          service.answerQuestion('opt1');
        } else if (state.currentQuestion?.id === 'q4') {
          service.answerQuestion('opt1');
        } else if (state.currentQuestion?.id === 'q5') {
          service.answerQuestion('opt1');
        } else if (state.isCompleted && !testCompleted) {
          testCompleted = true;

          // Try to answer when completed
          service.answerQuestion('opt1');

          setTimeout(() => {
            const currentState = service.getCurrentState();
            // Should still have same number of answers (not increased)
            expect(currentState.answers.length).toBe(5);
            done();
          }, 100);
        }
      });
    });
  });
});