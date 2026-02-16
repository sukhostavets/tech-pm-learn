/**
 * Reusable Quiz Result Component
 */

import { motion } from 'motion/react';
import { Button } from '../ui/Button';
import Confetti from 'react-confetti';
import type { QuizResult as QuizResultType } from '../../../lib/types';

interface QuizResultProps {
  result: QuizResultType;
  onReview?: () => void;
  onReturn?: () => void;
  reward?: {
    name: string;
    description: string;
    icon: string;
  };
}

export function QuizResult({ result, onReview, onReturn, reward }: QuizResultProps) {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center text-center p-4">
      {result.passed && <Confetti recycle={false} numberOfPieces={500} />}
      
      <motion.div 
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white p-8 rounded-2xl shadow-xl border-4 border-[#FF69B4] max-w-lg w-full"
      >
        <div className="text-6xl mb-4">{result.passed ? '🏆' : '🐴'}</div>
        <h2 className="text-3xl font-bold text-[#654321] mb-2">
          {result.passed ? 'Stellar Performance!' : 'Keep Practicing!'}
        </h2>
        <p className="text-[#8B4513] mb-6">
          You scored {result.score} out of {result.totalQuestions}.
          {result.passed 
            ? " You've unlocked a new horse for your stable!" 
            : " Review the lesson and try again to unlock your reward."}
        </p>
        
        {result.passed && reward && (
          <div className="mb-8 p-4 bg-[#FFFDD0] rounded-xl border border-[#D2B48C]">
            <p className="text-sm text-[#8B4513] font-bold mb-2">Unlocked Reward:</p>
            <div className="flex items-center gap-4 justify-center">
              <div className="w-16 h-16 bg-[#FFB6C1] rounded-full flex items-center justify-center text-3xl">
                {reward.icon}
              </div>
              <div className="text-left">
                <p className="font-bold text-[#654321]">{reward.name}</p>
                <p className="text-xs text-[#8B4513]">{reward.description}</p>
              </div>
            </div>
          </div>
        )}

        <div className="flex gap-4 justify-center">
          {onReview && (
            <Button variant="outline" onClick={onReview}>
              Review Lesson
            </Button>
          )}
          {onReturn && (
            <Button onClick={onReturn}>
              Return to Stable
            </Button>
          )}
        </div>
      </motion.div>
    </div>
  );
}
