
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { supabase } from '../lib/supabaseClient';

export default function StickyFooter() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Get initial session
    const getSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setUser(session?.user ?? null);
      } catch (error) {
        console.error('Error getting session:', error);
      } finally {
        setLoading(false);
      }
    };

    getSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  // Hide footer on certain pages
  useEffect(() => {
    const handleRouteChange = () => {
      const currentPath = window.location.pathname;
      const hiddenPaths = ['/login', '/signup', '/reset-password', '/verify-email'];
      setIsVisible(!hiddenPaths.some(path => currentPath.startsWith(path)));
    };

    handleRouteChange();
    window.addEventListener('popstate', handleRouteChange);

    return () => window.removeEventListener('popstate', handleRouteChange);
  }, []);

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      router.push('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  if (!isVisible || loading) return null;

  return (
    <div style={styles.stickyFooter} className="sticky-footer">
      <div style={styles.footerContainer}>
        <div style={styles.footerContent}>
          {/* Banking Features Section */}
          <div style={styles.featuresSection}>
            <Link href="/dashboard" style={styles.featureButton}>
              <span style={styles.featureIcon}>🏦</span>
              <span style={styles.featureText}>Banking</span>
            </Link>
            <Link href="/cards" style={styles.featureButton}>
              <span style={styles.featureIcon}>💳</span>
              <span style={styles.featureText}>Cards</span>
            </Link>
            <Link href="/loans" style={styles.featureButton}>
              <span style={styles.featureIcon}>💰</span>
              <span style={styles.featureText}>Loans</span>
            </Link>
            <Link href="/investments" style={styles.featureButton}>
              <span style={styles.featureIcon}>📈</span>
              <span style={styles.featureText}>Invest</span>
            </Link>
            <Link href="/support" style={styles.featureButton}>
              <span style={styles.featureIcon}>💬</span>
              <span style={styles.featureText}>Support</span>
            </Link>
          </div>

          {/* Authentication Section */}
          <div style={styles.authSection}>
            {user ? (
              <>
                <div style={styles.userInfo}>
                  <span style={styles.welcomeText}>
                    Welcome, {user.user_metadata?.full_name || user.email?.split('@')[0] || 'User'}
                  </span>
                  <span style={styles.userStatus}>● Online</span>
                </div>
                <div style={styles.authButtons}>
                  <Link href="/dashboard" style={styles.dashboardButton}>
                    <span style={styles.buttonIcon}>📊</span>
                    Dashboard
                  </Link>
                  <button onClick={handleSignOut} style={styles.signOutButton}>
                    <span style={styles.buttonIcon}>🚪</span>
                    Sign Out
                  </button>
                </div>
              </>
            ) : (
              <div style={styles.authButtons}>
                <Link href="/enroll" style={styles.enrollButton}>
                  <span style={styles.buttonIcon}>✨</span>
                  Open Account
                </Link>
                <Link href="/login" style={styles.signInButton}>
                  <span style={styles.buttonIcon}>🔐</span>
                  Sign In
                </Link>
              </div>
            )}
          </div>
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
    background: 'linear-gradient(135deg, #1e40af 0%, #1e3a8a 100%)',
    boxShadow: '0 -4px 20px rgba(30, 64, 175, 0.4)',
    zIndex: 1000,
    borderTop: '2px solid #FFC857',
    backdropFilter: 'blur(15px)',
    height: '70px',
    display: 'flex',
    alignItems: 'center'
  },
  footerContainer: {
    width: '100%',
    maxWidth: '1400px',
    margin: '0 auto',
    padding: '0 1rem'
  },
  footerContent: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    gap: '2rem'
  },
  featuresSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    flex: 1
  },
  featureButton: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '0.25rem',
    padding: '0.5rem 0.75rem',
    textDecoration: 'none',
    color: 'white',
    borderRadius: '8px',
    transition: 'all 0.3s ease',
    minWidth: '60px',
    fontSize: '0.75rem',
    fontWeight: '500',
    background: 'rgba(255, 255, 255, 0.1)',
    border: '1px solid rgba(255, 255, 255, 0.2)'
  },
  featureIcon: {
    fontSize: '1.2rem',
    filter: 'brightness(1.2)'
  },
  featureText: {
    fontSize: '0.7rem',
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: '1'
  },
  authSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem'
  },
  userInfo: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    gap: '0.25rem'
  },
  welcomeText: {
    color: 'white',
    fontSize: '0.85rem',
    fontWeight: '600'
  },
  userStatus: {
    color: '#10b981',
    fontSize: '0.7rem',
    fontWeight: '500'
  },
  authButtons: {
    display: 'flex',
    gap: '0.75rem',
    alignItems: 'center'
  },
  dashboardButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.6rem 1rem',
    backgroundColor: '#059669',
    color: 'white',
    textDecoration: 'none',
    borderRadius: '6px',
    fontSize: '0.85rem',
    fontWeight: '600',
    transition: 'all 0.3s ease',
    boxShadow: '0 2px 8px rgba(5, 150, 105, 0.3)',
    border: 'none'
  },
  signOutButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.6rem 1rem',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    color: 'white',
    border: '1px solid rgba(255, 255, 255, 0.3)',
    borderRadius: '6px',
    fontSize: '0.85rem',
    fontWeight: '600',
    transition: 'all 0.3s ease',
    cursor: 'pointer'
  },
  enrollButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.6rem 1rem',
    backgroundColor: '#FFC857',
    color: '#1e293b',
    textDecoration: 'none',
    borderRadius: '6px',
    fontSize: '0.85rem',
    fontWeight: '700',
    transition: 'all 0.3s ease',
    boxShadow: '0 2px 8px rgba(255, 200, 87, 0.4)',
    border: 'none'
  },
  signInButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.6rem 1rem',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    color: 'white',
    textDecoration: 'none',
    borderRadius: '6px',
    fontSize: '0.85rem',
    fontWeight: '600',
    transition: 'all 0.3s ease',
    border: '1px solid rgba(255, 255, 255, 0.3)'
  },
  buttonIcon: {
    fontSize: '0.9rem'
  }
};
