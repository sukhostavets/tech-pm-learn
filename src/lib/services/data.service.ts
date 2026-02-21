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
  Lesson,
  Resource,
} from '../types';
import { SupabaseDataService } from './supabase-data.service';

export interface IDataService {
  getQuestions(
    topic?: string,
    milestoneId?: number,
    questionType?: 'lesson_check' | 'milestone_test',
    lessonId?: number
  ): Promise<readonly Question[]>;
  getLessons(milestoneId: number): Promise<readonly Lesson[]>;
  getLessonById(lessonId: number): Promise<Lesson | null>;
  getResources(milestoneId: number): Promise<readonly Resource[]>;
  completeLesson(lessonId: number): Promise<void>;
  getHangmanWords(): Promise<readonly HangmanWord[]>;
  getMilestones(): Promise<readonly Milestone[]>;
  getMilestoneById(id: number): Promise<Milestone | null>;
  getCurrentUser(): Promise<User>;
  getHorsesCount(): Promise<{ collected: number; total: number }>;
  getUserProfile(
    userId: string
  ): Promise<User & { title?: string; horses?: unknown[]; badges?: string[] }>;
  getDailyChores(): Promise<readonly DailyChore[]>;
  getLeaderboard(limit?: number): Promise<readonly LeaderboardEntry[]>;
  getRewardById(rewardId: string): Promise<Reward | null>;
  completeChore(choreId: string): Promise<void>;

  setMilestoneInProgress(milestoneId: number): Promise<void>;
  recordQuizAttempt(params: {
    milestoneId?: number | null;
    topic: string;
    score: number;
    totalQuestions: number;
    passed: boolean;
    xpEarned?: number;
  }): Promise<void>;
  updateProfile(updates: {
    name?: string;
    stableName?: string;
    avatarUrl?: string | null;
  }): Promise<void>;
  setTutorialCompleted(): Promise<void>;
  getHangmanStreak(): Promise<{ streak: number; bestStreak: number }>;
  saveHangmanStreak(streak: number, bestStreak: number): Promise<void>;
}

export const dataService: IDataService = new SupabaseDataService();
export { SupabaseDataService };
