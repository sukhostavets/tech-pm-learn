/**
 * Reusable Leaderboard Item Component
 */

import type { LeaderboardEntry } from '../../../lib/types';

interface LeaderboardItemProps {
  entry: LeaderboardEntry;
}

export function LeaderboardItem({ entry }: LeaderboardItemProps) {
  const isTopThree = entry.rank <= 3;
  const isCurrentUser = entry.isCurrentUser;

  return (
    <div className="flex items-center justify-between text-sm">
      <div className="flex items-center gap-3">
        <span className={`font-bold w-4 ${isTopThree ? 'text-[#FFD700]' : 'text-gray-400'}`}>
          #{entry.rank}
        </span>
        <span className={isCurrentUser ? 'font-bold text-[#FF69B4]' : 'text-[#654321]'}>
          {entry.name}
        </span>
      </div>
      <span className="text-[#8B4513] font-mono">{entry.xp} XP</span>
    </div>
  );
}
