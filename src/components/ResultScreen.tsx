import { useState } from 'react';
import type { Question, AnswerRecord } from '../types';

interface Props {
  questions: Question[];
  answers: AnswerRecord[];
  correctCount: number;
  total: number;
  onHome: () => void;
  onRetry: () => void;
  onNextBlock?: () => void;
  blockNumber: number;
  totalBlocks: number;
  saveStatus: 'idle' | 'saving' | 'saved' | 'error';
}

export function ResultScreen({
  questions,
  answers,
  correctCount,
  total,
  onHome,
  onRetry,
  onNextBlock,
  blockNumber,
  totalBlocks,
  saveStatus,
}: Props) {
  const [showReview, setShowReview] = useState(false);
  const pct = total > 0 ? Math.round((correctCount / total) * 100) : 0;

  const getQuestion = (qId: number) => questions.find((q) => q.id === qId);

  return (
    <div className="result-screen">
      <h1>学習結果</h1>

      <p className="block-info">
        ブロック {blockNumber} / {totalBlocks}
      </p>

      <div className="score-card">
        <div className="score-circle">
          <span className="score-pct">{pct}%</span>
        </div>
        <p className="score-detail">
          {correctCount} / {total} 問正解
        </p>
      </div>

      {saveStatus !== 'idle' && (
        <p className={`save-status save-status--${saveStatus}`}>
          {saveStatus === 'saving' && '保存中...'}
          {saveStatus === 'saved' && '結果を保存しました'}
          {saveStatus === 'error' && '保存に失敗しました'}
        </p>
      )}

      <div className="result-actions">
        {onNextBlock && (
          <button className="btn btn-primary" onClick={onNextBlock}>
            次のブロックへ
          </button>
        )}
        <button className="btn btn-secondary" onClick={onRetry}>
          最初からやり直す
        </button>
        <button className="btn btn-secondary" onClick={onHome}>
          ホームに戻る
        </button>
      </div>

      <button
        className="btn btn-secondary review-toggle"
        onClick={() => setShowReview(!showReview)}
      >
        {showReview ? '振り返りを閉じる' : '問題を振り返る'}
      </button>

      {showReview && (
        <div className="review-list">
          {answers.map((a, i) => {
            const q = getQuestion(a.questionId);
            if (!q) return null;
            return (
              <div
                key={i}
                className={`review-item ${a.correct ? 'correct' : 'wrong'}`}
              >
                <div className="review-header">
                  <span className="review-mark">
                    {a.correct ? '○' : '×'}
                  </span>
                  <span className="review-num">問{i + 1}</span>
                </div>
                <p className="review-question">{q.question}</p>
                <p className="review-answer">
                  <strong>答え:</strong>{' '}
                  {q.isOrdered ? q.answer.split(';').join(', ') : q.answer}
                </p>
                {q.explanation && (
                  <p className="review-explanation">{q.explanation}</p>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
