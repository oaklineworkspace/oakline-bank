
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../lib/supabaseClient';
import Link from 'next/link';

export default function Transfer() {
  const [user, setUser] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [fromAccount, setFromAccount] = useState('');
  const [toAccountNumber, setToAccountNumber] = useState('');
  const [amount, setAmount] = useState('');
  const [transferType, setTransferType] = useState('internal');
  const [transferDetails, setTransferDetails] = useState({
    recipient_name: '',
    recipient_email: '',
    memo: '',
    routing_number: '',
    bank_name: '',
    swift_code: '',
    country: '',
    purpose: '',
    recipient_address: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [pageLoading, setPageLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        router.push('/login');
        return;
      }
      setUser(session.user);
      await fetchAccounts(session.user);
    } catch (error) {
      console.error('Error checking user:', error);
      router.push('/login');
    } finally {
      setPageLoading(false);
    }
  };

  const fetchAccounts = async (user) => {
    try {
      console.log('Fetching accounts for user:', { id: user.id, email: user.email });
      
      if (!user || !user.id || !user.email) {
        console.error('Invalid user object');
        setMessage('Authentication error. Please log in again.');
        setAccounts([]);
        return;
      }

      let accountsData = [];
      
      // Get user profile first
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('application_id')
        .eq('id', user.id)
        .single();

      if (profileError || !profile?.application_id) {
        console.log('No profile/application found, trying direct account lookup');
        
        // Fallback: Try direct account lookup
        const { data: directAccounts, error: directError } = await supabase
          .from('accounts')
          .select('*')
          .eq('user_id', user.id)
          .eq('status', 'active')
          .order('created_at', { ascending: true });

        if (!directError && directAccounts && directAccounts.length > 0) {
          accountsData = directAccounts.filter(account => account.user_id === user.id);
        }
      } else {
        // Primary method: Get accounts through application_id
        const { data: accounts, error: accountsError } = await supabase
          .from('accounts')
          .select(`
            *,
            applications!inner (
              id,
              email,
              first_name,
              last_name
            )
          `)
          .eq('application_id', profile.application_id)
          .eq('status', 'active')
          .order('created_at', { ascending: true });

        if (!accountsError && accounts && accounts.length > 0) {
          const validAccounts = accounts.filter(account => {
            const applicationMatches = account.application_id === profile.application_id;
            const emailMatches = account.applications?.email === user.email;
            return applicationMatches && emailMatches;
          });
          
          if (validAccounts.length > 0) {
            accountsData = validAccounts;
            console.log('Found validated accounts through application:', accountsData.length);
          }
        }
      }

      // Final validation and setup
      if (accountsData.length > 0) {
        const secureAccounts = accountsData.filter(account => {
          return account.user_id === user.id || 
                 (account.applications && account.applications.email === user.email);
        });
        
        if (secureAccounts.length > 0) {
          setAccounts(secureAccounts);
          setFromAccount(secureAccounts[0].id.toString());
          setMessage('');
          console.log('Successfully loaded secure user accounts:', secureAccounts.length);
        } else {
          setAccounts([]);
          setMessage('No verified accounts found. Please contact support.');
        }
      } else {
        setAccounts([]);
        setMessage('No accounts found for your profile. Please contact support or apply for an account first.');
      }
    } catch (error) {
      console.error('Error fetching accounts:', error);
      setMessage('Unable to load accounts. Please try again or contact support.');
      setAccounts([]);
    }
  };

  const handleTransferDetailsChange = (field, value) => {
    setTransferDetails(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    const selectedAccountData = accounts.find(acc => acc.id.toString() === fromAccount);
    const transferAmount = parseFloat(amount);

    if (!fromAccount || !toAccountNumber || !amount || transferAmount <= 0) {
      setMessage('Please select accounts and enter a valid transfer amount.');
      return false;
    }

    if (transferAmount > parseFloat(selectedAccountData?.balance || 0)) {
      setMessage('Insufficient funds. Your current balance is $' + parseFloat(selectedAccountData?.balance || 0).toFixed(2));
      return false;
    }

    if (transferAmount > 25000 && transferType !== 'internal') {
      setMessage('External transfers over $25,000 require additional verification. Please contact support.');
      return false;
    }

    switch (transferType) {
      case 'domestic_external':
        if (!transferDetails.recipient_name || !transferDetails.routing_number || !transferDetails.bank_name) {
          setMessage('Please fill in recipient name, routing number, and bank name for domestic transfers.');
          return false;
        }
        break;
      case 'international':
        if (!transferDetails.recipient_name || !transferDetails.swift_code || 
            !transferDetails.country || !transferDetails.purpose) {
          setMessage('Please fill in all required fields for international transfers.');
          return false;
        }
        break;
      case 'internal':
        if (!transferDetails.recipient_name) {
          setMessage('Please provide the recipient name for reference.');
          return false;
        }
        break;
    }
    return true;
  };

  const calculateFee = () => {
    const transferAmount = parseFloat(amount) || 0;
    switch (transferType) {
      case 'internal': return 0;
      case 'domestic_external': return transferAmount > 1000 ? 5.00 : 2.00;
      case 'international': return 30.00;
      default: return 0;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setMessage('');

    try {
      const selectedAccountData = accounts.find(acc => acc.id.toString() === fromAccount);
      const transferAmount = parseFloat(amount);
      const fee = calculateFee();
      const totalDeduction = transferAmount + fee;

      if (totalDeduction > parseFloat(selectedAccountData?.balance || 0)) {
        setMessage(`Insufficient funds including fees. Total needed: $${totalDeduction.toFixed(2)}`);
        setLoading(false);
        return;
      }

      // Create sender transaction record
      const { error: transactionError } = await supabase
        .from('transactions')
        .insert([{
          user_id: user.id,
          user_email: user.email,
          account_id: fromAccount,
          account_type: selectedAccountData?.account_type || 'checking',
          amount: -transferAmount,
          transaction_type: 'transfer_out',
          description: `${transferType.toUpperCase()} transfer to ${toAccountNumber} - ${transferDetails.recipient_name} - ${transferDetails.memo || 'Transfer'}`,
          status: transferType === 'internal' ? 'completed' : 'pending',
          category: 'transfer',
          created_at: new Date().toISOString()
        }]);

      if (transactionError) throw transactionError;

      // Create fee transaction if applicable
      if (fee > 0) {
        await supabase.from('transactions').insert([{
          user_id: user.id,
          user_email: user.email,
          account_id: fromAccount,
          account_type: selectedAccountData?.account_type || 'checking',
          amount: -fee,
          transaction_type: 'fee',
          description: `${transferType.toUpperCase()} transfer fee`,
          status: 'completed',
          category: 'fee',
          created_at: new Date().toISOString()
        }]);
      }

      setMessage(`✅ Transfer of $${transferAmount.toFixed(2)} has been processed successfully!${fee > 0 ? ` Fee: $${fee.toFixed(2)}` : ''}`);
      setAmount('');
      setToAccountNumber('');
      setTransferDetails({
        recipient_name: '', recipient_email: '', memo: '', routing_number: '',
        bank_name: '', swift_code: '', country: '', purpose: '', recipient_address: ''
      });
      
      fetchAccounts(user);

      setTimeout(() => {
        router.push('/dashboard');
      }, 3000);

    } catch (error) {
      console.error('Transfer error:', error);
      setMessage(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount || 0);
  };

  const renderTransferTypeFields = () => {
    switch (transferType) {
      case 'internal':
        return (
          <>
            <div style={styles.formGroup}>
              <label style={styles.label}>Recipient Name *</label>
              <input
                type="text"
                style={styles.input}
                value={transferDetails.recipient_name}
                onChange={(e) => handleTransferDetailsChange('recipient_name', e.target.value)}
                placeholder="Name for reference"
                required
              />
            </div>
            
            <div style={styles.formGroup}>
              <label style={styles.label}>Memo (Optional)</label>
              <input
                type="text"
                style={styles.input}
                value={transferDetails.memo}
                onChange={(e) => handleTransferDetailsChange('memo', e.target.value)}
                placeholder="What's this transfer for?"
              />
            </div>
          </>
        );

      case 'domestic_external':
        return (
          <>
            <div style={styles.formGroup}>
              <label style={styles.label}>Recipient Name *</label>
              <input
                type="text"
                style={styles.input}
                value={transferDetails.recipient_name}
                onChange={(e) => handleTransferDetailsChange('recipient_name', e.target.value)}
                placeholder="Full name on account"
                required
              />
            </div>
            
            <div style={styles.formGroup}>
              <label style={styles.label}>Bank Name *</label>
              <input
                type="text"
                style={styles.input}
                value={transferDetails.bank_name}
                onChange={(e) => handleTransferDetailsChange('bank_name', e.target.value)}
                placeholder="Recipient's bank name"
                required
              />
            </div>
            
            <div style={styles.formGroup}>
              <label style={styles.label}>Routing Number *</label>
              <input
                type="text"
                style={styles.input}
                value={transferDetails.routing_number}
                onChange={(e) => handleTransferDetailsChange('routing_number', e.target.value)}
                placeholder="123456789"
                maxLength="9"
                required
              />
            </div>
            
            <div style={styles.formGroup}>
              <label style={styles.label}>Memo (Optional)</label>
              <input
                type="text"
                style={styles.input}
                value={transferDetails.memo}
                onChange={(e) => handleTransferDetailsChange('memo', e.target.value)}
                placeholder="Purpose of transfer"
              />
            </div>
          </>
        );

      case 'international':
        return (
          <>
            <div style={styles.formGroup}>
              <label style={styles.label}>Recipient Name *</label>
              <input
                type="text"
                style={styles.input}
                value={transferDetails.recipient_name}
                onChange={(e) => handleTransferDetailsChange('recipient_name', e.target.value)}
                placeholder="Full name on account"
                required
              />
            </div>
            
            <div style={styles.formGroup}>
              <label style={styles.label}>Country *</label>
              <input
                type="text"
                style={styles.input}
                value={transferDetails.country}
                onChange={(e) => handleTransferDetailsChange('country', e.target.value)}
                placeholder="Destination country"
                required
              />
            </div>
            
            <div style={styles.formGroup}>
              <label style={styles.label}>SWIFT Code *</label>
              <input
                type="text"
                style={styles.input}
                value={transferDetails.swift_code}
                onChange={(e) => handleTransferDetailsChange('swift_code', e.target.value)}
                placeholder="ABCDUS33XXX"
                required
              />
            </div>
            
            <div style={styles.formGroup}>
              <label style={styles.label}>Purpose of Transfer *</label>
              <select
                style={styles.select}
                value={transferDetails.purpose}
                onChange={(e) => handleTransferDetailsChange('purpose', e.target.value)}
                required
              >
                <option value="">Select purpose</option>
                <option value="family_support">Family Support</option>
                <option value="education">Education</option>
                <option value="business">Business</option>
                <option value="investment">Investment</option>
                <option value="personal">Personal</option>
                <option value="other">Other</option>
              </select>
            </div>
            
            <div style={styles.formGroup}>
              <label style={styles.label}>Recipient Address</label>
              <textarea
                style={{...styles.input, minHeight: '60px', resize: 'vertical'}}
                value={transferDetails.recipient_address}
                onChange={(e) => handleTransferDetailsChange('recipient_address', e.target.value)}
                placeholder="Complete address of recipient"
              />
            </div>
          </>
        );

      default:
        return null;
    }
  };

  if (pageLoading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.spinner}></div>
        <p style={styles.loadingText}>Loading transfer page...</p>
      </div>
    );
  }

  if (accounts.length === 0 && !loading) {
    return (
      <div style={styles.container}>
        <div style={styles.header}>
          <Link href="/" style={styles.logoContainer}>
            <div style={styles.logoPlaceholder}>🏦</div>
            <span style={styles.logoText}>Oakline Bank</span>
          </Link>
          <div style={styles.routingInfo}>Routing Number: 075915826</div>
        </div>
        <div style={styles.emptyState}>
          <h1 style={styles.emptyTitle}>No Accounts Found</h1>
          <p style={styles.emptyDesc}>You need to have at least one account to make transfers. Please contact support or apply for an account first.</p>
          <Link href="/apply" style={styles.emptyButton}>Apply for Account</Link>
        </div>
      </div>
    );
  }

  const selectedAccountData = accounts.find(acc => acc.id.toString() === fromAccount);
  const fee = calculateFee();
  const totalAmount = (parseFloat(amount) || 0) + fee;

  return (
    <>
      <Head>
        <title>Transfer Funds - Oakline Bank</title>
        <meta name="description" content="Send money securely with bank-level encryption" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no" />
      </Head>
      
      <div style={styles.container}>
        <div style={styles.header}>
          <Link href="/" style={styles.logoContainer}>
            <div style={styles.logoPlaceholder}>🏦</div>
            <span style={styles.logoText}>Oakline Bank</span>
          </Link>
          <div style={styles.headerInfo}>
            <div style={styles.routingInfo}>Routing Number: 075915826</div>
            <Link href="/dashboard" style={styles.backButton}>← Dashboard</Link>
          </div>
        </div>

        <div style={styles.content}>
          <div style={styles.titleSection}>
            <h1 style={styles.title}>💸 Transfer Funds</h1>
            <p style={styles.subtitle}>Send money securely with bank-level encryption</p>
          </div>

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

          <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Transfer From Account *</label>
              <select
                style={styles.select}
                value={fromAccount}
                onChange={(e) => setFromAccount(e.target.value)}
                required
              >
                <option value="">Choose account to transfer from</option>
                {accounts.map(account => (
                  <option key={account.id} value={account.id}>
                    {account.account_name || account.account_type?.replace('_', ' ')?.toUpperCase()} - 
                    ****{account.account_number?.slice(-4)} - 
                    Balance: {formatCurrency(account.balance || 0)}
                  </option>
                ))}
              </select>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Transfer Type *</label>
              <select
                style={styles.select}
                value={transferType}
                onChange={(e) => setTransferType(e.target.value)}
                required
              >
                <option value="internal">🏦 Internal Transfer (Free - Same Bank)</option>
                <option value="domestic_external">🇺🇸 Domestic External ($2-5 fee)</option>
                <option value="international">🌍 International Transfer ($30 fee)</option>
              </select>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>To Account Number *</label>
              <input
                type="text"
                style={styles.input}
                value={toAccountNumber}
                onChange={(e) => setToAccountNumber(e.target.value)}
                placeholder={transferType === 'internal' ? 'Oakline Bank account number' : 'Recipient account number'}
                required
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Transfer Amount ($) *</label>
              <input
                type="number"
                style={styles.input}
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter amount"
                step="0.01"
                min="0.01"
                max={selectedAccountData ? parseFloat(selectedAccountData.balance || 0) - fee : 25000}
                required
              />
            </div>

            <div style={styles.detailsSection}>
              <h3 style={styles.sectionTitle}>Transfer Details</h3>
              {renderTransferTypeFields()}
            </div>

            {fee > 0 && (
              <div style={styles.feeNotice}>
                <h4 style={styles.feeTitle}>💰 Fee Notice</h4>
                <p>This transfer type incurs a {formatCurrency(fee)} fee.</p>
                <p><strong>Total Deduction: {formatCurrency(totalAmount)}</strong></p>
              </div>
            )}

            <button
              type="submit"
              style={{
                ...styles.submitButton,
                opacity: loading ? 0.7 : 1,
                cursor: loading ? 'not-allowed' : 'pointer'
              }}
              disabled={loading}
            >
              {loading ? '🔄 Processing Transfer...' : `Transfer ${formatCurrency(parseFloat(amount) || 0)}${fee > 0 ? ` (+${formatCurrency(fee)} fee)` : ''}`}
            </button>
          </form>

          <div style={styles.infoSection}>
            <h4 style={styles.infoTitle}>🔒 Transfer Information</h4>
            <ul style={styles.infoList}>
              <li><strong>Internal:</strong> Instant transfers between Oakline Bank accounts</li>
              <li><strong>Domestic:</strong> 1-3 business days to other US banks</li>
              <li><strong>International:</strong> 3-5 business days worldwide</li>
              <li>All transfers are secured with bank-level encryption</li>
              <li>Daily transfer limit: $25,000 (contact support for higher limits)</li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#f8fafc',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
  },
  header: {
    backgroundColor: '#1e40af',
    color: 'white',
    padding: '0.75rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    flexWrap: 'wrap',
    gap: '0.5rem'
  },
  logoContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    textDecoration: 'none',
    color: 'white'
  },
  logoPlaceholder: {
    fontSize: '1.5rem'
  },
  logoText: {
    fontSize: 'clamp(1rem, 4vw, 1.5rem)',
    fontWeight: 'bold'
  },
  headerInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    flexWrap: 'wrap'
  },
  routingInfo: {
    fontSize: '0.8rem',
    backgroundColor: 'rgba(255,255,255,0.2)',
    padding: '0.4rem 0.6rem',
    borderRadius: '6px'
  },
  backButton: {
    padding: '0.4rem 0.6rem',
    backgroundColor: 'rgba(255,255,255,0.2)',
    color: 'white',
    textDecoration: 'none',
    borderRadius: '6px',
    fontSize: '0.8rem',
    border: '1px solid rgba(255,255,255,0.3)'
  },
  content: {
    maxWidth: '100%',
    margin: '0 auto',
    padding: '1rem 0.5rem'
  },
  titleSection: {
    textAlign: 'center',
    marginBottom: '1.5rem'
  },
  title: {
    fontSize: 'clamp(1.5rem, 6vw, 2.5rem)',
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: '0.5rem'
  },
  subtitle: {
    fontSize: 'clamp(0.9rem, 3vw, 1.1rem)',
    color: '#64748b'
  },
  form: {
    backgroundColor: 'white',
    padding: '1rem',
    borderRadius: '16px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
    marginBottom: '1rem'
  },
  formGroup: {
    marginBottom: '1rem'
  },
  label: {
    display: 'block',
    fontSize: '0.85rem',
    fontWeight: '600',
    color: '#374151',
    marginBottom: '0.4rem'
  },
  select: {
    width: '100%',
    padding: '0.6rem',
    border: '2px solid #e2e8f0',
    borderRadius: '8px',
    fontSize: '0.9rem',
    backgroundColor: 'white',
    boxSizing: 'border-box'
  },
  input: {
    width: '100%',
    padding: '0.6rem',
    border: '2px solid #e2e8f0',
    borderRadius: '8px',
    fontSize: '0.9rem',
    boxSizing: 'border-box'
  },
  detailsSection: {
    backgroundColor: '#f8fafc',
    padding: '1rem',
    borderRadius: '12px',
    marginBottom: '1rem',
    border: '2px solid #e2e8f0'
  },
  sectionTitle: {
    color: '#1e40af',
    marginBottom: '0.75rem',
    fontSize: '1rem'
  },
  feeNotice: {
    backgroundColor: '#fff3cd',
    border: '2px solid #fbbf24',
    borderRadius: '12px',
    padding: '0.75rem',
    marginBottom: '1rem'
  },
  feeTitle: {
    color: '#92400e',
    marginBottom: '0.4rem',
    fontSize: '0.9rem'
  },
  submitButton: {
    width: '100%',
    padding: '0.75rem',
    backgroundColor: '#1e40af',
    color: 'white',
    border: 'none',
    borderRadius: '12px',
    fontSize: '0.9rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s'
  },
  message: {
    padding: '0.75rem',
    borderRadius: '8px',
    border: '2px solid',
    marginBottom: '1rem',
    fontSize: '0.85rem'
  },
  infoSection: {
    backgroundColor: 'white',
    padding: '1rem',
    borderRadius: '12px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
  },
  infoTitle: {
    color: '#1e40af',
    marginBottom: '0.75rem',
    fontSize: '0.95rem'
  },
  infoList: {
    margin: 0,
    paddingLeft: '1.2rem',
    color: '#374151',
    lineHeight: '1.5',
    fontSize: '0.8rem'
  },
  emptyState: {
    textAlign: 'center',
    padding: '2rem 1rem',
    maxWidth: '600px',
    margin: '0 auto'
  },
  emptyTitle: {
    fontSize: 'clamp(1.3rem, 5vw, 2rem)',
    color: '#1e293b',
    marginBottom: '1rem'
  },
  emptyDesc: {
    fontSize: 'clamp(0.9rem, 3vw, 1.1rem)',
    color: '#64748b',
    marginBottom: '1.5rem'
  },
  emptyButton: {
    padding: '0.75rem 1.5rem',
    backgroundColor: '#1e40af',
    color: 'white',
    textDecoration: 'none',
    borderRadius: '12px',
    fontSize: '0.9rem',
    fontWeight: '600'
  },
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    backgroundColor: '#f8fafc'
  },
  spinner: {
    width: '32px',
    height: '32px',
    border: '3px solid #e2e8f0',
    borderTop: '3px solid #1e40af',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite'
  },
  loadingText: {
    marginTop: '1rem',
    color: '#64748b',
    fontSize: '1rem'
  }
};
