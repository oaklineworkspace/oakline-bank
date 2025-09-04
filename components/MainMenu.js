// components/MainMenu.js
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

export default function MainMenu({ user = null }) {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState({});
  const [scrolled, setScrolled] = useState(false);
  const router = useRouter();

  // Add mobile styles to head
  React.useEffect(() => {
    const styleSheet = document.createElement('style');
    styleSheet.textContent = mobileStyles;
    document.head.appendChild(styleSheet);
    return () => document.head.removeChild(styleSheet);
  }, []);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleDropdown = (menu) => {
    setDropdownOpen({ ...dropdownOpen, [menu]: !dropdownOpen[menu] });
  };

  const closeAllDropdowns = () => {
    setDropdownOpen({});
    setIsOpen(false);
  };

  const isActive = (path) => router.pathname === path;

  return (
    <nav style={{
      ...styles.nav,
      background: scrolled 
        ? 'rgba(255, 255, 255, 0.95)' 
        : 'linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)',
      backdropFilter: scrolled ? 'blur(10px)' : 'none',
      color: scrolled ? '#1a202c' : '#ffffff'
    }}>
      <div style={styles.container}>
        {/* Logo */}
        <Link href="/" style={styles.logo} onClick={closeAllDropdowns}>
          <img 
            src="/images/logo-primary.png" 
            alt="Oakline Bank" 
            style={styles.logoImage}
          />
          <span style={{
            ...styles.logoText,
            color: scrolled ? '#1e40af' : '#ffffff'
          }}>
            Oakline Bank
          </span>
        </Link>

        {/* Desktop Menu */}
        <div style={styles.desktopMenu} className="desktop-menu">
          <Link 
            href="/" 
            style={{
              ...styles.navLink,
              color: scrolled ? '#1a202c' : '#ffffff',
              backgroundColor: isActive('/') ? 'rgba(255,255,255,0.1)' : 'transparent'
            }}
          >
            Home
          </Link>

          <Link 
            href="/about" 
            style={{
              ...styles.navLink,
              color: scrolled ? '#1a202c' : '#ffffff',
              backgroundColor: isActive('/about') ? 'rgba(255,255,255,0.1)' : 'transparent'
            }}
          >
            About
          </Link>

          {/* Services Dropdown */}
          <div style={styles.dropdown}>
            <button
              style={{
                ...styles.dropdownBtn,
                color: scrolled ? '#1a202c' : '#ffffff'
              }}
              onClick={() => toggleDropdown('services')}
              onMouseEnter={() => setDropdownOpen({ ...dropdownOpen, services: true })}
            >
              Services ▼
            </button>
            {dropdownOpen.services && (
              <div 
                style={styles.dropdownContent}
                className="dropdown-content"
                onMouseLeave={() => setDropdownOpen({ ...dropdownOpen, services: false })}
              >
                <div style={styles.dropdownSection}>
                  <h4 style={styles.dropdownHeading}>💳 Accounts</h4>
                  <Link href="/apply" style={styles.dropdownLink}>Checking Account</Link>
                  <Link href="/apply" style={styles.dropdownLink}>Savings Account</Link>
                  <Link href="/apply" style={styles.dropdownLink}>Business Account</Link>
                </div>
                <div style={styles.dropdownSection}>
                  <h4 style={styles.dropdownHeading}>🏠 Loans</h4>
                  <Link href="/loans" style={styles.dropdownLink}>Home Mortgage</Link>
                  <Link href="/loans" style={styles.dropdownLink}>Personal Loan</Link>
                  <Link href="/loans" style={styles.dropdownLink}>Auto Loan</Link>
                </div>
                <div style={styles.dropdownSection}>
                  <h4 style={styles.dropdownHeading}>💰 Investment</h4>
                  <Link href="/investments" style={styles.dropdownLink}>Portfolio Management</Link>
                  <Link href="/crypto" style={styles.dropdownLink}>Crypto Trading</Link>
                  <Link href="/advisory" style={styles.dropdownLink}>Financial Advisory</Link>
                </div>
              </div>
            )}
          </div>

          <Link 
            href="/contact" 
            style={{
              ...styles.navLink,
              color: scrolled ? '#1a202c' : '#ffffff',
              backgroundColor: isActive('/contact') ? 'rgba(255,255,255,0.1)' : 'transparent'
            }}
          >
            Contact
          </Link>

          {/* Conditional Menu Items */}
          {!user ? (
            <Link 
              href="/login" 
              style={{
                ...styles.loginBtn,
                background: scrolled 
                  ? 'linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)'
                  : 'rgba(255,255,255,0.2)',
                color: scrolled ? '#ffffff' : '#ffffff',
                border: scrolled ? 'none' : '1px solid rgba(255,255,255,0.3)'
              }}
            >
              Login
            </Link>
          ) : (
            <>
              <Link 
                href="/dashboard" 
                style={{
                  ...styles.navLink,
                  color: scrolled ? '#1a202c' : '#ffffff',
                  backgroundColor: isActive('/dashboard') ? 'rgba(255,255,255,0.1)' : 'transparent'
                }}
              >
                Dashboard
              </Link>
              <button 
                style={{
                  ...styles.logoutBtn,
                  color: scrolled ? '#ef4444' : '#ffffff'
                }}
                onClick={() => {
                  // Add logout logic here
                  console.log('Logout clicked');
                }}
              >
                Logout
              </button>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button 
          style={{
            ...styles.mobileMenuBtn,
            color: scrolled ? '#1a202c' : '#ffffff'
          }}
          className="mobile-menu-btn"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? '✕' : '☰'}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div style={styles.mobileMenu}>
          <Link href="/" style={styles.mobileLink} onClick={closeAllDropdowns}>
            Home
          </Link>
          <Link href="/about" style={styles.mobileLink} onClick={closeAllDropdowns}>
            About
          </Link>
          
          {/* Mobile Services */}
          <div style={styles.mobileSection}>
            <h4 style={styles.mobileSectionTitle}>Services</h4>
            <Link href="/apply" style={styles.mobileSubLink} onClick={closeAllDropdowns}>
              Account Opening
            </Link>
            <Link href="/loans" style={styles.mobileSubLink} onClick={closeAllDropdowns}>
              Loans & Credit
            </Link>
            <Link href="/investments" style={styles.mobileSubLink} onClick={closeAllDropdowns}>
              Investments
            </Link>
          </div>

          <Link href="/contact" style={styles.mobileLink} onClick={closeAllDropdowns}>
            Contact
          </Link>

          {!user ? (
            <Link href="/login" style={styles.mobileLoginBtn} onClick={closeAllDropdowns}>
              Login
            </Link>
          ) : (
            <>
              <Link href="/dashboard" style={styles.mobileLink} onClick={closeAllDropdowns}>
                Dashboard
              </Link>
              <button style={styles.mobileLogoutBtn} onClick={closeAllDropdowns}>
                Logout
              </button>
            </>
          )}
        </div>
      )}
    </nav>
  );
}

