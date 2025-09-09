
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useRouter } from 'next/router';

export default function Profile() {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState({});
  const [message, setMessage] = useState('');
  const router = useRouter();

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
        return;
      }
      setUser(user);
      await Promise.all([
        fetchUserProfile(user.id),
        fetchUserAccounts(user.id),
        fetchApplicationData(user.id)
      ]);
    } catch (error) {
      console.error('Error checking user:', error);
      setError('Failed to load user data');
    } finally {
      setLoading(false);
    }
  };

  const fetchUserProfile = async (userId) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      setUserProfile(data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const fetchUserAccounts = async (userId) => {
    try {
      // First try to get accounts linked via user_id
      let { data, error } = await supabase
        .from('accounts')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      // If no accounts found via user_id, try via profile/application relationship
      if (!data || data.length === 0) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('application_id')
          .eq('id', userId)
          .single();

        if (profile?.application_id) {
          const { data: accountsData, error: accountsError } = await supabase
            .from('accounts')
            .select('*')
            .eq('application_id', profile.application_id)
            .order('created_at', { ascending: false });

          data = accountsData;
          error = accountsError;
        }
      }

      if (error) throw error;
      setAccounts(data || []);
    } catch (error) {
      console.error('Error fetching accounts:', error);
    }
  };

  const fetchApplicationData = async (userId) => {
    try {
      // Try to get application data via profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('application_id')
        .eq('id', userId)
        .single();

      if (profile?.application_id) {
        const { data: appData, error } = await supabase
          .from('applications')
          .select('*')
          .eq('id', profile.application_id)
          .single();

        if (error && error.code !== 'PGRST116') throw error;
        setApplication(appData);
        setEditData(appData || {});
      }
    } catch (error) {
      console.error('Error fetching application:', error);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setMessage('');

    try {
      if (application?.id) {
        const { error } = await supabase
          .from('applications')
          .update({
            phone: editData.phone,
            address: editData.address,
            city: editData.city,
            state: editData.state,
            zip_code: editData.zip_code,
            updated_at: new Date().toISOString()
          })
          .eq('id', application.id);

        if (error) throw error;
        
        setApplication({ ...application, ...editData });
        setEditMode(false);
        setMessage('Profile updated successfully!');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      setMessage('Failed to update profile. Please try again.');
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount || 0);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getTotalBalance = () => {
    return accounts.reduce((total, account) => total + parseFloat(account.balance || 0), 0);
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.loading}>Loading your profile...</div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>My Profile</h1>
        <button 
          style={styles.backButton}
          onClick={() => router.push('/dashboard')}
        >
          ← Back to Dashboard
        </button>
      </div>

      {error && (
        <div style={styles.error}>{error}</div>
      )}

      {message && (
        <div style={styles.message}>{message}</div>
      )}

      <div style={styles.grid}>
        {/* Personal Information Section */}
        <section style={styles.section}>
          <div style={styles.sectionHeader}>
            <h2 style={styles.sectionTitle}>Personal Information</h2>
            {!editMode && application && (
              <button 
                style={styles.editButton}
                onClick={() => setEditMode(true)}
              >
                Edit
              </button>
            )}
          </div>

          {editMode ? (
            <form onSubmit={handleUpdateProfile} style={styles.form}>
              <div style={styles.formGrid}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Phone</label>
                  <input
                    type="tel"
                    style={styles.input}
                    value={editData.phone || ''}
                    onChange={(e) => setEditData({...editData, phone: e.target.value})}
                  />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Address</label>
                  <input
                    type="text"
                    style={styles.input}
                    value={editData.address || ''}
                    onChange={(e) => setEditData({...editData, address: e.target.value})}
                  />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>City</label>
                  <input
                    type="text"
                    style={styles.input}
                    value={editData.city || ''}
                    onChange={(e) => setEditData({...editData, city: e.target.value})}
                  />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>State</label>
                  <input
                    type="text"
                    style={styles.input}
                    value={editData.state || ''}
                    onChange={(e) => setEditData({...editData, state: e.target.value})}
                  />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>ZIP Code</label>
                  <input
                    type="text"
                    style={styles.input}
                    value={editData.zip_code || ''}
                    onChange={(e) => setEditData({...editData, zip_code: e.target.value})}
                  />
                </div>
              </div>
              <div style={styles.formActions}>
                <button type="submit" style={styles.saveButton}>Save Changes</button>
                <button 
                  type="button" 
                  style={styles.cancelButton}
                  onClick={() => {
                    setEditMode(false);
                    setEditData(application || {});
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <div style={styles.infoGrid}>
              <div style={styles.infoItem}>
                <span style={styles.infoLabel}>Full Name:</span>
                <span style={styles.infoValue}>
                  {application ? `${application.first_name} ${application.last_name}` : 'N/A'}
                </span>
              </div>
              <div style={styles.infoItem}>
                <span style={styles.infoLabel}>Email:</span>
                <span style={styles.infoValue}>{user?.email || 'N/A'}</span>
              </div>
              <div style={styles.infoItem}>
                <span style={styles.infoLabel}>Phone:</span>
                <span style={styles.infoValue}>{application?.phone || 'N/A'}</span>
              </div>
              <div style={styles.infoItem}>
                <span style={styles.infoLabel}>Date of Birth:</span>
                <span style={styles.infoValue}>{formatDate(application?.date_of_birth)}</span>
              </div>
              <div style={styles.infoItem}>
                <span style={styles.infoLabel}>Address:</span>
                <span style={styles.infoValue}>
                  {application?.address ? 
                    `${application.address}, ${application.city}, ${application.state} ${application.zip_code}` : 
                    'N/A'
                  }
                </span>
              </div>
              <div style={styles.infoItem}>
                <span style={styles.infoLabel}>Member Since:</span>
                <span style={styles.infoValue}>{formatDate(application?.created_at)}</span>
              </div>
            </div>
          )}
        </section>

        {/* Account Summary */}
        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>Account Summary</h2>
          <div style={styles.summaryCard}>
            <div style={styles.summaryItem}>
              <span style={styles.summaryLabel}>Total Accounts:</span>
              <span style={styles.summaryValue}>{accounts.length}</span>
            </div>
            <div style={styles.summaryItem}>
              <span style={styles.summaryLabel}>Total Balance:</span>
              <span style={styles.summaryValueLarge}>{formatCurrency(getTotalBalance())}</span>
            </div>
          </div>
        </section>

        {/* Accounts Details */}
        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>My Accounts ({accounts.length})</h2>
          {accounts.length === 0 ? (
            <div style={styles.noAccounts}>
              <p>No accounts found. Please contact support if this seems incorrect.</p>
            </div>
          ) : (
            <div style={styles.accountsList}>
              {accounts.map(account => (
                <div key={account.id} style={styles.accountCard}>
                  <div style={styles.accountHeader}>
                    <h3 style={styles.accountTitle}>
                      {account.account_name || `${account.account_type} Account`}
                    </h3>
                    <span style={styles.accountType}>{account.account_type}</span>
                  </div>
                  <div style={styles.accountDetails}>
                    <div style={styles.accountItem}>
                      <span style={styles.accountLabel}>Account Number:</span>
                      <span style={styles.accountValue}>****{account.account_number?.slice(-4)}</span>
                    </div>
                    <div style={styles.accountItem}>
                      <span style={styles.accountLabel}>Routing Number:</span>
                      <span style={styles.accountValue}>{account.routing_number || 'N/A'}</span>
                    </div>
                    <div style={styles.accountItem}>
                      <span style={styles.accountLabel}>Balance:</span>
                      <span style={styles.accountBalanceValue}>
                        {formatCurrency(account.balance)}
                      </span>
                    </div>
                    <div style={styles.accountItem}>
                      <span style={styles.accountLabel}>Status:</span>
                      <span style={{
                        ...styles.accountValue,
                        color: account.status === 'active' ? '#10b981' : '#ef4444',
                        fontWeight: 'bold'
                      }}>
                        {account.status || 'Active'}
                      </span>
                    </div>
                    <div style={styles.accountItem}>
                      <span style={styles.accountLabel}>Opened:</span>
                      <span style={styles.accountValue}>{formatDate(account.created_at)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Security Settings */}
        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>Security</h2>
          <div style={styles.securityOptions}>
            <button 
              style={styles.securityButton}
              onClick={() => router.push('/reset-password')}
            >
              🔐 Change Password
            </button>
            <button 
              style={styles.securityButton}
              onClick={() => router.push('/mfa-setup')}
            >
              🛡️ Two-Factor Authentication
            </button>
            <button 
              style={styles.securityButton}
              onClick={() => router.push('/security')}
            >
              🔒 Security Settings
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#f8fafc',
    padding: '20px',
    fontFamily: 'system-ui, -apple-system, sans-serif'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '30px',
    flexWrap: 'wrap',
    gap: '15px'
  },
  title: {
    fontSize: '32px',
    fontWeight: 'bold',
    color: '#1e293b',
    margin: 0
  },
  backButton: {
    padding: '10px 20px',
    backgroundColor: '#64748b',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    cursor: 'pointer',
    transition: 'background-color 0.2s'
  },
  loading: {
    textAlign: 'center',
    padding: '40px',
    fontSize: '18px',
    color: '#64748b'
  },
  error: {
    backgroundColor: '#fee2e2',
    border: '1px solid #fecaca',
    color: '#dc2626',
    padding: '15px',
    borderRadius: '8px',
    marginBottom: '20px'
  },
  message: {
    backgroundColor: '#dcfce7',
    border: '1px solid #bbf7d0',
    color: '#166534',
    padding: '15px',
    borderRadius: '8px',
    marginBottom: '20px'
  },
  grid: {
    display: 'grid',
    gap: '25px',
    maxWidth: '1200px',
    margin: '0 auto'
  },
  section: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '25px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
  },
  sectionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px'
  },
  sectionTitle: {
    fontSize: '20px',
    fontWeight: 'bold',
    color: '#1e293b',
    margin: 0
  },
  editButton: {
    padding: '8px 16px',
    backgroundColor: '#3b82f6',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    fontSize: '14px',
    cursor: 'pointer'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px'
  },
  formGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '15px'
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '5px'
  },
  label: {
    fontSize: '14px',
    fontWeight: '500',
    color: '#374151'
  },
  input: {
    padding: '10px',
    border: '1px solid #d1d5db',
    borderRadius: '6px',
    fontSize: '14px'
  },
  formActions: {
    display: 'flex',
    gap: '10px',
    justifyContent: 'flex-start'
  },
  saveButton: {
    padding: '12px 24px',
    backgroundColor: '#10b981',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer'
  },
  cancelButton: {
    padding: '12px 24px',
    backgroundColor: '#6b7280',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer'
  },
  infoGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '15px'
  },
  infoItem: {
    display: 'flex',
    flexDirection: 'column',
    gap: '5px',
    padding: '15px',
    backgroundColor: '#f8fafc',
    borderRadius: '8px'
  },
  infoLabel: {
    fontSize: '14px',
    fontWeight: '500',
    color: '#6b7280'
  },
  infoValue: {
    fontSize: '16px',
    color: '#1e293b',
    fontWeight: '500'
  },
  summaryCard: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '20px'
  },
  summaryItem: {
    textAlign: 'center',
    padding: '20px',
    backgroundColor: '#f1f5f9',
    borderRadius: '10px'
  },
  summaryLabel: {
    display: 'block',
    fontSize: '14px',
    color: '#64748b',
    marginBottom: '5px'
  },
  summaryValue: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#1e293b'
  },
  summaryValueLarge: {
    fontSize: '28px',
    fontWeight: 'bold',
    color: '#059669'
  },
  noAccounts: {
    textAlign: 'center',
    padding: '40px',
    color: '#64748b'
  },
  accountsList: {
    display: 'grid',
    gap: '20px'
  },
  accountCard: {
    border: '1px solid #e2e8f0',
    borderRadius: '10px',
    padding: '20px',
    backgroundColor: '#fafafa'
  },
  accountHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '15px'
  },
  accountTitle: {
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#1e293b',
    margin: 0
  },
  accountType: {
    backgroundColor: '#dbeafe',
    color: '#1d4ed8',
    padding: '4px 12px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: '500',
    textTransform: 'uppercase'
  },
  accountDetails: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '15px'
  },
  accountItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '8px 0',
    borderBottom: '1px solid #e2e8f0'
  },
  accountLabel: {
    fontSize: '14px',
    color: '#64748b',
    fontWeight: '500'
  },
  accountValue: {
    fontSize: '14px',
    color: '#1e293b',
    fontWeight: '500'
  },
  accountBalanceValue: {
    fontSize: '16px',
    color: '#059669',
    fontWeight: 'bold'
  },
  securityOptions: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '15px'
  },
  securityButton: {
    padding: '15px 20px',
    backgroundColor: '#f8fafc',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '500',
    color: '#374151',
    cursor: 'pointer',
    transition: 'all 0.2s',
    textAlign: 'left'
  }
};
