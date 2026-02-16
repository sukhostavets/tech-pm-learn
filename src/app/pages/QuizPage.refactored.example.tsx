/**
 * Example refactored QuizPage using new hooks and types
 * This demonstrates how to use the useQuiz hook and proper types
 */

import { useNavigate } from 'react-router';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { motion } from 'motion/react';
import { CheckCircle2, XCircle, AlertCircle } from 'lucide-react';
import Confetti from 'react-confetti';
import { useQuiz } from '../../hooks/useQuiz';
import type { Question } from '../../lib/types';

// Move questions to a separate data file or constant
const QUESTIONS: readonly Question[] = [
  {
    id: 1,
    question: "Which component of the stable best represents a SQL Database?",
    options: [
      "The Riding Arena (Where actions happen)",
      "The Feed Storage (Where resources are organized and stored)",
      "The Trails (How we connect to outside)",
      "The Fence (Security layer)"
    ] as const,
    correct: 1,
    explanation: "Correct! The Feed Storage organizes resources (data) in specific bins (tables) so they can be retrieved efficiently when needed."
  },
  {
    id: 2,
    question: "If you want to ask for specific data, which command do you use?",
    options: [
      "FETCH",
      "GET",
      "SELECT",
      "GIVE"
    ] as const,
    correct: 2,
    explanation: "Correct! SELECT is the SQL command used to retrieve specific data from a database table."
  },
  {
    id: 3,
    question: "What is a 'Schema' in our stable analogy?",
    options: [
      "The blueprint of the barn layout",
      "The list of horses",
      "The schedule for feeding",
      "The lock on the door"
    ] as const,
    correct: 0,
    explanation: "Spot on! A Schema is the structural design or blueprint of the database, just like the architectural plan of your stable."
  }
] as const;

export function QuizPageRefactored() {
  const navigate = useNavigate();
  
  // Use the custom hook - all game logic is now encapsulated
  const {
    currentQuestion,
    selectedOption,
    isAnswered,
    showResult,
    progress,
    result,
    isLastQuestion,
    totalQuestions,
    selectOption,
    checkAnswer,
    nextQuestion,
  } = useQuiz({ 
    questions: QUESTIONS,
    passingScore: 2 
  });

  if (showResult && result) {
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
          
          {result.passed && (
            <div className="mb-8 p-4 bg-[#FFFDD0] rounded-xl border border-[#D2B48C]">
              <p className="text-sm text-[#8B4513] font-bold mb-2">Unlocked Reward:</p>
              <div className="flex items-center gap-4 justify-center">
                 <div className="w-16 h-16 bg-[#FFB6C1] rounded-full flex items-center justify-center text-3xl">🦄</div>
                 <div className="text-left">
                   <p className="font-bold text-[#654321]">Data Draft Horse</p>
                   <p className="text-xs text-[#8B4513]">Strong and reliable with heavy loads.</p>
                 </div>
              </div>
            </div>
          )}

          <div className="flex gap-4 justify-center">
            <Button variant="outline" onClick={() => navigate('/lesson')}>
              Review Lesson
            </Button>
            <Button onClick={() => navigate('/dashboard')}>
              Return to Stable
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  if (!currentQuestion) {
    return null;
  }

  return (
    <div className="max-w-2xl mx-auto py-12 px-4">
      <div className="mb-8 flex items-center justify-between">
         <h2 className="text-2xl font-bold text-[#654321]">Quiz: Database Basics</h2>
         <span className="text-[#8B4513] font-mono">
           Question {currentQuestion.id}/{totalQuestions}
         </span>
      </div>

      <div className="relative mb-8 h-2 bg-gray-200 rounded-full overflow-hidden">
         <div 
           className="absolute top-0 left-0 h-full bg-[#FF69B4] transition-all duration-500"
           style={{ width: `${progress}%` }}
         />
      </div>

      <Card className="min-h-[400px] flex flex-col justify-between p-6 md:p-10">
        <div>
          <h3 className="text-xl font-medium text-[#654321] mb-8 leading-relaxed">
            {currentQuestion.question}
          </h3>

          <div className="space-y-3">
            {currentQuestion.options.map((opt, idx) => {
              let stateStyles = "hover:bg-[#FFF8DC] border-[#D2B48C] bg-white";
              
              if (isAnswered) {
                if (idx === currentQuestion.correct) {
                  stateStyles = "bg-[#98FF98]/20 border-[#98FF98] text-green-800 font-bold";
                } else if (idx === selectedOption) {
                  stateStyles = "bg-red-100 border-red-300 text-red-800";
                } else {
                  stateStyles = "opacity-50 border-gray-200";
                }
              } else if (selectedOption === idx) {
                stateStyles = "bg-[#FFB6C1] border-[#FF69B4] font-bold text-[#654321]";
              }

              return (
                <button
                  key={idx}
                  onClick={() => selectOption(idx)}
                  disabled={isAnswered}
                  className={`w-full text-left p-4 rounded-xl border-2 transition-all flex items-center justify-between ${stateStyles}`}
                >
                  <span>{opt}</span>
                  {isAnswered && idx === currentQuestion.correct && (
                    <CheckCircle2 className="text-green-600" />
                  )}
                  {isAnswered && idx === selectedOption && idx !== currentQuestion.correct && (
                    <XCircle className="text-red-500" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {isAnswered && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 p-4 bg-[#FFFDD0] rounded-xl border border-[#D2B48C] flex gap-3 items-start"
          >
            <div className="mt-1"><AlertCircle size={20} className="text-[#FF69B4]" /></div>
            <div>
              <p className="font-bold text-[#654321] text-sm mb-1">Explanation:</p>
              <p className="text-sm text-[#8B4513]">{currentQuestion.explanation}</p>
            </div>
          </motion.div>
        )}

        <div className="mt-8 flex justify-end">
          {!isAnswered ? (
            <Button onClick={checkAnswer} disabled={selectedOption === null} size="lg">
              Check Answer
            </Button>
          ) : (
            <Button onClick={nextQuestion} size="lg">
              {isLastQuestion ? "Finish Quiz" : "Next Question"}
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
}
