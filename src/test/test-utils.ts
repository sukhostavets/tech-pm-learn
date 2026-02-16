/**
 * Test utilities and helpers
 */

import type { Question, HangmanWord } from '../lib/types';

/**
 * Creates a mock question for testing
 */
export function createMockQuestion(overrides?: Partial<Question>): Question {
  return {
    id: 1,
    question: 'Test question?',
    options: ['Option A', 'Option B', 'Option C', 'Option D'] as const,
    correct: 0,
    explanation: 'Test explanation',
    ...overrides,
  };
}

/**
 * Creates multiple mock questions
 */
export function createMockQuestions(count: number): Question[] {
  return Array.from({ length: count }, (_, i) =>
    createMockQuestion({
      id: i + 1,
      question: `Question ${i + 1}?`,
      correct: i % 4, // Cycle through options
    })
  );
}

/**
 * Creates a mock hangman word
 */
export function createMockHangmanWord(overrides?: Partial<HangmanWord>): HangmanWord {
  return {
    word: 'TEST',
    hint: 'Test hint',
    ...overrides,
  };
}

/**
 * Creates multiple mock hangman words
 */
export function createMockHangmanWords(count: number): HangmanWord[] {
  const words = ['TEST', 'API', 'CLOUD', 'SERVER', 'FRONTEND'];
  return Array.from({ length: count }, (_, i) =>
    createMockHangmanWord({
      word: words[i % words.length] ?? 'TEST',
      hint: `Hint for ${words[i % words.length] ?? 'TEST'}`,
    })
  );
}

/**
 * Waits for a condition to be true
 */
export function waitForCondition(
  condition: () => boolean,
  timeout = 1000,
  interval = 50
): Promise<void> {
  return new Promise((resolve, reject) => {
    const startTime = Date.now();
    const check = () => {
      if (condition()) {
        resolve();
      } else if (Date.now() - startTime > timeout) {
        reject(new Error('Condition timeout'));
      } else {
        setTimeout(check, interval);
      }
    };
    check();
  });
}
