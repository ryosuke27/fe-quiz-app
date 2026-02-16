import { useState } from 'react';
import type { User } from '@supabase/supabase-js';
import type { StudyMode, CsvFile } from '../types';
import { UserMenu } from './UserMenu';

const CSV_FILES: CsvFile[] = [
  { label: 'FE試験 問題集2（415問）', path: '/FE試験_問題集2.csv' },
  { label: '基数変換 問題集（35問）', path: '/基数変換_問題集.csv' },
];

interface Props {
  onStart: (csvPath: string, mode: StudyMode, doShuffle: boolean) => void;
  onHistory: () => void;
  user: User | null;
  onSignOut: () => void;
}

export function HomeScreen({ onStart, onHistory, user, onSignOut }: Props) {
  const [selectedFile, setSelectedFile] = useState(0);
  const [mode, setMode] = useState<StudyMode>('flashcard');
  const [doShuffle, setDoShuffle] = useState(true);

  const handleStart = () => {
    onStart(CSV_FILES[selectedFile].path, mode, doShuffle);
  };

  return (
    <div className="home-screen">
      {user && (
        <div className="global-header">
          <UserMenu user={user} onSignOut={onSignOut} />
        </div>
      )}

      <h1>基本情報技術者試験 単語帳</h1>

      <div className="home-card">
        <h2>問題集を選択</h2>
        <div className="file-options">
          {CSV_FILES.map((f, i) => (
            <label
              key={f.path}
              className={`file-option ${selectedFile === i ? 'selected' : ''}`}
            >
              <input
                type="radio"
                name="csvFile"
                checked={selectedFile === i}
                onChange={() => setSelectedFile(i)}
              />
              <span>{f.label}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="home-card">
        <h2>学習モード</h2>
        <div className="mode-options">
          <button
            className={`mode-btn ${mode === 'flashcard' ? 'active' : ''}`}
            onClick={() => setMode('flashcard')}
          >
            <span className="mode-icon">📇</span>
            <span className="mode-label">フラッシュカード</span>
            <span className="mode-desc">カードをめくって学習</span>
          </button>
          <button
            className={`mode-btn ${mode === 'quiz' ? 'active' : ''}`}
            onClick={() => setMode('quiz')}
          >
            <span className="mode-icon">✍️</span>
            <span className="mode-label">4択クイズ</span>
            <span className="mode-desc">選択肢から解答</span>
          </button>
        </div>
      </div>

      <div className="home-card">
        <label className="shuffle-toggle">
          <input
            type="checkbox"
            checked={doShuffle}
            onChange={(e) => setDoShuffle(e.target.checked)}
          />
          <span>問題をシャッフルする</span>
        </label>
      </div>

      <button className="btn btn-primary btn-start" onClick={handleStart}>
        学習を開始する
      </button>

      <button className="btn btn-secondary btn-history" onClick={onHistory}>
        学習履歴
      </button>
    </div>
  );
}
