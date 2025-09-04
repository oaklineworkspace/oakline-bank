// pages/apply.js
import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';

export default function ApplyPage() {
  const [formData, setFormData] = useState({
    first_name: '',
    middle_name: '',
    last_name: '',
    mothers_maiden_name: '',
    email: '',
    phone: '',
    ssn: '',
    id_number: '',
    dob: '',
    address_line1: '',
    address_line2: '',
    city: '',
    state: 'CA',
    county: '',
    country: 'US',
    account_types: ['Checking'] // Changed to array for multiple selections
  });
  
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [step, setStep] = useState(1);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAccountTypeChange = (accountType) => {
    const { account_types } = formData;
    if (account_types.includes(accountType)) {
      // Remove if already selected
      setFormData({
        ...formData,
        account_types: account_types.filter(type => type !== accountType)
      });
    } else {
      // Add if not selected
      setFormData({
        ...formData,
        account_types: [...account_types, accountType]
      });
    }
  };

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  const generateAccountNumber = () => {
    // Generate 10-digit account number
    return Math.floor(1000000000 + Math.random() * 9000000000).toString();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      // 1. Create user record (excluding account_types which belongs in accounts table)
      const { account_types, ...userDataForDB } = formData;
      
      // Handle empty date - convert empty string to null
      if (userDataForDB.dob === '') {
        userDataForDB.dob = null;
      }
      
      const { data: userData, error: userError } = await supabase
        .from('users')
        .insert([userDataForDB])
        .select()
        .single();

      if (userError) throw userError;

      // 2. Create multiple accounts based on selected account types
      const accountsToCreate = account_types.map(accountType => ({
        user_id: userData.id,
        account_number: generateAccountNumber(),
        account_type: accountType,
        balance: 0.00,
        status: 'limited'
      }));

      const { data: accountsData, error: accountError } = await supabase
        .from('accounts')
        .insert(accountsToCreate)
        .select();

      if (accountError) throw accountError;

      // Get the first account number for display
      const firstAccountNumber = accountsData[0].account_number;

      // 3. Create application record
      await supabase
        .from('applications')
        .insert([{
          user_id: userData.id,
          status: 'received',
          account_number: accountsData.map(acc => acc.account_number).join(', ')
        }]);

      // 4. Send welcome email with enrollment link
      await fetch('/api/send-welcome-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          first_name: formData.first_name,
          last_name: formData.last_name,
          account_numbers: accountsData.map(acc => acc.account_number),
          account_types: account_types,
          temp_user_id: userData.id
        })
      });

      const accountSummary = accountsData.length > 1 
        ? `${accountsData.length} accounts created: ${accountsData.map(acc => acc.account_number).join(', ')}`
        : `Account #${firstAccountNumber} created`;
      
      setMessage(`🎉 Application submitted successfully! ${accountSummary}. Check your email for enrollment instructions.`);
      setStep(4); // Success step

    } catch (error) {
      console.error('Application error:', error);
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

  const buttonStyle = {
    padding: '12px 24px',
    backgroundColor: '#0070f3',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '16px',
    margin: '5px'
  };

  if (step === 4) {
    return (
      <div style={{ 
        maxWidth: '600px', 
        margin: '2rem auto', 
        padding: '2rem',
        fontFamily: 'Arial, sans-serif',
        backgroundColor: '#f8f9fa',
        borderRadius: '12px',
        textAlign: 'center'
      }}>
        <h1 style={{ color: '#0070f3' }}>Application Successful! 🎉</h1>
        <div style={{ 
          backgroundColor: 'white', 
          padding: '2rem', 
          borderRadius: '8px',
          marginTop: '1rem'
        }}>
          <p style={{ fontSize: '18px', color: '#28a745' }}>{message}</p>
          <p style={{ marginTop: '2rem' }}>
            <strong>What's Next?</strong><br/>
            1. Check your email for account details<br/>
            2. Click the enrollment link to set up online banking<br/>
            3. Your account starts in limited mode until verification is complete
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ 
      maxWidth: '600px', 
      margin: '2rem auto', 
      padding: '2rem',
      fontFamily: 'Arial, sans-serif',
      backgroundColor: '#f8f9fa',
      borderRadius: '12px'
    }}>
      <h1 style={{ textAlign: 'center', color: '#0070f3', marginBottom: '2rem' }}>
        Apply for Banking Account
      </h1>

      <div style={{ 
        backgroundColor: '#e3f2fd', 
        padding: '1rem', 
        borderRadius: '8px', 
        marginBottom: '2rem',
        textAlign: 'center'
      }}>
        <strong>Step {step} of 3</strong>
        <div style={{ 
          width: '100%', 
          backgroundColor: '#ddd', 
          borderRadius: '10px', 
          marginTop: '10px'
        }}>
          <div style={{ 
            width: `${(step/3)*100}%`, 
            backgroundColor: '#0070f3', 
            height: '8px', 
            borderRadius: '10px',
            transition: 'width 0.3s'
          }}></div>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        {step === 1 && (
          <div>
            <h3>Personal Information</h3>
            <input
              type="text"
              name="first_name"
              placeholder="First Name *"
              required
              value={formData.first_name}
              onChange={handleChange}
              style={inputStyle}
            />
            <input
              type="text"
              name="middle_name"
              placeholder="Middle Name"
              value={formData.middle_name}
              onChange={handleChange}
              style={inputStyle}
            />
            <input
              type="text"
              name="last_name"
              placeholder="Last Name *"
              required
              value={formData.last_name}
              onChange={handleChange}
              style={inputStyle}
            />
            <input
              type="text"
              name="mothers_maiden_name"
              placeholder="Mother's Maiden Name"
              value={formData.mothers_maiden_name}
              onChange={handleChange}
              style={inputStyle}
            />
            <input
              type="email"
              name="email"
              placeholder="Email Address *"
              required
              value={formData.email}
              onChange={handleChange}
              style={inputStyle}
            />
            <input
              type="tel"
              name="phone"
              placeholder="Phone Number *"
              required
              value={formData.phone}
              onChange={handleChange}
              style={inputStyle}
            />
            <button type="button" onClick={nextStep} style={buttonStyle}>
              Next Step →
            </button>
          </div>
        )}

        {step === 2 && (
          <div>
            <h3>Identity & Address</h3>
            <input
              type="text"
              name="ssn"
              placeholder="Social Security Number (XXX-XX-XXXX) *"
              required
              pattern="[0-9]{3}-[0-9]{2}-[0-9]{4}"
              value={formData.ssn}
              onChange={handleChange}
              style={inputStyle}
            />
            <input
              type="text"
              name="id_number"
              placeholder="Driver's License or ID Number"
              value={formData.id_number}
              onChange={handleChange}
              style={inputStyle}
            />
            <input
              type="date"
              name="dob"
              placeholder="Date of Birth *"
              required
              value={formData.dob}
              onChange={handleChange}
              style={inputStyle}
            />
            <input
              type="text"
              name="address_line1"
              placeholder="Street Address *"
              required
              value={formData.address_line1}
              onChange={handleChange}
              style={inputStyle}
            />
            <input
              type="text"
              name="address_line2"
              placeholder="Apt, Suite, etc."
              value={formData.address_line2}
              onChange={handleChange}
              style={inputStyle}
            />
            <input
              type="text"
              name="city"
              placeholder="City *"
              required
              value={formData.city}
              onChange={handleChange}
              style={inputStyle}
            />
            <select
              name="state"
              value={formData.state}
              onChange={handleChange}
              style={inputStyle}
            >
              <option value="AL">Alabama</option>
              <option value="CA">California</option>
              <option value="NY">New York</option>
              <option value="TX">Texas</option>
            </select>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button type="button" onClick={prevStep} style={{...buttonStyle, backgroundColor: '#6c757d'}}>
                ← Previous
              </button>
              <button type="button" onClick={nextStep} style={buttonStyle}>
                Next Step →
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <h3>Account Selection</h3>
            <label style={{ display: 'block', marginBottom: '15px', fontSize: '16px', fontWeight: 'bold' }}>
              Choose your account types (you can select multiple):
            </label>
            
            <div style={{ marginBottom: '20px' }}>
              {[
                { value: 'Checking', label: 'Checking Account', description: 'Standard checking with debit card and unlimited transactions' },
                { value: 'Savings', label: 'Savings Account', description: 'High-yield savings with competitive interest rates' },
                { value: 'Business', label: 'Business Account', description: 'For business banking and commercial transactions' },
                { value: 'Student', label: 'Student Account', description: 'No fees for students with valid student ID' },
                { value: 'Joint', label: 'Joint Account', description: 'Shared account for couples or family members' }
              ].map((accountType) => (
                <div 
                  key={accountType.value}
                  style={{
                    border: '2px solid #e1e5e9',
                    borderRadius: '8px',
                    padding: '15px',
                    marginBottom: '10px',
                    backgroundColor: formData.account_types.includes(accountType.value) ? '#e3f2fd' : 'white',
                    borderColor: formData.account_types.includes(accountType.value) ? '#0070f3' : '#e1e5e9',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                  onClick={() => handleAccountTypeChange(accountType.value)}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <input
                      type="checkbox"
                      checked={formData.account_types.includes(accountType.value)}
                      onChange={() => handleAccountTypeChange(accountType.value)}
                      style={{ cursor: 'pointer', transform: 'scale(1.2)' }}
                    />
                    <div>
                      <strong style={{ fontSize: '16px', color: '#0070f3' }}>
                        {accountType.label}
                      </strong>
                      <p style={{ margin: '5px 0 0 0', fontSize: '14px', color: '#666' }}>
                        {accountType.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {formData.account_types.length === 0 && (
              <div style={{
                color: '#dc3545',
                fontSize: '14px',
                marginBottom: '15px',
                padding: '10px',
                backgroundColor: '#f8d7da',
                borderRadius: '4px'
              }}>
                Please select at least one account type to continue.
              </div>
            )}
            
            <div style={{ 
              backgroundColor: 'white', 
              padding: '1rem', 
              borderRadius: '8px', 
              marginBottom: '1rem',
              border: '1px solid #e1e5e9'
            }}>
              <h4>Selected Account Types ({formData.account_types.length}):</h4>
              <div style={{ marginBottom: '10px' }}>
                {formData.account_types.map((type, index) => (
                  <span key={type} style={{
                    display: 'inline-block',
                    backgroundColor: '#0070f3',
                    color: 'white',
                    padding: '4px 12px',
                    borderRadius: '20px',
                    fontSize: '12px',
                    marginRight: '8px',
                    marginBottom: '5px'
                  }}>
                    {type}
                  </span>
                ))}
              </div>
              <h4>What happens next:</h4>
              <p>✅ Instant account numbers for each selected type<br/>
              ✅ Welcome email with all account details<br/>
              ✅ Set up online banking immediately<br/>
              ✅ Limited access until verification complete</p>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button type="button" onClick={prevStep} style={{...buttonStyle, backgroundColor: '#6c757d'}}>
                ← Previous
              </button>
              <button 
                type="submit" 
                disabled={loading || formData.account_types.length === 0} 
                style={{
                  ...buttonStyle, 
                  backgroundColor: (loading || formData.account_types.length === 0) ? '#6c757d' : '#28a745',
                  cursor: (loading || formData.account_types.length === 0) ? 'not-allowed' : 'pointer'
                }}
              >
                {loading ? 'Processing...' : `Submit Application (${formData.account_types.length} account${formData.account_types.length !== 1 ? 's' : ''})`}
              </button>
            </div>
          </div>
        )}
      </form>

      {message && step !== 4 && (
        <div style={{ 
          marginTop: '20px', 
          padding: '1rem',
          backgroundColor: message.startsWith('Error') ? '#f8d7da' : '#d4edda',
          borderRadius: '8px',
          color: message.startsWith('Error') ? '#721c24' : '#155724'
        }}>
          {message}
        </div>
      )}
    </div>
  );
}