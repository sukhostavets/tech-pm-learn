/**
 * Hangman game-related type definitions
 */

export interface HangmanWord {
  word: string;
  hint: string;
}

export type HangmanGameStatus = 'playing' | 'won' | 'lost';

export interface HangmanState {
  currentWordIndex: number;
  guessedLetters: readonly string[];
  wrongGuesses: number;
  gameStatus: HangmanGameStatus;
}

export interface HangmanConfig {
  maxWrongGuesses: number;
  words: readonly HangmanWord[];
}
