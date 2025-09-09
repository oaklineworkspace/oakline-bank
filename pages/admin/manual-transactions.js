
import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';

export default function ManualTransactions() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState('');
  const [accounts, setAccounts] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState('');
  const [transactionType, setTransactionType] = useState('deposit');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    if (selectedUser) {
      fetchUserAccounts(selectedUser);
    }
  }, [selectedUser]);

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, email, first_name, last_name')
        .order('first_name');

      if (error) throw error;
      setUsers(data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
      setMessage('Error fetching users');
    }
  };

  const fetchUserAccounts = async (userId) => {
    try {
      const { data, error } = await supabase
        .from('accounts')
        .select('*')
        .eq('user_id', userId)
        .order('account_name');

      if (error) throw error;
      setAccounts(data || []);
      setSelectedAccount('');
    } catch (error) {
      console.error('Error fetching accounts:', error);
      setMessage('Error fetching user accounts');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedAccount || !amount || parseFloat(amount) <= 0) {
      setMessage('Please fill all fields with valid values');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const response = await fetch('/api/admin/manual-transaction', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          accountId: selectedAccount,
          userId: selectedUser,
          type: transactionType,
          amount: parseFloat(amount),
          description: description || `Manual ${transactionType}`,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        setMessage('Transaction added successfully!');
        setAmount('');
        setDescription('');
        // Refresh accounts to show updated balance
        fetchUserAccounts(selectedUser);
      } else {
        setMessage(`Error: ${result.error}`);
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage('Failed to add transaction');
    } finally {
      setLoading(false);
    }
  };

  const transactionTypes = [
    { value: 'deposit', label: 'Deposit (Add Money)' },
    { value: 'withdrawal', label: 'Withdrawal (Remove Money)' },
    { value: 'fee', label: 'Fee (Remove Money)' },
    { value: 'interest', label: 'Interest (Add Money)' },
    { value: 'bonus', label: 'Bonus (Add Money)' },
    { value: 'refund', label: 'Refund (Add Money)' },
    { value: 'adjustment', label: 'Manual Adjustment' }
  ];

  const selectedAccountData = accounts.find(acc => acc.id === selectedAccount);

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Manual Transaction Management</h1>
      
      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.formGroup}>
          <label style={styles.label}>Select User:</label>
          <select
            value={selectedUser}
            onChange={(e) => setSelectedUser(e.target.value)}
            style={styles.select}
            required
          >
            <option value="">Choose a user...</option>
            {users.map(user => (
              <option key={user.id} value={user.id}>
                {user.first_name} {user.last_name} ({user.email})
              </option>
            ))}
          </select>
        </div>

        {selectedUser && (
          <div style={styles.formGroup}>
            <label style={styles.label}>Select Account:</label>
            <select
              value={selectedAccount}
              onChange={(e) => setSelectedAccount(e.target.value)}
              style={styles.select}
              required
            >
              <option value="">Choose an account...</option>
              {accounts.map(account => (
                <option key={account.id} value={account.id}>
                  {account.account_name} - {account.account_number} (Balance: ${account.balance})
                </option>
              ))}
            </select>
          </div>
        )}

        {selectedAccount && (
          <>
            <div style={styles.accountInfo}>
              <h3>Current Account Balance: ${selectedAccountData?.balance}</h3>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Transaction Type:</label>
              <select
                value={transactionType}
                onChange={(e) => setTransactionType(e.target.value)}
                style={styles.select}
                required
              >
                {transactionTypes.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Amount ($):</label>
              <input
                type="number"
                step="0.01"
                min="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                style={styles.input}
                placeholder="Enter amount"
                required
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Description:</label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                style={styles.input}
                placeholder="Optional description"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                ...styles.button,
                backgroundColor: loading ? '#ccc' : '#007bff'
              }}
            >
              {loading ? 'Processing...' : 'Add Transaction'}
            </button>
          </>
        )}
      </form>

      {message && (
        <div
          style={{
            ...styles.message,
            backgroundColor: message.includes('Error') ? '#ffebee' : '#e8f5e8',
            color: message.includes('Error') ? '#c62828' : '#2e7d32'
          }}
        >
          {message}
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '600px',
    margin: '0 auto',
    padding: '20px',
    fontFamily: 'Arial, sans-serif'
  },
  title: {
    color: '#1a365d',
    textAlign: 'center',
    marginBottom: '30px'
  },
  form: {
    backgroundColor: '#f8f9fa',
    padding: '30px',
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
  },
  formGroup: {
    marginBottom: '20px'
  },
  label: {
    display: 'block',
    marginBottom: '5px',
    fontWeight: 'bold',
    color: '#333'
  },
  select: {
    width: '100%',
    padding: '10px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '16px'
  },
  input: {
    width: '100%',
    padding: '10px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '16px'
  },
  button: {
    width: '100%',
    padding: '12px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    fontSize: '16px',
    cursor: 'pointer',
    fontWeight: 'bold'
  },
  message: {
    padding: '10px',
    borderRadius: '4px',
    marginTop: '20px',
    textAlign: 'center'
  },
  accountInfo: {
    backgroundColor: '#e3f2fd',
    padding: '15px',
    borderRadius: '4px',
    marginBottom: '20px',
    textAlign: 'center'
  }
};
