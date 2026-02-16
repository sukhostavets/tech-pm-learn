/**
 * Quiz Questions Data
 * This will be replaced with API calls when database is integrated
 */

import type { Question } from '../types';

export const QUIZ_QUESTIONS: Record<string, readonly Question[]> = {
  database: [
    {
      id: 1,
      question: "Which component of the stable best represents a SQL Database?",
      options: [
        "The Riding Arena (Where actions happen)",
        "The Feed Storage (Where resources are organized and stored)",
        "The Trails (How we connect to outside)",
        "The Fence (Security layer)"
      ] as const,
      correct: 1,
      explanation: "Correct! The Feed Storage organizes resources (data) in specific bins (tables) so they can be retrieved efficiently when needed."
    },
    {
      id: 2,
      question: "If you want to ask for specific data, which command do you use?",
      options: [
        "FETCH",
        "GET",
        "SELECT",
        "GIVE"
      ] as const,
      correct: 2,
      explanation: "Correct! SELECT is the SQL command used to retrieve specific data from a database table."
    },
    {
      id: 3,
      question: "What is a 'Schema' in our stable analogy?",
      options: [
        "The blueprint of the barn layout",
        "The list of horses",
        "The schedule for feeding",
        "The lock on the door"
      ] as const,
      correct: 0,
      explanation: "Spot on! A Schema is the structural design or blueprint of the database, just like the architectural plan of your stable."
    }
  ] as const,
  sdlc: [
    {
      id: 1,
      question: "What does SDLC stand for in software development?",
      options: [
        "Stable Development Life Cycle",
        "Software Development Life Cycle",
        "System Design Logic Code",
        "Software Deployment Live Check"
      ] as const,
      correct: 1,
      explanation: "Correct! SDLC stands for Software Development Life Cycle."
    },
    {
      id: 2,
      question: "Which phase comes immediately after Planning in the SDLC?",
      options: [
        "Testing",
        "Deployment",
        "Analysis/Design",
        "Maintenance"
      ] as const,
      correct: 2,
      explanation: "Correct! After Planning comes Analysis/Design phase."
    },
    {
      id: 3,
      question: "In our stable analogy, what does 'Refactoring' equate to?",
      options: [
        "Buying a new horse",
        "Grooming and cleaning",
        "Feeding time",
        "Racing day"
      ] as const,
      correct: 1,
      explanation: "Correct! Refactoring is like grooming and cleaning - improving code without changing functionality."
    }
  ] as const,
};

/**
 * Get questions for a specific topic
 */
export function getQuestionsByTopic(topic: string): readonly Question[] {
  return QUIZ_QUESTIONS[topic] ?? [];
}

/**
 * Get all questions
 */
export function getAllQuestions(): Question[] {
  return Object.values(QUIZ_QUESTIONS).flat();
}
