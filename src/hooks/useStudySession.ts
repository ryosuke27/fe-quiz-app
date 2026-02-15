import { useState, useCallback } from 'react';
import type { Question, AnswerRecord, StudyMode } from '../types';
import { shuffle } from '../utils/shuffle';
import { getQuizEligibleQuestions } from '../utils/quizLogic';

const BLOCK_SIZE = 10;

interface StudySessionState {
  questions: Question[];
  allQuestions: Question[];
  blockStart: number;
  currentIndex: number;
  answers: AnswerRecord[];
  finished: boolean;
}

export function useStudySession() {
  const [state, setState] = useState<StudySessionState>({
    questions: [],
    allQuestions: [],
    blockStart: 0,
    currentIndex: 0,
    answers: [],
    finished: false,
  });

  const startSession = useCallback(
    (allQuestions: Question[], mode: StudyMode, doShuffle: boolean) => {
      let pool =
        mode === 'quiz' ? getQuizEligibleQuestions(allQuestions) : allQuestions;
      if (doShuffle) {
        pool = shuffle(pool);
      }
      setState({
        questions: pool,
        allQuestions,
        blockStart: 0,
        currentIndex: 0,
        answers: [],
        finished: false,
      });
    },
    [],
  );

  const recordAnswer = useCallback(
    (questionId: number, correct: boolean, questionText: string, correctAnswer: string) => {
      setState((prev) => ({
        ...prev,
        answers: [...prev.answers, { questionId, correct, questionText, correctAnswer }],
      }));
    },
    [],
  );

  const next = useCallback(() => {
    setState((prev) => {
      const blockEnd = Math.min(prev.blockStart + BLOCK_SIZE, prev.questions.length);
      const nextIdx = prev.blockStart + prev.currentIndex + 1;
      if (nextIdx >= blockEnd) {
        return { ...prev, finished: true };
      }
      return { ...prev, currentIndex: prev.currentIndex + 1 };
    });
  }, []);

  const nextBlock = useCallback(() => {
    setState((prev) => ({
      ...prev,
      blockStart: prev.blockStart + BLOCK_SIZE,
      currentIndex: 0,
      answers: [],
      finished: false,
    }));
  }, []);

  const blockEnd = Math.min(state.blockStart + BLOCK_SIZE, state.questions.length);
  const blockTotal = blockEnd - state.blockStart;

  const currentQuestion =
    state.questions.length > 0 && !state.finished
      ? state.questions[state.blockStart + state.currentIndex]
      : null;

  const correctCount = state.answers.filter((a) => a.correct).length;
  const hasNextBlock = state.blockStart + BLOCK_SIZE < state.questions.length;
  const blockNumber = Math.floor(state.blockStart / BLOCK_SIZE) + 1;
  const totalBlocks = Math.ceil(state.questions.length / BLOCK_SIZE);

  return {
    ...state,
    currentQuestion,
    correctCount,
    total: blockTotal,
    answeredCount: state.answers.length,
    hasNextBlock,
    blockNumber,
    totalBlocks,
    overallTotal: state.questions.length,
    startSession,
    recordAnswer,
    next,
    nextBlock,
  };
}
