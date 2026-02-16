import { useState } from 'react';
import type { StudyMode } from './types';
import { useAuth } from './hooks/useAuth';
import { LoginScreen } from './components/LoginScreen';
import { HomeScreen } from './components/HomeScreen';
import { StudySession } from './components/StudySession';
import { HistoryScreen } from './components/HistoryScreen';
import './App.css';

interface SessionConfig {
  csvPath: string;
  mode: StudyMode;
  doShuffle: boolean;
}

type Screen = 'home' | 'session' | 'history';

function App() {
  const { user, loading: authLoading, signInWithGoogle, signOut } = useAuth();
  const [screen, setScreen] = useState<Screen>('home');
  const [session, setSession] = useState<SessionConfig | null>(null);
  const [loginSkipped, setLoginSkipped] = useState(false);

  if (authLoading) {
    return (
      <div className="loading">
        <p>読み込み中...</p>
      </div>
    );
  }

  // 未ログイン & スキップしていない → ログイン画面
  if (!user && !loginSkipped) {
    return (
      <LoginScreen
        onSignIn={signInWithGoogle}
        onSkip={() => setLoginSkipped(true)}
      />
    );
  }

  if (screen === 'history') {
    return <HistoryScreen onBack={() => setScreen('home')} />;
  }

  if (screen === 'session' && session) {
    return (
      <StudySession
        key={session.csvPath + session.mode + Date.now()}
        csvPath={session.csvPath}
        mode={session.mode}
        doShuffle={session.doShuffle}
        userId={user?.id}
        onHome={() => {
          setSession(null);
          setScreen('home');
        }}
      />
    );
  }

  return (
    <HomeScreen
      onStart={(csvPath, mode, doShuffle) => {
        setSession({ csvPath, mode, doShuffle });
        setScreen('session');
      }}
      onHistory={() => setScreen('history')}
      user={user}
      onSignOut={signOut}
    />
  );
}

export default App;
