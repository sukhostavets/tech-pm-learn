/**
 * Supabase Data Service
 *
 * Implements IDataService using Supabase client. Requires authenticated user
 * for user-specific data (getCurrentUser, getMilestones progress, getDailyChores completed state).
 */

import { supabase } from '../supabase';
import type {
  Question,
  HangmanWord,
  Milestone,
  User,
  DailyChore,
  LeaderboardEntry,
  Reward,
} from '../types';
import type { IDataService } from './data.service';

function getSupabase() {
  if (!supabase) throw new Error('Supabase not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY.');
  return supabase;
}

function profileToUser(row: {
  id: string;
  name: string;
  stable_name: string;
  level: number;
  xp: number;
  next_level_xp: number;
  streak: number;
  avatar_url: string | null;
  created_at: string;
}): User {
  return {
    id: row.id,
    name: row.name,
    stableName: row.stable_name,
    level: row.level,
    xp: row.xp,
    nextLevelXp: row.next_level_xp,
    streak: row.streak,
    avatarUrl: row.avatar_url ?? undefined,
    joinDate: new Date(row.created_at),
  };
}

export class SupabaseDataService implements IDataService {
  async getQuestions(topic?: string): Promise<readonly Question[]> {
    const db = getSupabase();
    let query = db.from('questions').select('id, question, options, correct_index, explanation');
    if (topic) {
      query = query.eq('topic', topic);
    }
    const { data, error } = await query.order('id');
    if (error) throw error;
    return (data ?? []).map((q) => ({
      id: q.id,
      question: q.question,
      options: (q.options as string[]) as readonly string[],
      correct: q.correct_index,
      explanation: q.explanation,
    }));
  }

  async getHangmanWords(): Promise<readonly HangmanWord[]> {
    const { data, error } = await getSupabase()
      .from('hangman_words')
      .select('word, hint')
      .order('id');
    if (error) throw error;
    return (data ?? []) as HangmanWord[];
  }

  async getMilestones(): Promise<readonly Milestone[]> {
    const db = getSupabase();
    const {
      data: { user },
    } = await db.auth.getUser();
    const { data: milestones, error: milestonesError } = await db
      .from('milestones')
      .select('id, title, topic, icon, sort_order, map_x, map_y')
      .order('sort_order');
    if (milestonesError) throw milestonesError;
    if (!milestones?.length) return [];

    if (!user) {
      return milestones.map((m) => ({
        id: m.id,
        title: m.title,
        topic: m.topic,
        icon: m.icon,
        status: 'locked' as const,
        mapX: m.map_x != null ? Number(m.map_x) : undefined,
        mapY: m.map_y != null ? Number(m.map_y) : undefined,
      }));
    }

    const { data: userProgress, error: progressError } = await db
      .from('user_milestones')
      .select('milestone_id, status, progress, completed_at')
      .eq('user_id', user.id);
    if (progressError) throw progressError;
    const progressByMilestone = new Map(
      (userProgress ?? []).map((p) => [p.milestone_id, p])
    );

    return milestones.map((m) => {
      const p = progressByMilestone.get(m.id);
      return {
        id: m.id,
        title: m.title,
        topic: m.topic,
        icon: m.icon,
        status: (p?.status ?? 'locked') as Milestone['status'],
        progress: p?.progress ?? 0,
        completedAt: p?.completed_at ? new Date(p.completed_at) : undefined,
        mapX: m.map_x != null ? Number(m.map_x) : undefined,
        mapY: m.map_y != null ? Number(m.map_y) : undefined,
      };
    });
  }

  async getMilestoneById(id: number): Promise<Milestone | null> {
    const db = getSupabase();
    const { data: milestone, error: milestoneError } = await db
      .from('milestones')
      .select('id, title, topic, icon, sort_order, map_x, map_y')
      .eq('id', id)
      .single();
    if (milestoneError || !milestone) return null;

    const {
      data: { user },
    } = await db.auth.getUser();
    let status: Milestone['status'] = 'locked';
    let progress = 0;
    let completedAt: Date | undefined;

    if (user) {
      const { data: up } = await db
        .from('user_milestones')
        .select('status, progress, completed_at')
        .eq('user_id', user.id)
        .eq('milestone_id', id)
        .maybeSingle();
      if (up) {
        status = up.status as Milestone['status'];
        progress = up.progress ?? 0;
        completedAt = up.completed_at ? new Date(up.completed_at) : undefined;
      }
    }

    return {
      id: milestone.id,
      title: milestone.title,
      topic: milestone.topic,
      icon: milestone.icon,
      status,
      progress,
      completedAt,
      mapX: milestone.map_x != null ? Number(milestone.map_x) : undefined,
      mapY: milestone.map_y != null ? Number(milestone.map_y) : undefined,
    };
  }

