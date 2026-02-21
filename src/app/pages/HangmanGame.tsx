import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router';
import { Button } from '../components/ui/Button';
import { motion } from 'motion/react';
import { ArrowLeft, Flame, Trophy, Lightbulb, ChevronDown } from 'lucide-react';
import Confetti from 'react-confetti';
import { useHangman } from '../../hooks';
import { dataService } from '../../lib/services/data.service';
import type { HangmanDifficulty, HangmanWord } from '../../lib/types';
import { GameOverlay, HangmanVisual, Keyboard, WordDisplay } from '../components/hangman';

const MAX_WRONG_GUESSES = 6;
const DIFFICULTY_OPTIONS: ReadonlyArray<{ value: HangmanDifficulty | 'all'; label: string }> = [
  { value: 'easy', label: 'Easy' },
  { value: 'medium', label: 'Medium' },
  { value: 'hard', label: 'Hard' },
  { value: 'all', label: 'All' },
];

function shuffleWords(wordList: readonly HangmanWord[]): HangmanWord[] {
  const shuffled = [...wordList];
  for (let i = shuffled.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = shuffled[i]!;
    shuffled[i] = shuffled[j]!;
    shuffled[j] = temp;
  }
  return shuffled;
}

export function HangmanGame() {
  const navigate = useNavigate();
  const [allWords, setAllWords] = useState<HangmanWord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState<HangmanDifficulty | 'all'>('easy');
  const [shuffleNonce, setShuffleNonce] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [lastGuessedLetter, setLastGuessedLetter] = useState<string | null>(null);
  const [lastGuessCorrect, setLastGuessCorrect] = useState<boolean | null>(null);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);

  useEffect(() => {
    let cancelled = false;
    Promise.all([
      dataService.getHangmanWords(),
      dataService.getHangmanStreak(),
    ])
      .then(([words, streakData]) => {
        if (cancelled) return;
        setAllWords([...words]);
        setCurrentStreak(streakData.streak);
        setBestStreak(streakData.bestStreak);
      })
      .catch((e) => {
        if (!cancelled) setError(e instanceof Error ? e.message : 'Failed to load words');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, []);

  const availableWords = useMemo(() => {
    if (selectedDifficulty === 'all') return allWords;
    return allWords.filter((word) => word.difficulty === selectedDifficulty);
  }, [allWords, selectedDifficulty]);

  const wordsForSession = useMemo(
    () => shuffleWords(availableWords),
    [availableWords, shuffleNonce]
  );

  const {
    currentWord,
    currentWordIndex,
    guessedLetters,
    wrongGuesses,
    gameStatus,
    revealedWord,
    isPlaying,
    isWon,
    isLost,
    guessLetter,
    nextWord,
    resetCurrentWord,
  } = useHangman({
    words: wordsForSession,
    maxWrongGuesses: MAX_WRONG_GUESSES,
  });

  const resetTransientUi = useCallback(() => {
    setShowHint(false);
    setLastGuessedLetter(null);
    setLastGuessCorrect(null);
  }, []);

  const completedChoreOnWinRef = useRef(false);
  const previousStatusRef = useRef(gameStatus);

  useEffect(() => {
    const previousStatus = previousStatusRef.current;
    if (previousStatus === gameStatus) return;

    if (previousStatus === 'playing' && gameStatus === 'won') {
      setCurrentStreak((prev) => {
        const next = prev + 1;
        setBestStreak((best) => {
          const newBest = Math.max(best, next);
          dataService.saveHangmanStreak(next, newBest).catch(() => {});
          return newBest;
        });
        return next;
      });
    }

    if (previousStatus === 'playing' && gameStatus === 'lost') {
      setCurrentStreak(0);
      setBestStreak((best) => {
        dataService.saveHangmanStreak(0, best).catch(() => {});
        return best;
      });
    }

    previousStatusRef.current = gameStatus;
  }, [gameStatus]);

  useEffect(() => {
    if (!isWon || completedChoreOnWinRef.current) return;
    completedChoreOnWinRef.current = true;
    dataService
      .getDailyChores()
      .then((chores) => {
        const hangmanChore = chores.find((c) =>
          c.task.toLowerCase().includes('hangman')
        );
        if (hangmanChore) return dataService.completeChore(hangmanChore.id);
      })
      .catch((e) => console.error('Complete Hangman chore', e));
  }, [isWon]);

  const handleGuess = useCallback((rawLetter: string) => {
    if (!isPlaying || !currentWord) return;
    const letter = rawLetter.toUpperCase();
    if (!/^[A-Z]$/.test(letter) || guessedLetters.includes(letter)) return;

    const isCorrect = currentWord.word.includes(letter);
    setLastGuessedLetter(letter);
    setLastGuessCorrect(isCorrect);
    guessLetter(letter);
  }, [currentWord, guessLetter, guessedLetters, isPlaying]);

  useEffect(() => {
    if (!isPlaying || !currentWord) return;
    const onKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.isContentEditable)
      ) {
        return;
      }
      const key = e.key.toUpperCase();
      if (key.length === 1 && key >= 'A' && key <= 'Z') {
        e.preventDefault();
        handleGuess(key);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [currentWord, handleGuess, isPlaying]);

  const handleNext = useCallback(() => {
    resetTransientUi();
    if (isLost) {
      resetCurrentWord();
      return;
    }
    const isLastWordInCycle = currentWordIndex >= wordsForSession.length - 1;
    if (isLastWordInCycle) {
      setShuffleNonce((prev) => prev + 1);
      return;
    }
    nextWord();
  }, [currentWordIndex, isLost, nextWord, resetCurrentWord, resetTransientUi, wordsForSession.length]);

  /* ---------- loading skeleton ---------- */
  if (loading) {
    return (
      <div className="max-w-2xl mx-auto px-4 pt-4 pb-8 space-y-6 animate-pulse">
        <div className="h-8 w-32 bg-[#e8ddc8] rounded-lg" />
        <div className="flex justify-center">
          <div className="w-36 h-36 rounded-2xl bg-[#e8ddc8]" />
        </div>
        <div className="flex justify-center gap-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="w-9 h-11 bg-[#e8ddc8] rounded" />
          ))}
        </div>
        <div className="flex flex-col gap-1.5 items-center">
          {[10, 9, 7].map((n) => (
            <div key={n} className="flex gap-1.5">
              {Array.from({ length: n }).map((_, i) => (
                <div key={i} className="w-9 h-10 bg-[#e8ddc8] rounded-md" />
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error || !allWords.length) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[40vh] gap-4">
        <p className="text-red-600">{error ?? 'No words available yet'}</p>
        <Button onClick={() => navigate('/dashboard')}>Back to Stable</Button>
      </div>
    );
  }

  if (!availableWords.length) {
    return (
      <div className="max-w-2xl mx-auto px-4 pt-6 flex flex-col items-center gap-5">
        <p className="text-[#7a6244] font-medium">No words for this difficulty.</p>
        <DifficultyPicker
          value={selectedDifficulty}
          onChange={(v) => setSelectedDifficulty(v)}
        />
      </div>
    );
  }

  if (!currentWord) return null;

  const guessDotsCount = MAX_WRONG_GUESSES;

  return (
    <div className="max-w-2xl mx-auto px-4 pt-2 pb-6 relative">
      {isWon && <Confetti recycle={false} numberOfPieces={200} />}

      {/* top bar */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-1 text-sm text-[#7a6244] hover:text-[#3d2b1f] transition-colors"
        >
          <ArrowLeft size={16} />
          <span className="hidden sm:inline">Back</span>
        </button>

        <div className="flex items-center gap-4 text-xs sm:text-sm text-[#7a6244]">
          <span className="flex items-center gap-1">
            <Flame size={14} className="text-orange-500" />
            {currentStreak}
          </span>
          <span className="flex items-center gap-1">
            <Trophy size={14} className="text-amber-500" />
            {bestStreak}
          </span>
        </div>

        <DifficultyPicker
          value={selectedDifficulty}
          onChange={(v) => {
            setSelectedDifficulty(v);
            setShuffleNonce((prev) => prev + 1);
            resetTransientUi();
          }}
        />
      </div>

      {/* game area */}
      <div className="bg-white/70 backdrop-blur rounded-2xl shadow-sm border border-[#e8ddc8] p-4 sm:p-6 relative overflow-hidden">
        {/* visual + word */}
        <div className="flex flex-col items-center gap-4 mb-6">
          <HangmanVisual wrongGuesses={wrongGuesses} maxWrongGuesses={MAX_WRONG_GUESSES} />

          {/* guess dots */}
          <div className="flex items-center gap-1.5">
            {Array.from({ length: guessDotsCount }).map((_, i) => (
              <div
                key={i}
                className={`w-2.5 h-2.5 rounded-full transition-colors duration-300 ${
                  i < wrongGuesses ? 'bg-red-400' : 'bg-[#d4c9b4]'
                }`}
              />
            ))}
          </div>

          {/* hint toggle */}
          {currentWord.hint && !showHint && (
            <button
              onClick={() => setShowHint(true)}
              className="flex items-center gap-1 text-xs text-[#a08c6e] hover:text-[#7a6244] transition-colors"
            >
              <Lightbulb size={13} />
              Show hint
            </button>
          )}

          {/* word with wrong-guess shake */}
          <motion.div
            key="word-feedback"
            animate={
              lastGuessCorrect === false
                ? { x: [0, -6, 6, -4, 4, 0] }
                : { x: 0 }
            }
            transition={{ duration: 0.25 }}
          >
            <WordDisplay
              word={currentWord.word}
              revealedWord={revealedWord}
              hint={currentWord.hint}
              showHint={showHint}
            />
          </motion.div>
        </div>

        {/* keyboard */}
        <Keyboard
          guessedLetters={guessedLetters}
          onLetterClick={handleGuess}
          word={currentWord.word}
          disabled={!isPlaying}
          lastGuessedLetter={lastGuessedLetter}
          lastGuessCorrect={lastGuessCorrect}
        />

        <GameOverlay
          gameStatus={gameStatus}
          word={currentWord.word}
          hint={currentWord.hint}
          streak={currentStreak}
          bestStreak={bestStreak}
          onNext={handleNext}
          onQuit={() => navigate('/dashboard')}
        />
      </div>
    </div>
  );
}

/* ---------- small sub-component ---------- */

function DifficultyPicker({
  value,
  onChange,
}: {
  value: HangmanDifficulty | 'all';
  onChange: (v: HangmanDifficulty | 'all') => void;
}) {
  return (
    <div className="relative inline-flex items-center">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as HangmanDifficulty | 'all')}
        className="appearance-none bg-[#f5edd8] text-[#3d2b1f] text-xs sm:text-sm font-medium pl-3 pr-7 py-1.5 rounded-lg border border-[#d4c9b4] cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#c4a882]/50"
      >
        {DIFFICULTY_OPTIONS.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
      <ChevronDown size={14} className="absolute right-2 pointer-events-none text-[#7a6244]" />
    </div>
  );
}
