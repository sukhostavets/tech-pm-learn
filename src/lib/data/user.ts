/**
 * User Data
 * This will be replaced with API calls when database is integrated
 */

import type { User } from '../types';

export const MOCK_USER: User = {
  id: "user-1",
  name: "Alex",
  stableName: "Cloud Hopper Ranch",
  level: 5,
  xp: 2450,
  nextLevelXp: 3000,
  streak: 12,
  avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix",
  joinDate: new Date('2023-10-01')
};

export const MOCK_USER_PROFILE = {
  ...MOCK_USER,
  name: "Alex Smith",
  title: "Senior Stable Hand",
  horses: [
    { name: "Query", breed: "SQL Stallion", level: 5, img: "🐴" },
    { name: "Git", breed: "Version Control Pony", level: 3, img: "🐎" },
    { name: "Pixel", breed: "Frontend Foal", level: 1, img: "🦄" },
    { name: "Docker", breed: "Container Clydesdale", level: 2, img: "🦓" },
  ],
  badges: ["First Ride", "Bug Hunter", "Clean Code", "Night Owl"]
};

/**
 * Get current user
 * TODO: Replace with API call
 */
export async function getCurrentUser(): Promise<User> {
  // Simulate API call
  return Promise.resolve(MOCK_USER);
}

/**
 * Get user profile with extended data
 * TODO: Replace with API call
 */
export async function getUserProfile(_userId: string): Promise<typeof MOCK_USER_PROFILE> {
  // Simulate API call
  return Promise.resolve(MOCK_USER_PROFILE);
}
