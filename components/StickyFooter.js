
import { useState } from 'react';
import Link from 'next/link';

export default function StickyFooter() {
  const [isExpanded, setIsExpanded] = useState(false);

  const quickActions = [
    {
      icon: '💳',
      label: 'Quick Pay',
      href: '/bill-pay',
      description: 'Pay bills instantly'
    },
    {
      icon: '📱',
      label: 'Transfer',
      href: '/transfer',
      description: 'Send money fast'
    },
    {
      icon: '📊',
      label: 'Balance',
      href: '/dashboard',
      description: 'Check accounts'
    },
    {
      icon: '🏦',
      label: 'ATM',
      href: '/atm',
      description: 'Find locations'
    },
    {
      icon: '💬',
      label: 'Support',
      href: '/support',
      description: '24/7 help'
    }
  ];

  return (
    <div style={styles.stickyFooter}>
      {/* Expanded Menu */}
      {isExpanded && (
        <>
          <div style={styles.overlay} onClick={() => setIsExpanded(false)} />
          <div style={styles.expandedMenu}>
            <div style={styles.expandedHeader}>
              <h3 style={styles.expandedTitle}>Quick Banking</h3>
              <button 
                style={styles.closeButton}
                onClick={() => setIsExpanded(false)}
              >
                ✕
              </button>
            </div>
            <div style={styles.quickActionsGrid}>
              {quickActions.map((action, index) => (
                <Link key={index} href={action.href} style={styles.quickActionLink}>
                  <div style={styles.quickActionCard}>
                    <div style={styles.quickActionIcon}>{action.icon}</div>
                    <div style={styles.quickActionText}>
                      <span style={styles.quickActionLabel}>{action.label}</span>
                      <span style={styles.quickActionDesc}>{action.description}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            <div style={styles.emergencyContact}>
              <div style={styles.emergencyIcon}>🚨</div>
              <div>
                <span style={styles.emergencyLabel}>Emergency Banking</span>
                <span style={styles.emergencyNumber}>1-800-OAKLINE</span>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Main Footer Bar */}
      <div style={styles.footerBar}>
        <Link href="/dashboard" style={styles.footerAction}>
          <div style={styles.actionIcon}>🏠</div>
          <span style={styles.actionLabel}>Home</span>
        </Link>

        <Link href="/transactions" style={styles.footerAction}>
          <div style={styles.actionIcon}>📋</div>
          <span style={styles.actionLabel}>Activity</span>
        </Link>

        <button 
          style={styles.centerAction}
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div style={styles.centerActionIcon}>
            {isExpanded ? '✕' : '+'}
          </div>
        </button>

        <Link href="/messages" style={styles.footerAction}>
          <div style={styles.actionIcon}>📧</div>
          <span style={styles.actionLabel}>Messages</span>
        </Link>

        <Link href="/profile" style={styles.footerAction}>
          <div style={styles.actionIcon}>👤</div>
          <span style={styles.actionLabel}>Profile</span>
        </Link>
      </div>

      {/* Security Banner */}
      <div style={styles.securityBanner}>
        <div style={styles.securityContent}>
          <span style={styles.securityIcon}>🔒</span>
          <span style={styles.securityText}>FDIC Insured • SSL Secured • Member FDIC</span>
          <span style={styles.routingInfo}>Routing: 075915826</span>
        </div>
      </div>
    </div>
  );
}

const styles = {
  stickyFooter: {
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
  },

  // Overlay
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: -1
  },

  // Expanded Menu
  expandedMenu: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: '20px',
    borderTopRightRadius: '20px',
    padding: '20px',
    marginBottom: '80px',
    boxShadow: '0 -10px 30px rgba(0, 0, 0, 0.15)',
    border: '1px solid #e2e8f0',
    maxHeight: '60vh',
    overflowY: 'auto'
  },

  expandedHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
    paddingBottom: '15px',
    borderBottom: '2px solid #f1f5f9'
  },

  expandedTitle: {
    fontSize: '1.3rem',
    fontWeight: '700',
    color: '#1e293b',
    margin: 0
  },

  closeButton: {
    background: '#f1f5f9',
    border: 'none',
    borderRadius: '50%',
    width: '35px',
    height: '35px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    fontSize: '16px',
    color: '#64748b',
    transition: 'all 0.2s ease'
  },

  quickActionsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
    gap: '15px',
    marginBottom: '20px'
  },

  quickActionLink: {
    textDecoration: 'none',
    color: 'inherit'
  },

  quickActionCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '15px',
    backgroundColor: '#f8fafc',
    borderRadius: '12px',
    border: '1px solid #e2e8f0',
    transition: 'all 0.2s ease',
    cursor: 'pointer'
  },

  quickActionIcon: {
    fontSize: '1.5rem',
    minWidth: '30px'
  },

  quickActionText: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px'
  },

  quickActionLabel: {
    fontSize: '0.9rem',
    fontWeight: '600',
    color: '#1e293b'
  },

  quickActionDesc: {
    fontSize: '0.75rem',
    color: '#64748b'
  },

  emergencyContact: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '15px',
    backgroundColor: '#fef2f2',
    borderRadius: '10px',
    border: '1px solid #fecaca'
  },

  emergencyIcon: {
    fontSize: '1.2rem'
  },

  emergencyLabel: {
    display: 'block',
    fontSize: '0.8rem',
    fontWeight: '600',
    color: '#dc2626'
  },

  emergencyNumber: {
    display: 'block',
    fontSize: '0.9rem',
    fontWeight: '700',
    color: '#991b1b',
    fontFamily: 'monospace'
  },

  // Main Footer Bar
  footerBar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: '#1e293b',
    padding: '12px 0 8px 0',
    boxShadow: '0 -5px 20px rgba(0, 0, 0, 0.1)'
  },

  footerAction: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '4px',
    textDecoration: 'none',
    color: '#cbd5e1',
    transition: 'all 0.2s ease',
    padding: '8px 12px',
    borderRadius: '8px',
    minWidth: '60px'
  },

  actionIcon: {
    fontSize: '1.3rem',
    marginBottom: '2px'
  },

  actionLabel: {
    fontSize: '0.7rem',
    fontWeight: '500',
    textAlign: 'center'
  },

  centerAction: {
    backgroundColor: '#059669',
    border: 'none',
    borderRadius: '50%',
    width: '55px',
    height: '55px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    boxShadow: '0 4px 15px rgba(5, 150, 105, 0.3)',
    transition: 'all 0.2s ease',
    transform: 'translateY(-5px)'
  },

  centerActionIcon: {
    fontSize: '1.5rem',
    color: '#ffffff',
    fontWeight: 'bold'
  },

  // Security Banner
  securityBanner: {
    backgroundColor: '#0f172a',
    padding: '8px 0',
    borderTop: '1px solid #334155'
  },

  securityContent: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    flexWrap: 'wrap',
    padding: '0 20px'
  },

  securityIcon: {
    fontSize: '0.9rem'
  },

  securityText: {
    fontSize: '0.7rem',
    color: '#94a3b8',
    fontWeight: '500'
  },

  routingInfo: {
    fontSize: '0.7rem',
    color: '#64748b',
    fontFamily: 'monospace',
    fontWeight: '600'
  }
};

// Add hover effects
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = `
    .quickActionCard:hover {
      background-color: #f1f5f9 !important;
      border-color: #3b82f6 !important;
      transform: translateY(-2px);
      box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1) !important;
    }

    .footerAction:hover {
      color: #60a5fa !important;
      background-color: rgba(96, 165, 250, 0.1) !important;
    }

    .centerAction:hover {
      background-color: #047857 !important;
      transform: translateY(-7px) !important;
      box-shadow: 0 8px 25px rgba(5, 150, 105, 0.4) !important;
    }

    .closeButton:hover {
      background-color: #e2e8f0 !important;
      color: #1e293b !important;
    }

    @media (max-width: 480px) {
      .quickActionsGrid {
        grid-template-columns: repeat(2, 1fr) !important;
      }
      
      .securityContent {
        flex-direction: column !important;
        gap: 4px !important;
      }
      
      .footerBar {
        padding: 10px 0 6px 0 !important;
      }
    }
  `;
  document.head.appendChild(styleSheet);
}
