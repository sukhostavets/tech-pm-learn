/**
 * General game-related type definitions
 */

export interface DailyChore {
  id: string;
  task: string;
  reward: string;
  completed: boolean;
}

export interface LeaderboardEntry {
  name: string;
  xp: string | number;
  rank: number;
  isCurrentUser?: boolean;
}

export interface Reward {
  id: string;
  name: string;
  description: string;
  icon: string;
  xpValue: number;
}
