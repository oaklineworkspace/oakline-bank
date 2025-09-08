
import { useState, useEffect } from 'react';
import { supabaseAdmin } from '../../lib/supabaseClient';

export default function ResendEnrollmentPage() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [resendingId, setResendingId] = useState(null);

  useEffect(() => {
    fetchPendingApplications();
  }, []);

  const fetchPendingApplications = async () => {
    try {
      setLoading(true);
      
      // Get all applications with their enrollment status
      const { data: applicationsData, error: appsError } = await supabaseAdmin
        .from('applications')
        .select(`
          id,
          email,
          first_name,
          middle_name,
          last_name,
          created_at,
          country
        `)
        .order('created_at', { ascending: false });

      if (appsError) throw appsError;

      // Get enrollment records
      const { data: enrollmentsData, error: enrollError } = await supabaseAdmin
        .from('enrollments')
        .select('application_id, is_used, created_at');

      if (enrollError) throw enrollError;

      // Combine data
      const enrichedApplications = applicationsData.map(app => {
        const enrollment = enrollmentsData.find(e => e.application_id === app.id);
        return {
          ...app,
          enrollment_status: enrollment ? (enrollment.is_used ? 'completed' : 'pending') : 'not_sent',
          enrollment_date: enrollment?.created_at
        };
      });

      setApplications(enrichedApplications);
    } catch (error) {
      console.error('Error fetching applications:', error);
      setMessage('Error loading applications: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResendEnrollment = async (applicationId) => {
    setResendingId(applicationId);
    setMessage('');

    try {
      const response = await fetch('/api/resend-enrollment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ applicationId })
      });

      const result = await response.json();

      if (response.ok) {
        setMessage('Enrollment email sent successfully!');
        fetchPendingApplications(); // Refresh the list
      } else {
        setMessage(`Error: ${result.error}`);
      }
    } catch (error) {
      console.error('Error resending enrollment:', error);
      setMessage('Error sending enrollment email');
    } finally {
      setResendingId(null);
    }
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.loading}>Loading applications...</div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1>Resend Enrollment Links</h1>
        <p>Manage enrollment links for submitted applications</p>
      </div>

      {message && (
        <div style={{
          ...styles.message,
          backgroundColor: message.includes('Error') ? '#fee2e2' : '#d1fae5',
          color: message.includes('Error') ? '#dc2626' : '#059669'
        }}>
          {message}
        </div>
      )}

      <div style={styles.tableContainer}>
        <table style={styles.table}>
          <thead>
            <tr style={styles.headerRow}>
              <th style={styles.headerCell}>Name</th>
              <th style={styles.headerCell}>Email</th>
              <th style={styles.headerCell}>Application Date</th>
              <th style={styles.headerCell}>Enrollment Status</th>
              <th style={styles.headerCell}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {applications.map((app) => (
              <tr key={app.id} style={styles.row}>
                <td style={styles.cell}>
                  {app.first_name} {app.middle_name ? app.middle_name + ' ' : ''}{app.last_name}
                </td>
                <td style={styles.cell}>{app.email}</td>
                <td style={styles.cell}>
                  {new Date(app.created_at).toLocaleDateString()}
                </td>
                <td style={styles.cell}>
                  <span style={{
                    ...styles.statusBadge,
                    backgroundColor: 
                      app.enrollment_status === 'completed' ? '#d1fae5' :
                      app.enrollment_status === 'pending' ? '#fef3c7' : '#fee2e2',
                    color:
                      app.enrollment_status === 'completed' ? '#059669' :
                      app.enrollment_status === 'pending' ? '#d97706' : '#dc2626'
                  }}>
                    {app.enrollment_status === 'completed' ? 'Completed' :
                     app.enrollment_status === 'pending' ? 'Pending' : 'Not Sent'}
                  </span>
                </td>
                <td style={styles.cell}>
                  <button
                    onClick={() => handleResendEnrollment(app.id)}
                    disabled={resendingId === app.id}
                    style={{
                      ...styles.button,
                      opacity: resendingId === app.id ? 0.5 : 1,
                      cursor: resendingId === app.id ? 'not-allowed' : 'pointer'
                    }}
                  >
                    {resendingId === app.id ? 'Sending...' : 'Resend Link'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {applications.length === 0 && (
          <div style={styles.noData}>
            No applications found.
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: '2rem',
    maxWidth: '1200px',
    margin: '0 auto',
    fontFamily: 'Arial, sans-serif'
  },
  header: {
    marginBottom: '2rem',
    textAlign: 'center'
  },
  loading: {
    textAlign: 'center',
    padding: '2rem',
    fontSize: '18px'
  },
  message: {
    padding: '1rem',
    borderRadius: '8px',
    marginBottom: '1rem',
    textAlign: 'center',
    fontWeight: '500'
  },
  tableContainer: {
    backgroundColor: 'white',
    borderRadius: '12px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
    overflow: 'hidden'
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse'
  },
  headerRow: {
    backgroundColor: '#f8fafc'
  },
  headerCell: {
    padding: '1rem',
    textAlign: 'left',
    fontWeight: '600',
    color: '#374151',
    borderBottom: '2px solid #e5e7eb'
  },
  row: {
    borderBottom: '1px solid #e5e7eb'
  },
  cell: {
    padding: '1rem',
    verticalAlign: 'middle'
  },
  statusBadge: {
    padding: '4px 12px',
    borderRadius: '6px',
    fontSize: '12px',
    fontWeight: '600'
  },
  button: {
    padding: '8px 16px',
    backgroundColor: '#1e40af',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: '500',
    transition: 'background-color 0.2s'
  },
  noData: {
    textAlign: 'center',
    padding: '2rem',
    color: '#6b7280'
  }
};
