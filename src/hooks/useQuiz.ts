import { useState, useCallback, useMemo } from 'react';
import type { Question, QuizState, QuizResult } from '../lib/types';

interface UseQuizOptions {
  questions: readonly Question[];
  passingScore?: number; // Minimum score to pass (default: 2/3 of questions)
}

interface UseQuizReturn {
  // State
  currentQuestion: Question | null;
  currentQuestionIndex: number;
  selectedOption: number | null;
  isAnswered: boolean;
  score: number;
  showResult: boolean;
  progress: number; // 0-100
  
  // Computed
  result: QuizResult | null;
  isLastQuestion: boolean;
  totalQuestions: number;
  
  // Actions
  selectOption: (index: number) => void;
  checkAnswer: () => void;
  nextQuestion: () => void;
  reset: () => void;
}

export function useQuiz({ 
  questions, 
  passingScore 
}: UseQuizOptions): UseQuizReturn {
  const [state, setState] = useState<QuizState>({
    currentQuestionIndex: 0,
    selectedOption: null,
    isAnswered: false,
    score: 0,
    status: 'idle',
    showResult: false,
  });

  const defaultPassingScore = Math.ceil(questions.length * 0.67);
  const requiredPassingScore = passingScore ?? defaultPassingScore;

  const currentQuestion = useMemo(
    () => questions[state.currentQuestionIndex] ?? null,
    [questions, state.currentQuestionIndex]
  );

  const isLastQuestion = useMemo(
    () => questions.length === 0 || state.currentQuestionIndex === questions.length - 1,
    [state.currentQuestionIndex, questions.length]
  );

  const progress = useMemo(
    () => (state.currentQuestionIndex / questions.length) * 100,
    [state.currentQuestionIndex, questions.length]
  );

  const result = useMemo<QuizResult | null>(() => {
    if (!state.showResult) return null;
    
    return {
      score: state.score,
      totalQuestions: questions.length,
      passed: state.score >= requiredPassingScore,
      passingScore: requiredPassingScore,
    };
  }, [state.showResult, state.score, questions.length, requiredPassingScore]);

  const selectOption = useCallback((index: number) => {
    setState(prev => {
      if (prev.isAnswered) return prev;
      
      return {
        ...prev,
        selectedOption: index,
        status: 'answering',
      };
    });
  }, []);

  const checkAnswer = useCallback(() => {
    setState(prev => {
      // Don't allow checking answer if already answered (idempotent)
      if (prev.isAnswered || !currentQuestion || prev.selectedOption === null) {
        return prev;
      }
      
      const isCorrect = prev.selectedOption === currentQuestion.correct;
      const newScore = isCorrect ? prev.score + 1 : prev.score;
      
      return {
        ...prev,
        isAnswered: true,
        score: newScore,
        status: 'answered',
      };
    });
  }, [currentQuestion]);

  const nextQuestion = useCallback(() => {
    setState(prev => {
      // Don't allow moving to next question if current question is not answered
      if (!prev.isAnswered) {
        return prev;
      }
      
      if (isLastQuestion) {
        return {
          ...prev,
          showResult: true,
          status: 'completed',
        };
      } else {
        return {
          ...prev,
          currentQuestionIndex: prev.currentQuestionIndex + 1,
          selectedOption: null,
          isAnswered: false,
          status: 'answering',
        };
      }
    });
  }, [isLastQuestion]);

  const reset = useCallback(() => {
    setState({
      currentQuestionIndex: 0,
      selectedOption: null,
      isAnswered: false,
      score: 0,
      status: 'idle',
      showResult: false,
    });
  }, []);

  return {
    // State
    currentQuestion,
    currentQuestionIndex: state.currentQuestionIndex,
    selectedOption: state.selectedOption,
    isAnswered: state.isAnswered,
    score: state.score,
    showResult: state.showResult,
    progress,
    
    // Computed
    result,
    isLastQuestion,
    totalQuestions: questions.length,
    
    // Actions
    selectOption,
    checkAnswer,
    nextQuestion,
    reset,
  };
}
