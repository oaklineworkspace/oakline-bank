// pages/bill-pay.js
import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function BillPay() {
  const [accounts, setAccounts] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState('');
  const [payee, setPayee] = useState('');
  const [amount, setAmount] = useState('');
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
      if (accountsData.length > 0) setSelectedAccount(accountsData[0].id);
    };

    fetchAccounts();
  }, []);

  const handleBillPay = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    if (!selectedAccount || !payee || !amount || parseFloat(amount) <= 0) {
      setMessage('Fill all fields correctly.');
      setLoading(false);
      return;
    }

    try {
      const account = accounts.find(a => a.id === selectedAccount);

      if (parseFloat(amount) > account.balance) {
        setMessage('Insufficient balance.');
        setLoading(false);
        return;
      }

      // Deduct from account
      await supabase.from('accounts').update({
        balance: account.balance - parseFloat(amount)
      }).eq('id', selectedAccount);

      // Create transaction
      await supabase.from('transactions').insert({
        account_id: selectedAccount,
        type: 'Bill Payment',
        amount: parseFloat(amount),
        status: 'completed',
        reference: payee
      });

      setMessage(`Successfully paid $${parseFloat(amount).toFixed(2)} to ${payee}`);
      setPayee('');
      setAmount('');
    } catch (err) {
      setMessage(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ maxWidth: '600px', margin: '0 auto', padding: '40px' }}>
      <h1>Bill Pay</h1>
      {message && <p>{message}</p>}
      <form onSubmit={handleBillPay}>
        <label>
          From Account:
          <select value={selectedAccount} onChange={(e) => setSelectedAccount(e.target.value)}>
            {accounts.map(acc => (
              <option key={acc.id} value={acc.id}>
                {acc.account_number} ({acc.account_type}) - ${acc.balance.toFixed(2)}
              </option>
            ))}
          </select>
        </label>

        <label>
          Payee Name:
          <input
            type="text"
            value={payee}
            onChange={(e) => setPayee(e.target.value)}
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

        <button type="submit" disabled={loading}>
          {loading ? 'Processing...' : 'Pay Bill'}
        </button>
      </form>
    </div>
  );
}
