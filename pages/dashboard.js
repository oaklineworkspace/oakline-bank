import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useRouter } from 'next/router';

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [userProfile, setUserProfile] = useState(null); // Added to store user profile
  const [showDropdown, setShowDropdown] = useState(false);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [showWithdrawalModal, setShowWithdrawalModal] = useState(false);
  const [showPayModal, setShowPayModal] = useState(false);
  const [transferData, setTransferData] = useState({
    fromAccount: '',
    transferType: 'between_accounts',
    toAccount: '',
    recipientName: '',
    recipientEmail: '',
    bankName: '',
    routingNumber: '',
    swiftCode: '',
    amount: '',
    description: '',
    country: ''
  });
  const [withdrawalData, setWithdrawalData] = useState({
    fromAccount: '',
    withdrawalMethod: 'atm',
    amount: '',
    recipientAccount: '',
    recipientName: '',
    routingNumber: '',
    bankName: '',
    description: ''
  });
  const [paymentData, setPaymentData] = useState({
    payee: '',
    amount: '',
    dueDate: '',
    description: ''
  });
  const router = useRouter();

  // Enhanced mature banking color scheme
  const styles = {
    container: {
      minHeight: '100vh',
      backgroundColor: '#f7f9fc',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    },
    header: {
      background: 'linear-gradient(135deg, #1e3a8a 0%, #1e40af 50%, #3b82f6 100%)',
      color: 'white',
      padding: '1rem 2rem',
      boxShadow: '0 4px 20px rgba(30, 58, 138, 0.3)',
      borderBottom: '1px solid rgba(255,255,255,0.1)'
    },
    headerContent: {
      maxWidth: '1400px',
      margin: '0 auto',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    },
    logo: {
      fontSize: '1.5rem',
      fontWeight: '700',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem'
    },
    userInfo: {
      display: 'flex',
      alignItems: 'center',
      gap: '1rem'
    },
    logoutButton: {
      background: 'rgba(255,255,255,0.15)',
      border: '1px solid rgba(255,255,255,0.2)',
      color: 'white',
      padding: '0.5rem 1rem',
      borderRadius: '8px',
      cursor: 'pointer',
      transition: 'all 0.2s',
      fontSize: '0.9rem',
      fontWeight: '500'
    },
    dropdown: {
      position: 'relative'
    },
    dropdownButton: {
      background: 'rgba(255,255,255,0.15)',
      border: '1px solid rgba(255,255,255,0.2)',
      color: 'white',
      padding: '0.5rem 1rem',
      borderRadius: '8px',
      cursor: 'pointer',
      transition: 'all 0.2s',
      fontSize: '0.9rem',
      fontWeight: '500'
    },
    dropdownContent: {
      position: 'absolute',
      top: '100%',
      right: 0,
      backgroundColor: 'white',
      borderRadius: '12px',
      boxShadow: '0 10px 40px rgba(0,0,0,0.15)',
      border: '1px solid #e2e8f0',
      minWidth: '200px',
      zIndex: 1000,
      marginTop: '8px'
    },
    dropdownItem: {
      display: 'block',
      width: '100%',
      padding: '12px 16px',
      background: 'none',
      border: 'none',
      textAlign: 'left',
      cursor: 'pointer',
      fontSize: '14px',
      color: '#374151',
      transition: 'background-color 0.2s'
    },
    dropdownDivider: {
      margin: '8px 0',
      border: 'none',
      borderTop: '1px solid #e2e8f0'
    },
    main: {
      maxWidth: '1400px',
      margin: '0 auto',
      padding: '2rem'
    },
    welcomeSection: {
      marginBottom: '2rem'
    },
    welcomeTitle: {
      fontSize: '2.2rem',
      fontWeight: '700',
      color: '#1e293b',
      marginBottom: '0.5rem'
    },
    balanceCard: {
      background: 'linear-gradient(135deg, #064e3b 0%, #047857 50%, #10b981 100%)',
      color: 'white',
      padding: '2.5rem',
      borderRadius: '20px',
      marginBottom: '2rem',
      boxShadow: '0 10px 40px rgba(16, 185, 129, 0.25)',
      position: 'relative',
      overflow: 'hidden'
    },
    balanceCardOverlay: {
      position: 'absolute',
      top: 0,
      right: 0,
      width: '200px',
      height: '200px',
      background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
      borderRadius: '50%',
      transform: 'translate(50%, -50%)'
    },
    totalBalance: {
      fontSize: '1rem',
      opacity: 0.9,
      marginBottom: '0.5rem',
      fontWeight: '500'
    },
    balanceAmount: {
      fontSize: '3rem',
      fontWeight: '800',
      marginBottom: '1.5rem'
    },
    balanceActions: {
      display: 'flex',
      gap: '1rem',
      flexWrap: 'wrap'
    },
    actionButton: {
      background: 'rgba(255,255,255,0.15)',
      border: '1px solid rgba(255,255,255,0.2)',
      color: 'white',
      padding: '0.75rem 1.5rem',
      borderRadius: '12px',
      cursor: 'pointer',
      fontSize: '0.9rem',
      fontWeight: '600',
      transition: 'all 0.2s',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem'
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
      gap: '2rem'
    },
    section: {
      backgroundColor: 'white',
      borderRadius: '16px',
      padding: '2rem',
      boxShadow: '0 4px 30px rgba(0,0,0,0.08)',
      border: '1px solid #e2e8f0'
    },
    sectionTitle: {
      fontSize: '1.5rem',
      fontWeight: '700',
      color: '#1e293b',
      marginBottom: '1.5rem',
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem'
    },
    accountSelector: {
      marginBottom: '1.5rem'
    },
    select: {
      width: '100%',
      padding: '0.75rem 1rem',
      border: '2px solid #e2e8f0',
      borderRadius: '12px',
      fontSize: '1rem',
      backgroundColor: 'white',
      color: '#1e293b',
      fontWeight: '500',
      cursor: 'pointer',
      transition: 'all 0.2s'
    },
    accountCard: {
      background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
      border: '2px solid #e2e8f0',
      borderRadius: '16px',
      padding: '1.5rem',
      marginBottom: '1rem',
      cursor: 'pointer',
      transition: 'all 0.3s'
    },
    accountCardSelected: {
      borderColor: '#3b82f6',
      background: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)',
      transform: 'translateY(-2px)',
      boxShadow: '0 8px 30px rgba(59, 130, 246, 0.15)'
    },
    accountHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '0.5rem'
    },
    accountName: {
      fontWeight: '700',
      color: '#1e293b',
      fontSize: '1.1rem'
    },
    accountNumber: {
      fontSize: '0.85rem',
      color: '#64748b',
      fontFamily: 'monospace'
    },
    accountBalance: {
      fontSize: '1.3rem',
      fontWeight: '700',
      color: '#047857'
    },
    transactionItem: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '1rem 0',
      borderBottom: '1px solid #f1f5f9'
    },
    transactionIcon: {
      width: '48px',
      height: '48px',
      borderRadius: '12px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '1.2rem',
      marginRight: '1rem',
      fontWeight: '600'
    },
    transactionDetails: {
      flex: 1
    },
    transactionDescription: {
      fontWeight: '600',
      color: '#1e293b',
      marginBottom: '0.25rem'
    },
    transactionDate: {
      fontSize: '0.85rem',
      color: '#64748b'
    },
    transactionAmount: {
      fontWeight: '700',
      fontSize: '1.1rem'
    },
    modal: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.6)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '1rem'
    },
    modalContent: {
      backgroundColor: 'white',
      borderRadius: '20px',
      padding: '2rem',
      maxWidth: '500px',
      width: '100%',
      maxHeight: '90vh',
      overflow: 'auto',
      boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
    },
    modalTitle: {
      fontSize: '1.8rem',
      fontWeight: '700',
      marginBottom: '1.5rem',
      color: '#1e293b'
    },
    formGroup: {
      marginBottom: '1.5rem'
    },
    label: {
      display: 'block',
      marginBottom: '0.5rem',
      fontWeight: '600',
      color: '#374151'
    },
    input: {
      width: '100%',
      padding: '0.875rem 1rem',
      border: '2px solid #e2e8f0',
      borderRadius: '12px',
      fontSize: '1rem',
      boxSizing: 'border-box',
      transition: 'all 0.2s'
    },
    modalActions: {
      display: 'flex',
      gap: '1rem',
      marginTop: '2rem'
    },
    primaryButton: {
      backgroundColor: '#1e40af',
      color: 'white',
      border: 'none',
      padding: '1rem 2rem',
      borderRadius: '12px',
      cursor: 'pointer',
      fontWeight: '600',
      flex: 1,
      fontSize: '1rem',
      transition: 'all 0.2s'
    },
    secondaryButton: {
      backgroundColor: '#f1f5f9',
      color: '#64748b',
      border: '2px solid #e2e8f0',
      padding: '1rem 2rem',
      borderRadius: '12px',
      cursor: 'pointer',
      fontWeight: '600',
      flex: 1,
      fontSize: '1rem',
      transition: 'all 0.2s'
    },
    loadingContainer: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      backgroundColor: '#f7f9fc'
    },
    spinner: {
      width: '48px',
      height: '48px',
      border: '4px solid #e2e8f0',
      borderTop: '4px solid #1e40af',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite',
      marginBottom: '1rem'
    },
    errorContainer: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      backgroundColor: '#f7f9fc',
      textAlign: 'center',
      padding: '2rem'
    },
    retryButton: {
      backgroundColor: '#1e40af',
      color: 'white',
      border: 'none',
      padding: '1rem 2rem',
      borderRadius: '12px',
      cursor: 'pointer',
      fontSize: '1rem',
      marginTop: '1rem',
      fontWeight: '600'
    },
    quickActions: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
      gap: '1rem',
      marginTop: '1.5rem'
    },
    quickActionCard: {
      textAlign: 'center',
      padding: '1.5rem 1rem',
      border: '2px solid #e2e8f0',
      borderRadius: '16px',
      cursor: 'pointer',
      transition: 'all 0.3s',
      backgroundColor: 'white'
    },
    quickActionIcon: {
      fontSize: '2.5rem',
      marginBottom: '0.75rem',
      display: 'block'
    },
    quickActionText: {
      fontSize: '0.9rem',
      fontWeight: '600',
      color: '#1e293b'
    }
  };

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        router.push('/login');
        return;
      }

      setUser(session.user);
      await fetchUserData(session.user.id); // Call the consolidated fetch function
    } catch (error) {
      console.error('Error checking user:', error);
      setError('Failed to load user data');
    } finally {
      setLoading(false);
    }
  };

  // Consolidated function to fetch user data, accounts, and transactions
  const fetchUserData = async (userId) => {
    setLoading(true); // Start loading
    setError(''); // Clear previous errors

    try {
      // Fetch user profile first to potentially get application_id
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (profileError) {
        console.error('Error fetching profile:', profileError);
        // Decide if this should be a critical error or if we can proceed without profile
        // For now, we'll log it but continue to fetch accounts
      }
      setUserProfile(profile); // Set the profile data

      // Fetch accounts
      let accounts = [];
      try {
        // Method 1: Direct user_id lookup
        const { data: directAccounts, error: directAccountsError } = await supabase
          .from('accounts')
          .select('*')
          .eq('user_id', userId);

        if (directAccountsError) {
          console.error('Error fetching direct accounts:', directAccountsError);
        }

        if (directAccounts && directAccounts.length > 0) {
          accounts = directAccounts;
        } else if (profile?.application_id) {
          // Method 2: Via application_id if direct lookup yields no results
          const { data: appAccounts, error: appAccountsError } = await supabase
            .from('accounts')
            .select('*')
            .eq('application_id', profile.application_id);

          if (appAccountsError) {
            console.error('Error fetching accounts by application_id:', appAccountsError);
          } else if (appAccounts && appAccounts.length > 0) {
            accounts = appAccounts;
            // Update accounts to link them to the user for future queries
            // This assumes a one-time sync or that accounts might not have user_id set initially
            for (const account of accounts) {
              // Only update if user_id is not already set or different
              if (account.user_id !== userId) {
                await supabase
                  .from('accounts')
                  .update({ user_id: userId, updated_at: new Date().toISOString() }) // Add updated_at
                  .eq('id', account.id);
              }
            }
          }
        }
        setAccounts(accounts);
        if (accounts.length > 0) {
          setSelectedAccount(accounts[0]);
        }
      } catch (accountError) {
        console.error('Error processing accounts:', accountError);
        setError('Failed to load account information');
      }

      // Fetch transactions
      try {
        const { data: transactionsData, error: transactionsError } = await supabase
          .from('transactions')
          .select('*')
          .eq('user_id', userId) // Ensure we fetch transactions for the logged-in user
          .order('created_at', { ascending: false })
          .limit(10);

        if (transactionsError) {
          console.error('Error fetching transactions:', transactionsError);
          setTransactions([]); // Clear transactions if there's an error
        } else {
          setTransactions(transactionsData || []);
        }
      } catch (transactionError) {
        console.error('Error fetching transactions:', transactionError);
        setTransactions([]); // Clear transactions on error
      }

    } catch (error) {
      console.error('Error in fetchUserData:', error);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false); // End loading
    }
  };


  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  const formatCurrency = (amount) => {
    // Ensure amount is a number, handle potential null or undefined
    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount)) {
      return '$0.00'; // Return a default value if amount is not a valid number
    }
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(numericAmount);
  };

  const formatDate = (dateString) => {
    if (!dateString) return ''; // Handle cases where dateString might be null or undefined
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (e) {
      console.error("Error formatting date:", dateString, e);
      return dateString; // Return original string if date parsing fails
    }
  };

  const getTotalBalance = () => {
    return accounts.reduce((total, account) => {
      const balance = parseFloat(account.balance || 0);
      return total + (isNaN(balance) ? 0 : balance); // Add 0 if balance is not a valid number
    }, 0);
  };

  const handleTransfer = async (e) => {
    e.preventDefault();

    try {
      setLoading(true); // Set loading true for the entire process

      // Basic validation for amount
      if (parseFloat(transferData.amount) <= 0) {
        setError("Amount must be greater than zero.");
        setLoading(false);
        return;
      }

      // Find the selected fromAccount to get its current balance
      const fromAccountDetails = accounts.find(acc => acc.id === transferData.fromAccount);
      if (!fromAccountDetails) {
        setError("Selected 'From' account not found.");
        setLoading(false);
        return;
      }
      const fromAccountBalance = parseFloat(fromAccountDetails.balance);

      // Check if sufficient funds are available
      if (fromAccountBalance < parseFloat(transferData.amount)) {
        setError("Insufficient funds in the selected account.");
        setLoading(false);
        return;
      }

      const transferPayload = {
        ...transferData,
        user_id: user.id,
        from_account_id: transferData.fromAccount, // Use explicit names
        to_account_id: transferData.toAccount, // Use explicit names for internal transfers
        // For external transfers, toAccount is the account number, need to adjust API accordingly
        amount: parseFloat(transferData.amount), // Ensure amount is a number
        // Add metadata for payment processor
        payment_method: transferData.transferType === 'between_accounts' ? 'internal' : 'external',
        // For external transfers, you'll need to specify the processor
        processor: transferData.transferType !== 'between_accounts' ? 'plaid' : null // Placeholder, adjust as needed
      };

      // If it's an internal transfer, use the internal account IDs
      if (transferData.transferType === 'between_accounts') {
        delete transferPayload.recipientName;
        delete transferPayload.recipientEmail;
        delete transferPayload.bankName;
        delete transferPayload.routingNumber;
        delete transferPayload.swiftCode;
        delete transferPayload.country;
        // Ensure toAccount is set correctly for internal transfers
        transferPayload.to_account_id = transferData.toAccount;
      } else {
        // For external transfers, the API will handle routing number, bank name etc.
        // The 'toAccount' field in transferData might be the account number for external
        transferPayload.recipient_account_number = transferData.toAccount; // Assuming toAccount is account number for external
        // Other fields like recipientName, bankName, routingNumber, swiftCode, country are already in transferData
      }

      // Call your transfer API endpoint
      const response = await fetch('/api/process-transfer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(transferPayload)
      });

      const result = await response.json();

      if (result.success) {
        // Refresh user data and close modal
        await fetchUserData(user.id); // Refetch data after successful transfer
        setShowTransferModal(false);
        // Reset form data
        setTransferData({
          fromAccount: '',
          transferType: 'between_accounts',
          toAccount: '',
          recipientName: '',
          recipientEmail: '',
          bankName: '',
          routingNumber: '',
          swiftCode: '',
          amount: '',
          description: '',
          country: ''
        });
        setError(''); // Clear any previous errors
      } else {
        setError(result.error || 'Transfer failed. Please check details and try again.');
      }
    } catch (error) {
      console.error('Transfer error:', error);
      setError('An unexpected error occurred during transfer. Please try again later.');
    } finally {
      setLoading(false); // Ensure loading is set to false
    }
  };

  const handleWithdrawal = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const withdrawalPayload = {
        ...withdrawalData,
        user_id: user.id,
        amount: parseFloat(withdrawalData.amount), // Ensure amount is a number
        // Add other relevant fields based on withdrawalMethod
      };

      // Simulate API call for withdrawal
      // Replace with your actual withdrawal API call
      const response = await fetch('/api/process-withdrawal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(withdrawalPayload)
      });
      const result = await response.json();

      if (result.success) {
        await fetchUserData(user.id); // Refresh data
        setShowWithdrawalModal(false);
        setWithdrawalData({ // Reset form
          fromAccount: '',
          withdrawalMethod: 'atm',
          amount: '',
          recipientAccount: '',
          recipientName: '',
          routingNumber: '',
          bankName: '',
          description: ''
        });
        setError('');
      } else {
        setError(result.error || 'Withdrawal failed.');
      }
    } catch (error) {
      console.error('Withdrawal error:', error);
      setError('Failed to process withdrawal.');
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const paymentPayload = {
        ...paymentData,
        user_id: user.id, // Assuming payment is linked to user
        amount: parseFloat(paymentData.amount), // Ensure amount is a number
        // Add other relevant fields like account to pay from if needed
      };

      // Simulate API call for payment
      // Replace with your actual payment API call
      const response = await fetch('/api/process-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(paymentPayload)
      });
      const result = await response.json();

      if (result.success) {
        await fetchUserData(user.id); // Refresh data
        setShowPayModal(false);
        setPaymentData({ // Reset form
          payee: '',
          amount: '',
          dueDate: '',
          description: ''
        });
        setError('');
      } else {
        setError(result.error || 'Payment failed.');
      }
    } catch (error) {
      console.error('Payment error:', error);
      setError('Failed to process payment.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.spinner}></div>
        <p>Loading your dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.errorContainer}>
        <h2>Error</h2>
        <p>{error}</p>
        <button onClick={() => window.location.reload()} style={styles.retryButton}>
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .action-button:hover {
          background: rgba(255,255,255,0.25) !important;
          transform: translateY(-1px);
        }

        .account-card:hover {
          border-color: #94a3b8 !important;
          transform: translateY(-2px);
        }

        .quick-action:hover {
          border-color: #3b82f6 !important;
          transform: translateY(-3px);
          box-shadow: 0 8px 25px rgba(59, 130, 246, 0.2) !important;
        }

        .select:focus {
          border-color: #3b82f6 !important;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }

        .input:focus {
          border-color: #3b82f6 !important;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }

        .primary-button:hover {
          background-color: #1e3a8a !important;
          transform: translateY(-1px);
        }

        .secondary-button:hover {
          background-color: #e2e8f0 !important;
          transform: translateY(-1px);
        }
      `}</style>

      {/* Header */}
      <header style={styles.header}>
        <div style={styles.headerContent}>
          <div style={styles.logo}>
            <span>🏦</span>
            Oakline Bank
          </div>
          <div style={styles.userInfo}>
            <span>Welcome, {user?.user_metadata?.first_name || user?.email}</span>
            <div style={styles.dropdown}>
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                style={styles.dropdownButton}
                className="action-button"
              >
                ☰ Menu
              </button>
              {showDropdown && (
                <div style={styles.dropdownContent}>
                  <button onClick={() => router.push('/main-menu')} style={styles.dropdownItem}>
                    🏠 Main Menu
                  </button>
                  <button onClick={() => router.push('/profile')} style={styles.dropdownItem}>
                    👤 Profile
                  </button>
                  <button onClick={() => router.push('/transactions')} style={styles.dropdownItem}>
                    📊 Transactions
                  </button>
                  <button onClick={() => router.push('/cards')} style={styles.dropdownItem}>
                    💳 Cards
                  </button>
                  <button onClick={() => router.push('/loans')} style={styles.dropdownItem}>
                    🏠 Loans
                  </button>
                  <button onClick={() => router.push('/support')} style={styles.dropdownItem}>
                    🆘 Support
                  </button>
                  <hr style={styles.dropdownDivider} />
                  <button onClick={handleLogout} style={styles.dropdownItem}>
                    🚪 Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main style={styles.main}>
        {/* Welcome Section */}
        <section style={styles.welcomeSection}>
          <h1 style={styles.welcomeTitle}>
            Good {new Date().getHours() < 12 ? 'Morning' : new Date().getHours() < 18 ? 'Afternoon' : 'Evening'}!
          </h1>

          {/* Total Balance Card */}
          <div style={styles.balanceCard}>
            <div style={styles.balanceCardOverlay}></div>
            <div style={styles.totalBalance}>Total Balance</div>
            <div style={styles.balanceAmount}>{formatCurrency(getTotalBalance())}</div>
            <div style={styles.balanceActions}>
              <button
                onClick={() => setShowTransferModal(true)}
                style={styles.actionButton}
                className="action-button"
              >
                <span>💸</span> Quick Transfer
              </button>
              <button
                onClick={() => setShowWithdrawalModal(true)}
                style={styles.actionButton}
                className="action-button"
              >
                <span>💳</span> Withdraw
              </button>
              <button
                onClick={() => setShowPayModal(true)}
                style={styles.actionButton}
                className="action-button"
              >
                <span>💰</span> Pay Bills
              </button>
              <button
                onClick={() => router.push('/deposit')}
                style={styles.actionButton}
                className="action-button"
              >
                <span>📥</span> Deposit
              </button>
            </div>
          </div>
        </section>

        {/* Main Dashboard Grid */}
        <div style={styles.grid}>
          {/* Accounts Section */}
          <section style={styles.section}>
            <h2 style={styles.sectionTitle}>
              <span>💳</span> Your Accounts
            </h2>

            {/* Account Selector Dropdown */}
            {accounts.length > 0 && (
              <div style={styles.accountSelector}>
                <select
                  style={styles.select}
                  className="select"
                  value={selectedAccount?.id || ''}
                  onChange={(e) => {
                    const account = accounts.find(acc => acc.id === e.target.value);
                    setSelectedAccount(account);
                  }}
                >
                  <option value="">Select an account</option>
                  {accounts.map(account => (
                    <option key={account.id} value={account.id}>
                      {account.account_name} - {formatCurrency(account.balance)} (****{account.account_number?.slice(-4)})
                    </option>
                  ))}
                </select>
              </div>
            )}

            {accounts.length === 0 ? (
              <p style={{ color: '#64748b', textAlign: 'center', padding: '2rem' }}>
                No accounts found. Please contact support if this is unexpected.
              </p>
            ) : (
              accounts.map(account => (
                <div
                  key={account.id}
                  onClick={() => setSelectedAccount(account)}
                  style={{
                    ...styles.accountCard,
                    ...(selectedAccount?.id === account.id ? styles.accountCardSelected : {})
                  }}
                  className="account-card"
                >
                  <div style={styles.accountHeader}>
                    <div>
                      <div style={styles.accountName}>{account.account_name}</div>
                      <div style={styles.accountNumber}>
                        ****{account.account_number?.slice(-4)}
                      </div>
                    </div>
                    <div style={styles.accountBalance}>
                      {formatCurrency(account.balance)}
                    </div>
                  </div>
                </div>
              ))
            )}

            {/* Quick Actions */}
            <div style={styles.quickActions}>
              <div
                onClick={() => router.push('/transactions')}
                style={styles.quickActionCard}
                className="quick-action"
              >
                <span style={styles.quickActionIcon}>📊</span>
                <div style={styles.quickActionText}>Statements</div>
              </div>
              <div
                onClick={() => router.push('/cards')}
                style={styles.quickActionCard}
                className="quick-action"
              >
                <span style={styles.quickActionIcon}>💳</span>
                <div style={styles.quickActionText}>Cards</div>
              </div>
              <div
                onClick={() => router.push('/loans')}
                style={styles.quickActionCard}
                className="quick-action"
              >
                <span style={styles.quickActionIcon}>🏠</span>
                <div style={styles.quickActionText}>Loans</div>
              </div>
            </div>
          </section>

          {/* Recent Transactions */}
          <section style={styles.section}>
            <h2 style={styles.sectionTitle}>
              <span>📈</span> Recent Activity
            </h2>

            {transactions.length === 0 ? (
              <p style={{ color: '#64748b', textAlign: 'center', padding: '2rem' }}>
                No recent transactions
              </p>
            ) : (
              transactions.slice(0, 5).map(transaction => (
                <div key={transaction.id} style={styles.transactionItem}>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <div style={{
                      ...styles.transactionIcon,
                      backgroundColor: transaction.type === 'credit' ? '#dcfce7' : '#fee2e2',
                      color: transaction.type === 'credit' ? '#16a34a' : '#dc2626'
                    }}>
                      {transaction.type === 'credit' ? '↓' : '↑'}
                    </div>
                    <div style={styles.transactionDetails}>
                      <div style={styles.transactionDescription}>
                        {transaction.description || 'Transaction'}
                      </div>
                      <div style={styles.transactionDate}>
                        {formatDate(transaction.created_at)}
                      </div>
                    </div>
                  </div>
                  <div style={{
                    ...styles.transactionAmount,
                    color: transaction.type === 'credit' ? '#16a34a' : '#dc2626'
                  }}>
                    {transaction.type === 'credit' ? '+' : '-'}{formatCurrency(Math.abs(transaction.amount))}
                  </div>
                </div>
              ))
            )}

            <button
              onClick={() => router.push('/transactions')}
              style={{
                ...styles.primaryButton,
                marginTop: '1rem',
                width: '100%'
              }}
              className="primary-button"
            >
              View All Transactions
            </button>
          </section>
        </div>
      </main>

      {/* Enhanced Transfer Modal */}
      {showTransferModal && (
        <div style={styles.modal} onClick={() => setShowTransferModal(false)}>
          <div style={styles.modalContent} onClick={e => e.stopPropagation()}>
            <h3 style={styles.modalTitle}>Transfer Money</h3>
            <form onSubmit={handleTransfer}>
              <div style={styles.formGroup}>
                <label style={styles.label}>From Account</label>
                <select
                  style={styles.select}
                  className="select"
                  value={transferData.fromAccount}
                  onChange={e => {
                    setTransferData({...transferData, fromAccount: e.target.value, toAccount: ''}); // Reset toAccount when fromAccount changes
                    setError(''); // Clear error on input change
                  }}
                  required
                >
                  <option value="">Select account to send from</option>
                  {accounts.map(account => (
                    <option key={account.id} value={account.id}>
                      {account.account_name || account.account_type?.replace('_', ' ')?.toUpperCase()} - ****{account.account_number?.slice(-4)} - {formatCurrency(account.balance || 0)}
                    </option>
                  ))}
                </select>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Transfer Type</label>
                <select
                  style={styles.select}
                  className="select"
                  value={transferData.transferType}
                  onChange={e => {
                    setTransferData({...transferData, transferType: e.target.value, toAccount: '', recipientName: '', recipientEmail: '', bankName: '', routingNumber: '', swiftCode: '', country: ''}); // Reset fields based on type
                    setError(''); // Clear error on input change
                  }}
                  required
                >
                  <option value="between_accounts">Between My Accounts</option>
                  <option value="domestic">Domestic Transfer</option>
                  <option value="international">International Transfer</option>
                  <option value="wire">Wire Transfer</option>
                  <option value="ach">ACH Transfer</option>
                </select>
              </div>

              {transferData.transferType === 'between_accounts' && (
                <div style={styles.formGroup}>
                  <label style={styles.label}>To Account</label>
                  <select
                    style={styles.select}
                    className="select"
                    value={transferData.toAccount}
                    onChange={e => {
                      setTransferData({...transferData, toAccount: e.target.value});
                      setError(''); // Clear error on input change
                    }}
                    required
                  >
                    <option value="">Select account to send to</option>
                    {accounts.filter(acc => acc.id !== transferData.fromAccount).map(account => (
                      <option key={account.id} value={account.id}>
                        {account.account_name || account.account_type?.replace('_', ' ')?.toUpperCase()} - ****{account.account_number?.slice(-4)} - {formatCurrency(account.balance || 0)}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {transferData.transferType !== 'between_accounts' && (
                <>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Recipient Name</label>
                    <input
                      type="text"
                      style={styles.input}
                      className="input"
                      placeholder="Full name of recipient"
                      value={transferData.recipientName}
                      onChange={e => {setTransferData({...transferData, recipientName: e.target.value}); setError('');}}
                      required
                    />
                  </div>

                  <div style={styles.formGroup}>
                    <label style={styles.label}>Recipient Account Number</label>
                    <input
                      type="text"
                      style={styles.input}
                      className="input"
                      placeholder="Account number"
                      value={transferData.toAccount} // Use toAccount field for the recipient's account number
                      onChange={e => {setTransferData({...transferData, toAccount: e.target.value}); setError('');}}
                      required
                    />
                  </div>

                  {(transferData.transferType === 'domestic' || transferData.transferType === 'ach' || transferData.transferType === 'wire') && (
                    <>
                      <div style={styles.formGroup}>
                        <label style={styles.label}>Bank Name</label>
                        <input
                          type="text"
                          style={styles.input}
                          className="input"
                          placeholder="Recipient's bank name"
                          value={transferData.bankName}
                          onChange={e => {setTransferData({...transferData, bankName: e.target.value}); setError('');}}
                          required
                        />
                      </div>

                      <div style={styles.formGroup}>
                        <label style={styles.label}>Routing Number</label>
                        <input
                          type="text"
                          style={styles.input}
                          className="input"
                          placeholder="9-digit routing number"
                          value={transferData.routingNumber}
                          onChange={e => {setTransferData({...transferData, routingNumber: e.target.value}); setError('');}}
                          required
                        />
                      </div>
                    </>
                  )}

                  {transferData.transferType === 'international' && (
                    <>
                      <div style={styles.formGroup}>
                        <label style={styles.label}>SWIFT Code</label>
                        <input
                          type="text"
                          style={styles.input}
                          className="input"
                          placeholder="SWIFT/BIC code"
                          value={transferData.swiftCode}
                          onChange={e => {setTransferData({...transferData, swiftCode: e.target.value}); setError('');}}
                          required
                        />
                      </div>

                      <div style={styles.formGroup}>
                        <label style={styles.label}>Country</label>
                        <input
                          type="text"
                          style={styles.input}
                          className="input"
                          placeholder="Recipient's country"
                          value={transferData.country}
                          onChange={e => {setTransferData({...transferData, country: e.target.value}); setError('');}}
                          required
                        />
                      </div>
                    </>
                  )}
                </>
              )}

              <div style={styles.formGroup}>
                <label style={styles.label}>Amount</label>
                <input
                  type="number"
                  step="0.01"
                  style={styles.input}
                  className="input"
                  placeholder="0.00"
                  value={transferData.amount}
                  onChange={e => {setTransferData({...transferData, amount: e.target.value}); setError('');}}
                  required
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Description (Optional)</label>
                <input
                  type="text"
                  style={styles.input}
                  className="input"
                  placeholder="What's this for?"
                  value={transferData.description}
                  onChange={e => setTransferData({...transferData, description: e.target.value})}
                />
              </div>

              <div style={styles.modalActions}>
                <button
                  type="button"
                  onClick={() => setShowTransferModal(false)}
                  style={styles.secondaryButton}
                  className="secondary-button"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => router.push('/transfer')}
                  style={{...styles.secondaryButton, backgroundColor: '#e0f2fe', color: '#0277bd'}}
                  className="secondary-button"
                >
                  Advanced Transfer
                </button>
                <button
                  type="submit"
                  style={styles.primaryButton}
                  className="primary-button"
                  disabled={loading}
                >
                  {loading ? 'Processing...' : 'Transfer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Withdrawal Modal */}
      {showWithdrawalModal && (
        <div style={styles.modal} onClick={() => setShowWithdrawalModal(false)}>
          <div style={styles.modalContent} onClick={e => e.stopPropagation()}>
            <h3 style={styles.modalTitle}>Withdraw Money</h3>
            <form onSubmit={handleWithdrawal}>
              <div style={styles.formGroup}>
                <label style={styles.label}>From Account</label>
                <select
                  style={styles.select}
                  className="select"
                  value={withdrawalData.fromAccount}
                  onChange={e => {
                    setWithdrawalData({...withdrawalData, fromAccount: e.target.value});
                    setError(''); // Clear error on input change
                  }}
                  required
                >
                  <option value="">Select account to withdraw from</option>
                  {accounts.map(account => (
                    <option key={account.id} value={account.id}>
                      {account.account_name || account.account_type?.replace('_', ' ')?.toUpperCase()} - ****{account.account_number?.slice(-4)} - {formatCurrency(account.balance || 0)}
                    </option>
                  ))}
                </select>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Withdrawal Method</label>
                <select
                  style={styles.select}
                  className="select"
                  value={withdrawalData.withdrawalMethod}
                  onChange={e => {
                    setWithdrawalData({...withdrawalData, withdrawalMethod: e.target.value, recipientAccount: '', bankName: '', routingNumber: ''}); // Reset fields
                    setError(''); // Clear error on input change
                  }}
                  required
                >
                  <option value="atm">ATM Withdrawal</option>
                  <option value="bank_transfer">Bank Transfer</option>
                  <option value="check">Check Request</option>
                  <option value="wire_transfer">Wire Transfer</option>
                </select>
              </div>

              {withdrawalData.withdrawalMethod === 'bank_transfer' && (
                <>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Recipient Account Number</label>
                    <input
                      type="text"
                      style={styles.input}
                      className="input"
                      placeholder="Account number"
                      value={withdrawalData.recipientAccount}
                      onChange={e => {setWithdrawalData({...withdrawalData, recipientAccount: e.target.value}); setError('');}}
                      required
                    />
                  </div>

                  <div style={styles.formGroup}>
                    <label style={styles.label}>Bank Name</label>
                    <input
                      type="text"
                      style={styles.input}
                      className="input"
                      placeholder="Bank name"
                      value={withdrawalData.bankName}
                      onChange={e => {setWithdrawalData({...withdrawalData, bankName: e.target.value}); setError('');}}
                      required
                    />
                  </div>

                  <div style={styles.formGroup}>
                    <label style={styles.label}>Routing Number</label>
                    <input
                      type="text"
                      style={styles.input}
                      className="input"
                      placeholder="9-digit routing number"
                      value={withdrawalData.routingNumber}
                      onChange={e => {setWithdrawalData({...withdrawalData, routingNumber: e.target.value}); setError('');}}
                      required
                    />
                  </div>
                </>
              )}

              <div style={styles.formGroup}>
                <label style={styles.label}>Amount</label>
                <input
                  type="number"
                  step="0.01"
                  style={styles.input}
                  className="input"
                  placeholder="0.00"
                  value={withdrawalData.amount}
                  onChange={e => {setWithdrawalData({...withdrawalData, amount: e.target.value}); setError('');}}
                  required
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Description (Optional)</label>
                <input
                  type="text"
                  style={styles.input}
                  className="input"
                  placeholder="Purpose of withdrawal"
                  value={withdrawalData.description}
                  onChange={e => setWithdrawalData({...withdrawalData, description: e.target.value})}
                />
              </div>

              <div style={styles.modalActions}>
                <button
                  type="button"
                  onClick={() => setShowWithdrawalModal(false)}
                  style={styles.secondaryButton}
                  className="secondary-button"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={styles.primaryButton}
                  className="primary-button"
                >
                  Withdraw
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Payment Modal */}
      {showPayModal && (
        <div style={styles.modal} onClick={() => setShowPayModal(false)}>
          <div style={styles.modalContent} onClick={e => e.stopPropagation()}>
            <h3 style={styles.modalTitle}>Pay Bills</h3>
            <form onSubmit={handlePayment}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Payee</label>
                <input
                  type="text"
                  style={styles.input}
                  className="input"
                  placeholder="Company or person name"
                  value={paymentData.payee}
                  onChange={e => {setPaymentData({...paymentData, payee: e.target.value}); setError('');}}
                  required
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Amount</label>
                <input
                  type="number"
                  step="0.01"
                  style={styles.input}
                  className="input"
                  placeholder="0.00"
                  value={paymentData.amount}
                  onChange={e => {setPaymentData({...paymentData, amount: e.target.value}); setError('');}}
                  required
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Due Date</label>
                <input
                  type="date"
                  style={styles.input}
                  className="input"
                  value={paymentData.dueDate}
                  onChange={e => {setPaymentData({...paymentData, dueDate: e.target.value}); setError('');}}
                  required
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Description</label>
                <input
                  type="text"
                  style={styles.input}
                  className="input"
                  placeholder="Account number or memo"
                  value={paymentData.description}
                  onChange={e => setPaymentData({...paymentData, description: e.target.value})}
                />
              </div>

              <div style={styles.modalActions}>
                <button
                  type="button"
                  onClick={() => setShowPayModal(false)}
                  style={styles.secondaryButton}
                  className="secondary-button"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={styles.primaryButton}
                  className="primary-button"
                >
                  Schedule Payment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}