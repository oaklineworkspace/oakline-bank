// pages/dashboard.js
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useRouter } from 'next/router';

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    try {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      
      if (!authUser) {
        router.push('/login');
        return;
      }

      // Get user data from database
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('email', authUser.email)
        .single();

      if (userError) throw userError;

      setUser(userData);

      // Get user accounts
      const { data: accountsData, error: accountsError } = await supabase
        .from('accounts')
        .select('*')
        .eq('user_id', userData.id);

      if (accountsError) throw accountsError;

      setAccounts(accountsData || []);

      // Get notifications
      const { data: notificationsData } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userData.id)
        .order('created_at', { ascending: false })
        .limit(5);

      setNotifications(notificationsData || []);

    } catch (error) {
      console.error('Dashboard error:', error);
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  const isLimitedMode = accounts.some(acc => acc.status === 'limited');

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        fontFamily: 'Arial, sans-serif'
      }}>
        Loading your dashboard...
      </div>
    );
  }

  return (
    <div style={{ 
      fontFamily: 'Arial, sans-serif',
      backgroundColor: '#f8f9fa',
      minHeight: '100vh'
    }}>
      {/* Header */}
      <header style={{
        backgroundColor: '#0070f3',
        color: 'white',
        padding: '1rem 2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <h1 style={{ margin: 0, fontSize: '24px' }}>🏦 Oakline Bank</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <span>Welcome, {user?.first_name}!</span>
          <button 
            onClick={signOut}
            style={{
              background: 'rgba(255,255,255,0.2)',
              border: '1px solid white',
              color: 'white',
              padding: '8px 16px',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Sign Out
          </button>
        </div>
      </header>

      <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
        
        {/* Limited Mode Banner */}
        {isLimitedMode && (
          <div style={{
            backgroundColor: '#fff3cd',
            border: '1px solid #ffeaa7',
            color: '#856404',
            padding: '1rem',
            borderRadius: '8px',
            marginBottom: '2rem',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            <span style={{ fontSize: '24px' }}>🔒</span>
            <div>
              <strong>Limited Access Mode</strong>
              <p style={{ margin: '5px 0 0 0' }}>
                Your account verification is in progress. You can view your account details, but transactions are temporarily disabled. 
                This typically takes 1-2 business days.
              </p>
            </div>
          </div>
        )}

        {/* Account Overview */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '1.5rem',
          marginBottom: '2rem'
        }}>
          {accounts.map((account) => (
            <div key={account.id} style={{
              backgroundColor: 'white',
              padding: '1.5rem',
              borderRadius: '12px',
              boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
              border: account.status === 'limited' ? '2px solid #ffc107' : '2px solid #28a745'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h3 style={{ margin: 0, color: '#0070f3' }}>{account.account_type} Account</h3>
                <span style={{
                  padding: '4px 12px',
                  borderRadius: '20px',
                  fontSize: '12px',
                  fontWeight: 'bold',
                  backgroundColor: account.status === 'active' ? '#28a745' : '#ffc107',
                  color: 'white'
                }}>
                  {account.status.toUpperCase()}
                </span>
              </div>
              
              <div style={{ marginBottom: '1rem' }}>
                <p style={{ margin: '5px 0', fontSize: '14px', color: '#666' }}>
                  <strong>Account Number:</strong> {account.account_number}
                </p>
                <p style={{ margin: '5px 0', fontSize: '14px', color: '#666' }}>
                  <strong>Routing Number:</strong> {account.routing_number}
                </p>
              </div>

              <div style={{ 
                fontSize: '28px', 
                fontWeight: 'bold', 
                color: '#0070f3',
                marginBottom: '1rem'
              }}>
                ${parseFloat(account.balance).toFixed(2)}
              </div>

              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                <button style={{
                  padding: '8px 16px',
                  backgroundColor: account.status === 'active' ? '#0070f3' : '#6c757d',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: account.status === 'active' ? 'pointer' : 'not-allowed',
                  fontSize: '14px'
                }}
                disabled={account.status === 'limited'}
                >
                  Transfer
                </button>
                <button style={{
                  padding: '8px 16px',
                  backgroundColor: account.status === 'active' ? '#28a745' : '#6c757d',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: account.status === 'active' ? 'pointer' : 'not-allowed',
                  fontSize: '14px'
                }}
                disabled={account.status === 'limited'}
                >
                  Deposit
                </button>
                <button style={{
                  padding: '8px 16px',
                  backgroundColor: '#17a2b8',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}>
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div style={{
          backgroundColor: 'white',
          padding: '1.5rem',
          borderRadius: '12px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
          marginBottom: '2rem'
        }}>
          <h3 style={{ marginTop: 0, color: '#0070f3' }}>Quick Actions</h3>
          <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
            <button style={{
              padding: '12px 20px',
              backgroundColor: isLimitedMode ? '#6c757d' : '#0070f3',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: isLimitedMode ? 'not-allowed' : 'pointer',
              fontSize: '14px'
            }}
            disabled={isLimitedMode}
            >
              💸 Send Money
            </button>
            <button style={{
              padding: '12px 20px',
              backgroundColor: isLimitedMode ? '#6c757d' : '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: isLimitedMode ? 'not-allowed' : 'pointer',
              fontSize: '14px'
            }}
            disabled={isLimitedMode}
            >
              💰 Deposit Check
            </button>
            <button style={{
              padding: '12px 20px',
              backgroundColor: '#17a2b8',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '14px'
            }}>
              📄 Statements
            </button>
            <button style={{
              padding: '12px 20px',
              backgroundColor: '#6f42c1',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '14px'
            }}>
              ⚙️ Settings
            </button>
          </div>
        </div>

        {/* Notifications */}
        {notifications.length > 0 && (
          <div style={{
            backgroundColor: 'white',
            padding: '1.5rem',
            borderRadius: '12px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
          }}>
            <h3 style={{ marginTop: 0, color: '#0070f3' }}>Recent Notifications</h3>
            {notifications.map((notification) => (
              <div key={notification.id} style={{
                padding: '12px',
                backgroundColor: notification.read ? '#f8f9fa' : '#e3f2fd',
                borderRadius: '8px',
                marginBottom: '10px',
                borderLeft: `4px solid ${notification.read ? '#dee2e6' : '#0070f3'}`
              }}>
                <h5 style={{ margin: '0 0 5px 0' }}>{notification.title}</h5>
                <p style={{ margin: '0', fontSize: '14px', color: '#666' }}>{notification.message}</p>
                <small style={{ color: '#999' }}>
                  {new Date(notification.created_at).toLocaleDateString()}
                </small>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
