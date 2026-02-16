import { useEffect, useState, useRef } from 'react';
import type { StudyMode } from '../types';
import { loadCsv } from '../utils/csvLoader';
import { useStudySession } from '../hooks/useStudySession';
import { saveSessionToDb } from '../utils/saveSession';
import { supabase } from '../utils/supabase';
import { ProgressBar } from './ProgressBar';
import { FlashCard } from './FlashCard';
import { QuizCard } from './QuizCard';
import { ResultScreen } from './ResultScreen';

interface Props {
  csvPath: string;
  mode: StudyMode;
  doShuffle: boolean;
  onHome: () => void;
  userId?: string;
}

export function StudySession({ csvPath, mode, doShuffle, onHome, userId }: Props) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const lastSavedBlock = useRef(0);
  const session = useStudySession();

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    loadCsv(csvPath)
      .then((questions) => {
        if (cancelled) return;
        if (questions.length === 0) {
          setError('問題が見つかりませんでした。');
          setLoading(false);
          return;
        }
        session.startSession(questions, mode, doShuffle);
        setLoading(false);
      })
      .catch((e) => {
        if (cancelled) return;
        setError(`CSVの読み込みに失敗しました: ${e}`);
        setLoading(false);
      });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [csvPath, mode, doShuffle]);

  useEffect(() => {
    if (!session.finished || !supabase) return;
    if (session.blockNumber <= lastSavedBlock.current) return;

    lastSavedBlock.current = session.blockNumber;
    setSaveStatus('saving');
    saveSessionToDb({
      csvFile: csvPath,
      mode,
      correctCount: session.correctCount,
      total: session.total,
      answers: session.answers,
      userId,
    })
      .then(() => setSaveStatus('saved'))
      .catch(() => setSaveStatus('error'));
  }, [session.finished, session.blockNumber, session.correctCount, session.total, session.answers, csvPath, mode]);

  if (loading) {
    return (
      <div className="loading">
        <p>読み込み中...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-screen">
        <p>{error}</p>
        <button className="btn btn-primary" onClick={onHome}>
          ホームに戻る
        </button>
      </div>
    );
  }

  if (session.finished) {
    return (
      <ResultScreen
        questions={session.questions}
        answers={session.answers}
        correctCount={session.correctCount}
        total={session.total}
        onHome={onHome}
        onRetry={() => {
          lastSavedBlock.current = 0;
          setSaveStatus('idle');
          session.startSession(session.allQuestions, mode, doShuffle);
        }}
        onNextBlock={
          session.hasNextBlock
            ? () => {
                setSaveStatus('idle');
                session.nextBlock();
              }
            : undefined
        }
        blockNumber={session.blockNumber}
        totalBlocks={session.totalBlocks}
        saveStatus={saveStatus}
      />
    );
  }

  if (!session.currentQuestion) {
    return null;
  }

  return (
    <div className="study-session">
      <div className="session-header">
        <button className="btn btn-secondary btn-back" onClick={onHome}>
          ← ホーム
        </button>
        <ProgressBar
          current={session.currentIndex}
          total={session.total}
          correctCount={session.correctCount}
          answeredCount={session.answeredCount}
        />
      </div>

      {mode === 'flashcard' ? (
        <FlashCard
          key={session.currentQuestion.id + '-' + session.currentIndex}
          question={session.currentQuestion}
          onAnswer={(correct) =>
            session.recordAnswer(
              session.currentQuestion!.id,
              correct,
              session.currentQuestion!.question,
              session.currentQuestion!.answer,
            )
          }
          onNext={session.next}
          isLast={session.currentIndex === session.total - 1}
        />
      ) : (
        <QuizCard
          key={session.currentQuestion.id + '-' + session.currentIndex}
          question={session.currentQuestion}
          allQuestions={session.allQuestions}
          onAnswer={(correct) =>
            session.recordAnswer(
              session.currentQuestion!.id,
              correct,
              session.currentQuestion!.question,
              session.currentQuestion!.answer,
            )
          }
          onNext={session.next}
          isLast={session.currentIndex === session.total - 1}
        />
      )}
    </div>
  );
}
