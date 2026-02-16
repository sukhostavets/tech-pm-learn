/**
 * Reusable Game Overlay Component for Hangman
 */

import { motion } from 'motion/react';
import { Button } from '../ui/Button';
import type { HangmanGameStatus } from '../../../lib/types';

interface GameOverlayProps {
  gameStatus: HangmanGameStatus;
  word: string;
  onNext?: () => void;
  onQuit?: () => void;
  className?: string;
}

export function GameOverlay({ 
  gameStatus, 
  word, 
  onNext, 
  onQuit,
  className 
}: GameOverlayProps) {
  if (gameStatus === 'playing') {
    return null;
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-sm z-20 ${className}`}
    >
      <div className="bg-[#FFFDD0] p-8 rounded-xl border-4 border-[#FF69B4] text-center shadow-2xl max-w-sm">
        <h3 className="text-3xl font-bold mb-2">
          {gameStatus === 'won' ? '🎉 Stable Safe!' : '🍂 Oh no!'}
        </h3>
        <p className="text-[#8B4513] mb-6">
          {gameStatus === 'won' 
            ? `You guessed ${word} correctly!` 
            : `The word was ${word}. The rider fell off!`}
        </p>
        <div className="flex gap-4 justify-center">
          {onNext && (
            <Button onClick={onNext}>
              {gameStatus === 'won' ? 'Next Level' : 'Try Again'}
            </Button>
          )}
          {onQuit && (
            <Button variant="outline" onClick={onQuit}>
              Quit
            </Button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
