import { motion } from 'motion/react';
import { Button } from '../ui/Button';
import type { HangmanGameStatus } from '../../../lib/types';

interface GameOverlayProps {
  gameStatus: HangmanGameStatus;
  word: string;
  hint?: string;
  streak?: number;
  bestStreak?: number;
  onNext?: () => void;
  onQuit?: () => void;
  className?: string;
}

export function GameOverlay({
  gameStatus,
  word,
  hint,
  streak,
  bestStreak,
  onNext,
  onQuit,
  className,
}: GameOverlayProps) {
  if (gameStatus === 'playing') return null;

  const won = gameStatus === 'won';

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`absolute inset-0 bg-black/50 backdrop-blur-[6px] flex items-center justify-center z-20 p-4 ${className}`}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', damping: 22, stiffness: 260 }}
        className="bg-white rounded-2xl shadow-xl max-w-sm w-full p-6 text-center"
      >
        <div className="text-4xl mb-2">{won ? '🎉' : '😔'}</div>
        <h3 className="text-xl font-bold text-[#3d2b1f] mb-1">
          {won ? 'Well done!' : 'Not this time'}
        </h3>
        <p className={`text-sm text-[#7a6244] ${hint ? 'mb-1' : 'mb-5'}`}>
          {won
            ? <>You guessed <span className="font-semibold">{word}</span> correctly!</>
            : <>The word was <span className="font-semibold">{word}</span>.</>}
        </p>
        {hint && (
          <p className="text-xs text-[#a08c6e] italic mb-5">{hint}</p>
        )}

        {(streak != null || bestStreak != null) && (
          <div className="flex items-center justify-center gap-4 mb-5 text-xs text-[#7a6244]">
            {streak != null && (
              <div className="flex flex-col items-center">
                <span className="text-lg font-bold text-[#3d2b1f]">{streak}</span>
                <span>streak</span>
              </div>
            )}
            {bestStreak != null && (
              <div className="flex flex-col items-center">
                <span className="text-lg font-bold text-[#3d2b1f]">{bestStreak}</span>
                <span>best</span>
              </div>
            )}
          </div>
        )}

        <div className="flex gap-3 justify-center">
          {onNext && (
            <Button onClick={onNext}>
              {won ? 'Next word' : 'Try again'}
            </Button>
          )}
          {onQuit && (
            <Button variant="outline" onClick={onQuit}>
              Quit
            </Button>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
