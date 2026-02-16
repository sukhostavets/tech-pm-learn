import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useHangman } from '../useHangman';
import { createMockHangmanWord, createMockHangmanWords } from '../../test/test-utils';

describe('useHangman - Edge Cases', () => {
  it('should handle empty words array', () => {
    const { result } = renderHook(() => useHangman({ words: [] }));

    expect(result.current.currentWord).toBe(null);
    expect(result.current.revealedWord).toBe('');
  });

  it('should handle single word', () => {
    const singleWord = [createMockHangmanWord({ word: 'TEST' })];
    const { result } = renderHook(() => useHangman({ words: singleWord }));

    expect(result.current.currentWord).toEqual(singleWord[0]);
    expect(result.current.level).toBe(1);
  });

  it('should handle words with multiple occurrences of same letter', () => {
    const { result } = renderHook(() => 
      useHangman({ words: [{ word: 'TEST', hint: 'Test' }] })
    );

    act(() => {
      result.current.guessLetter('T');
    });

    expect(result.current.revealedWord).toBe('T__T');
    expect(result.current.guessedLetters).toContain('T');
    expect(result.current.guessedLetters.filter(l => l === 'T').length).toBe(1);
  });

  it('should handle case sensitivity correctly', () => {
    const { result } = renderHook(() => 
      useHangman({ words: [{ word: 'Test', hint: 'Test' }] })
    );

    act(() => {
      result.current.guessLetter('T');
      result.current.guessLetter('e');
      result.current.guessLetter('s');
      result.current.guessLetter('t');
    });

    expect(result.current.gameStatus).toBe('won');
    expect(result.current.revealedWord).toBe('Test');
  });

  it('should handle maxWrongGuesses of 1', () => {
    const { result } = renderHook(() => 
      useHangman({ 
        words: [{ word: 'TEST', hint: 'Test' }], 
        maxWrongGuesses: 1 
      })
    );

    act(() => {
      result.current.guessLetter('X');
    });

    expect(result.current.gameStatus).toBe('lost');
    expect(result.current.wrongGuesses).toBe(1);
    expect(result.current.isLost).toBe(true);
  });

  it('should handle winning on last possible guess', () => {
    const { result } = renderHook(() => 
      useHangman({ 
        words: [{ word: 'TEST', hint: 'Test' }], 
        maxWrongGuesses: 4 
      })
    );

    act(() => {
      result.current.guessLetter('X'); // Wrong
      result.current.guessLetter('Y'); // Wrong
      result.current.guessLetter('Z'); // Wrong
      result.current.guessLetter('T'); // Correct
      result.current.guessLetter('E'); // Correct
      result.current.guessLetter('S'); // Correct - should win
    });

    expect(result.current.gameStatus).toBe('won');
    expect(result.current.wrongGuesses).toBe(3);
    expect(result.current.isWon).toBe(true);
  });

  it('should not allow guessing after game is won', () => {
    const { result } = renderHook(() => 
      useHangman({ words: [{ word: 'TEST', hint: 'Test' }] })
    );

    act(() => {
      result.current.guessLetter('T');
      result.current.guessLetter('E');
      result.current.guessLetter('S');
      // Game should be won now
      result.current.guessLetter('X'); // Should not be processed
    });

    expect(result.current.gameStatus).toBe('won');
    expect(result.current.guessedLetters).not.toContain('X');
  });

  it('should not allow guessing after game is lost', () => {
    const { result } = renderHook(() => 
      useHangman({ 
        words: [{ word: 'TEST', hint: 'Test' }], 
        maxWrongGuesses: 2 
      })
    );

    act(() => {
      result.current.guessLetter('X');
      result.current.guessLetter('Y');
      // Game should be lost now
      result.current.guessLetter('T'); // Should not be processed
    });

    expect(result.current.gameStatus).toBe('lost');
    expect(result.current.guessedLetters).not.toContain('T');
  });

  it('should handle wrapping around words array', () => {
    const words = createMockHangmanWords(3);
    const { result } = renderHook(() => useHangman({ words }));

    act(() => {
      result.current.nextWord(); // 0 -> 1
      result.current.nextWord(); // 1 -> 2
      result.current.nextWord(); // 2 -> 0 (wrap)
      result.current.nextWord(); // 0 -> 1
    });

    expect(result.current.currentWordIndex).toBe(1);
    expect(result.current.currentWord).toEqual(words[1]);
  });

  it('should reset current word state when moving to next word', () => {
    const words = [
      { word: 'TEST', hint: 'Test 1' },
      { word: 'API', hint: 'Test 2' },
    ];
    const { result } = renderHook(() => useHangman({ words }));

    act(() => {
      result.current.guessLetter('T');
      result.current.guessLetter('X');
      result.current.nextWord();
    });

    // Should have reset for new word
    expect(result.current.guessedLetters).toEqual([]);
    expect(result.current.wrongGuesses).toBe(0);
    expect(result.current.gameStatus).toBe('playing');
    expect(result.current.currentWordIndex).toBe(1);
  });

  it('should handle resetCurrentWord during game', () => {
    const { result } = renderHook(() => 
      useHangman({ words: [{ word: 'TEST', hint: 'Test' }] })
    );

    act(() => {
      result.current.guessLetter('T');
      result.current.guessLetter('X');
      result.current.resetCurrentWord();
    });

    expect(result.current.guessedLetters).toEqual([]);
    expect(result.current.wrongGuesses).toBe(0);
    expect(result.current.gameStatus).toBe('playing');
  });

  it('should calculate remaining guesses correctly', () => {
    const { result } = renderHook(() => 
      useHangman({ 
        words: [{ word: 'TEST', hint: 'Test' }], 
        maxWrongGuesses: 6 
      })
    );

    expect(result.current.remainingGuesses).toBe(6);

    act(() => {
      result.current.guessLetter('X');
    });

    expect(result.current.remainingGuesses).toBe(5);

    act(() => {
      result.current.guessLetter('Y');
    });

    expect(result.current.remainingGuesses).toBe(4);
  });

  it('should reveal full word when game is lost', () => {
    const { result } = renderHook(() => 
      useHangman({ 
        words: [{ word: 'TEST', hint: 'Test' }], 
        maxWrongGuesses: 1 
      })
    );

    act(() => {
      result.current.guessLetter('X'); // Wrong guess, lose game
    });

    expect(result.current.gameStatus).toBe('lost');
    expect(result.current.revealedWord).toBe('TEST'); // Full word revealed
  });

  it('should handle words with spaces and special characters', () => {
    const { result } = renderHook(() => 
      useHangman({ words: [{ word: 'TEST WORD', hint: 'Test' }] })
    );

    act(() => {
      result.current.guessLetter('T');
      result.current.guessLetter(' ');
      result.current.guessLetter('W');
    });

    // 'TEST WORD' = T E S T [space] W O R D
    // After guessing T, space, W: T__T _W___
    expect(result.current.revealedWord).toBe('T__T W___');
  });

  it('should handle very long words', () => {
    const longWord = 'A'.repeat(20);
    const { result } = renderHook(() => 
      useHangman({ words: [{ word: longWord, hint: 'Test' }] })
    );

    act(() => {
      result.current.guessLetter('A');
    });

    expect(result.current.revealedWord).toBe(longWord);
    expect(result.current.gameStatus).toBe('won');
  });

  it('should handle single letter words', () => {
    const { result } = renderHook(() => 
      useHangman({ words: [{ word: 'A', hint: 'Test' }] })
    );

    act(() => {
      result.current.guessLetter('A');
    });

    expect(result.current.gameStatus).toBe('won');
    expect(result.current.revealedWord).toBe('A');
  });
});
