/**
 * Reusable Quiz Option Button Component
 */

import { CheckCircle2, XCircle } from 'lucide-react';
import type { Question } from '../../../lib/types';

interface QuizOptionProps {
  option: string;
  index: number;
  question: Question;
  isSelected: boolean;
  isAnswered: boolean;
  onClick: () => void;
}

export function QuizOption({ 
  option, 
  index, 
  question, 
  isSelected, 
  isAnswered, 
  onClick 
}: QuizOptionProps) {
  const isCorrect = index === question.correct;
  const isWrong = isSelected && !isCorrect;

  let stateStyles = "hover:bg-[#FFF8DC] border-[#D2B48C] bg-white";
  
  if (isAnswered) {
    if (isCorrect) {
      stateStyles = "bg-[#98FF98]/20 border-[#98FF98] text-green-800 font-bold";
    } else if (isWrong) {
      stateStyles = "bg-red-100 border-red-300 text-red-800";
    } else {
      stateStyles = "opacity-50 border-gray-200";
    }
  } else if (isSelected) {
    stateStyles = "bg-[#FFB6C1] border-[#FF69B4] font-bold text-[#654321]";
  }

  return (
    <button
      onClick={onClick}
      disabled={isAnswered}
      className={`w-full text-left p-4 rounded-xl border-2 transition-all flex items-center justify-between ${stateStyles}`}
    >
      <span>{option}</span>
      {isAnswered && isCorrect && <CheckCircle2 className="text-green-600" />}
      {isAnswered && isWrong && <XCircle className="text-red-500" />}
    </button>
  );
}
