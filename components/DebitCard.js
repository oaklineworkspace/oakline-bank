
import { useState, useEffect } from 'react';

export default function DebitCard({ user, userProfile, account, cardType = 'debit', showDetails = true }) {
  const [cardFlipped, setCardFlipped] = useState(false);
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');

  useEffect(() => {
    // Generate realistic card details based on user
    if (user && account) {
      const baseNumber = account.account_number?.replace(/\D/g, '') || '1234';
      const cardNum = generateCardNumber(baseNumber);
      setCardNumber(cardNum);
      
      // Generate expiry date (3-5 years from now)
      const currentDate = new Date();
      const expiryYear = (currentDate.getFullYear() + Math.floor(Math.random() * 3) + 3) % 100;
      const expiryMonth = Math.floor(Math.random() * 12) + 1;
      setExpiryDate(`${expiryMonth.toString().padStart(2, '0')}/${expiryYear.toString().padStart(2, '0')}`);
      
      // Generate CVV
      setCvv(Math.floor(Math.random() * 900 + 100).toString());
    }
  }, [user, account]);

  const generateCardNumber = (baseNumber) => {
    // Generate Visa card number (starts with 4)
    const prefix = '4532';
    const remaining = baseNumber.padEnd(12, '0').substring(0, 12);
    return `${prefix}${remaining}`.substring(0, 16);
  };

  const formatCardNumber = (number) => {
    return number.replace(/(.{4})/g, '$1 ').trim();
  };

  const getCardHolderName = () => {
    if (userProfile?.first_name && userProfile?.last_name) {
      return `${userProfile.first_name} ${userProfile.last_name}`.toUpperCase();
    }
    return user?.email?.split('@')[0]?.toUpperCase() || 'CARD HOLDER';
  };

  const getCardTypeIcon = () => {
    switch (cardType) {
      case 'credit':
        return '💳';
      case 'debit':
      default:
        return '💰';
    }
  };

  return (
    <div style={styles.cardContainer}>
      <div 
        style={{
          ...styles.card,
          transform: cardFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)'
        }}
        onClick={() => setCardFlipped(!cardFlipped)}
      >
        {/* Front of Card */}
        <div style={{
          ...styles.cardFace,
          ...styles.cardFront,
          opacity: cardFlipped ? 0 : 1
        }}>
          {/* Card Background Pattern */}
          <div style={styles.cardPattern}></div>
          
          {/* Bank Logo */}
          <div style={styles.cardHeader}>
            <img 
              src="/images/logo-primary.png.jpg" 
              alt="Oakline Bank" 
              style={styles.cardLogo} 
            />
            <div style={styles.cardTitle}>
              <span style={styles.bankName}>OAKLINE BANK</span>
              <span style={styles.cardTypeText}>{cardType.toUpperCase()}</span>
            </div>
          </div>

          {/* Chip */}
          <div style={styles.chipContainer}>
            <div style={styles.chip}>
              <div style={styles.chipInner}></div>
            </div>
          </div>

          {/* Card Number */}
          <div style={styles.cardNumber}>
            {showDetails ? formatCardNumber(cardNumber) : '**** **** **** ' + cardNumber.slice(-4)}
          </div>

          {/* Card Details */}
          <div style={styles.cardDetails}>
            <div style={styles.cardDetail}>
              <span style={styles.cardLabel}>VALID THRU</span>
              <span style={styles.cardValue}>{showDetails ? expiryDate : '**/**'}</span>
            </div>
            <div style={styles.cardDetail}>
              <span style={styles.cardLabel}>CARD HOLDER</span>
              <span style={styles.cardValue}>{getCardHolderName()}</span>
            </div>
          </div>

          {/* Visa/Mastercard Logo */}
          <div style={styles.cardBrand}>
            <div style={styles.visaLogo}>VISA</div>
          </div>

          {/* Contactless Symbol */}
          <div style={styles.contactless}>📶</div>
        </div>

        {/* Back of Card */}
        <div style={{
          ...styles.cardFace,
          ...styles.cardBack,
          opacity: cardFlipped ? 1 : 0,
          transform: 'rotateY(180deg)'
        }}>
          {/* Magnetic Strip */}
          <div style={styles.magneticStrip}></div>
          
          {/* Signature Panel */}
          <div style={styles.signaturePanel}>
            <div style={styles.signatureArea}>
              <span style={styles.signature}>{getCardHolderName().substring(0, 15)}</span>
            </div>
            <div style={styles.cvvBox}>
              <span style={styles.cvvLabel}>CVV</span>
              <span style={styles.cvvValue}>{showDetails ? cvv : '***'}</span>
            </div>
          </div>

          {/* Bank Info */}
          <div style={styles.backInfo}>
            <p style={styles.backText}>
              This card is property of Oakline Bank. If found, please return to any Oakline Bank location.
            </p>
            <p style={styles.backText}>
              Customer Service: 1-800-OAKLINE
            </p>
          </div>

          {/* Flip Instruction */}
          <div style={styles.flipInstruction}>
            Click to flip card
          </div>
        </div>
      </div>
      
      {/* Card Controls */}
      <div style={styles.cardControls}>
        <button style={styles.controlBtn} onClick={() => setCardFlipped(!cardFlipped)}>
          <span style={styles.controlIcon}>🔄</span>
          Flip Card
        </button>
        <button style={styles.controlBtn}>
          <span style={styles.controlIcon}>🔒</span>
          Lock Card
        </button>
        <button style={styles.controlBtn}>
          <span style={styles.controlIcon}>⚙️</span>
          Settings
        </button>
      </div>
    </div>
  );
}

