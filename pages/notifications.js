
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import Header from '../components/Header';
import Head from 'next/head';

export default function Notifications() {
  const [user, setUser] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [settings, setSettings] = useState({
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    transactionAlerts: true,
    securityAlerts: true,
    promotionalOffers: false
  });

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUser(session.user);
        await fetchNotifications(session.user.id);
      }
    } catch (error) {
      console.error('Error checking user:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchNotifications = async (userId) => {
    try {
      // First get user profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      // Get user accounts with proper query
      const { data: accounts } = await supabase
        .from('accounts')
        .select('*')
        .eq('application_id', profile?.application_id)
        .eq('status', 'active');

      // Get recent transactions for notifications
      const { data: transactions } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(10);

      let realNotifications = [];

      // Create notifications from real transactions
      if (transactions && transactions.length > 0) {
        transactions.forEach((transaction, index) => {
          realNotifications.push({
            id: `trans_${transaction.id}`,
            title: `${transaction.type === 'credit' ? 'Deposit' : 'Transaction'} Alert`,
            message: `${transaction.type === 'credit' ? 'A deposit of' : 'A transaction of'} $${Math.abs(transaction.amount).toFixed(2)} was ${transaction.type === 'credit' ? 'added to' : 'processed on'} your account${transaction.description ? `: ${transaction.description}` : '.'}`,
            type: 'transaction',
            timestamp: transaction.created_at,
            read: index > 2,
            icon: transaction.type === 'credit' ? '💰' : '💳',
            priority: 'normal'
          });
        });
      }

      // Add account-related notifications
      if (accounts && accounts.length > 0) {
        accounts.forEach((account) => {
          realNotifications.push({
            id: `account_${account.id}`,
            title: 'Account Update',
            message: `Your ${account.account_type.replace('_', ' ')} account (****${account.account_number.slice(-4)}) is active with a balance of $${parseFloat(account.balance || 0).toFixed(2)}.`,
            type: 'account',
            timestamp: account.created_at,
            read: true,
            icon: '🏦',
            priority: 'low'
          });
        });
      }

      // Add welcome notification if no other notifications exist
      if (realNotifications.length === 0) {
        realNotifications = [
          {
            id: 'welcome',
            title: 'Welcome to Oakline Bank',
            message: 'Thank you for joining Oakline Bank. Your account setup is complete and ready to use.',
            type: 'system',
            timestamp: new Date().toISOString(),
            read: false,
            icon: '🎉',
            priority: 'high'
          },
          {
            id: 'security_setup',
            title: 'Secure Your Account',
            message: 'Set up two-factor authentication to enhance your account security.',
            type: 'security',
            timestamp: new Date(Date.now() - 3600000).toISOString(),
            read: false,
            icon: '🔐',
            priority: 'high'
          }
        ];
      }

      realNotifications.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
      setNotifications(realNotifications);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      setNotifications([{
        id: 'error_fallback',
        title: 'Welcome to Oakline Bank',
        message: 'Your notifications will appear here once you start using your account.',
        type: 'system',
        timestamp: new Date().toISOString(),
        read: false,
        icon: '📱',
        priority: 'normal'
      }]);
    }
  };

  const handleMarkAsRead = async (notificationId) => {
    setNotifications(notifications.map(notif => 
      notif.id === notificationId ? { ...notif, read: true } : notif
    ));
  };

  const handleMarkAllAsRead = () => {
    setNotifications(notifications.map(notif => ({ ...notif, read: true })));
  };

  const handleDeleteNotification = (notificationId) => {
    setNotifications(notifications.filter(notif => notif.id !== notificationId));
  };

  const handleSettingChange = (setting) => {
    setSettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
  };

  const filteredNotifications = notifications.filter(notif => {
    if (filter === 'unread') return !notif.read;
    if (filter === 'all') return true;
    return notif.type === filter;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.spinner}></div>
        <p style={styles.loadingText}>Loading notifications...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div style={styles.container}>
        <Header />
        <div style={styles.content}>
          <div style={styles.loginPrompt}>
            <h1 style={styles.loginTitle}>Access Required</h1>
            <p style={styles.loginMessage}>Please log in to view your notifications</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Notifications - Oakline Bank</title>
        <meta name="description" content="View and manage your banking notifications" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no" />
      </Head>

      <div style={styles.container}>
        <Header />
        
        <main style={styles.main}>
          <div style={styles.header}>
            <div style={styles.titleSection}>
              <h1 style={styles.title}>Notifications</h1>
              {unreadCount > 0 && (
                <span style={styles.unreadBadge}>{unreadCount}</span>
              )}
            </div>
            {unreadCount > 0 && (
              <button onClick={handleMarkAllAsRead} style={styles.markAllButton}>
                Mark All Read
              </button>
            )}
          </div>

          <div style={styles.content}>
            <div style={styles.sidebar}>
              <div style={styles.filterSection}>
                <h3 style={styles.sectionTitle}>Filters</h3>
                <div style={styles.filterOptions}>
                  {[
                    { key: 'all', label: 'All', count: notifications.length },
                    { key: 'unread', label: 'Unread', count: unreadCount },
                    { key: 'transaction', label: 'Transactions', count: notifications.filter(n => n.type === 'transaction').length },
                    { key: 'security', label: 'Security', count: notifications.filter(n => n.type === 'security').length },
                    { key: 'system', label: 'System', count: notifications.filter(n => n.type === 'system').length }
                  ].map(option => (
                    <button
                      key={option.key}
                      onClick={() => setFilter(option.key)}
                      style={{
                        ...styles.filterButton,
                        ...(filter === option.key ? styles.activeFilter : {})
                      }}
                    >
                      {option.label}
                      <span style={styles.filterCount}>({option.count})</span>
                    </button>
                  ))}
                </div>
              </div>

              <div style={styles.settingsSection}>
                <h3 style={styles.sectionTitle}>Preferences</h3>
                <div style={styles.settingsList}>
                  {Object.entries(settings).map(([key, value]) => (
                    <label key={key} style={styles.settingItem}>
                      <input
                        type="checkbox"
                        checked={value}
                        onChange={() => handleSettingChange(key)}
                        style={styles.checkbox}
                      />
                      <span style={styles.settingLabel}>
                        {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div style={styles.notificationsList}>
              {filteredNotifications.length > 0 ? (
                filteredNotifications.map((notification) => (
                  <div 
                    key={notification.id} 
                    style={{
                      ...styles.notificationItem,
                      ...(notification.read ? {} : styles.unreadNotification)
                    }}
                  >
                    <div style={styles.notificationIcon}>
                      {notification.icon}
                    </div>
                    <div style={styles.notificationContent}>
                      <div style={styles.notificationHeader}>
                        <h4 style={styles.notificationTitle}>{notification.title}</h4>
                        <div style={styles.notificationActions}>
                          <span style={styles.timestamp}>
                            {new Date(notification.timestamp).toLocaleString()}
                          </span>
                          {!notification.read && (
                            <button 
                              onClick={() => handleMarkAsRead(notification.id)}
                              style={styles.markReadButton}
                            >
                              Mark Read
                            </button>
                          )}
                          <button 
                            onClick={() => handleDeleteNotification(notification.id)}
                            style={styles.deleteButton}
                          >
                            ×
                          </button>
                        </div>
                      </div>
                      <p style={styles.notificationMessage}>{notification.message}</p>
                      <div style={styles.notificationMeta}>
                        <span style={styles.notificationType}>
                          {notification.type.charAt(0).toUpperCase() + notification.type.slice(1)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div style={styles.emptyState}>
                  <div style={styles.emptyIcon}>📱</div>
                  <h3 style={styles.emptyTitle}>All Caught Up!</h3>
                  <p style={styles.emptyMessage}>You have no {filter === 'all' ? '' : filter} notifications at this time.</p>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#f8fafc',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
  },
  main: {
    maxWidth: '100%',
    margin: '0 auto',
    padding: '0.5rem'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1rem',
    flexWrap: 'wrap',
    gap: '0.5rem',
    padding: '0 0.5rem'
  },
  titleSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem'
  },
  title: {
    fontSize: 'clamp(1.25rem, 5vw, 2rem)',
    color: '#1e293b',
    margin: 0,
    fontWeight: '700'
  },
  unreadBadge: {
    backgroundColor: '#dc2626',
    color: 'white',
    padding: '0.25rem 0.5rem',
    borderRadius: '12px',
    fontSize: '0.75rem',
    fontWeight: '600',
    minWidth: '20px',
    textAlign: 'center'
  },
  markAllButton: {
    backgroundColor: '#1e40af',
    color: 'white',
    border: 'none',
    padding: '0.5rem 0.75rem',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '0.8rem',
    fontWeight: '500'
  },
  content: {
    display: 'block'
  },
  sidebar: {
    display: 'flex',
    flexDirection: 'row',
    gap: '0.75rem',
    marginBottom: '1rem',
    overflowX: 'auto',
    padding: '0 0.5rem'
  },
  filterSection: {
    backgroundColor: 'white',
    padding: '1rem',
    borderRadius: '12px',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    border: '1px solid #e2e8f0',
    minWidth: '250px',
    flexShrink: 0
  },
  settingsSection: {
    backgroundColor: 'white',
    padding: '1rem',
    borderRadius: '12px',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    border: '1px solid #e2e8f0',
    minWidth: '250px',
    flexShrink: 0
  },
  sectionTitle: {
    color: '#1e293b',
    marginBottom: '0.75rem',
    fontSize: '0.9rem',
    fontWeight: '600',
    margin: '0 0 0.75rem 0'
  },
  filterOptions: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem'
  },
  filterButton: {
    padding: '0.5rem',
    background: 'none',
    border: '1px solid #e2e8f0',
    borderRadius: '6px',
    cursor: 'pointer',
    textAlign: 'left',
    fontSize: '0.8rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  activeFilter: {
    backgroundColor: '#1e40af',
    color: 'white',
    borderColor: '#1e40af'
  },
  filterCount: {
    fontSize: '0.7rem',
    opacity: 0.7
  },
  settingsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem'
  },
  settingItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    cursor: 'pointer',
    fontSize: '0.8rem'
  },
  checkbox: {
    accentColor: '#1e40af',
    width: '14px',
    height: '14px'
  },
  settingLabel: {
    color: '#374151',
    fontSize: '0.8rem'
  },
  notificationsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
    padding: '0 0.5rem'
  },
  notificationItem: {
    backgroundColor: 'white',
    padding: '1rem',
    borderRadius: '12px',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    border: '1px solid #e2e8f0',
    display: 'flex',
    gap: '0.75rem'
  },
  unreadNotification: {
    borderLeft: '4px solid #dc2626',
    backgroundColor: '#fefefe'
  },
  notificationIcon: {
    fontSize: '1.2rem',
    flexShrink: 0,
    width: '32px',
    height: '32px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f1f5f9',
    borderRadius: '50%'
  },
  notificationContent: {
    flex: 1,
    minWidth: 0
  },
  notificationHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '0.5rem',
    flexWrap: 'wrap',
    gap: '0.5rem'
  },
  notificationTitle: {
    margin: 0,
    color: '#1e293b',
    fontSize: '0.9rem',
    fontWeight: '600',
    lineHeight: '1.3'
  },
  notificationActions: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    flexWrap: 'wrap'
  },
  timestamp: {
    color: '#64748b',
    fontSize: '0.7rem',
    whiteSpace: 'nowrap'
  },
  markReadButton: {
    backgroundColor: '#f59e0b',
    color: 'white',
    border: 'none',
    padding: '0.2rem 0.4rem',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '0.7rem',
    fontWeight: '500'
  },
  deleteButton: {
    background: 'none',
    border: 'none',
    color: '#64748b',
    cursor: 'pointer',
    fontSize: '1rem',
    padding: '0.2rem',
    borderRadius: '4px'
  },
  notificationMessage: {
    margin: '0 0 0.5rem 0',
    color: '#374151',
    lineHeight: '1.4',
    fontSize: '0.8rem'
  },
  notificationMeta: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  notificationType: {
    backgroundColor: '#f1f5f9',
    color: '#475569',
    padding: '0.2rem 0.4rem',
    borderRadius: '4px',
    fontSize: '0.7rem',
    fontWeight: '500'
  },
  emptyState: {
    textAlign: 'center',
    padding: '2rem 1rem',
    color: '#64748b'
  },
  emptyIcon: {
    fontSize: '2.5rem',
    marginBottom: '1rem'
  },
  emptyTitle: {
    fontSize: '1.1rem',
    fontWeight: '600',
    color: '#1e293b',
    margin: '0 0 0.5rem 0'
  },
  emptyMessage: {
    margin: 0,
    fontSize: '0.9rem'
  },
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    backgroundColor: '#f8fafc'
  },
  spinner: {
    width: '32px',
    height: '32px',
    border: '3px solid #e2e8f0',
    borderTop: '3px solid #1e40af',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite'
  },
  loadingText: {
    marginTop: '1rem',
    color: '#64748b',
    fontSize: '1rem'
  },
  loginPrompt: {
    textAlign: 'center',
    padding: '2rem 1rem',
    backgroundColor: 'white',
    borderRadius: '12px',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    margin: '2rem auto',
    maxWidth: '400px'
  },
  loginTitle: {
    fontSize: '1.3rem',
    fontWeight: '600',
    color: '#1e293b',
    margin: '0 0 0.5rem 0'
  },
  loginMessage: {
    color: '#64748b',
    margin: 0,
    fontSize: '0.9rem'
  }
};
