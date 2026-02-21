interface HangmanVisualProps {
  wrongGuesses: number;
  maxWrongGuesses?: number;
  className?: string;
}

export function HangmanVisual({
  wrongGuesses,
  maxWrongGuesses = 6,
  className,
}: HangmanVisualProps) {
  const isLost = wrongGuesses >= maxWrongGuesses;

  return (
    <div className={`relative ${className}`}>
      <svg viewBox="0 0 100 90" className="w-36 h-36 sm:w-44 sm:h-44">
        {/* gallows */}
        <line x1="15" y1="85" x2="85" y2="85" stroke="#a0845c" strokeWidth="3" strokeLinecap="round" />
        <line x1="35" y1="85" x2="35" y2="10" stroke="#a0845c" strokeWidth="3" strokeLinecap="round" />
        <line x1="35" y1="10" x2="70" y2="10" stroke="#a0845c" strokeWidth="3" strokeLinecap="round" />
        <line x1="70" y1="10" x2="70" y2="21" stroke="#a0845c" strokeWidth="2" strokeLinecap="round" />
        <line x1="35" y1="22" x2="47" y2="10" stroke="#a0845c" strokeWidth="2" strokeLinecap="round" />

        {/* head */}
        <g className={`transition-opacity duration-300 ${wrongGuesses > 0 ? 'opacity-100' : 'opacity-0'}`}>
          <circle cx="70" cy="30" r="9" stroke="#e85d75" fill="none" strokeWidth="2.5" />
          <circle cx="67" cy="28" r="1.2" fill="#e85d75" />
          <circle cx="73" cy="28" r="1.2" fill="#e85d75" />
          {isLost ? (
            <path d="M66 34 Q70 31 74 34" stroke="#e85d75" strokeWidth="1.5" fill="none" />
          ) : (
            <path d="M66 33 Q70 36 74 33" stroke="#e85d75" strokeWidth="1.5" fill="none" />
          )}
        </g>

        {/* body */}
        <line
          x1="70" y1="39" x2="70" y2="60"
          stroke="#e85d75" strokeWidth="2.5" strokeLinecap="round"
          className={`transition-opacity duration-300 ${wrongGuesses > 1 ? 'opacity-100' : 'opacity-0'}`}
        />

        {/* left arm */}
        <line
          x1="70" y1="45" x2="58" y2="55"
          stroke="#e85d75" strokeWidth="2.5" strokeLinecap="round"
          className={`transition-opacity duration-300 ${wrongGuesses > 2 ? 'opacity-100' : 'opacity-0'}`}
        />

        {/* right arm */}
        <line
          x1="70" y1="45" x2="82" y2="55"
          stroke="#e85d75" strokeWidth="2.5" strokeLinecap="round"
          className={`transition-opacity duration-300 ${wrongGuesses > 3 ? 'opacity-100' : 'opacity-0'}`}
        />

        {/* left leg */}
        <line
          x1="70" y1="60" x2="58" y2="76"
          stroke="#e85d75" strokeWidth="2.5" strokeLinecap="round"
          className={`transition-opacity duration-300 ${wrongGuesses > 4 ? 'opacity-100' : 'opacity-0'}`}
        />

        {/* right leg */}
        <line
          x1="70" y1="60" x2="82" y2="76"
          stroke="#e85d75" strokeWidth="2.5" strokeLinecap="round"
          className={`transition-opacity duration-300 ${wrongGuesses > 5 ? 'opacity-100' : 'opacity-0'}`}
        />
      </svg>
    </div>
  );
}
