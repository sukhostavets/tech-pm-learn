/**
 * Milestone-related type definitions
 */

export type MilestoneStatus = 'completed' | 'in-progress' | 'locked';

export interface Milestone {
  id: number;
  title: string;
  topic: string;
  icon: string;
  description?: string;
  totalLessons?: number;
  status: MilestoneStatus;
  progress?: number; // 0-100, only for in-progress
  completedAt?: Date; // only for completed
  /** Map position (percentage). Used by MilestoneMap. */
  mapX?: number;
  mapY?: number;
}

export interface MilestoneWithProgress extends Milestone {
  progress: number;
}
