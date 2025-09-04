// pages/enroll.js
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useRouter } from 'next/router';

export default function EnrollPage() {
  const router = useRouter();
  const { temp_user_id } = router.query; // from email link
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [userExists, setUserExists] = useState(false);

  // Check if temp_user_id exists in Supabase
  useEffect(() => {
    if (!temp_user_id) return;

    const checkUser = async () => {
      const { data: user, error } = await supabase
        .from('users')
        .select('id, email')
        .eq('id', temp_user_id)
        .single();

      if (error || !user) {
        setMessage('Invalid enrollment link.');
        return;
      }
      setUserExists(true);
      setFormData({ ...formData, email: user.email || '' });
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
          password: formData.password
        })
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Enrollment failed');
      }

      setMessage('🎉 Enrollment successful! You can now log in to your dashboard.');
      setFormData({ email: '', password: '' });
      
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
      <p>Set your online banking email and password:</p>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', width: '300px', gap: '10px' }}>
        <input
          type="email"
          name="email"
          placeholder="Email"
          required
          value={formData.email}
          onChange={handleChange}
          style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          required
          value={formData.password}
          onChange={handleChange}
          style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
        />
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