const styles = {
  cardContainer: {
    perspective: '1000px',
    margin: '2rem 0'
  },
  card: {
    width: '400px',
    height: '250px',
    position: 'relative',
    transformStyle: 'preserve-3d',
    transition: 'transform 0.8s ease',
    cursor: 'pointer',
    margin: '0 auto'
  },
  cardFace: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: '16px',
    backfaceVisibility: 'hidden',
    transition: 'opacity 0.3s ease'
  },
  cardFront: {
    background: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 50%, #60a5fa 100%)',
    color: 'white',
    padding: '1.5rem',
    boxShadow: '0 8px 25px rgba(30, 64, 175, 0.3)'
  },
  cardBack: {
    background: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 50%, #60a5fa 100%)',
    color: 'white',
    padding: '1.5rem'
  },
  cardPattern: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: `
      radial-gradient(circle at 20% 20%, rgba(255,255,255,0.1) 2px, transparent 2px),
      radial-gradient(circle at 80% 80%, rgba(255,255,255,0.1) 2px, transparent 2px),
      radial-gradient(circle at 40% 60%, rgba(255,255,255,0.05) 1px, transparent 1px)
    `,
    backgroundSize: '30px 30px, 25px 25px, 20px 20px',
    borderRadius: '16px'
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '1rem',
    position: 'relative',
    zIndex: 2
  },
  cardLogo: {
    height: '30px',
    width: 'auto'
  },
  cardTitle: {
    textAlign: 'right'
  },
  bankName: {
    display: 'block',
    fontSize: '0.8rem',
    fontWeight: '700',
    letterSpacing: '1px'
  },
  cardTypeText: {
    display: 'block',
    fontSize: '0.7rem',
    fontWeight: '500',
    opacity: 0.8
  },
  chipContainer: {
    position: 'relative',
    zIndex: 2,
    marginBottom: '1.5rem'
  },
  chip: {
    width: '40px',
    height: '30px',
    background: 'linear-gradient(145deg, #ffd700, #ffed4e)',
    borderRadius: '6px',
    position: 'relative',
    border: '1px solid rgba(255, 255, 255, 0.3)'
  },
  chipInner: {
    position: 'absolute',
    top: '4px',
    left: '4px',
    right: '4px',
    bottom: '4px',
    background: 'linear-gradient(145deg, #ffed4e, #ffd700)',
    borderRadius: '3px'
  },
  cardNumber: {
    fontSize: '1.4rem',
    fontFamily: 'monospace',
    fontWeight: '700',
    letterSpacing: '3px',
    marginBottom: '1.5rem',
    position: 'relative',
    zIndex: 2
  },
  cardDetails: {
    display: 'flex',
    justifyContent: 'space-between',
    position: 'relative',
    zIndex: 2
  },
  cardDetail: {
    display: 'flex',
    flexDirection: 'column'
  },
  cardLabel: {
    fontSize: '0.6rem',
    opacity: 0.8,
    marginBottom: '0.2rem'
  },
  cardValue: {
    fontSize: '0.9rem',
    fontWeight: '600'
  },
  cardBrand: {
    position: 'absolute',
    bottom: '1.5rem',
    right: '1.5rem',
    zIndex: 2
  },
  visaLogo: {
    fontSize: '1.2rem',
    fontWeight: '900',
    fontStyle: 'italic',
    color: 'white'
  },
  contactless: {
    position: 'absolute',
    top: '1.5rem',
    right: '1.5rem',
    fontSize: '1.2rem',
    opacity: 0.7,
    zIndex: 2
  },
  magneticStrip: {
    width: '100%',
    height: '40px',
    background: '#2d1810',
    marginTop: '1rem',
    marginBottom: '1rem'
  },
  signaturePanel: {
    background: 'white',
    padding: '0.8rem',
    borderRadius: '6px',
    margin: '1rem 0',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  signatureArea: {
    flex: 1,
    borderBottom: '1px solid #ccc',
    paddingBottom: '0.5rem'
  },
  signature: {
    color: '#333',
    fontStyle: 'italic',
    fontSize: '0.9rem'
  },
  cvvBox: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginLeft: '1rem'
  },
  cvvLabel: {
    fontSize: '0.6rem',
    color: '#666',
    marginBottom: '0.2rem'
  },
  cvvValue: {
    fontSize: '0.8rem',
    fontFamily: 'monospace',
    fontWeight: '700',
    color: '#333'
  },
  backInfo: {
    fontSize: '0.6rem',
    lineHeight: '1.4',
    opacity: 0.8
  },
  backText: {
    margin: '0.5rem 0'
  },
  flipInstruction: {
    position: 'absolute',
    bottom: '0.5rem',
    left: '50%',
    transform: 'translateX(-50%)',
    fontSize: '0.6rem',
    opacity: 0.6
  },
  cardControls: {
    display: 'flex',
    justifyContent: 'center',
    gap: '1rem',
    marginTop: '1.5rem'
  },
  controlBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.75rem 1rem',
    background: 'white',
    border: '2px solid #1e40af',
    borderRadius: '8px',
    color: '#1e40af',
    fontSize: '0.8rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s ease'
  },
  controlIcon: {
    fontSize: '1rem'
  }
};