const styles = {
  nav: {
    position: 'sticky',
    top: 0,
    width: '100%',
    zIndex: 1000,
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: '80px',
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    textDecoration: 'none',
    transition: 'transform 0.3s ease',
  },
  logoImage: {
    height: '50px',
    width: 'auto',
  },
  logoText: {
    fontSize: '24px',
    fontWeight: '700',
    letterSpacing: '-0.5px',
  },
  desktopMenu: {
    display: 'flex',
    alignItems: 'center',
    gap: '32px',
  },
  navLink: {
    padding: '12px 16px',
    borderRadius: '8px',
    fontWeight: '500',
    fontSize: '16px',
    transition: 'all 0.3s ease',
    textDecoration: 'none',
  },
  dropdown: {
    position: 'relative',
  },
  dropdownBtn: {
    background: 'none',
    border: 'none',
    padding: '12px 16px',
    borderRadius: '8px',
    fontWeight: '500',
    fontSize: '16px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
  dropdownContent: {
    position: 'absolute',
    top: '100%',
    left: '0',
    background: 'white',
    borderRadius: '16px',
    padding: '24px',
    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)',
    border: '1px solid #e2e8f0',
    minWidth: '600px',
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '24px',
    zIndex: 200,
  },
  dropdownSection: {
    minWidth: '180px',
  },
  dropdownHeading: {
    fontSize: '14px',
    fontWeight: '700',
    color: '#1e40af',
    marginBottom: '12px',
    paddingBottom: '8px',
    borderBottom: '1px solid #e2e8f0',
  },
  dropdownLink: {
    display: 'block',
    padding: '8px 0',
    color: '#64748b',
    fontSize: '14px',
    textDecoration: 'none',
    transition: 'color 0.3s ease',
  },
  loginBtn: {
    padding: '12px 24px',
    borderRadius: '12px',
    fontWeight: '600',
    fontSize: '14px',
    textDecoration: 'none',
    transition: 'all 0.3s ease',
    border: 'none',
    cursor: 'pointer',
  },
  logoutBtn: {
    background: 'none',
    border: 'none',
    padding: '12px 16px',
    borderRadius: '8px',
    fontWeight: '500',
    fontSize: '16px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
  mobileMenuBtn: {
    display: 'none',
    background: 'none',
    border: 'none',
    fontSize: '24px',
    cursor: 'pointer',
    padding: '8px',
  },
  mobileMenu: {
    background: 'white',
    borderTop: '1px solid #e2e8f0',
    padding: '20px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  },
  mobileLink: {
    display: 'block',
    padding: '16px 0',
    color: '#1a202c',
    fontSize: '16px',
    fontWeight: '500',
    textDecoration: 'none',
    borderBottom: '1px solid #f1f5f9',
  },
  mobileSection: {
    marginBottom: '16px',
  },
  mobileSectionTitle: {
    fontSize: '16px',
    fontWeight: '700',
    color: '#1e40af',
    marginBottom: '12px',
    padding: '16px 0 8px 0',
    borderBottom: '1px solid #e2e8f0',
  },
  mobileSubLink: {
    display: 'block',
    padding: '12px 0 12px 20px',
    color: '#64748b',
    fontSize: '14px',
    textDecoration: 'none',
  },
  mobileLoginBtn: {
    display: 'block',
    padding: '16px 0',
    background: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)',
    color: 'white',
    textAlign: 'center',
    borderRadius: '12px',
    fontWeight: '600',
    textDecoration: 'none',
    marginTop: '16px',
  },
  mobileLogoutBtn: {
    display: 'block',
    padding: '16px 0',
    background: '#ef4444',
    color: 'white',
    textAlign: 'center',
    borderRadius: '12px',
    fontWeight: '600',
    border: 'none',
    cursor: 'pointer',
    marginTop: '16px',
    width: '100%',
  },
};

// Mobile responsive styles using CSS media queries instead of JS
const mobileStyles = `
  @media (max-width: 768px) {
    .desktop-menu { display: none !important; }
    .mobile-menu-btn { display: block !important; }
    .dropdown-content { 
      min-width: 90vw !important; 
      grid-template-columns: 1fr !important; 
      left: -50px !important; 
    }
  }
  @media (min-width: 769px) {
    .desktop-menu { display: flex !important; }
    .mobile-menu-btn { display: none !important; }
  }
`;