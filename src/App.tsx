import { useState } from 'react';
import type { StudyMode } from './types';
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
  const [screen, setScreen] = useState<Screen>('home');
  const [session, setSession] = useState<SessionConfig | null>(null);

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
    />
  );
}

export default App;
