/**
 * Game-related data (chores, leaderboard, rewards)
 * This will be replaced with API calls when database is integrated
 */

import type { DailyChore, LeaderboardEntry, Reward } from '../types';

export const DAILY_CHORES: readonly DailyChore[] = [
  { id: "chore-1", task: "Complete 'SQL Joins' Quiz", reward: "50 XP", completed: false },
  { id: "chore-2", task: "Review Flashcards", reward: "20 XP", completed: false },
  { id: "chore-3", task: "Pet your horse", reward: "10 XP", completed: false }
] as const;

export const LEADERBOARD: readonly LeaderboardEntry[] = [
  { name: "Sarah J.", xp: "12,450", rank: 1 },
  { name: "Mike T.", xp: "11,200", rank: 2 },
  { name: "You", xp: "2,450", rank: 145, isCurrentUser: true },
] as const;

export const REWARDS: Record<string, Reward> = {
  'data-draft-horse': {
    id: 'data-draft-horse',
    name: 'Data Draft Horse',
    description: 'Strong and reliable with heavy loads.',
    icon: '🦄',
    xpValue: 500
  }
} as const;

/**
 * Get daily chores
 * TODO: Replace with API call
 */
export async function getDailyChores(): Promise<readonly DailyChore[]> {
  return Promise.resolve(DAILY_CHORES);
}

/**
 * Get leaderboard
 * TODO: Replace with API call
 */
export async function getLeaderboard(limit = 10): Promise<readonly LeaderboardEntry[]> {
  return Promise.resolve(LEADERBOARD.slice(0, limit));
}

/**
 * Get reward by ID
 * TODO: Replace with API call
 */
export async function getRewardById(rewardId: string): Promise<Reward | null> {
  return Promise.resolve(REWARDS[rewardId] ?? null);
}
