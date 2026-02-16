import { useState } from 'react';
import type { User } from '@supabase/supabase-js';

interface Props {
  user: User;
  onSignOut: () => void;
}

export function UserMenu({ user, onSignOut }: Props) {
  const [open, setOpen] = useState(false);

  const name =
    user.user_metadata?.full_name ?? user.email ?? 'ユーザー';
  const avatar = user.user_metadata?.avatar_url as string | undefined;

  return (
    <div className="user-menu-wrapper">
      <button className="user-menu-trigger" onClick={() => setOpen(!open)}>
        {avatar ? (
          <img className="user-avatar" src={avatar} alt="" />
        ) : (
          <span className="user-avatar-fallback">
            {name.charAt(0).toUpperCase()}
          </span>
        )}
      </button>
      {open && (
        <>
          <div className="user-menu-backdrop" onClick={() => setOpen(false)} />
          <div className="user-menu-dropdown">
            <p className="user-menu-name">{name}</p>
            <button className="btn btn-secondary btn-logout" onClick={onSignOut}>
              ログアウト
            </button>
          </div>
        </>
      )}
    </div>
  );
}
