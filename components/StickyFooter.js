import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { supabase } from '../lib/supabaseClient';

export default function StickyFooter() {
  const [user, setUser] = useState(null);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Get initial session
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
    };

    getSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  // Hide footer on certain pages
  useEffect(() => {
    const handleRouteChange = () => {
      const currentPath = window.location.pathname;
      const hiddenPaths = ['/login', '/signup', '/apply', '/enroll', '/dashboard', '/admin'];
      setIsVisible(!hiddenPaths.some(path => currentPath.startsWith(path)));
    };

    handleRouteChange();
    window.addEventListener('popstate', handleRouteChange);

    return () => window.removeEventListener('popstate', handleRouteChange);
  }, []);

  if (!isVisible || user) return null;

  return (
    <div style={styles.stickyFooter} className="sticky-footer">
      <div style={styles.footerContainer}>
        <div style={styles.footerContent} className="sticky-footer-content">
          <div style={styles.footerInfo} className="sticky-footer-info">
            <h3 style={styles.footerTitle} className="sticky-footer-title">Ready to Start Banking with Oakline?</h3>
            <p style={styles.footerSubtitle} className="sticky-footer-subtitle">Join thousands of satisfied customers</p>
          </div>
          <div style={styles.footerButtons} className="sticky-footer-buttons">
            <Link href="/enroll" style={styles.enrollButton} className="sticky-footer-button enroll-button">
              <span style={styles.buttonIcon}>🌐</span>
              Enroll Online
            </Link>
            <Link href="/login" style={styles.signInButton} className="sticky-footer-button sign-in-button">
              <span style={styles.buttonIcon}>👤</span>
              Sign In
            </Link>
            <Link href="/apply" style={styles.openAccountButton} className="sticky-footer-button open-account-button">
              <span style={styles.buttonIcon}>🚀</span>
              Open Account
            </Link>
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
    background: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)',
    boxShadow: '0 -4px 20px rgba(30, 64, 175, 0.3)',
    zIndex: 1000,
    borderTop: '3px solid #FFC857',
    backdropFilter: 'blur(10px)',
    animation: 'slideUpFooter 0.5s ease-out'
  },
  footerContainer: {
    maxWidth: '1400px',
    margin: '0 auto',
    padding: '0 1rem'
  },
  footerContent: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '1rem 0',
    flexWrap: 'wrap',
    gap: '1rem'
  },
  footerInfo: {
    color: 'white',
    flex: '1',
    minWidth: '250px'
  },
  footerTitle: {
    fontSize: 'clamp(1.1rem, 2.5vw, 1.3rem)',
    fontWeight: '700',
    margin: '0 0 0.25rem 0',
    color: 'white'
  },
  footerSubtitle: {
    fontSize: 'clamp(0.85rem, 2vw, 0.95rem)',
    margin: 0,
    opacity: 0.9,
    color: '#cbd5e1'
  },
  footerButtons: {
    display: 'flex',
    gap: '0.75rem',
    flexWrap: 'wrap',
    alignItems: 'center'
  },
  enrollButton: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: 'clamp(0.6rem, 2vw, 0.8rem) clamp(1rem, 3vw, 1.2rem)',
    backgroundColor: '#059669',
    color: 'white',
    textDecoration: 'none',
    borderRadius: '8px',
    fontSize: 'clamp(0.8rem, 2vw, 0.9rem)',
    fontWeight: '600',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 12px rgba(5, 150, 105, 0.3)',
    border: 'none'
  },
  signInButton: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: 'clamp(0.6rem, 2vw, 0.8rem) clamp(1rem, 3vw, 1.2rem)',
    backgroundColor: 'rgba(255,255,255,0.15)',
    color: 'white',
    textDecoration: 'none',
    borderRadius: '8px',
    fontSize: 'clamp(0.8rem, 2vw, 0.9rem)',
    fontWeight: '600',
    transition: 'all 0.3s ease',
    border: '2px solid rgba(255,255,255,0.3)',
    backdropFilter: 'blur(10px)'
  },
  openAccountButton: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: 'clamp(0.6rem, 2vw, 0.8rem) clamp(1rem, 3vw, 1.2rem)',
    backgroundColor: '#FFC857',
    color: '#1e293b',
    textDecoration: 'none',
    borderRadius: '8px',
    fontSize: 'clamp(0.8rem, 2vw, 0.9rem)',
    fontWeight: '700',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 12px rgba(255, 200, 87, 0.4)',
    border: 'none'
  },
  buttonIcon: {
    fontSize: 'clamp(0.9rem, 2vw, 1rem)'
  }
};