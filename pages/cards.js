
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { supabase } from '../lib/supabaseClient';

export default function Cards() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [cards, setCards] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCard, setActiveCard] = useState(null);
  const [showCardForm, setShowCardForm] = useState(false);
  const [processingPayment, setProcessingPayment] = useState(false);
  const [paymentForm, setPaymentForm] = useState({
    amount: '',
    merchant: '',
    description: ''
  });

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) {
        console.error('Auth error:', error);
        router.push('/login');
        return;
      }
      if (!user) {
        router.push('/login');
        return;
      }
      setUser(user);
      await Promise.all([
        fetchUserCards(user.id),
        fetchUserAccounts(user.id),
        fetchCardTransactions(user.id)
      ]);
    } catch (error) {
      console.error('Error checking user:', error);
      // Don't redirect on error, just log it
    } finally {
      setLoading(false);
    }
  };

  const fetchUserCards = async (userId) => {
    try {
      // First try to get cards directly by user_id
      let { data, error } = await supabase
        .from('cards')
        .select('*')
        .eq('user_id', userId)
        .eq('status', 'active');

      // If that fails, try getting through profiles/applications
      if (error || !data || data.length === 0) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('application_id')
          .eq('id', userId)
          .single();

        if (profile?.application_id) {
          const { data: accounts } = await supabase
            .from('accounts')
            .select('id')
            .eq('application_id', profile.application_id);

          if (accounts && accounts.length > 0) {
            const accountIds = accounts.map(acc => acc.id);
            const { data: cardsData, error: cardsError } = await supabase
              .from('cards')
              .select('*')
              .in('account_id', accountIds)
              .eq('status', 'active');

            if (!cardsError) {
              data = cardsData;
            }
          }
        }
      }

      setCards(data || []);
      if (data && data.length > 0) {
        setActiveCard(data[0]);
      }
    } catch (error) {
      console.error('Error fetching cards:', error);
    }
  };

  const fetchUserAccounts = async (userId) => {
    try {
      // Get user's accounts through profile/application connection
      const { data: profile } = await supabase
        .from('profiles')
        .select('application_id')
        .eq('id', userId)
        .single();

      if (!profile?.application_id) {
        console.log('No application found for user');
        return;
      }

      const { data, error } = await supabase
        .from('accounts')
        .select('*')
        .eq('application_id', profile.application_id)
        .eq('status', 'active');

      if (error) throw error;
      setAccounts(data || []);
    } catch (error) {
      console.error('Error fetching accounts:', error);
    }
  };

  const fetchCardTransactions = async (userId) => {
    try {
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      setTransactions(data || []);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  };

  const applyForCard = async () => {
    if (!user) {
      alert('Please log in to apply for a card');
      return;
    }

    try {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      if (sessionError) {
        console.error('Session error:', sessionError);
        alert('Session error. Please try logging in again.');
        return;
      }
      
      if (!session) {
        alert('Please log in to apply for a card');
        router.push('/login');
        return;
      }

      // If user has no accounts, redirect to account application
      if (accounts.length === 0) {
        if (confirm('You need to have an account first. Would you like to apply for one?')) {
          router.push('/apply');
        }
        return;
      }

      const response = await fetch('/api/apply-card', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          accountId: accounts[0].id
        })
      });

      const data = await response.json();
      
      if (data.success) {
        alert('✅ Card application submitted successfully! You will receive confirmation once approved.');
        await fetchUserCards(user.id);
      } else {
        alert('❌ ' + (data.error || 'Failed to submit application'));
      }
    } catch (error) {
      console.error('Error applying for card:', error);
      alert('❌ Error applying for card. Please try again.');
    }
  };

  const approveCardApplication = async (applicationId) => {
    try {
      // Generate card details
      const cardNumber = generateCardNumber();
      const expiryDate = generateExpiryDate();
      const cvv = generateCVV();

      // Update application
      await supabase
        .from('card_applications')
        .update({
          status: 'approved',
          card_number: cardNumber,
          expiry_date: expiryDate,
          cvv: cvv,
          approved_at: new Date().toISOString()
        })
        .eq('id', applicationId);

      // Create card record
      const { data: application } = await supabase
        .from('card_applications')
        .select('*')
        .eq('id', applicationId)
        .single();

      await supabase
        .from('cards')
        .insert([{
          user_id: application.user_id,
          account_id: application.account_id,
          application_id: applicationId,
          card_number: cardNumber,
          cardholder_name: application.cardholder_name,
          expiry_date: expiryDate,
          cvv: cvv,
          status: 'active'
        }]);

    } catch (error) {
      console.error('Error approving card application:', error);
    }
  };

  const processCardPayment = async () => {
    if (!activeCard || !paymentForm.amount || !paymentForm.merchant) {
      alert('Please fill in all payment details');
      return;
    }

    setProcessingPayment(true);
    try {
      const amount = parseFloat(paymentForm.amount);
      const linkedAccount = accounts.find(acc => acc.id === activeCard.account_id);
      
      if (!linkedAccount || linkedAccount.balance < amount) {
        alert('Insufficient funds in linked account');
        return;
      }

      // Process transaction
      const { error: transactionError } = await supabase
        .from('transactions')
        .insert([{
          user_id: user.id,
          account_id: linkedAccount.id,
          type: 'debit',
          amount: -amount,
          description: `Card payment at ${paymentForm.merchant}`,
          merchant_name: paymentForm.merchant,
          category: 'Card Payment',
          status: 'completed'
        }]);

      if (transactionError) throw transactionError;

      // Update account balance
      const { error: balanceError } = await supabase
        .from('accounts')
        .update({ balance: linkedAccount.balance - amount })
        .eq('id', linkedAccount.id);

      if (balanceError) throw balanceError;

      alert('Payment processed successfully!');
      setPaymentForm({ amount: '', merchant: '', description: '' });
      await Promise.all([
        fetchUserAccounts(user.id),
        fetchCardTransactions(user.id)
      ]);

    } catch (error) {
      console.error('Error processing payment:', error);
      alert('Payment failed. Please try again.');
    } finally {
      setProcessingPayment(false);
    }
  };

  const generateCardNumber = () => {
    const prefix = '4000';
    const randomDigits = Array.from({length: 12}, () => Math.floor(Math.random() * 10)).join('');
    return `${prefix} ${randomDigits.substring(0,4)} ${randomDigits.substring(4,8)} ${randomDigits.substring(8,12)}`;
  };

  const generateExpiryDate = () => {
    const now = new Date();
    const expiry = new Date(now.getFullYear() + 2, now.getMonth());
    return `${String(expiry.getMonth() + 1).padStart(2, '0')}/${String(expiry.getFullYear()).substring(2)}`;
  };

  const generateCVV = () => {
    return String(Math.floor(Math.random() * 900) + 100);
  };

  const formatCardNumber = (number) => {
    return number.replace(/(.{4})/g, '$1 ').trim();
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
        <h1 style={styles.title}>My Cards</h1>
        <Link href="/dashboard" style={styles.backButton}>
          ← Back to Dashboard
        </Link>
      </div>

      {cards.length === 0 ? (
        <div style={styles.noCards}>
          <h2>No Cards Found</h2>
          <p>You don't have any active cards yet.</p>
          <button onClick={applyForCard} style={styles.applyButton}>
            Apply for Debit Card
          </button>
        </div>
      ) : (
        <div style={styles.cardsSection}>
          <div style={styles.cardsList}>
            {cards.map((card, index) => (
              <div
                key={card.id}
                style={{
                  ...styles.debitCard,
                  ...(activeCard?.id === card.id ? styles.activeCard : {})
                }}
                onClick={() => setActiveCard(card)}
              >
                <div style={styles.cardHeader}>
                  <span style={styles.cardType}>DEBIT CARD</span>
                  <span style={styles.cardStatus}>{card.status.toUpperCase()}</span>
                </div>
                <div style={styles.cardNumber}>
                  {formatCardNumber(card.card_number)}
                </div>
                <div style={styles.cardDetails}>
                  <div>
                    <div style={styles.cardLabel}>CARDHOLDER NAME</div>
                    <div style={styles.cardValue}>{card.cardholder_name}</div>
                  </div>
                  <div>
                    <div style={styles.cardLabel}>EXPIRES</div>
                    <div style={styles.cardValue}>{card.expiry_date}</div>
                  </div>
                </div>
                <div style={styles.cardChip}></div>
              </div>
            ))}
          </div>

          {activeCard && (
            <div style={styles.cardActions}>
              <h3>Card Actions</h3>
              
              <div style={styles.actionSection}>
                <h4>Make a Payment</h4>
                <div style={styles.paymentForm}>
                  <input
                    type="number"
                    placeholder="Amount"
                    value={paymentForm.amount}
                    onChange={(e) => setPaymentForm({...paymentForm, amount: e.target.value})}
                    style={styles.input}
                  />
                  <input
                    type="text"
                    placeholder="Merchant Name"
                    value={paymentForm.merchant}
                    onChange={(e) => setPaymentForm({...paymentForm, merchant: e.target.value})}
                    style={styles.input}
                  />
                  <input
                    type="text"
                    placeholder="Description (optional)"
                    value={paymentForm.description}
                    onChange={(e) => setPaymentForm({...paymentForm, description: e.target.value})}
                    style={styles.input}
                  />
                  <button
                    onClick={processCardPayment}
                    disabled={processingPayment}
                    style={{
                      ...styles.payButton,
                      ...(processingPayment ? styles.disabledButton : {})
                    }}
                  >
                    {processingPayment ? 'Processing...' : 'Process Payment'}
                  </button>
                </div>
              </div>

              <div style={styles.cardInfo}>
                <h4>Card Information</h4>
                <div style={styles.infoGrid}>
                  <div>
                    <strong>Daily Limit:</strong> ${activeCard.daily_limit}
                  </div>
                  <div>
                    <strong>Monthly Limit:</strong> ${activeCard.monthly_limit}
                  </div>
                  <div>
                    <strong>Status:</strong> {activeCard.status}
                  </div>
                  <div>
                    <strong>CVV:</strong> {activeCard.cvv}
                  </div>
                </div>
              </div>
            </div>
          )}

          <div style={styles.recentTransactions}>
            <h3>Recent Card Transactions</h3>
            {transactions.length === 0 ? (
              <p>No transactions yet</p>
            ) : (
              <div style={styles.transactionsList}>
                {transactions.map((transaction) => (
                  <div key={transaction.id} style={styles.transactionItem}>
                    <div>
                      <strong>{transaction.merchant_name || transaction.description}</strong>
                      <div style={styles.transactionDate}>
                        {new Date(transaction.created_at).toLocaleDateString()}
                      </div>
                    </div>
                    <div style={{
                      ...styles.transactionAmount,
                      color: transaction.amount < 0 ? '#dc3545' : '#28a745'
                    }}>
                      ${Math.abs(transaction.amount).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <button onClick={applyForCard} style={styles.newCardButton}>
            Apply for Additional Card
          </button>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#f8f9fa',
    padding: '20px'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '30px'
  },
  title: {
    fontSize: '2rem',
    fontWeight: 'bold',
    color: '#2c3e50'
  },
  backButton: {
    padding: '10px 20px',
    backgroundColor: '#6c757d',
    color: 'white',
    textDecoration: 'none',
    borderRadius: '5px'
  },
  loading: {
    textAlign: 'center',
    fontSize: '1.2rem',
    marginTop: '50px'
  },
  noCards: {
    textAlign: 'center',
    backgroundColor: 'white',
    padding: '40px',
    borderRadius: '10px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
  },
  applyButton: {
    padding: '15px 30px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    fontSize: '1.1rem',
    cursor: 'pointer',
    marginTop: '20px'
  },
  cardsSection: {
    display: 'grid',
    gap: '30px'
  },
  cardsList: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
    gap: '20px'
  },
  debitCard: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    borderRadius: '15px',
    padding: '25px',
    color: 'white',
    cursor: 'pointer',
    transition: 'transform 0.3s ease',
    position: 'relative',
    minHeight: '200px'
  },
  activeCard: {
    transform: 'scale(1.02)',
    boxShadow: '0 10px 30px rgba(0,0,0,0.3)'
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '20px'
  },
  cardType: {
    fontSize: '0.9rem',
    opacity: 0.8
  },
  cardStatus: {
    fontSize: '0.8rem',
    backgroundColor: 'rgba(255,255,255,0.2)',
    padding: '2px 8px',
    borderRadius: '10px'
  },
  cardNumber: {
    fontSize: '1.4rem',
    fontFamily: 'monospace',
    letterSpacing: '2px',
    marginBottom: '25px'
  },
  cardDetails: {
    display: 'flex',
    justifyContent: 'space-between'
  },
  cardLabel: {
    fontSize: '0.7rem',
    opacity: 0.7,
    marginBottom: '2px'
  },
  cardValue: {
    fontSize: '0.9rem',
    fontWeight: 'bold'
  },
  cardChip: {
    position: 'absolute',
    top: '80px',
    right: '25px',
    width: '40px',
    height: '30px',
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: '5px'
  },
  cardActions: {
    backgroundColor: 'white',
    padding: '25px',
    borderRadius: '10px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
  },
  actionSection: {
    marginBottom: '25px'
  },
  paymentForm: {
    display: 'grid',
    gap: '15px',
    maxWidth: '400px'
  },
  input: {
    padding: '12px',
    border: '1px solid #ddd',
    borderRadius: '5px',
    fontSize: '1rem'
  },
  payButton: {
    padding: '12px',
    backgroundColor: '#28a745',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    fontSize: '1rem',
    cursor: 'pointer'
  },
  disabledButton: {
    backgroundColor: '#6c757d',
    cursor: 'not-allowed'
  },
  cardInfo: {
    marginBottom: '25px'
  },
  infoGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '10px',
    marginTop: '10px'
  },
  recentTransactions: {
    backgroundColor: 'white',
    padding: '25px',
    borderRadius: '10px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
  },
  transactionsList: {
    display: 'grid',
    gap: '10px'
  },
  transactionItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '15px',
    backgroundColor: '#f8f9fa',
    borderRadius: '5px'
  },
  transactionDate: {
    fontSize: '0.9rem',
    color: '#6c757d',
    marginTop: '5px'
  },
  transactionAmount: {
    fontSize: '1.1rem',
    fontWeight: 'bold'
  },
  newCardButton: {
    padding: '15px 30px',
    backgroundColor: '#17a2b8',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    fontSize: '1rem',
    cursor: 'pointer',
    justifySelf: 'start'
  }
};
