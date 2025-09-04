// pages/enroll.js
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useRouter } from 'next/router';

export default function EnrollPage() {
  const router = useRouter();
  const { temp_user_id } = router.query; // from email link
  const [formData, setFormData] = useState({ email: '', password: '', ssn: '', id_number: '', accountNumber: '' });
  const [userInfo, setUserInfo] = useState(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [userExists, setUserExists] = useState(false);

  // Check if temp_user_id exists in Supabase
  useEffect(() => {
    if (!temp_user_id) return;

    const checkUser = async () => {
      const { data: user, error } = await supabase
        .from('users')
        .select('id, email, country, first_name, last_name')
        .eq('id', temp_user_id)
        .single();

      if (error || !user) {
        setMessage('Invalid enrollment link.');
        return;
      }
      setUserExists(true);
      setUserInfo(user);
      setFormData({ ...formData, email: user.email || '', password: '', ssn: '', id_number: '', accountNumber: '' });
    };

    checkUser();
  }, [temp_user_id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      if (!temp_user_id) throw new Error('Missing temp user ID');

      // Use server-side API for reliable enrollment
      const response = await fetch('/api/complete-enrollment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          temp_user_id: temp_user_id,
          email: formData.email,
          password: formData.password,
          ssn: formData.ssn,
          id_number: formData.id_number,
          accountNumber: formData.accountNumber
        })
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Enrollment failed');
      }

      setMessage('🎉 Enrollment successful! You can now log in to your dashboard.');
      setFormData({ email: '', password: '', ssn: '', id_number: '', accountNumber: '' });
      
      // Redirect to login page after 2 seconds
      setTimeout(() => {
        window.location.href = '/login';
      }, 2000);

    } catch (err) {
      setMessage(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (!userExists) return <p style={{ textAlign: 'center', marginTop: '2rem' }}>{message || 'Loading...'}</p>;

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      fontFamily: 'Arial, sans-serif',
      padding: '2rem',
      backgroundColor: '#f0f4f8',
      textAlign: 'center'
    }}>
      <h1 style={{ color: '#0070f3', marginBottom: '1rem' }}>Enroll in Online Banking</h1>
      <p>Complete your enrollment by verifying your identity and setting your online banking credentials:</p>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', width: '350px', gap: '15px' }}>
        <div style={{ textAlign: 'left' }}>
          <h3 style={{ margin: '0 0 10px 0', color: '#0070f3', fontSize: '16px' }}>Identity Verification</h3>
          {userInfo && (
            <div style={{
              backgroundColor: '#e3f2fd',
              padding: '10px',
              borderRadius: '5px',
              marginBottom: '15px',
              fontSize: '14px',
              color: '#1976d2'
            }}>
              <strong>Welcome {userInfo.first_name} {userInfo.last_name}!</strong><br/>
              Citizenship: {userInfo.country === 'US' ? 'U.S. Citizen' : 'International'}<br/>
              Please verify your {userInfo.country === 'US' ? 'Social Security Number' : 'Government ID Number'} to complete enrollment.
            </div>
          )}
          
          {/* Conditional Identity Verification */}
          {userInfo && userInfo.country === 'US' && (
            <input
              type="text"
              name="ssn"
              placeholder="Social Security Number (XXX-XX-XXXX)"
              required
              value={formData.ssn}
              onChange={handleChange}
              pattern="[0-9]{3}-?[0-9]{2}-?[0-9]{4}"
              maxLength="11"
              style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc', width: '100%', boxSizing: 'border-box' }}
            />
          )}
          
          {userInfo && userInfo.country === 'International' && (
            <input
              type="text"
              name="id_number"
              placeholder="Government ID Number"
              required
              value={formData.id_number}
              onChange={handleChange}
              style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc', width: '100%', boxSizing: 'border-box' }}
            />
          )}
          <input
            type="text"
            name="accountNumber"
            placeholder="One of your account numbers"
            required
            value={formData.accountNumber}
            onChange={handleChange}
            style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc', width: '100%', boxSizing: 'border-box', marginTop: '10px' }}
          />
        </div>
        
        <div style={{ textAlign: 'left' }}>
          <h3 style={{ margin: '0 0 10px 0', color: '#0070f3', fontSize: '16px' }}>Online Banking Setup</h3>
          <input
            type="email"
            name="email"
            placeholder="Email"
            required
            value={formData.email}
            onChange={handleChange}
            style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc', width: '100%', boxSizing: 'border-box' }}
          />
          <input
            type="password"
            name="password"
            placeholder="Create Password"
            required
            value={formData.password}
            onChange={handleChange}
            minLength="6"
            style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc', width: '100%', boxSizing: 'border-box', marginTop: '10px' }}
          />
        </div>
        <button type="submit" disabled={loading} style={{
          padding: '10px',
          backgroundColor: '#0070f3',
          color: '#fff',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer'
        }}>
          {loading ? 'Enrolling...' : 'Enroll Now'}
        </button>
      </form>

      {message && <p style={{ marginTop: '20px', color: message.startsWith('Error') ? 'red' : 'green' }}>{message}</p>}
    </div>
  );
}
