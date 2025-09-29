import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { supabase } from '../../lib/supabaseClient';

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const [stats, setStats] = useState({
    totalUsers: 0,
    totalAccounts: 0,
    totalTransactions: 0,
    pendingApplications: 0,
    totalBalance: 0
  });

  const [recentUsers, setRecentUsers] = useState([]);
  const [recentTransactions, setRecentTransactions] = useState([]);

  const router = useRouter();
  const ADMIN_PASSWORD = 'Chrismorgan23$';

  // Check admin authentication on mount
  useEffect(() => {
    checkAdminAccess();
  }, []);

  const checkAdminAccess = async () => {
    try {
      setLoading(true);
      const { data: { user }, error: userError } = await supabase.auth.getUser();

      if (userError || !user) {
        router.push('/login');
        return;
      }

      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      if (profileError || !profile || profile.role !== 'admin') {
        router.push('/dashboard');
        return;
      }

      setIsAuthenticated(true);
      fetchStats();
      fetchRecentData();
    } catch (err) {
      console.error('Admin access error:', err);
      setError('Failed to verify admin access.');
    } finally {
      setLoading(false);
    }
  };

  // Handle manual admin login
  const handleLogin = (e) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      localStorage.setItem('adminAuthenticated', 'true');
      setError('');
      fetchStats();
      fetchRecentData();
    } else {
      setError('Invalid password');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('adminAuthenticated');
    setPassword('');
  };

  // Fetch dashboard stats
  const fetchStats = async () => {
    try {
      setLoading(true);

      const [usersResult, accountsResult, transactionsResult, pendingResult, balanceResult] =
        await Promise.allSettled([
          supabase.from('full_profiles').select('*', { count: 'exact' }),
          supabase.from('accounts').select('*', { count: 'exact' }),
          supabase.from('transactions').select('*', { count: 'exact' }),
          supabase.from('full_profiles').select('*', { count: 'exact' }).eq('application_status', 'pending'),
          supabase.from('accounts').select('balance')
        ]);

      const totalUsers = usersResult.status === 'fulfilled' ? usersResult.value.count || 0 : 0;
      const totalAccounts = accountsResult.status === 'fulfilled' ? accountsResult.value.count || 0 : 0;
      const totalTransactions = transactionsResult.status === 'fulfilled' ? transactionsResult.value.count || 0 : 0;
      const pendingApplications = pendingResult.status === 'fulfilled' ? pendingResult.value.count || 0 : 0;

      let totalBalance = 0;
      if (balanceResult.status === 'fulfilled' && balanceResult.value.data) {
        totalBalance = balanceResult.value.data.reduce(
          (sum, acc) => sum + (parseFloat(acc.balance) || 0),
          0
        );
      }

      setStats({ totalUsers, totalAccounts, totalTransactions, pendingApplications, totalBalance });

    } catch (err) {
      console.error('Error fetching stats:', err);
      setError('Failed to load dashboard stats.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch recent users and transactions
  const fetchRecentData = async () => {
    try {
      setLoading(true);
      const [recentUsersResult, recentTransactionsResult] = await Promise.allSettled([
        supabase.from('full_profiles').select('*').order('profile_created_at', { ascending: false }).limit(5),
        supabase.from('transactions').select('*').order('created_at', { ascending: false }).limit(10)
      ]);

      if (recentUsersResult.status === 'fulfilled' && recentUsersResult.value.data) {
        setRecentUsers(
          recentUsersResult.value.data.map(user => ({
            id: user.user_id,
            email: user.email,
            name: `${user.first_name || ''} ${user.middle_name ? user.middle_name + ' ' : ''}${user.last_name || ''}`.trim(),
            created_at: user.profile_created_at,
            phone: user.phone,
            status: user.application_status || 'pending'
          }))
        );
      }

      if (recentTransactionsResult.status === 'fulfilled' && recentTransactionsResult.value.data) {
        setRecentTransactions(recentTransactionsResult.value.data);
      }
    } catch (err) {
      console.error('Error fetching recent data:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div style={styles.loginContainer}>
        <div style={styles.loginCard}>
          <h1 style={styles.title}>🏦 Oakline Bank Admin</h1>
          <form onSubmit={handleLogin} style={styles.form}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Admin Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={styles.input}
                placeholder="Enter admin password"
                required
              />
            </div>
            {error && <div style={styles.error}>{error}</div>}
            <button type="submit" style={styles.loginButton}>
              🔐 Access Admin Panel
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Render dashboard
  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>🏦 Admin Dashboard</h1>
          {loading && <p>Loading data...</p>}
        </div>
        <button onClick={handleLogout} style={styles.logoutButton}>🚪 Logout</button>
      </div>

      {/* Stats */}
      <div style={styles.statsGrid}>
        <div style={styles.statCard}>
          <div style={styles.statIcon}>👥</div>
          <div>
            <h3 style={styles.statNumber}>{stats.totalUsers.toLocaleString()}</h3>
            <p>Total Users</p>
          </div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statIcon}>🏦</div>
          <div>
            <h3 style={styles.statNumber}>{stats.totalAccounts.toLocaleString()}</h3>
            <p>Total Accounts</p>
          </div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statIcon}>💰</div>
          <div>
            <h3 style={styles.statNumber}>${stats.totalBalance.toLocaleString()}</h3>
            <p>Total Balance</p>
          </div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statIcon}>📊</div>
          <div>
            <h3 style={styles.statNumber}>{stats.totalTransactions.toLocaleString()}</h3>
            <p>Total Transactions</p>
          </div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statIcon}>⌛</div>
          <div>
            <h3 style={styles.statNumber}>{stats.pendingApplications.toLocaleString()}</h3>
            <p>Pending Applications</p>
          </div>
        </div>
      </div>

      {/* Recent Users */}
      <div>
        <h2>👥 Recent Users</h2>
        <ul>
          {recentUsers.map(u => (
            <li key={u.id}>{u.name} — {new Date(u.created_at).toLocaleDateString()}</li>
          ))}
        </ul>
      </div>

      {/* Recent Transactions */}
      <div>
        <h2>💸 Recent Transactions</h2>
        <ul>
          {recentTransactions.map(tx => (
            <li key={tx.id}>{tx.type} - ${tx.amount} ({tx.status})</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

const styles = {
  loginContainer: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
    padding: '20px'
  },
  loginCard: {
    background: 'white',
    padding: '40px',
    borderRadius: '16px',
    boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
    width: '100%',
    maxWidth: '400px'
  },
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #1e3a5f 0%, #2c5282 100%)',
    padding: '20px',
    paddingBottom: '80px', // Add padding to the bottom to make space for the sticky footer
    position: 'relative', // Needed for absolute positioning of the footer
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '30px',
    background: 'white',
    padding: '20px',
    borderRadius: '12px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
  },
  welcomeSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '5px'
  },
  title: {
    fontSize: '28px',
    fontWeight: 'bold',
    color: '#1e3c72',
    margin: 0
  },
  subtitle: {
    fontSize: '16px',
    color: '#555',
    margin: 0
  },
  loadingText: {
    fontSize: '14px',
    color: '#666',
    fontStyle: 'italic'
  },
  headerActions: {
    display: 'flex',
    gap: '10px'
  },
  refreshButton: {
    background: '#28a745',
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
    ':disabled': {
      opacity: 0.7,
      cursor: 'not-allowed'
    }
  },
  logoutButton: {
    background: '#dc3545',
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500'
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '20px',
    marginBottom: '30px'
  },
  statCard: {
    background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
    padding: '25px',
    borderRadius: '16px',
    textAlign: 'center',
    boxShadow: '0 8px 25px rgba(0,0,0,0.1)',
    border: '1px solid rgba(30, 58, 95, 0.1)',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
    cursor: 'pointer'
  },
  statIcon: {
    fontSize: '2.5rem',
    marginBottom: '10px',
    display: 'block'
  },
  statInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '5px'
  },
  statNumber: {
    fontSize: '28px',
    fontWeight: 'bold',
    color: '#1e3a5f',
    margin: '0'
  },
  statLabel: {
    fontSize: '14px',
    color: '#64748b',
    fontWeight: '500',
    margin: '0',
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  },
  statNumber: {
    fontSize: '32px',
    fontWeight: 'bold',
    color: '#1e3c72',
    margin: '10px 0 0 0'
  },
  quickActions: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
    gap: '15px',
    marginBottom: '30px'
  },
  actionButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    padding: '12px 16px',
    background: 'linear-gradient(135deg, #43cea2 0%, #18b590 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'transform 0.2s, box-shadow 0.2s',
    ':hover': {
      transform: 'translateY(-2px)',
      boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
    }
  },
  activityGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '25px',
    marginBottom: '30px'
  },
  section: {
    background: 'white',
    padding: '25px',
    borderRadius: '12px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
  },
  sectionTitle: {
    fontSize: '20px',
    fontWeight: 'bold',
    color: '#1e3c72',
    marginBottom: '20px'
  },
  activityList: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
    maxHeight: '300px',
    overflowY: 'auto'
  },
  activityItem: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '10px 0',
    borderBottom: '1px solid #eee',
    fontSize: '14px',
    color: '#333'
  },
  adminGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
    gap: '25px'
  },
  buttonGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
    gap: '12px'
  },
  adminButton: {
    display: 'block',
    padding: '12px 16px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    textDecoration: 'none',
    borderRadius: '8px',
    textAlign: 'center',
    fontSize: '14px',
    fontWeight: '500',
    transition: 'transform 0.2s, box-shadow 0.2s',
    ':hover': {
      transform: 'translateY(-2px)',
      boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
    }
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px'
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  },
  label: {
    fontSize: '14px',
    fontWeight: '500',
    color: '#333'
  },
  input: {
    padding: '12px',
    border: '2px solid #e0e0e0',
    borderRadius: '8px',
    fontSize: '16px',
    outline: 'none',
    transition: 'border-color 0.3s'
  },
  loginButton: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    border: 'none',
    padding: '12px 24px',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '500',
    cursor: 'pointer'
  },
  error: {
    color: '#dc3545',
    fontSize: '14px',
    textAlign: 'center'
  },
  stickyFooter: {
    position: 'fixed',
    bottom: 0,
    left: 0,
    width: '100%',
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center',
    background: '#1e3a5f',
    padding: '15px 0',
    boxShadow: '0 -2px 10px rgba(0,0,0,0.15)',
    zIndex: 1000,
  },
  footerButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '10px 18px',
    background: 'linear-gradient(135deg, #43cea2 0%, #18b590 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'transform 0.2s, box-shadow 0.2s',
    ':hover': {
      transform: 'translateY(-2px)',
      boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
    }
  }
};
