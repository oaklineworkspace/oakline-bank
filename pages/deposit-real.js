
import { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { supabase } from '../lib/supabaseClient';
import { useRouter } from 'next/router';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

function DepositForm() {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [message, setMessage] = useState('');
  const [formData, setFormData] = useState({
    accountId: '',
    amount: '',
    description: ''
  });

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
      await fetchUserAccounts(user.id);
    } catch (error) {
      console.error('Error checking user:', error);
      router.push('/login');
    } finally {
      setLoading(false);
    }
  };

  const fetchUserAccounts = async (userId) => {
    try {
      // First try to get accounts linked via user_id
      let { data, error } = await supabase
        .from('accounts')
        .select('*')
        .eq('user_id', userId);

      // If no accounts found via user_id, try via profile/application relationship
      if (!data || data.length === 0) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('application_id')
          .eq('id', userId)
          .single();

        if (profile?.application_id) {
          const { data: accountsData, error: accountsError } = await supabase
            .from('accounts')
            .select('*')
            .eq('application_id', profile.application_id);

          data = accountsData;
          error = accountsError;
          
          // Update accounts to link them to the user for future queries
          if (data && data.length > 0) {
            for (const account of data) {
              await supabase
                .from('accounts')
                .update({ user_id: userId })
                .eq('id', account.id);
            }
          }
        }
      }

      if (error) throw error;
      setAccounts(data || []);
    } catch (error) {
      console.error('Error fetching accounts:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!stripe || !elements) {
      return;
    }

    if (!formData.accountId || !formData.amount) {
      setMessage('Please fill in all required fields');
      return;
    }

    const amount = parseFloat(formData.amount);
    if (amount < 1) {
      setMessage('Minimum deposit amount is $1.00');
      return;
    }

    setProcessing(true);
    setMessage('');

    try {
      // Create payment intent
      const response = await fetch('/api/stripe/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: amount,
          accountId: formData.accountId,
          userId: user.id,
          description: formData.description || 'Account deposit'
        })
      });

      const { clientSecret, error } = await response.json();

      if (error) {
        setMessage(error);
        setProcessing(false);
        return;
      }

      // Confirm payment with Stripe
      const { error: stripeError } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: {
            email: user.email,
          },
        }
      });

      if (stripeError) {
        setMessage(stripeError.message);
      } else {
        setMessage('Deposit successful! Your account will be updated shortly.');
        setFormData({ accountId: '', amount: '', description: '' });
        elements.getElement(CardElement).clear();
        
        // Refresh accounts after successful deposit
        setTimeout(() => {
          fetchUserAccounts(user.id);
        }, 2000);
      }

    } catch (error) {
      console.error('Error processing deposit:', error);
      setMessage('Failed to process deposit');
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.loading}>Loading...</div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.header}>
          <h1 style={styles.title}>Make a Real Money Deposit</h1>
          <p style={styles.subtitle}>Add funds to your account using your debit/credit card</p>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.field}>
            <label style={styles.label}>Select Account</label>
            <select
              value={formData.accountId}
              onChange={(e) => setFormData({...formData, accountId: e.target.value})}
              required
              style={styles.select}
            >
              <option value="">Choose an account...</option>
              {accounts.map(account => (
                <option key={account.id} value={account.id}>
                  {account.account_number} - {account.account_type} 
                  (Balance: ${parseFloat(account.balance || 0).toFixed(2)})
                </option>
              ))}
            </select>
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Deposit Amount ($)</label>
            <input
              type="number"
              step="0.01"
              min="1.00"
              value={formData.amount}
              onChange={(e) => setFormData({...formData, amount: e.target.value})}
              required
              style={styles.input}
              placeholder="0.00"
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Description (Optional)</label>
            <input
              type="text"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              style={styles.input}
              placeholder="What is this deposit for?"
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Payment Information</label>
            <div style={styles.cardElement}>
              <CardElement
                options={{
                  style: {
                    base: {
                      fontSize: '16px',
                      color: '#424770',
                      '::placeholder': {
                        color: '#aab7c4',
                      },
                    },
                  },
                }}
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={!stripe || processing}
            style={{
              ...styles.button,
              opacity: (!stripe || processing) ? 0.6 : 1,
              cursor: (!stripe || processing) ? 'not-allowed' : 'pointer'
            }}
          >
            {processing ? 'Processing...' : `Deposit $${formData.amount || '0.00'}`}
          </button>
        </form>

        {message && (
          <div style={{
            ...styles.message,
            backgroundColor: message.includes('successful') ? '#d1fae5' : '#fee2e2',
            color: message.includes('successful') ? '#059669' : '#dc2626'
          }}>
            {message}
          </div>
        )}

        <div style={styles.securityNote}>
          <p>🔒 Your payment information is secured by Stripe and never stored on our servers.</p>
        </div>
      </div>
    </div>
  );
}

export default function DepositReal() {
  return (
    <Elements stripe={stripePromise}>
      <DepositForm />
    </Elements>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#f8fafc',
    padding: '20px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  card: {
    backgroundColor: 'white',
    padding: '40px',
    borderRadius: '12px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
    maxWidth: '500px',
    width: '100%'
  },
  header: {
    textAlign: 'center',
    marginBottom: '30px'
  },
  title: {
    fontSize: '28px',
    fontWeight: 'bold',
    color: '#1e293b',
    margin: '0 0 8px 0'
  },
  subtitle: {
    color: '#64748b',
    fontSize: '16px',
    margin: 0
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px'
  },
  field: {
    display: 'flex',
    flexDirection: 'column'
  },
  label: {
    fontSize: '14px',
    fontWeight: '500',
    color: '#374151',
    marginBottom: '6px'
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
  cardElement: {
    padding: '12px',
    border: '1px solid #d1d5db',
    borderRadius: '8px',
    backgroundColor: 'white'
  },
  button: {
    padding: '16px',
    backgroundColor: '#3b82f6',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '18px',
    fontWeight: '600',
    marginTop: '10px'
  },
  message: {
    padding: '12px',
    borderRadius: '6px',
    marginTop: '20px',
    fontSize: '14px',
    textAlign: 'center'
  },
  loading: {
    textAlign: 'center',
    padding: '40px',
    fontSize: '18px',
    color: '#64748b'
  },
  securityNote: {
    marginTop: '20px',
    padding: '12px',
    backgroundColor: '#f1f5f9',
    borderRadius: '6px',
    fontSize: '14px',
    color: '#475569',
    textAlign: 'center'
  }
};
