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
      {/* Mobile-optimized header */}
      <div style={styles.header}>
        <div style={styles.headerContent}>
          <Link href="/" style={styles.logoContainer}>
            <div style={styles.logo}>
              <span style={styles.logoIcon}>🏦</span>
              <span style={styles.logoText}>Oakline Bank</span>
            </div>
          </Link>
          <div style={styles.headerActions}>
            <Link href="/apply" style={styles.headerLink}>Open Account</Link>
            <Link href="/support" style={styles.headerLink}>Support</Link>
          </div>
        </div>
      </div>

      {/* Main content - mobile first approach */}
      <div style={styles.mainContent}>
        <div style={styles.loginContainer}>
          {/* Hero section for larger screens */}
          <div style={styles.heroSection}>
            <div style={styles.heroContent}>
              <h1 style={styles.heroTitle}>Secure Online Banking</h1>
              <p style={styles.heroSubtitle}>
                Access your accounts securely from anywhere, anytime with Oakline Bank's 
                state-of-the-art online banking platform.
              </p>
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

          {/* Login form */}
          <div style={styles.loginSection}>
            <div style={styles.loginCard}>
              <div style={styles.loginHeader}>
                <h2 style={styles.loginTitle}>Sign In</h2>
                <p style={styles.loginSubtitle}>Welcome back! Enter your credentials</p>
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
                    backgroundColor: loading ? '#9ca3af' : '#1e3a8a',
                    cursor: loading ? 'not-allowed' : 'pointer'
                  }}
                >
                  {loading ? (
                    <span style={styles.loadingContent}>
                      <span style={styles.spinner}></span>
                      Signing In...
                    </span>
                  ) : (
                    'Sign In Securely'
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

              {/* Sign up section */}
              <div style={styles.signupSection}>
                <p style={styles.signupText}>
                  New to Oakline Bank?
                </p>
                <Link href="/apply" style={styles.signupButton}>
                  🚀 Open Your Account Today
                </Link>
              </div>

              {/* Help section */}
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
      </div>

      {/* Footer */}
      <div style={styles.footer}>
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
            © 2024 Oakline Bank. All rights reserved. Member FDIC.
          </p>
        </div>
      </div>

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
    fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    width: '100%',
    overflowX: 'hidden'
  },
  header: {
    backgroundColor: 'white',
    borderBottom: '1px solid #e5e7eb',
    padding: '12px 16px',
    position: 'sticky',
    top: 0,
    zIndex: 100,
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
  },
  headerContent: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    maxWidth: '100%'
  },
  logoContainer: {
    textDecoration: 'none'
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  },
  logoIcon: {
    fontSize: '24px'
  },
  logoText: {
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#1e3a8a',
    letterSpacing: '-0.5px'
  },
  headerActions: {
    display: 'none'
  },
  headerLink: {
    color: '#4b5563',
    textDecoration: 'none',
    fontWeight: '500',
    padding: '8px 12px',
    borderRadius: '6px',
    fontSize: '14px'
  },
  mainContent: {
    width: '100%',
    minHeight: 'calc(100vh - 60px)'
  },
  loginContainer: {
    width: '100%',
    minHeight: '100%'
  },
  heroSection: {
    display: 'none'
  },
  heroContent: {
    maxWidth: '500px',
    textAlign: 'center'
  },
  heroTitle: {
    fontSize: '36px',
    fontWeight: 'bold',
    marginBottom: '20px',
    lineHeight: '1.2',
    color: 'white'
  },
  heroSubtitle: {
    fontSize: '16px',
    marginBottom: '30px',
    lineHeight: '1.6',
    opacity: '0.9',
    color: 'white'
  },
  securityFeatures: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
  },
  feature: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    fontSize: '14px',
    fontWeight: '500',
    color: 'white'
  },
  featureIcon: {
    fontSize: '16px'
  },
  loginSection: {
    width: '100%',
    padding: '20px 16px',
    backgroundColor: '#ffffff',
    minHeight: 'calc(100vh - 60px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  loginCard: {
    width: '100%',
    maxWidth: '400px',
    backgroundColor: 'white',
    borderRadius: '16px',
    boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
    padding: '24px',
    border: '1px solid #e5e7eb'
  },
  loginHeader: {
    textAlign: 'center',
    marginBottom: '24px'
  },
  loginTitle: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: '8px'
  },
  loginSubtitle: {
    fontSize: '14px',
    color: '#6b7280',
    margin: 0
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px'
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px'
  },
  label: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#374151'
  },
  input: {
    width: '100%',
    padding: '12px 14px',
    border: '2px solid #d1d5db',
    borderRadius: '8px',
    fontSize: '16px',
    transition: 'all 0.3s',
    boxSizing: 'border-box',
    outline: 'none'
  },
  forgotPassword: {
    color: '#1e3a8a',
    textDecoration: 'none',
    fontSize: '12px',
    fontWeight: '500',
    alignSelf: 'flex-end'
  },
  loginButton: {
    width: '100%',
    padding: '14px',
    backgroundColor: '#1e3a8a',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '600',
    transition: 'all 0.3s',
    marginTop: '8px'
  },
  loadingContent: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px'
  },
  spinner: {
    width: '14px',
    height: '14px',
    border: '2px solid transparent',
    borderTop: '2px solid white',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite'
  },
  message: {
    marginTop: '16px',
    padding: '12px',
    borderRadius: '8px',
    textAlign: 'center',
    fontSize: '14px',
    fontWeight: '500',
    border: '1px solid'
  },
  signupSection: {
    textAlign: 'center',
    padding: '16px',
    backgroundColor: '#f8fafc',
    borderRadius: '12px',
    marginTop: '20px'
  },
  signupText: {
    fontSize: '14px',
    color: '#6b7280',
    marginBottom: '12px'
  },
  signupButton: {
    display: 'inline-block',
    padding: '10px 20px',
    backgroundColor: '#10b981',
    color: 'white',
    textDecoration: 'none',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: '600'
  },
  helpSection: {
    marginTop: '16px'
  },
  helpOptions: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  },
  helpLink: {
    color: '#6b7280',
    textDecoration: 'none',
    fontSize: '12px',
    fontWeight: '500',
    textAlign: 'center'
  },
  footer: {
    backgroundColor: '#1f2937',
    color: 'white',
    padding: '20px 16px'
  },
  footerContent: {
    textAlign: 'center'
  },
  footerSection: {
    marginBottom: '16px'
  },
  footerTitle: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#f9fafb',
    marginBottom: '8px'
  },
  footerText: {
    fontSize: '12px',
    lineHeight: '1.5',
    color: '#d1d5db'
  },
  footerBottom: {
    borderTop: '1px solid #374151',
    paddingTop: '16px',
    textAlign: 'center'
  },
  copyright: {
    fontSize: '10px',
    color: '#9ca3af',
    margin: 0
  }
};

// Media queries for responsive design
if (typeof window !== 'undefined') {
  const mediaQuery = window.matchMedia('(min-width: 768px)');

  if (mediaQuery.matches) {
    // Desktop styles
    styles.mainContent = {
      ...styles.mainContent,
      display: 'grid',
      gridTemplateColumns: '1fr 1fr'
    };

    styles.heroSection = {
      ...styles.heroSection,
      display: 'flex',
      background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px'
    };

    styles.headerActions = {
      ...styles.headerActions,
      display: 'flex',
      gap: '16px',
      alignItems: 'center'
    };

    styles.loginCard = {
      ...styles.loginCard,
      padding: '32px'
    };

    styles.helpOptions = {
      ...styles.helpOptions,
      flexDirection: 'row',
      justifyContent: 'space-around'
    };
  }
}