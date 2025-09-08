import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useRouter } from 'next/router';

export default function EnrollPage() {
  const router = useRouter();
  const { token, application_id } = router.query;
  const [formData, setFormData] = useState({ email: '', password: '', confirmPassword: '', ssn: '', id_number: '', accountNumber: '', agreeToTerms: false });
  const [applicationInfo, setApplicationInfo] = useState(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [authUserCreated, setAuthUserCreated] = useState(false);
  const [authCreationLoading, setAuthCreationLoading] = useState(true);
  const [accounts, setAccounts] = useState([]);

  // Create auth user immediately when enrollment link is clicked
  useEffect(() => {
    if (!token || !application_id) return;

    const createAuthUserAndLoadInfo = async () => {
      try {
        setAuthCreationLoading(true);

        // 1. Create auth user immediately
        const authResponse = await fetch('/api/create-auth-user', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token, application_id })
        });

        const authResult = await authResponse.json();

        if (!authResponse.ok) {
          setMessage(`Error: ${authResult.error}`);
          return;
        }

        setAuthUserCreated(true);
        setApplicationInfo(authResult.user);

        // 2. Load application data and accounts
        const { data: appData, error: appError } = await supabase
          .from('applications')
          .select('*')
          .eq('id', application_id)
          .single();

        if (appError) {
          setMessage('Error loading application data');
          return;
        }

        // 3. Load associated accounts
        const { data: accountsData, error: accountsError } = await supabase
          .from('accounts')
          .select('account_number, account_type')
          .eq('application_id', application_id);

        if (!accountsError && accountsData) {
          setAccounts(accountsData);
        }

        // Pre-fill email
        setFormData(prev => ({ ...prev, email: appData.email }));

      } catch (error) {
        console.error('Error creating auth user:', error);
        setMessage('Error setting up enrollment. Please try again.');
      } finally {
        setAuthCreationLoading(false);
      }
    };

    createAuthUserAndLoadInfo();
  }, [token, application_id]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    // Validation
    if (!formData.password || formData.password.length < 8) {
      setMessage('Password must be at least 8 characters long');
      setLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setMessage('Passwords do not match');
      setLoading(false);
      return;
    }

    if (!formData.accountNumber) {
      setMessage('Please select one of your account numbers');
      setLoading(false);
      return;
    }

    // Validate ID field based on country
    if (applicationInfo?.country === 'US') {
      if (!formData.ssn || formData.ssn.trim() === '') {
        setMessage('Social Security Number is required');
        setLoading(false);
        return;
      }
    } else {
      if (!formData.id_number || formData.id_number.trim() === '') {
        setMessage('Government ID Number is required');
        setLoading(false);
        return;
      }
    }

    if (!formData.agreeToTerms) {
      setMessage('You must agree to the Terms of Service and Privacy Policy');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/complete-enrollment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token,
          application_id,
          email: formData.email,
          password: formData.password,
          ssn: formData.ssn,
          id_number: formData.id_number,
          accountNumber: formData.accountNumber
        })
      });

      const result = await response.json();

      if (response.ok) {
        setMessage('Enrollment completed successfully! Redirecting to login...');
        setTimeout(() => {
          router.push('/login');
        }, 2000);
      } else {
        setMessage(`Error: ${result.error}`);
      }
    } catch (error) {
      console.error('Enrollment error:', error);
      setMessage('An error occurred during enrollment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (authCreationLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <div>Setting up your enrollment...</div>
      </div>
    );
  }

  if (!token || !application_id) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <div>Invalid enrollment link. Please check the link from your email.</div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '500px', margin: '2rem auto', padding: '2rem', backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '2rem', color: '#1e40af' }}>Complete Your Enrollment</h1>

      {applicationInfo && (
        <div style={{ backgroundColor: '#f0f9ff', padding: '1rem', borderRadius: '6px', marginBottom: '2rem' }}>
          <h3>Welcome, {applicationInfo.name}!</h3>
          <p>Email: {applicationInfo.email}</p>
          {accounts.length > 0 && (
            <div>
              <p><strong>Your Accounts:</strong></p>
              {accounts.map((account, index) => (
                <p key={index}>{account.account_type}: {account.account_number}</p>
              ))}
            </div>
          )}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '1rem' }}>
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            required
            disabled
            style={{ width: '100%', padding: '8px', marginTop: '4px', backgroundColor: '#f3f4f6' }}
          />
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label>Password:</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            required
            minLength="8"
            style={{ width: '100%', padding: '8px', marginTop: '4px' }}
            placeholder="Enter your password (min 8 characters)"
          />
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label>Confirm Password:</label>
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleInputChange}
            required
            style={{ width: '100%', padding: '8px', marginTop: '4px' }}
            placeholder="Confirm your password"
          />
        </div>

        {applicationInfo?.country === 'US' ? (
          <div style={{ marginBottom: '1rem' }}>
            <label>Social Security Number (SSN) <span style={{color: '#ef4444'}}>*</span>:</label>
            <input
              type="text"
              name="ssn"
              value={formData.ssn}
              onChange={handleInputChange}
              required
              style={{ width: '100%', padding: '8px', marginTop: '4px', border: '1px solid #d1d5db', borderRadius: '4px' }}
              placeholder="XXX-XX-XXXX"
              maxLength="11"
            />
          </div>
        ) : (
          <div style={{ marginBottom: '1rem' }}>
            <label>Government ID Number <span style={{color: '#ef4444'}}>*</span>:</label>
            <input
              type="text"
              name="id_number"
              value={formData.id_number}
              onChange={handleInputChange}
              required
              style={{ width: '100%', padding: '8px', marginTop: '4px', border: '1px solid #d1d5db', borderRadius: '4px' }}
              placeholder="Enter your government ID number"
            />
          </div>
        )}

        <div style={{ marginBottom: '1rem' }}>
          <label>Select One of Your Account Numbers:</label>
          <select
            name="accountNumber"
            value={formData.accountNumber}
            onChange={handleInputChange}
            required
            style={{ width: '100%', padding: '8px', marginTop: '4px', border: '1px solid #d1d5db', borderRadius: '4px' }}
          >
            <option value="">Select an account number</option>
            {accounts.map((account, index) => (
              <option key={index} value={account.account_number}>
                {account.account_type}: {account.account_number}
              </option>
            ))}
          </select>
        </div>

        <div style={{ 
          marginBottom: '1rem', 
          display: 'flex', 
          alignItems: 'flex-start', 
          gap: '12px',
          padding: '16px',
          backgroundColor: '#f8fafc',
          borderRadius: '8px',
          border: '2px solid #e2e8f0',
          position: 'relative',
          zIndex: 10
        }}>
          <input
            type="checkbox"
            name="agreeToTerms"
            checked={formData.agreeToTerms}
            onChange={handleInputChange}
            required
            style={{
              width: '20px',
              height: '20px',
              accentColor: '#22c55e',
              cursor: 'pointer',
              marginTop: '2px',
              flexShrink: 0
            }}
          />
          <label 
            style={{ 
              fontSize: '14px', 
              color: '#374151', 
              cursor: 'pointer',
              lineHeight: '1.5',
              userSelect: 'none'
            }}
            onClick={() => handleInputChange({target: {name: 'agreeToTerms', type: 'checkbox', checked: !formData.agreeToTerms}})}
          >
            I agree to the Terms of Service and Privacy Policy <span style={{color: '#ef4444'}}>*</span>
            {formData.agreeToTerms && <span style={{ color: '#22c55e', marginLeft: '8px', fontSize: '16px', fontWeight: 'bold' }}>✓ Agreed</span>}
          </label>
        </div>

        <button
          type="submit"
          disabled={loading || !authUserCreated}
          style={{
            width: '100%',
            padding: '12px',
            backgroundColor: loading ? '#9ca3af' : '#1e40af',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            fontSize: '16px',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? 'Completing Enrollment...' : 'Complete Enrollment'}
        </button>
      </form>

      {message && (
        <div style={{
          marginTop: '1rem',
          padding: '12px',
          borderRadius: '6px',
          backgroundColor: message.includes('Error') ? '#fee2e2' : '#d1fae5',
          color: message.includes('Error') ? '#dc2626' : '#059669',
          textAlign: 'center'
        }}>
          {message}
        </div>
      )}
    </div>
  );
}