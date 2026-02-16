/**
 * Data Service Layer
 * 
 * This service layer abstracts data access and can be easily swapped
 * with API calls when database is integrated.
 * 
 * Current implementation: Uses static data
 * Future implementation: Replace with API calls
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

/**
 * API Data Service (future implementation)
 * Uncomment and implement when API is ready
 */
/*
class ApiDataService implements IDataService {
  private baseUrl = process.env.API_BASE_URL || '/api';

  async getQuestions(topic?: string): Promise<readonly Question[]> {
    const url = topic 
      ? `${this.baseUrl}/questions?topic=${topic}`
      : `${this.baseUrl}/questions`;
    const response = await fetch(url);
    return response.json();
  }

  async getHangmanWords(): Promise<readonly HangmanWord[]> {
    const response = await fetch(`${this.baseUrl}/hangman/words`);
    return response.json();
  }

  // ... implement other methods
}
*/

// Export singleton instance
export const dataService: IDataService = new StaticDataService();

// Future: Switch to API service
// export const dataService: IDataService = new ApiDataService();
