import type { Question, QuizChoice } from '../types';
import { shuffle } from './shuffle';

export function generateWrongChoices(
  target: Question,
  allQuestions: Question[],
): string[] {
  if (target.wrongChoices.length >= 3) {
    return shuffle(target.wrongChoices).slice(0, 3);
  }

  const pool = new Set<string>();
  for (const q of allQuestions) {
    if (q.id !== target.id && !q.isOrdered && q.answer !== target.answer) {
      pool.add(q.answer);
    }
  }

  const existing = new Set(target.wrongChoices);
  const candidates = [...pool].filter((a) => !existing.has(a));
  const shuffled = shuffle(candidates);
  const needed = 3 - target.wrongChoices.length;
  return [...target.wrongChoices, ...shuffled.slice(0, needed)];
}

export function createQuizChoices(
  target: Question,
  allQuestions: Question[],
): QuizChoice[] {
  const wrong = generateWrongChoices(target, allQuestions);
  const choices: QuizChoice[] = [
    { text: target.answer, isCorrect: true },
    ...wrong.map((text) => ({ text, isCorrect: false })),
  ];
  return shuffle(choices);
}

export function getQuizEligibleQuestions(questions: Question[]): Question[] {
  return questions.filter((q) => !q.isOrdered);
}
