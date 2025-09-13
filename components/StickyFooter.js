
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
        {/* Quick Navigation */}
        <div style={styles.quickNav}>
          <Link href="/" style={styles.quickNavItem}>
            <span style={styles.icon}>🏠</span>
            <span style={styles.label}>Home</span>
          </Link>
          
          {user ? (
            <>
              <Link href="/dashboard" style={styles.quickNavItem}>
                <span style={styles.icon}>📊</span>
                <span style={styles.label}>Dashboard</span>
              </Link>
              <Link href="/main-menu" style={styles.quickNavItem}>
                <span style={styles.icon}>☰</span>
                <span style={styles.label}>Menu</span>
              </Link>
              <Link href="/transfer" style={styles.quickNavItem}>
                <span style={styles.icon}>💸</span>
                <span style={styles.label}>Transfer</span>
              </Link>
              <Link href="/notifications" style={styles.quickNavItem}>
                <span style={styles.icon}>🔔</span>
                <span style={styles.label}>Alerts</span>
              </Link>
            </>
          ) : (
            <>
              <Link href="/login" style={styles.quickNavItem}>
                <span style={styles.icon}>👤</span>
                <span style={styles.label}>Sign In</span>
              </Link>
              <Link href="/apply" style={styles.quickNavItem}>
                <span style={styles.icon}>🚀</span>
                <span style={styles.label}>Apply</span>
              </Link>
              <Link href="/account-types" style={styles.quickNavItem}>
                <span style={styles.icon}>🏦</span>
                <span style={styles.label}>Accounts</span>
              </Link>
              <Link href="/support" style={styles.quickNavItem}>
                <span style={styles.icon}>🎧</span>
                <span style={styles.label}>Support</span>
              </Link>
            </>
          )}
        </div>

        {/* Main Navigation Links */}
        <div style={styles.mainLinks}>
          <div style={styles.linkGroup}>
            <h4 style={styles.groupTitle}>Banking Services</h4>
            <Link href="/account-types" style={styles.link}>Account Types</Link>
            <Link href="/loans" style={styles.link}>Loans & Credit</Link>
            <Link href="/investments" style={styles.link}>Investments</Link>
            <Link href="/cards" style={styles.link}>Credit Cards</Link>
          </div>

          <div style={styles.linkGroup}>
            <h4 style={styles.groupTitle}>Digital Banking</h4>
            {user ? (
              <>
                <Link href="/dashboard" style={styles.link}>Online Banking</Link>
                <Link href="/transfer" style={styles.link}>Money Transfer</Link>
                <Link href="/bill-pay" style={styles.link}>Bill Pay</Link>
                <Link href="/messages" style={styles.link}>Messages</Link>
              </>
            ) : (
              <>
                <Link href="/login" style={styles.link}>Online Banking</Link>
                <Link href="/apply" style={styles.link}>Open Account</Link>
                <Link href="/mobile-app" style={styles.link}>Mobile App</Link>
                <Link href="/security" style={styles.link}>Security</Link>
              </>
            )}
          </div>

          <div style={styles.linkGroup}>
            <h4 style={styles.groupTitle}>Support & Info</h4>
            <Link href="/support" style={styles.link}>Customer Support</Link>
            <Link href="/faq" style={styles.link}>FAQ</Link>
            <Link href="/branch-locator" style={styles.link}>Branch Locator</Link>
            <Link href="/financial-education" style={styles.link}>Financial Education</Link>
          </div>

          <div style={styles.linkGroup}>
            <h4 style={styles.groupTitle}>Company</h4>
            <Link href="/about" style={styles.link}>About Us</Link>
            <Link href="/market-news" style={styles.link}>Market News</Link>
            <Link href="/compliance" style={styles.link}>Compliance</Link>
            <Link href="/privacy" style={styles.link}>Privacy Policy</Link>
          </div>
        </div>

        {/* Contact Info & Logo */}
        <div style={styles.bottomSection}>
          <div style={styles.brandSection}>
            <div style={styles.logoContainer}>
              <img src="/images/logo-primary.png" alt="Oakline Bank" style={styles.logo} />
              <div style={styles.brandInfo}>
                <span style={styles.brandName}>Oakline Bank</span>
                <span style={styles.tagline}>Your Financial Partner</span>
              </div>
            </div>
            <div style={styles.contactInfo}>
              <div style={styles.contactItem}>
                <span style={styles.contactIcon}>📞</span>
                <span style={styles.contactText}>1-800-OAKLINE</span>
              </div>
              <div style={styles.contactItem}>
                <span style={styles.contactIcon}>📧</span>
                <span style={styles.contactText}>support@oaklinebank.com</span>
              </div>
              <div style={styles.contactItem}>
                <span style={styles.contactIcon}>🏦</span>
                <span style={styles.contactText}>Routing: 075915826</span>
              </div>
            </div>
          </div>

          <div style={styles.legalSection}>
            <div style={styles.legalLinks}>
              <Link href="/terms" style={styles.legalLink}>Terms of Service</Link>
              <Link href="/privacy" style={styles.legalLink}>Privacy Policy</Link>
              <Link href="/accessibility" style={styles.legalLink}>Accessibility</Link>
              <Link href="/disclosures" style={styles.legalLink}>Disclosures</Link>
            </div>
            <div style={styles.copyright}>
              <p style={styles.copyrightText}>
                © {new Date().getFullYear()} Oakline Bank. All rights reserved.
              </p>
              <p style={styles.fdic}>
                Member FDIC. Equal Housing Lender.
              </p>
            </div>
          </div>
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
    boxShadow: '0 -4px 20px rgba(0,0,0,0.15)',
    zIndex: 999,
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    overflowY: 'auto',
    maxHeight: '50vh',
  },
  container: {
    maxWidth: '1400px',
    margin: '0 auto',
    padding: '1rem',
  },
  quickNav: {
    display: 'flex',
    justifyContent: 'center',
    gap: '0.5rem',
    paddingBottom: '1rem',
    borderBottom: '1px solid rgba(255,255,255,0.1)',
    marginBottom: '1rem',
    flexWrap: 'wrap',
  },
  quickNavItem: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '0.25rem',
    padding: '0.75rem 1rem',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: '12px',
    textDecoration: 'none',
    color: 'white',
    transition: 'all 0.2s',
    minWidth: '70px',
    border: '1px solid rgba(255,255,255,0.1)',
  },
  icon: {
    fontSize: '1.2rem',
  },
  label: {
    fontSize: '0.75rem',
    fontWeight: '500',
    textAlign: 'center',
  },
  mainLinks: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '1.5rem',
    marginBottom: '1.5rem',
  },
  linkGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },
  groupTitle: {
    fontSize: '0.9rem',
    fontWeight: 'bold',
    marginBottom: '0.5rem',
    color: '#fbbf24',
    borderBottom: '1px solid rgba(251, 191, 36, 0.3)',
    paddingBottom: '0.25rem',
  },
  link: {
    color: 'rgba(255,255,255,0.8)',
    textDecoration: 'none',
    fontSize: '0.85rem',
    padding: '0.25rem 0',
    transition: 'color 0.2s',
  },
  bottomSection: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '2rem',
    borderTop: '1px solid rgba(255,255,255,0.1)',
    paddingTop: '1rem',
  },
  brandSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  logoContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
  },
  logo: {
    height: '35px',
    width: 'auto',
  },
  brandInfo: {
    display: 'flex',
    flexDirection: 'column',
  },
  brandName: {
    fontSize: '1.1rem',
    fontWeight: 'bold',
    color: 'white',
  },
  tagline: {
    fontSize: '0.8rem',
    color: 'rgba(255,255,255,0.7)',
  },
  contactInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
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
    color: 'rgba(255,255,255,0.9)',
  },
  legalSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    justifyContent: 'space-between',
  },
  legalLinks: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '1rem',
  },
  legalLink: {
    color: 'rgba(255,255,255,0.7)',
    textDecoration: 'none',
    fontSize: '0.75rem',
    transition: 'color 0.2s',
  },
  copyright: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.25rem',
  },
  copyrightText: {
    fontSize: '0.75rem',
    color: 'rgba(255,255,255,0.6)',
    margin: 0,
  },
  fdic: {
    fontSize: '0.7rem',
    color: 'rgba(255,255,255,0.5)',
    margin: 0,
  },
};

