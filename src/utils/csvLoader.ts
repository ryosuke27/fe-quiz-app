import Papa from 'papaparse';
import type { RawQuestion, Question } from '../types';

export async function loadCsv(path: string): Promise<Question[]> {
  const response = await fetch(path);
  const text = await response.text();

  const result = Papa.parse<RawQuestion>(text, {
    header: true,
    skipEmptyLines: true,
  });

  return result.data.map((row, index) => ({
    id: index,
    question: row.question?.trim() ?? '',
    answer: row.answers?.trim() ?? '',
    wrongChoices: row.wrongChoices
      ? row.wrongChoices.split(';').map((s) => s.trim()).filter(Boolean)
      : [],
    explanation: row.explanation?.trim() ?? '',
    isOrdered: row.ordered?.trim() === '1',
  })).filter((q) => q.question.length > 0);
}
