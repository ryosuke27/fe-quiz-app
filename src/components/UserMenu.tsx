import type { User } from '@supabase/supabase-js';

interface Props {
  user: User;
  onSignOut: () => void;
}

export function UserMenu({ user, onSignOut }: Props) {
  const name =
    user.user_metadata?.full_name ?? user.email ?? 'ユーザー';
  const avatar = user.user_metadata?.avatar_url as string | undefined;
  const initial = name.charAt(0).toUpperCase();

  return (
    <div className="user-menu">
      <div className="user-info">
        {avatar ? (
          <img className="user-avatar" src={avatar} alt="" />
        ) : (
          <span className="user-avatar user-avatar--initial">{initial}</span>
        )}
        <span className="user-name">{name}</span>
      </div>
      <button className="btn-logout" onClick={onSignOut}>
        ログアウト
      </button>
    </div>
  );
}
