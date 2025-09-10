
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../../lib/supabaseClient';

export default function AdminAssignCard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [users, setUsers] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [selectedUser, setSelectedUser] = useState('');
  const [selectedAccount, setSelectedAccount] = useState('');
  const [cardType, setCardType] = useState('debit');
  const [cardName, setCardName] = useState('');
  const router = useRouter();

  const ADMIN_PASSWORD = 'Chrismorgan23$';

  useEffect(() => {
    const adminAuth = localStorage.getItem('adminAuthenticated');
    if (adminAuth === 'true') {
      setIsAuthenticated(true);
      fetchData();
    }
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      localStorage.setItem('adminAuthenticated', 'true');
      setError('');
      fetchData();
    } else {
      setError('Invalid password');
    }
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch users from applications
      const { data: applicationsData, error: appError } = await supabase
        .from('applications')
        .select('*')
        .order('created_at', { ascending: false });

      if (!appError && applicationsData) {
        setUsers(applicationsData);
      }

      // Fetch all accounts
      const { data: accountsData, error: accountsError } = await supabase
        .from('accounts')
        .select('*')
        .order('created_at', { ascending: false });

      if (!accountsError && accountsData) {
        setAccounts(accountsData);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const handleUserChange = (e) => {
    const userId = e.target.value;
    setSelectedUser(userId);
    setSelectedAccount('');
    
    // Auto-populate card name if user is selected
    const selectedUserData = users.find(u => u.id === userId);
    if (selectedUserData) {
      setCardName(`${selectedUserData.first_name} ${selectedUserData.last_name}`);
    }
  };

  const generateCardNumber = () => {
    // Generate a realistic-looking card number (not for real use)
    const prefix = '4532'; // Visa-like prefix for demo
    let cardNumber = prefix;
    
    for (let i = 0; i < 12; i++) {
      cardNumber += Math.floor(Math.random() * 10);
    }
    
    return cardNumber.match(/.{1,4}/g).join(' ');
  };

  const generateExpiryDate = () => {
    const now = new Date();
    const expiryYear = now.getFullYear() + 3; // 3 years from now
    const expiryMonth = String(now.getMonth() + 1).padStart(2, '0');
    return `${expiryMonth}/${expiryYear.toString().slice(-2)}`;
  };

  const generateCVV = () => {
    return Math.floor(100 + Math.random() * 900).toString();
  };

  const assignCard = async (e) => {
    e.preventDefault();
    if (!selectedAccount || !cardName) {
      setError('Please select an account and enter cardholder name');
      return;
    }

    setLoading(true);
    setMessage('');
    setError('');

    try {
      // Get account and user details
      const selectedAccountData = accounts.find(acc => acc.id === selectedAccount);
      const selectedUserData = users.find(user => user.id === selectedUser);

      if (!selectedAccountData || !selectedUserData) {
        throw new Error('Account or user not found');
      }

      // Generate card details
      const cardNumber = generateCardNumber();
      const expiryDate = generateExpiryDate();
      const cvv = generateCVV();

      // Insert card into database
      const { data: cardData, error: cardError } = await supabase
        .from('cards')
        .insert({
          user_id: selectedUserData.email, // Using email as user_id for consistency
          account_id: selectedAccount,
          account_number: selectedAccountData.account_number,
          card_number: cardNumber,
          cardholder_name: cardName.toUpperCase(),
          expiry_date: expiryDate,
          cvv: cvv,
          card_type: cardType,
          status: 'active',
          daily_limit: 2000.00,
          monthly_limit: 10000.00,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (cardError) throw cardError;

      // Create transaction record for card assignment
      const { error: transactionError } = await supabase
        .from('transactions')
        .insert({
          account_id: selectedAccount,
          account_number: selectedAccountData.account_number,
          type: 'credit',
          amount: 0,
          description: `New ${cardType} card assigned: ****${cardNumber.slice(-4)}`,
          status: 'completed',
          created_at: new Date().toISOString()
        });

      if (transactionError) {
        console.error('Transaction record error:', transactionError);
      }

      setMessage(`✅ ${cardType} card successfully assigned! 
        Card Number: ${cardNumber}
        Expiry: ${expiryDate}
        CVV: ${cvv}
        Cardholder: ${cardName}`);
      
      // Reset form
      setCardName('');
      setSelectedAccount('');
      setSelectedUser('');
      
    } catch (error) {
      console.error('Error assigning card:', error);
      setError(`❌ Failed to assign card: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const getUserAccounts = (userId) => {
    return accounts.filter(acc => 
      acc.application_id === userId || acc.user_id === userId
    );
  };

  if (!isAuthenticated) {
    return (
      <div style={styles.loginContainer}>
        <div style={styles.loginCard}>
          <h1 style={styles.title}>💳 Admin Card Assignment</h1>
          <form onSubmit={handleLogin} style={styles.form}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Admin Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={styles.input}
                placeholder="Enter admin password"
                required
              />
            </div>
            {error && <div style={styles.error}>{error}</div>}
            <button type="submit" style={styles.loginButton}>
              🔐 Access Card Assignment
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>💳 Assign Debit Card</h1>
        <button onClick={() => router.push('/admin/admin-dashboard')} style={styles.backButton}>
          ← Back to Dashboard
        </button>
      </div>

      {message && <div style={styles.success}>{message}</div>}
      {error && <div style={styles.error}>{error}</div>}

      <div style={styles.card}>
        <h2 style={styles.cardTitle}>Assign New Card to User</h2>
        <form onSubmit={assignCard} style={styles.form}>
          <div style={styles.formGrid}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Select User</label>
              <select
                value={selectedUser}
                onChange={handleUserChange}
                style={styles.select}
                required
              >
                <option value="">Choose a user...</option>
                {users.map(user => (
                  <option key={user.id} value={user.id}>
                    {user.first_name} {user.last_name} - {user.email}
                  </option>
                ))}
              </select>
            </div>

            {selectedUser && (
              <div style={styles.inputGroup}>
                <label style={styles.label}>Select Account</label>
                <select
                  value={selectedAccount}
                  onChange={(e) => setSelectedAccount(e.target.value)}
                  style={styles.select}
                  required
                >
                  <option value="">Choose an account...</option>
                  {getUserAccounts(selectedUser).map(account => (
                    <option key={account.id} value={account.id}>
                      {account.account_type} - ****{account.account_number?.slice(-4)} 
                      (Balance: ${parseFloat(account.balance || 0).toLocaleString()})
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div style={styles.inputGroup}>
              <label style={styles.label}>Card Type</label>
              <select
                value={cardType}
                onChange={(e) => setCardType(e.target.value)}
                style={styles.select}
              >
                <option value="debit">Debit Card</option>
                <option value="credit">Credit Card</option>
                <option value="prepaid">Prepaid Card</option>
              </select>
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Cardholder Name</label>
              <input
                type="text"
                value={cardName}
                onChange={(e) => setCardName(e.target.value)}
                style={styles.input}
                placeholder="Enter name as it should appear on card"
                required
              />
            </div>
          </div>

          <div style={styles.cardPreview}>
            <h3>Card Preview</h3>
            <div style={styles.virtualCard}>
              <div style={styles.cardHeader}>
                <span style={styles.bankName}>OAKLINE BANK</span>
                <span style={styles.cardTypeLabel}>{cardType.toUpperCase()}</span>
              </div>
              <div style={styles.cardChip}></div>
              <div style={styles.cardNumber}>#### #### #### ####</div>
              <div style={styles.cardDetails}>
                <div>
                  <div style={styles.cardLabel}>VALID THRU</div>
                  <div style={styles.cardValue}>MM/YY</div>
                </div>
                <div>
                  <div style={styles.cardLabel}>CARDHOLDER</div>
                  <div style={styles.cardValue}>{cardName.toUpperCase() || 'CARD HOLDER'}</div>
                </div>
              </div>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading || !selectedAccount}
            style={{
              ...styles.submitButton,
              opacity: (loading || !selectedAccount) ? 0.5 : 1,
              cursor: (loading || !selectedAccount) ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? 'Assigning Card...' : `Assign ${cardType} Card`}
          </button>
        </form>
      </div>
    </div>
  );
}

const styles = {
  loginContainer: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #1e3a8a 0%, #3730a3 100%)',
    padding: '20px'
  },
  loginCard: {
    background: 'white',
    padding: '40px',
    borderRadius: '16px',
    boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
    width: '100%',
    maxWidth: '400px'
  },
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #1e3a8a 0%, #3730a3 100%)',
    padding: '20px'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '30px',
    background: 'white',
    padding: '20px',
    borderRadius: '12px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
  },
  title: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#1e3a8a',
    margin: 0
  },
  backButton: {
    background: '#6b7280',
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px'
  },
  card: {
    background: 'white',
    borderRadius: '12px',
    padding: '24px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
    marginBottom: '20px'
  },
  cardTitle: {
    fontSize: '20px',
    fontWeight: 'bold',
    color: '#1e3a8a',
    marginBottom: '20px'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px'
  },
  formGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '16px'
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px'
  },
  label: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#374151'
  },
  input: {
    padding: '12px',
    border: '1px solid #d1d5db',
    borderRadius: '8px',
    fontSize: '16px',
    outline: 'none'
  },
  select: {
    padding: '12px',
    border: '1px solid #d1d5db',
    borderRadius: '8px',
    fontSize: '16px',
    outline: 'none',
    backgroundColor: 'white'
  },
  submitButton: {
    background: '#10b981',
    color: 'white',
    border: 'none',
    padding: '14px 24px',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer'
  },
  loginButton: {
    background: '#1e3a8a',
    color: 'white',
    border: 'none',
    padding: '12px 24px',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer'
  },
  success: {
    background: '#d1fae5',
    border: '1px solid #86efac',
    color: '#065f46',
    padding: '12px 16px',
    borderRadius: '8px',
    marginBottom: '20px',
    fontSize: '14px',
    whiteSpace: 'pre-line'
  },
  error: {
    background: '#fee2e2',
    border: '1px solid #fca5a5',
    color: '#dc2626',
    padding: '12px 16px',
    borderRadius: '8px',
    marginBottom: '20px',
    fontSize: '14px'
  },
  cardPreview: {
    marginTop: '20px',
    textAlign: 'center'
  },
  virtualCard: {
    width: '320px',
    height: '200px',
    background: 'linear-gradient(135deg, #1e3a8a 0%, #3730a3 100%)',
    borderRadius: '16px',
    padding: '20px',
    color: 'white',
    margin: '0 auto',
    position: 'relative',
    boxShadow: '0 8px 25px rgba(30, 58, 138, 0.3)'
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px'
  },
  bankName: {
    fontSize: '14px',
    fontWeight: 'bold',
    letterSpacing: '1px'
  },
  cardTypeLabel: {
    fontSize: '12px',
    fontWeight: 'bold',
    background: 'rgba(255,255,255,0.2)',
    padding: '4px 8px',
    borderRadius: '4px'
  },
  cardChip: {
    width: '30px',
    height: '24px',
    background: 'linear-gradient(45deg, #ffd700, #ffa500)',
    borderRadius: '4px',
    marginBottom: '20px'
  },
  cardNumber: {
    fontSize: '18px',
    letterSpacing: '2px',
    marginBottom: '20px',
    fontFamily: 'monospace'
  },
  cardDetails: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-end'
  },
  cardLabel: {
    fontSize: '8px',
    marginBottom: '2px',
    opacity: 0.8
  },
  cardValue: {
    fontSize: '12px',
    fontWeight: 'bold'
  }
};
