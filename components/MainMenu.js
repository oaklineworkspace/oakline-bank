
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '../lib/supabaseClient';

export default function MainMenu({ user }) {
  const [scrollText, setScrollText] = useState("Welcome to Oakline Bank – Secure, Convenient, and Innovative Banking Solutions for Everyone!");
  const [dropdownOpen, setDropdownOpen] = useState({});
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // For scrolling effect
  useEffect(() => {
    const interval = setInterval(() => {
      setScrollText((prev) => prev.slice(1) + prev[0]);
    }, 150);
    return () => clearInterval(interval);
  }, []);

  const toggleDropdown = (menu) => {
    setDropdownOpen({ ...dropdownOpen, [menu]: !dropdownOpen[menu] });
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <header style={styles.header}>
      {/* Top announcement bar */}
      <div style={styles.topBar}>
        <div style={styles.scrollText}>{scrollText}</div>
        <div style={styles.topLinks}>
          <Link href="/support" style={styles.topLink}>Support</Link>
          <Link href="/faq" style={styles.topLink}>FAQ</Link>
          <span style={styles.phone}>📞 1-800-OAKLINE</span>
        </div>
      </div>

      {/* Main navigation */}
      <nav style={styles.nav}>
        <div style={styles.navContainer}>
          <Link href="/" style={styles.logoContainer}>
            <img src="/images/logo-primary.png.jpg" alt="Oakline Bank Logo" style={styles.logo} />
            <span style={styles.bankName}>Oakline Bank</span>
          </Link>

          {/* Desktop Menu */}
          <div style={styles.desktopMenu}>
            {/* Banking Services Dropdown */}
            <div style={styles.dropdown}>
              <button
                style={styles.dropdownBtn}
                onClick={() => toggleDropdown('banking')}
                onMouseEnter={() => setDropdownOpen({ ...dropdownOpen, banking: true })}
              >
                Banking Services ▼
              </button>
              {dropdownOpen.banking && (
                <div 
                  style={styles.dropdownContent}
                  onMouseLeave={() => setDropdownOpen({ ...dropdownOpen, banking: false })}
                >
                  <div style={styles.dropdownSection}>
                    <h4 style={styles.dropdownHeading}>💳 Account Types</h4>
                    <Link href="/apply" style={styles.dropdownLink}>Checking Account</Link>
                    <Link href="/apply" style={styles.dropdownLink}>Savings Account</Link>
                    <Link href="/apply" style={styles.dropdownLink}>Business Account</Link>
                    <Link href="/apply" style={styles.dropdownLink}>Student Account</Link>
                    <Link href="/apply" style={styles.dropdownLink}>Joint Account</Link>
                  </div>
                  <div style={styles.dropdownSection}>
                    <h4 style={styles.dropdownHeading}>🏠 Loans & Credit</h4>
                    <Link href="/loans" style={styles.dropdownLink}>Home Mortgage</Link>
                    <Link href="/loans" style={styles.dropdownLink}>Personal Loan</Link>
                    <Link href="/loans" style={styles.dropdownLink}>Auto Loan</Link>
                    <Link href="/loans" style={styles.dropdownLink}>Business Loan</Link>
                    <Link href="/loans" style={styles.dropdownLink}>Credit Cards</Link>
                  </div>
                  <div style={styles.dropdownSection}>
                    <h4 style={styles.dropdownHeading}>💰 Investment</h4>
                    <Link href="/investments" style={styles.dropdownLink}>Investment Portfolio</Link>
                    {user && <Link href="/crypto" style={styles.dropdownLink}>Crypto Trading</Link>}
                    <Link href="/financial-advisory" style={styles.dropdownLink}>Financial Advisory</Link>
                  </div>
                </div>
              )}
            </div>

            {/* Digital Banking Dropdown */}
            <div style={styles.dropdown}>
              <button
                style={styles.dropdownBtn}
                onClick={() => toggleDropdown('digital')}
                onMouseEnter={() => setDropdownOpen({ ...dropdownOpen, digital: true })}
              >
                Digital Banking ▼
              </button>
              {dropdownOpen.digital && (
                <div 
                  style={styles.dropdownContent}
                  onMouseLeave={() => setDropdownOpen({ ...dropdownOpen, digital: false })}
                >
                  <div style={styles.dropdownSection}>
                    <h4 style={styles.dropdownHeading}>📱 Mobile & Online</h4>
                    {user ? (
                      <>
                        <Link href="/dashboard" style={styles.dropdownLink}>Online Banking</Link>
                        <Link href="/transfer" style={styles.dropdownLink}>Money Transfer</Link>
                        <Link href="/bill-pay" style={styles.dropdownLink}>Bill Pay</Link>
                        <Link href="/cards" style={styles.dropdownLink}>Manage Cards</Link>
                      </>
                    ) : (
                      <>
                        <Link href="/login" style={styles.dropdownLink}>Sign In to Access</Link>
                        <Link href="/apply" style={styles.dropdownLink}>Open Account First</Link>
                      </>
                    )}
                  </div>
                  <div style={styles.dropdownSection}>
                    <h4 style={styles.dropdownHeading}>🔒 Security</h4>
                    <Link href="/security" style={styles.dropdownLink}>Account Security</Link>
                    {user && <Link href="/mfa-setup" style={styles.dropdownLink}>Two-Factor Auth</Link>}
                    {user && <Link href="/notifications" style={styles.dropdownLink}>Alert Preferences</Link>}
                  </div>
                </div>
              )}
            </div>

            <Link href="/support" style={styles.navLink}>Support</Link>
            <Link href="/market-news" style={styles.navLink}>Market News</Link>
          </div>

          {/* Action Buttons */}
          <div style={styles.actionButtons}>
            {user ? (
              <>
                <Link href="/dashboard" style={styles.dashboardBtn}>Dashboard</Link>
                <button onClick={handleSignOut} style={styles.signOutBtn}>Sign Out</button>
              </>
            ) : (
              <>
                <Link href="/apply" style={styles.applyBtn}>Apply Now</Link>
                <Link href="/login" style={styles.loginBtn}>Sign In</Link>
              </>
            )}
          </div>

          {/* Hamburger Menu Button */}
          <button 
            style={styles.hamburgerBtn}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <div style={{
              ...styles.hamburgerLine,
              ...(mobileMenuOpen ? styles.hamburgerLineOpen1 : {})
            }}></div>
            <div style={{
              ...styles.hamburgerLine,
              ...(mobileMenuOpen ? styles.hamburgerLineOpen2 : {})
            }}></div>
            <div style={{
              ...styles.hamburgerLine,
              ...(mobileMenuOpen ? styles.hamburgerLineOpen3 : {})
            }}></div>
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div style={styles.mobileMenu}>
            <div style={styles.mobileMenuContent}>
              {user ? (
                <>
                  <div style={styles.mobileUserInfo}>
                    <span style={styles.welcomeText}>Welcome, {user.email}</span>
                  </div>
                  <Link href="/dashboard" style={styles.mobileLink} onClick={() => setMobileMenuOpen(false)}>
                    🏠 Dashboard
                  </Link>
                  <Link href="/transfer" style={styles.mobileLink} onClick={() => setMobileMenuOpen(false)}>
                    💸 Transfer Money
                  </Link>
                  <Link href="/cards" style={styles.mobileLink} onClick={() => setMobileMenuOpen(false)}>
                    💳 My Cards
                  </Link>
                  <Link href="/transactions" style={styles.mobileLink} onClick={() => setMobileMenuOpen(false)}>
                    📊 Transactions
                  </Link>
                  <Link href="/investments" style={styles.mobileLink} onClick={() => setMobileMenuOpen(false)}>
                    📈 Investments
                  </Link>
                  <Link href="/crypto" style={styles.mobileLink} onClick={() => setMobileMenuOpen(false)}>
                    ₿ Crypto Trading
                  </Link>
                </>
              ) : (
                <>
                  <Link href="/apply" style={styles.mobilePrimaryLink} onClick={() => setMobileMenuOpen(false)}>
                    🚀 Apply Now
                  </Link>
                  <Link href="/login" style={styles.mobilePrimaryLink} onClick={() => setMobileMenuOpen(false)}>
                    👤 Sign In
                  </Link>
                </>
              )}
              
              <div style={styles.mobileDivider}></div>
              
              <Link href="/loans" style={styles.mobileLink} onClick={() => setMobileMenuOpen(false)}>
                🏠 Loans
              </Link>
              <Link href="/support" style={styles.mobileLink} onClick={() => setMobileMenuOpen(false)}>
                💬 Support
              </Link>
              <Link href="/faq" style={styles.mobileLink} onClick={() => setMobileMenuOpen(false)}>
                ❓ FAQ
              </Link>
              <Link href="/market-news" style={styles.mobileLink} onClick={() => setMobileMenuOpen(false)}>
                📰 Market News
              </Link>
              
              {user && (
                <>
                  <div style={styles.mobileDivider}></div>
                  <button 
                    onClick={() => { handleSignOut(); setMobileMenuOpen(false); }} 
                    style={styles.mobileSignOutBtn}
                  >
                    🚪 Sign Out
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}

const styles = {
  header: {
    width: '100%',
    backgroundColor: '#ffffff',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    position: 'sticky',
    top: 0,
    zIndex: 1000,
  },
  topBar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '8px 20px',
    backgroundColor: '#1e3a8a',
    color: '#ffffff',
    fontSize: '14px',
  },
  scrollText: {
    fontWeight: '500',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    flex: 1,
  },
  topLinks: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
  },
  topLink: {
    color: '#ffffff',
    textDecoration: 'none',
    fontSize: '13px',
    padding: '4px 8px',
    borderRadius: '4px',
    transition: 'background-color 0.2s',
  },
  phone: {
    fontWeight: 'bold',
    fontSize: '13px',
  },
  nav: {
    backgroundColor: '#ffffff',
    borderBottom: '1px solid #e5e7eb',
  },
  navContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '15px 20px',
    maxWidth: '1400px',
    margin: '0 auto',
    position: 'relative',
  },
  logoContainer: {
    display: 'flex',
    alignItems: 'center',
    textDecoration: 'none',
    gap: '12px',
  },
  logo: {
    height: '45px',
    width: 'auto',
  },
  bankName: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#1e3a8a',
    letterSpacing: '-0.5px',
  },
  desktopMenu: {
    display: 'flex',
    alignItems: 'center',
    gap: '30px',
  },
  dropdown: {
    position: 'relative',
  },
  dropdownBtn: {
    background: 'none',
    border: 'none',
    color: '#374151',
    fontSize: '16px',
    fontWeight: '500',
    padding: '10px 15px',
    cursor: 'pointer',
    borderRadius: '6px',
    transition: 'all 0.2s',
  },
  dropdownContent: {
    position: 'absolute',
    top: '100%',
    left: '0',
    backgroundColor: '#ffffff',
    minWidth: '600px',
    padding: '25px',
    boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
    borderRadius: '12px',
    border: '1px solid #e5e7eb',
    zIndex: 200,
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '25px',
  },
  dropdownSection: {
    minWidth: '180px',
  },
  dropdownHeading: {
    fontSize: '14px',
    fontWeight: 'bold',
    margin: '0 0 12px 0',
    color: '#1e3a8a',
    borderBottom: '1px solid #e5e7eb',
    paddingBottom: '8px',
  },
  dropdownLink: {
    display: 'block',
    color: '#6b7280',
    textDecoration: 'none',
    padding: '8px 0',
    fontSize: '14px',
    transition: 'color 0.2s',
    borderRadius: '4px',
  },
  navLink: {
    color: '#374151',
    textDecoration: 'none',
    fontSize: '16px',
    fontWeight: '500',
    padding: '10px 15px',
    borderRadius: '6px',
    transition: 'all 0.2s',
  },
  actionButtons: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  applyBtn: {
    backgroundColor: '#059669',
    color: '#ffffff',
    textDecoration: 'none',
    padding: '12px 24px',
    borderRadius: '8px',
    fontWeight: '600',
    fontSize: '14px',
    transition: 'all 0.2s',
    boxShadow: '0 2px 4px rgba(5, 150, 105, 0.2)',
  },
  loginBtn: {
    backgroundColor: '#1e3a8a',
    color: '#ffffff',
    textDecoration: 'none',
    padding: '12px 24px',
    borderRadius: '8px',
    fontWeight: '600',
    fontSize: '14px',
    transition: 'all 0.2s',
    boxShadow: '0 2px 4px rgba(30, 58, 138, 0.2)',
  },
  dashboardBtn: {
    backgroundColor: '#059669',
    color: '#ffffff',
    textDecoration: 'none',
    padding: '12px 24px',
    borderRadius: '8px',
    fontWeight: '600',
    fontSize: '14px',
    transition: 'all 0.2s',
    boxShadow: '0 2px 4px rgba(5, 150, 105, 0.2)',
  },
  signOutBtn: {
    backgroundColor: '#ef4444',
    color: '#ffffff',
    border: 'none',
    padding: '12px 24px',
    borderRadius: '8px',
    fontWeight: '600',
    fontSize: '14px',
    transition: 'all 0.2s',
    boxShadow: '0 2px 4px rgba(239, 68, 68, 0.2)',
    cursor: 'pointer',
  },
  hamburgerBtn: {
    display: 'none',
    flexDirection: 'column',
    justifyContent: 'space-around',
    width: '30px',
    height: '30px',
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
    padding: '0',
    zIndex: 10,
  },
  hamburgerLine: {
    width: '30px',
    height: '3px',
    background: '#374151',
    borderRadius: '3px',
    transition: 'all 0.3s linear',
    position: 'relative',
    transformOrigin: '1px',
  },
  hamburgerLineOpen1: {
    transform: 'rotate(45deg)',
  },
  hamburgerLineOpen2: {
    opacity: '0',
    transform: 'translateX(20px)',
  },
  hamburgerLineOpen3: {
    transform: 'rotate(-45deg)',
  },
  mobileMenu: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: '#ffffff',
    borderTop: '1px solid #e5e7eb',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    zIndex: 100,
  },
  mobileMenuContent: {
    padding: '20px',
    maxHeight: '70vh',
    overflowY: 'auto',
  },
  mobileUserInfo: {
    backgroundColor: '#f8fafc',
    padding: '15px',
    borderRadius: '8px',
    marginBottom: '20px',
    textAlign: 'center',
  },
  welcomeText: {
    fontSize: '14px',
    color: '#1e3a8a',
    fontWeight: '600',
  },
  mobileLink: {
    display: 'block',
    color: '#374151',
    textDecoration: 'none',
    padding: '15px 0',
    fontSize: '16px',
    borderBottom: '1px solid #f3f4f6',
    fontWeight: '500',
    transition: 'color 0.2s',
  },
  mobilePrimaryLink: {
    display: 'block',
    backgroundColor: '#1e3a8a',
    color: '#ffffff',
    textDecoration: 'none',
    padding: '15px',
    fontSize: '16px',
    borderRadius: '8px',
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: '10px',
  },
  mobileDivider: {
    height: '1px',
    backgroundColor: '#e5e7eb',
    margin: '20px 0',
  },
  mobileSignOutBtn: {
    width: '100%',
    backgroundColor: '#ef4444',
    color: '#ffffff',
    border: 'none',
    padding: '15px',
    borderRadius: '8px',
    fontWeight: '600',
    fontSize: '16px',
    cursor: 'pointer',
    marginTop: '10px',
  },
};

// Add media queries for responsive design
if (typeof window !== 'undefined') {
  const mediaQuery = window.matchMedia('(max-width: 768px)');
  
  if (mediaQuery.matches) {
    styles.desktopMenu.display = 'none';
    styles.actionButtons.display = 'none';
    styles.hamburgerBtn.display = 'flex';
    styles.topLinks.display = 'none';
    styles.dropdownContent.minWidth = '300px';
    styles.dropdownContent.gridTemplateColumns = '1fr';
  }
}
