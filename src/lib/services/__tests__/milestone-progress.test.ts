import { describe, it, expect } from 'vitest';
import {
  computeMilestonesWithProgress,
  computeProgressFromCounts,
  type MilestoneRow,
  type LessonRow,
  type UserLessonRow,
  type UserMilestoneRow,
} from '../milestone-progress';

const milestone = (id: number, title: string): MilestoneRow => ({
  id,
  title,
  topic: 'Topic',
  icon: '📦',
  sort_order: id,
  description: null,
  total_lessons: null,
});

describe('computeProgressFromCounts', () => {
  it('returns 75 when 3 of 4 lessons completed', () => {
    expect(computeProgressFromCounts(4, 3, 0)).toBe(75);
  });

  it('returns 100 when all lessons completed', () => {
    expect(computeProgressFromCounts(4, 4, 0)).toBe(100);
  });

  it('returns 0 when no lessons completed', () => {
    expect(computeProgressFromCounts(4, 0, 0)).toBe(0);
  });

  it('uses fallback when total lessons is 0', () => {
    expect(computeProgressFromCounts(0, 0, 50)).toBe(50);
  });
});

describe('computeMilestonesWithProgress', () => {
  it('derives progress from user_lessons when user_milestones has no row (regression: 0% bug)', () => {
    const milestones = [milestone(1, 'Training Arena')];
    const lessons: LessonRow[] = [
      { id: 101, milestone_id: 1 },
      { id: 102, milestone_id: 1 },
      { id: 103, milestone_id: 1 },
      { id: 104, milestone_id: 1 },
    ];
    const userLessons: UserLessonRow[] = [
      { lesson_id: 101 },
      { lesson_id: 102 },
      { lesson_id: 103 },
    ];
    const userProgress: UserMilestoneRow[] = [];

    const result = computeMilestonesWithProgress(milestones, lessons, userLessons, userProgress);

    expect(result).toHaveLength(1);
    expect(result[0]?.progress).toBe(75);
    expect(result[0]?.status).toBe('locked');
  });

  it('derives progress from user_lessons when user_milestones has progress 0', () => {
    const milestones = [milestone(1, 'Arena')];
    const lessons: LessonRow[] = [
      { id: 1, milestone_id: 1 },
      { id: 2, milestone_id: 1 },
    ];
    const userLessons: UserLessonRow[] = [{ lesson_id: 1 }];
    const userProgress: UserMilestoneRow[] = [
      { milestone_id: 1, status: 'in-progress', progress: 0 },
    ];

    const result = computeMilestonesWithProgress(milestones, lessons, userLessons, userProgress);

    expect(result[0]?.progress).toBe(50);
  });

  it('uses user_lessons as source of truth over stale user_milestones.progress', () => {
    const milestones = [milestone(1, 'Arena')];
    const lessons: LessonRow[] = [
      { id: 1, milestone_id: 1 },
      { id: 2, milestone_id: 1 },
    ];
    const userLessons: UserLessonRow[] = [{ lesson_id: 1 }, { lesson_id: 2 }];
    const userProgress: UserMilestoneRow[] = [
      { milestone_id: 1, status: 'in-progress', progress: 25 },
    ];

    const result = computeMilestonesWithProgress(milestones, lessons, userLessons, userProgress);

    expect(result[0]?.progress).toBe(100);
  });

  it('uses user_milestones.progress when milestone has no lessons', () => {
    const milestones = [milestone(1, 'Empty')];
    const lessons: LessonRow[] = [];
    const userLessons: UserLessonRow[] = [];
    const userProgress: UserMilestoneRow[] = [
      { milestone_id: 1, status: 'in-progress', progress: 42 },
    ];

    const result = computeMilestonesWithProgress(milestones, lessons, userLessons, userProgress);

    expect(result[0]?.progress).toBe(42);
  });

  it('preserves status and completedAt from user_milestones', () => {
    const milestones = [milestone(1, 'Done')];
    const lessons: LessonRow[] = [{ id: 1, milestone_id: 1 }];
    const userLessons: UserLessonRow[] = [{ lesson_id: 1 }];
    const userProgress: UserMilestoneRow[] = [
      { milestone_id: 1, status: 'completed', progress: 100, completed_at: '2025-01-15T12:00:00Z' },
    ];

    const result = computeMilestonesWithProgress(milestones, lessons, userLessons, userProgress);

    expect(result[0]?.status).toBe('completed');
    expect(result[0]?.progress).toBe(100);
    expect(result[0]?.completedAt).toEqual(new Date('2025-01-15T12:00:00Z'));
  });

  it('computes progress per milestone when multiple milestones', () => {
    const milestones = [
      milestone(1, 'First'),
      milestone(2, 'Second'),
    ];
    const lessons: LessonRow[] = [
      { id: 1, milestone_id: 1 },
      { id: 2, milestone_id: 1 },
      { id: 3, milestone_id: 2 },
      { id: 4, milestone_id: 2 },
      { id: 5, milestone_id: 2 },
    ];
    const userLessons: UserLessonRow[] = [{ lesson_id: 1 }, { lesson_id: 3 }, { lesson_id: 4 }];
    const userProgress: UserMilestoneRow[] = [
      { milestone_id: 1, status: 'in-progress' },
      { milestone_id: 2, status: 'in-progress' },
    ];

    const result = computeMilestonesWithProgress(milestones, lessons, userLessons, userProgress);

    expect(result[0]?.progress).toBe(50);
    expect(result[1]?.progress).toBe(67);
  });
});
