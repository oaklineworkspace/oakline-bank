import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { supabase } from '../lib/supabaseClient';
import MainMenu from '../components/MainMenu';
import WelcomeBanner from '../components/WelcomeBanner';
import HeroSection from '../components/HeroSection';
import ServicesSection from '../components/ServicesSection';
import FeaturesSection from '../components/FeaturesSection';
import LoanApprovalSection from '../components/LoanApprovalSection';
import TestimonialsSection from '../components/TestimonialsSection';
import CTA from '../components/CTA';
import Footer from '../components/Footer';

// Enrollment Button Component
function EnrollmentButton() {
  const [showEmailInput, setShowEmailInput] = useState(false);
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleEnrollmentRequest = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      // Check if email exists in applications table
      const { data: application, error } = await supabase
        .from('applications')
        .select('id, email, first_name, last_name')
        .eq('email', email.toLowerCase().trim())
        .single();

      if (error || !application) {
        setMessage('Email not found. Please apply for an account first or check your email address.');
        setLoading(false);
        return;
      }

      // Request enrollment email resend
      const response = await fetch('/api/resend-enrollment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ applicationId: application.id })
      });

      const result = await response.json();

      if (response.ok) {
        setMessage('Enrollment email sent! Please check your inbox and spam folder.');
        setEmail('');
        setShowEmailInput(false);
      } else {
        setMessage(result.error || 'Failed to send enrollment email. Please try again.');
      }
    } catch (error) {
      console.error('Enrollment request error:', error);
      setMessage('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (showEmailInput) {
    return (
      <div style={styles.enrollmentInputContainer}>
        <form onSubmit={handleEnrollmentRequest} style={styles.enrollmentForm}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email address"
            required
            style={styles.emailInput}
          />
          <div style={styles.enrollmentFormButtons}>
            <button type="submit" disabled={loading} style={styles.submitButton}>
              {loading ? 'Sending...' : 'Send Enrollment Link'}
            </button>
            <button
              type="button"
              onClick={() => {
                setShowEmailInput(false);
                setMessage('');
                setEmail('');
              }}
              style={styles.cancelButton}
            >
              Cancel
            </button>
          </div>
        </form>
        {message && (
          <div style={{
            ...styles.message,
            color: message.includes('sent') ? '#059669' : '#dc2626',
            backgroundColor: message.includes('sent') ? '#d1fae5' : '#fee2e2'
          }}>
            {message}
          </div>
        )}
      </div>
    );
  }

  return (
    <button onClick={() => setShowEmailInput(true)} style={styles.enrollButton}>
      <span style={styles.enrollButtonIcon}>🔐</span>
      Enroll for Online Access
    </button>
  );
}

