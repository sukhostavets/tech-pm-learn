import { useState, useEffect, useCallback, useMemo } from 'react';
import type { HangmanWord, HangmanState, HangmanGameStatus } from '../lib/types';

interface UseHangmanOptions {
  words: readonly HangmanWord[];
  maxWrongGuesses?: number;
}

interface UseHangmanReturn {
  // State
  currentWord: HangmanWord | null;
  currentWordIndex: number;
  guessedLetters: readonly string[];
  wrongGuesses: number;
  gameStatus: HangmanGameStatus;
  
  // Computed
  isWon: boolean;
  isLost: boolean;
  isPlaying: boolean;
  revealedWord: string; // Word with guessed letters revealed
  remainingGuesses: number;
  level: number; // 1-based level number
  
  // Actions
  guessLetter: (letter: string) => void;
  nextWord: () => void;
  reset: () => void;
  resetCurrentWord: () => void;
}

export function useHangman({ 
  words, 
  maxWrongGuesses = 6 
}: UseHangmanOptions): UseHangmanReturn {
  const [state, setState] = useState<HangmanState>({
    currentWordIndex: 0,
    guessedLetters: [],
    wrongGuesses: 0,
    gameStatus: 'playing',
  });

  const currentWord = useMemo(
    () => words[state.currentWordIndex] ?? null,
    [words, state.currentWordIndex]
  );

  const level = useMemo(
    () => state.currentWordIndex + 1,
    [state.currentWordIndex]
  );

  const revealedWord = useMemo(() => {
    if (!currentWord) return '';
    
    return currentWord.word
      .split('')
      .map(char => {
        // Always reveal spaces and special characters
        if (char === ' ' || /[^A-Za-z0-9]/.test(char)) {
          return char;
        }
        // Reveal guessed letters or if game is over
        if (state.guessedLetters.includes(char) || state.gameStatus !== 'playing') {
          return char;
        }
        return '_';
      })
      .join('');
  }, [currentWord, state.guessedLetters, state.gameStatus]);

  const isWon = useMemo(
    () => state.gameStatus === 'won',
    [state.gameStatus]
  );

  const isLost = useMemo(
    () => state.gameStatus === 'lost',
    [state.gameStatus]
  );

  const isPlaying = useMemo(
    () => state.gameStatus === 'playing',
    [state.gameStatus]
  );

  const remainingGuesses = useMemo(
    () => maxWrongGuesses - state.wrongGuesses,
    [maxWrongGuesses, state.wrongGuesses]
  );

  const resetCurrentWord = useCallback(() => {
    setState(prev => ({
      ...prev,
      guessedLetters: [],
      wrongGuesses: 0,
      gameStatus: 'playing',
    }));
  }, []);

  // Reset game state when word changes
  useEffect(() => {
    resetCurrentWord();
  }, [state.currentWordIndex, resetCurrentWord]);

  // Reset to the first word when a new word list is provided.
  useEffect(() => {
    setState({
      currentWordIndex: 0,
      guessedLetters: [],
      wrongGuesses: 0,
      gameStatus: 'playing',
    });
  }, [words]);

  const guessLetter = useCallback((letter: string) => {
    setState(prev => {
      if (prev.gameStatus !== 'playing' || prev.guessedLetters.includes(letter)) {
        return prev;
      }

      if (!currentWord) return prev;

      const newGuessedLetters = [...prev.guessedLetters, letter];
      const isCorrect = currentWord.word.includes(letter);
      const newWrongGuesses = isCorrect ? prev.wrongGuesses : prev.wrongGuesses + 1;
      const isLost = newWrongGuesses >= maxWrongGuesses;
      
      // Check if won
      const isWon = currentWord.word
        .split('')
        .every((char) => {
          if (char === ' ' || /[^A-Za-z0-9]/.test(char)) return true;
          return newGuessedLetters.includes(char);
        });
      
      return {
        ...prev,
        guessedLetters: newGuessedLetters,
        wrongGuesses: newWrongGuesses,
        gameStatus: isWon ? 'won' : isLost ? 'lost' : 'playing',
      };
    });
  }, [currentWord, maxWrongGuesses]);

  const nextWord = useCallback(() => {
    setState(prev => {
      const nextIndex = prev.currentWordIndex < words.length - 1
        ? prev.currentWordIndex + 1
        : 0; // Wrap around
      
      return {
        ...prev,
        currentWordIndex: nextIndex,
      };
    });
  }, [words.length]);

  const reset = useCallback(() => {
    setState({
      currentWordIndex: 0,
      guessedLetters: [],
      wrongGuesses: 0,
      gameStatus: 'playing',
    });
  }, []);

  return {
    // State
    currentWord,
    currentWordIndex: state.currentWordIndex,
    guessedLetters: state.guessedLetters,
    wrongGuesses: state.wrongGuesses,
    gameStatus: state.gameStatus,
    
    // Computed
    isWon,
    isLost,
    isPlaying,
    revealedWord,
    remainingGuesses,
    level,
    
    // Actions
    guessLetter,
    nextWord,
    reset,
    resetCurrentWord,
  };
}
