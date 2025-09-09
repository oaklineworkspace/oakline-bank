import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

export default function AdminUsers() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const adminAuth = localStorage.getItem('adminAuthenticated');
    if (adminAuth === 'true') {
      setIsAuthenticated(true);
      fetchUsers();
    } else {
      router.push('/admin/admin-dashboard');
    }
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      // Mock user data - replace with actual API call
      setUsers([
        { id: 1, name: 'John Doe', email: 'john@example.com', accounts: 2, balance: 15000, status: 'Active' },
        { id: 2, name: 'Jane Smith', email: 'jane@example.com', accounts: 3, balance: 25000, status: 'Active' },
        { id: 3, name: 'Bob Johnson', email: 'bob@example.com', accounts: 1, balance: 5000, status: 'Suspended' }
      ]);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return <div>Redirecting to admin login...</div>;
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>👥 User Management</h1>
        <Link href="/admin/admin-dashboard" style={styles.backButton}>
          ← Back to Dashboard
        </Link>
      </div>

      <div style={styles.actionsBar}>
        <Link href="/admin/create-user" style={styles.actionButton}>
          ➕ Create New User
        </Link>
        <Link href="/admin/bulk-transactions" style={styles.actionButton}>
          📦 Bulk Operations
        </Link>
      </div>

      <div style={styles.usersTable}>
        <h2 style={styles.sectionTitle}>All Users</h2>
        {loading ? (
          <div style={styles.loading}>Loading users...</div>
        ) : (
          <div style={styles.tableContainer}>
            <table style={styles.table}>
              <thead>
                <tr style={styles.tableHeader}>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Accounts</th>
                  <th>Total Balance</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} style={styles.tableRow}>
                    <td style={styles.tableCell}>{user.name}</td>
                    <td style={styles.tableCell}>{user.email}</td>
                    <td style={styles.tableCell}>{user.accounts}</td>
                    <td style={styles.tableCell}>${user.balance.toLocaleString()}</td>
                    <td style={styles.tableCell}>
                      <span style={user.status === 'Active' ? styles.activeStatus : styles.suspendedStatus}>
                        {user.status}
                      </span>
                    </td>
                    <td style={styles.tableCell}>
                      <div style={styles.actionButtons}>
                        <button style={styles.editButton}>Edit</button>
                        <button style={styles.viewButton}>View</button>
                        <button style={styles.deleteButton}>Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
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
  backButton: {
    background: '#6c757d',
    color: 'white',
    padding: '10px 20px',
    borderRadius: '8px',
    textDecoration: 'none',
    fontSize: '14px',
    fontWeight: '500'
  },
  actionsBar: {
    display: 'flex',
    gap: '15px',
    marginBottom: '30px',
    flexWrap: 'wrap'
  },
  actionButton: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    padding: '12px 24px',
    borderRadius: '8px',
    textDecoration: 'none',
    fontSize: '14px',
    fontWeight: '500'
  },
  usersTable: {
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
  loading: {
    textAlign: 'center',
    padding: '40px',
    color: '#666'
  },
  tableContainer: {
    overflowX: 'auto'
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse'
  },
  tableHeader: {
    background: '#f8f9fa',
    fontWeight: 'bold',
    color: '#333'
  },
  tableRow: {
    borderBottom: '1px solid #dee2e6'
  },
  tableCell: {
    padding: '12px',
    textAlign: 'left',
    fontSize: '14px'
  },
  activeStatus: {
    background: '#d4edda',
    color: '#155724',
    padding: '4px 8px',
    borderRadius: '4px',
    fontSize: '12px',
    fontWeight: '500'
  },
  suspendedStatus: {
    background: '#f8d7da',
    color: '#721c24',
    padding: '4px 8px',
    borderRadius: '4px',
    fontSize: '12px',
    fontWeight: '500'
  },
  actionButtons: {
    display: 'flex',
    gap: '8px'
  },
  editButton: {
    background: '#28a745',
    color: 'white',
    border: 'none',
    padding: '6px 12px',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '12px'
  },
  viewButton: {
    background: '#17a2b8',
    color: 'white',
    border: 'none',
    padding: '6px 12px',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '12px'
  },
  deleteButton: {
    background: '#dc3545',
    color: 'white',
    border: 'none',
    padding: '6px 12px',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '12px'
  }
};