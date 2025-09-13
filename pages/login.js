
import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useRouter } from 'next/router';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (error) throw error;

      if (data.user) {
        setMessage('Login successful! Redirecting to dashboard...');
        setTimeout(() => {
          router.push('/dashboard');
        }, 1000);
      }

    } catch (error) {
      setMessage(`Login failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      {/* Single Clean Header */}
      <header style={styles.header}>
        <div style={styles.headerContainer}>
          <div style={styles.headerContent}>
            <Link href="/" style={styles.logoContainer}>
              <img src="/images/logo-primary.png" alt="Oakline Bank" style={styles.logo} />
              <div style={styles.brandInfo}>
                <span style={styles.bankName}>Oakline Bank</span>
                <span style={styles.tagline}>Secure Banking Access</span>
              </div>
            </Link>

            <div style={styles.headerActions}>
              <Link href="/" style={styles.headerButton}>
                <span style={styles.buttonIcon}>🏠</span>
                Home
              </Link>
              <Link href="/apply" style={styles.headerButton}>
                <span style={styles.buttonIcon}>🚀</span>
                Open Account
              </Link>
              <Link href="/support" style={styles.headerButton}>
                <span style={styles.buttonIcon}>💬</span>
                Support
              </Link>
            </div>
          </div>

          <div style={styles.headerInfo}>
            <div style={styles.infoItem}>
              <span style={styles.infoLabel}>Routing Number:</span>
              <span style={styles.infoValue}>075915826</span>
            </div>
            <div style={styles.infoItem}>
              <span style={styles.infoLabel}>24/7 Support:</span>
              <span style={styles.infoValue}>1-800-OAKLINE</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main style={styles.main}>
        <div style={styles.contentWrapper}>
          {/* Login Form Section */}
          <div style={styles.loginSection}>
            <div style={styles.loginCard}>
              <div style={styles.loginHeader}>
                <div style={styles.cardLogo}>
                  <img src="/images/logo-primary.png" alt="Oakline Bank" style={styles.cardLogoImg} />
                </div>
                <h1 style={styles.loginTitle}>Welcome Back</h1>
                <p style={styles.loginSubtitle}>Sign in to your Oakline Bank account</p>
              </div>

              <form onSubmit={handleSubmit} style={styles.form}>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Email Address</label>
                  <input
                    type="email"
                    name="email"
                    placeholder="Enter your email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    style={styles.input}
                  />
                </div>

                <div style={styles.inputGroup}>
                  <label style={styles.label}>Password</label>
                  <input
                    type="password"
                    name="password"
                    placeholder="Enter your password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    style={styles.input}
                  />
                  <Link href="/reset-password" style={styles.forgotPassword}>
                    Forgot your password?
                  </Link>
                </div>

                <button 
                  type="submit" 
                  disabled={loading}
                  style={{
                    ...styles.loginButton,
                    backgroundColor: loading ? '#9ca3af' : '#1A3E6F',
                    cursor: loading ? 'not-allowed' : 'pointer'
                  }}
                >
                  {loading ? (
                    <span style={styles.loadingContent}>
                      <span style={styles.spinner}></span>
                      Signing In...
                    </span>
                  ) : (
                    <>
                      <span style={styles.buttonIcon}>🔐</span>
                      Sign In Securely
                    </>
                  )}
                </button>
              </form>

              {message && (
                <div style={{
                  ...styles.message,
                  backgroundColor: message.includes('failed') ? '#fee2e2' : '#d1fae5',
                  color: message.includes('failed') ? '#dc2626' : '#065f46',
                  borderColor: message.includes('failed') ? '#fca5a5' : '#86efac'
                }}>
                  {message}
                </div>
              )}

              {/* Security Features */}
              <div style={styles.securitySection}>
                <h3 style={styles.securityTitle}>Your Security is Our Priority</h3>
                <div style={styles.securityFeatures}>
                  <div style={styles.feature}>
                    <span style={styles.featureIcon}>🔒</span>
                    <span>256-bit SSL Encryption</span>
                  </div>
                  <div style={styles.feature}>
                    <span style={styles.featureIcon}>🛡️</span>
                    <span>Multi-Factor Authentication</span>
                  </div>
                  <div style={styles.feature}>
                    <span style={styles.featureIcon}>📱</span>
                    <span>Mobile & Desktop Access</span>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div style={styles.quickActions}>
                <h3 style={styles.quickActionsTitle}>Quick Actions</h3>
                <div style={styles.actionButtons}>
                  <Link href="/apply" style={styles.actionButton}>
                    <span style={styles.actionIcon}>🚀</span>
                    Open New Account
                  </Link>
                  <Link href="/main-menu" style={styles.actionButton}>
                    <span style={styles.actionIcon}>☰</span>
                    Banking Menu
                  </Link>
                </div>
              </div>

              {/* Help Section */}
              <div style={styles.helpSection}>
                <div style={styles.helpOptions}>
                  <Link href="/support" style={styles.helpLink}>
                    💬 Contact Support
                  </Link>
                  <Link href="/faq" style={styles.helpLink}>
                    ❓ View FAQ
                  </Link>
                  <a href="tel:+1-800-OAKLINE" style={styles.helpLink}>
                    📞 Call: 1-800-OAKLINE
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer style={styles.footer}>
        <div style={styles.footerContent}>
          <div style={styles.footerSection}>
            <h4 style={styles.footerTitle}>Security Notice</h4>
            <p style={styles.footerText}>
              Oakline Bank will never ask for your password via email or phone.
            </p>
          </div>
        </div>
        <div style={styles.footerBottom}>
          <p style={styles.copyright}>
            © 2024 Oakline Bank. All rights reserved. Member FDIC. Routing: 075915826
          </p>
        </div>
      </footer>

      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#ffffff',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    width: '100%',
    overflowX: 'hidden'
  },
  header: {
    backgroundColor: '#1A3E6F',
    color: 'white',
    padding: '1rem 1.5rem',
    boxShadow: '0 4px 12px rgba(26, 62, 111, 0.15)',
    position: 'sticky',
    top: 0,
    zIndex: 100
  },
  headerContainer: {
    maxWidth: '1400px',
    margin: '0 auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem'
  },
  headerContent: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '1rem'
  },
  logoContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    textDecoration: 'none',
    color: 'white'
  },
  logo: {
    height: '45px',
    width: 'auto'
  },
  brandInfo: {
    display: 'flex',
    flexDirection: 'column'
  },
  bankName: {
    fontSize: '1.4rem',
    fontWeight: 'bold',
    margin: 0,
    color: 'white'
  },
  tagline: {
    fontSize: '0.85rem',
    color: '#FFC857',
    fontWeight: '500'
  },
  headerActions: {
    display: 'flex',
    gap: '1rem',
    flexWrap: 'wrap',
    alignItems: 'center'
  },
  headerButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.6rem 1rem',
    backgroundColor: 'rgba(255,255,255,0.1)',
    color: 'white',
    textDecoration: 'none',
    borderRadius: '6px',
    fontSize: '0.85rem',
    fontWeight: '600',
    transition: 'all 0.3s ease',
    border: '1px solid rgba(255,255,255,0.2)',
    backdropFilter: 'blur(10px)'
  },
  buttonIcon: {
    fontSize: '0.9rem'
  },
  headerInfo: {
    display: 'flex',
    justifyContent: 'center',
    gap: '2rem',
    padding: '0.75rem',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: '8px',
    flexWrap: 'wrap'
  },
  infoItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    fontSize: '0.85rem'
  },
  infoLabel: {
    color: '#CBD5E1',
    fontWeight: '500'
  },
  infoValue: {
    color: '#FFC857',
    fontWeight: '700',
    fontFamily: 'monospace'
  },
  main: {
    flex: 1,
    minHeight: 'calc(100vh - 120px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '2rem 1rem'
  },
  contentWrapper: {
    width: '100%',
    maxWidth: '500px'
  },
  loginSection: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  loginCard: {
    width: '100%',
    backgroundColor: 'white',
    borderRadius: '16px',
    boxShadow: '0 12px 32px rgba(26, 62, 111, 0.08)',
    padding: '2.5rem',
    border: '1px solid #e2e8f0'
  },
  loginHeader: {
    textAlign: 'center',
    marginBottom: '2rem'
  },
  cardLogo: {
    marginBottom: '1rem'
  },
  cardLogoImg: {
    height: '35px',
    width: 'auto'
  },
  loginTitle: {
    fontSize: '1.8rem',
    fontWeight: 'bold',
    color: '#1A3E6F',
    marginBottom: '0.5rem'
  },
  loginSubtitle: {
    fontSize: '1rem',
    color: '#64748b',
    margin: 0
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
    marginBottom: '2rem'
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem'
  },
  label: {
    fontSize: '0.9rem',
    fontWeight: '600',
    color: '#1A3E6F'
  },
  input: {
    width: '100%',
    padding: '0.75rem 1rem',
    border: '2px solid #e2e8f0',
    borderRadius: '8px',
    fontSize: '1rem',
    transition: 'all 0.3s ease',
    boxSizing: 'border-box',
    outline: 'none'
  },
  forgotPassword: {
    color: '#1A3E6F',
    textDecoration: 'none',
    fontSize: '0.85rem',
    fontWeight: '500',
    alignSelf: 'flex-end'
  },
  loginButton: {
    width: '100%',
    padding: '1rem',
    backgroundColor: '#1A3E6F',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '1rem',
    fontWeight: '700',
    transition: 'all 0.3s ease',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    marginTop: '0.5rem'
  },
  loadingContent: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem'
  },
  spinner: {
    width: '16px',
    height: '16px',
    border: '2px solid transparent',
    borderTop: '2px solid white',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite'
  },
  message: {
    marginTop: '1rem',
    padding: '0.75rem 1rem',
    borderRadius: '8px',
    textAlign: 'center',
    fontSize: '0.9rem',
    fontWeight: '500',
    border: '1px solid'
  },
  securitySection: {
    marginTop: '2rem',
    padding: '1.5rem',
    backgroundColor: '#f8fafc',
    borderRadius: '12px',
    border: '1px solid #e2e8f0'
  },
  securityTitle: {
    fontSize: '1rem',
    fontWeight: 'bold',
    color: '#1A3E6F',
    marginBottom: '1rem',
    textAlign: 'center'
  },
  securityFeatures: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem'
  },
  feature: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    fontSize: '0.85rem',
    fontWeight: '500',
    color: '#374151'
  },
  featureIcon: {
    fontSize: '1rem'
  },
  quickActions: {
    marginTop: '1.5rem',
    padding: '1.5rem',
    backgroundColor: '#f1f5f9',
    borderRadius: '12px',
    border: '1px solid #e2e8f0'
  },
  quickActionsTitle: {
    fontSize: '1rem',
    fontWeight: 'bold',
    color: '#1A3E6F',
    marginBottom: '1rem',
    textAlign: 'center'
  },
  actionButtons: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem'
  },
  actionButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    padding: '0.75rem 1rem',
    backgroundColor: 'white',
    color: '#1A3E6F',
    textDecoration: 'none',
    borderRadius: '8px',
    border: '1px solid #e2e8f0',
    fontSize: '0.9rem',
    fontWeight: '500',
    transition: 'all 0.3s ease'
  },
  actionIcon: {
    fontSize: '1rem'
  },
  helpSection: {
    marginTop: '1.5rem',
    padding: '1rem',
    borderTop: '1px solid #e2e8f0'
  },
  helpOptions: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem'
  },
  helpLink: {
    color: '#64748b',
    textDecoration: 'none',
    fontSize: '0.85rem',
    fontWeight: '500',
    textAlign: 'center',
    padding: '0.5rem'
  },
  footer: {
    backgroundColor: '#1A3E6F',
    color: 'white',
    padding: '2rem 1.5rem 1rem'
  },
  footerContent: {
    maxWidth: '1400px',
    margin: '0 auto',
    textAlign: 'center'
  },
  footerSection: {
    marginBottom: '1rem'
  },
  footerTitle: {
    fontSize: '1rem',
    fontWeight: '600',
    color: '#FFC857',
    marginBottom: '0.5rem'
  },
  footerText: {
    fontSize: '0.85rem',
    lineHeight: '1.5',
    color: '#CBD5E1'
  },
  footerBottom: {
    borderTop: '1px solid rgba(255,200,87,0.3)',
    paddingTop: '1rem',
    textAlign: 'center'
  },
  copyright: {
    fontSize: '0.8rem',
    color: '#CBD5E1',
    margin: 0
  },

  // Mobile Responsive Styles
  '@media (max-width: 768px)': {
    headerContent: {
      flexDirection: 'column',
      alignItems: 'center',
      gap: '1rem'
    },
    headerActions: {
      flexDirection: 'row',
      justifyContent: 'center',
      gap: '0.75rem',
      width: '100%'
    },
    headerButton: {
      flex: 1,
      justifyContent: 'center',
      maxWidth: '120px'
    },
    headerInfo: {
      flexDirection: 'column',
      gap: '0.5rem'
    },
    loginCard: {
      padding: '2rem 1.5rem',
      margin: '0 0.5rem'
    },
    input: {
      fontSize: '16px' // Prevents zoom on iOS
    }
  }
};
