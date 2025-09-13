import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '../lib/supabaseClient';

export default function StickyFooter() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    const getSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setUser(session?.user || null);
      } catch (error) {
        console.error('Error getting session:', error);
      } finally {
        setLoading(false);
      }
    };

    getSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user || null);
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return null; // Don't render while loading
  }

  return (
    <footer style={styles.footer}>
      <div style={styles.container}>
        {/* Quick Action Buttons */}
        <div style={styles.quickActions}>
          <Link href="/" style={styles.actionButton}>
            <span style={styles.actionIcon}>🏠</span>
            <span style={styles.actionLabel}>Home</span>
          </Link>

          {user ? (
            <>
              <Link href="/dashboard" style={styles.actionButton}>
                <span style={styles.actionIcon}>📊</span>
                <span style={styles.actionLabel}>Dashboard</span>
              </Link>
              <Link href="/main-menu" style={styles.actionButton}>
                <span style={styles.actionIcon}>☰</span>
                <span style={styles.actionLabel}>Menu</span>
              </Link>
              <Link href="/transfer" style={styles.actionButton}>
                <span style={styles.actionIcon}>💸</span>
                <span style={styles.actionLabel}>Transfer</span>
              </Link>
              <Link href="/notifications" style={styles.actionButton}>
                <span style={styles.actionIcon}>🔔</span>
                <span style={styles.actionLabel}>Alerts</span>
              </Link>
            </>
          ) : (
            <>
              <Link href="/login" style={styles.actionButton}>
                <span style={styles.actionIcon}>👤</span>
                <span style={styles.actionLabel}>Login</span>
              </Link>
              <Link href="/main-menu" style={styles.actionButton}>
                <span style={styles.actionIcon}>☰</span>
                <span style={styles.actionLabel}>Menu</span>
              </Link>
              <Link href="/apply" style={styles.actionButton}>
                <span style={styles.actionIcon}>🚀</span>
                <span style={styles.actionLabel}>Apply</span>
              </Link>
              <Link href="/support" style={styles.actionButton}>
                <span style={styles.actionIcon}>🎧</span>
                <span style={styles.actionLabel}>Support</span>
              </Link>
            </>
          )}
        </div>

        {/* Bank Info Bar */}
        <div style={styles.bankInfo}>
          <div style={styles.logoSection}>
            <img src="/images/logo-primary.png" alt="Oakline Bank" style={styles.logo} />
            <div style={styles.bankDetails}>
              <span style={styles.bankName}>Oakline Bank</span>
              <span style={styles.fdic}>Member FDIC • Equal Housing Lender</span>
            </div>
          </div>

          <div style={styles.contactInfo}>
            <div style={styles.contactItem}>
              <span style={styles.contactIcon}>📞</span>
              <span style={styles.contactText}>1-800-OAKLINE</span>
            </div>
            <div style={styles.contactItem}>
              <span style={styles.contactIcon}>🏦</span>
              <span style={styles.contactText}>Routing: 075915826</span>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div style={styles.copyright}>
          <p style={styles.copyrightText}>
            © {new Date().getFullYear()} Oakline Bank. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

const styles = {
  footer: {
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#1e40af',
    color: 'white',
    boxShadow: '0 -4px 20px rgba(0,0,0,0.2)',
    zIndex: 1000,
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    borderTop: '2px solid #3b82f6',
  },
  container: {
    maxWidth: '100%',
    padding: '0.75rem 1rem',
  },
  quickActions: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '0.5rem',
    marginBottom: '0.75rem',
    flexWrap: 'wrap',
  },
  actionButton: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '0.25rem',
    padding: '0.75rem 1rem',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: '10px',
    textDecoration: 'none',
    color: 'white',
    transition: 'all 0.2s ease',
    minWidth: '70px',
    border: '1px solid rgba(255,255,255,0.15)',
    backdropFilter: 'blur(10px)',
  },
  actionIcon: {
    fontSize: '1.2rem',
    marginBottom: '2px',
  },
  actionLabel: {
    fontSize: '0.75rem',
    fontWeight: '600',
    textAlign: 'center',
    letterSpacing: '0.5px',
  },
  bankInfo: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: '0.75rem',
    borderBottom: '1px solid rgba(255,255,255,0.2)',
    marginBottom: '0.5rem',
    flexWrap: 'wrap',
    gap: '1rem',
  },
  logoSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
  },
  logo: {
    height: '32px',
    width: 'auto',
  },
  bankDetails: {
    display: 'flex',
    flexDirection: 'column',
  },
  bankName: {
    fontSize: '1.1rem',
    fontWeight: 'bold',
    color: 'white',
    lineHeight: '1.2',
  },
  fdic: {
    fontSize: '0.7rem',
    color: 'rgba(255,255,255,0.8)',
    fontWeight: '500',
  },
  contactInfo: {
    display: 'flex',
    gap: '1.5rem',
    alignItems: 'center',
  },
  contactItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  contactIcon: {
    fontSize: '0.9rem',
  },
  contactText: {
    fontSize: '0.85rem',
    color: 'rgba(255,255,255,0.95)',
    fontWeight: '500',
  },
  copyright: {
    textAlign: 'center',
  },
  copyrightText: {
    fontSize: '0.75rem',
    color: 'rgba(255,255,255,0.7)',
    margin: 0,
    fontWeight: '400',
  },
};

// Add hover effects and responsive styles
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = `
    /* Hover Effects */
    .actionButton:hover {
      background-color: rgba(255,255,255,0.2) !important;
      border-color: rgba(59, 130, 246, 0.8) !important;
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    }

    /* Ensure body has bottom padding to prevent content overlap */
    body {
      padding-bottom: 120px !important;
    }

    /* Mobile Responsive */
    @media (max-width: 768px) {
      .quickActions {
        gap: 0.25rem;
        justify-content: space-around;
      }

      .actionButton {
        padding: 0.6rem 0.8rem;
        min-width: 65px;
      }

      .actionIcon {
        font-size: 1rem;
      }

      .actionLabel {
        font-size: 0.7rem;
      }

      .bankInfo {
        flex-direction: column;
        gap: 0.75rem;
        text-align: center;
      }

      .contactInfo {
        gap: 1rem;
        justify-content: center;
      }

      .bankName {
        font-size: 1rem;
      }

      .contactText {
        font-size: 0.8rem;
      }
    }

    @media (max-width: 480px) {
      .actionButton {
        flex: 1;
        max-width: 80px;
        padding: 0.5rem 0.6rem;
      }

      .contactInfo {
        flex-direction: column;
        gap: 0.5rem;
      }

      body {
        padding-bottom: 140px !important;
      }
    }

    /* Ensure the footer doesn't overlap with page content */
    main, .main-content, .page-content {
      padding-bottom: 120px !important;
    }

    @media (max-width: 480px) {
      main, .main-content, .page-content {
        padding-bottom: 140px !important;
      }
    }
  `;
  document.head.appendChild(styleSheet);
}