import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useRouter } from 'next/router';
import Link from 'next/link'; // Import Link

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
      backgroundColor: '#f8fafc',
    },
    headerSection: {
      background: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 50%, #60a5fa 100%)',
      color: 'white',
      padding: '30px 0',
    },
    headerContent: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '0 20px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      flexWrap: 'wrap',
      gap: '20px',
    },
    welcomeSection: {
      flex: '1',
      minWidth: '300px',
    },
    welcomeTitle: {
      fontSize: '28px',
      fontWeight: '700',
      margin: '0 0 8px 0',
      letterSpacing: '-0.025em',
    },
    welcomeSubtitle: {
      fontSize: '16px',
      opacity: 0.9,
      margin: 0,
    },
    headerStats: {
      display: 'flex',
      gap: '20px',
      flexWrap: 'wrap',
    },
    statCard: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      backdropFilter: 'blur(10px)',
      padding: '16px 20px',
      borderRadius: '12px',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      minWidth: '140px',
    },
    statIcon: {
      fontSize: '24px',
    },
    statInfo: {
      display: 'flex',
      flexDirection: 'column',
    },
    statLabel: {
      fontSize: '12px',
      opacity: 0.8,
      marginBottom: '4px',
    },
    statValue: {
      fontSize: '16px',
      fontWeight: '600',
    },
    dashboardContainer: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '30px 20px',
      gap: '30px',
      display: 'flex',
      flexDirection: 'column',
    },
    quickActionsContainer: {
      backgroundColor: 'white',
      borderRadius: '16px',
      padding: '28px',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      border: '1px solid #e5e7eb',
    },
    sectionTitle: {
      fontSize: '20px',
      fontWeight: '700',
      color: '#111827',
      marginBottom: '20px',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
    },
    sectionIcon: {
      fontSize: '20px',
    },
    quickActions: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
      gap: '16px',
    },
    quickActionLink: {
      textDecoration: 'none',
      color: 'inherit',
    },
    quickAction: {
      display: 'flex',
      alignItems: 'center',
      padding: '20px',
      backgroundColor: '#ffffff',
      borderRadius: '12px',
      border: '2px solid #f3f4f6',
      cursor: 'pointer',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      gap: '16px',
      position: 'relative',
      overflow: 'hidden',
    },
    quickActionIconContainer: {
      width: '48px',
      height: '48px',
      borderRadius: '12px',
      backgroundColor: '#f0f9ff',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
    },
    quickActionIcon: {
      fontSize: '24px',
    },
    quickActionContent: {
      display: 'flex',
      flexDirection: 'column',
      gap: '4px',
    },
    quickActionTitle: {
      fontSize: '16px',
      fontWeight: '600',
      color: '#111827',
    },
    quickActionDesc: {
      fontSize: '14px',
      color: '#6b7280',
    },
    accountsSection: {
      backgroundColor: 'white',
      borderRadius: '16px',
      padding: '28px',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      border: '1px solid #e5e7eb',
    },
    accountsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
      gap: '20px',
    },
    enhancedAccountCard: {
      backgroundColor: '#ffffff',
      border: '2px solid #f3f4f6',
      borderRadius: '16px',
      padding: '24px',
      transition: 'all 0.3s ease',
      cursor: 'pointer',
      position: 'relative',
      overflow: 'hidden',
    },
    accountHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '20px',
    },
    accountType: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
    },
    accountTypeIcon: {
      fontSize: '20px',
    },
    accountTypeName: {
      fontSize: '16px',
      fontWeight: '600',
      color: '#111827',
    },
    accountMenu: {
      fontSize: '16px',
      color: '#6b7280',
      cursor: 'pointer',
      padding: '4px',
    },
    accountBalance: {
      display: 'flex',
      flexDirection: 'column',
      gap: '4px',
      marginBottom: '16px',
    },
    balanceLabel: {
      fontSize: '14px',
      color: '#6b7280',
    },
    balanceAmount: {
      fontSize: '28px',
      fontWeight: '700',
      color: '#111827',
    },
    accountNumber: {
      display: 'flex',
      flexDirection: 'column',
      gap: '4px',
      marginBottom: '20px',
    },
    accountNumberLabel: {
      fontSize: '12px',
      color: '#6b7280',
      textTransform: 'uppercase',
      letterSpacing: '0.05em',
    },
    accountNumberValue: {
      fontSize: '14px',
      fontWeight: '500',
      color: '#374151',
      fontFamily: 'monospace',
    },
    accountActions: {
      display: 'flex',
      gap: '12px',
    },
    accountActionBtn: {
      flex: 1,
      padding: '10px 16px',
      backgroundColor: '#1e40af',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      fontSize: '14px',
      fontWeight: '500',
      cursor: 'pointer',
      transition: 'background-color 0.2s',
    },
    accountActionBtnSecondary: {
      flex: 1,
      padding: '10px 16px',
      backgroundColor: 'transparent',
      color: '#1e40af',
      border: '1px solid #1e40af',
      borderRadius: '8px',
      fontSize: '14px',
      fontWeight: '500',
      cursor: 'pointer',
      transition: 'all 0.2s',
    },
    transactionsSection: {
      backgroundColor: 'white',
      borderRadius: '16px',
      padding: '28px',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      border: '1px solid #e5e7eb',
    },
    transactionsHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '20px',
    },
    viewAllLink: {
      color: '#1e40af',
      textDecoration: 'none',
      fontSize: '14px',
      fontWeight: '500',
    },
    transactionsList: {
      display: 'flex',
      flexDirection: 'column',
      gap: '12px',
    },
    enhancedTransactionItem: {
      display: 'flex',
      alignItems: 'center',
      padding: '16px',
      backgroundColor: '#f9fafb',
      borderRadius: '12px',
      border: '1px solid #e5e7eb',
      gap: '16px',
    },
    transactionIcon: {
      width: '40px',
      height: '40px',
      borderRadius: '10px',
      backgroundColor: '#f0f9ff',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '18px',
      flexShrink: 0,
    },
    transactionDetails: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      gap: '4px',
    },
    transactionDescription: {
      fontSize: '16px',
      fontWeight: '500',
      color: '#111827',
    },
    transactionDate: {
      fontSize: '14px',
      color: '#6b7280',
    },
    transactionAmount: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-end',
      gap: '4px',
    },
    transactionAmountValue: {
      fontSize: '16px',
      fontWeight: '600',
    },
    transactionStatus: {
      fontSize: '12px',
      color: '#10b981',
      backgroundColor: '#d1fae5',
      padding: '2px 8px',
      borderRadius: '12px',
    },
    noTransactionsCard: {
      textAlign: 'center',
      padding: '60px 40px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '12px',
    },
    noTransactionsIcon: {
      fontSize: '48px',
      opacity: 0.5,
    },
    noTransactions: {
      color: '#6b7280',
      fontSize: '18px',
      fontWeight: '500',
      margin: 0,
    },
    noTransactionsSubtext: {
      color: '#9ca3af',
      fontSize: '14px',
      margin: 0,
    },
    // Original styles that are no longer needed or replaced
    // container: {
    //   minHeight: '100vh',
    //   backgroundColor: '#f8fafc',
    // },
    // dashboardContainer: {
    //   maxWidth: '1200px',
    //   margin: '0 auto',
    //   padding: '20px',
    //   gap: '30px',
    //   display: 'flex',
    //   flexDirection: 'column',
    // },
    // quickActionsContainer: {
    //   backgroundColor: 'white',
    //   borderRadius: '12px',
    //   padding: '24px',
    //   boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    // },
    // sectionTitle: {
    //   fontSize: '18px',
    //   fontWeight: '600',
    //   color: '#1f2937',
    //   marginBottom: '16px',
    // },
    // quickActions: {
    //   display: 'grid',
    //   gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    //   gap: '16px',
    // },
    // quickActionLink: {
    //   textDecoration: 'none',
    //   color: 'inherit',
    // },
    // quickAction: {
    //   display: 'flex',
    //   alignItems: 'center',
    //   padding: '16px',
    //   backgroundColor: '#f9fafb',
    //   borderRadius: '8px',
    //   border: '1px solid #e5e7eb',
    //   cursor: 'pointer',
    //   transition: 'all 0.2s',
    //   gap: '12px',
    // },
    // quickActionIcon: {
    //   fontSize: '24px',
    // },
    // accountsSection: {
    //   backgroundColor: 'white',
    //   borderRadius: '12px',
    //   padding: '24px',
    //   boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    // },
    // accountsGrid: {
    //   display: 'grid',
    //   gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    //   gap: '16px',
    // },
    // transactionsSection: {
    //   backgroundColor: 'white',
    //   borderRadius: '12px',
    //   padding: '24px',
    //   boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    // },
    // transactionsList: {
    //   display: 'flex',
    //   flexDirection: 'column',
    //   gap: '12px',
    // },
    // noTransactions: {
    //   textAlign: 'center',
    //   color: '#6b7280',
    //   padding: '40px',
    //   fontSize: '16px',
    // },
  };

  // Mock data for recentTransactions for demonstration
  const recentTransactions = [
    { id: 1, type: 'deposit', amount: 1500.50, description: 'Salary Deposit', created_at: '2023-10-26T10:00:00Z' },
    { id: 2, type: 'withdrawal', amount: -250.75, description: 'ATM Withdrawal', created_at: '2023-10-25T15:30:00Z' },
    { id: 3, type: 'transfer', amount: -100.00, description: 'Transfer to John Doe', created_at: '2023-10-24T09:15:00Z' },
    { id: 4, type: 'payment', amount: -75.20, description: 'Electricity Bill', created_at: '2023-10-23T11:45:00Z' },
  ];


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