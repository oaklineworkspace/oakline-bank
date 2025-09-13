
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
      // Mock notifications data - replace with actual Supabase query when notifications table exists
      const mockNotifications = [
        {
          id: 1,
          title: 'Transaction Alert',
          message: 'A withdrawal of $200.00 was made from your checking account.',
          type: 'transaction',
          timestamp: new Date().toISOString(),
          read: false,
          icon: '💳'
        },
        {
          id: 2,
          title: 'Security Alert',
          message: 'Login detected from new device. If this wasn\'t you, please secure your account.',
          type: 'security',
          timestamp: new Date(Date.now() - 3600000).toISOString(),
          read: false,
          icon: '🔒'
        },
        {
          id: 3,
          title: 'Statement Ready',
          message: 'Your monthly statement for December is now available.',
          type: 'statement',
          timestamp: new Date(Date.now() - 86400000).toISOString(),
          read: true,
          icon: '📄'
        },
        {
          id: 4,
          title: 'Special Offer',
          message: 'Get 0.5% APY boost on your savings account for 6 months!',
          type: 'promotional',
          timestamp: new Date(Date.now() - 172800000).toISOString(),
          read: true,
          icon: '🎉'
        },
        {
          id: 5,
          title: 'Payment Reminder',
          message: 'Your credit card payment is due in 3 days.',
          type: 'reminder',
          timestamp: new Date(Date.now() - 259200000).toISOString(),
          read: false,
          icon: '⏰'
        }
      ];
      setNotifications(mockNotifications);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const handleMarkAsRead = (notificationId) => {
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
        <p>Loading notifications...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div style={styles.container}>
        <Header />
        <div style={styles.content}>
          <h1>Please log in to view notifications</h1>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Notifications - Oakline Bank</title>
        <meta name="description" content="View and manage your banking notifications" />
      </Head>

      <div style={styles.container}>
        <Header />
        
        <main style={styles.main}>
          <div style={styles.header}>
            <div>
              <h1 style={styles.title}>Notifications</h1>
              {unreadCount > 0 && (
                <span style={styles.unreadBadge}>{unreadCount} unread</span>
              )}
            </div>
            <div style={styles.headerActions}>
              {unreadCount > 0 && (
                <button onClick={handleMarkAllAsRead} style={styles.markAllButton}>
                  Mark All as Read
                </button>
              )}
            </div>
          </div>

          <div style={styles.content}>
            <div style={styles.sidebar}>
              <div style={styles.filterSection}>
                <h3 style={styles.sectionTitle}>Filter</h3>
                <div style={styles.filterOptions}>
                  {[
                    { key: 'all', label: 'All Notifications', count: notifications.length },
                    { key: 'unread', label: 'Unread', count: unreadCount },
                    { key: 'transaction', label: 'Transactions', count: notifications.filter(n => n.type === 'transaction').length },
                    { key: 'security', label: 'Security', count: notifications.filter(n => n.type === 'security').length },
                    { key: 'statement', label: 'Statements', count: notifications.filter(n => n.type === 'statement').length }
                  ].map(option => (
                    <button
                      key={option.key}
                      onClick={() => setFilter(option.key)}
                      style={{
                        ...styles.filterButton,
                        ...(filter === option.key ? styles.activeFilter : {})
                      }}
                    >
                      {option.label} ({option.count})
                    </button>
                  ))}
                </div>
              </div>

              <div style={styles.settingsSection}>
                <h3 style={styles.sectionTitle}>Notification Settings</h3>
                <div style={styles.settingsList}>
                  {Object.entries(settings).map(([key, value]) => (
                    <label key={key} style={styles.settingItem}>
                      <input
                        type="checkbox"
                        checked={value}
                        onChange={() => handleSettingChange(key)}
                        style={styles.checkbox}
                      />
                      {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
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
                              Mark as Read
                            </button>
                          )}
                          <button 
                            onClick={() => handleDeleteNotification(notification.id)}
                            style={styles.deleteButton}
                          >
                            ✕
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
                  <h3>No notifications found</h3>
                  <p>You're all caught up! Check back later for updates.</p>
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
    backgroundColor: '#F5F6F8'
  },
  main: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '2rem'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '2rem'
  },
  title: {
    fontSize: '2rem',
    color: '#1A3E6F',
    margin: 0,
    marginRight: '1rem'
  },
  unreadBadge: {
    backgroundColor: '#FFC857',
    color: '#1A3E6F',
    padding: '0.3rem 0.7rem',
    borderRadius: '20px',
    fontSize: '0.8rem',
    fontWeight: 'bold'
  },
  headerActions: {
    display: 'flex',
    gap: '1rem'
  },
  markAllButton: {
    backgroundColor: '#1A3E6F',
    color: 'white',
    border: 'none',
    padding: '0.75rem 1.5rem',
    borderRadius: '8px',
    cursor: 'pointer'
  },
  content: {
    display: 'grid',
    gridTemplateColumns: '300px 1fr',
    gap: '2rem'
  },
  sidebar: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2rem'
  },
  filterSection: {
    backgroundColor: 'white',
    padding: '1.5rem',
    borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
  },
  settingsSection: {
    backgroundColor: 'white',
    padding: '1.5rem',
    borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
  },
  sectionTitle: {
    color: '#1A3E6F',
    marginBottom: '1rem',
    fontSize: '1.1rem'
  },
  filterOptions: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem'
  },
  filterButton: {
    padding: '0.75rem',
    background: 'none',
    border: '1px solid #ddd',
    borderRadius: '8px',
    cursor: 'pointer',
    textAlign: 'left',
    transition: 'all 0.2s'
  },
  activeFilter: {
    backgroundColor: '#1A3E6F',
    color: 'white',
    borderColor: '#1A3E6F'
  },
  settingsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem'
  },
  settingItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    cursor: 'pointer'
  },
  checkbox: {
    accentColor: '#1A3E6F'
  },
  notificationsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem'
  },
  notificationItem: {
    backgroundColor: 'white',
    padding: '1.5rem',
    borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    display: 'flex',
    gap: '1rem'
  },
  unreadNotification: {
    borderLeft: '4px solid #FFC857'
  },
  notificationIcon: {
    fontSize: '2rem',
    flexShrink: 0
  },
  notificationContent: {
    flex: 1
  },
  notificationHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '0.5rem'
  },
  notificationTitle: {
    margin: 0,
    color: '#1A3E6F',
    fontSize: '1.1rem'
  },
  notificationActions: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem'
  },
  timestamp: {
    color: '#7A7A7A',
    fontSize: '0.8rem'
  },
  markReadButton: {
    backgroundColor: '#FFC857',
    color: '#1A3E6F',
    border: 'none',
    padding: '0.3rem 0.7rem',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '0.8rem'
  },
  deleteButton: {
    background: 'none',
    border: 'none',
    color: '#7A7A7A',
    cursor: 'pointer',
    fontSize: '1.2rem',
    padding: '0.2rem'
  },
  notificationMessage: {
    margin: '0 0 0.5rem 0',
    color: '#1E1E1E',
    lineHeight: '1.5'
  },
  notificationMeta: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  notificationType: {
    backgroundColor: '#F5F6F8',
    color: '#4A4A4A',
    padding: '0.2rem 0.5rem',
    borderRadius: '4px',
    fontSize: '0.8rem'
  },
  emptyState: {
    textAlign: 'center',
    padding: '3rem',
    color: '#7A7A7A'
  },
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    backgroundColor: '#F5F6F8'
  },
  spinner: {
    width: '40px',
    height: '40px',
    border: '4px solid #f3f3f3',
    borderTop: '4px solid #1A3E6F',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    marginBottom: '1rem'
  }
};
