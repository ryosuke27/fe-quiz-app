interface Props {
  explanation: string;
  onNext: () => void;
  isLast: boolean;
}

export function ExplanationPanel({ explanation, onNext, isLast }: Props) {
  return (
    <div className="explanation-panel">
      {explanation && (
        <div className="explanation-text">
          <strong>解説:</strong> {explanation}
        </div>
      )}
      <button className="btn btn-primary" onClick={onNext}>
        {isLast ? '結果を見る' : '次の問題へ'}
      </button>
    </div>
  );
}
