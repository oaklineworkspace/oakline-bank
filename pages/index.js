import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import Header from '../components/Header';
import LoginForm from '../components/LoginForm';
import UserProfile from '../components/UserProfile';

export default function Home() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check if user is already logged in
    const session = supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user || null);
    });

    // Listen for auth changes (login/logout)
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    return () => authListener.subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  return (
    <div>
      <Header />
      {user ? (
        <UserProfile user={user} onLogout={handleLogout} />
      ) : (
        <LoginForm onLogin={setUser} />
      )}
    </div>
  )
}
