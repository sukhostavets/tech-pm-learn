import { motion } from 'motion/react';

interface KeyboardProps {
  guessedLetters: readonly string[];
  onLetterClick: (letter: string) => void;
  word?: string;
  disabled?: boolean;
  lastGuessedLetter?: string | null;
  lastGuessCorrect?: boolean | null;
  className?: string;
}

const ROWS = ['QWERTYUIOP', 'ASDFGHJKL', 'ZXCVBNM'] as const;

export function Keyboard({
  guessedLetters,
  onLetterClick,
  word,
  disabled = false,
  lastGuessedLetter,
  lastGuessCorrect,
  className,
}: KeyboardProps) {
  return (
    <div className={`flex flex-col gap-1.5 items-center select-none ${className}`}>
      {ROWS.map((row) => (
        <div key={row} className="flex gap-1 sm:gap-1.5 justify-center">
          {row.split('').map((letter) => {
            const isGuessed = guessedLetters.includes(letter);
            const isCorrect = word?.includes(letter) ?? false;
            const isLast = lastGuessedLetter === letter;

            let base =
              'w-7 h-9 text-xs sm:w-9 sm:h-10 sm:text-sm font-semibold rounded-md transition-colors duration-150 outline-none ';

            if (isGuessed) {
              base += isCorrect
                ? 'bg-emerald-100 text-emerald-700 ring-1 ring-emerald-300 cursor-default'
                : 'bg-stone-200 text-stone-400 cursor-default';
            } else {
              base +=
                'bg-white text-[#3d2b1f] shadow-[0_2px_0_#c4a882] hover:bg-[#f5edd8] active:shadow-none active:translate-y-[2px]';
            }

            return (
              <motion.button
                key={letter}
                onClick={() => onLetterClick(letter)}
                disabled={isGuessed || disabled}
                className={base}
                animate={
                  isLast
                    ? lastGuessCorrect
                      ? { scale: [1, 1.15, 1] }
                      : { x: [0, -3, 3, -2, 2, 0] }
                    : {}
                }
                transition={{ duration: 0.22 }}
              >
                {letter}
              </motion.button>
            );
          })}
        </div>
      ))}
    </div>
  );
}
