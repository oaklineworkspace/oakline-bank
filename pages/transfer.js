// pages/transfer.js
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

export default function Transfer() {
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

  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // First try to get accounts linked via user_id
      let { data, error } = await supabase
        .from('accounts')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: true });

      // If no accounts found via user_id, try via profile/application relationship
      if (!data || data.length === 0) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('application_id')
          .eq('id', user.id)
          .single();

        if (profile?.application_id) {
          const { data: accountsData, error: accountsError } = await supabase
            .from('accounts')
            .select('*')
            .eq('application_id', profile.application_id)
            .order('created_at', { ascending: true });

          data = accountsData;
          error = accountsError;
        }
      }

      if (error) throw error;
      setAccounts(data || []);
      if (data?.length > 0) setFromAccount(data[0].id);
    } catch (error) {
      console.error('Error fetching accounts:', error);
      setMessage('Unable to load accounts. Please try again.');
    }
  };

  const handleTransferDetailsChange = (field, value) => {
    setTransferDetails(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    const selectedAccountData = accounts.find(acc => acc.id === fromAccount);
    const transferAmount = parseFloat(amount);

    if (!fromAccount || !toAccountNumber || !amount || transferAmount <= 0) {
      setMessage('Please select accounts and enter a valid transfer amount.');
      return false;
    }

    if (transferAmount > parseFloat(selectedAccountData.balance)) {
      setMessage('Insufficient funds. Your current balance is $' + parseFloat(selectedAccountData.balance).toFixed(2));
      return false;
    }

    if (transferAmount > 25000 && transferType !== 'internal') {
      setMessage('External transfers over $25,000 require additional verification. Please contact support.');
      return false;
    }

    // Validate transfer type specific fields
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
      const selectedAccountData = accounts.find(acc => acc.id === fromAccount);
      const transferAmount = parseFloat(amount);
      const fee = calculateFee();
      const totalDeduction = transferAmount + fee;

      if (totalDeduction > parseFloat(selectedAccountData.balance)) {
        setMessage(`Insufficient funds including fees. Total needed: $${totalDeduction.toFixed(2)}`);
        setLoading(false);
        return;
      }

      // For internal transfers, check if recipient account exists
      if (transferType === 'internal') {
        const { data: recipientAccount } = await supabase
          .from('accounts')
          .select('id, account_number, user_id')
          .eq('account_number', toAccountNumber)
          .single();

        if (!recipientAccount) {
          setMessage('Recipient account not found. Please verify the account number.');
          setLoading(false);
          return;
        }

        // Update recipient account balance
        const { data: recipientAccountData } = await supabase
          .from('accounts')
          .select('balance')
          .eq('id', recipientAccount.id)
          .single();

        const newRecipientBalance = parseFloat(recipientAccountData.balance) + transferAmount;
        await supabase
          .from('accounts')
          .update({ balance: newRecipientBalance, updated_at: new Date().toISOString() })
          .eq('id', recipientAccount.id);

        // Create recipient transaction record
        await supabase.from('transactions').insert([{
          account_id: recipientAccount.id,
          type: 'transfer_in',
          amount: transferAmount,
          status: 'completed',
          reference: `Internal transfer from ${selectedAccountData.account_number} - ${transferDetails.memo || 'Transfer'}`
        }]);
      }

      // Create sender transaction record
      const { error: transactionError } = await supabase
        .from('transactions')
        .insert([{
          account_id: fromAccount,
          type: 'transfer_out',
          amount: -transferAmount,
          status: transferType === 'internal' ? 'completed' : 'pending',
          reference: `${transferType.toUpperCase()} transfer to ${toAccountNumber} - ${transferDetails.recipient_name} - ${transferDetails.memo || 'Transfer'}`
        }]);

      if (transactionError) throw transactionError;

      // Create fee transaction if applicable
      if (fee > 0) {
        await supabase.from('transactions').insert([{
          account_id: fromAccount,
          type: 'fee',
          amount: -fee,
          status: 'completed',
          reference: `${transferType.toUpperCase()} transfer fee`
        }]);
      }

      // Update sender account balance
      const newBalance = parseFloat(selectedAccountData.balance) - totalDeduction;
      const { error: updateError } = await supabase
        .from('accounts')
        .update({ balance: newBalance, updated_at: new Date().toISOString() })
        .eq('id', fromAccount);

      if (updateError) throw updateError;

      // Create notification
      const { data: { user } } = await supabase.auth.getUser();
      await supabase.from('notifications').insert([{
        user_id: user.id,
        type: 'transfer',
        title: 'Transfer Processed',
        message: `$${transferAmount.toFixed(2)} transferred from account ${selectedAccountData.account_number} to ${toAccountNumber}${fee > 0 ? ` (Fee: $${fee.toFixed(2)})` : ''}`
      }]);

      setMessage(`✅ Transfer of $${transferAmount.toFixed(2)} has been processed successfully!${fee > 0 ? ` Fee: $${fee.toFixed(2)}` : ''}`);
      setAmount('');
      setToAccountNumber('');
      setTransferDetails({
        recipient_name: '', recipient_email: '', memo: '', routing_number: '',
        bank_name: '', swift_code: '', country: '', purpose: '', recipient_address: ''
      });
      
      // Refresh accounts to show updated balance
      fetchAccounts();

    } catch (error) {
      console.error('Transfer error:', error);
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
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: loading ? 'not-allowed' : 'pointer',
    opacity: loading ? 0.6 : 1
  };

  const renderTransferTypeFields = () => {
    switch (transferType) {
      case 'internal':
        return (
          <>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
              Recipient Name:
            </label>
            <input
              type="text"
              style={inputStyle}
              value={transferDetails.recipient_name}
              onChange={(e) => handleTransferDetailsChange('recipient_name', e.target.value)}
              placeholder="Name for reference"
              required
            />
            
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
              Memo (Optional):
            </label>
            <input
              type="text"
              style={inputStyle}
              value={transferDetails.memo}
              onChange={(e) => handleTransferDetailsChange('memo', e.target.value)}
              placeholder="What's this transfer for?"
            />
          </>
        );

      case 'domestic_external':
        return (
          <>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
              Recipient Name:
            </label>
            <input
              type="text"
              style={inputStyle}
              value={transferDetails.recipient_name}
              onChange={(e) => handleTransferDetailsChange('recipient_name', e.target.value)}
              placeholder="Full name on account"
              required
            />
            
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
              Bank Name:
            </label>
            <input
              type="text"
              style={inputStyle}
              value={transferDetails.bank_name}
              onChange={(e) => handleTransferDetailsChange('bank_name', e.target.value)}
              placeholder="Recipient's bank name"
              required
            />
            
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
              Routing Number:
            </label>
            <input
              type="text"
              style={inputStyle}
              value={transferDetails.routing_number}
              onChange={(e) => handleTransferDetailsChange('routing_number', e.target.value)}
              placeholder="123456789"
              maxLength="9"
              required
            />
            
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
              Memo (Optional):
            </label>
            <input
              type="text"
              style={inputStyle}
              value={transferDetails.memo}
              onChange={(e) => handleTransferDetailsChange('memo', e.target.value)}
              placeholder="Purpose of transfer"
            />
          </>
        );

      case 'international':
        return (
          <>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
              Recipient Name:
            </label>
            <input
              type="text"
              style={inputStyle}
              value={transferDetails.recipient_name}
              onChange={(e) => handleTransferDetailsChange('recipient_name', e.target.value)}
              placeholder="Full name on account"
              required
            />
            
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
              Country:
            </label>
            <input
              type="text"
              style={inputStyle}
              value={transferDetails.country}
              onChange={(e) => handleTransferDetailsChange('country', e.target.value)}
              placeholder="Destination country"
              required
            />
            
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
              SWIFT Code:
            </label>
            <input
              type="text"
              style={inputStyle}
              value={transferDetails.swift_code}
              onChange={(e) => handleTransferDetailsChange('swift_code', e.target.value)}
              placeholder="ABCDUS33XXX"
              required
            />
            
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
              Purpose of Transfer:
            </label>
            <select
              style={selectStyle}
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
            
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
              Recipient Address:
            </label>
            <textarea
              style={{...inputStyle, minHeight: '80px', resize: 'vertical'}}
              value={transferDetails.recipient_address}
              onChange={(e) => handleTransferDetailsChange('recipient_address', e.target.value)}
              placeholder="Complete address of recipient"
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
        <h1 style={{ color: '#007bff' }}>No Accounts Found</h1>
        <p>You need to have at least one account to make transfers. Please contact support or apply for an account first.</p>
      </div>
    );
  }

  const selectedAccountData = accounts.find(acc => acc.id === fromAccount);
  const fee = calculateFee();
  const totalAmount = (parseFloat(amount) || 0) + fee;

  return (
    <div style={{
      maxWidth: '600px',
      margin: '40px auto',
      padding: '40px',
      backgroundColor: '#f8f9fa',
      borderRadius: '12px',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h1 style={{ color: '#007bff', textAlign: 'center', marginBottom: '30px' }}>
        💸 Transfer Funds
      </h1>

      {message && (
        <div style={{
          padding: '15px',
          marginBottom: '20px',
          borderRadius: '8px',
          backgroundColor: message.includes('✅') ? '#e8f5e8' : '#ffebee',
          border: `1px solid ${message.includes('✅') ? '#4caf50' : '#f44336'}`,
          color: message.includes('✅') ? '#2e7d32' : '#c62828'
        }}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
          Transfer From Account:
        </label>
        <select
          style={selectStyle}
          value={fromAccount}
          onChange={(e) => setFromAccount(e.target.value)}
          required
        >
          {accounts.map(account => (
            <option key={account.id} value={account.id}>
              {account.account_number} ({account.account_type}) - ${parseFloat(account.balance).toFixed(2)}
            </option>
          ))}
        </select>

        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
          Transfer Type:
        </label>
        <select
          style={selectStyle}
          value={transferType}
          onChange={(e) => setTransferType(e.target.value)}
          required
        >
          <option value="internal">🏦 Internal Transfer (Free - Same Bank)</option>
          <option value="domestic_external">🇺🇸 Domestic External ($2-5 fee)</option>
          <option value="international">🌍 International Transfer ($30 fee)</option>
        </select>

        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
          To Account Number:
        </label>
        <input
          type="text"
          style={inputStyle}
          value={toAccountNumber}
          onChange={(e) => setToAccountNumber(e.target.value)}
          placeholder={transferType === 'internal' ? 'Oakline Bank account number' : 'Recipient account number'}
          required
        />

        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
          Transfer Amount ($):
        </label>
        <input
          type="number"
          style={inputStyle}
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Enter amount"
          step="0.01"
          min="0.01"
          max={selectedAccountData ? parseFloat(selectedAccountData.balance) - fee : 25000}
          required
        />

        <div style={{ 
          backgroundColor: 'white', 
          padding: '20px', 
          borderRadius: '8px', 
          marginBottom: '20px',
          border: '1px solid #e1e5e9' 
        }}>
          <h3 style={{ color: '#007bff', marginBottom: '15px' }}>
            Transfer Details
          </h3>
          {renderTransferTypeFields()}
        </div>

        {fee > 0 && (
          <div style={{
            backgroundColor: '#fff3cd',
            border: '1px solid #ffeaa7',
            borderRadius: '8px',
            padding: '15px',
            marginBottom: '20px'
          }}>
            <strong>Fee Notice:</strong> This transfer type incurs a ${fee.toFixed(2)} fee.<br/>
            <strong>Total Deduction:</strong> ${totalAmount.toFixed(2)}
          </div>
        )}

        <button type="submit" style={buttonStyle} disabled={loading}>
          {loading ? 'Processing Transfer...' : `Transfer $${(parseFloat(amount) || 0).toFixed(2)}${fee > 0 ? ` (+$${fee.toFixed(2)} fee)` : ''}`}
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
        <strong>Transfer Information:</strong>
        <ul style={{ margin: '10px 0', paddingLeft: '20px' }}>
          <li><strong>Internal:</strong> Instant transfers between Oakline Bank accounts</li>
          <li><strong>Domestic:</strong> 1-3 business days to other US banks</li>
          <li><strong>International:</strong> 3-5 business days worldwide</li>
          <li>All transfers are secured with bank-level encryption</li>
          <li>Daily transfer limit: $25,000 (contact support for higher limits)</li>
        </ul>
      </div>
    </div>
  );
}