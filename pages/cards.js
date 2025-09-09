
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useRouter } from 'next/router';

export default function Cards() {
  const [user, setUser] = useState(null);
  const [cards, setCards] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showApplicationModal, setShowApplicationModal] = useState(false);
  const [selectedCardType, setSelectedCardType] = useState('');
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
      await fetchUserData(user.email);
    } catch (error) {
      console.error('Error checking user:', error);
      router.push('/login');
    }
  };

  const fetchUserData = async (email) => {
    try {
      // Fetch user accounts
      const { data: accountsData, error: accountsError } = await supabase
        .from('accounts')
        .select('*')
        .eq('email', email);

      if (accountsError) throw accountsError;
      setAccounts(accountsData || []);

      // Fetch user cards (you'll need to create a cards table)
      // For now, we'll simulate some cards
      const simulatedCards = [
        {
          id: 1,
          type: 'Debit Card',
          number: '**** **** **** 1234',
          status: 'Active',
          expiryDate: '12/26',
          accountId: accountsData?.[0]?.id
        }
      ];
      setCards(simulatedCards);
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const cardTypes = [
    { value: 'debit', label: 'Debit Card', description: 'Access your checking account funds' },
    { value: 'credit', label: 'Credit Card', description: 'Build credit with responsible use' },
    { value: 'prepaid', label: 'Prepaid Card', description: 'Load funds for controlled spending' },
    { value: 'business', label: 'Business Card', description: 'For business expenses and rewards' }
  ];

  const handleCardApplication = async () => {
    if (!selectedCardType) return;

    try {
      // Here you would typically submit the card application
      // For now, we'll just show success
      alert(`${selectedCardType} card application submitted successfully!`);
      setShowApplicationModal(false);
      setSelectedCardType('');
    } catch (error) {
      console.error('Error submitting card application:', error);
      alert('Error submitting application. Please try again.');
    }
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.loading}>Loading your cards...</div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Header */}
      <header style={styles.header}>
        <button onClick={() => router.push('/dashboard')} style={styles.backButton}>
          ← Back to Dashboard
        </button>
        <h1 style={styles.title}>My Cards</h1>
        <button onClick={() => router.push('/main-menu')} style={styles.menuButton}>
          ☰ Menu
        </button>
      </header>

      {/* Current Cards */}
      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>Your Cards</h2>
        {cards.length > 0 ? (
          <div style={styles.cardsGrid}>
            {cards.map((card) => (
              <div key={card.id} style={styles.cardItem}>
                <div style={styles.cardVisual}>
                  <div style={styles.cardType}>{card.type}</div>
                  <div style={styles.cardNumber}>{card.number}</div>
                  <div style={styles.cardDetails}>
                    <span>Expires: {card.expiryDate}</span>
                    <span style={card.status === 'Active' ? styles.statusActive : styles.statusInactive}>
                      {card.status}
                    </span>
                  </div>
                </div>
                <div style={styles.cardActions}>
                  <button style={styles.actionButton}>Freeze Card</button>
                  <button style={styles.actionButton}>View PIN</button>
                  <button style={styles.actionButton}>Transaction History</button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={styles.noCards}>
            <p>You don't have any cards yet.</p>
            <button 
              style={styles.applyButton}
              onClick={() => setShowApplicationModal(true)}
            >
              Apply for Your First Card
            </button>
          </div>
        )}
      </section>

      {/* Apply for New Card */}
      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>Apply for a New Card</h2>
        <div style={styles.cardTypesGrid}>
          {cardTypes.map((cardType) => (
            <div key={cardType.value} style={styles.cardTypeItem}>
              <h3 style={styles.cardTypeTitle}>{cardType.label}</h3>
              <p style={styles.cardTypeDescription}>{cardType.description}</p>
              <button 
                style={styles.applyButton}
                onClick={() => {
                  setSelectedCardType(cardType.label);
                  setShowApplicationModal(true);
                }}
              >
                Apply Now
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Application Modal */}
      {showApplicationModal && (
        <div style={styles.modal}>
          <div style={styles.modalContent}>
            <h3 style={styles.modalTitle}>Apply for {selectedCardType}</h3>
            <p style={styles.modalText}>
              Are you sure you want to apply for a {selectedCardType}? 
              Your application will be reviewed and you'll receive a response within 2-3 business days.
            </p>
            <div style={styles.modalActions}>
              <button 
                style={styles.confirmButton}
                onClick={handleCardApplication}
              >
                Confirm Application
              </button>
              <button 
                style={styles.cancelButton}
                onClick={() => {
                  setShowApplicationModal(false);
                  setSelectedCardType('');
                }}
              >
                Cancel
              </button>
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
    backgroundColor: '#f8fafc',
    padding: '0',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '20px',
    backgroundColor: '#1e3a8a',
    color: 'white',
  },
  backButton: {
    padding: '8px 16px',
    backgroundColor: 'transparent',
    color: 'white',
    border: '1px solid white',
    borderRadius: '6px',
    cursor: 'pointer',
  },
  title: {
    fontSize: '24px',
    fontWeight: 'bold',
    margin: 0,
  },
  menuButton: {
    padding: '8px 16px',
    backgroundColor: 'transparent',
    color: 'white',
    border: '1px solid white',
    borderRadius: '6px',
    cursor: 'pointer',
  },
  loading: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '50vh',
    fontSize: '18px',
    color: '#64748b',
  },
  section: {
    padding: '20px',
    marginBottom: '20px',
  },
  sectionTitle: {
    fontSize: '20px',
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: '16px',
  },
  cardsGrid: {
    display: 'grid',
    gap: '20px',
  },
  cardItem: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '20px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
  },
  cardVisual: {
    background: 'linear-gradient(135deg, #1e3a8a, #3b82f6)',
    borderRadius: '12px',
    padding: '20px',
    color: 'white',
    marginBottom: '16px',
  },
  cardType: {
    fontSize: '14px',
    fontWeight: '500',
    marginBottom: '12px',
  },
  cardNumber: {
    fontSize: '18px',
    fontWeight: 'bold',
    letterSpacing: '2px',
    marginBottom: '16px',
  },
  cardDetails: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '12px',
  },
  statusActive: {
    color: '#10b981',
    fontWeight: 'bold',
  },
  statusInactive: {
    color: '#ef4444',
    fontWeight: 'bold',
  },
  cardActions: {
    display: 'flex',
    gap: '10px',
    flexWrap: 'wrap',
  },
  actionButton: {
    padding: '8px 16px',
    backgroundColor: '#e2e8f0',
    color: '#1e293b',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px',
  },
  noCards: {
    textAlign: 'center',
    padding: '40px',
    backgroundColor: 'white',
    borderRadius: '12px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
  },
  cardTypesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '16px',
  },
  cardTypeItem: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '20px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    textAlign: 'center',
  },
  cardTypeTitle: {
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: '8px',
  },
  cardTypeDescription: {
    fontSize: '14px',
    color: '#64748b',
    marginBottom: '16px',
  },
  applyButton: {
    padding: '12px 24px',
    backgroundColor: '#1e3a8a',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
  },
  modal: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '30px',
    maxWidth: '400px',
    width: '90%',
    textAlign: 'center',
  },
  modalTitle: {
    fontSize: '20px',
    fontWeight: 'bold',
    marginBottom: '16px',
    color: '#1e293b',
  },
  modalText: {
    fontSize: '14px',
    color: '#64748b',
    marginBottom: '24px',
    lineHeight: '1.5',
  },
  modalActions: {
    display: 'flex',
    gap: '12px',
    justifyContent: 'center',
  },
  confirmButton: {
    padding: '12px 24px',
    backgroundColor: '#10b981',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
  },
  cancelButton: {
    padding: '12px 24px',
    backgroundColor: '#e2e8f0',
    color: '#1e293b',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
  },
};
