interface Props {
  current: number;
  total: number;
  correctCount: number;
  answeredCount: number;
}

export function ProgressBar({ current, total, correctCount, answeredCount }: Props) {
  const pct = total > 0 ? ((current + 1) / total) * 100 : 0;

  return (
    <div className="progress-bar-container">
      <div className="progress-info">
        <span>
          問題 {current + 1} / {total}
        </span>
        {answeredCount > 0 && (
          <span>
            正解: {correctCount} / {answeredCount}
          </span>
        )}
      </div>
      <div className="progress-track">
        <div className="progress-fill" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
