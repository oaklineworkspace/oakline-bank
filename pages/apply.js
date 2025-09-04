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
    account_types: ['Checking']
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
      setFormData({
        ...formData,
        account_types: account_types.filter(type => type !== accountType)
      });
    } else {
      setFormData({
        ...formData,
        account_types: [...account_types, accountType]
      });
    }
  };

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  const generateAccountNumber = () => {
    return Math.floor(1000000000 + Math.random() * 9000000000).toString();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const { account_types, ...userDataForDB } = formData;

      if (userDataForDB.dob === '') {
        userDataForDB.dob = null;
      }

      if (userDataForDB.country === 'US') {
        userDataForDB.id_number = null;
        if (userDataForDB.ssn) {
          userDataForDB.ssn = userDataForDB.ssn.replace(/-/g, '');
        }
      } else {
        userDataForDB.ssn = null;
      }

      const { data: userData, error: userError } = await supabase
        .from('users')
        .insert([userDataForDB])
        .select()
        .single();

      if (userError) throw userError;

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

      await supabase
        .from('applications')
        .insert([{
          user_id: userData.id,
          status: 'received',
          account_number: accountsData.map(acc => acc.account_number).join(', ')
        }]);

      const emailResponse = await fetch('/api/send-welcome-email', {
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

      if (!emailResponse.ok) {
        console.warn('Application created but email failed to send.');
      }

      const firstAccountNumber = accountsData[0].account_number;
      const accountSummary = accountsData.length > 1 
        ? `${accountsData.length} accounts created: ${accountsData.map(acc => acc.account_number).join(', ')}`
        : `Account #${firstAccountNumber} created`;

      setMessage(`🎉 Application submitted successfully! ${accountSummary}. Check your email for enrollment instructions.`);
      setStep(4);

    } catch (error) {
      console.error('Application error:', error);
      let errorMsg = 'Something went wrong. Please try again.';
      if (error.message.includes('duplicate')) {
        errorMsg = 'This email already exists. Please log in instead.';
      } else if (error.message.includes('foreign key')) {
        errorMsg = 'Invalid account type selected. Please refresh and try again.';
      }
      setMessage(`Error: ${errorMsg}`);
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
              autoComplete="given-name"
              value={formData.first_name}
              onChange={handleChange}
              style={inputStyle}
            />
            <input
              type="text"
              name="middle_name"
              placeholder="Middle Name"
              autoComplete="additional-name"
              value={formData.middle_name}
              onChange={handleChange}
              style={inputStyle}
            />
            <input
              type="text"
              name="last_name"
              placeholder="Last Name *"
              required
              autoComplete="family-name"
              value={formData.last_name}
              onChange={handleChange}
              style={inputStyle}
            />
            <input
              type="text"
              name="mothers_maiden_name"
              placeholder="Mother's Maiden Name"
              autoComplete="off"
              value={formData.mothers_maiden_name}
              onChange={handleChange}
              style={inputStyle}
            />
            <input
              type="email"
              name="email"
              placeholder="Email Address *"
              required
              autoComplete="email"
              value={formData.email}
              onChange={handleChange}
              style={inputStyle}
            />
            <input
              type="tel"
              name="phone"
              placeholder="Phone Number *"
              required
              autoComplete="tel"
              value={formData.phone}
              onChange={handleChange}
              style={inputStyle}
            />
            <button type="button" onClick={nextStep} style={buttonStyle}>
              Next Step →
            </button>
          </div>
        )}

        {/* Keep step 2 and 3 exactly as in your code */}
        {/* ... Step 2 and Step 3 remain unchanged */}
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