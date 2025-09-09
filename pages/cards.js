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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');
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
          accountId: accountsData?.[0]?.id,
          // Fetch user details for cardholder name
          user: {
            first_name: accountsData?.[0]?.account_holder || 'John', // Placeholder if not available
            last_name: accountsData?.[0]?.account_holder ? '' : 'Doe' // Placeholder if not available
          }
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
    try {
      setIsSubmitting(true);

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setMessage('Please log in to apply for a card.');
        return;
      }

      // Get user's first account and associated user details
      const { data: accounts } = await supabase
        .from('accounts')
        .select(`*, user:user_id(first_name, last_name)`) // Join with user table
        .eq('user_id', user.id)
        .limit(1);

      if (!accounts || accounts.length === 0) {
        setMessage('No accounts found. Please contact support.');
        return;
      }

      const account = accounts[0];
      const userName = `${account.user?.first_name || ''} ${account.user?.last_name || ''}`.trim();

      // Submit application to database
      const { error } = await supabase
        .from('card_applications')
        .insert([{
          user_id: user.id,
          account_id: account.id,
          card_type: selectedCardType,
          cardholder_name: userName || 'Card Holder', // Use fetched name
          status: 'pending',
          created_at: new Date().toISOString()
        }]);

      if (error) {
        console.error('Error submitting application:', error);
        setMessage('Error submitting application. Please try again.');
        return;
      }

      setShowApplicationModal(false);
      setSelectedCardType('');
      setMessage(`Your ${selectedCardType} application has been submitted successfully! You'll receive a response within 2-3 business days.`);

    } catch (error) {
      console.error('Error:', error);
      setMessage('Error submitting application. Please try again.');
    } finally {
      setIsSubmitting(false);
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

      {/* Display submission message if any */}
      {message && (
        <div style={{ padding: '20px', color: message.includes('Error') ? 'red' : 'green', textAlign: 'center' }}>
          {message}
        </div>
      )}

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
                  {/* Added user name display */}
                  <div style={styles.cardName}>
                    {card.user ? `${card.user.first_name?.toUpperCase() || ''} ${card.user.last_name?.toUpperCase() || ''}`.trim() || 'CARD HOLDER' : 'CARD HOLDER'}
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
              onClick={() => {
                setSelectedCardType('Debit Card'); // Default to Debit Card
                setShowApplicationModal(true);
              }}
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
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Submitting...' : 'Confirm Application'}
              </button>
              <button 
                style={styles.cancelButton}
                onClick={() => {
                  setShowApplicationModal(false);
                  setSelectedCardType('');
                  setMessage(''); // Clear message when closing modal
                }}
                disabled={isSubmitting}
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
    backgroundColor: '#f8fafc', // Light grey background
    padding: '0',
    fontFamily: 'Arial, sans-serif', // Professional sans-serif font
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '20px 30px', // Increased padding
    backgroundColor: '#1e3a8a', // Deep blue
    color: 'white',
    boxShadow: '0 2px 5px rgba(0,0,0,0.1)', // Subtle shadow
  },
  backButton: {
    padding: '10px 20px', // More padding
    backgroundColor: 'transparent',
    color: 'white',
    border: '1px solid white',
    borderRadius: '8px', // Slightly more rounded corners
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
    transition: 'all 0.3s ease',
  },
  backButtonHover: { // Added hover style for back button
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  title: {
    fontSize: '28px', // Larger title
    fontWeight: 'bold',
    margin: 0,
    letterSpacing: '1px', // Letter spacing for elegance
  },
  menuButton: {
    padding: '10px 20px', // More padding
    backgroundColor: 'transparent',
    color: 'white',
    border: '1px solid white',
    borderRadius: '8px', // Slightly more rounded corners
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
    transition: 'all 0.3s ease',
  },
  menuButtonHover: { // Added hover style for menu button
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  loading: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '50vh',
    fontSize: '18px',
    color: '#64748b', // Neutral grey
  },
  section: {
    padding: '30px', // Increased padding
    marginBottom: '30px', // Increased margin
  },
  sectionTitle: {
    fontSize: '24px', // Larger section titles
    fontWeight: 'bold',
    color: '#1e293b', // Dark blue-grey
    marginBottom: '20px', // Increased margin below title
    borderBottom: '2px solid #e0e0e0', // Underline for section titles
    paddingBottom: '10px',
  },
  cardsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', // Responsive grid for cards
    gap: '30px', // Increased gap between cards
  },
  cardItem: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '20px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.1)', // Stronger shadow for depth
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
    overflow: 'hidden', // Ensure content stays within rounded borders
  },
  cardItemHover: { // Added hover effect for card items
    transform: 'translateY(-5px)',
    boxShadow: '0 8px 30px rgba(0,0,0,0.15)',
  },
  cardVisual: {
    background: 'linear-gradient(135deg, #0f172a 0%, #1e3a8a 50%, #3b82f6 100%)', // Professional blue gradient
    borderRadius: '12px',
    padding: '25px', // Increased padding
    color: 'white',
    marginBottom: '20px',
    position: 'relative', // For positioning elements inside
    minHeight: '180px', // Ensure consistent height
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  cardType: {
    fontSize: '16px', // Larger font for card type
    fontWeight: '600', // Semi-bold
    marginBottom: '15px',
    opacity: '0.9', // Slight transparency
  },
  cardNumber: {
    fontSize: '22px', // Larger font for card number
    fontWeight: 'bold',
    letterSpacing: '3px', // Wider letter spacing
    marginBottom: '20px',
    textShadow: '0 2px 4px rgba(0,0,0,0.2)', // Subtle text shadow
  },
  cardDetails: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '13px',
    opacity: '0.85',
    fontWeight: '500',
  },
  statusActive: {
    color: '#10b981', // Green for active
    fontWeight: 'bold',
  },
  statusInactive: {
    color: '#ef4444', // Red for inactive
    fontWeight: 'bold',
  },
  cardName: { // Style for cardholder name
    fontSize: '15px',
    fontWeight: 'bold',
    marginTop: '10px',
    letterSpacing: '1px',
    textTransform: 'uppercase',
  },
  cardActions: {
    display: 'flex',
    gap: '12px',
    flexWrap: 'wrap',
    justifyContent: 'center', // Center actions
  },
  actionButton: {
    padding: '10px 18px', // Adjusted padding
    backgroundColor: '#e2e8f0', // Light grey
    color: '#1e293b', // Dark blue-grey
    border: 'none',
    borderRadius: '8px', // Rounded corners
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: '500',
    transition: 'background-color 0.3s ease',
  },
  actionButtonHover: { // Added hover style for action buttons
    backgroundColor: '#cbd5e0',
  },
  noCards: {
    textAlign: 'center',
    padding: '50px 20px',
    backgroundColor: 'white',
    borderRadius: '12px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
  },
  cardTypesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '20px',
  },
  cardTypeItem: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '25px', // Increased padding
    boxShadow: '0 4px 20px rgba(0,0,0,0.1)', // Stronger shadow
    textAlign: 'center',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  },
  cardTypeItemHover: { // Added hover effect for card type items
    transform: 'translateY(-5px)',
    boxShadow: '0 8px 30px rgba(0,0,0,0.15)',
  },
  cardTypeTitle: {
    fontSize: '20px', // Larger title
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: '10px',
  },
  cardTypeDescription: {
    fontSize: '14px',
    color: '#64748b',
    marginBottom: '20px',
    lineHeight: '1.5',
  },
  applyButton: {
    padding: '12px 24px',
    backgroundColor: '#1e3a8a', // Deep blue
    color: 'white',
    border: 'none',
    borderRadius: '8px', // Rounded corners
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
    transition: 'background-color 0.3s ease, transform 0.3s ease',
  },
  applyButtonHover: { // Added hover style for apply buttons
    backgroundColor: '#1e40af', // Slightly lighter blue on hover
    transform: 'scale(1.02)',
  },
  modal: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.6)', // Darker overlay
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
    backdropFilter: 'blur(5px)', // Blur effect for overlay
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: '16px', // More rounded modal
    padding: '35px', // Increased padding
    maxWidth: '450px', // Slightly wider modal
    width: '90%',
    textAlign: 'center',
    boxShadow: '0 10px 30px rgba(0,0,0,0.2)', // Deeper shadow
  },
  modalTitle: {
    fontSize: '22px', // Larger modal title
    fontWeight: 'bold',
    marginBottom: '18px',
    color: '#1e293b',
  },
  modalText: {
    fontSize: '15px', // Larger modal text
    color: '#4b5563', // Slightly lighter grey
    marginBottom: '30px',
    lineHeight: '1.6',
  },
  modalActions: {
    display: 'flex',
    gap: '15px', // Increased gap between buttons
    justifyContent: 'center',
  },
  confirmButton: {
    padding: '12px 28px',
    backgroundColor: '#10b981', // Green for confirmation
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
    transition: 'background-color 0.3s ease, transform 0.3s ease',
  },
  confirmButtonHover: { // Added hover style for confirm button
    backgroundColor: '#059669',
    transform: 'scale(1.02)',
  },
  cancelButton: {
    padding: '12px 28px',
    backgroundColor: '#e2e8f0', // Light grey
    color: '#1e293b',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
    transition: 'background-color 0.3s ease',
  },
  cancelButtonHover: { // Added hover style for cancel button
    backgroundColor: '#cbd5e0',
  },
};