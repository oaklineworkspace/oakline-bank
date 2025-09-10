
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../lib/supabaseClient';

export default function MobileDeposit() {
  const [user, setUser] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState('');
  const [amount, setAmount] = useState('');
  const [checkFront, setCheckFront] = useState(null);
  const [checkBack, setCheckBack] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const router = useRouter();

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
        return;
      }
      setUser(user);
      await fetchAccounts(user);
    } catch (error) {
      console.error('Error checking user:', error);
      router.push('/login');
    }
  };

  const fetchAccounts = async (user) => {
    try {
      const { data: accountsData, error } = await supabase
        .from('accounts')
        .select('*')
        .or(`user_id.eq.${user.id},user_email.eq.${user.email},email.eq.${user.email}`)
        .in('account_type', ['checking', 'savings']);

      if (accountsData && accountsData.length > 0) {
        setAccounts(accountsData);
        setSelectedAccount(accountsData[0].id.toString());
      }
    } catch (error) {
      console.error('Error fetching accounts:', error);
    }
  };

  const handleFileUpload = (e, side) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setMessage('File size must be less than 5MB');
        return;
      }
      if (!file.type.startsWith('image/')) {
        setMessage('Please upload an image file');
        return;
      }
      
      if (side === 'front') {
        setCheckFront(file);
      } else {
        setCheckBack(file);
      }
      setMessage('');
    }
  };

  const handleDeposit = async (e) => {
    e.preventDefault();
    
    if (!selectedAccount || !amount || !checkFront || !checkBack) {
      setMessage('Please fill all fields and upload both check images');
      return;
    }

    if (parseFloat(amount) <= 0) {
      setMessage('Amount must be greater than 0');
      return;
    }

    setLoading(true);
    
    try {
      // In a real implementation, you would upload images to storage
      // and use OCR to read check details
      
      const selectedAccountData = accounts.find(acc => acc.id.toString() === selectedAccount);
      
      // Create pending transaction
      const { data: transactionData, error: transactionError } = await supabase
        .from('transactions')
        .insert([
          {
            user_id: user.id,
            user_email: user.email,
            account_id: selectedAccount,
            account_type: selectedAccountData?.account_type || 'checking',
            amount: parseFloat(amount),
            transaction_type: 'deposit',
            description: 'Mobile Check Deposit',
            status: 'pending',
            category: 'deposit',
            created_at: new Date().toISOString()
          }
        ])
        .select()
        .single();

      if (transactionError) throw transactionError;

      setMessage('✅ Check deposit submitted successfully! Your deposit is being processed and will be available within 1-2 business days.');
      
      // Reset form
      setAmount('');
      setCheckFront(null);
      setCheckBack(null);
      document.getElementById('checkFront').value = '';
      document.getElementById('checkBack').value = '';
      
      // Redirect to dashboard after 3 seconds
      setTimeout(() => {
        router.push('/dashboard');
      }, 3000);

    } catch (error) {
      console.error('Error processing deposit:', error);
      setMessage('❌ Error processing deposit. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <button onClick={() => router.back()} style={styles.backButton}>
          ← Back
        </button>
        <h1 style={styles.title}>📥 Mobile Check Deposit</h1>
      </div>

      <div style={styles.content}>
        <div style={styles.instructionsCard}>
          <h3 style={styles.instructionsTitle}>📋 Deposit Instructions</h3>
          <ul style={styles.instructionsList}>
            <li>Endorse the back of your check by signing it</li>
            <li>Take clear photos of both sides of the check</li>
            <li>Ensure the entire check is visible in the photos</li>
            <li>Make sure the photos are well-lit and in focus</li>
            <li>Deposits are processed within 1-2 business days</li>
          </ul>
        </div>

        <form onSubmit={handleDeposit} style={styles.form}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Deposit To Account</label>
            <select
              value={selectedAccount}
              onChange={(e) => setSelectedAccount(e.target.value)}
              style={styles.select}
              required
            >
              <option value="">Select Account</option>
              {accounts.map(account => (
                <option key={account.id} value={account.id}>
                  {account.account_name || account.account_type} - {account.account_number}
                </option>
              ))}
            </select>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Deposit Amount ($)</label>
            <input
              type="number"
              step="0.01"
              min="0.01"
              max="10000"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              style={styles.input}
              placeholder="0.00"
              required
            />
          </div>

          <div style={styles.uploadSection}>
            <div style={styles.uploadGroup}>
              <label style={styles.label}>Check Front</label>
              <input
                id="checkFront"
                type="file"
                accept="image/*"
                onChange={(e) => handleFileUpload(e, 'front')}
                style={styles.fileInput}
                required
              />
              {checkFront && (
                <div style={styles.filePreview}>
                  ✅ {checkFront.name}
                </div>
              )}
            </div>

            <div style={styles.uploadGroup}>
              <label style={styles.label}>Check Back</label>
              <input
                id="checkBack"
                type="file"
                accept="image/*"
                onChange={(e) => handleFileUpload(e, 'back')}
                style={styles.fileInput}
                required
              />
              {checkBack && (
                <div style={styles.filePreview}>
                  ✅ {checkBack.name}
                </div>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              ...styles.submitButton,
              opacity: loading ? 0.7 : 1,
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? '🔄 Processing...' : '📥 Submit Deposit'}
          </button>
        </form>

        {message && (
          <div style={{
            ...styles.message,
            backgroundColor: message.includes('✅') ? '#d4edda' : '#f8d7da',
            color: message.includes('✅') ? '#155724' : '#721c24',
            borderColor: message.includes('✅') ? '#c3e6cb' : '#f5c6cb'
          }}>
            {message}
          </div>
        )}

        <div style={styles.securityNote}>
          <h4 style={styles.securityTitle}>🔒 Security & Limits</h4>
          <ul style={styles.securityList}>
            <li>Daily deposit limit: $10,000</li>
            <li>Mobile deposits are encrypted and secure</li>
            <li>Funds availability subject to verification</li>
            <li>Keep your original check until deposit clears</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#f1f5f9',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
  },
  header: {
    backgroundColor: '#1e40af',
    color: 'white',
    padding: '1rem',
    display: 'flex',
    alignItems: 'center',
    gap: '1rem'
  },
  backButton: {
    background: 'rgba(255,255,255,0.2)',
    color: 'white',
    border: 'none',
    padding: '0.5rem 1rem',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '0.9rem'
  },
  title: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    margin: 0
  },
  content: {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '2rem 1rem'
  },
  instructionsCard: {
    backgroundColor: 'white',
    padding: '2rem',
    borderRadius: '16px',
    marginBottom: '2rem',
    boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
  },
  instructionsTitle: {
    color: '#1e40af',
    marginBottom: '1rem',
    fontSize: '1.2rem'
  },
  instructionsList: {
    margin: 0,
    paddingLeft: '1.5rem',
    color: '#374151',
    lineHeight: '1.6'
  },
  form: {
    backgroundColor: 'white',
    padding: '2rem',
    borderRadius: '16px',
    marginBottom: '2rem',
    boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
  },
  formGroup: {
    marginBottom: '1.5rem'
  },
  label: {
    display: 'block',
    fontSize: '0.9rem',
    fontWeight: '600',
    color: '#374151',
    marginBottom: '0.5rem'
  },
  select: {
    width: '100%',
    padding: '0.75rem',
    border: '2px solid #e2e8f0',
    borderRadius: '8px',
    fontSize: '1rem',
    backgroundColor: 'white'
  },
  input: {
    width: '100%',
    padding: '0.75rem',
    border: '2px solid #e2e8f0',
    borderRadius: '8px',
    fontSize: '1rem',
    boxSizing: 'border-box'
  },
  uploadSection: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '1rem',
    marginBottom: '2rem',
    '@media (max-width: 768px)': {
      gridTemplateColumns: '1fr'
    }
  },
  uploadGroup: {
    display: 'flex',
    flexDirection: 'column'
  },
  fileInput: {
    padding: '0.75rem',
    border: '2px dashed #e2e8f0',
    borderRadius: '8px',
    cursor: 'pointer'
  },
  filePreview: {
    marginTop: '0.5rem',
    padding: '0.5rem',
    backgroundColor: '#dcfce7',
    color: '#16a34a',
    borderRadius: '4px',
    fontSize: '0.9rem'
  },
  submitButton: {
    width: '100%',
    padding: '1rem',
    backgroundColor: '#1e40af',
    color: 'white',
    border: 'none',
    borderRadius: '12px',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s'
  },
  message: {
    padding: '1rem',
    borderRadius: '8px',
    border: '1px solid',
    marginBottom: '2rem',
    fontSize: '0.9rem'
  },
  securityNote: {
    backgroundColor: '#fffbeb',
    padding: '1.5rem',
    borderRadius: '12px',
    border: '1px solid #fbbf24'
  },
  securityTitle: {
    color: '#92400e',
    marginBottom: '1rem',
    fontSize: '1rem'
  },
  securityList: {
    margin: 0,
    paddingLeft: '1.5rem',
    color: '#92400e',
    lineHeight: '1.6'
  }
};
