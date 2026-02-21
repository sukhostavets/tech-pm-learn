import { motion, AnimatePresence } from 'motion/react';

interface WordDisplayProps {
  word: string;
  revealedWord: string;
  hint?: string;
  showHint?: boolean;
  className?: string;
}

export function WordDisplay({
  word,
  revealedWord,
  hint,
  showHint = true,
  className,
}: WordDisplayProps) {
  return (
    <div className={`flex flex-col items-center gap-4 ${className}`}>
      <div className="flex gap-1.5 sm:gap-2 flex-wrap justify-center">
        {word.split('').map((char, i) => {
          if (char === ' ') {
            return <div key={`sp-${i}`} className="w-3 sm:w-5" aria-hidden />;
          }

          const isRevealed = revealedWord[i] !== '_' && revealedWord[i] !== '';
          return (
            <div
              key={i}
              className="w-8 h-10 sm:w-10 sm:h-12 flex items-end justify-center pb-0.5"
            >
              <div className="w-full flex flex-col items-center">
                <AnimatePresence>
                  {isRevealed && (
                    <motion.span
                      key={`letter-${i}`}
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="text-xl sm:text-2xl font-bold text-[#3d2b1f] leading-none mb-0.5"
                    >
                      {char}
                    </motion.span>
                  )}
                </AnimatePresence>
                <div className="w-full h-0.5 rounded-full bg-[#a0845c]" />
              </div>
            </div>
          );
        })}
      </div>

      <AnimatePresence>
        {showHint && hint && (
          <motion.p
            key="hint"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="text-xs sm:text-sm text-[#7a6244] italic max-w-xs text-center"
          >
            {hint}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
