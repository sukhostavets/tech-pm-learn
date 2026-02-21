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
  Lesson,
  Resource,
} from '../types';
import type { IDataService } from './data.service';
import {
  computeMilestonesWithProgress,
  computeProgressFromCounts,
  type LessonRow,
  type UserLessonRow,
  type UserMilestoneRow,
} from './milestone-progress';

function getSupabase() {
  if (!supabase) throw new Error('Supabase not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY.');
  return supabase;
}

function todayUtc(): string {
  return new Date().toISOString().slice(0, 10);
}

function yesterdayUtc(): string {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() - 1);
  return d.toISOString().slice(0, 10);
}

/** Effective streak for display: 0 if last activity was before yesterday. */
function effectiveStreak(streak: number, lastActivityDate: string | null): number {
  if (!lastActivityDate) return 0;
  const dateStr = lastActivityDate.slice(0, 10);
  return dateStr >= yesterdayUtc() ? streak : 0;
}

function profileToUser(row: {
  id: string;
  name: string;
  stable_name: string;
  level: number;
  xp: number;
  next_level_xp: number;
  streak: number;
  hay_coins?: number;
  avatar_url: string | null;
  created_at: string;
  tutorial_completed?: boolean;
  last_activity_date?: string | null;
}): User {
  return {
    id: row.id,
    name: row.name,
    stableName: row.stable_name,
    level: row.level,
    xp: row.xp,
    nextLevelXp: row.next_level_xp,
    streak: effectiveStreak(row.streak, row.last_activity_date ?? null),
    hayCoins: row.hay_coins ?? 0,
    avatarUrl: row.avatar_url ?? undefined,
    joinDate: new Date(row.created_at),
    tutorialCompleted: row.tutorial_completed ?? false,
  };
}

