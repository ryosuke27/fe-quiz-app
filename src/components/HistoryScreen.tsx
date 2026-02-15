import { useEffect, useState } from 'react';
import { supabase } from '../utils/supabase';
import type { DbSession } from '../types';

interface WeakQuestion {
  question_text: string;
  correct_answer: string;
  total: number;
  wrong: number;
  wrongRate: number;
}

interface Props {
  onBack: () => void;
}

export function HistoryScreen({ onBack }: Props) {
  const [sessions, setSessions] = useState<DbSession[]>([]);
  const [weakQuestions, setWeakQuestions] = useState<WeakQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<'sessions' | 'weak'>('sessions');

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }

    const client = supabase;

    const fetchData = async () => {
      const { data: sessionData } = await client
        .from('sessions')
        .select('*')
        .order('created_at', { ascending: false });

      if (sessionData) {
        setSessions(sessionData);
      }

      const { data: answerData } = await client
        .from('answer_records')
        .select('question_text, correct_answer, is_correct');

      if (answerData) {
        const map = new Map<string, { question_text: string; correct_answer: string; total: number; wrong: number }>();
        for (const row of answerData) {
          const key = row.question_text;
          const entry = map.get(key) ?? { question_text: row.question_text, correct_answer: row.correct_answer, total: 0, wrong: 0 };
          entry.total++;
          if (!row.is_correct) entry.wrong++;
          map.set(key, entry);
        }
        const weak = Array.from(map.values())
          .filter((e) => e.wrong > 0)
          .map((e) => ({ ...e, wrongRate: e.wrong / e.total }))
          .sort((a, b) => b.wrongRate - a.wrongRate || b.wrong - a.wrong)
          .slice(0, 50);
        setWeakQuestions(weak);
      }

      setLoading(false);
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="loading">
        <p>読み込み中...</p>
      </div>
    );
  }

  if (!supabase) {
    return (
      <div className="history-screen">
        <button className="btn btn-secondary btn-back" onClick={onBack}>
          ← ホーム
        </button>
        <p className="history-empty">Supabaseが設定されていません。</p>
      </div>
    );
  }

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleDateString('ja-JP', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const modeLabel = (m: string) => (m === 'quiz' ? '4択クイズ' : 'フラッシュカード');

  return (
    <div className="history-screen">
      <div className="session-header">
        <button className="btn btn-secondary btn-back" onClick={onBack}>
          ← ホーム
        </button>
        <h1 className="history-title">学習履歴</h1>
      </div>

      <div className="history-tabs">
        <button
          className={`history-tab ${tab === 'sessions' ? 'active' : ''}`}
          onClick={() => setTab('sessions')}
        >
          セッション一覧
        </button>
        <button
          className={`history-tab ${tab === 'weak' ? 'active' : ''}`}
          onClick={() => setTab('weak')}
        >
          苦手問題
        </button>
      </div>

      {tab === 'sessions' && (
        <div className="history-list">
          {sessions.length === 0 ? (
            <p className="history-empty">まだ学習履歴がありません。</p>
          ) : (
            sessions.map((s) => (
              <div key={s.id} className="history-item">
                <div className="history-item-header">
                  <span className="history-date">{formatDate(s.created_at)}</span>
                  <span className="history-mode">{modeLabel(s.mode)}</span>
                </div>
                <p className="history-file">{s.csv_file.replace(/^\//, '')}</p>
                <div className="history-score">
                  <span className="history-score-num">
                    {s.correct_count} / {s.total_count}
                  </span>
                  <span className="history-score-pct">
                    {s.total_count > 0 ? Math.round((s.correct_count / s.total_count) * 100) : 0}%
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {tab === 'weak' && (
        <div className="history-list">
          {weakQuestions.length === 0 ? (
            <p className="history-empty">苦手問題はまだありません。</p>
          ) : (
            weakQuestions.map((q, i) => (
              <div key={i} className="history-item weak-item">
                <div className="weak-header">
                  <span className="weak-rate">
                    不正解率 {Math.round(q.wrongRate * 100)}%
                  </span>
                  <span className="weak-count">
                    ({q.wrong}/{q.total}回)
                  </span>
                </div>
                <p className="weak-question">{q.question_text}</p>
                <p className="weak-answer">答え: {q.correct_answer}</p>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
