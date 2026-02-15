import { useState } from 'react';
import type { Question, QuizChoice } from '../types';
import { createQuizChoices } from '../utils/quizLogic';
import { ExplanationPanel } from './ExplanationPanel';

interface Props {
  question: Question;
  allQuestions: Question[];
  onAnswer: (correct: boolean) => void;
  onNext: () => void;
  isLast: boolean;
}

export function QuizCard({
  question,
  allQuestions,
  onAnswer,
  onNext,
  isLast,
}: Props) {
  const [choices] = useState<QuizChoice[]>(() =>
    createQuizChoices(question, allQuestions),
  );
  const [selected, setSelected] = useState<number | null>(null);

  const handleSelect = (index: number) => {
    if (selected !== null) return;
    setSelected(index);
    onAnswer(choices[index].isCorrect);
  };

  const handleNext = () => {
    onNext();
  };

  const getChoiceClass = (index: number) => {
    if (selected === null) return 'quiz-choice';
    if (choices[index].isCorrect) return 'quiz-choice correct';
    if (index === selected && !choices[index].isCorrect)
      return 'quiz-choice wrong';
    return 'quiz-choice disabled';
  };

  return (
    <div className="quiz-container">
      <div className="quiz-question">
        <p>{question.question}</p>
      </div>

      <div className="quiz-choices">
        {choices.map((choice, i) => (
          <button
            key={i}
            className={getChoiceClass(i)}
            onClick={() => handleSelect(i)}
            disabled={selected !== null}
          >
            <span className="choice-label">
              {['A', 'B', 'C', 'D'][i]}.
            </span>
            <span className="choice-text">{choice.text}</span>
          </button>
        ))}
      </div>

      {selected !== null && (
        <ExplanationPanel
          explanation={question.explanation}
          onNext={handleNext}
          isLast={isLast}
        />
      )}
    </div>
  );
}
