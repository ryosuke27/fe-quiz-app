import { useState } from 'react';
import type { Question } from '../types';
import { ExplanationPanel } from './ExplanationPanel';

interface Props {
  question: Question;
  onAnswer: (correct: boolean) => void;
  onNext: () => void;
  isLast: boolean;
}

export function FlashCard({ question, onAnswer, onNext, isLast }: Props) {
  const [flipped, setFlipped] = useState(false);
  const [answered, setAnswered] = useState(false);

  const handleFlip = () => {
    if (!flipped) setFlipped(true);
  };

  const handleSelfScore = (correct: boolean) => {
    onAnswer(correct);
    setAnswered(true);
  };

  const handleNext = () => {
    setFlipped(false);
    setAnswered(false);
    onNext();
  };

  return (
    <div className="flashcard-container">
      <div
        className={`flashcard ${flipped ? 'flipped' : ''}`}
        onClick={handleFlip}
      >
        <div className="flashcard-front">
          <p className="flashcard-label">問題</p>
          <p className="flashcard-text">{question.question}</p>
          {!flipped && <p className="flashcard-hint">クリックで答えを表示</p>}
        </div>
        {flipped && (
          <div className="flashcard-back">
            <p className="flashcard-label">答え</p>
            <p className="flashcard-text">
              {question.isOrdered
                ? question.answer.split(';').join(', ')
                : question.answer}
            </p>
          </div>
        )}
      </div>

      {flipped && !answered && (
        <div className="self-score">
          <p>正解しましたか？</p>
          <div className="self-score-buttons">
            <button
              className="btn btn-correct"
              onClick={() => handleSelfScore(true)}
            >
              ○ 正解
            </button>
            <button
              className="btn btn-wrong"
              onClick={() => handleSelfScore(false)}
            >
              × 不正解
            </button>
          </div>
        </div>
      )}

      {answered && (
        <ExplanationPanel
          explanation={question.explanation}
          onNext={handleNext}
          isLast={isLast}
        />
      )}
    </div>
  );
}
