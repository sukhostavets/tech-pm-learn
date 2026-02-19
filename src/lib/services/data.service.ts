/**
 * Data Service Layer
 *
 * Uses Supabase for all data access. Requires Supabase env and authenticated
 * user for user-specific data.
 */

import type {
  Question,
  HangmanWord,
  Milestone,
  User,
  DailyChore,
  LeaderboardEntry,
  Reward,
} from '../types';
import { SupabaseDataService } from './supabase-data.service';

export interface IDataService {
  getQuestions(topic?: string): Promise<readonly Question[]>;
  getHangmanWords(): Promise<readonly HangmanWord[]>;
  getMilestones(): Promise<readonly Milestone[]>;
  getMilestoneById(id: number): Promise<Milestone | null>;
  getCurrentUser(): Promise<User>;
  getUserProfile(
    userId: string
  ): Promise<User & { title?: string; horses?: unknown[]; badges?: string[] }>;
  getDailyChores(): Promise<readonly DailyChore[]>;
  getLeaderboard(limit?: number): Promise<readonly LeaderboardEntry[]>;
  getRewardById(rewardId: string): Promise<Reward | null>;
  completeChore(choreId: string): Promise<void>;
}

export const dataService: IDataService = new SupabaseDataService();
export { SupabaseDataService };
