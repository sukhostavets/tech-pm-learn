/**
 * Data Service Layer
 *
 * Abstracts data access. Use SupabaseDataService when backend is connected
 * and user is (or will be) authenticated; use StaticDataService for tests
 * or unauthenticated demos.
 */

import type { Question, HangmanWord, Milestone, User, DailyChore, LeaderboardEntry, Reward } from '../types';
import {
  getQuestionsByTopic,
  getAllQuestions,
  getHangmanWords,
  getMilestones,
  getMilestoneById,
  getDailyChores,
  getLeaderboard,
  getRewardById,
  getCurrentUser,
  getUserProfile,
} from '../data';
import { SupabaseDataService } from './supabase-data.service';

export interface IDataService {
  // Questions
  getQuestions(topic?: string): Promise<readonly Question[]>;
  
  // Hangman
  getHangmanWords(): Promise<readonly HangmanWord[]>;
  
  // Milestones
  getMilestones(): Promise<readonly Milestone[]>;
  getMilestoneById(id: number): Promise<Milestone | null>;
  
  // User
  getCurrentUser(): Promise<User>;
  getUserProfile(userId: string): Promise<User & { title?: string; horses?: any[]; badges?: string[] }>;
  
  // Game
  getDailyChores(): Promise<readonly DailyChore[]>;
  getLeaderboard(limit?: number): Promise<readonly LeaderboardEntry[]>;
  getRewardById(rewardId: string): Promise<Reward | null>;
}

/**
 * Static Data Service (current implementation)
 * Uses hardcoded data from data files
 */
class StaticDataService implements IDataService {
  async getQuestions(topic?: string): Promise<readonly Question[]> {
    if (topic) {
      return getQuestionsByTopic(topic);
    }
    return getAllQuestions();
  }

  async getHangmanWords(): Promise<readonly HangmanWord[]> {
    return getHangmanWords();
  }

  async getMilestones(): Promise<readonly Milestone[]> {
    return getMilestones();
  }

  async getMilestoneById(id: number): Promise<Milestone | null> {
    const milestone = getMilestoneById(id);
    return milestone ?? null;
  }

  async getCurrentUser(): Promise<User> {
    return getCurrentUser();
  }

  async getUserProfile(userId: string): Promise<User & { title?: string; horses?: any[]; badges?: string[] }> {
    return getUserProfile(userId);
  }

  async getDailyChores(): Promise<readonly DailyChore[]> {
    return getDailyChores();
  }

  async getLeaderboard(limit = 10): Promise<readonly LeaderboardEntry[]> {
    return getLeaderboard(limit);
  }

  async getRewardById(rewardId: string): Promise<Reward | null> {
    return getRewardById(rewardId);
  }
}

const useSupabase =
  typeof import.meta.env?.VITE_SUPABASE_URL === 'string' &&
  import.meta.env.VITE_SUPABASE_URL.length > 0 &&
  typeof import.meta.env?.VITE_SUPABASE_PUBLISHABLE_KEY === 'string' &&
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY.length > 0;

export const dataService: IDataService = useSupabase
  ? new SupabaseDataService()
  : new StaticDataService();

export { StaticDataService, SupabaseDataService };
