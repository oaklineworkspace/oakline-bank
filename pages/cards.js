
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { supabase } from '../lib/supabaseClient';
import DebitCard from '../components/DebitCard';

export default function Cards() {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [cards, setCards] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('cards');
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
      await fetchUserData(user);
    } catch (error) {
      console.error('Error checking user:', error);
      router.push('/login');
    } finally {
      setLoading(false);
    }
  };

  const fetchUserData = async (user) => {
    try {
      // Fetch user profile
      const { data: profile } = await supabase
        .from('applications')
        .select('*')
        .eq('email', user.email)
        .single();

      if (profile) setUserProfile(profile);

      // Fetch user accounts
      const { data: accountsData } = await supabase
        .from('accounts')
        .select('*')
        .eq('user_id', user.id);

      setAccounts(accountsData || []);

      // Fetch cards and applications
      await fetchCardsData();
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const fetchCardsData = async () => {
    try {
      const response = await fetch('/api/get-user-cards');
      const data = await response.json();
      
      if (data.success) {
        setCards(data.cards || []);
        setApplications(data.applications || []);
      }
    } catch (error) {
      console.error('Error fetching cards data:', error);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved':
      case 'active':
        return '#10b981';
      case 'pending':
        return '#f59e0b';
      case 'rejected':
        return '#ef4444';
      default:
        return '#6b7280';
    }
  };

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.loading}>Loading your cards...</div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Header */}
      <header style={styles.header}>
        <div style={styles.headerContent}>
          <Link href="/dashboard" style={styles.backButton}>
            ← Back to Dashboard
          </Link>
          <h1 style={styles.title}>My Cards</h1>
          <div style={styles.headerActions}>
            <Link href="/main-menu" style={styles.menuButton}>
              Menu
            </Link>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav style={styles.tabNav}>
        <button
          style={activeTab === 'cards' ? {...styles.tab, ...styles.activeTab} : styles.tab}
          onClick={() => setActiveTab('cards')}
        >
          💳 My Cards
        </button>
        <button
          style={activeTab === 'applications' ? {...styles.tab, ...styles.activeTab} : styles.tab}
          onClick={() => setActiveTab('applications')}
        >
          📋 Applications
        </button>
        <button
          style={activeTab === 'apply' ? {...styles.tab, ...styles.activeTab} : styles.tab}
          onClick={() => setActiveTab('apply')}
        >
          ➕ Apply for Card
        </button>
      </nav>

      <main style={styles.main}>
        {/* My Cards Tab */}
        {activeTab === 'cards' && (
          <div style={styles.content}>
            <div style={styles.sectionHeader}>
              <h2 style={styles.sectionTitle}>Active Cards</h2>
              <p style={styles.sectionDesc}>Manage your active debit cards and their settings</p>
            </div>
            
            {cards.length > 0 ? (
              <div style={styles.cardsGrid}>
                {cards.map(card => (
                  <div key={card.id} style={styles.cardSection}>
                    <DebitCard
                      user={user}
                      userProfile={userProfile}
                      account={accounts.find(acc => acc.id === card.account_id)}
                      cardData={card}
                      showDetails={true}
                      showControls={true}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div style={styles.emptyState}>
                <div style={styles.emptyIcon}>💳</div>
                <h3 style={styles.emptyTitle}>No Cards Yet</h3>
                <p style={styles.emptyDesc}>
                  You don't have any active cards. Apply for a debit card to get started.
                </p>
                <button 
                  onClick={() => setActiveTab('apply')}
                  style={styles.emptyButton}
                >
                  Apply for Debit Card
                </button>
              </div>
            )}
          </div>
        )}

        {/* Applications Tab */}
        {activeTab === 'applications' && (
          <div style={styles.content}>
            <div style={styles.sectionHeader}>
              <h2 style={styles.sectionTitle}>Card Applications</h2>
              <p style={styles.sectionDesc}>Track the status of your card applications</p>
            </div>
            
            {applications.length > 0 ? (
              <div style={styles.applicationsList}>
                {applications.map(application => (
                  <div key={application.id} style={styles.applicationCard}>
                    <div style={styles.applicationHeader}>
                      <div style={styles.applicationInfo}>
                        <h3 style={styles.applicationTitle}>Debit Card Application</h3>
                        <p style={styles.applicationAccount}>
                          Account: {application.accounts?.account_type} - ****{application.accounts?.account_number?.slice(-4)}
                        </p>
                      </div>
                      <span style={{
                        ...styles.statusBadge,
                        backgroundColor: getStatusColor(application.status)
                      }}>
                        {application.status.toUpperCase()}
                      </span>
                    </div>
                    
                    <div style={styles.applicationDetails}>
                      <div style={styles.detailRow}>
                        <span style={styles.detailLabel}>Cardholder Name:</span>
                        <span style={styles.detailValue}>{application.cardholder_name}</span>
                      </div>
                      <div style={styles.detailRow}>
                        <span style={styles.detailLabel}>Applied Date:</span>
                        <span style={styles.detailValue}>{formatDate(application.applied_at)}</span>
                      </div>
                      {application.approved_at && (
                        <div style={styles.detailRow}>
                          <span style={styles.detailLabel}>Approved Date:</span>
                          <span style={styles.detailValue}>{formatDate(application.approved_at)}</span>
                        </div>
                      )}
                      {application.rejected_at && (
                        <div style={styles.detailRow}>
                          <span style={styles.detailLabel}>Rejected Date:</span>
                          <span style={styles.detailValue}>{formatDate(application.rejected_at)}</span>
                        </div>
                      )}
                    </div>

                    {application.status === 'approved' && application.card_number && (
                      <div style={styles.approvedCardInfo}>
                        <h4 style={styles.approvedTitle}>Your Card Details</h4>
                        <div style={styles.cardInfo}>
                          <div style={styles.cardNumber}>
                            Card Number: ****{application.card_number.slice(-4)}
                          </div>
                          <div style={styles.cardExpiry}>
                            Expires: {application.expiry_date}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div style={styles.emptyState}>
                <div style={styles.emptyIcon}>📋</div>
                <h3 style={styles.emptyTitle}>No Applications</h3>
                <p style={styles.emptyDesc}>
                  You haven't submitted any card applications yet.
                </p>
                <button 
                  onClick={() => setActiveTab('apply')}
                  style={styles.emptyButton}
                >
                  Apply for Debit Card
                </button>
              </div>
            )}
          </div>
        )}

        {/* Apply for Card Tab */}
        {activeTab === 'apply' && (
          <div style={styles.content}>
            <div style={styles.sectionHeader}>
              <h2 style={styles.sectionTitle}>Apply for Debit Card</h2>
              <p style={styles.sectionDesc}>Choose an account to link your new debit card</p>
            </div>
            
            {accounts.length > 0 ? (
              <div style={styles.accountsGrid}>
                {accounts.map(account => (
                  <div key={account.id} style={styles.accountCard}>
                    <DebitCard
                      user={user}
                      userProfile={userProfile}
                      account={account}
                      showDetails={true}
                      showControls={true}
                      onApplyCard={fetchCardsData}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div style={styles.emptyState}>
                <div style={styles.emptyIcon}>🏦</div>
                <h3 style={styles.emptyTitle}>No Accounts Found</h3>
                <p style={styles.emptyDesc}>
                  You need to have an active account to apply for a debit card.
                </p>
                <Link href="/apply" style={styles.emptyButton}>
                  Open New Account
                </Link>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#f1f5f9',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
  },
  loadingContainer: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f1f5f9'
  },
  loading: {
    fontSize: '1.2rem',
    color: '#64748b'
  },
  header: {
    backgroundColor: '#1e40af',
    color: 'white',
    padding: '1rem 0',
    boxShadow: '0 4px 12px rgba(30, 64, 175, 0.2)'
  },
  headerContent: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 1rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '1rem'
  },
  backButton: {
    color: 'white',
    textDecoration: 'none',
    fontSize: '0.9rem',
    fontWeight: '500',
    padding: '0.5rem 1rem',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: '8px',
    transition: 'all 0.2s'
  },
  title: {
    fontSize: '1.8rem',
    fontWeight: 'bold',
    margin: 0
  },
  headerActions: {
    display: 'flex',
    gap: '0.5rem'
  },
  menuButton: {
    color: 'white',
    textDecoration: 'none',
    fontSize: '0.9rem',
    fontWeight: '500',
    padding: '0.5rem 1rem',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: '8px',
    transition: 'all 0.2s'
  },
  tabNav: {
    backgroundColor: 'white',
    borderBottom: '1px solid #e2e8f0',
    padding: '0 1rem',
    display: 'flex',
    gap: '0.5rem',
    overflowX: 'auto'
  },
  tab: {
    padding: '1rem 1.5rem',
    backgroundColor: 'transparent',
    border: 'none',
    borderBottom: '3px solid transparent',
    cursor: 'pointer',
    fontSize: '0.9rem',
    fontWeight: '600',
    color: '#64748b',
    transition: 'all 0.2s',
    whiteSpace: 'nowrap'
  },
  activeTab: {
    color: '#1e40af',
    borderBottomColor: '#1e40af'
  },
  main: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '2rem 1rem'
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2rem'
  },
  sectionHeader: {
    textAlign: 'center',
    marginBottom: '1rem'
  },
  sectionTitle: {
    fontSize: '1.8rem',
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: '0.5rem'
  },
  sectionDesc: {
    fontSize: '1rem',
    color: '#64748b',
    lineHeight: '1.6'
  },
  cardsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
    gap: '2rem'
  },
  cardSection: {
    backgroundColor: 'white',
    padding: '2rem',
    borderRadius: '16px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
    border: '1px solid #e2e8f0'
  },
  accountsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
    gap: '2rem'
  },
  accountCard: {
    backgroundColor: 'white',
    padding: '2rem',
    borderRadius: '16px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
    border: '1px solid #e2e8f0'
  },
  applicationsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem'
  },
  applicationCard: {
    backgroundColor: 'white',
    padding: '2rem',
    borderRadius: '16px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
    border: '1px solid #e2e8f0'
  },
  applicationHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '1.5rem',
    flexWrap: 'wrap',
    gap: '1rem'
  },
  applicationInfo: {
    flex: 1
  },
  applicationTitle: {
    fontSize: '1.2rem',
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: '0.5rem'
  },
  applicationAccount: {
    fontSize: '0.9rem',
    color: '#64748b',
    margin: 0
  },
  statusBadge: {
    padding: '0.5rem 1rem',
    borderRadius: '20px',
    color: 'white',
    fontSize: '0.8rem',
    fontWeight: 'bold',
    textAlign: 'center'
  },
  applicationDetails: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
    marginBottom: '1.5rem'
  },
  detailRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0.5rem 0',
    borderBottom: '1px solid #f1f5f9'
  },
  detailLabel: {
    fontSize: '0.9rem',
    fontWeight: '600',
    color: '#374151'
  },
  detailValue: {
    fontSize: '0.9rem',
    color: '#64748b'
  },
  approvedCardInfo: {
    backgroundColor: '#f0f9ff',
    padding: '1.5rem',
    borderRadius: '12px',
    border: '1px solid #bae6fd'
  },
  approvedTitle: {
    fontSize: '1rem',
    fontWeight: 'bold',
    color: '#0369a1',
    marginBottom: '1rem'
  },
  cardInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem'
  },
  cardNumber: {
    fontSize: '0.9rem',
    fontWeight: '600',
    color: '#374151',
    fontFamily: 'monospace'
  },
  cardExpiry: {
    fontSize: '0.9rem',
    fontWeight: '600',
    color: '#374151'
  },
  emptyState: {
    textAlign: 'center',
    padding: '4rem 2rem',
    backgroundColor: 'white',
    borderRadius: '16px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
    border: '1px solid #e2e8f0'
  },
  emptyIcon: {
    fontSize: '4rem',
    marginBottom: '1rem'
  },
  emptyTitle: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: '0.5rem'
  },
  emptyDesc: {
    fontSize: '1rem',
    color: '#64748b',
    lineHeight: '1.6',
    marginBottom: '2rem'
  },
  emptyButton: {
    display: 'inline-block',
    padding: '0.75rem 2rem',
    backgroundColor: '#1e40af',
    color: 'white',
    textDecoration: 'none',
    borderRadius: '10px',
    fontSize: '1rem',
    fontWeight: '600',
    border: 'none',
    cursor: 'pointer',
    transition: 'all 0.2s'
  }
};
