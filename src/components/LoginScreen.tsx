interface Props {
  onSignIn: () => void;
  onSkip: () => void;
}

export function LoginScreen({ onSignIn, onSkip }: Props) {
  return (
    <div className="login-screen">
      <h1>基本情報技術者試験 単語帳</h1>
      <p className="login-desc">
        ログインすると学習履歴がアカウントに紐づきます。
      </p>
      <button className="btn btn-google-large" onClick={onSignIn}>
        Google でログイン
      </button>
      <button className="login-skip" onClick={onSkip}>
        ログインせずに始める
      </button>
    </div>
  );
}
