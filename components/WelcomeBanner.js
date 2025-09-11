
import { useState, useEffect } from 'react';

export default function WelcomeBanner() {
  const [currentMessage, setCurrentMessage] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  
  const messages = [
    {
      icon: "🏦",
      text: "Welcome to Oakline Bank - Your Trusted Financial Partner",
      color: "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)"
    },
    {
      icon: "🔒",
      text: "Experience Advanced Security with Bank-Grade Protection",
      color: "linear-gradient(135deg, #10b981 0%, #059669 100%)"
    },
    {
      icon: "📱",
      text: "Mobile Banking Made Simple - Bank Anywhere, Anytime",
      color: "linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)"
    },
    {
      icon: "💰",
      text: "Personal Loans Starting at 3.2% APR - Apply Today",
      color: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)"
    },
    {
      icon: "⭐",
      text: "No Monthly Fees on Premium Accounts - Join 500K+ Customers",
      color: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)"
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMessage((prev) => (prev + 1) % messages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [messages.length]);

  const handleClose = () => {
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div style={styles.banner}>
      <div style={styles.content}>
        <div style={styles.messageContainer}>
          <div style={styles.iconContainer}>
            <span style={styles.messageIcon}>
              {messages[currentMessage].icon}
            </span>
          </div>
          <div style={styles.textContainer}>
            <span style={{
              ...styles.message,
              background: messages[currentMessage].color,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              {messages[currentMessage].text}
            </span>
          </div>
          <button style={styles.closeButton} onClick={handleClose}>
            ✕
          </button>
        </div>
        
        <div style={styles.indicators}>
          {messages.map((_, index) => (
            <button
              key={index}
              style={{
                ...styles.indicator,
                background: index === currentMessage ? messages[currentMessage].color : 'rgba(255,255,255,0.3)',
                transform: index === currentMessage ? 'scale(1.2)' : 'scale(1)'
              }}
              onClick={() => setCurrentMessage(index)}
              aria-label={`Go to message ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

const styles = {
  banner: {
    background: 'linear-gradient(135deg, rgba(30, 58, 138, 0.95) 0%, rgba(59, 130, 246, 0.9) 50%, rgba(99, 102, 241, 0.95) 100%)',
    color: 'white',
    padding: 'clamp(12px, 2vw, 16px) 0',
    position: 'relative',
    overflow: 'hidden',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    backdropFilter: 'blur(10px)',
    borderBottom: '1px solid rgba(255,255,255,0.1)',
    animation: 'slideDown 0.6s ease-out'
  },
  content: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 1rem',
    position: 'relative'
  },
  messageContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 'clamp(8px, 2vw, 16px)',
    marginBottom: '8px',
    position: 'relative'
  },
  iconContainer: {
    flexShrink: 0,
    animation: 'bounce 2s infinite'
  },
  messageIcon: {
    fontSize: 'clamp(1.2rem, 3vw, 1.8rem)',
    filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))'
  },
  textContainer: {
    flex: 1,
    textAlign: 'center',
    overflow: 'hidden'
  },
  message: {
    fontSize: 'clamp(0.85rem, 2vw, 1.1rem)',
    fontWeight: '600',
    animation: 'fadeInUp 0.5s ease-in-out',
    lineHeight: '1.4',
    display: 'block',
    textShadow: '1px 1px 2px rgba(0,0,0,0.2)'
  },
  closeButton: {
    position: 'absolute',
    right: '0',
    top: '50%',
    transform: 'translateY(-50%)',
    background: 'rgba(255,255,255,0.2)',
    border: 'none',
    color: 'white',
    borderRadius: '50%',
    width: 'clamp(24px, 4vw, 32px)',
    height: 'clamp(24px, 4vw, 32px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    fontSize: 'clamp(12px, 2vw, 16px)',
    fontWeight: 'bold',
    transition: 'all 0.3s ease',
    backdropFilter: 'blur(10px)'
  },
  indicators: {
    display: 'flex',
    justifyContent: 'center',
    gap: '6px',
    marginTop: '4px'
  },
  indicator: {
    width: 'clamp(6px, 1.5vw, 8px)',
    height: 'clamp(6px, 1.5vw, 8px)',
    borderRadius: '50%',
    border: 'none',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    opacity: 0.7
  }
};
