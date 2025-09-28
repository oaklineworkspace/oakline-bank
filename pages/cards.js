
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../lib/supabaseClient';

export default function Cards() {
  const [user, setUser] = useState(null);
  const [cards, setCards] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedCard, setSelectedCard] = useState(null);
  const [showTransactions, setShowTransactions] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const router = useRouter();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/login');
        return;
      }
      setUser(session.user);
      await fetchUserCards(session.user);
    } catch (error) {
      console.error('Auth check error:', error);
      router.push('/login');
    }
  };

  const fetchUserCards = async (authUser) => {
    try {
      setLoading(true);
      setError('');

      console.log('Fetching cards for user:', authUser.id, 'Email:', authUser.email);

      // First, get user's accounts to establish the relationship
      const { data: userAccounts, error: accountsError } = await supabase
        .from('accounts')
        .select('*')
        .or(`user_id.eq.${authUser.id},email.eq.${authUser.email}`)
        .eq('status', 'active');

      if (accountsError) {
        console.error('Error fetching accounts:', accountsError);
        throw new Error(`Failed to fetch accounts: ${accountsError.message}`);
      }

      console.log('Found accounts:', userAccounts?.length || 0);

      // Get cards for this user
      let cardsData = [];
      if (userAccounts && userAccounts.length > 0) {
        const accountIds = userAccounts.map(acc => acc.id);
        
        const { data: userCards, error: cardsError } = await supabase
          .from('cards')
          .select(`
            *,
            accounts!inner (
              id,
              account_number,
              account_type,
              balance,
              user_id,
              email
            )
          `)
          .or(`user_id.eq.${authUser.id},account_id.in.(${accountIds.join(',')})`)
          .eq('status', 'active');

        if (cardsError) {
          console.error('Error fetching cards:', cardsError);
        } else {
          cardsData = userCards || [];
        }
      }

      // Also try direct user_id match for cards
      if (cardsData.length === 0) {
        const { data: directCards, error: directError } = await supabase
          .from('cards')
          .select(`
            *,
            accounts (
              id,
              account_number,
              account_type,
              balance,
              user_id,
              email
            )
          `)
          .eq('user_id', authUser.id);

        if (!directError && directCards) {
          cardsData = directCards;
        }
      }

      console.log('Found cards:', cardsData.length);

      // Mask sensitive card data for display
      const safeCards = cardsData.map(card => ({
        ...card,
        card_number: card.card_number ? `****-****-****-${card.card_number.slice(-4)}` : '****-****-****-0000'
      }));

      setCards(safeCards);

      // Get card applications
      let applicationsData = [];
      if (userAccounts && userAccounts.length > 0) {
        const accountIds = userAccounts.map(acc => acc.id);
        
        const { data: userApplications, error: appsError } = await supabase
          .from('card_applications')
          .select(`
            *,
            accounts (
              id,
              account_number,
              account_type,
              balance,
              user_id,
              email
            )
          `)
          .or(`user_id.eq.${authUser.id},account_id.in.(${accountIds.join(',')})`)
          .order('created_at', { ascending: false });

        if (!appsError && userApplications) {
          applicationsData = userApplications;
        }
      }

      // Also try direct user_id match for applications
      if (applicationsData.length === 0) {
        const { data: directApps, error: directAppError } = await supabase
          .from('card_applications')
          .select(`
            *,
            accounts (
              id,
              account_number,
              account_type,
              balance,
              user_id,
              email
            )
          `)
          .eq('user_id', authUser.id)
          .order('created_at', { ascending: false });

        if (!directAppError && directApps) {
          applicationsData = directApps;
        }
      }

      console.log('Found applications:', applicationsData.length);
      setApplications(applicationsData);

    } catch (error) {
      console.error('Error fetching user cards:', error);
      setError(`Failed to load cards: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleCardAction = async (cardId, action, additionalData = {}) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      let updateData = {};
      
      switch (action) {
        case 'lock':
          updateData.is_locked = true;
          break;
        case 'unlock':
          updateData.is_locked = false;
          break;
        case 'deactivate':
          updateData.status = 'inactive';
          break;
        case 'update_limits':
          if (additionalData.dailyLimit !== undefined) updateData.daily_limit = additionalData.dailyLimit;
          if (additionalData.monthlyLimit !== undefined) updateData.monthly_limit = additionalData.monthlyLimit;
          break;
        default:
          setError('Invalid action');
          return;
      }

      const { error: updateError } = await supabase
        .from('cards')
        .update(updateData)
        .eq('id', cardId)
        .eq('user_id', user.id);

      if (updateError) {
        console.error('Error updating card:', updateError);
        setError(`Failed to ${action} card: ${updateError.message}`);
      } else {
        await fetchUserCards(user); // Refresh cards
        setError('');
      }
    } catch (error) {
      console.error('Error updating card:', error);
      setError('Error updating card');
    }
  };

  const fetchCardTransactions = async (cardId) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const { data: cardTransactions, error: transError } = await supabase
        .from('card_transactions')
        .select('*')
        .eq('card_id', cardId)
        .eq('status', 'completed')
        .order('created_at', { ascending: false })
        .limit(20);

      if (transError) {
        console.error('Error fetching transactions:', transError);
        setError('Failed to fetch transactions');
      } else {
        setTransactions(cardTransactions || []);
        setShowTransactions(true);
      }
    } catch (error) {
      console.error('Error fetching transactions:', error);
      setError('Error loading transactions');
    }
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.loading}>Loading your cards...</div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>💳 My Debit Cards</h1>
        <button 
          onClick={() => router.push('/apply-card')}
          style={styles.applyButton}
        >
          + Apply for New Card
        </button>
      </div>

      {error && <div style={styles.error}>{error}</div>}

      {user && (
        <div style={styles.userInfo}>
          <p>Account holder: <strong>{user.email}</strong></p>
        </div>
      )}

      {/* Card Applications */}
      {applications.length > 0 && (
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>📋 Card Applications</h2>
          <div style={styles.applicationsGrid}>
            {applications.map((app) => (
              <div key={app.id} style={styles.applicationCard}>
                <div style={styles.applicationHeader}>
                  <h3>Card Application</h3>
                  <span style={{
                    ...styles.statusBadge,
                    backgroundColor: app.status === 'pending' ? '#fbbf24' : 
                                   app.status === 'approved' ? '#10b981' : '#ef4444'
                  }}>
                    {app.status}
                  </span>
                </div>
                <div style={styles.applicationDetails}>
                  <p><strong>Type:</strong> {app.card_type || 'Debit Card'}</p>
                  <p><strong>Applied:</strong> {new Date(app.created_at).toLocaleDateString()}</p>
                  {app.accounts && (
                    <p><strong>Account:</strong> {app.accounts.account_type} - ****{app.accounts.account_number?.slice(-4)}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Active Cards */}
      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>💳 Active Cards</h2>
        {cards.length === 0 ? (
          <div style={styles.noCards}>
            <h3>No cards found</h3>
            <p>Apply for your first debit card to get started.</p>
            <button 
              onClick={() => router.push('/apply-card')}
              style={styles.primaryButton}
            >
              Apply for Card
            </button>
          </div>
        ) : (
          <div style={styles.cardsGrid}>
            {cards.map((card) => (
              <div key={card.id} style={styles.cardItem}>
                <div style={styles.cardVisual}>
                  <div style={styles.cardNumber}>{card.card_number}</div>
                  <div style={styles.cardHolder}>{card.cardholder_name || user?.email}</div>
                  <div style={styles.cardExpiry}>Expires: {card.expiry_date}</div>
                  <div style={styles.cardType}>{(card.card_type || 'DEBIT').toUpperCase()}</div>
                </div>
                
                <div style={styles.cardDetails}>
                  <div style={styles.detailRow}>
                    <span>Status:</span>
                    <span style={{
                      color: card.status === 'active' ? '#10b981' : '#ef4444',
                      fontWeight: 'bold'
                    }}>
                      {card.status} {card.is_locked ? '(Locked)' : ''}
                    </span>
                  </div>
                  <div style={styles.detailRow}>
                    <span>Daily Limit:</span>
                    <span>${parseFloat(card.daily_limit || 1000).toFixed(2)}</span>
                  </div>
                  <div style={styles.detailRow}>
                    <span>Monthly Limit:</span>
                    <span>${parseFloat(card.monthly_limit || 10000).toFixed(2)}</span>
                  </div>
                  {card.accounts && (
                    <>
                      <div style={styles.detailRow}>
                        <span>Account:</span>
                        <span>{card.accounts.account_type}</span>
                      </div>
                      <div style={styles.detailRow}>
                        <span>Balance:</span>
                        <span>${parseFloat(card.accounts.balance || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                      </div>
                    </>
                  )}
                </div>

                <div style={styles.cardActions}>
                  <button
                    onClick={() => fetchCardTransactions(card.id)}
                    style={styles.actionButton}
                  >
                    📋 View Transactions
                  </button>
                  
                  {card.is_locked ? (
                    <button
                      onClick={() => handleCardAction(card.id, 'unlock')}
                      style={styles.unlockButton}
                    >
                      🔓 Unlock Card
                    </button>
                  ) : (
                    <button
                      onClick={() => handleCardAction(card.id, 'lock')}
                      style={styles.lockButton}
                    >
                      🔒 Lock Card
                    </button>
                  )}
                  
                  {card.status === 'active' && (
                    <button
                      onClick={() => handleCardAction(card.id, 'deactivate')}
                      style={styles.deactivateButton}
                    >
                      ❌ Deactivate
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Transaction Modal */}
      {showTransactions && (
        <div style={styles.modal} onClick={() => setShowTransactions(false)}>
          <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <h2>Card Transactions</h2>
              <button 
                onClick={() => setShowTransactions(false)}
                style={styles.closeButton}
              >
                ✕
              </button>
            </div>
            <div style={styles.transactionsList}>
              {transactions.length === 0 ? (
                <p>No transactions found.</p>
              ) : (
                transactions.map((transaction) => (
                  <div key={transaction.id} style={styles.transactionItem}>
                    <div style={styles.transactionInfo}>
                      <strong>{transaction.merchant || 'Card Transaction'}</strong>
                      <span style={styles.transactionLocation}>{transaction.location || 'N/A'}</span>
                    </div>
                    <div style={styles.transactionAmount}>
                      -${parseFloat(transaction.amount).toFixed(2)}
                    </div>
                    <div style={styles.transactionDate}>
                      {new Date(transaction.created_at).toLocaleDateString()}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      <div style={styles.navigation}>
        <button onClick={() => router.push('/dashboard')} style={styles.navButton}>
          ← Back to Dashboard
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
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
    fontSize: '28px',
    fontWeight: 'bold',
    color: '#1e3c72',
    margin: 0
  },
  applyButton: {
    background: '#28a745',
    color: 'white',
    border: 'none',
    padding: '12px 24px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: '500'
  },
  userInfo: {
    background: 'white',
    padding: '15px 20px',
    borderRadius: '8px',
    marginBottom: '20px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    color: '#666'
  },
  loading: {
    textAlign: 'center',
    padding: '40px',
    fontSize: '18px',
    color: '#666'
  },
  error: {
    color: '#dc3545',
    background: '#f8d7da',
    padding: '15px',
    borderRadius: '8px',
    marginBottom: '20px',
    textAlign: 'center'
  },
  section: {
    marginBottom: '30px'
  },
  sectionTitle: {
    fontSize: '20px',
    fontWeight: 'bold',
    color: '#1e3c72',
    marginBottom: '15px'
  },
  applicationsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
    gap: '20px',
    marginBottom: '30px'
  },
  applicationCard: {
    background: 'white',
    padding: '20px',
    borderRadius: '12px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
  },
  applicationHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '15px'
  },
  statusBadge: {
    padding: '6px 12px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: 'bold',
    color: 'white'
  },
  applicationDetails: {
    fontSize: '14px',
    color: '#666'
  },
  noCards: {
    background: 'white',
    padding: '40px',
    borderRadius: '12px',
    textAlign: 'center',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
  },
  primaryButton: {
    background: '#007bff',
    color: 'white',
    border: 'none',
    padding: '12px 24px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: '500',
    marginTop: '15px'
  },
  cardsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
    gap: '20px'
  },
  cardItem: {
    background: 'white',
    borderRadius: '12px',
    padding: '20px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
  },
  cardVisual: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    padding: '20px',
    borderRadius: '12px',
    marginBottom: '20px',
    position: 'relative',
    minHeight: '120px'
  },
  cardNumber: {
    fontSize: '18px',
    fontWeight: 'bold',
    letterSpacing: '2px',
    marginBottom: '10px'
  },
  cardHolder: {
    fontSize: '14px',
    opacity: 0.9
  },
  cardExpiry: {
    fontSize: '12px',
    position: 'absolute',
    bottom: '20px',
    left: '20px',
    opacity: 0.8
  },
  cardType: {
    fontSize: '12px',
    position: 'absolute',
    bottom: '20px',
    right: '20px',
    fontWeight: 'bold'
  },
  cardDetails: {
    marginBottom: '20px'
  },
  detailRow: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '8px 0',
    borderBottom: '1px solid #eee',
    fontSize: '14px'
  },
  cardActions: {
    display: 'flex',
    gap: '10px',
    flexWrap: 'wrap'
  },
  actionButton: {
    background: '#007bff',
    color: 'white',
    border: 'none',
    padding: '8px 16px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px',
    flex: '1',
    minWidth: '120px'
  },
  lockButton: {
    background: '#ffc107',
    color: 'black',
    border: 'none',
    padding: '8px 16px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px',
    flex: '1',
    minWidth: '120px'
  },
  unlockButton: {
    background: '#28a745',
    color: 'white',
    border: 'none',
    padding: '8px 16px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px',
    flex: '1',
    minWidth: '120px'
  },
  deactivateButton: {
    background: '#dc3545',
    color: 'white',
    border: 'none',
    padding: '8px 16px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px',
    flex: '1',
    minWidth: '120px'
  },
  modal: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0,0,0,0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000
  },
  modalContent: {
    background: 'white',
    borderRadius: '12px',
    padding: '20px',
    maxWidth: '600px',
    width: '90%',
    maxHeight: '80vh',
    overflow: 'auto'
  },
  modalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px'
  },
  closeButton: {
    background: 'none',
    border: 'none',
    fontSize: '20px',
    cursor: 'pointer'
  },
  transactionsList: {
    maxHeight: '400px',
    overflowY: 'auto'
  },
  transactionItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '15px',
    borderBottom: '1px solid #eee'
  },
  transactionInfo: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1
  },
  transactionLocation: {
    fontSize: '12px',
    color: '#666',
    marginTop: '4px'
  },
  transactionAmount: {
    fontWeight: 'bold',
    color: '#dc3545',
    fontSize: '16px'
  },
  transactionDate: {
    fontSize: '12px',
    color: '#666',
    marginLeft: '15px'
  },
  navigation: {
    marginTop: '30px',
    textAlign: 'center'
  },
  navButton: {
    background: '#6c757d',
    color: 'white',
    border: 'none',
    padding: '12px 24px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '16px'
  }
};
