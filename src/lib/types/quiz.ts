/**
 * Quiz-related type definitions
 */

export interface Question {
  id: number;
  question: string;
  options: readonly string[];
  correct: number; // index of correct answer
  explanation: string;
}

export interface QuizResult {
  score: number;
  totalQuestions: number;
  passed: boolean;
  passingScore: number;
}

export type QuizStatus = 'idle' | 'answering' | 'answered' | 'completed';

export interface QuizState {
  currentQuestionIndex: number;
  selectedOption: number | null;
  isAnswered: boolean;
  score: number;
  status: QuizStatus;
  showResult: boolean;
}
