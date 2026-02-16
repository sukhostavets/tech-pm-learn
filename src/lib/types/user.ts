/**
 * User-related type definitions
 */

export interface User {
  id: string;
  name: string;
  stableName: string;
  level: number;
  xp: number;
  nextLevelXp: number;
  streak: number;
  avatarUrl?: string;
  joinDate?: Date;
}

export interface UserStats {
  totalXp: number;
  currentLevel: number;
  streak: number;
  horsesCollected: number;
  totalHorses: number;
}
