import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { motion } from 'motion/react';
import { ArrowLeft, RefreshCw } from 'lucide-react';
import Confetti from 'react-confetti';

const WORDS = [
  { word: "DATABASE", hint: "Where the stable stores its feed" },
  { word: "API", hint: "The trail connecting different stables" },
  { word: "CLOUD", hint: "The sky above the pasture" },
  { word: "SERVER", hint: "The barn that houses the horses" },
  { word: "FRONTEND", hint: "The part of the stable visitors see" }
];

export function HangmanGame() {
  const navigate = useNavigate();
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [guessedLetters, setGuessedLetters] = useState<string[]>([]);
  const [wrongGuesses, setWrongGuesses] = useState(0);
  const [gameStatus, setGameStatus] = useState<'playing' | 'won' | 'lost'>('playing');

  const currentWord = WORDS[currentWordIndex];
  const maxWrong = 6;

  useEffect(() => {
    resetGame();
  }, [currentWordIndex]);

  const resetGame = () => {
    setGuessedLetters([]);
    setWrongGuesses(0);
    setGameStatus('playing');
  };

  const handleGuess = (letter: string) => {
    if (gameStatus !== 'playing' || guessedLetters.includes(letter)) return;

    setGuessedLetters([...guessedLetters, letter]);

    if (!currentWord.word.includes(letter)) {
      const newWrong = wrongGuesses + 1;
      setWrongGuesses(newWrong);
      if (newWrong >= maxWrong) {
        setGameStatus('lost');
      }
    } else {
      const isWon = currentWord.word.split('').every(l => guessedLetters.includes(l) || l === letter);
      if (isWon) {
        setGameStatus('won');
      }
    }
  };

  const keyboard = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split('');

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 flex flex-col items-center">
      {gameStatus === 'won' && <Confetti recycle={false} numberOfPieces={200} />}
      
      <div className="w-full flex justify-between items-center mb-8">
        <Button variant="ghost" onClick={() => navigate('/dashboard')}>
          <ArrowLeft className="mr-2" /> Back to Stable
        </Button>
        <div className="bg-[#FFF8DC] px-4 py-2 rounded-lg border border-[#D2B48C] font-bold text-[#8B4513]">
          Level {currentWordIndex + 1}
        </div>
      </div>

      <Card className="w-full max-w-2xl bg-[#FFFDD0] border-4 border-[#8B4513] p-8 relative overflow-hidden">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-[#654321] mb-2">Stable Hangman</h2>
          <p className="text-[#8B4513]">Guess the tech term to save the rider!</p>
        </div>

        <div className="flex flex-col md:flex-row gap-8 items-center justify-center mb-8">
          {/* Hangman Visual - Simplified as Horseshoe/Rider */}
          <div className="w-48 h-48 bg-white rounded-xl border-2 border-[#D2B48C] relative flex items-center justify-center">
             {/* Simple SVG representation */}
             <svg width="150" height="150" viewBox="0 0 100 100">
               {/* Gallows/Tree */}
               <line x1="20" y1="90" x2="80" y2="90" stroke="#8B4513" strokeWidth="4" />
               <line x1="50" y1="90" x2="50" y2="20" stroke="#8B4513" strokeWidth="4" />
               <line x1="50" y1="20" x2="80" y2="20" stroke="#8B4513" strokeWidth="4" />
               <line x1="80" y1="20" x2="80" y2="30" stroke="#8B4513" strokeWidth="2" />
               
               {/* Rider Parts */}
               {wrongGuesses > 0 && <circle cx="80" cy="40" r="8" stroke="#FF69B4" fill="none" strokeWidth="2" />} {/* Head */}
               {wrongGuesses > 1 && <line x1="80" y1="48" x2="80" y2="70" stroke="#FF69B4" strokeWidth="2" />} {/* Body */}
               {wrongGuesses > 2 && <line x1="80" y1="55" x2="70" y2="65" stroke="#FF69B4" strokeWidth="2" />} {/* Left Arm */}
               {wrongGuesses > 3 && <line x1="80" y1="55" x2="90" y2="65" stroke="#FF69B4" strokeWidth="2" />} {/* Right Arm */}
               {wrongGuesses > 4 && <line x1="80" y1="70" x2="70" y2="85" stroke="#FF69B4" strokeWidth="2" />} {/* Left Leg */}
               {wrongGuesses > 5 && <line x1="80" y1="70" x2="90" y2="85" stroke="#FF69B4" strokeWidth="2" />} {/* Right Leg */}
             </svg>
          </div>

          {/* Word Display */}
          <div className="flex flex-col items-center">
             <p className="text-sm text-[#8B4513] mb-4 bg-[#FFB6C1]/30 px-3 py-1 rounded-full">
               Hint: {currentWord.hint}
             </p>
             <div className="flex gap-2 flex-wrap justify-center">
               {currentWord.word.split('').map((char, i) => (
                 <div key={i} className="w-10 h-12 border-b-4 border-[#654321] flex items-center justify-center text-2xl font-bold text-[#654321]">
                   {guessedLetters.includes(char) || gameStatus !== 'playing' ? char : ''}
                 </div>
               ))}
             </div>
          </div>
        </div>

        {/* Keyboard */}
        <div className="flex flex-wrap gap-2 justify-center max-w-lg mx-auto">
          {keyboard.map((letter) => {
             const isGuessed = guessedLetters.includes(letter);
             const isCorrect = currentWord.word.includes(letter);
             let btnClass = "w-10 h-10 font-bold rounded shadow-sm transition-all ";
             
             if (isGuessed) {
               btnClass += isCorrect 
                 ? "bg-[#98FF98] text-[#006400] border border-green-600 opacity-50 cursor-not-allowed" 
                 : "bg-gray-300 text-gray-500 opacity-50 cursor-not-allowed";
             } else {
               btnClass += "bg-[#D2B48C] text-[#654321] hover:bg-[#FF69B4] hover:text-white border-b-4 border-[#8B4513] active:border-b-0 active:translate-y-1";
             }

             return (
               <button
                 key={letter}
                 onClick={() => handleGuess(letter)}
                 disabled={isGuessed || gameStatus !== 'playing'}
                 className={btnClass}
               >
                 {letter}
               </button>
             );
          })}
        </div>

        {/* Game Over / Win Overlay */}
        {(gameStatus !== 'playing') && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-sm z-20"
          >
            <div className="bg-[#FFFDD0] p-8 rounded-xl border-4 border-[#FF69B4] text-center shadow-2xl max-w-sm">
              <h3 className="text-3xl font-bold mb-2">
                {gameStatus === 'won' ? '🎉 Stable Safe!' : '🍂 Oh no!'}
              </h3>
              <p className="text-[#8B4513] mb-6">
                {gameStatus === 'won' 
                  ? `You guessed ${currentWord.word} correctly!` 
                  : `The word was ${currentWord.word}. The rider fell off!`}
              </p>
              <div className="flex gap-4 justify-center">
                <Button onClick={() => {
                   if (currentWordIndex < WORDS.length - 1) {
                     setCurrentWordIndex(curr => curr + 1);
                   } else {
                     // Wrap around or finish
                     setCurrentWordIndex(0);
                   }
                }}>
                  {gameStatus === 'won' ? 'Next Level' : 'Try Again'}
                </Button>
                <Button variant="outline" onClick={() => navigate('/dashboard')}>
                  Quit
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </Card>
    </div>
  );
}
