/**
 * Reusable Quiz Explanation Component
 */

import { motion } from 'motion/react';
import { AlertCircle } from 'lucide-react';
import type { Question } from '../../../lib/types';

interface QuizExplanationProps {
  question: Question;
  className?: string;
}

export function QuizExplanation({ question, className }: QuizExplanationProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`p-4 bg-[#FFFDD0] rounded-xl border border-[#D2B48C] flex gap-3 items-start ${className}`}
    >
      <div className="mt-1">
        <AlertCircle size={20} className="text-[#FF69B4]" />
      </div>
      <div>
        <p className="font-bold text-[#654321] text-sm mb-1">Explanation:</p>
        <p className="text-sm text-[#8B4513]">{question.explanation}</p>
      </div>
    </motion.div>
  );
}
