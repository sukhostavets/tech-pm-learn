/**
 * Reusable Hangman Visual Component
 */

interface HangmanVisualProps {
  wrongGuesses: number;
  className?: string;
}

export function HangmanVisual({ 
  wrongGuesses, 
  className 
}: HangmanVisualProps) {
  return (
    <div className={`w-48 h-48 bg-white rounded-xl border-2 border-[#D2B48C] relative flex items-center justify-center ${className}`}>
      <svg width="150" height="150" viewBox="0 0 100 100">
        {/* Gallows/Tree */}
        <line x1="20" y1="90" x2="80" y2="90" stroke="#8B4513" strokeWidth="4" />
        <line x1="50" y1="90" x2="50" y2="20" stroke="#8B4513" strokeWidth="4" />
        <line x1="50" y1="20" x2="80" y2="20" stroke="#8B4513" strokeWidth="4" />
        <line x1="80" y1="20" x2="80" y2="30" stroke="#8B4513" strokeWidth="2" />
        
        {/* Rider Parts */}
        {wrongGuesses > 0 && (
          <circle cx="80" cy="40" r="8" stroke="#FF69B4" fill="none" strokeWidth="2" />
        )}
        {wrongGuesses > 1 && (
          <line x1="80" y1="48" x2="80" y2="70" stroke="#FF69B4" strokeWidth="2" />
        )}
        {wrongGuesses > 2 && (
          <line x1="80" y1="55" x2="70" y2="65" stroke="#FF69B4" strokeWidth="2" />
        )}
        {wrongGuesses > 3 && (
          <line x1="80" y1="55" x2="90" y2="65" stroke="#FF69B4" strokeWidth="2" />
        )}
        {wrongGuesses > 4 && (
          <line x1="80" y1="70" x2="70" y2="85" stroke="#FF69B4" strokeWidth="2" />
        )}
        {wrongGuesses > 5 && (
          <line x1="80" y1="70" x2="90" y2="85" stroke="#FF69B4" strokeWidth="2" />
        )}
      </svg>
    </div>
  );
}