export class SupabaseDataService implements IDataService {
  async getQuestions(
    topic?: string,
    milestoneId?: number,
    questionType?: 'lesson_check' | 'milestone_test',
    lessonId?: number
  ): Promise<readonly Question[]> {
    const db = getSupabase();
    let query = db.from('questions').select('id, question, options, correct_index, explanation');
    if (lessonId != null) {
      query = query.eq('lesson_id', lessonId);
    }
    if (milestoneId != null) {
      query = query.eq('milestone_id', milestoneId);
    }
    if (questionType != null) {
      query = query.eq('question_type', questionType);
    }
    if (topic != null && topic !== '') {
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

  async getLessons(milestoneId: number): Promise<readonly Lesson[]> {
    const db = getSupabase();
    const { data: { user } } = await db.auth.getUser();
    const { data: lessons, error: lessonsError } = await db
      .from('lessons')
      .select('id, milestone_id, title, subtitle, content_markdown, key_terms, sort_order, estimated_minutes')
      .eq('milestone_id', milestoneId)
      .order('sort_order');
    if (lessonsError) throw lessonsError;
    if (!lessons?.length) return [];

    let completedLessonIds = new Set<number>();
    if (user) {
      const { data: userLessons } = await db
        .from('user_lessons')
        .select('lesson_id')
        .eq('user_id', user.id)
        .in('lesson_id', lessons.map((l) => l.id));
      completedLessonIds = new Set((userLessons ?? []).map((ul) => ul.lesson_id));
    }

    return lessons.map((l) => ({
      id: l.id,
      milestoneId: l.milestone_id,
      title: l.title,
      subtitle: l.subtitle ?? '',
      contentMarkdown: l.content_markdown,
      keyTerms: l.key_terms ? (typeof l.key_terms === 'string' ? l.key_terms.split('|').map((s) => s.trim()).filter(Boolean) : []) : [],
      sortOrder: l.sort_order,
      estimatedMinutes: l.estimated_minutes ?? 10,
      completed: completedLessonIds.has(l.id),
    }));
  }

  async getLessonById(lessonId: number): Promise<Lesson | null> {
    const db = getSupabase();
    const { data: lesson, error } = await db
      .from('lessons')
      .select('id, milestone_id, title, subtitle, content_markdown, key_terms, sort_order, estimated_minutes')
      .eq('id', lessonId)
      .single();
    if (error || !lesson) return null;
    return {
      id: lesson.id,
      milestoneId: lesson.milestone_id,
      title: lesson.title,
      subtitle: lesson.subtitle ?? '',
      contentMarkdown: lesson.content_markdown,
      keyTerms: lesson.key_terms ? (typeof lesson.key_terms === 'string' ? lesson.key_terms.split('|').map((s) => s.trim()).filter(Boolean) : []) : [],
      sortOrder: lesson.sort_order,
      estimatedMinutes: lesson.estimated_minutes ?? 10,
    };
  }

  async getResources(milestoneId: number): Promise<readonly Resource[]> {
    const db = getSupabase();
    const { data, error } = await db
      .from('resources')
      .select('id, milestone_id, title, url, description, source_type')
      .eq('milestone_id', milestoneId)
      .order('id');
    if (error) throw error;
    return (data ?? []).map((r) => ({
      id: r.id,
      milestoneId: r.milestone_id,
      title: r.title,
      url: r.url,
      description: r.description ?? '',
      sourceType: r.source_type as Resource['sourceType'],
    }));
  }

  async completeLesson(lessonId: number): Promise<void> {
    const db = getSupabase();
    const { data: { user } } = await db.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data: lesson, error: lessonError } = await db
      .from('lessons')
      .select('milestone_id')
      .eq('id', lessonId)
      .single();
    if (lessonError || !lesson) throw new Error('Lesson not found');

    const { error: ulError } = await db.from('user_lessons').upsert(
      { user_id: user.id, lesson_id: lessonId },
      { onConflict: 'user_id,lesson_id' }
    );
    if (ulError) throw ulError;

    const [{ data: milestoneLessonIds }, { data: completed }] = await Promise.all([
      db.from('lessons').select('id').eq('milestone_id', lesson.milestone_id),
      db.from('user_lessons').select('lesson_id').eq('user_id', user.id),
    ]);
    const milestoneSet = new Set((milestoneLessonIds ?? []).map((l) => l.id));
    const completedLessons = (completed ?? []).filter((ul) => milestoneSet.has(ul.lesson_id)).length;
    const totalLessons = milestoneSet.size;
    const progress = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

    const { error: umError } = await db.from('user_milestones').upsert(
      {
        user_id: user.id,
        milestone_id: lesson.milestone_id,
        status: 'in-progress',
        progress,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'user_id,milestone_id' }
    );
    if (umError) throw umError;
    await this.touchStreak();
  }

  async getHangmanWords(): Promise<readonly HangmanWord[]> {
    const { data, error } = await getSupabase()
      .from('hangman_words')
      .select('word, hint, difficulty, milestone_id')
      .order('id');
    if (error) throw error;
    return (data ?? []).map((row) => ({
      word: row.word,
      hint: row.hint,
      difficulty: row.difficulty as HangmanWord['difficulty'],
      milestoneId: row.milestone_id ?? undefined,
    }));
  }

  async getMilestones(): Promise<readonly Milestone[]> {
    const db = getSupabase();
    const {
      data: { user },
    } = await db.auth.getUser();
    const { data: milestones, error: milestonesError } = await db
      .from('milestones')
      .select('id, title, topic, icon, sort_order, map_x, map_y, description, total_lessons')
      .order('sort_order');
    if (milestonesError) throw milestonesError;
    if (!milestones?.length) return [];

    if (!user) {
      return milestones.map((m) => ({
        id: m.id,
        title: m.title,
        topic: m.topic,
        icon: m.icon,
        description: m.description ?? undefined,
        totalLessons: m.total_lessons ?? undefined,
        status: 'locked' as const,
        mapX: m.map_x != null ? Number(m.map_x) : undefined,
        mapY: m.map_y != null ? Number(m.map_y) : undefined,
      }));
    }

    const [progressRes, lessonsRes, userLessonsRes] = await Promise.all([
      db.from('user_milestones').select('milestone_id, status, progress, completed_at').eq('user_id', user.id),
      db.from('lessons').select('id, milestone_id'),
      db.from('user_lessons').select('lesson_id').eq('user_id', user.id),
    ]);
    if (progressRes.error) throw progressRes.error;

    return computeMilestonesWithProgress(
      milestones as Parameters<typeof computeMilestonesWithProgress>[0],
      (lessonsRes.data ?? []) as LessonRow[],
      (userLessonsRes.data ?? []) as UserLessonRow[],
      (progressRes.data ?? []) as UserMilestoneRow[]
    );
  }

  async getMilestoneById(id: number): Promise<Milestone | null> {
    const db = getSupabase();
    const { data: milestone, error: milestoneError } = await db
      .from('milestones')
      .select('id, title, topic, icon, sort_order, map_x, map_y, description, total_lessons')
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
      const [{ data: up }, { data: milestoneLessons }, { data: completed }] = await Promise.all([
        db.from('user_milestones').select('status, progress, completed_at').eq('user_id', user.id).eq('milestone_id', id).maybeSingle(),
        db.from('lessons').select('id').eq('milestone_id', id),
        db.from('user_lessons').select('lesson_id').eq('user_id', user.id),
      ]);
      if (up) {
        status = up.status as Milestone['status'];
        completedAt = up.completed_at ? new Date(up.completed_at) : undefined;
      }
      const totalLessons = milestoneLessons?.length ?? 0;
      const completedIds = new Set((completed ?? []).map((ul) => ul.lesson_id));
      const completedCount = (milestoneLessons ?? []).filter((l) => completedIds.has(l.id)).length;
      progress = computeProgressFromCounts(totalLessons, completedCount, up?.progress ?? 0);
    }

    return {
      id: milestone.id,
      title: milestone.title,
      topic: milestone.topic,
      icon: milestone.icon,
      description: milestone.description ?? undefined,
      totalLessons: milestone.total_lessons ?? undefined,
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

  async getHorsesCount(): Promise<{ collected: number; total: number }> {
    const db = getSupabase();
    const [
      { count: collected },
      { count: total },
    ] = await Promise.all([
      (async () => {
        const { data: { user } } = await db.auth.getUser();
        if (!user) return { count: 0 };
        const { count, error } = await db
          .from('user_horses')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id);
        if (error) return { count: 0 };
        return { count: count ?? 0 };
      })(),
      db.from('horses').select('*', { count: 'exact', head: true }).then(({ count, error }) => ({ count: error ? 0 : (count ?? 0) })),
    ]);
    return { collected: collected ?? 0, total: total ?? 0 };
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
    await this.touchStreak();
  }

  async setMilestoneInProgress(milestoneId: number): Promise<void> {
    const db = getSupabase();
    const {
      data: { user },
    } = await db.auth.getUser();
    if (!user) throw new Error('Not authenticated');
    const { error } = await db.from('user_milestones').upsert(
      {
        user_id: user.id,
        milestone_id: milestoneId,
        status: 'in-progress',
        progress: 0,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'user_id,milestone_id' }
    );
    if (error) throw error;
  }

  async recordQuizAttempt(params: {
    milestoneId?: number | null;
    topic: string;
    score: number;
    totalQuestions: number;
    passed: boolean;
    xpEarned?: number;
  }): Promise<void> {
    const db = getSupabase();
    const {
      data: { user },
    } = await db.auth.getUser();
    if (!user) throw new Error('Not authenticated');
    const xpEarned = params.xpEarned ?? (params.passed ? 50 : 0);

    const { error: attemptError } = await db.from('quiz_attempts').insert({
      user_id: user.id,
      milestone_id: params.milestoneId ?? null,
      topic: params.topic,
      score: params.score,
      total_questions: params.totalQuestions,
      passed: params.passed,
      xp_earned: xpEarned,
    });
    if (attemptError) throw attemptError;

    if (params.passed && params.milestoneId != null) {
      const { error: umError } = await db.from('user_milestones').upsert(
        {
          user_id: user.id,
          milestone_id: params.milestoneId,
          status: 'completed',
          progress: 100,
          completed_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'user_id,milestone_id' }
      );
      if (umError) throw umError;
    }

    const { data: profile } = await db
      .from('profiles')
      .select('xp')
      .eq('id', user.id)
      .single();
    if (profile) {
      await db
        .from('profiles')
        .update({
          xp: (profile.xp ?? 0) + xpEarned,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);
    }
    await this.touchStreak();
  }

  /** Updates profile streak and last_activity_date when user does something. Never throws. */
  private async touchStreak(): Promise<void> {
    try {
      const db = getSupabase();
      const { data: { user } } = await db.auth.getUser();
      if (!user) return;
      const today = todayUtc();
      const { data: profile } = await db
        .from('profiles')
        .select('streak, last_activity_date')
        .eq('id', user.id)
        .single();
      if (!profile) return;
      const last = profile.last_activity_date?.slice(0, 10) ?? null;
      if (last === today) return;
      const newStreak = last === yesterdayUtc() ? (profile.streak ?? 0) + 1 : 1;
      const { error } = await db
        .from('profiles')
        .update({
          streak: newStreak,
          last_activity_date: today,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);
      if (error) console.error('touchStreak failed:', error);
    } catch (e) {
      console.error('touchStreak error:', e);
    }
  }

  async updateProfile(updates: {
    name?: string;
    stableName?: string;
    avatarUrl?: string | null;
  }): Promise<void> {
    const db = getSupabase();
    const {
      data: { user },
    } = await db.auth.getUser();
    if (!user) throw new Error('Not authenticated');
    const row: Record<string, unknown> = { updated_at: new Date().toISOString() };
    if (updates.name !== undefined) row.name = updates.name;
    if (updates.stableName !== undefined) row.stable_name = updates.stableName;
    if (updates.avatarUrl !== undefined) row.avatar_url = updates.avatarUrl;
    const { error } = await db.from('profiles').update(row).eq('id', user.id);
    if (error) throw error;
  }

  async setTutorialCompleted(): Promise<void> {
    const db = getSupabase();
    const {
      data: { user },
    } = await db.auth.getUser();
    if (!user) throw new Error('Not authenticated');
    const { error } = await db
      .from('profiles')
      .update({ tutorial_completed: true, updated_at: new Date().toISOString() })
      .eq('id', user.id);
    if (error) throw error;
  }

  async getHangmanStreak(): Promise<{ streak: number; bestStreak: number }> {
    const db = getSupabase();
    const { data: { user } } = await db.auth.getUser();
    if (!user) return { streak: 0, bestStreak: 0 };
    const { data, error } = await db
      .from('profiles')
      .select('hangman_streak, hangman_best_streak')
      .eq('id', user.id)
      .single();
    if (error || !data) return { streak: 0, bestStreak: 0 };
    return {
      streak: data.hangman_streak ?? 0,
      bestStreak: data.hangman_best_streak ?? 0,
    };
  }

  async saveHangmanStreak(streak: number, bestStreak: number): Promise<void> {
    const db = getSupabase();
    const { data: { user } } = await db.auth.getUser();
    if (!user) return;
    const { error } = await db
      .from('profiles')
      .update({
        hangman_streak: streak,
        hangman_best_streak: bestStreak,
        updated_at: new Date().toISOString(),
      })
      .eq('id', user.id);
    if (error) console.error('saveHangmanStreak failed:', error);
  }
}
