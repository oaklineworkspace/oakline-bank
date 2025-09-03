// pages/dashboard.js
import { useEffect, useState } from 'react';
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
      router.push('/enroll'); // Redirect to enroll/login if not authenticated
    } else {
      fetchUserData(session.user.id);
    }
  }, []);

  const fetchUserData = async (userId) => {
    setLoading(true);
    try {
      // Fetch user info
      const { data: users, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (userError) throw userError;
      setUser(users);

      // Fetch accounts for this user
      const { data: userAccounts, error: accountsError } = await supabase
        .from('accounts')
        .select('*')
        .eq('user_id', userId);

      if (accountsError) throw accountsError;
      setAccounts(userAccounts);
    } catch (err) {
      console.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p style={{ textAlign: 'center', marginTop: '50px' }}>Loading your dashboard...</p>;

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', padding: '2rem' }}>
      <h1>Welcome, {user?.first_name || 'Customer'}!</h1>
      <p>Your online banking account is currently in <strong>limited mode</strong>.</p>
      <p>Transactions and transfers will be available after verification.</p>

      {accounts.length === 0 ? (
        <p>You do not have any accounts yet.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginTop: '20px' }}>
          {accounts.map((acc) => (
            <div key={acc.id} style={{ padding: '15px', border: '1px solid #ccc', borderRadius: '8px', backgroundColor: '#f9f9f9' }}>
              <p><strong>Account Number:</strong> {acc.account_number}</p>
              <p><strong>Account Type:</strong> {acc.account_type}</p>
              <p><strong>Balance:</strong> ${acc.balance.toFixed(2)}</p>
              <p><strong>Status:</strong> {acc.status}</p>
            </div>
          ))}
        </div>
      )}

      <div style={{ marginTop: '40px', textAlign: 'center' }}>
        <button disabled style={{
          padding: '10px 20px',
          backgroundColor: '#0070f3',
          color: '#fff',
          border: 'none',
          borderRadius: '5px',
          cursor: 'not-allowed'
        }}>
          Make Transfer (Disabled)
        </button>
      </div>
    </div>
  );
}