  async getCurrentUser(): Promise<User> {
    const db = getSupabase();
    const {
      data: { user },
    } = await db.auth.getUser();
    if (!user) throw new Error('Not authenticated');
    const { data: profile, error } = await db
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();
    if (error) throw error;
    if (!profile) throw new Error('Profile not found');
    return profileToUser(profile);
  }

  async getUserProfile(
    userId: string
  ): Promise<User & { title?: string; horses?: unknown[]; badges?: string[] }> {
    const db = getSupabase();
    const { data: profile, error: profileError } = await db
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    if (profileError || !profile) throw profileError ?? new Error('Profile not found');
    const user = profileToUser(profile);

    const { data: userHorses } = await db
      .from('user_horses')
      .select('level, horses(name, breed, icon)')
      .eq('user_id', userId);
    type HorseRow = { level: number; horses: { name: string; breed: string; icon: string } | null };
    const horses =
      (userHorses as HorseRow[] | null)?.map((uh) => ({
        name: uh.horses?.name ?? '',
        breed: uh.horses?.breed ?? '',
        level: uh.level,
        img: uh.horses?.icon ?? '🐴',
      })) ?? [];

    const { data: userBadges } = await db
      .from('user_badges')
      .select('badges(name)')
      .eq('user_id', userId);
    type BadgeRow = { badges: { name: string } | null };
    const badges =
      (userBadges as BadgeRow[] | null)?.map((ub) => ub.badges?.name ?? '') ?? [];

    const title = user.level >= 20 ? 'Master Equestrian' : user.level >= 10 ? 'Stable Manager' : user.level >= 5 ? 'Senior Stable Hand' : 'Stable Hand';

    return {
      ...user,
      title,
      horses,
      badges,
    };
  }

  async getDailyChores(): Promise<readonly DailyChore[]> {
    const db = getSupabase();
    const { data: chores, error: choresError } = await db
      .from('daily_chores')
      .select('id, task, reward_label')
      .eq('active', true)
      .order('id');
    if (choresError) throw choresError;
    if (!chores?.length) return [];

    const {
      data: { user },
    } = await db.auth.getUser();
    let completedChoreIds = new Set<number>();
    if (user) {
      const today = new Date().toISOString().slice(0, 10);
      const { data: userChores } = await db
        .from('user_chores')
        .select('chore_id')
        .eq('user_id', user.id)
        .eq('completed_at', today);
      completedChoreIds = new Set((userChores ?? []).map((c) => c.chore_id));
    }

    return chores.map((c) => ({
      id: String(c.id),
      task: c.task,
      reward: c.reward_label,
      completed: completedChoreIds.has(c.id),
    }));
  }

  async getLeaderboard(limit = 10): Promise<readonly LeaderboardEntry[]> {
    const db = getSupabase();
    const {
      data: { user: currentUser },
    } = await db.auth.getUser();
    const { data: rows, error } = await db
      .from('leaderboard')
      .select('id, name, xp, rank')
      .limit(limit);
    if (error) throw error;
    const currentId = currentUser?.id;
    return (rows ?? []).map((entry) => ({
      name: entry.name ?? 'Anonymous',
      xp: entry.xp ?? 0,
      rank: entry.rank ?? 0,
      ...(currentId && entry.id === currentId ? { isCurrentUser: true } : {}),
    }));
  }

  async getRewardById(_rewardId: string): Promise<Reward | null> {
    return null;
  }

  async completeChore(choreId: string): Promise<void> {
    const db = getSupabase();
    const {
      data: { user },
    } = await db.auth.getUser();
    if (!user) throw new Error('Not authenticated');
    const choreIdNum = parseInt(choreId, 10);
    if (Number.isNaN(choreIdNum)) throw new Error('Invalid chore id');
    const today = new Date().toISOString().slice(0, 10);
    const { error } = await db.from('user_chores').upsert(
      { user_id: user.id, chore_id: choreIdNum, completed_at: today },
      { onConflict: 'user_id,chore_id,completed_at' }
    );
    if (error) throw error;
  }
}
