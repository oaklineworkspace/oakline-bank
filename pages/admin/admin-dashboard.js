import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [bankStats, setBankStats] = useState({
    totalUsers: 0,
    totalAccounts: 0,
    totalBalance: 0,
    pendingTransactions: 0,
    activeLoans: 0,
    totalDeposits: 0,
    totalWithdrawals: 0,
    newUsersToday: 0
  });

  const [recentUsers, setRecentUsers] = useState([]);
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const ADMIN_PASSWORD = 'Chrismorgan23$';

  useEffect(() => {
    const adminAuth = localStorage.getItem('adminAuthenticated');
    if (adminAuth === 'true') {
      setIsAuthenticated(true);
      fetchBankData();
    }
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      localStorage.setItem('adminAuthenticated', 'true');
      setError('');
      fetchBankData();
    } else {
      setError('Invalid password');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('adminAuthenticated');
    setPassword('');
  };

  const fetchBankData = async () => {
    try {
      setLoading(true);

      // Fetch users data
      const usersResponse = await fetch('/api/admin/get-users');
      const usersData = await usersResponse.json();

      // Fetch accounts data
      const accountsResponse = await fetch('/api/admin/get-accounts');
      const accountsData = await accountsResponse.json();

      // Fetch transactions data
      const transactionsResponse = await fetch('/api/admin/get-transactions');
      const transactionsData = await transactionsResponse.json();

      if (usersData.success && accountsData.success && transactionsData.success) {
        const totalBalance = accountsData.accounts.reduce((sum, acc) => sum + (acc.balance || 0), 0);
        const todayUsers = usersData.users.filter(user => {
          const userDate = new Date(user.created_at).toDateString();
          const today = new Date().toDateString();
          return userDate === today;
        }).length;

        setBankStats({
          totalUsers: usersData.users.length,
          totalAccounts: accountsData.accounts.length,
          totalBalance: totalBalance,
          pendingTransactions: transactionsData.transactions.filter(t => t.status === 'pending').length,
          activeLoans: 0, // Add loan counting logic when loans table is ready
          totalDeposits: transactionsData.transactions
            .filter(t => t.type === 'deposit')
            .reduce((sum, t) => sum + (t.amount || 0), 0),
          totalWithdrawals: transactionsData.transactions
            .filter(t => t.type === 'withdrawal')
            .reduce((sum, t) => sum + (t.amount || 0), 0),
          newUsersToday: todayUsers
        });

        setRecentUsers(usersData.users.slice(-5));
        setRecentTransactions(transactionsData.transactions.slice(-10));
      }
    } catch (error) {
      console.error('Error fetching bank data:', error);
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

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={styles.welcomeSection}>
          <h1 style={styles.title}>🏦 Admin Dashboard</h1>
          <p style={styles.subtitle}>Oakline Bank Management System</p>
          {loading && <p style={styles.loadingText}>Loading bank data...</p>}
        </div>
        <div style={styles.headerActions}>
          <button onClick={fetchBankData} style={styles.refreshButton} disabled={loading}>
            {loading ? '🔄 Loading...' : '🔄 Refresh'}
          </button>
          <button onClick={handleLogout} style={styles.logoutButton}>
            🚪 Logout
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div style={styles.statsGrid}>
        <div style={styles.statCard}>
          <h3>👥 Total Users</h3>
          <p style={styles.statNumber}>{bankStats.totalUsers.toLocaleString()}</p>
        </div>
        <div style={styles.statCard}>
          <h3>🏦 Total Accounts</h3>
          <p style={styles.statNumber}>{bankStats.totalAccounts.toLocaleString()}</p>
        </div>
        <div style={styles.statCard}>
          <h3>💸 Transactions</h3>
          <p style={styles.statNumber}>{bankStats.totalTransactions.toLocaleString()}</p>
        </div>
        <div style={styles.statCard}>
          <h3>💰 Total Balance</h3>
          <p style={styles.statNumber}>${bankStats.totalBalance.toLocaleString()}</p>
        </div>
        <div style={styles.statCard}>
          <h3>🏠 Active Loans</h3>
          <p style={styles.statNumber}>{bankStats.activeLoans.toLocaleString()}</p>
        </div>
        <div style={styles.statCard}>
          <h3>📈 Investments</h3>
          <p style={styles.statNumber}>{bankStats.totalInvestments.toLocaleString()}</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div style={styles.quickActions}>
        <button
          style={styles.actionButton}
          onClick={() => router.push('/admin/admin-users')}
        >
          👥 Manage Users
        </button>
        <button
          style={styles.actionButton}
          onClick={() => router.push('/admin/manual-transactions')}
        >
          💰 Manual Transactions
        </button>
        <button
          style={styles.actionButton}
          onClick={() => router.push('/admin/bulk-transactions')}
        >
          📦 Bulk Transactions
        </button>
        <button
          style={styles.actionButton}
          onClick={() => router.push('/admin/create-user')}
        >
          ➕ Create User
        </button>
        <button
          style={styles.actionButton}
          onClick={() => router.push('/admin/admin-loans')}
        >
          🏠 Manage Loans
        </button>
        <button
          style={styles.actionButton}
          onClick={() => router.push('/admin/admin-investments')}
        >
          📈 Manage Investments
        </button>
        <button
          style={styles.actionButton}
          onClick={() => router.push('/admin/admin-crypto')}
        >
          ₿ Manage Crypto
        </button>
        <button
          style={styles.actionButton}
          onClick={() => router.push('/admin/admin-balance')}
        >
          💳 Balance Management
        </button>
      </div>

      {/* Recent Activity */}
      <div style={styles.activityGrid}>
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>👥 Recent Users</h2>
          {recentUsers.length === 0 ? (
            <p>No recent users</p>
          ) : (
            <ul style={styles.activityList}>
              {recentUsers.map((user) => (
                <li key={user.id} style={styles.activityItem}>
                  <span>{user.name}</span>
                  <span>{new Date(user.created_at).toLocaleDateString()}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>💸 Recent Transactions</h2>
          {recentTransactions.length === 0 ? (
            <p>No recent transactions</p>
          ) : (
            <ul style={styles.activityList}>
              {recentTransactions.map((tx) => (
                <li key={tx.id} style={styles.activityItem}>
                  <span>{tx.type} - ${tx.amount.toLocaleString()}</span>
                  <span>{tx.status}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Admin Navigation */}
      <div style={styles.adminGrid}>
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>👥 User Management</h2>
          <div style={styles.buttonGrid}>
            <Link href="/admin/admin-users" style={styles.adminButton}>
              👤 Manage Users
            </Link>
            <Link href="/admin/create-user" style={styles.adminButton}>
              ➕ Create User
            </Link>
            <Link href="/admin/delete-user" style={styles.adminButton}>
              🗑️ Delete User
            </Link>
            <Link href="/admin/admin-roles" style={styles.adminButton}>
              🔐 User Roles
            </Link>
          </div>
        </div>

        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>💰 Financial Management</h2>
          <div style={styles.buttonGrid}>
            <Link href="/admin/admin-balance" style={styles.adminButton}>
              💳 Balance Management
            </Link>
            <Link href="/admin/admin-transactions" style={styles.adminButton}>
              📊 All Transactions
            </Link>
            <Link href="/admin/manual-transactions" style={styles.adminButton}>
              ✍️ Manual Transactions
            </Link>
            <Link href="/admin/bulk-transactions" style={styles.adminButton}>
              📦 Bulk Transactions
            </Link>
          </div>
        </div>

        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>🏦 Banking Operations</h2>
          <div style={styles.buttonGrid}>
            <Link href="/admin/admin-loans" style={styles.adminButton}>
              🏠 Loan Management
            </Link>
            <Link href="/admin/admin-crypto" style={styles.adminButton}>
              ₿ Crypto Operations
            </Link>
            <Link href="/admin/admin-investments" style={styles.adminButton}>
              📈 Investment Management
            </Link>
            <Link href="/admin/admin-approvals" style={styles.adminButton}>
              ✅ Approvals Queue
            </Link>
          </div>
        </div>

        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>📋 Reports & Compliance</h2>
          <div style={styles.buttonGrid}>
            <Link href="/admin/admin-reports" style={styles.adminButton}>
              📊 Financial Reports
            </Link>
            <Link href="/admin/admin-audit" style={styles.adminButton}>
              🔍 Audit Logs
            </Link>
            <Link href="/admin/admin-logs" style={styles.adminButton}>
              📝 System Logs
            </Link>
            <Link href="/admin/admin-notifications" style={styles.adminButton}>
              🔔 Send Notifications
            </Link>
          </div>
        </div>

        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>⚙️ System Settings</h2>
          <div style={styles.buttonGrid}>
            <Link href="/admin/admin-settings" style={styles.adminButton}>
              ⚙️ System Settings
            </Link>
            <Link href="/admin/resend-enrollment" style={styles.adminButton}>
              📧 Resend Enrollment
            </Link>
          </div>
        </div>
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
    background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
    padding: '20px'
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
    background: 'white',
    padding: '25px',
    borderRadius: '12px',
    textAlign: 'center',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
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
  }
};