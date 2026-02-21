/**
 * Lesson and resource type definitions
 */

export interface Lesson {
  id: number;
  milestoneId: number;
  title: string;
  subtitle: string;
  contentMarkdown: string;
  keyTerms: string[];
  sortOrder: number;
  estimatedMinutes: number;
  completed?: boolean;
}

export interface Resource {
  id: number;
  milestoneId: number;
  title: string;
  url: string;
  description: string;
  sourceType: 'article' | 'video' | 'book' | 'documentation' | 'tutorial';
}
