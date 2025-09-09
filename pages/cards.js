
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Cards() {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchCards();
  }, []);

  const fetchCards = async () => {
    try {
      // Mock data - replace with actual API call
      setCards([
        {
          id: 1,
          type: 'Debit',
          number: '**** **** **** 4567',
          balance: 2450.75,
          status: 'Active',
          expiry: '12/27',
          cardHolder: 'Christopher Hite',
          lastUsed: '2025-01-15'
        },
        {
          id: 2,
          type: 'Credit',
          number: '**** **** **** 8901',
          balance: -850.25,
          creditLimit: 5000,
          status: 'Active',
          expiry: '08/26',
          cardHolder: 'Christopher Hite',
          lastUsed: '2025-01-14'
        }
      ]);
    } catch (error) {
      console.error('Error fetching cards:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCardAction = (action, cardId) => {
    console.log(`${action} card ${cardId}`);
    // Implement card actions
  };

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.spinner}></div>
        <p>Loading your cards...</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>💳 My Cards</h1>
          <p style={styles.subtitle}>Manage your debit and credit cards</p>
        </div>
        <Link href="/main-menu" style={styles.backButton}>
          ← Back to Menu
        </Link>
      </div>

      {/* Navigation Tabs */}
      <div style={styles.tabs}>
        <button
          style={activeTab === 'overview' ? {...styles.tab, ...styles.activeTab} : styles.tab}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button
          style={activeTab === 'transactions' ? {...styles.tab, ...styles.activeTab} : styles.tab}
          onClick={() => setActiveTab('transactions')}
        >
          Transactions
        </button>
        <button
          style={activeTab === 'settings' ? {...styles.tab, ...styles.activeTab} : styles.tab}
          onClick={() => setActiveTab('settings')}
        >
          Settings
        </button>
      </div>

      {activeTab === 'overview' && (
        <div>
          {/* Quick Actions */}
          <div style={styles.quickActions}>
            <button style={styles.actionButton}>
              ➕ Request New Card
            </button>
            <button style={styles.actionButton}>
              🔒 Freeze All Cards
            </button>
            <button style={styles.actionButton}>
              📊 View Statement
            </button>
            <button style={styles.actionButton}>
              🎯 Set Limits
            </button>
          </div>

          {/* Cards Grid */}
          <div style={styles.cardsGrid}>
            {cards.map(card => (
              <div key={card.id} style={styles.cardContainer}>
                <div style={card.type === 'Credit' ? styles.creditCard : styles.debitCard}>
                  <div style={styles.cardHeader}>
                    <span style={styles.cardType}>{card.type} Card</span>
                    <span style={styles.cardStatus}>{card.status}</span>
                  </div>
                  <div style={styles.cardNumber}>{card.number}</div>
                  <div style={styles.cardDetails}>
                    <div>
                      <p style={styles.cardLabel}>Balance</p>
                      <p style={styles.cardValue}>
                        ${Math.abs(card.balance).toFixed(2)}
                        {card.type === 'Credit' && card.balance < 0 && ' (owed)'}
                      </p>
                    </div>
                    <div>
                      <p style={styles.cardLabel}>Expires</p>
                      <p style={styles.cardValue}>{card.expiry}</p>
                    </div>
                  </div>
                  <div style={styles.cardFooter}>
                    <span style={styles.cardHolder}>{card.cardHolder}</span>
                    {card.type === 'Credit' && (
                      <span style={styles.creditLimit}>
                        Limit: ${card.creditLimit.toLocaleString()}
                      </span>
                    )}
                  </div>
                </div>

                {/* Card Actions */}
                <div style={styles.cardActions}>
                  <button 
                    style={styles.cardActionBtn}
                    onClick={() => handleCardAction('freeze', card.id)}
                  >
                    ❄️ Freeze
                  </button>
                  <button 
                    style={styles.cardActionBtn}
                    onClick={() => handleCardAction('settings', card.id)}
                  >
                    ⚙️ Settings
                  </button>
                  <button 
                    style={styles.cardActionBtn}
                    onClick={() => handleCardAction('replace', card.id)}
                  >
                    🔄 Replace
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Card Benefits */}
          <div style={styles.benefitsSection}>
            <h2 style={styles.sectionTitle}>Card Benefits & Features</h2>
            <div style={styles.benefitsGrid}>
              <div style={styles.benefitCard}>
                <span style={styles.benefitIcon}>🛡️</span>
                <h3>Fraud Protection</h3>
                <p>24/7 monitoring and instant alerts for suspicious activity</p>
              </div>
              <div style={styles.benefitCard}>
                <span style={styles.benefitIcon}>💰</span>
                <h3>Cashback Rewards</h3>
                <p>Earn up to 2% cashback on all purchases</p>
              </div>
              <div style={styles.benefitCard}>
                <span style={styles.benefitIcon}>🌍</span>
                <h3>Global Acceptance</h3>
                <p>Use your card anywhere Visa is accepted worldwide</p>
              </div>
              <div style={styles.benefitCard}>
                <span style={styles.benefitIcon}>📱</span>
                <h3>Mobile Payments</h3>
                <p>Compatible with Apple Pay, Google Pay, and Samsung Pay</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'transactions' && (
        <div style={styles.transactionSection}>
          <h2 style={styles.sectionTitle}>Recent Card Transactions</h2>
          <div style={styles.transactionList}>
            <div style={styles.transactionItem}>
              <div style={styles.transactionInfo}>
                <span style={styles.merchant}>Amazon Purchase</span>
                <span style={styles.transactionDate}>Jan 15, 2025</span>
              </div>
              <span style={styles.transactionAmount}>-$45.67</span>
            </div>
            <div style={styles.transactionItem}>
              <div style={styles.transactionInfo}>
                <span style={styles.merchant}>Gas Station</span>
                <span style={styles.transactionDate}>Jan 14, 2025</span>
              </div>
              <span style={styles.transactionAmount}>-$32.50</span>
            </div>
            <div style={styles.transactionItem}>
              <div style={styles.transactionInfo}>
                <span style={styles.merchant}>Cashback Reward</span>
                <span style={styles.transactionDate}>Jan 13, 2025</span>
              </div>
              <span style={{...styles.transactionAmount, color: '#28a745'}}>+$2.50</span>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'settings' && (
        <div style={styles.settingsSection}>
          <h2 style={styles.sectionTitle}>Card Settings</h2>
          <div style={styles.settingsList}>
            <div style={styles.settingItem}>
              <span>Transaction Alerts</span>
              <button style={styles.toggleButton}>ON</button>
            </div>
            <div style={styles.settingItem}>
              <span>International Transactions</span>
              <button style={styles.toggleButton}>OFF</button>
            </div>
            <div style={styles.settingItem}>
              <span>Online Purchases</span>
              <button style={styles.toggleButton}>ON</button>
            </div>
            <div style={styles.settingItem}>
              <span>ATM Withdrawals</span>
              <button style={styles.toggleButton}>ON</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
    padding: '20px'
  },
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)'
  },
  spinner: {
    width: '40px',
    height: '40px',
    border: '4px solid #f3f3f3',
    borderTop: '4px solid #1e3c72',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '30px',
    background: 'white',
    padding: '25px',
    borderRadius: '12px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
  },
  title: {
    fontSize: '28px',
    fontWeight: 'bold',
    color: '#1e3c72',
    margin: 0
  },
  subtitle: {
    color: '#666',
    marginTop: '5px',
    margin: 0
  },
  backButton: {
    background: '#6c757d',
    color: 'white',
    textDecoration: 'none',
    padding: '10px 20px',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '500'
  },
  tabs: {
    display: 'flex',
    background: 'white',
    borderRadius: '12px',
    padding: '5px',
    marginBottom: '25px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  },
  tab: {
    flex: 1,
    padding: '12px 20px',
    border: 'none',
    background: 'transparent',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
    color: '#666',
    transition: 'all 0.3s'
  },
  activeTab: {
    background: '#1e3c72',
    color: 'white'
  },
  quickActions: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '15px',
    marginBottom: '30px'
  },
  actionButton: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    border: 'none',
    padding: '15px 20px',
    borderRadius: '12px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
    transition: 'transform 0.2s'
  },
  cardsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
    gap: '25px',
    marginBottom: '40px'
  },
  cardContainer: {
    background: 'white',
    borderRadius: '16px',
    padding: '20px',
    boxShadow: '0 8px 16px rgba(0,0,0,0.1)'
  },
  debitCard: {
    background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
    color: 'white',
    padding: '25px',
    borderRadius: '12px',
    marginBottom: '15px'
  },
  creditCard: {
    background: 'linear-gradient(135deg, #c31432 0%, #240b36 100%)',
    color: 'white',
    padding: '25px',
    borderRadius: '12px',
    marginBottom: '15px'
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px'
  },
  cardType: {
    fontSize: '14px',
    fontWeight: '500',
    opacity: 0.9
  },
  cardStatus: {
    fontSize: '12px',
    background: 'rgba(255,255,255,0.2)',
    padding: '4px 8px',
    borderRadius: '4px'
  },
  cardNumber: {
    fontSize: '20px',
    fontWeight: 'bold',
    letterSpacing: '2px',
    marginBottom: '20px'
  },
  cardDetails: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '20px'
  },
  cardLabel: {
    fontSize: '12px',
    opacity: 0.8,
    margin: '0 0 5px 0'
  },
  cardValue: {
    fontSize: '14px',
    fontWeight: '500',
    margin: 0
  },
  cardFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  cardHolder: {
    fontSize: '14px',
    fontWeight: '500'
  },
  creditLimit: {
    fontSize: '12px',
    opacity: 0.8
  },
  cardActions: {
    display: 'flex',
    gap: '10px'
  },
  cardActionBtn: {
    flex: 1,
    background: '#f8f9fa',
    border: '1px solid #dee2e6',
    padding: '10px 15px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '12px',
    fontWeight: '500',
    color: '#495057',
    transition: 'all 0.2s'
  },
  benefitsSection: {
    background: 'white',
    padding: '30px',
    borderRadius: '16px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
    marginBottom: '30px'
  },
  sectionTitle: {
    fontSize: '22px',
    fontWeight: 'bold',
    color: '#1e3c72',
    marginBottom: '25px'
  },
  benefitsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '20px'
  },
  benefitCard: {
    textAlign: 'center',
    padding: '20px'
  },
  benefitIcon: {
    fontSize: '40px',
    marginBottom: '15px',
    display: 'block'
  },
  transactionSection: {
    background: 'white',
    padding: '30px',
    borderRadius: '16px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
  },
  transactionList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px'
  },
  transactionItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '15px',
    background: '#f8f9fa',
    borderRadius: '8px'
  },
  transactionInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '5px'
  },
  merchant: {
    fontWeight: '500',
    color: '#1e3c72'
  },
  transactionDate: {
    fontSize: '12px',
    color: '#666'
  },
  transactionAmount: {
    fontWeight: 'bold',
    color: '#dc3545'
  },
  settingsSection: {
    background: 'white',
    padding: '30px',
    borderRadius: '16px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
  },
  settingsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px'
  },
  settingItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '15px 0',
    borderBottom: '1px solid #e9ecef'
  },
  toggleButton: {
    background: '#28a745',
    color: 'white',
    border: 'none',
    padding: '6px 12px',
    borderRadius: '4px',
    fontSize: '12px',
    fontWeight: '500',
    cursor: 'pointer'
  }
};
