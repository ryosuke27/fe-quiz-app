export interface RawQuestion {
  question: string;
  answers: string;
  wrongChoices: string;
  explanation: string;
  ordered: string;
}

export interface Question {
  id: number;
  question: string;
  answer: string;
  wrongChoices: string[];
  explanation: string;
  isOrdered: boolean;
}

export interface QuizChoice {
  text: string;
  isCorrect: boolean;
}

export type StudyMode = 'flashcard' | 'quiz';

export interface AnswerRecord {
  questionId: number;
  correct: boolean;
  questionText: string;
  correctAnswer: string;
}

export interface DbSession {
  id: string;
  device_id: string;
  csv_file: string;
  mode: string;
  correct_count: number;
  total_count: number;
  created_at: string;
}

export interface DbAnswerRecord {
  id: string;
  session_id: string;
  question_text: string;
  correct_answer: string;
  is_correct: boolean;
  created_at: string;
}

export interface CsvFile {
  label: string;
  path: string;
}
