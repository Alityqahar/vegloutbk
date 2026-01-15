import { useEffect, useState } from 'react';
import Navbar, { LoadingScreen } from '../../components/Navbar/Navbar';
import { supabase } from '../../lib/supabase';
import TodoList from '../../components/todo/TodoList';

export default function TodoPage() {
  const [checking, setChecking] = useState(true);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    let mounted = true;
    supabase.auth.getUser().then(({ data }) => {
      if (!mounted) return;
      const user = data?.user;
      setUserId(user?.id ?? null);
      setChecking(false);
    }).catch(() => {
      if (mounted) setChecking(false);
    });
    return () => { mounted = false; };
  }, []);

  if (checking) return <LoadingScreen show />;

  return (
    <>
      <Navbar />
      <div style={{ padding: '100px 16px 40px' }}>
        <TodoList userId={userId} />
      </div>
    </>
  );
}