// Add responsive styles and hover effects
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = `
    /* Hover Effects */
    footer a:hover {
      color: #fbbf24 !important;
      transform: translateY(-1px);
    }
    
    .quickNavItem:hover {
      background-color: rgba(255,255,255,0.2) !important;
      border-color: rgba(251, 191, 36, 0.5) !important;
    }
    
    /* Mobile Responsive */
    @media (max-width: 768px) {
      .quickNav {
        gap: 0.25rem;
      }
      
      .quickNavItem {
        padding: 0.5rem 0.75rem;
        min-width: 60px;
      }
      
      .icon {
        font-size: 1rem;
      }
      
      .label {
        font-size: 0.7rem;
      }
      
      .mainLinks {
        grid-template-columns: 1fr 1fr;
        gap: 1rem;
      }
      
      .bottomSection {
        grid-template-columns: 1fr;
        gap: 1rem;
      }
      
      .legalLinks {
        gap: 0.5rem;
      }
      
      .brandName {
        font-size: 1rem;
      }
      
      .tagline {
        font-size: 0.75rem;
      }
    }
    
    @media (max-width: 480px) {
      .mainLinks {
        grid-template-columns: 1fr;
      }
      
      .quickNav {
        justify-content: space-around;
      }
      
      .quickNavItem {
        flex: 1;
        max-width: 80px;
      }
    }
  `;
  document.head.appendChild(styleSheet);
}
