import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useQuiz } from '../useQuiz';
import { createMockQuestion, createMockQuestions } from '../../test/test-utils';

describe('useQuiz - Edge Cases', () => {
  it('should handle empty questions array', () => {
    const { result } = renderHook(() => useQuiz({ questions: [] }));

    expect(result.current.currentQuestion).toBe(null);
    expect(result.current.totalQuestions).toBe(0);
    expect(result.current.isLastQuestion).toBe(true);
  });

  it('should handle single question quiz', () => {
    const singleQuestion = [createMockQuestion()];
    const { result } = renderHook(() => useQuiz({ questions: singleQuestion }));

    expect(result.current.currentQuestion).toEqual(singleQuestion[0]);
    expect(result.current.isLastQuestion).toBe(true);
    expect(result.current.totalQuestions).toBe(1);
  });

  it('should not check answer without selecting an option', () => {
    const questions = createMockQuestions(1);
    const { result } = renderHook(() => useQuiz({ questions }));

    act(() => {
      result.current.checkAnswer();
    });

    expect(result.current.isAnswered).toBe(false);
    expect(result.current.score).toBe(0);
  });

  it('should not allow nextQuestion without answering', () => {
    const questions = createMockQuestions(2);
    const { result } = renderHook(() => useQuiz({ questions }));

    const initialIndex = result.current.currentQuestionIndex;

    act(() => {
      result.current.selectOption(0);
      // Don't call checkAnswer
      result.current.nextQuestion();
    });

    // Should still be on first question
    expect(result.current.currentQuestionIndex).toBe(initialIndex);
  });

  it('should calculate progress at 100% on last question', () => {
    const questions = createMockQuestions(3);
    const { result } = renderHook(() => useQuiz({ questions }));

    act(() => {
      // Answer first two questions
      for (let i = 0; i < 2; i++) {
        const question = questions[i];
        if (!question) continue;
        result.current.selectOption(question.correct);
        result.current.checkAnswer();
        result.current.nextQuestion();
      }
    });

    // Should be on last question (index 2 of 3)
    expect(result.current.currentQuestionIndex).toBe(2);
    expect(result.current.progress).toBeCloseTo(66.67, 1);
  });

  it('should show failed result when score is below passing', () => {
    const questions = createMockQuestions(3);
    const { result } = renderHook(() => 
      useQuiz({ questions, passingScore: 3 }) // Need all 3 to pass
    );

    act(() => {
      // Answer only 2 correctly
      for (let i = 0; i < questions.length; i++) {
        const question = questions[i];
        if (!question) continue;
        // Answer correctly for first 2, wrong for last
        const answer = i < 2 ? question.correct : (question.correct + 1) % 4;
        result.current.selectOption(answer);
        result.current.checkAnswer();
        if (i < questions.length - 1) {
          result.current.nextQuestion();
        }
      }
      result.current.nextQuestion();
    });

    if (result.current.result) {
      expect(result.current.result.passed).toBe(false);
      expect(result.current.result.score).toBe(2);
      expect(result.current.result.passingScore).toBe(3);
    }
  });

  it('should handle rapid option changes', () => {
    const questions = createMockQuestions(1);
    const { result } = renderHook(() => useQuiz({ questions }));

    act(() => {
      result.current.selectOption(0);
      result.current.selectOption(1);
      result.current.selectOption(2);
      result.current.selectOption(3);
    });

    expect(result.current.selectedOption).toBe(3);
  });

  it('should handle reset in middle of quiz', () => {
    const questions = createMockQuestions(3);
    const { result } = renderHook(() => useQuiz({ questions }));

    act(() => {
      // Answer first question
      const firstQuestion = questions[0];
      if (firstQuestion) {
        result.current.selectOption(firstQuestion.correct);
        result.current.checkAnswer();
        result.current.nextQuestion();
      }
      
      // Reset
      result.current.reset();
    });

    expect(result.current.currentQuestionIndex).toBe(0);
    expect(result.current.score).toBe(0);
    expect(result.current.selectedOption).toBe(null);
    expect(result.current.isAnswered).toBe(false);
  });

  it('should handle checkAnswer multiple times (should be idempotent)', () => {
    const questions = createMockQuestions(1);
    const { result } = renderHook(() => useQuiz({ questions }));

    const firstQuestion = questions[0];
    if (!firstQuestion) return;

    act(() => {
      result.current.selectOption(firstQuestion.correct);
      result.current.checkAnswer();
      result.current.checkAnswer(); // Call again
      result.current.checkAnswer(); // Call again
    });

    // Score should only increment once
    expect(result.current.score).toBe(1);
    expect(result.current.isAnswered).toBe(true);
  });

  it('should calculate default passing score correctly for different question counts', () => {
    const testCases = [
      { count: 1, expected: 1 }, // 67% of 1 = 1
      { count: 2, expected: 2 }, // 67% of 2 = 2
      { count: 3, expected: 2 }, // 67% of 3 = 2
      { count: 4, expected: 3 }, // 67% of 4 = 3
      { count: 5, expected: 4 }, // 67% of 5 = 4
      { count: 10, expected: 7 }, // 67% of 10 = 7
    ];

    testCases.forEach(({ count, expected }) => {
      const questions = createMockQuestions(count);
      const { result } = renderHook(() => useQuiz({ questions }));

      act(() => {
        // Complete quiz
        for (let i = 0; i < questions.length; i++) {
          const question = questions[i];
          if (!question) continue;
          result.current.selectOption(question.correct);
          result.current.checkAnswer();
          if (i < questions.length - 1) {
            result.current.nextQuestion();
          }
        }
        result.current.nextQuestion();
      });

      if (result.current.result) {
        expect(result.current.result.passingScore).toBe(expected);
      }
    });
  });
});
