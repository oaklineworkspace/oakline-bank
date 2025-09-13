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
          {/* Single Row Navigation Buttons */}
          <div style={styles.navigationSection}>
            <Link href="/" style={styles.navButton}>
              <span style={styles.navIcon}>🏠</span>
              <span style={styles.navText}>Home</span>
            </Link>
            
            <Link href="/main-menu" style={styles.navButton}>
              <span style={styles.navIcon}>☰</span>
              <span style={styles.navText}>Menu</span>
            </Link>
            
            {user ? (
              <>
                <Link href="/dashboard" style={styles.navButton}>
                  <span style={styles.navIcon}>📊</span>
                  <span style={styles.navText}>Dashboard</span>
                </Link>
                
                <Link href="/profile" style={styles.navButton}>
                  <span style={styles.navIcon}>👤</span>
                  <span style={styles.navText}>Profile</span>
                </Link>
                
                <button onClick={handleSignOut} style={styles.navButton}>
                  <span style={styles.navIcon}>🚪</span>
                  <span style={styles.navText}>Sign Out</span>
                </button>
              </>
            ) : (
              <>
                <Link href="/login" style={styles.navButton}>
                  <span style={styles.navIcon}>🔐</span>
                  <span style={styles.navText}>Sign In</span>
                </Link>
                
                <Link href="/apply" style={styles.navButton}>
                  <span style={styles.navIcon}>✨</span>
                  <span style={styles.navText}>Open Account</span>
                </Link>
              </>
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
    background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)',
    color: 'white',
    padding: '1rem 1.5rem',
    boxShadow: '0 -8px 32px rgba(0, 0, 0, 0.3)',
    backdropFilter: 'blur(20px)',
    zIndex: 1000,
    borderTop: '1px solid rgba(255, 255, 255, 0.08)',
    minHeight: '70px',
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
    maxWidth: '1400px',
    margin: '0 auto',
    gap: '1.5rem',
    flexWrap: 'wrap'
  },
  navigationSection: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    gap: '0.5rem'
  },
  navButton: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '0.75rem 0.5rem',
    backgroundColor: 'white',
    color: '#1A3E6F',
    textDecoration: 'none',
    borderRadius: '12px',
    fontSize: '0.75rem',
    fontWeight: '600',
    transition: 'all 0.3s ease',
    cursor: 'pointer',
    border: '2px solid rgba(26, 62, 111, 0.1)',
    boxShadow: '0 2px 8px rgba(26, 62, 111, 0.15)',
    minHeight: '60px',
    flex: 1,
    backdropFilter: 'blur(10px)'
  },
  navIcon: {
    fontSize: '1.2rem',
    marginBottom: '0.25rem',
    filter: 'brightness(0.8)'
  },
  navText: {
    fontSize: '0.7rem',
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: '1',
    color: '#1A3E6F'
  }
};