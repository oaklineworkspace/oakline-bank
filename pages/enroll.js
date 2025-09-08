import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useRouter } from 'next/router';

export default function EnrollPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    ssn: '',
    id_number: '',
    accountNumber: '',
    agreeToTerms: false
  });
  const [applicationInfo, setApplicationInfo] = useState(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [authCreationLoading, setAuthCreationLoading] = useState(false); // Start as false
  const [accounts, setAccounts] = useState([]);
  const [enrollmentToken, setEnrollmentToken] = useState(''); // For traditional token flow
  const [applicationId, setApplicationId] = useState(''); // For both flows
  const [step, setStep] = useState('loading'); // 'loading', 'token_verification', 'password', 'success'

  // Function to handle magic link authentication and user verification
  const verifyMagicLinkUser = async (user, applicationId) => {
    // Clear any existing timeout
    if (window.enrollmentTimeout) {
      clearTimeout(window.enrollmentTimeout);
      window.enrollmentTimeout = null;
    }
    
    setLoading(true);
    setError('');
    console.log('Verifying magic link user:', user.email, 'for application:', applicationId);

    try {
      // Verify the user and get application data
      const response = await fetch('/api/verify-magic-link-enrollment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          email: user.email,
          applicationId: applicationId
        })
      });

      const result = await response.json();
      console.log('Magic link verification result:', result);

      if (response.ok) {
        console.log('Magic link verification successful');
        setApplicationInfo(result.application); // Use applicationInfo for display
        setAccounts(result.accounts || result.account_numbers || []);
        setFormData(prev => ({ ...prev, email: user.email })); // Pre-fill email
        setStep('password'); // Skip token verification, go straight to password setup
      } else {
        console.error('Magic link verification failed:', result.error);
        setError(result.error || 'Invalid enrollment link');
        setStep('error');
      }
    } catch (error) {
      console.error('Magic link verification error:', error);
      setError('Error verifying enrollment link. Please try again.');
      setStep('error');
    } finally {
      setLoading(false);
    }
  };

  // Function to handle traditional token-based enrollment verification
  const verifyToken = async (token, applicationId) => {
    setAuthCreationLoading(true); // Use authCreationLoading for initial setup phase
    setMessage('');
    setError('');

    try {
      // 1. Verify enrollment token
      const { data: enrollmentData, error: enrollmentError } = await supabase
        .from('enrollments')
        .select('*')
        .eq('token', token)
        .eq('is_used', false)
        .single();

      if (enrollmentError || !enrollmentData) {
        setMessage('Invalid or expired enrollment link. Please request a new enrollment email.');
        setStep('error');
        setAuthCreationLoading(false);
        return;
      }

      // 2. Load application data
      const { data: appData, error: appError } = await supabase
        .from('applications')
        .select('*')
        .eq('id', applicationId)
        .single();

      if (appError || !appData) {
        setMessage('Application not found. Please contact support.');
        setStep('error');
        setAuthCreationLoading(false);
        return;
      }

      // 3. Verify email matches
      if (enrollmentData.email !== appData.email) {
        setMessage('Email verification failed. Invalid enrollment link.');
        setStep('error');
        setAuthCreationLoading(false);
        return;
      }

      setApplicationInfo(appData); // Set application data for display

      // 4. Load associated accounts for this application only
      const { data: accountsData, error: accountsError } = await supabase
        .from('accounts')
        .select('account_number, account_type')
        .eq('application_id', applicationId);

      if (!accountsError && accountsData && accountsData.length > 0) {
        setAccounts(accountsData);
      } else {
        setMessage('No accounts found for this application. Please contact support.');
        setStep('error');
        setAuthCreationLoading(false);
        return;
      }

      // 5. Create auth user immediately (this part might be replaced by magic link flow)
      const authResponse = await fetch('/api/create-auth-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, application_id: applicationId })
      });

      const authResult = await authResponse.json();

      if (!authResponse.ok) {
        setMessage(`Error: ${authResult.error}`);
        setStep('error');
        setAuthCreationLoading(false);
        return;
      }

      setFormData(prev => ({ ...prev, email: appData.email })); // Pre-fill email
      setStep('password'); // Proceed to password setup

    } catch (error) {
      console.error('Error validating enrollment:', error);
      setMessage('Error loading enrollment data. Please try again.');
      setStep('error');
    } finally {
      setAuthCreationLoading(false);
    }
  };

  // Effect to handle authentication state changes and initial setup
  useEffect(() => {
    // Handle magic link authentication
    const handleAuthStateChange = async (event, session) => {
      console.log('Auth state change:', event, session?.user?.email || 'No user');
      
      if (event === 'SIGNED_IN' && session?.user) {
        console.log('User signed in via magic link:', session.user.email);

        // Get application_id from URL or user metadata
        const { application_id } = router.query;
        const userAppId = session.user.user_metadata?.application_id || application_id;

        console.log('Application ID from query:', application_id);
        console.log('Application ID from user metadata:', session.user.user_metadata?.application_id);
        console.log('Using application ID:', userAppId);

        if (userAppId) {
          setApplicationId(userAppId);
          await verifyMagicLinkUser(session.user, userAppId);
        } else {
          console.error('No application ID found');
          setError('Application ID not found. Please use the link from your email.');
          setStep('error');
        }
      }
    };

    // Subscribe to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(handleAuthStateChange);

    // Check for existing session
    const checkSession = async () => {
      setAuthCreationLoading(true);
      
      try {
        const { data: { session } } = await supabase.auth.getSession();
        console.log('Current session:', session?.user?.email || 'No session');
        console.log('Router query:', router.query);
        
        if (session?.user) {
          console.log('Found existing session for user:', session.user.email);
          const { application_id } = router.query;
          const userAppId = session.user.user_metadata?.application_id || application_id;

          if (userAppId) {
            console.log('Using application ID:', userAppId);
            setApplicationId(userAppId);
            await verifyMagicLinkUser(session.user, userAppId);
          } else {
            console.log('No application ID found in session or query');
            setError('Application ID not found. Please use the link from your email.');
            setStep('error');
          }
        } else {
          // If no active session, check for traditional token-based enrollment
          const { token, application_id } = router.query;
          console.log('No session - checking for token:', !!token, 'app_id:', !!application_id);
          
          if (token && application_id && !router.query.type) {
            console.log('No session found, trying token-based enrollment');
            setEnrollmentToken(token);
            setApplicationId(application_id);
            await verifyToken(token, application_id);
          } else if (!token && !application_id) {
            // If no token and no session, it's likely an invalid entry point
            console.log('No token or application_id - invalid link');
            setMessage('Invalid enrollment link or session expired. Please request a new enrollment email.');
            setStep('error');
          } else {
            // Wait for magic link authentication with shorter timeout
            console.log('Waiting for magic link authentication...');
            setMessage('Please wait while we process your enrollment link...');
            setStep('loading');
            
            // Add timeout to prevent infinite loading - use a ref to track current step
            const timeoutId = setTimeout(() => {
              console.log('Timeout waiting for authentication, current step:', step);
              setError('Authentication timeout. Please try clicking the enrollment link again.');
              setStep('error');
            }, 10000); // 10 second timeout
            
            // Store timeout ID to clear it if authentication succeeds
            window.enrollmentTimeout = timeoutId;
          }
        }
      } catch (error) {
        console.error('Error checking session:', error);
        setError('Error loading enrollment. Please try again.');
        setStep('error');
      } finally {
        setAuthCreationLoading(false);
      }
    };

    if (router.isReady) {
      checkSession();
    }

    return () => {
      subscription?.unsubscribe();
      // Clear timeout on cleanup
      if (window.enrollmentTimeout) {
        clearTimeout(window.enrollmentTimeout);
        window.enrollmentTimeout = null;
      }
    };
  }, [router.query, router.isReady]);

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
    setError('');

    // Validation
    if (!formData.password || formData.password.length < 8) {
      setError('Password must be at least 8 characters long');
      setLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (!formData.accountNumber) {
      setError('Please select one of your account numbers');
      setLoading(false);
      return;
    }

    // Validate ID field based on country
    if (applicationInfo?.country === 'US') {
      if (!formData.ssn || formData.ssn.trim() === '') {
        setError('Social Security Number is required');
        setLoading(false);
        return;
      }
    } else {
      if (!formData.id_number || formData.id_number.trim() === '') {
        setError('Government ID Number is required');
        setLoading(false);
        return;
      }
    }

    if (!formData.agreeToTerms) {
      setError('You must agree to the Terms of Service and Privacy Policy');
      setLoading(false);
      return;
    }

    try {
      // Get current session to determine flow
      const { data: { session } } = await supabase.auth.getSession();
      
      // Decide which API endpoint to call and prepare data
      let endpoint, bodyData;
      
      if (session?.user && step === 'password') {
        // Magic link flow - user is authenticated
        endpoint = '/api/complete-enrollment-magic-link';
        bodyData = {
          userId: session.user.id,
          application_id: applicationId,
          email: formData.email,
          password: formData.password,
          ssn: formData.ssn,
          id_number: formData.id_number,
          accountNumber: formData.accountNumber
        };
      } else {
        // Traditional token flow
        endpoint = '/api/complete-enrollment';
        bodyData = {
          token: enrollmentToken,
          application_id: applicationId,
          email: formData.email,
          password: formData.password,
          ssn: formData.ssn,
          id_number: formData.id_number,
          accountNumber: formData.accountNumber
        };
      }

      console.log('Submitting enrollment with:', { endpoint, hasUserId: !!bodyData.userId, hasToken: !!bodyData.token });

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bodyData)
      });

      const result = await response.json();

      if (response.ok) {
        setMessage('Enrollment completed successfully! Redirecting to login...');
        setStep('success');
        setTimeout(() => {
          router.push('/login');
        }, 2000);
      } else {
        setError(`Error: ${result.error}`);
      }
    } catch (error) {
      console.error('Enrollment error:', error);
      setError('An error occurred during enrollment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (authCreationLoading || step === 'loading') {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '18px', marginBottom: '10px' }}>Setting up your enrollment...</div>
          <div style={{ fontSize: '14px', color: '#666' }}>Please wait while we process your enrollment link.</div>
        </div>
      </div>
    );
  }

  // Handle error states
  if (step === 'error') {
     return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <div style={{ textAlign: 'center', maxWidth: '500px', padding: '2rem' }}>
          <h2 style={{ color: '#dc2626', marginBottom: '1rem' }}>Enrollment Error</h2>
          {error && (
            <p style={{ marginBottom: '1.5rem', color: '#374151' }}>{error}</p>
          )}
          {message && (
            <p style={{ marginBottom: '1.5rem', color: '#374151' }}>{message}</p>
          )}
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              onClick={() => window.location.reload()}
              style={{ 
                padding: '12px 24px', 
                backgroundColor: '#059669', 
                color: 'white', 
                border: 'none', 
                borderRadius: '6px',
                cursor: 'pointer'
              }}
            >
              Try Again
            </button>
            <button
              onClick={() => router.push('/')}
              style={{ 
                padding: '12px 24px', 
                backgroundColor: '#1e40af', 
                color: 'white', 
                border: 'none', 
                borderRadius: '6px',
                cursor: 'pointer'
              }}
            >
              Go to Homepage
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Render based on the current step
  return (
    <div style={{ maxWidth: '500px', margin: '2rem auto', padding: '2rem', backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '2rem', color: '#1e40af' }}>Complete Your Enrollment</h1>

      {applicationInfo && step === 'password' && (
        <div style={{ backgroundColor: '#f0f9ff', padding: '1rem', borderRadius: '6px', marginBottom: '2rem' }}>
          <h3>Welcome, {applicationInfo.first_name} {applicationInfo.middle_name ? applicationInfo.middle_name + ' ' : ''}{applicationInfo.last_name}!</h3>
          <p>Email: {applicationInfo.email}</p>
          {accounts.length > 0 && (
            <div>
              <p><strong>Your Accounts:</strong></p>
              {accounts.map((account, index) => (
                <p key={index}>{account.account_type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}: {account.account_number}</p>
              ))}
            </div>
          )}
        </div>
      )}

      {step === 'password' && (
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
                  {account.account_type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}: {account.account_number}
                </option>
              ))}
            </select>
          </div>

          <div style={{
            marginBottom: '1rem',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '12px',
            padding: '20px',
            backgroundColor: formData.agreeToTerms ? '#f0fdf4' : '#ffffff',
            borderRadius: '12px',
            border: `3px solid ${formData.agreeToTerms ? '#22c55e' : '#e2e8f0'}`,
            position: 'relative',
            zIndex: 10,
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            transition: 'all 0.3s ease'
          }}>
            <input
              type="checkbox"
              name="agreeToTerms"
              checked={formData.agreeToTerms}
              onChange={handleInputChange}
              required
              style={{
                width: '24px',
                height: '24px',
                accentColor: '#22c55e',
                cursor: 'pointer',
                marginTop: '2px',
                flexShrink: 0,
                transform: 'scale(1.2)',
                border: '2px solid #d1d5db',
                borderRadius: '4px'
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
            disabled={loading || !applicationInfo} // Ensure applicationInfo is loaded
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
      )}

      {message && (
        <div style={{
          marginTop: '1rem',
          padding: '12px',
          borderRadius: '6px',
          backgroundColor: message.includes('Error') || message.includes('Invalid') ? '#fee2e2' : '#d1fae5',
          color: message.includes('Error') || message.includes('Invalid') ? '#dc2626' : '#059669',
          textAlign: 'center'
        }}>
          {message}
        </div>
      )}

      {error && (
        <div style={{
          marginTop: '1rem',
          padding: '12px',
          borderRadius: '6px',
          backgroundColor: '#fee2e2',
          color: '#dc2626',
          textAlign: 'center'
        }}>
          {error}
        </div>
      )}

      {step === 'success' && (
        <div style={{
          marginTop: '1rem',
          padding: '12px',
          borderRadius: '6px',
          backgroundColor: '#d1fae5',
          color: '#059669',
          textAlign: 'center'
        }}>
          Enrollment completed successfully! Redirecting to login...
        </div>
      )}
    </div>
  );
}