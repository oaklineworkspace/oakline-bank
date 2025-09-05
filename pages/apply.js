// pages/apply.js
import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';

export default function ApplyPage() {
  const accountTypeList = [
    'Checking', 'Savings', 'Business Checking', 'Student', 'Joint', 'Premium', 'IRA',
    'Money Market', 'Certificate of Deposit', 'Foreign Currency', 'Trust', 'Healthcare Savings',
    'Youth Savings', 'Senior Savings', 'Payroll', 'Loan', 'Crypto', 'Retirement Savings',
    'Education Savings', 'Investment', 'Estate', 'Emergency Fund', 'Special Purpose'
  ];

  const [formData, setFormData] = useState({
    first_name: '', middle_name: '', last_name: '', mothers_maiden_name: '',
    email: '', phone: '', ssn: '', id_number: '', dob: '',
    address_line1: '', address_line2: '', city: '', state: 'CA', county: '', country: 'US',
    account_types: ['Checking']
  });

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleAccountTypeChange = (type) => {
    const { account_types } = formData;
    if (account_types.includes(type)) {
      setFormData({ ...formData, account_types: account_types.filter(t => t !== type) });
    } else {
      setFormData({ ...formData, account_types: [...account_types, type] });
    }
  };

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  const generateAccountNumber = () => Math.floor(1000000000 + Math.random() * 9000000000).toString();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    if (formData.account_types.length === 0) {
      setMessage('Error: Please select at least one account type.');
      setLoading(false);
      return;
    }

    try {
      const { account_types, ...userDataForDB } = formData;

      if (userDataForDB.dob === '') userDataForDB.dob = null;
      if (userDataForDB.country === 'US') {
        userDataForDB.id_number = null;
        if (userDataForDB.ssn) userDataForDB.ssn = userDataForDB.ssn.replace(/-/g, '');
      } else {
        userDataForDB.ssn = null;
      }

      const { data: userData, error: userError } = await supabase
        .from('users')
        .insert([userDataForDB])
        .select()
        .single();
      if (userError) throw userError;

      const accountsToCreate = account_types.map(type => ({
        user_id: userData.id,
        account_number: generateAccountNumber(),
        account_type: type,
        balance: 0.00,
        status: 'limited'
      }));

      const { data: accountsData, error: accountError } = await supabase
        .from('accounts')
        .insert(accountsToCreate)
        .select();
      if (accountError) throw accountError;

      await supabase.from('applications').insert([{
        user_id: userData.id,
        status: 'received',
        account_number: accountsData.map(acc => acc.account_number).join(', ')
      }]);

      // Send email
      const emailResponse = await fetch('/api/send-welcome-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          first_name: formData.first_name,
          last_name: formData.last_name,
          account_numbers: accountsData.map(acc => acc.account_number),
          account_types,
          temp_user_id: userData.id
        })
      });

      if (!emailResponse.ok) console.warn('Email failed to send');

      setMessage(`🎉 Application submitted! Accounts: ${accountsData.map(acc => acc.account_number).join(', ')}. Check your email for details.`);
      setStep(4);

    } catch (error) {
      console.error(error);
      setMessage('Error: Something went wrong. Please refresh and try again.');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: '100%', padding: '12px', border: '2px solid #e1e5e9', borderRadius: '8px',
    fontSize: '14px', marginBottom: '15px', boxSizing: 'border-box'
  };
  const buttonStyle = {
    padding: '12px 24px', backgroundColor: '#0070f3', color: 'white',
    border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '16px', margin: '5px'
  };

  if (step === 4) {
    return (
      <div style={{ maxWidth: '600px', margin: '2rem auto', padding: '2rem', fontFamily: 'Arial, sans-serif', backgroundColor: '#f8f9fa', borderRadius: '12px', textAlign: 'center' }}>
        <h1 style={{ color: '#0070f3' }}>Application Successful! 🎉</h1>
        <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '8px', marginTop: '1rem' }}>
          <p style={{ fontSize: '18px', color: '#28a745' }}>{message}</p>
          <p style={{ marginTop: '2rem' }}>
            <strong>Next Steps:</strong><br/>
            1. Check your email for account details<br/>
            2. Click enrollment link to set up online banking<br/>
            3. Your account starts in limited mode until verification
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '600px', margin: '2rem auto', padding: '2rem', fontFamily: 'Arial, sans-serif', backgroundColor: '#f8f9fa', borderRadius: '12px' }}>
      <h1 style={{ textAlign: 'center', color: '#0070f3', marginBottom: '2rem' }}>Apply for Banking Account</h1>

      <div style={{ backgroundColor: '#e3f2fd', padding: '1rem', borderRadius: '8px', marginBottom: '2rem', textAlign: 'center' }}>
        <strong>Step {step} of 3</strong>
        <div style={{ width: '100%', backgroundColor: '#ddd', borderRadius: '10px', marginTop: '10px' }}>
          <div style={{ width: `${(step/3)*100}%`, backgroundColor: '#0070f3', height: '8px', borderRadius: '10px', transition: 'width 0.3s' }}></div>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        {step === 1 && (
          <div>
            <h3>Personal Info</h3>
            <input type="text" name="first_name" placeholder="First Name *" required value={formData.first_name} onChange={handleChange} style={inputStyle}/>
            <input type="text" name="middle_name" placeholder="Middle Name" value={formData.middle_name} onChange={handleChange} style={inputStyle}/>
            <input type="text" name="last_name" placeholder="Last Name *" required value={formData.last_name} onChange={handleChange} style={inputStyle}/>
            <input type="text" name="mothers_maiden_name" placeholder="Mother's Maiden Name" value={formData.mothers_maiden_name} onChange={handleChange} style={inputStyle}/>
            <input type="email" name="email" placeholder="Email *" required value={formData.email} onChange={handleChange} style={inputStyle}/>
            <input type="tel" name="phone" placeholder="Phone *" required value={formData.phone} onChange={handleChange} style={inputStyle}/>
            <button type="button" onClick={nextStep} style={buttonStyle}>Next Step →</button>
          </div>
        )}

        {step === 2 && (
          <div>
            <h3>Address Info</h3>
            <input type="text" name="address_line1" placeholder="Address Line 1 *" required value={formData.address_line1} onChange={handleChange} style={inputStyle}/>
            <input type="text" name="address_line2" placeholder="Address Line 2" value={formData.address_line2} onChange={handleChange} style={inputStyle}/>
            <input type="text" name="city" placeholder="City *" required value={formData.city} onChange={handleChange} style={inputStyle}/>
            <input type="text" name="state" placeholder="State *" required value={formData.state} onChange={handleChange} style={inputStyle}/>
            <input type="text" name="county" placeholder="County" value={formData.county} onChange={handleChange} style={inputStyle}/>
            <input type="text" name="country" placeholder="Country *" required value={formData.country} onChange={handleChange} style={inputStyle}/>
            <div style={{ marginBottom: '15px' }}>
              <button type="button" onClick={prevStep} style={buttonStyle}>← Back</button>
              <button type="button" onClick={nextStep} style={buttonStyle}>Next Step →</button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <h3>Select Account Types</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
              {accountTypeList.map((type) => (
                <label key={type} style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#fff', padding: '8px', borderRadius: '6px', border: '1px solid #ccc', cursor: 'pointer' }}>
                  <input type="checkbox" checked={formData.account_types.includes(type)} onChange={() => handleAccountTypeChange(type)} />
                  {type}
                </label>
              ))}
            </div>
            <div style={{ marginTop: '15px' }}>
              <button type="button" onClick={prevStep} style={buttonStyle}>← Back</button>
              <button type="submit" style={buttonStyle} disabled={loading}>{loading ? 'Submitting...' : 'Submit Application'}</button>
            </div>
          </div>
        )}
      </form>

      {message && step !== 4 && (
        <div style={{ marginTop: '20px', padding: '1rem', backgroundColor: message.startsWith('Error') ? '#f8d7da' : '#d4edda', borderRadius: '8px', color: message.startsWith('Error') ? '#721c24' : '#155724' }}>
          {message}
        </div>
      )}
    </div>
  );
}