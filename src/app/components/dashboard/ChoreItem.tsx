/**
 * Reusable Daily Chore Item Component
 */

import type { DailyChore } from '../../../lib/types';

interface ChoreItemProps {
  chore: DailyChore;
  onToggle?: (choreId: string) => void;
  /** When set, click navigates instead of toggling (e.g. "Play Hangman" → game). */
  onNavigate?: () => void;
}

export function ChoreItem({ chore, onToggle, onNavigate }: ChoreItemProps) {
  const handleClick = () => {
    if (onNavigate) onNavigate();
    else onToggle?.(chore.id);
  };

  return (
    <li
      className="flex items-center gap-3 p-2 hover:bg-[#FFF8DC] rounded-lg transition-colors cursor-pointer group"
      onClick={handleClick}
    >
      <div className={`
        w-5 h-5 rounded border-2 border-[#8B4513] flex items-center justify-center transition-colors
        ${chore.completed ? 'bg-[#FF69B4]' : 'group-hover:bg-[#FF69B4]'}
      `}>
        {chore.completed && (
          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        )}
      </div>
      <div className="flex-1">
        <p className={`text-sm font-medium ${chore.completed ? 'line-through text-gray-500' : 'text-[#654321]'}`}>
          {chore.task}
        </p>
        <p className="text-xs text-[#FF69B4] font-bold">+{chore.reward}</p>
      </div>
    </li>
  );
}
