
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../contexts/AuthContext';
import ProtectedRoute from '../components/ProtectedRoute';

function CardsContent() {
  const { user } = useAuth();
  const [userProfile, setUserProfile] = useState(null);
  const [cards, setCards] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [flippedCards, setFlippedCards] = useState({});
  const [visibleCardDetails, setVisibleCardDetails] = useState({});
  const [pinModal, setPinModal] = useState({ open: false, cardId: null });
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState('');
  const [pinSuccess, setPinSuccess] = useState('');
  const router = useRouter();

  useEffect(() => {
    if (user) {
      loadUserData();
    }
  }, [user]);

  const loadUserData = async () => {
    setLoading(true);
    try {
      // Fetch user profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('email', user.email)
        .single();

      if (profile) {
        setUserProfile(profile);
      }

      // Fetch accounts
      const { data: accountsData } = await supabase
        .from('accounts')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: true });

      setAccounts(accountsData || []);

      // Fetch cards
      const { data: cardsData } = await supabase
        .from('cards')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      setCards(cardsData || []);

      // Fetch card applications
      const { data: appsData } = await supabase
        .from('card_applications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      setApplications(appsData || []);

    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Failed to load cards data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const toggleCardVisibility = (cardId) => {
    setVisibleCardDetails(prev => ({
      ...prev,
      [cardId]: !prev[cardId]
    }));
  };

  const openPinModal = (cardId) => {
    setPinModal({ open: true, cardId });
    setPinInput('');
    setPinError('');
    setPinSuccess('');
  };

  const closePinModal = () => {
    setPinModal({ open: false, cardId: null });
    setPinInput('');
    setPinError('');
    setPinSuccess('');
  };

  const handleSetPin = async () => {
    setPinError('');
    setPinSuccess('');

    if (!/^\d{4,6}$/.test(pinInput)) {
      setPinError('PIN must be 4-6 digits');
      return;
    }

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        setPinError('Please log in to set PIN');
        return;
      }

      const response = await fetch('/api/cards/set-pin', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          cardId: pinModal.cardId,
          pin: pinInput
        })
      });

      const data = await response.json();

      if (response.ok) {
        setPinSuccess('PIN set successfully!');
        setTimeout(() => {
          closePinModal();
          loadUserData();
        }, 1500);
      } else {
        setPinError(data.error || 'Failed to set PIN');
      }
    } catch (error) {
      console.error('Error setting PIN:', error);
      setPinError('Error setting PIN. Please try again.');
    }
  };

  const handleCardAction = async (cardId, action) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      const { error } = await supabase
        .from('cards')
        .update({ 
          is_locked: action === 'lock',
          status: action === 'deactivate' ? 'inactive' : 'active'
        })
        .eq('id', cardId);

      if (error) throw error;
      
      await loadUserData();
    } catch (error) {
      console.error('Error updating card:', error);
      setError('Failed to update card. Please try again.');
    }
  };

  const getCardTypeColor = (cardType) => {
    const colors = {
      visa: 'linear-gradient(135deg, #1a1f71 0%, #0f7dc1 100%)',
      mastercard: 'linear-gradient(135deg, #eb001b 0%, #f79e1b 100%)',
      amex: 'linear-gradient(135deg, #006fcf 0%, #00a3e0 100%)'
    };
    return colors[cardType?.toLowerCase()] || 'linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)';
  };

  const getCardTypeLogo = (cardType) => {
    const logos = {
      visa: 'VISA',
      mastercard: 'Mastercard',
      amex: 'AMEX'
    };
    return logos[cardType?.toLowerCase()] || 'CARD';
  };

  const getUserDisplayName = () => {
    if (userProfile) {
      return `${userProfile.first_name || ''} ${userProfile.last_name || ''}`.trim().toUpperCase();
    }
    return user?.email?.split('@')[0]?.toUpperCase() || 'CARDHOLDER';
  };

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.loadingSpinner}></div>
        <div style={styles.loadingText}>Loading your cards...</div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.title}>💳 My Debit Cards</h1>
        <div style={styles.headerActions}>
          <Link href="/apply-card" style={styles.applyButton}>
            + Apply for New Card
          </Link>
          <Link href="/dashboard" style={styles.backButton}>
            ← Back to Dashboard
          </Link>
        </div>
      </header>

      {error && <div style={styles.error}>{error}</div>}

      {/* Card Applications */}
      {applications.length > 0 && (
        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>📋 Pending Applications</h2>
          <div style={styles.applicationsGrid}>
            {applications.map((app) => (
              <div key={app.id} style={styles.applicationCard}>
                <div style={styles.applicationHeader}>
                  <h3 style={styles.applicationTitle}>Card Application</h3>
                  <span style={{
                    ...styles.statusBadge,
                    backgroundColor: app.status === 'pending' ? '#f59e0b' : 
                                   app.status === 'approved' ? '#10b981' : '#ef4444'
                  }}>
                    {app.status?.toUpperCase()}
                  </span>
                </div>
                <div style={styles.applicationDetails}>
                  <p><strong>Type:</strong> {app.card_type || 'Debit Card'}</p>
                  <p><strong>Applied:</strong> {new Date(app.created_at).toLocaleDateString()}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Active Cards */}
      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>💳 My Active Cards</h2>
        {cards.length === 0 ? (
          <div style={styles.emptyState}>
            <span style={styles.emptyIcon}>💳</span>
            <h3 style={styles.emptyTitle}>No cards yet</h3>
            <p style={styles.emptyDesc}>Apply for your first debit card to get started with secure payments.</p>
            <Link href="/apply-card" style={styles.primaryButton}>
              Apply for Card
            </Link>
          </div>
        ) : (
          <div style={styles.cardsGrid}>
            {cards.map((card) => (
              <div key={card.id} style={styles.cardWrapper}>
                <div 
                  style={{
                    ...styles.cardFlipContainer,
                    transform: flippedCards[card.id] ? 'rotateY(180deg)' : 'rotateY(0deg)'
                  }}
                >
                  {/* Card Front */}
                  <div style={{
                    ...styles.cardFace,
                    ...styles.cardFront,
                    background: getCardTypeColor(card.card_type)
                  }}>
                    <div style={styles.cardHeader}>
                      <span style={styles.bankName}>OAKLINE BANK</span>
                      <span style={styles.cardTypeLabel}>{getCardTypeLogo(card.card_type)}</span>
                    </div>
                    
                    <div style={styles.chipSection}>
                      <div style={styles.chip}></div>
                      <div style={styles.contactless}>
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                          <path d="M12 18C15.3137 18 18 15.3137 18 12C18 8.68629 15.3137 6 12 6" stroke="white" strokeWidth="2"/>
                          <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2" stroke="white" strokeWidth="2"/>
                          <path d="M12 14C13.1046 14 14 13.1046 14 12C14 10.8954 13.1046 10 12 10" stroke="white" strokeWidth="2"/>
                        </svg>
                      </div>
                    </div>

                    <div style={styles.cardNumber}>
                      {visibleCardDetails[card.id] 
                        ? (card.card_number || '**** **** **** ****').replace(/(.{4})/g, '$1 ').trim()
                        : `**** **** **** ${card.card_number?.slice(-4) || '****'}`
                      }
                    </div>

                    <div style={styles.cardFooter}>
                      <div>
                        <div style={styles.cardLabel}>CARDHOLDER</div>
                        <div style={styles.cardValue}>{getUserDisplayName()}</div>
                      </div>
                      <div>
                        <div style={styles.cardLabel}>EXPIRES</div>
                        <div style={styles.cardValue}>{card.expiry_date || 'MM/YY'}</div>
                      </div>
                      <div>
                        <div style={styles.cardLabel}>CVV</div>
                        <div style={styles.cardValue}>
                          {visibleCardDetails[card.id] ? (card.cvv || '***') : '***'}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Card Back */}
                  <div style={{
                    ...styles.cardFace,
                    ...styles.cardBack,
                    background: getCardTypeColor(card.card_type)
                  }}>
                    <div style={styles.magneticStripe}></div>
                    <div style={styles.cvvSection}>
                      <div style={styles.cvvLabel}>CVV</div>
                      <div style={styles.cvvBox}>
                        {visibleCardDetails[card.id] ? (card.cvv || '***') : '***'}
                      </div>
                    </div>
                    <div style={styles.cardBackInfo}>
                      <p style={styles.cardBackText}>For customer service call 1-800-OAKLINE</p>
                      <p style={styles.cardBackText}>This card is property of Oakline Bank</p>
                    </div>
                  </div>
                </div>

                <div style={styles.cardControls}>
                  <button 
                    onClick={() => toggleCardVisibility(card.id)}
                    style={styles.controlButton}
                  >
                    {visibleCardDetails[card.id] ? '👁️ Hide Details' : '👁️ Show Details'}
                  </button>
                  <button 
                    onClick={() => setFlippedCards(prev => ({ ...prev, [card.id]: !prev[card.id] }))}
                    style={styles.controlButton}
                  >
                    🔄 Flip Card
                  </button>
                </div>

                <div style={styles.cardStatus}>
                  <span style={{
                    ...styles.badge,
                    backgroundColor: card.is_locked ? '#ef4444' : '#10b981'
                  }}>
                    {card.is_locked ? '🔒 Locked' : '✓ Active'}
                  </span>
                  <span style={{
                    ...styles.badge,
                    backgroundColor: card.pin_set ? '#10b981' : '#f59e0b'
                  }}>
                    {card.pin_set ? '🔐 PIN Set' : '⚠️ PIN Not Set'}
                  </span>
                </div>

                <div style={styles.actionButtons}>
                  {!card.pin_set && (
                    <button 
                      onClick={() => openPinModal(card.id)}
                      style={styles.setPinButton}
                    >
                      Set PIN
                    </button>
                  )}
                  
                  <button
                    onClick={() => handleCardAction(card.id, card.is_locked ? 'unlock' : 'lock')}
                    style={{
                      ...styles.actionButton,
                      backgroundColor: card.is_locked ? '#10b981' : '#f59e0b'
                    }}
                  >
                    {card.is_locked ? '🔓 Unlock Card' : '🔒 Lock Card'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* PIN Modal */}
      {pinModal.open && (
        <div style={styles.modalOverlay} onClick={closePinModal}>
          <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <h3 style={styles.modalTitle}>Set Card PIN</h3>
            <p style={styles.modalDescription}>
              Enter a 4-6 digit PIN for your card. This PIN will be required for certain transactions.
            </p>

            <div style={styles.pinInputGroup}>
              <label style={styles.pinLabel}>Enter PIN (4-6 digits)</label>
              <input
                type="password"
                maxLength="6"
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value.replace(/\D/g, ''))}
                style={styles.pinInput}
                placeholder="••••"
                autoFocus
              />
            </div>

            {pinError && (
              <div style={styles.pinError}>{pinError}</div>
            )}

            {pinSuccess && (
              <div style={styles.pinSuccess}>{pinSuccess}</div>
            )}

            <div style={styles.modalActions}>
              <button onClick={handleSetPin} style={styles.modalConfirmButton}>
                Set PIN
              </button>
              <button onClick={closePinModal} style={styles.modalCancelButton}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function Cards() {
  return (
    <ProtectedRoute>
      <CardsContent />
    </ProtectedRoute>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
    padding: '2rem',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
  },
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    background: 'linear-gradient(135deg, #1a365d 0%, #2d5a87 50%, #059669 100%)',
    color: 'white'
  },
  loadingSpinner: {
    width: '60px',
    height: '60px',
    border: '4px solid rgba(255,255,255,0.2)',
    borderTop: '4px solid #059669',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    marginBottom: '1rem'
  },
  loadingText: {
    fontSize: '1.2rem',
    fontWeight: '600'
  },
  header: {
    background: 'white',
    padding: '2rem',
    borderRadius: '16px',
    marginBottom: '2rem',
    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '1rem'
  },
  title: {
    fontSize: '2rem',
    fontWeight: 'bold',
    color: '#1e40af',
    margin: 0
  },
  headerActions: {
    display: 'flex',
    gap: '1rem',
    flexWrap: 'wrap'
  },
  applyButton: {
    padding: '0.75rem 1.5rem',
    backgroundColor: '#10b981',
    color: 'white',
    borderRadius: '12px',
    textDecoration: 'none',
    fontWeight: '600',
    transition: 'all 0.3s',
    border: 'none',
    cursor: 'pointer'
  },
  backButton: {
    padding: '0.75rem 1.5rem',
    backgroundColor: '#6b7280',
    color: 'white',
    borderRadius: '12px',
    textDecoration: 'none',
    fontWeight: '600',
    transition: 'all 0.3s'
  },
  error: {
    background: '#fee2e2',
    color: '#dc2626',
    padding: '1rem',
    borderRadius: '12px',
    marginBottom: '1rem',
    textAlign: 'center'
  },
  section: {
    marginBottom: '2rem'
  },
  sectionTitle: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: '1.5rem'
  },
  applicationsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '1.5rem'
  },
  applicationCard: {
    background: 'white',
    padding: '1.5rem',
    borderRadius: '16px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
    border: '2px solid #e2e8f0'
  },
  applicationHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1rem'
  },
  applicationTitle: {
    fontSize: '1.1rem',
    fontWeight: 'bold',
    color: '#1e293b',
    margin: 0
  },
  statusBadge: {
    padding: '0.5rem 1rem',
    borderRadius: '20px',
    fontSize: '0.75rem',
    fontWeight: 'bold',
    color: 'white'
  },
  applicationDetails: {
    fontSize: '0.9rem',
    color: '#64748b',
    lineHeight: '1.8'
  },
  emptyState: {
    background: 'white',
    padding: '4rem 2rem',
    borderRadius: '16px',
    textAlign: 'center',
    boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
  },
  emptyIcon: {
    fontSize: '4rem',
    marginBottom: '1rem',
    display: 'block'
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
    marginBottom: '2rem'
  },
  primaryButton: {
    display: 'inline-block',
    padding: '0.75rem 2rem',
    backgroundColor: '#1e40af',
    color: 'white',
    borderRadius: '12px',
    textDecoration: 'none',
    fontWeight: '600',
    transition: 'all 0.3s'
  },
  cardsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))',
    gap: '2rem'
  },
  cardWrapper: {
    background: 'white',
    padding: '2rem',
    borderRadius: '20px',
    boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
    border: '2px solid #e2e8f0'
  },
  cardFlipContainer: {
    perspective: '1000px',
    width: '100%',
    maxWidth: '380px',
    height: '240px',
    position: 'relative',
    transformStyle: 'preserve-3d',
    transition: 'transform 0.6s',
    margin: '0 auto 1.5rem'
  },
  cardFace: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backfaceVisibility: 'hidden',
    borderRadius: '16px',
    padding: '1.5rem',
    color: 'white',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    boxShadow: '0 8px 32px rgba(30, 64, 175, 0.3)'
  },
  cardFront: {
    zIndex: 2
  },
  cardBack: {
    transform: 'rotateY(180deg)'
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start'
  },
  bankName: {
    fontSize: '1rem',
    fontWeight: 'bold',
    letterSpacing: '1px'
  },
  cardTypeLabel: {
    fontSize: '0.875rem',
    fontWeight: 'bold',
    opacity: 0.9
  },
  chipSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    margin: '0.5rem 0'
  },
  chip: {
    width: '50px',
    height: '40px',
    background: 'linear-gradient(135deg, #ffd700 0%, #ffed4e 100%)',
    borderRadius: '8px'
  },
  contactless: {
    opacity: 0.8
  },
  cardNumber: {
    fontSize: '1.4rem',
    fontWeight: 'bold',
    letterSpacing: '3px',
    fontFamily: 'monospace',
    textAlign: 'center',
    margin: '0.5rem 0'
  },
  cardFooter: {
    display: 'flex',
    justifyContent: 'space-between'
  },
  cardLabel: {
    fontSize: '0.7rem',
    opacity: 0.8,
    marginBottom: '4px'
  },
  cardValue: {
    fontSize: '0.9rem',
    fontWeight: 'bold'
  },
  magneticStripe: {
    width: '100%',
    height: '45px',
    backgroundColor: '#000',
    marginTop: '20px'
  },
  cvvSection: {
    backgroundColor: 'white',
    color: 'black',
    padding: '1rem',
    margin: '20px 0',
    borderRadius: '8px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  cvvLabel: {
    fontSize: '0.9rem',
    fontWeight: 'bold'
  },
  cvvBox: {
    backgroundColor: '#f3f4f6',
    padding: '6px 12px',
    borderRadius: '6px',
    fontFamily: 'monospace',
    fontSize: '1.1rem',
    fontWeight: 'bold'
  },
  cardBackInfo: {
    fontSize: '0.7rem',
    opacity: 0.8
  },
  cardBackText: {
    margin: '4px 0'
  },
  cardControls: {
    display: 'flex',
    gap: '0.75rem',
    marginBottom: '1rem',
    justifyContent: 'center'
  },
  controlButton: {
    padding: '0.5rem 1rem',
    backgroundColor: '#3b82f6',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '0.85rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s'
  },
  cardStatus: {
    display: 'flex',
    gap: '0.75rem',
    marginBottom: '1rem',
    justifyContent: 'center',
    flexWrap: 'wrap'
  },
  badge: {
    padding: '0.5rem 1rem',
    borderRadius: '20px',
    color: 'white',
    fontSize: '0.85rem',
    fontWeight: '600'
  },
  actionButtons: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem'
  },
  setPinButton: {
    width: '100%',
    padding: '0.75rem',
    backgroundColor: '#1e40af',
    color: 'white',
    border: 'none',
    borderRadius: '12px',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s'
  },
  actionButton: {
    width: '100%',
    padding: '0.75rem',
    color: 'white',
    border: 'none',
    borderRadius: '12px',
    fontSize: '0.9rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s'
  },
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.6)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: '20px',
    padding: '2rem',
    maxWidth: '400px',
    width: '90%',
    boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
  },
  modalTitle: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: '0.5rem'
  },
  modalDescription: {
    fontSize: '0.9rem',
    color: '#64748b',
    marginBottom: '1.5rem'
  },
  pinInputGroup: {
    marginBottom: '1rem'
  },
  pinLabel: {
    display: 'block',
    fontSize: '0.875rem',
    fontWeight: '600',
    color: '#374151',
    marginBottom: '0.5rem'
  },
  pinInput: {
    width: '100%',
    padding: '0.75rem',
    fontSize: '1.5rem',
    letterSpacing: '0.5rem',
    textAlign: 'center',
    border: '2px solid #e2e8f0',
    borderRadius: '12px',
    fontFamily: 'monospace'
  },
  pinError: {
    padding: '0.75rem',
    backgroundColor: '#fee2e2',
    color: '#dc2626',
    borderRadius: '12px',
    fontSize: '0.875rem',
    marginBottom: '1rem'
  },
  pinSuccess: {
    padding: '0.75rem',
    backgroundColor: '#dcfce7',
    color: '#166534',
    borderRadius: '12px',
    fontSize: '0.875rem',
    marginBottom: '1rem'
  },
  modalActions: {
    display: 'flex',
    gap: '1rem',
    marginTop: '1.5rem'
  },
  modalConfirmButton: {
    flex: 1,
    padding: '0.75rem',
    backgroundColor: '#1e40af',
    color: 'white',
    border: 'none',
    borderRadius: '12px',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer'
  },
  modalCancelButton: {
    flex: 1,
    padding: '0.75rem',
    backgroundColor: '#6b7280',
    color: 'white',
    border: 'none',
    borderRadius: '12px',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer'
  }
};