export default function Home() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    checkAuthState();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' || event === 'SIGNED_OUT') {
        checkAuthState();
      }
    });

    return () => subscription.unsubscribe();
  }, []);


  const checkAuthState = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const { data: { user } } = await supabase.auth.getUser();

      // Double check - if we have session but no user, or vice versa
      if (session && user) {
        setUser(user);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('Error checking auth:', error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };


  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      router.push('/');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.loading}>Loading...</div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <MainMenu user={user} />

      {/* Top Action Buttons */}
      <section style={styles.topActionsSection}>
        <div style={styles.container}>
          <div style={styles.topActions}>
            {!user ? (
              // Guest user buttons
              <>
                <Link href="/apply" style={styles.primaryActionButton}>
                  <span style={styles.actionButtonIcon}>🏦</span>
                  Open New Account
                </Link>
                <EnrollmentButton />
                <Link href="/login" style={styles.secondaryActionButton}>
                  <span style={styles.actionButtonIcon}>🔐</span>
                  Sign In
                </Link>
              </>
            ) : (
              // Logged-in user buttons
              <>
                <div style={styles.userGreeting}>
                  Welcome back, {user.email?.split('@')[0] || 'User'}!
                </div>
                <Link href="/main-menu" style={styles.loggedInButton}>
                  <span style={styles.actionButtonIcon}>🏠</span>
                  Main Menu
                </Link>
                <Link href="/dashboard" style={styles.loggedInButton}>
                  <span style={styles.actionButtonIcon}>📊</span>
                  Dashboard
                </Link>
                <button onClick={handleLogout} style={styles.logoutActionButton}>
                  <span style={styles.actionButtonIcon}>🚪</span>
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      </section>

      <WelcomeBanner />

      <main>
        <HeroSection />
        <ServicesSection />
        <FeaturesSection />
        <LoanApprovalSection />
        <TestimonialsSection />

        {/* Conditional Enrollment/Dashboard Section */}
        {!user ? (
          // Guest enrollment section
          <section style={styles.enrollmentSection}>
            <div style={styles.container}>
              <div style={styles.enrollmentContent}>
                <h2 style={styles.enrollmentTitle}>Already Have an Account?</h2>
                <p style={styles.enrollmentSubtitle}>
                  Enroll for online banking access to manage your accounts, transfer funds, pay bills, and more.
                </p>
                <div style={styles.enrollmentButtons}>
                  <EnrollmentButton />
                  <Link href="/login" style={styles.loginButton}>
                    Already Enrolled? Sign In
                  </Link>
                </div>
                <div style={styles.enrollmentFeatures}>
                  <div style={styles.feature}>
                    <span style={styles.featureIcon}>📱</span>
                    <span>Mobile Banking</span>
                  </div>
                  <div style={styles.feature}>
                    <span style={styles.featureIcon}>💳</span>
                    <span>Bill Pay</span>
                  </div>
                  <div style={styles.feature}>
                    <span style={styles.featureIcon}>📊</span>
                    <span>Account Management</span>
                  </div>
                  <div style={styles.feature}>
                    <span style={styles.featureIcon}>🔒</span>
                    <span>Secure Transfers</span>
                  </div>
                </div>
              </div>
            </div>
          </section>
        ) : (
          // Logged-in user quick access section
          <section style={styles.userDashboardSection}>
            <div style={styles.container}>
              <div style={styles.userDashboardContent}>
                <h2 style={styles.userDashboardTitle}>Quick Access</h2>
                <p style={styles.userDashboardSubtitle}>
                  Access your most used banking features quickly
                </p>
                <div style={styles.quickAccessGrid}>
                  <Link href="/dashboard" style={styles.quickAccessCard}>
                    <span style={styles.quickAccessIcon}>📊</span>
                    <span>Dashboard</span>
                  </Link>
                  <Link href="/transfer" style={styles.quickAccessCard}>
                    <span style={styles.quickAccessIcon}>💸</span>
                    <span>Transfer</span>
                  </Link>
                  <Link href="/deposit-real" style={styles.quickAccessCard}>
                    <span style={styles.quickAccessIcon}>📥</span>
                    <span>Deposit</span>
                  </Link>
                  <Link href="/transactions" style={styles.quickAccessCard}>
                    <span style={styles.quickAccessIcon}>📋</span>
                    <span>Transactions</span>
                  </Link>
                  <Link href="/admin/admin-dashboard" style={styles.quickAccessCard}>
                    <span style={styles.quickAccessIcon}>👑</span>
                    <span>Admin Dashboard</span>
                  </Link>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* CTAs based on user state */}
        {!user ? (
          <>
            <CTA
              title="New to Oakline Bank?"
              subtitle="Join over 500,000 customers who trust Oakline Bank for their financial needs. Open your account today and experience the difference."
              buttonText="Open New Account"
              buttonLink="/apply"
              variant="primary"
            />
            <CTA
              title="Ready to Start Your Financial Journey?"
              subtitle="Whether you're opening a new account or need banking services, we're here to help you achieve your financial goals."
              buttonText="Explore Our Services"
              buttonLink="/apply"
              variant="secondary"
            />
          </>
        ) : (
          <CTA
            title="Explore More Banking Services"
            subtitle="Discover additional ways we can help you manage and grow your finances with our comprehensive banking solutions."
            buttonText="View All Services"
            buttonLink="/main-menu"
            variant="primary"
          />
        )}
      </main>

      <Footer />
    </div>
  );
}

const styles = {
  loadingContainer: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f8fafc'
  },
  loading: {
    fontSize: '1.2rem',
    color: '#64748b'
  },
  topActionsSection: {
    background: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)',
    padding: '1.5rem 0',
    borderBottom: '1px solid #1e40af'
  },
  topActions: {
    display: 'flex',
    gap: '1rem',
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap'
  },
  userGreeting: {
    color: 'white',
    fontSize: '1rem',
    fontWeight: '600',
    padding: '12px 16px'
  },
  primaryActionButton: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    padding: '12px 24px',
    background: 'rgba(255, 255, 255, 0.2)',
    color: 'white',
    textDecoration: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600',
    border: '2px solid rgba(255, 255, 255, 0.3)',
    transition: 'all 0.3s ease',
    backdropFilter: 'blur(10px)'
  },
  secondaryActionButton: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    padding: '12px 24px',
    background: 'transparent',
    color: 'white',
    textDecoration: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600',
    border: '2px solid rgba(255, 255, 255, 0.5)',
    transition: 'all 0.3s ease'
  },
  loggedInButton: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    padding: '12px 24px',
    background: 'rgba(255, 255, 255, 0.15)',
    color: 'white',
    textDecoration: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600',
    border: '2px solid rgba(255, 255, 255, 0.2)',
    transition: 'all 0.3s ease'
  },
  logoutActionButton: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    padding: '12px 24px',
    background: 'rgba(220, 38, 38, 0.8)',
    color: 'white',
    border: '1px solid rgba(220, 38, 38, 0.9)',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease'
  },
  actionButtonIcon: {
    fontSize: '16px'
  },
  enrollmentSection: {
    padding: '4rem 0',
    background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
    borderTop: '1px solid #e2e8f0',
    borderBottom: '1px solid #e2e8f0'
  },
  userDashboardSection: {
    padding: '4rem 0',
    background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
    borderTop: '1px solid #bae6fd',
    borderBottom: '1px solid #bae6fd'
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 2rem'
  },
  enrollmentContent: {
    textAlign: 'center',
    maxWidth: '800px',
    margin: '0 auto'
  },
  userDashboardContent: {
    textAlign: 'center',
    maxWidth: '800px',
    margin: '0 auto'
  },
  enrollmentTitle: {
    fontSize: 'clamp(28px, 4vw, 36px)',
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: '1rem',
    lineHeight: '1.2'
  },
  userDashboardTitle: {
    fontSize: 'clamp(28px, 4vw, 36px)',
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: '1rem',
    lineHeight: '1.2'
  },
  enrollmentSubtitle: {
    fontSize: '18px',
    color: '#64748b',
    marginBottom: '2.5rem',
    lineHeight: '1.6'
  },
  userDashboardSubtitle: {
    fontSize: '18px',
    color: '#64748b',
    marginBottom: '2.5rem',
    lineHeight: '1.6'
  },
  enrollmentButtons: {
    display: 'flex',
    gap: '1rem',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: '3rem',
    flexWrap: 'wrap'
  },
  quickAccessGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '1.5rem',
    marginTop: '2rem'
  },
  quickAccessCard: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '8px',
    padding: '1.5rem',
    background: 'white',
    borderRadius: '12px',
    boxShadow: '0 4px 14px rgba(0,0,0,0.1)',
    textDecoration: 'none',
    color: '#374151',
    fontSize: '16px',
    fontWeight: '600',
    transition: 'all 0.3s ease'
  },
  quickAccessIcon: {
    fontSize: '2rem'
  },
  enrollButton: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    padding: '16px 32px',
    background: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)',
    color: 'white',
    textDecoration: 'none',
    borderRadius: '12px',
    fontSize: '16px',
    fontWeight: '600',
    boxShadow: '0 4px 14px rgba(30, 64, 175, 0.3)',
    transition: 'all 0.3s ease',
    minHeight: '52px',
    border: 'none',
    cursor: 'pointer'
  },
  enrollButtonIcon: {
    fontSize: '18px'
  },
  loginButton: {
    display: 'inline-flex',
    alignItems: 'center',
    padding: '16px 32px',
    background: 'transparent',
    color: '#1e40af',
    textDecoration: 'none',
    borderRadius: '12px',
    fontSize: '16px',
    fontWeight: '600',
    border: '2px solid #1e40af',
    transition: 'all 0.3s ease',
    minHeight: '52px'
  },
  enrollmentFeatures: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '1.5rem',
    marginTop: '2rem'
  },
  feature: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    padding: '1rem',
    background: 'white',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    fontSize: '14px',
    fontWeight: '500',
    color: '#374151'
  },
  featureIcon: {
    fontSize: '18px'
  },
  enrollmentInputContainer: {
    background: 'white',
    padding: '20px',
    borderRadius: '12px',
    boxShadow: '0 4px 14px rgba(0,0,0,0.1)',
    minWidth: '300px'
  },
  enrollmentForm: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
  },
  emailInput: {
    padding: '12px 16px',
    border: '2px solid #e5e7eb',
    borderRadius: '8px',
    fontSize: '16px',
    outline: 'none'
  },
  enrollmentFormButtons: {
    display: 'flex',
    gap: '8px'
  },
  submitButton: {
    flex: 1,
    padding: '12px 16px',
    background: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer'
  },
  cancelButton: {
    flex: 1,
    padding: '12px 16px',
    background: 'transparent',
    color: '#6b7280',
    border: '2px solid #d1d5db',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer'
  },
  message: {
    padding: '12px',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: '500',
    marginTop: '12px',
    textAlign: 'center'
  }
};