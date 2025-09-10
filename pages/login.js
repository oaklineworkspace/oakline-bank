
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
      {/* Mobile-friendly header */}
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

      {/* Main content */}
      <div style={styles.mainContent}>
        {/* Hero section */}
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

        {/* Login form section */}
        <div style={styles.loginSection}>
          <div style={styles.loginCard}>
            <div style={styles.loginHeader}>
              <h2 style={styles.loginTitle}>Sign In to Your Account</h2>
              <p style={styles.loginSubtitle}>Welcome back! Please enter your credentials</p>
            </div>

            <form onSubmit={handleSubmit} style={styles.form}>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Email Address</label>
                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email address"
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

            {/* Additional options */}
            <div style={styles.additionalOptions}>
              <div style={styles.divider}>
                <span style={styles.dividerText}>New to Oakline Bank?</span>
              </div>
              
              <div style={styles.signupSection}>
                <p style={styles.signupText}>
                  Join thousands of satisfied customers who trust us with their financial needs.
                </p>
                <Link href="/apply" style={styles.signupButton}>
                  🚀 Open Your Account Today
                </Link>
              </div>

              <div style={styles.helpSection}>
                <h4 style={styles.helpTitle}>Need Help?</h4>
                <div style={styles.helpOptions}>
                  <Link href="/support" style={styles.helpLink}>
                    💬 Contact Support
                  </Link>
                  <Link href="/faq" style={styles.helpLink}>
                    ❓ View FAQ
                  </Link>
                  <a href="tel:+1-800-OAKLINE" style={styles.helpLink}>
                    📞 Call Us: 1-800-OAKLINE
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
              Always verify you're on our official website before entering credentials.
            </p>
          </div>
          <div style={styles.footerLinks}>
            <Link href="/privacy" style={styles.footerLink}>Privacy Policy</Link>
            <Link href="/terms" style={styles.footerLink}>Terms of Service</Link>
            <Link href="/security" style={styles.footerLink}>Security Center</Link>
          </div>
        </div>
        <div style={styles.footerBottom}>
          <p style={styles.copyright}>
            © 2024 Oakline Bank. All rights reserved. Member FDIC. Equal Housing Lender.
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        @media (max-width: 768px) {
          .hero-content {
            padding: 20px !important;
          }
          .login-card {
            margin: 10px !important;
            padding: 20px !important;
          }
        }
      `}</style>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#f8fafc',
    fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
  },
  header: {
    backgroundColor: 'white',
    borderBottom: '1px solid #e5e7eb',
    padding: '0 20px',
    position: 'sticky',
    top: 0,
    zIndex: 100,
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
  },
  headerContent: {
    maxWidth: '1200px',
    margin: '0 auto',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: '70px'
  },
  logoContainer: {
    textDecoration: 'none'
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
  },
  logoIcon: {
    fontSize: '32px'
  },
  logoText: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#1e40af',
    letterSpacing: '-0.5px'
  },
  headerActions: {
    display: 'flex',
    gap: '20px',
    alignItems: 'center'
  },
  headerLink: {
    color: '#4b5563',
    textDecoration: 'none',
    fontWeight: '500',
    padding: '8px 16px',
    borderRadius: '6px',
    transition: 'all 0.2s',
    ':hover': {
      backgroundColor: '#f3f4f6',
      color: '#1e40af'
    }
  },
  mainContent: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    minHeight: 'calc(100vh - 70px)',
    '@media (maxWidth: 768px)': {
      gridTemplateColumns: '1fr',
      minHeight: 'auto'
    }
  },
  heroSection: {
    background: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 50%, #60a5fa 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '60px 40px',
    color: 'white'
  },
  heroContent: {
    maxWidth: '500px',
    textAlign: 'center'
  },
  heroTitle: {
    fontSize: '42px',
    fontWeight: 'bold',
    marginBottom: '20px',
    lineHeight: '1.2'
  },
  heroSubtitle: {
    fontSize: '18px',
    marginBottom: '40px',
    lineHeight: '1.6',
    opacity: '0.9'
  },
  securityFeatures: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px'
  },
  feature: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    fontSize: '16px',
    fontWeight: '500'
  },
  featureIcon: {
    fontSize: '20px'
  },
  loginSection: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '40px 20px',
    backgroundColor: '#ffffff'
  },
  loginCard: {
    width: '100%',
    maxWidth: '450px',
    backgroundColor: 'white',
    borderRadius: '16px',
    boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)',
    padding: '40px',
    border: '1px solid #e5e7eb'
  },
  loginHeader: {
    textAlign: 'center',
    marginBottom: '32px'
  },
  loginTitle: {
    fontSize: '28px',
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: '8px'
  },
  loginSubtitle: {
    fontSize: '16px',
    color: '#6b7280',
    margin: 0
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px'
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  },
  label: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#374151'
  },
  input: {
    width: '100%',
    padding: '14px 16px',
    border: '2px solid #d1d5db',
    borderRadius: '10px',
    fontSize: '16px',
    transition: 'all 0.3s',
    boxSizing: 'border-box',
    ':focus': {
      outline: 'none',
      borderColor: '#3b82f6',
      boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.1)'
    }
  },
  forgotPassword: {
    color: '#3b82f6',
    textDecoration: 'none',
    fontSize: '14px',
    fontWeight: '500',
    alignSelf: 'flex-end',
    ':hover': {
      textDecoration: 'underline'
    }
  },
  loginButton: {
    width: '100%',
    padding: '16px',
    backgroundColor: '#1e40af',
    color: 'white',
    border: 'none',
    borderRadius: '10px',
    fontSize: '16px',
    fontWeight: '600',
    transition: 'all 0.3s',
    marginTop: '8px',
    ':hover': {
      backgroundColor: '#1d4ed8',
      transform: 'translateY(-1px)',
      boxShadow: '0 10px 20px rgba(30, 64, 175, 0.3)'
    }
  },
  loadingContent: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px'
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
    marginTop: '20px',
    padding: '16px',
    borderRadius: '10px',
    textAlign: 'center',
    fontSize: '14px',
    fontWeight: '500',
    border: '1px solid'
  },
  additionalOptions: {
    marginTop: '32px'
  },
  divider: {
    textAlign: 'center',
    position: 'relative',
    margin: '24px 0',
    ':before': {
      content: '""',
      position: 'absolute',
      top: '50%',
      left: 0,
      right: 0,
      height: '1px',
      backgroundColor: '#e5e7eb'
    }
  },
  dividerText: {
    backgroundColor: 'white',
    padding: '0 16px',
    color: '#6b7280',
    fontSize: '14px',
    fontWeight: '500'
  },
  signupSection: {
    textAlign: 'center',
    padding: '20px',
    backgroundColor: '#f8fafc',
    borderRadius: '12px',
    marginBottom: '24px'
  },
  signupText: {
    fontSize: '14px',
    color: '#6b7280',
    marginBottom: '16px'
  },
  signupButton: {
    display: 'inline-block',
    padding: '12px 24px',
    backgroundColor: '#10b981',
    color: 'white',
    textDecoration: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600',
    transition: 'all 0.3s',
    ':hover': {
      backgroundColor: '#059669',
      transform: 'translateY(-1px)'
    }
  },
  helpSection: {
    textAlign: 'center'
  },
  helpTitle: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#374151',
    marginBottom: '12px'
  },
  helpOptions: {
    display: 'flex',
    justifyContent: 'center',
    gap: '16px',
    flexWrap: 'wrap'
  },
  helpLink: {
    color: '#6b7280',
    textDecoration: 'none',
    fontSize: '14px',
    fontWeight: '500',
    ':hover': {
      color: '#3b82f6'
    }
  },
  footer: {
    backgroundColor: '#1f2937',
    color: 'white',
    padding: '40px 20px 20px'
  },
  footerContent: {
    maxWidth: '1200px',
    margin: '0 auto',
    display: 'grid',
    gridTemplateColumns: '2fr 1fr',
    gap: '40px',
    marginBottom: '30px',
    '@media (maxWidth: 768px)': {
      gridTemplateColumns: '1fr',
      gap: '20px'
    }
  },
  footerSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
  },
  footerTitle: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#f9fafb'
  },
  footerText: {
    fontSize: '14px',
    lineHeight: '1.6',
    color: '#d1d5db'
  },
  footerLinks: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  },
  footerLink: {
    color: '#d1d5db',
    textDecoration: 'none',
    fontSize: '14px',
    ':hover': {
      color: '#60a5fa'
    }
  },
  footerBottom: {
    borderTop: '1px solid #374151',
    paddingTop: '20px',
    textAlign: 'center'
  },
  copyright: {
    fontSize: '12px',
    color: '#9ca3af',
    margin: 0
  }
};
