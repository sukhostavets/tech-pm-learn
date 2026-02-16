/**
 * Hangman Words Data
 * This will be replaced with API calls when database is integrated
 */

import type { HangmanWord } from '../types';

export const HANGMAN_WORDS: readonly HangmanWord[] = [
  { word: "DATABASE", hint: "Where the stable stores its feed" },
  { word: "API", hint: "The trail connecting different stables" },
  { word: "CLOUD", hint: "The sky above the pasture" },
  { word: "SERVER", hint: "The barn that houses the horses" },
  { word: "FRONTEND", hint: "The part of the stable visitors see" }
] as const;

/**
 * Get all hangman words
 */
export function getHangmanWords(): readonly HangmanWord[] {
  return HANGMAN_WORDS;
}

/**
 * Get hangman words by difficulty (future enhancement)
 */
export function getHangmanWordsByDifficulty(_difficulty: 'easy' | 'medium' | 'hard'): readonly HangmanWord[] {
  // For now, return all words. Can be filtered by word length later
  return HANGMAN_WORDS;
}
