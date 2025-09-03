import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useRouter } from 'next/router';

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const session = supabase.auth.session();
    if (!session) {
      router.push('/enroll'); // redirect to enroll/login if not logged in
      return;
    }
    setUser(session.user);
    fetchAccounts(session.user.id);
  }, []);

  const fetchAccounts = async (userId) => {
    try {
      const { data, error } = await supabase
        .from('accounts')
        .select('account_number, account_type, balance, status')
        .eq('user_id', userId);

      if (error) throw error;
      setAccounts(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/enroll');
  };

  if (loading) return <p>Loading dashboard...</p>;

  return (
    <div style={{ maxWidth: 800, margin: '2rem auto', fontFamily: 'Arial, sans-serif' }}>
      <h1>Welcome, {user?.email}</h1>
      <button onClick={handleLogout} style={{ marginBottom: '1rem' }}>Logout</button>

      <h2>Your Accounts</h2>
      {accounts.length === 0 ? (
        <p>No accounts found.</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #ccc' }}>
              <th style={{ padding: '8px' }}>Account Number</th>
              <th style={{ padding: '8px' }}>Type</th>
              <th style={{ padding: '8px' }}>Balance</th>
              <th style={{ padding: '8px' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {accounts.map((acc) => (
              <tr key={acc.account_number} style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '8px' }}>{acc.account_number}</td>
                <td style={{ padding: '8px' }}>{acc.account_type}</td>
                <td style={{ padding: '8px' }}>${acc.balance.toFixed(2)}</td>
                <td style={{ padding: '8px' }}>
                  {acc.status === 'limited' ? 'Limited (Transactions Disabled)' : 'Active'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
