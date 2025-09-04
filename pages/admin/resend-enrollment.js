// pages/admin/resend-enrollment.js
import { useState, useEffect } from 'react';
import { supabaseAdmin } from '../../lib/supabaseClient';

export default function ResendEnrollmentAdmin() {
  const [unenrolledUsers, setUnenrolledUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [resendLoading, setResendLoading] = useState({});
  const [message, setMessage] = useState('');
  const [emailInput, setEmailInput] = useState('');

  // Fetch users who haven't completed enrollment
  useEffect(() => {
    fetchUnenrolledUsers();
  }, []);

  const fetchUnenrolledUsers = async () => {
    try {
      const { data, error } = await supabaseAdmin
        .from('users')
        .select('id, first_name, last_name, email, created_at')
        .is('auth_id', null)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUnenrolledUsers(data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
      setMessage('Error loading users: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const resendEnrollment = async (user) => {
    setResendLoading({ ...resendLoading, [user.id]: true });
    setMessage('');

    try {
      const response = await fetch('/api/resend-enrollment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user_id: user.id })
      });

      const result = await response.json();

      if (response.ok) {
        setMessage(`✅ Enrollment email sent to ${user.email}`);
      } else {
        setMessage(`❌ Error: ${result.error}`);
      }
    } catch (error) {
      setMessage(`❌ Failed to send email: ${error.message}`);
    } finally {
      setResendLoading({ ...resendLoading, [user.id]: false });
    }
  };

  const resendByEmail = async (e) => {
    e.preventDefault();
    if (!emailInput.trim()) return;

    setLoading(true);
    setMessage('');

    try {
      const response = await fetch('/api/resend-enrollment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: emailInput.trim() })
      });

      const result = await response.json();

      if (response.ok) {
        setMessage(`✅ Enrollment email sent to ${emailInput}`);
        setEmailInput('');
        // Refresh the list
        fetchUnenrolledUsers();
      } else {
        setMessage(`❌ Error: ${result.error}`);
      }
    } catch (error) {
      setMessage(`❌ Failed to send email: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto', fontFamily: 'Arial, sans-serif' }}>
      <h1 style={{ color: '#0070f3', marginBottom: '30px' }}>Resend Enrollment Links</h1>

      {/* Manual Email Input */}
      <div style={{ 
        background: '#f8f9fa', 
        padding: '20px', 
        borderRadius: '8px', 
        marginBottom: '30px',
        border: '1px solid #dee2e6'
      }}>
        <h3 style={{ marginTop: 0 }}>Send by Email Address</h3>
        <form onSubmit={resendByEmail} style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <input
            type="email"
            value={emailInput}
            onChange={(e) => setEmailInput(e.target.value)}
            placeholder="Enter user's email address"
            style={{
              padding: '10px',
              border: '1px solid #ccc',
              borderRadius: '4px',
              flex: 1,
              maxWidth: '300px'
            }}
            required
          />
          <button
            type="submit"
            disabled={loading}
            style={{
              padding: '10px 20px',
              background: '#0070f3',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.6 : 1
            }}
          >
            {loading ? 'Sending...' : 'Send Enrollment Link'}
          </button>
        </form>
      </div>

      {/* Status Message */}
      {message && (
        <div style={{
          padding: '15px',
          marginBottom: '20px',
          borderRadius: '4px',
          background: message.includes('✅') ? '#d4edda' : '#f8d7da',
          border: `1px solid ${message.includes('✅') ? '#c3e6cb' : '#f5c6cb'}`,
          color: message.includes('✅') ? '#155724' : '#721c24'
        }}>
          {message}
        </div>
      )}

      {/* Users List */}
      <div>
        <h3>Users Pending Enrollment ({unenrolledUsers.length})</h3>
        
        {loading ? (
          <p>Loading users...</p>
        ) : unenrolledUsers.length === 0 ? (
          <p style={{ color: '#6c757d', fontStyle: 'italic' }}>
            No users found with pending enrollment.
          </p>
        ) : (
          <div style={{ 
            background: 'white', 
            border: '1px solid #dee2e6', 
            borderRadius: '8px',
            overflow: 'hidden'
          }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f8f9fa' }}>
                  <th style={{ padding: '15px', textAlign: 'left', borderBottom: '1px solid #dee2e6' }}>Name</th>
                  <th style={{ padding: '15px', textAlign: 'left', borderBottom: '1px solid #dee2e6' }}>Email</th>
                  <th style={{ padding: '15px', textAlign: 'left', borderBottom: '1px solid #dee2e6' }}>Applied</th>
                  <th style={{ padding: '15px', textAlign: 'center', borderBottom: '1px solid #dee2e6' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {unenrolledUsers.map((user) => (
                  <tr key={user.id} style={{ borderBottom: '1px solid #f8f9fa' }}>
                    <td style={{ padding: '15px' }}>
                      {user.first_name} {user.last_name}
                    </td>
                    <td style={{ padding: '15px' }}>
                      {user.email}
                    </td>
                    <td style={{ padding: '15px', color: '#6c757d' }}>
                      {new Date(user.created_at).toLocaleDateString()}
                    </td>
                    <td style={{ padding: '15px', textAlign: 'center' }}>
                      <button
                        onClick={() => resendEnrollment(user)}
                        disabled={resendLoading[user.id]}
                        style={{
                          padding: '8px 16px',
                          background: '#28a745',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: resendLoading[user.id] ? 'not-allowed' : 'pointer',
                          opacity: resendLoading[user.id] ? 0.6 : 1,
                          fontSize: '14px'
                        }}
                      >
                        {resendLoading[user.id] ? 'Sending...' : 'Resend Link'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Refresh Button */}
      <div style={{ marginTop: '20px', textAlign: 'center' }}>
        <button
          onClick={fetchUnenrolledUsers}
          disabled={loading}
          style={{
            padding: '10px 20px',
            background: '#6c757d',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.6 : 1
          }}
        >
          {loading ? 'Loading...' : 'Refresh List'}
        </button>
      </div>
    </div>
  );
}

// This would normally require authentication in a real app
export async function getServerSideProps(context) {
  // In a real application, you'd check for admin authentication here
  return { props: {} };
}