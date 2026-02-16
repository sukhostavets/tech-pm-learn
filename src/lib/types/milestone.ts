/**
 * Milestone-related type definitions
 */

export type MilestoneStatus = 'completed' | 'in-progress' | 'locked';

export interface Milestone {
  id: number;
  title: string;
  topic: string;
  icon: string;
  status: MilestoneStatus;
  progress?: number; // 0-100, only for in-progress
  completedAt?: Date; // only for completed
}

export interface MilestoneWithProgress extends Milestone {
  progress: number;
}
