/**
 * Milestones Data
 * This will be replaced with API calls when database is integrated
 */

import type { Milestone } from '../types';

export const MILESTONES: readonly Milestone[] = [
  { 
    id: 1, 
    title: "Training Arena", 
    topic: "SDLC & DevOps", 
    status: "completed", 
    icon: "🏟️",
    completedAt: new Date('2024-01-15')
  },
  { 
    id: 2, 
    title: "Feed Storage", 
    topic: "Data & SQL", 
    status: "in-progress", 
    icon: "🥕",
    progress: 60
  },
  { 
    id: 3, 
    title: "Pasture Fields", 
    topic: "Cloud Infra", 
    status: "locked", 
    icon: "☁️"
  },
  { 
    id: 4, 
    title: "Stable Complex", 
    topic: "System Design", 
    status: "locked", 
    icon: "🏠"
  },
  { 
    id: 5, 
    title: "Riding Trails", 
    topic: "APIs & Integrations", 
    status: "locked", 
    icon: "🛤️"
  },
  { 
    id: 6, 
    title: "Breeding Barn", 
    topic: "Machine Learning", 
    status: "locked", 
    icon: "🧬"
  },
  { 
    id: 7, 
    title: "Show Arena", 
    topic: "GenAI & LLMs", 
    status: "locked", 
    icon: "✨"
  },
] as const;

/**
 * Milestone coordinates for map view
 */
export const MILESTONE_COORDINATES: Record<number, { x: number; y: number }> = {
  1: { x: 10, y: 80 },
  2: { x: 30, y: 60 },
  3: { x: 20, y: 30 },
  4: { x: 50, y: 15 },
  5: { x: 75, y: 30 },
  6: { x: 65, y: 65 },
  7: { x: 90, y: 85 },
};

/**
 * Get all milestones
 */
export function getMilestones(): readonly Milestone[] {
  return MILESTONES;
}

/**
 * Get milestone by ID
 */
export function getMilestoneById(id: number): Milestone | undefined {
  return MILESTONES.find(m => m.id === id);
}

/**
 * Get milestones by status
 */
export function getMilestonesByStatus(status: Milestone['status']): readonly Milestone[] {
  return MILESTONES.filter(m => m.status === status);
}
