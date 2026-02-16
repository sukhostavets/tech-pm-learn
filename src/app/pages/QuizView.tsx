import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Timer, Star, XCircle, CheckCircle } from 'lucide-react';
import { Button } from '../components/ui/Button';

interface QuizViewProps {
  onComplete: (score: number) => void;
  onBack: () => void;
}

const QUESTIONS = [
  {
    id: 1,
    question: "What does SDLC stand for in software development?",
    options: [
      "Stable Development Life Cycle",
      "Software Development Life Cycle",
      "System Design Logic Code",
      "Software Deployment Live Check"
    ],
    correct: 1
  },
  {
    id: 2,
    question: "Which phase comes immediately after Planning in the SDLC?",
    options: [
      "Testing",
      "Deployment",
      "Analysis/Design",
      "Maintenance"
    ],
    correct: 2
  },
  {
    id: 3,
    question: "In our stable analogy, what does 'Refactoring' equate to?",
    options: [
      "Buying a new horse",
      "Grooming and cleaning",
      "Feeding time",
      "Racing day"
    ],
    correct: 1
  }
];

export const QuizView: React.FC<QuizViewProps> = ({ onComplete, onBack }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [showResult, setShowResult] = useState(false);

  const handleAnswer = (index: number) => {
    if (isAnswered) return;
    setSelectedOption(index);
    setIsAnswered(true);

    if (index === QUESTIONS[currentQuestion].correct) {
      setScore(score + 1);
    }

    setTimeout(() => {
      if (currentQuestion < QUESTIONS.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedOption(null);
        setIsAnswered(false);
      } else {
        setShowResult(true);
      }
    }, 1500);
  };

  if (showResult) {
    return (
      <div className="min-h-screen bg-[#FFFDD0] flex items-center justify-center p-4">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white p-8 rounded-3xl shadow-xl border-4 border-[#FF69B4] text-center max-w-lg w-full"
        >
          <div className="w-24 h-24 bg-[#FFD700] rounded-full mx-auto flex items-center justify-center mb-6 shadow-lg">
            <Star className="w-12 h-12 text-white fill-current" />
          </div>
          <h2 className="text-3xl font-bold text-[#8B4513] mb-2 font-heading">Quiz Complete!</h2>
          <p className="text-[#654321] text-lg mb-6">
            You scored {score} out of {QUESTIONS.length}!
          </p>
          <div className="flex justify-center gap-4">
            <Button variant="outline" onClick={onBack}>Back to Map</Button>
            <Button onClick={() => onComplete(score)}>Claim Reward</Button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFFDD0] flex flex-col items-center justify-center p-4 relative">
      {/* Header Stats */}
      <div className="absolute top-6 w-full max-w-4xl flex justify-between px-4">
        <div className="bg-white px-4 py-2 rounded-full shadow-sm border border-[#FFB6C1] flex items-center gap-2 text-[#8B4513]">
          <Timer className="w-5 h-5 text-[#FF69B4]" />
          <span className="font-bold font-mono">04:32</span>
        </div>
        <div className="bg-white px-4 py-2 rounded-full shadow-sm border border-[#FFD700] flex items-center gap-2 text-[#8B4513]">
          <Star className="w-5 h-5 text-[#FFD700] fill-current" />
          <span className="font-bold">Potential XP: 150</span>
        </div>
      </div>

      {/* Question Card */}
      <div className="w-full max-w-2xl">
        <div className="mb-8 text-center">
          <span className="text-[#FF69B4] font-bold uppercase tracking-widest text-sm">Question {currentQuestion + 1}/{QUESTIONS.length}</span>
          <div className="w-full bg-[#E5E5E5] h-2 rounded-full mt-2 overflow-hidden">
            <motion.div 
              className="h-full bg-[#FF69B4]" 
              initial={{ width: 0 }}
              animate={{ width: `${((currentQuestion + 1) / QUESTIONS.length) * 100}%` }}
            />
          </div>
        </div>

        <motion.div
          key={currentQuestion}
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -20, opacity: 0 }}
          className="bg-white p-8 rounded-3xl shadow-lg border-2 border-[#D2B48C] relative"
        >
          <h2 className="text-2xl font-bold text-[#654321] mb-8 font-heading text-center">
            {QUESTIONS[currentQuestion].question}
          </h2>

          <div className="space-y-4">
            {QUESTIONS[currentQuestion].options.map((option, idx) => {
              const isSelected = selectedOption === idx;
              const isCorrect = idx === QUESTIONS[currentQuestion].correct;
              
              let buttonStyle = "border-2 border-[#D2B48C] hover:bg-[#FFFDD0] hover:border-[#8B4513]";
              let icon = null;

              if (isAnswered) {
                if (isCorrect) {
                  buttonStyle = "bg-[#98FF98]/20 border-[#98FF98] text-[#006400]";
                  icon = <CheckCircle className="w-5 h-5 text-[#006400]" />;
                } else if (isSelected && !isCorrect) {
                  buttonStyle = "bg-[#FF7F50]/20 border-[#FF7F50] text-[#8B0000]";
                  icon = <XCircle className="w-5 h-5 text-[#8B0000]" />;
                } else {
                  buttonStyle = "opacity-50 border-gray-200";
                }
              } else if (isSelected) {
                buttonStyle = "border-[#FF69B4] bg-[#FFF0F5] ring-2 ring-[#FF69B4] ring-offset-2";
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleAnswer(idx)}
                  disabled={isAnswered}
                  className={`w-full p-4 rounded-xl text-left font-medium transition-all flex justify-between items-center ${buttonStyle}`}
                >
                  <span>{option}</span>
                  {icon}
                </button>
              );
            })}
          </div>

          {/* Horse Reaction Placeholder */}
          <div className="absolute -bottom-24 -right-12 pointer-events-none">
            {isAnswered ? (
               selectedOption === QUESTIONS[currentQuestion].correct ? (
                 <motion.div 
                   initial={{ y: 20, opacity: 0 }} 
                   animate={{ y: 0, opacity: 1 }}
                   className="bg-white p-3 rounded-2xl shadow-lg border-2 border-[#98FF98] flex items-center gap-2"
                 >
                   <span className="text-2xl">🐴</span> <span className="font-bold text-[#006400]">Great job!</span>
                 </motion.div>
               ) : (
                 <motion.div 
                   initial={{ y: 20, opacity: 0 }} 
                   animate={{ y: 0, opacity: 1 }}
                   className="bg-white p-3 rounded-2xl shadow-lg border-2 border-[#FF7F50] flex items-center gap-2"
                 >
                   <span className="text-2xl">🐴</span> <span className="font-bold text-[#8B0000]">Oops! Try again next time.</span>
                 </motion.div>
               )
            ) : null}
          </div>
        </motion.div>
      </div>
    </div>
  );
};
