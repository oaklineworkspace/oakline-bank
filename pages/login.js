
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
      {/* Oakline Bank Header */}
      <header style={styles.header}>
        <div style={styles.headerContent}>
          <Link href="/" style={styles.logoContainer}>
            <img src="/images/logo-primary.png.jpg" alt="Oakline Bank" style={styles.logo} />
            <div style={styles.brandInfo}>
              <span style={styles.bankName}>Oakline Bank</span>
              <span style={styles.tagline}>Your Financial Partner</span>
            </div>
          </Link>
          
          <div style={styles.headerActions}>
            <Link href="/apply" style={styles.headerButton}>Open Account</Link>
            <Link href="/support" style={styles.headerButton}>Support</Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main style={styles.main}>
        <div style={styles.contentWrapper}>
          {/* Hero Section for Desktop */}
          <div style={styles.heroSection}>
            <div style={styles.heroContent}>
              <h1 style={styles.heroTitle}>Secure Banking Access</h1>
              <p style={styles.heroSubtitle}>
                Access your accounts securely with our state-of-the-art banking platform. 
                Your financial security is our priority.
              </p>
              
              <div style={styles.bankingInfo}>
                <div style={styles.infoCard}>
                  <span style={styles.infoIcon}>🏦</span>
                  <div>
                    <h3 style={styles.infoTitle}>Routing Number</h3>
                    <p style={styles.infoText}>075915826</p>
                  </div>
                </div>
                
                <div style={styles.infoCard}>
                  <span style={styles.infoIcon}>📞</span>
                  <div>
                    <h3 style={styles.infoTitle}>24/7 Support</h3>
                    <p style={styles.infoText}>1-800-OAKLINE</p>
                  </div>
                </div>
              </div>

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
          </div>

          {/* Login Form Section */}
          <div style={styles.loginSection}>
            <div style={styles.loginCard}>
              <div style={styles.loginHeader}>
                <div style={styles.cardLogo}>
                  <img src="/images/logo-primary.png.jpg" alt="Oakline Bank" style={styles.cardLogoImg} />
                </div>
                <h2 style={styles.loginTitle}>Welcome Back</h2>
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
                    backgroundColor: loading ? '#9ca3af' : '#1e40af',
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

              {/* Quick Actions */}
              <div style={styles.quickActions}>
                <h3 style={styles.quickActionsTitle}>Quick Actions</h3>
                <div style={styles.actionButtons}>
                  <Link href="/apply" style={styles.actionButton}>
                    <span style={styles.actionIcon}>🚀</span>
                    Open New Account
                  </Link>
                  <Link href="/dashboard" style={styles.actionButton}>
                    <span style={styles.actionIcon}>📊</span>
                    Go to Dashboard
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
    backgroundColor: '#f8fafc',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    width: '100%',
    overflowX: 'hidden'
  },
  header: {
    backgroundColor: '#1e40af',
    color: 'white',
    padding: '1rem 1.5rem',
    boxShadow: '0 4px 12px rgba(30, 64, 175, 0.2)'
  },
  headerContent: {
    maxWidth: '1400px',
    margin: '0 auto',
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
    height: '50px',
    width: 'auto'
  },
  brandInfo: {
    display: 'flex',
    flexDirection: 'column'
  },
  bankName: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    margin: 0,
    color: 'white'
  },
  tagline: {
    fontSize: '0.9rem',
    color: '#bfdbfe'
  },
  headerActions: {
    display: 'flex',
    gap: '1rem'
  },
  headerButton: {
    padding: '0.5rem 1rem',
    backgroundColor: 'rgba(255,255,255,0.15)',
    color: 'white',
    textDecoration: 'none',
    borderRadius: '6px',
    fontSize: '0.9rem',
    fontWeight: '500',
    transition: 'all 0.3s ease'
  },
  main: {
    flex: 1,
    minHeight: 'calc(100vh - 120px)'
  },
  contentWrapper: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: 'calc(100vh - 120px)'
  },
  heroSection: {
    background: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)',
    color: 'white',
    padding: '2rem 1rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '40vh'
  },
  heroContent: {
    maxWidth: '500px',
    textAlign: 'center'
  },
  heroTitle: {
    fontSize: '2.5rem',
    fontWeight: 'bold',
    marginBottom: '1.5rem',
    lineHeight: '1.2'
  },
  heroSubtitle: {
    fontSize: '1.1rem',
    marginBottom: '2rem',
    lineHeight: '1.6',
    opacity: 0.9
  },
  bankingInfo: {
    display: 'flex',
    gap: '1.5rem',
    marginBottom: '2rem',
    flexWrap: 'wrap'
  },
  infoCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    backgroundColor: 'rgba(255,255,255,0.1)',
    padding: '1rem',
    borderRadius: '12px',
    backdropFilter: 'blur(10px)'
  },
  infoIcon: {
    fontSize: '1.5rem'
  },
  infoTitle: {
    fontSize: '0.9rem',
    fontWeight: 'bold',
    margin: 0,
    color: 'white'
  },
  infoText: {
    fontSize: '0.8rem',
    margin: 0,
    color: '#bfdbfe',
    fontFamily: 'monospace'
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
    fontSize: '0.9rem',
    fontWeight: '500'
  },
  featureIcon: {
    fontSize: '1.2rem'
  },
  loginSection: {
    backgroundColor: 'white',
    padding: '2rem 1rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1
  },
  loginCard: {
    width: '100%',
    maxWidth: '450px',
    backgroundColor: 'white',
    borderRadius: '20px',
    boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
    padding: '2rem',
    border: '2px solid #e2e8f0'
  },
  loginHeader: {
    textAlign: 'center',
    marginBottom: '2rem'
  },
  cardLogo: {
    marginBottom: '1rem'
  },
  cardLogoImg: {
    height: '40px',
    width: 'auto'
  },
  loginTitle: {
    fontSize: '1.8rem',
    fontWeight: 'bold',
    color: '#1e40af',
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
    gap: '1.5rem'
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem'
  },
  label: {
    fontSize: '0.9rem',
    fontWeight: '600',
    color: '#374151'
  },
  input: {
    width: '100%',
    padding: '0.75rem 1rem',
    border: '2px solid #e2e8f0',
    borderRadius: '10px',
    fontSize: '1rem',
    transition: 'all 0.3s ease',
    boxSizing: 'border-box',
    outline: 'none'
  },
  forgotPassword: {
    color: '#1e40af',
    textDecoration: 'none',
    fontSize: '0.85rem',
    fontWeight: '500',
    alignSelf: 'flex-end'
  },
  loginButton: {
    width: '100%',
    padding: '1rem',
    backgroundColor: '#1e40af',
    color: 'white',
    border: 'none',
    borderRadius: '10px',
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
  buttonIcon: {
    fontSize: '1rem'
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
  quickActions: {
    marginTop: '2rem',
    padding: '1.5rem',
    backgroundColor: '#f8fafc',
    borderRadius: '12px',
    border: '1px solid #e2e8f0'
  },
  quickActionsTitle: {
    fontSize: '1.1rem',
    fontWeight: 'bold',
    color: '#1e40af',
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
    color: '#374151',
    textDecoration: 'none',
    borderRadius: '8px',
    border: '2px solid #e2e8f0',
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
    backgroundColor: '#1f2937',
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
    fontSize: '1.1rem',
    fontWeight: '600',
    color: '#f9fafb',
    marginBottom: '0.5rem'
  },
  footerText: {
    fontSize: '0.9rem',
    lineHeight: '1.5',
    color: '#d1d5db'
  },
  footerBottom: {
    borderTop: '1px solid #374151',
    paddingTop: '1rem',
    textAlign: 'center'
  },
  copyright: {
    fontSize: '0.8rem',
    color: '#9ca3af',
    margin: 0
  },

  // Mobile Responsive Styles
  '@media (max-width: 768px)': {
    headerContent: {
      flexDirection: 'column',
      gap: '1rem',
      padding: '0.75rem'
    },
    headerActions: {
      width: '100%',
      justifyContent: 'center'
    },
    heroSection: {
      padding: '1.5rem 1rem',
      minHeight: '30vh'
    },
    heroTitle: {
      fontSize: '1.8rem'
    },
    heroSubtitle: {
      fontSize: '1rem'
    },
    bankingInfo: {
      flexDirection: 'column',
      gap: '1rem'
    },
    infoCard: {
      width: '100%',
      justifyContent: 'center',
      padding: '1rem'
    },
    loginSection: {
      padding: '1.5rem 1rem'
    },
    loginCard: {
      padding: '2rem 1.5rem',
      maxWidth: '100%',
      margin: '0'
    },
    loginTitle: {
      fontSize: '1.6rem'
    },
    input: {
      fontSize: '16px', // Prevents zoom on iOS
      padding: '1rem'
    }
  },
  '@media (max-width: 480px)': {
    heroSection: {
      padding: '1rem',
      minHeight: '25vh'
    },
    heroTitle: {
      fontSize: '1.5rem'
    },
    heroSubtitle: {
      fontSize: '0.9rem'
    },
    loginSection: {
      padding: '1rem 0.5rem'
    },
    loginCard: {
      padding: '1.5rem 1rem',
      borderRadius: '12px'
    }
  }
};
