
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

export default function DebitCard({ 
  user, 
  userProfile, 
  account, 
  cardData = null,
  showDetails = true,
  showControls = true,
  onApplyCard = null
}) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [cardSettings, setCardSettings] = useState({
    isLocked: false,
    dailyLimit: 1000,
    monthlyLimit: 10000,
    contactlessEnabled: true,
    internationalEnabled: false,
    onlineEnabled: true
  });

  useEffect(() => {
    if (cardData) {
      setCardSettings({
        isLocked: cardData.is_locked || false,
        dailyLimit: cardData.daily_limit || 1000,
        monthlyLimit: cardData.monthly_limit || 10000,
        contactlessEnabled: cardData.contactless_enabled !== false,
        internationalEnabled: cardData.international_enabled || false,
        onlineEnabled: cardData.online_enabled !== false
      });
    }
  }, [cardData]);

  const getCardholderName = () => {
    if (cardData?.cardholder_name) return cardData.cardholder_name;
    if (userProfile) {
      return `${userProfile.first_name || ''} ${userProfile.last_name || ''}`.trim().toUpperCase();
    }
    return user?.email?.split('@')[0]?.toUpperCase() || 'CARD HOLDER';
  };

  const getCardNumber = () => {
    if (cardData?.card_number) {
      return cardData.card_number.replace(/(\d{4})(?=\d)/g, '$1 ');
    }
    return '**** **** **** ****';
  };

  const getExpiryDate = () => {
    if (cardData?.expiry_date) return cardData.expiry_date;
    const future = new Date();
    future.setFullYear(future.getFullYear() + 4);
    return `${(future.getMonth() + 1).toString().padStart(2, '0')}/${future.getFullYear().toString().slice(2)}`;
  };

  const handleCardToggle = async (setting) => {
    if (!cardData) return;
    
    setLoading(true);
    try {
      const updates = { [setting]: !cardSettings[setting] };
      
      const { error } = await supabase
        .from('cards')
        .update(updates)
        .eq('id', cardData.id);

      if (error) throw error;

      setCardSettings(prev => ({
        ...prev,
        [setting]: !prev[setting]
      }));
      
      setMessage(`Card ${setting.replace(/([A-Z])/g, ' $1').toLowerCase()} ${!cardSettings[setting] ? 'enabled' : 'disabled'}`);
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Error updating card settings:', error);
      setMessage('Failed to update card settings');
      setTimeout(() => setMessage(''), 3000);
    } finally {
      setLoading(false);
    }
  };

  const handleLimitUpdate = async (limitType, value) => {
    if (!cardData) return;
    
    setLoading(true);
    try {
      const updates = { [limitType]: parseFloat(value) };
      
      const { error } = await supabase
        .from('cards')
        .update(updates)
        .eq('id', cardData.id);

      if (error) throw error;

      setCardSettings(prev => ({
        ...prev,
        [limitType]: parseFloat(value)
      }));
      
      setMessage(`${limitType.replace(/([A-Z])/g, ' $1')} updated successfully`);
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Error updating limits:', error);
      setMessage('Failed to update limits');
      setTimeout(() => setMessage(''), 3000);
    } finally {
      setLoading(false);
    }
  };

  const handleApplyForCard = async () => {
    if (!account || !user) return;
    
    setLoading(true);
    try {
      const response = await fetch('/api/apply-card', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          accountId: account.id,
          cardholderName: getCardholderName()
        })
      });

      const data = await response.json();
      
      if (data.success) {
        setMessage('Card application submitted successfully! We will review your application and notify you once approved.');
        if (onApplyCard) onApplyCard();
      } else {
        setMessage(data.error || 'Failed to submit card application');
      }
      setTimeout(() => setMessage(''), 5000);
    } catch (error) {
      console.error('Error applying for card:', error);
      setMessage('Failed to submit card application');
      setTimeout(() => setMessage(''), 3000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      {/* Virtual Debit Card */}
      <div style={styles.cardContainer}>
        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <div style={styles.bankName}>OAKLINE BANK</div>
            <div style={styles.cardType}>DEBIT</div>
          </div>
          
          <div style={styles.chipSection}>
            <div style={styles.chip}></div>
            <div style={styles.contactless}>
              <svg style={styles.contactlessIcon} viewBox="0 0 24 24" fill="none">
                <path d="M12 18C15.3137 18 18 15.3137 18 12C18 8.68629 15.3137 6 12 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                <path d="M12 14C13.1046 14 14 13.1046 14 12C14 10.8954 13.1046 10 12 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
          </div>

          <div style={styles.cardNumber}>
            {getCardNumber()}
          </div>

          <div style={styles.cardDetails}>
            <div style={styles.cardHolder}>
              <div style={styles.label}>CARD HOLDER</div>
              <div style={styles.name}>{getCardholderName()}</div>
            </div>
            <div style={styles.expiry}>
              <div style={styles.label}>VALID THRU</div>
              <div style={styles.date}>{getExpiryDate()}</div>
            </div>
          </div>

          <div style={styles.cardFooter}>
            <div style={styles.visa}>VISA</div>
            {cardData && (
              <div style={styles.statusBadge}>
                <span style={{
                  ...styles.status,
                  backgroundColor: cardSettings.isLocked ? '#ef4444' : '#10b981'
                }}>
                  {cardSettings.isLocked ? 'LOCKED' : 'ACTIVE'}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Message Display */}
      {message && (
        <div style={{
          ...styles.message,
          backgroundColor: message.includes('success') || message.includes('enabled') || message.includes('disabled') || message.includes('updated') ? '#d1fae5' : '#fee2e2',
          color: message.includes('success') || message.includes('enabled') || message.includes('disabled') || message.includes('updated') ? '#065f46' : '#991b1b'
        }}>
          {message}
        </div>
      )}

      {/* Card Controls */}
      {showControls && (
        <div style={styles.controlsContainer}>
          {!cardData ? (
            // Apply for Card Button
            <div style={styles.applySection}>
              <h3 style={styles.sectionTitle}>Get Your Debit Card</h3>
              <p style={styles.sectionDesc}>Apply for a debit card linked to your account for easy access to your funds.</p>
              <button 
                onClick={handleApplyForCard}
                disabled={loading}
                style={styles.applyButton}
              >
                {loading ? 'Applying...' : '💳 Apply for Debit Card'}
              </button>
            </div>
          ) : (
            // Card Management Controls
            <>
              <div style={styles.controlSection}>
                <h3 style={styles.sectionTitle}>Card Controls</h3>
                <div style={styles.toggleGrid}>
                  <div style={styles.toggleItem}>
                    <label style={styles.toggleLabel}>
                      <input
                        type="checkbox"
                        checked={!cardSettings.isLocked}
                        onChange={() => handleCardToggle('isLocked')}
                        disabled={loading}
                        style={styles.checkbox}
                      />
                      <span style={styles.toggleText}>Card Active</span>
                    </label>
                  </div>
                  <div style={styles.toggleItem}>
                    <label style={styles.toggleLabel}>
                      <input
                        type="checkbox"
                        checked={cardSettings.contactlessEnabled}
                        onChange={() => handleCardToggle('contactlessEnabled')}
                        disabled={loading}
                        style={styles.checkbox}
                      />
                      <span style={styles.toggleText}>Contactless Payments</span>
                    </label>
                  </div>
                  <div style={styles.toggleItem}>
                    <label style={styles.toggleLabel}>
                      <input
                        type="checkbox"
                        checked={cardSettings.onlineEnabled}
                        onChange={() => handleCardToggle('onlineEnabled')}
                        disabled={loading}
                        style={styles.checkbox}
                      />
                      <span style={styles.toggleText}>Online Purchases</span>
                    </label>
                  </div>
                  <div style={styles.toggleItem}>
                    <label style={styles.toggleLabel}>
                      <input
                        type="checkbox"
                        checked={cardSettings.internationalEnabled}
                        onChange={() => handleCardToggle('internationalEnabled')}
                        disabled={loading}
                        style={styles.checkbox}
                      />
                      <span style={styles.toggleText}>International Use</span>
                    </label>
                  </div>
                </div>
              </div>

              <div style={styles.controlSection}>
                <h3 style={styles.sectionTitle}>Spending Limits</h3>
                <div style={styles.limitsGrid}>
                  <div style={styles.limitItem}>
                    <label style={styles.limitLabel}>Daily Limit</label>
                    <div style={styles.limitInput}>
                      <span style={styles.currency}>$</span>
                      <input
                        type="number"
                        value={cardSettings.dailyLimit}
                        onChange={(e) => setCardSettings(prev => ({ ...prev, dailyLimit: e.target.value }))}
                        onBlur={(e) => handleLimitUpdate('daily_limit', e.target.value)}
                        disabled={loading}
                        style={styles.input}
                        min="0"
                        max="5000"
                      />
                    </div>
                  </div>
                  <div style={styles.limitItem}>
                    <label style={styles.limitLabel}>Monthly Limit</label>
                    <div style={styles.limitInput}>
                      <span style={styles.currency}>$</span>
                      <input
                        type="number"
                        value={cardSettings.monthlyLimit}
                        onChange={(e) => setCardSettings(prev => ({ ...prev, monthlyLimit: e.target.value }))}
                        onBlur={(e) => handleLimitUpdate('monthly_limit', e.target.value)}
                        disabled={loading}
                        style={styles.input}
                        min="0"
                        max="50000"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '100%',
    margin: '0 auto',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
  },
  cardContainer: {
    perspective: '1000px',
    marginBottom: '2rem'
  },
  card: {
    width: '100%',
    maxWidth: '380px',
    height: '240px',
    margin: '0 auto',
    background: 'linear-gradient(135deg, #1e40af 0%, #3730a3 50%, #1e1b4b 100%)',
    borderRadius: '16px',
    padding: '24px',
    color: 'white',
    boxShadow: '0 25px 50px rgba(30, 64, 175, 0.3), 0 0 0 1px rgba(255,255,255,0.1) inset',
    position: 'relative',
    overflow: 'hidden',
    '@media (max-width: 480px)': {
      maxWidth: '340px',
      height: '215px',
      padding: '20px'
    }
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1.5rem'
  },
  bankName: {
    fontSize: '0.9rem',
    fontWeight: '700',
    letterSpacing: '1px'
  },
  cardType: {
    fontSize: '0.8rem',
    fontWeight: '600',
    backgroundColor: 'rgba(255,255,255,0.2)',
    padding: '4px 8px',
    borderRadius: '4px'
  },
  chipSection: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1.5rem'
  },
  chip: {
    width: '40px',
    height: '32px',
    background: 'linear-gradient(45deg, #ffd700, #ffa500)',
    borderRadius: '6px',
    border: '1px solid rgba(255,255,255,0.3)'
  },
  contactless: {
    opacity: 0.8
  },
  contactlessIcon: {
    width: '24px',
    height: '24px',
    color: 'white'
  },
  cardNumber: {
    fontSize: '1.1rem',
    fontWeight: '600',
    letterSpacing: '2px',
    fontFamily: 'monospace',
    marginBottom: '1.5rem',
    '@media (max-width: 480px)': {
      fontSize: '1rem'
    }
  },
  cardDetails: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '1rem'
  },
  cardHolder: {
    flex: 1
  },
  expiry: {
    textAlign: 'right'
  },
  label: {
    fontSize: '0.65rem',
    fontWeight: '500',
    opacity: 0.8,
    marginBottom: '4px',
    letterSpacing: '0.5px'
  },
  name: {
    fontSize: '0.8rem',
    fontWeight: '600',
    letterSpacing: '1px'
  },
  date: {
    fontSize: '0.8rem',
    fontWeight: '600',
    fontFamily: 'monospace'
  },
  cardFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  visa: {
    fontSize: '1.2rem',
    fontWeight: '700',
    fontStyle: 'italic',
    letterSpacing: '1px'
  },
  statusBadge: {
    display: 'flex',
    alignItems: 'center'
  },
  status: {
    fontSize: '0.7rem',
    fontWeight: '700',
    padding: '3px 8px',
    borderRadius: '10px',
    letterSpacing: '0.5px'
  },
  message: {
    padding: '0.75rem 1rem',
    borderRadius: '8px',
    fontSize: '0.9rem',
    fontWeight: '500',
    marginBottom: '1rem',
    textAlign: 'center'
  },
  controlsContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem'
  },
  applySection: {
    backgroundColor: '#f8fafc',
    padding: '2rem',
    borderRadius: '12px',
    textAlign: 'center',
    border: '1px solid #e2e8f0'
  },
  controlSection: {
    backgroundColor: 'white',
    padding: '1.5rem',
    borderRadius: '12px',
    border: '1px solid #e2e8f0'
  },
  sectionTitle: {
    fontSize: '1.1rem',
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: '1rem'
  },
  sectionDesc: {
    fontSize: '0.9rem',
    color: '#64748b',
    lineHeight: '1.5',
    marginBottom: '1.5rem'
  },
  applyButton: {
    width: '100%',
    padding: '1rem 2rem',
    backgroundColor: '#1e40af',
    color: 'white',
    border: 'none',
    borderRadius: '10px',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s',
    boxShadow: '0 4px 12px rgba(30, 64, 175, 0.3)'
  },
  toggleGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '1rem'
  },
  toggleItem: {
    display: 'flex',
    alignItems: 'center'
  },
  toggleLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    cursor: 'pointer',
    fontSize: '0.9rem'
  },
  checkbox: {
    width: '20px',
    height: '20px',
    accentColor: '#1e40af'
  },
  toggleText: {
    fontWeight: '500',
    color: '#374151'
  },
  limitsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '1rem'
  },
  limitItem: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem'
  },
  limitLabel: {
    fontSize: '0.9rem',
    fontWeight: '600',
    color: '#374151'
  },
  limitInput: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center'
  },
  currency: {
    position: 'absolute',
    left: '12px',
    fontSize: '1rem',
    fontWeight: '600',
    color: '#64748b',
    zIndex: 1
  },
  input: {
    width: '100%',
    padding: '0.75rem 0.75rem 0.75rem 2rem',
    border: '2px solid #e2e8f0',
    borderRadius: '8px',
    fontSize: '1rem',
    outline: 'none',
    transition: 'border-color 0.2s'
  }
};
