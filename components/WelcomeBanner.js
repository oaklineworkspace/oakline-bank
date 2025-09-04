// components/WelcomeBanner.js
import { useState, useEffect } from 'react';

export default function WelcomeBanner() {
  const [currentMessage, setCurrentMessage] = useState(0);
  
  const messages = [
    "🏦 Welcome to Oakline Bank - Your Trusted Financial Partner",
    "💳 Experience Modern Banking with Advanced Security",
    "📱 Mobile Banking Made Simple and Secure",
    "🎯 Personal Loans Starting at 3.5% APR",
    "💰 No Monthly Fees on Premium Checking Accounts"
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMessage((prev) => (prev + 1) % messages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [messages.length]);

  return (
    <div style={styles.banner}>
      <div style={styles.content}>
        <div style={styles.messageContainer}>
          <span style={styles.message}>
            {messages[currentMessage]}
          </span>
        </div>
        <div style={styles.indicators}>
          {messages.map((_, index) => (
            <button
              key={index}
              style={{
                ...styles.indicator,
                backgroundColor: index === currentMessage ? '#ffffff' : 'rgba(255,255,255,0.4)'
              }}
              onClick={() => setCurrentMessage(index)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

const styles = {
  banner: {
    background: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 50%, #059669 100%)',
    color: 'white',
    padding: '16px 0',
    position: 'relative',
    overflow: 'hidden',
  },
  content: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  messageContainer: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
  },
  message: {
    fontSize: '16px',
    fontWeight: '500',
    animation: 'fadeInUp 0.5s ease-in-out',
  },
  indicators: {
    display: 'flex',
    gap: '8px',
    alignItems: 'center',
  },
  indicator: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    border: 'none',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
};

// Mobile responsive
if (typeof window !== 'undefined') {
  const mediaQuery = window.matchMedia('(max-width: 768px)');
  
  if (mediaQuery.matches) {
    styles.content.flexDirection = 'column';
    styles.content.gap = '12px';
    styles.message.fontSize = '14px';
    styles.message.textAlign = 'center';
    styles.banner.padding = '12px 0';
  }
}