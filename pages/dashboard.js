// pages/dashboard.js

import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useRouter } from 'next/router';

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Fetch the logged-in user
  useEffect(() => {
    const fetchUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/login');
        return;
      }
      setUser(session.user);

      // Fetch accounts
      const { data: accountsData, error } = await supabase
        .from('accounts')
        .select('*')
        .eq('user_id', session.user.id);

      if (error) {
        console.error(error);
      } else {
        setAccounts(accountsData);
      }
      setLoading(false);
    };

    fetchUser();
  }, []);

  if (loading) return <p>Loading your dashboard...</p>;

  return (
    <div className="container" style={{ maxWidth: '800px', margin: '0 auto', padding: '40px' }}>
      <h1>Welcome to Oakline Bank, {user?.email}</h1>
      <p>Your accounts are currently in <strong>limited mode</strong>. Full features will unlock after verification.</p>

      <h2>Your Accounts</h2>
      {accounts.length === 0 ? (
        <p>No accounts found.</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ border: '1px solid #ccc', padding: '8px' }}>Account Number</th>
              <th style={{ border: '1px solid #ccc', padding: '8px' }}>Type</th>
              <th style={{ border: '1px solid #ccc', padding: '8px' }}>Balance</th>
              <th style={{ border: '1px solid #ccc', padding: '8px' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {accounts.map(acc => (
              <tr key={acc.id}>
                <td style={{ border: '1px solid #ccc', padding: '8px' }}>{acc.account_number}</td>
                <td style={{ border: '1px solid #ccc', padding: '8px' }}>{acc.account_type}</td>
                <td style={{ border: '1px solid #ccc', padding: '8px' }}>${acc.balance.toFixed(2)}</td>
                <td style={{ border: '1px solid #ccc', padding: '8px' }}>{acc.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <h2>Quick Actions</h2>
      <p>Transactions are currently disabled until your account is fully verified.</p>
      <ul>
        <li>Deposit: Disabled</li>
        <li>Transfer: Disabled</li>
        <li>Bill Pay: Disabled</li>
      </ul>
    </div>
  );
}
