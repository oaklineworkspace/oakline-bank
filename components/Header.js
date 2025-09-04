// components/Header.js
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Header() {
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
                    <Link href="/crypto" style={styles.dropdownLink}>Crypto Trading</Link>
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
                    <Link href="/dashboard" style={styles.dropdownLink}>Online Banking</Link>
                    <Link href="/transfer" style={styles.dropdownLink}>Money Transfer</Link>
                    <Link href="/bill-pay" style={styles.dropdownLink}>Bill Pay</Link>
                    <Link href="/cards" style={styles.dropdownLink}>Manage Cards</Link>
                  </div>
                  <div style={styles.dropdownSection}>
                    <h4 style={styles.dropdownHeading}>🔒 Security</h4>
                    <Link href="/security" style={styles.dropdownLink}>Account Security</Link>
                    <Link href="/mfa-setup" style={styles.dropdownLink}>Two-Factor Auth</Link>
                    <Link href="/notifications" style={styles.dropdownLink}>Alert Preferences</Link>
                  </div>
                </div>
              )}
            </div>

            <Link href="/support" style={styles.navLink}>Support</Link>
            <Link href="/market-news" style={styles.navLink}>Market News</Link>
          </div>

          {/* Action Buttons */}
          <div style={styles.actionButtons}>
            <Link href="/apply" style={styles.applyBtn}>Apply Now</Link>
            <Link href="/login" style={styles.loginBtn}>Sign In</Link>
          </div>

          {/* Mobile Menu Button */}
          <button 
            style={styles.mobileMenuBtn}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            ☰
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div style={styles.mobileMenu}>
            <Link href="/apply" style={styles.mobileLink}>Apply Now</Link>
            <Link href="/login" style={styles.mobileLink}>Sign In</Link>
            <Link href="/dashboard" style={styles.mobileLink}>Online Banking</Link>
            <Link href="/loans" style={styles.mobileLink}>Loans</Link>
            <Link href="/investments" style={styles.mobileLink}>Investments</Link>
            <Link href="/support" style={styles.mobileLink}>Support</Link>
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
    maxWidth: '1200px',
    margin: '0 auto',
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
  mobileMenuBtn: {
    display: 'none',
    background: 'none',
    border: 'none',
    fontSize: '24px',
    color: '#374151',
    cursor: 'pointer',
    padding: '5px',
  },
  mobileMenu: {
    backgroundColor: '#ffffff',
    borderTop: '1px solid #e5e7eb',
    padding: '20px',
    display: 'none',
  },
  mobileLink: {
    display: 'block',
    color: '#374151',
    textDecoration: 'none',
    padding: '12px 0',
    fontSize: '16px',
    borderBottom: '1px solid #f3f4f6',
  },
};
