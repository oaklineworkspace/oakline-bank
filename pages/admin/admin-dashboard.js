import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { supabase } from '../../lib/supabaseClient';

export default function AdminDashboard() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalAccounts: 0,
    totalTransactions: 0,
    pendingApplications: 0,
    totalBalance: 0,
  });
  const [recentUsers, setRecentUsers] = useState([]);
  const [recentTransactions, setRecentTransactions] = useState([]);

  // -------------------
  // Check Admin Access
  // -------------------
  const checkAdminAccess = async () => {
    setLoading(true);
    try {
      // Check local storage first
      const adminAuth = localStorage.getItem('adminAuthenticated');
      if (adminAuth === 'true') {
        setIsAuthenticated(true);
        fetchStats();
        setLoading(false);
        return;
      }

      // If not in localStorage, check Supabase auth
      const {
        data: { user },
        error: userError
      } = await supabase.auth.getUser();

      if (userError || !user) {
        console.error('Auth error:', userError);
        setLoading(false);
        return;
      }

      // Check if user has admin role in profiles or admin_profiles table
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      if (!profileError && profile?.role === 'admin') {
        setIsAuthenticated(true);
        localStorage.setItem('adminAuthenticated', 'true');
        fetchStats();
      } else {
        // Try admin_profiles table as fallback
        const { data: adminProfile } = await supabase
          .from('admin_profiles')
          .select('role')
          .eq('id', user.id)
          .single();

        if (adminProfile) {
          setIsAuthenticated(true);
          localStorage.setItem('adminAuthenticated', 'true');
          fetchStats();
        }
      }
    } catch (err) {
      console.error('Unexpected error:', err);
      setError('An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAdminAccess();
  }, []);

  // -------------------
  // Fetch Stats & Data
  // -------------------
  const fetchStats = async () => {
    setLoading(true);
    try {
      // Fetch total users from applications table
      const { data: usersData, error: usersError } = await supabase
        .from('applications')
        .select('*, profiles(*)')
        .order('submitted_at', { ascending: false });

      if (usersError) {
        console.error('Error fetching users:', usersError);
      }

      const users = usersData || [];

      // Fetch accounts
      const { data: accountsData, error: accountsError } = await supabase
        .from('accounts')
        .select('*');

      if (accountsError) console.error('Error fetching accounts:', accountsError);

      const accounts = accountsData || [];

      // Fetch transactions
      const { data: transactionsData, error: transactionsError } = await supabase
        .from('transactions')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);

      if (transactionsError) console.error('Error fetching transactions:', transactionsError);

      const transactions = transactionsData || [];

      // Calculate total balance
      const totalBalance = accounts.reduce((sum, acc) => sum + (parseFloat(acc.balance) || 0), 0);

      // Recent users
      const recentUsersList = users.slice(0, 5).map(user => ({
        id: user.id,
        name: `${user.first_name || ''} ${user.middle_name ? user.middle_name + ' ' : ''}${user.last_name || ''}`.trim(),
        email: user.email,
        created_at: user.submitted_at,
        status: user.application_status || 'pending'
      }));

      // Recent transactions
      const recentTxList = transactions.slice(0, 10);

      // Pending applications
      const pendingApplications = users.filter(u => u.application_status === 'pending').length;

      setStats({
        totalUsers: users.length,
        totalAccounts: accounts.length,
        totalTransactions: transactions.length,
        pendingApplications,
        totalBalance,
      });

      setRecentUsers(recentUsersList);
      setRecentTransactions(recentTxList);
    } catch (err) {
      console.error('Error fetching stats:', err);
      setError('Failed to fetch dashboard data.');
    } finally {
      setLoading(false);
    }
  };

  // -------------------
  // Render
  // -------------------
  if (loading) return <div style={{ padding: '50px', textAlign: 'center' }}>Loading...</div>;
  if (!isAuthenticated) return <div style={{ padding: '50px', textAlign: 'center' }}>Checking access...</div>;

  return (
    <div style={{ padding: '20px', minHeight: '100vh', background: '#f0f4f8' }}>
      <h1>🏦 Admin Dashboard</h1>

      {/* Stats */}
      <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
        <StatCard label="Total Users" value={stats.totalUsers} />
        <StatCard label="Total Accounts" value={stats.totalAccounts} />
        <StatCard label="Total Transactions" value={stats.totalTransactions} />
        <StatCard label="Pending Applications" value={stats.pendingApplications} />
        <StatCard label="Total Balance" value={`$${stats.totalBalance.toFixed(2)}`} />
      </div>

      {/* Recent Users */}
      <h2 style={{ marginTop: '30px' }}>👥 Recent Users</h2>
      {recentUsers.length === 0 ? <p>No recent users</p> : (
        <ul>
          {recentUsers.map(user => (
            <li key={user.id}>{user.name} - {user.email} - {new Date(user.created_at).toLocaleDateString()}</li>
          ))}
        </ul>
      )}

      {/* Recent Transactions */}
      <h2 style={{ marginTop: '30px' }}>💸 Recent Transactions</h2>
      {recentTransactions.length === 0 ? <p>No recent transactions</p> : (
        <ul>
          {recentTransactions.map(tx => (
            <li key={tx.id}>{tx.type} - ${parseFloat(tx.amount).toLocaleString()} - {tx.status}</li>
          ))}
        </ul>
      )}

      {/* Quick Links */}
      <h2 style={{ marginTop: '30px' }}>Quick Actions</h2>
      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
        <Link href="/admin/admin-users"><button>Manage Users</button></Link>
        <Link href="/admin/approve-accounts"><button>Approve Accounts</button></Link>
        <Link href="/admin/admin-transactions"><button>All Transactions</button></Link>
        <Link href="/admin/admin-loans"><button>Manage Loans</button></Link>
        <Link href="/admin/admin-card-applications"><button>Card Applications</button></Link>
      </div>
    </div>
  );
}

// -------------------
// Stat Card Component
// -------------------
function StatCard({ label, value }) {
  return (
    <div style={{
      background: 'white',
      padding: '20px',
      borderRadius: '12px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      minWidth: '150px'
    }}>
      <h3 style={{ margin: 0 }}>{label}</h3>
      <p style={{ fontSize: '20px', fontWeight: 'bold', margin: 0 }}>{value}</p>
    </div>
  );
}const styles = {
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
