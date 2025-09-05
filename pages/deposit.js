// pages/deposit.js
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

export default function Deposit() {
  const [accounts, setAccounts] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState('');
  const [amount, setAmount] = useState('');
  const [depositMethod, setDepositMethod] = useState('debit_card');
  const [paymentDetails, setPaymentDetails] = useState({
    card_number: '',
    expiry: '',
    cvv: '',
    cardholder_name: '',
    routing_number: '',
    account_number: '',
    bank_name: '',
    zelle_email: '',
    zelle_phone: '',
    venmo_username: '',
    cashapp_cashtag: '',
    chime_phone: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('accounts')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setAccounts(data || []);
      if (data?.length > 0) setSelectedAccount(data[0].id);
    } catch (error) {
      console.error('Error fetching accounts:', error);
      setMessage('Unable to load accounts. Please try again.');
    }
  };

  const handlePaymentDetailsChange = (field, value) => {
    setPaymentDetails(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    if (!selectedAccount || !amount || parseFloat(amount) <= 0) {
      setMessage('Please select an account and enter a valid amount.');
      return false;
    }

    if (parseFloat(amount) > 50000) {
      setMessage('Deposits over $50,000 require additional verification. Please contact support.');
      return false;
    }

    // Validate payment method specific fields
    switch (depositMethod) {
      case 'debit_card':
      case 'credit_card':
        if (!paymentDetails.card_number || !paymentDetails.expiry || !paymentDetails.cvv || !paymentDetails.cardholder_name) {
          setMessage('Please fill in all card details.');
          return false;
        }
        break;
      case 'bank_transfer':
        if (!paymentDetails.routing_number || !paymentDetails.account_number || !paymentDetails.bank_name) {
          setMessage('Please fill in all bank transfer details.');
          return false;
        }
        break;
      case 'zelle':
        if (!paymentDetails.zelle_email && !paymentDetails.zelle_phone) {
          setMessage('Please provide either Zelle email or phone number.');
          return false;
        }
        break;
      case 'venmo':
        if (!paymentDetails.venmo_username) {
          setMessage('Please provide your Venmo username.');
          return false;
        }
        break;
      case 'cash_app':
        if (!paymentDetails.cashapp_cashtag) {
          setMessage('Please provide your Cash App $Cashtag.');
          return false;
        }
        break;
      case 'chime':
        if (!paymentDetails.chime_phone) {
          setMessage('Please provide your Chime phone number.');
          return false;
        }
        break;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setMessage('');

    try {
      const selectedAccountData = accounts.find(acc => acc.id === selectedAccount);
      const depositAmount = parseFloat(amount);

      // Create transaction record
      const { error: transactionError } = await supabase
        .from('transactions')
        .insert([{
          account_id: selectedAccount,
          type: 'deposit',
          amount: depositAmount,
          status: 'pending',
          reference: `${depositMethod.toUpperCase()} deposit - ${new Date().toISOString()}`
        }]);

      if (transactionError) throw transactionError;

      // Update account balance (in real banking, this would happen after payment processing)
      const newBalance = parseFloat(selectedAccountData.balance) + depositAmount;
      const { error: updateError } = await supabase
        .from('accounts')
        .update({ balance: newBalance, updated_at: new Date().toISOString() })
        .eq('id', selectedAccount);

      if (updateError) throw updateError;

      // Create notification
      const { data: { user } } = await supabase.auth.getUser();
      await supabase.from('notifications').insert([{
        user_id: user.id,
        type: 'deposit',
        title: 'Deposit Processed',
        message: `$${depositAmount.toFixed(2)} deposited to account ${selectedAccountData.account_number} via ${depositMethod.replace('_', ' ')}`
      }]);

      setMessage(`✅ Deposit of $${depositAmount.toFixed(2)} has been processed successfully!`);
      setAmount('');
      setPaymentDetails({
        card_number: '', expiry: '', cvv: '', cardholder_name: '',
        routing_number: '', account_number: '', bank_name: '',
        zelle_email: '', zelle_phone: '', venmo_username: '',
        cashapp_cashtag: '', chime_phone: ''
      });
      
      // Refresh accounts to show updated balance
      fetchAccounts();

    } catch (error) {
      console.error('Deposit error:', error);
      setMessage(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: '100%',
    padding: '12px',
    border: '2px solid #e1e5e9',
    borderRadius: '8px',
    fontSize: '14px',
    marginBottom: '15px',
    boxSizing: 'border-box'
  };

  const selectStyle = {
    ...inputStyle,
    backgroundColor: 'white'
  };

  const buttonStyle = {
    width: '100%',
    padding: '15px',
    backgroundColor: '#28a745',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: loading ? 'not-allowed' : 'pointer',
    opacity: loading ? 0.6 : 1
  };

  const renderPaymentMethodFields = () => {
    switch (depositMethod) {
      case 'debit_card':
      case 'credit_card':
        return (
          <>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
              Cardholder Name:
            </label>
            <input
              type="text"
              style={inputStyle}
              value={paymentDetails.cardholder_name}
              onChange={(e) => handlePaymentDetailsChange('cardholder_name', e.target.value)}
              placeholder="Full name on card"
              required
            />
            
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
              Card Number:
            </label>
            <input
              type="text"
              style={inputStyle}
              value={paymentDetails.card_number}
              onChange={(e) => handlePaymentDetailsChange('card_number', e.target.value)}
              placeholder="1234 5678 9012 3456"
              maxLength="19"
              required
            />
            
            <div style={{ display: 'flex', gap: '15px' }}>
              <div style={{ flex: '1' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                  Expiry (MM/YY):
                </label>
                <input
                  type="text"
                  style={inputStyle}
                  value={paymentDetails.expiry}
                  onChange={(e) => handlePaymentDetailsChange('expiry', e.target.value)}
                  placeholder="12/26"
                  maxLength="5"
                  required
                />
              </div>
              <div style={{ flex: '1' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                  CVV:
                </label>
                <input
                  type="text"
                  style={inputStyle}
                  value={paymentDetails.cvv}
                  onChange={(e) => handlePaymentDetailsChange('cvv', e.target.value)}
                  placeholder="123"
                  maxLength="4"
                  required
                />
              </div>
            </div>
          </>
        );

      case 'bank_transfer':
        return (
          <>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
              Bank Name:
            </label>
            <input
              type="text"
              style={inputStyle}
              value={paymentDetails.bank_name}
              onChange={(e) => handlePaymentDetailsChange('bank_name', e.target.value)}
              placeholder="Bank of America"
              required
            />
            
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
              Routing Number:
            </label>
            <input
              type="text"
              style={inputStyle}
              value={paymentDetails.routing_number}
              onChange={(e) => handlePaymentDetailsChange('routing_number', e.target.value)}
              placeholder="123456789"
              maxLength="9"
              required
            />
            
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
              Account Number:
            </label>
            <input
              type="text"
              style={inputStyle}
              value={paymentDetails.account_number}
              onChange={(e) => handlePaymentDetailsChange('account_number', e.target.value)}
              placeholder="Account number"
              required
            />
          </>
        );

      case 'zelle':
        return (
          <>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
              Zelle Email:
            </label>
            <input
              type="email"
              style={inputStyle}
              value={paymentDetails.zelle_email}
              onChange={(e) => handlePaymentDetailsChange('zelle_email', e.target.value)}
              placeholder="your-email@example.com"
            />
            
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
              Or Zelle Phone:
            </label>
            <input
              type="tel"
              style={inputStyle}
              value={paymentDetails.zelle_phone}
              onChange={(e) => handlePaymentDetailsChange('zelle_phone', e.target.value)}
              placeholder="(555) 123-4567"
            />
            <p style={{ fontSize: '12px', color: '#666', margin: '-10px 0 15px 0' }}>
              Provide either email or phone number registered with Zelle
            </p>
          </>
        );

      case 'venmo':
        return (
          <>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
              Venmo Username:
            </label>
            <input
              type="text"
              style={inputStyle}
              value={paymentDetails.venmo_username}
              onChange={(e) => handlePaymentDetailsChange('venmo_username', e.target.value)}
              placeholder="@username"
              required
            />
          </>
        );

      case 'cash_app':
        return (
          <>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
              Cash App $Cashtag:
            </label>
            <input
              type="text"
              style={inputStyle}
              value={paymentDetails.cashapp_cashtag}
              onChange={(e) => handlePaymentDetailsChange('cashapp_cashtag', e.target.value)}
              placeholder="$YourCashTag"
              required
            />
          </>
        );

      case 'chime':
        return (
          <>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
              Chime Phone Number:
            </label>
            <input
              type="tel"
              style={inputStyle}
              value={paymentDetails.chime_phone}
              onChange={(e) => handlePaymentDetailsChange('chime_phone', e.target.value)}
              placeholder="(555) 123-4567"
              required
            />
          </>
        );

      default:
        return null;
    }
  };

  if (accounts.length === 0) {
    return (
      <div style={{
        maxWidth: '600px',
        margin: '40px auto',
        padding: '40px',
        textAlign: 'center',
        backgroundColor: '#f8f9fa',
        borderRadius: '12px'
      }}>
        <h1 style={{ color: '#0070f3' }}>No Accounts Found</h1>
        <p>You need to have at least one account to make deposits. Please contact support or apply for an account first.</p>
      </div>
    );
  }

  return (
    <div style={{
      maxWidth: '600px',
      margin: '40px auto',
      padding: '40px',
      backgroundColor: '#f8f9fa',
      borderRadius: '12px',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h1 style={{ color: '#0070f3', textAlign: 'center', marginBottom: '30px' }}>
        💰 Make a Deposit
      </h1>

      {message && (
        <div style={{
          padding: '15px',
          marginBottom: '20px',
          borderRadius: '8px',
          backgroundColor: message.includes('✅') ? '#e8f5e8' : '#ffeaa7',
          border: `1px solid ${message.includes('✅') ? '#4caf50' : '#f39c12'}`,
          color: message.includes('✅') ? '#2e7d32' : '#d68910'
        }}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
          Deposit To Account:
        </label>
        <select
          style={selectStyle}
          value={selectedAccount}
          onChange={(e) => setSelectedAccount(e.target.value)}
          required
        >
          {accounts.map(account => (
            <option key={account.id} value={account.id}>
              {account.account_number} ({account.account_type}) - ${parseFloat(account.balance).toFixed(2)}
            </option>
          ))}
        </select>

        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
          Deposit Amount ($):
        </label>
        <input
          type="number"
          style={inputStyle}
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Enter amount"
          step="0.01"
          min="0.01"
          max="50000"
          required
        />

        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
          Deposit Method:
        </label>
        <select
          style={selectStyle}
          value={depositMethod}
          onChange={(e) => setDepositMethod(e.target.value)}
          required
        >
          <option value="debit_card">💳 Debit Card</option>
          <option value="credit_card">💳 Credit Card</option>
          <option value="bank_transfer">🏦 Bank Transfer (ACH)</option>
          <option value="zelle">⚡ Zelle</option>
          <option value="venmo">💙 Venmo</option>
          <option value="cash_app">💚 Cash App</option>
          <option value="chime">🟢 Chime</option>
          <option value="wire_transfer">📡 Wire Transfer</option>
        </select>

        <div style={{ 
          backgroundColor: 'white', 
          padding: '20px', 
          borderRadius: '8px', 
          marginBottom: '20px',
          border: '1px solid #e1e5e9' 
        }}>
          <h3 style={{ color: '#0070f3', marginBottom: '15px' }}>
            Payment Details
          </h3>
          {renderPaymentMethodFields()}
        </div>

        <button type="submit" style={buttonStyle} disabled={loading}>
          {loading ? 'Processing Deposit...' : `Deposit $${amount || '0.00'}`}
        </button>
      </form>

      <div style={{
        marginTop: '20px',
        padding: '15px',
        backgroundColor: 'white',
        borderRadius: '8px',
        border: '1px solid #e1e5e9',
        fontSize: '12px',
        color: '#666'
      }}>
        <strong>Important Notes:</strong>
        <ul style={{ margin: '10px 0', paddingLeft: '20px' }}>
          <li>Deposits may take 1-3 business days to process</li>
          <li>Maximum single deposit: $50,000</li>
          <li>Card deposits may incur processing fees</li>
          <li>Bank transfers are typically free</li>
          <li>All transactions are secured with bank-level encryption</li>
        </ul>
      </div>
    </div>
  );
}