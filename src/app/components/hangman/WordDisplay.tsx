/**
 * Reusable Word Display Component for Hangman
 */

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
  className 
}: WordDisplayProps) {
  return (
    <div className={`flex flex-col items-center ${className}`}>
      {showHint && hint && (
        <p className="text-sm text-[#8B4513] mb-4 bg-[#FFB6C1]/30 px-3 py-1 rounded-full">
          Hint: {hint}
        </p>
      )}
      <div className="flex gap-2 flex-wrap justify-center">
        {word.split('').map((char, i) => {
          const isRevealed = revealedWord[i] !== '_' && revealedWord[i] !== '';
          return (
            <div 
              key={i} 
              className="w-10 h-12 border-b-4 border-[#654321] flex items-center justify-center text-2xl font-bold text-[#654321]"
            >
              {isRevealed ? char : ''}
            </div>
          );
        })}
      </div>
    </div>
  );
}
