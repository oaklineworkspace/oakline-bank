// pages/transfer.js
import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function Transfer() {
  const [accounts, setAccounts] = useState([]);
  const [fromAccount, setFromAccount] = useState('');
  const [toAccountNumber, setToAccountNumber] = useState('');
  const [amount, setAmount] = useState('');
  const [transferType, setTransferType] = useState('domestic');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchAccounts = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: userInfo } = await supabase
        .from('users')
        .select('id')
        .eq('email', user.email)
        .single();

      if (!userInfo) return;

      const { data: accountsData } = await supabase
        .from('accounts')
        .select('*')
        .eq('user_id', userInfo.id);

      setAccounts(accountsData || []);
      if (accountsData.length > 0) setFromAccount(accountsData[0].id);
    };

    fetchAccounts();
  }, []);

  const handleTransfer = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    if (!fromAccount || !toAccountNumber || !amount || parseFloat(amount) <= 0) {
      setMessage('Please fill all fields correctly.');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/transactions-management', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'transfer',
          fromAccountId: fromAccount,
          toAccountNumber,
          amount,
          transferType
        })
      });

      const data = await res.json();

      if (res.ok) {
        setMessage(`Success! ${data.message}`);
        setAmount('');
        setToAccountNumber('');
      } else {
        setMessage(`Error: ${data.error}`);
      }
    } catch (err) {
      setMessage(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ maxWidth: '600px', margin: '0 auto', padding: '40px' }}>
      <h1>Transfer Funds</h1>
      {message && <p>{message}</p>}
      <form onSubmit={handleTransfer}>
        <label>
          From Account:
          <select value={fromAccount} onChange={(e) => setFromAccount(e.target.value)}>
            {accounts.map(acc => (
              <option key={acc.id} value={acc.id}>
                {acc.account_number} ({acc.account_type}) - ${acc.balance.toFixed(2)}
              </option>
            ))}
          </select>
        </label>

        <label>
          To Account Number:
          <input
            type="text"
            value={toAccountNumber}
            onChange={(e) => setToAccountNumber(e.target.value)}
            required
          />
        </label>

        <label>
          Amount:
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            step="0.01"
            min="0.01"
            required
          />
        </label>

        <label>
          Transfer Type:
          <select value={transferType} onChange={(e) => setTransferType(e.target.value)}>
            <option value="domestic">Domestic</option>
            <option value="international">International</option>
          </select>
        </label>

        <button type="submit" disabled={loading}>
          {loading ? 'Processing...' : 'Transfer'}
        </button>
      </form>
    </div>
  );
}
