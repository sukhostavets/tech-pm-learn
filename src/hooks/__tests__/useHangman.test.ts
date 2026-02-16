import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useHangman } from '../useHangman';
import { createMockHangmanWords } from '../../test/test-utils';

describe('useHangman', () => {
  const mockWords = createMockHangmanWords(3);

  it('should initialize with first word', () => {
    const { result } = renderHook(() => useHangman({ words: mockWords }));

    expect(result.current.currentWord).toEqual(mockWords[0]);
    expect(result.current.currentWordIndex).toBe(0);
    expect(result.current.guessedLetters).toEqual([]);
    expect(result.current.wrongGuesses).toBe(0);
    expect(result.current.gameStatus).toBe('playing');
  });

  it('should reveal guessed letters in word', () => {
    const { result } = renderHook(() => 
      useHangman({ words: [{ word: 'TEST', hint: 'Test hint' }] })
    );

    act(() => {
      result.current.guessLetter('T');
    });

    expect(result.current.revealedWord).toBe('T__T');
    expect(result.current.guessedLetters).toContain('T');
  });

  it('should increment wrong guesses for incorrect letter', () => {
    const { result } = renderHook(() => 
      useHangman({ words: [{ word: 'TEST', hint: 'Test hint' }] })
    );

    act(() => {
      result.current.guessLetter('X');
    });

    expect(result.current.wrongGuesses).toBe(1);
    expect(result.current.remainingGuesses).toBe(5);
  });

  it('should not allow guessing same letter twice', () => {
    const { result } = renderHook(() => 
      useHangman({ words: [{ word: 'TEST', hint: 'Test hint' }] })
    );

    act(() => {
      result.current.guessLetter('T');
      result.current.guessLetter('T'); // Try again
    });

    expect(result.current.guessedLetters.filter(l => l === 'T').length).toBe(1);
    expect(result.current.wrongGuesses).toBe(0);
  });

  it('should not allow guessing when game is not playing', () => {
    const { result } = renderHook(() => 
      useHangman({ words: [{ word: 'TEST', hint: 'Test hint' }], maxWrongGuesses: 1 })
    );

    act(() => {
      result.current.guessLetter('X'); // Wrong guess, game should be lost
      result.current.guessLetter('Y'); // Should not be processed
    });

    expect(result.current.gameStatus).toBe('lost');
    expect(result.current.guessedLetters).not.toContain('Y');
  });

  it('should win game when all letters are guessed', () => {
    const { result } = renderHook(() => 
      useHangman({ words: [{ word: 'TEST', hint: 'Test hint' }] })
    );

    act(() => {
      result.current.guessLetter('T');
      result.current.guessLetter('E');
      result.current.guessLetter('S');
    });

    expect(result.current.gameStatus).toBe('won');
    expect(result.current.isWon).toBe(true);
    expect(result.current.revealedWord).toBe('TEST');
  });

  it('should lose game when max wrong guesses reached', () => {
    const { result } = renderHook(() => 
      useHangman({ words: [{ word: 'TEST', hint: 'Test hint' }], maxWrongGuesses: 3 })
    );

    act(() => {
      result.current.guessLetter('X');
      result.current.guessLetter('Y');
      result.current.guessLetter('Z');
    });

    expect(result.current.gameStatus).toBe('lost');
    expect(result.current.isLost).toBe(true);
    expect(result.current.wrongGuesses).toBe(3);
  });

  it('should reveal full word when game ends', () => {
    const { result } = renderHook(() => 
      useHangman({ words: [{ word: 'TEST', hint: 'Test hint' }], maxWrongGuesses: 1 })
    );

    act(() => {
      result.current.guessLetter('X'); // Wrong guess, lose game
    });

    expect(result.current.revealedWord).toBe('TEST'); // Full word revealed
  });

  it('should move to next word', () => {
    const { result } = renderHook(() => useHangman({ words: mockWords }));

    act(() => {
      result.current.nextWord();
    });

    expect(result.current.currentWordIndex).toBe(1);
    expect(result.current.currentWord).toEqual(mockWords[1]);
    expect(result.current.guessedLetters).toEqual([]); // Should reset
    expect(result.current.wrongGuesses).toBe(0);
  });

  it('should wrap around to first word after last word', () => {
    const { result } = renderHook(() => useHangman({ words: mockWords }));

    act(() => {
      result.current.nextWord(); // Move to index 1
      result.current.nextWord(); // Move to index 2
      result.current.nextWord(); // Should wrap to index 0
    });

    expect(result.current.currentWordIndex).toBe(0);
    expect(result.current.currentWord).toEqual(mockWords[0]);
  });

  it('should reset current word state', () => {
    const { result } = renderHook(() => 
      useHangman({ words: [{ word: 'TEST', hint: 'Test hint' }] })
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

  it('should reset entire game', () => {
    const { result } = renderHook(() => useHangman({ words: mockWords }));

    act(() => {
      result.current.nextWord();
      result.current.guessLetter('T');
      result.current.reset();
    });

    expect(result.current.currentWordIndex).toBe(0);
    expect(result.current.guessedLetters).toEqual([]);
    expect(result.current.wrongGuesses).toBe(0);
    expect(result.current.gameStatus).toBe('playing');
  });

  it('should calculate level correctly (1-based)', () => {
    const { result } = renderHook(() => useHangman({ words: mockWords }));

    expect(result.current.level).toBe(1);

    act(() => {
      result.current.nextWord();
    });

    expect(result.current.level).toBe(2);
  });

  it('should automatically reset when word index changes', () => {
    const { result } = renderHook(() => 
      useHangman({ words: [{ word: 'TEST', hint: 'Test' }, { word: 'API', hint: 'API hint' }] })
    );

    act(() => {
      result.current.guessLetter('T');
      result.current.guessLetter('X');
      result.current.nextWord();
    });

    // Should have reset for new word
    expect(result.current.guessedLetters).toEqual([]);
    expect(result.current.wrongGuesses).toBe(0);
    expect(result.current.gameStatus).toBe('playing');
  });
});
