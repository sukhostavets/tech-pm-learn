/**
 * Pure progress computation from lessons + user_lessons.
 * Used by SupabaseDataService so progress is always derived from actual completions.
 */

import type { Milestone } from '../types';

export interface MilestoneRow {
  id: number;
  title: string;
  topic: string;
  icon: string;
  sort_order: number;
  map_x?: number | null;
  map_y?: number | null;
  description?: string | null;
  total_lessons?: number | null;
}

export interface LessonRow {
  id: number;
  milestone_id: number;
}

export interface UserLessonRow {
  lesson_id: number;
}

export interface UserMilestoneRow {
  milestone_id: number;
  status: string;
  progress?: number | null;
  completed_at?: string | null;
}

/**
 * Computes progress from user_lessons (source of truth). When a milestone has
 * lessons, progress = round((completed / total) * 100). Otherwise uses
 * user_milestones.progress as fallback.
 */
export function computeMilestonesWithProgress(
  milestones: MilestoneRow[],
  lessons: LessonRow[],
  userLessons: UserLessonRow[],
  userProgress: UserMilestoneRow[]
): Milestone[] {
  const progressByMilestone = new Map(userProgress.map((p) => [p.milestone_id, p]));

  const completedLessonIds = new Set(userLessons.map((ul) => ul.lesson_id));
  const lessonCountByMilestone = new Map<number, { total: number; completed: number }>();
  for (const l of lessons) {
    const mid = l.milestone_id;
    const cur = lessonCountByMilestone.get(mid) ?? { total: 0, completed: 0 };
    cur.total += 1;
    if (completedLessonIds.has(l.id)) cur.completed += 1;
    lessonCountByMilestone.set(mid, cur);
  }

  return milestones.map((m) => {
    const p = progressByMilestone.get(m.id);
    const counts = lessonCountByMilestone.get(m.id);
    const totalLessons = counts?.total ?? 0;
    const completedLessons = counts?.completed ?? 0;
    const progress =
      totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : (p?.progress ?? 0);
    return {
      id: m.id,
      title: m.title,
      topic: m.topic,
      icon: m.icon,
      description: m.description ?? undefined,
      totalLessons: m.total_lessons ?? undefined,
      status: (p?.status ?? 'locked') as Milestone['status'],
      progress,
      completedAt: p?.completed_at ? new Date(p.completed_at) : undefined,
      mapX: m.map_x != null ? Number(m.map_x) : undefined,
      mapY: m.map_y != null ? Number(m.map_y) : undefined,
    };
  });
}

/**
 * Progress for a single milestone from lesson counts. Used by getMilestoneById.
 */
export function computeProgressFromCounts(
  totalLessons: number,
  completedCount: number,
  fallbackProgress: number
): number {
  return totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : fallbackProgress;
}
