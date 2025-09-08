
// pages/admin/resend-enrollment.js
import { useState, useEffect } from 'react';
import { supabaseAdmin } from '../../lib/supabaseClient';

export default function ResendEnrollmentAdmin() {
  const [unenrolledUsers, setUnenrolledUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [resendLoading, setResendLoading] = useState({});
  const [message, setMessage] = useState('');
  const [emailInput, setEmailInput] = useState('');

  // Fetch applications that haven't completed enrollment
  useEffect(() => {
    fetchUnenrolledUsers();
  }, []);

  const fetchUnenrolledUsers = async () => {
    try {
      // Get applications that don't have corresponding auth users yet
      const { data: applications, error } = await supabaseAdmin
        .from('applications')
        .select('id, first_name, last_name, email, created_at')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Filter out applications that already have enrolled users
      const unenrolledApps = [];
      
      if (applications && applications.length > 0) {
        // Get all auth users to check which emails are already enrolled
        const { data: authUsers, error: authError } = await supabaseAdmin.auth.admin.listUsers();
        
        if (authError) {
          console.error('Error fetching auth users:', authError);
          setUnenrolledUsers(applications || []);
        } else {
          const enrolledEmails = new Set(authUsers.users.map(user => user.email));
          
          // Only include applications where the email hasn't been enrolled yet
          for (const app of applications) {
            if (!enrolledEmails.has(app.email)) {
              unenrolledApps.push(app);
            }
          }
          setUnenrolledUsers(unenrolledApps);
        }
      } else {
        setUnenrolledUsers([]);
      }
    } catch (error) {
      console.error('Error fetching applications:', error);
      setMessage('Error loading applications: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const resendEnrollment = async (application) => {
    setResendLoading({ ...resendLoading, [application.id]: true });
    setMessage('');

    try {
      const response = await fetch('/api/resend-enrollment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          email: application.email,
          application_id: application.id 
        })
      });

      const result = await response.json();

      if (response.ok) {
        setMessage(`✅ Enrollment email sent to ${application.email}`);
        // Refresh the list to remove this application if it's now enrolled
        setTimeout(() => fetchUnenrolledUsers(), 1000);
      } else {
        setMessage(`❌ Error: ${result.error}`);
      }
    } catch (error) {
      setMessage(`❌ Failed to send email: ${error.message}`);
    } finally {
      setResendLoading({ ...resendLoading, [application.id]: false });
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

      {/* Applications List */}
      <div>
        <h3>Applications Pending Enrollment ({unenrolledUsers.length})</h3>
        
        {loading ? (
          <p>Loading applications...</p>
        ) : unenrolledUsers.length === 0 ? (
          <p style={{ color: '#6c757d', fontStyle: 'italic' }}>
            No applications found with pending enrollment.
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
                {unenrolledUsers.map((application) => (
                  <tr key={application.id} style={{ borderBottom: '1px solid #f8f9fa' }}>
                    <td style={{ padding: '15px' }}>
                      {application.first_name} {application.last_name}
                    </td>
                    <td style={{ padding: '15px' }}>
                      {application.email}
                    </td>
                    <td style={{ padding: '15px', color: '#6c757d' }}>
                      {new Date(application.created_at).toLocaleDateString()}
                    </td>
                    <td style={{ padding: '15px', textAlign: 'center' }}>
                      <button
                        onClick={() => resendEnrollment(application)}
                        disabled={resendLoading[application.id]}
                        style={{
                          padding: '8px 16px',
                          background: '#28a745',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: resendLoading[application.id] ? 'not-allowed' : 'pointer',
                          opacity: resendLoading[application.id] ? 0.6 : 1,
                          fontSize: '14px'
                        }}
                      >
                        {resendLoading[application.id] ? 'Sending...' : 'Resend Link'}
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
