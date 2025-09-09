
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalAccounts: 0,
    totalTransactions: 0,
    totalBalance: 0
  });
  const router = useRouter();

  const ADMIN_PASSWORD = 'Chrismorgan23$';

  useEffect(() => {
    const adminAuth = localStorage.getItem('adminAuthenticated');
    if (adminAuth === 'true') {
      setIsAuthenticated(true);
      fetchStats();
    }
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      localStorage.setItem('adminAuthenticated', 'true');
      setError('');
      fetchStats();
    } else {
      setError('Invalid password');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('adminAuthenticated');
    setPassword('');
  };

  const fetchStats = async () => {
    // Fetch dashboard statistics
    try {
      // This would fetch real stats from your API
      setStats({
        totalUsers: 156,
        totalAccounts: 234,
        totalTransactions: 1847,
        totalBalance: 2450000.00
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
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
        <h1 style={styles.title}>🏦 Oakline Bank Admin Dashboard</h1>
        <button onClick={handleLogout} style={styles.logoutButton}>
          🚪 Logout
        </button>
      </div>

      {/* Statistics Cards */}
      <div style={styles.statsGrid}>
        <div style={styles.statCard}>
          <h3>👥 Total Users</h3>
          <p style={styles.statNumber}>{stats.totalUsers}</p>
        </div>
        <div style={styles.statCard}>
          <h3>🏦 Total Accounts</h3>
          <p style={styles.statNumber}>{stats.totalAccounts}</p>
        </div>
        <div style={styles.statCard}>
          <h3>💸 Transactions</h3>
          <p style={styles.statNumber}>{stats.totalTransactions.toLocaleString()}</p>
        </div>
        <div style={styles.statCard}>
          <h3>💰 Total Balance</h3>
          <p style={styles.statNumber}>${stats.totalBalance.toLocaleString()}</p>
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
              📊 Transactions
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
              ✅ Approvals
            </Link>
          </div>
        </div>

        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>📋 Reports & Compliance</h2>
          <div style={styles.buttonGrid}>
            <Link href="/admin/admin-reports" style={styles.adminButton}>
              📊 Reports
            </Link>
            <Link href="/admin/admin-audit" style={styles.adminButton}>
              🔍 Audit Logs
            </Link>
            <Link href="/admin/admin-logs" style={styles.adminButton}>
              📝 System Logs
            </Link>
            <Link href="/admin/admin-notifications" style={styles.adminButton}>
              🔔 Notifications
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
  title: {
    fontSize: '28px',
    fontWeight: 'bold',
    color: '#1e3c72',
    margin: 0
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
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
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
  adminGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
    gap: '25px'
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
    transition: 'transform 0.2s',
    ':hover': {
      transform: 'translateY(-2px)'
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
