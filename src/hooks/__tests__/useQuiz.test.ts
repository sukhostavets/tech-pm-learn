import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useQuiz } from '../useQuiz';
import { createMockQuestions } from '../../test/test-utils';

describe('useQuiz', () => {
  const mockQuestions = createMockQuestions(3);

  it('should initialize with first question', () => {
    const { result } = renderHook(() => useQuiz({ questions: mockQuestions }));

    expect(result.current.currentQuestion).toEqual(mockQuestions[0]);
    expect(result.current.currentQuestionIndex).toBe(0);
    expect(result.current.score).toBe(0);
    expect(result.current.isAnswered).toBe(false);
    expect(result.current.showResult).toBe(false);
  });

  it('should allow selecting an option', () => {
    const { result } = renderHook(() => useQuiz({ questions: mockQuestions }));

    act(() => {
      result.current.selectOption(1);
    });

    expect(result.current.selectedOption).toBe(1);
    expect(result.current.isAnswered).toBe(false);
  });

  it('should not allow selecting an option after answering', () => {
    const { result } = renderHook(() => useQuiz({ questions: mockQuestions }));

    act(() => {
      result.current.selectOption(1);
      result.current.checkAnswer();
      result.current.selectOption(2);
    });

    expect(result.current.selectedOption).toBe(1); // Should remain unchanged
  });

  it('should increment score for correct answer', () => {
    const { result } = renderHook(() => useQuiz({ questions: mockQuestions }));

    const firstQuestion = mockQuestions[0];
    if (!firstQuestion) return;

    act(() => {
      result.current.selectOption(firstQuestion.correct);
      result.current.checkAnswer();
    });

    expect(result.current.score).toBe(1);
    expect(result.current.isAnswered).toBe(true);
  });

  it('should not increment score for incorrect answer', () => {
    const { result } = renderHook(() => useQuiz({ questions: mockQuestions }));

    const firstQuestion = mockQuestions[0];
    if (!firstQuestion) return;

    const wrongAnswer = firstQuestion.correct === 0 ? 1 : 0;

    act(() => {
      result.current.selectOption(wrongAnswer);
      result.current.checkAnswer();
    });

    expect(result.current.score).toBe(0);
    expect(result.current.isAnswered).toBe(true);
  });

  it('should move to next question', () => {
    const { result } = renderHook(() => useQuiz({ questions: mockQuestions }));

    act(() => {
      result.current.selectOption(0);
      result.current.checkAnswer();
      result.current.nextQuestion();
    });

    expect(result.current.currentQuestionIndex).toBe(1);
    expect(result.current.currentQuestion).toEqual(mockQuestions[1]);
    expect(result.current.selectedOption).toBe(null);
    expect(result.current.isAnswered).toBe(false);
  });

  it('should show result on last question', () => {
    const { result } = renderHook(() => useQuiz({ questions: mockQuestions }));

    // Answer all questions
    act(() => {
      for (let i = 0; i < mockQuestions.length; i++) {
        result.current.selectOption(0);
        result.current.checkAnswer();
        if (i < mockQuestions.length - 1) {
          result.current.nextQuestion();
        }
      }
    });

    // On last question, nextQuestion should show result
    act(() => {
      result.current.nextQuestion();
    });

    expect(result.current.showResult).toBe(true);
    expect(result.current.result).not.toBe(null);
    if (result.current.result) {
      expect(result.current.result.totalQuestions).toBe(3);
    }
  });

  it('should calculate progress correctly', () => {
    const { result } = renderHook(() => useQuiz({ questions: mockQuestions }));

    expect(result.current.progress).toBe(0);

    act(() => {
      result.current.selectOption(0);
      result.current.checkAnswer();
      result.current.nextQuestion();
    });

    expect(result.current.progress).toBeCloseTo(33.33, 1);
  });

  it('should determine if last question correctly', () => {
    const { result } = renderHook(() => useQuiz({ questions: mockQuestions }));

    expect(result.current.isLastQuestion).toBe(false);

    act(() => {
      result.current.selectOption(0);
      result.current.checkAnswer();
      result.current.nextQuestion();
      result.current.selectOption(0);
      result.current.checkAnswer();
      result.current.nextQuestion();
    });

    expect(result.current.isLastQuestion).toBe(true);
  });

  it('should calculate passing score correctly', () => {
    const { result } = renderHook(() => 
      useQuiz({ questions: mockQuestions, passingScore: 2 })
    );

    act(() => {
      // Answer all questions correctly
      for (let i = 0; i < mockQuestions.length; i++) {
        const question = mockQuestions[i];
        if (!question) continue;
        result.current.selectOption(question.correct);
        result.current.checkAnswer();
        if (i < mockQuestions.length - 1) {
          result.current.nextQuestion();
        }
      }
      result.current.nextQuestion();
    });

    if (result.current.result) {
      expect(result.current.result.passed).toBe(true);
      expect(result.current.result.passingScore).toBe(2);
    }
  });

  it('should use default passing score if not provided', () => {
    const { result } = renderHook(() => useQuiz({ questions: mockQuestions }));

    act(() => {
      for (let i = 0; i < mockQuestions.length; i++) {
        const question = mockQuestions[i];
        if (!question) continue;
        result.current.selectOption(question.correct);
        result.current.checkAnswer();
        if (i < mockQuestions.length - 1) {
          result.current.nextQuestion();
        }
      }
      result.current.nextQuestion();
    });

    // Default is 67% of questions, so 2 out of 3
    if (result.current.result) {
      expect(result.current.result.passingScore).toBe(2);
    }
  });

  it('should reset quiz state', () => {
    const { result } = renderHook(() => useQuiz({ questions: mockQuestions }));

    const firstQuestion = mockQuestions[0];
    if (!firstQuestion) return;

    act(() => {
      result.current.selectOption(firstQuestion.correct);
      result.current.checkAnswer();
      result.current.nextQuestion();
    });

    expect(result.current.currentQuestionIndex).toBe(1);
    expect(result.current.score).toBeGreaterThan(0);

    act(() => {
      result.current.reset();
    });

    expect(result.current.currentQuestionIndex).toBe(0);
    expect(result.current.score).toBe(0);
    expect(result.current.selectedOption).toBe(null);
    expect(result.current.isAnswered).toBe(false);
    expect(result.current.showResult).toBe(false);
  });
});
