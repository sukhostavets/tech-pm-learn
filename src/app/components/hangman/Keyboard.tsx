/**
 * Reusable Keyboard Component for Hangman
 */

interface KeyboardProps {
  guessedLetters: readonly string[];
  onLetterClick: (letter: string) => void;
  disabled?: boolean;
  className?: string;
}

const KEYBOARD_LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split('');

export function Keyboard({ 
  guessedLetters, 
  onLetterClick, 
  disabled = false,
  className 
}: KeyboardProps) {
  return (
    <div className={`flex flex-wrap gap-2 justify-center max-w-lg mx-auto ${className}`}>
      {KEYBOARD_LETTERS.map((letter) => {
        const isGuessed = guessedLetters.includes(letter);
        let btnClass = "w-10 h-10 font-bold rounded shadow-sm transition-all ";
        
        if (isGuessed) {
          btnClass += "bg-gray-300 text-gray-500 opacity-50 cursor-not-allowed";
        } else {
          btnClass += "bg-[#D2B48C] text-[#654321] hover:bg-[#FF69B4] hover:text-white border-b-4 border-[#8B4513] active:border-b-0 active:translate-y-1";
        }

        return (
          <button
            key={letter}
            onClick={() => onLetterClick(letter)}
            disabled={isGuessed || disabled}
            className={btnClass}
          >
            {letter}
          </button>
        );
      })}
    </div>
  );
}
