// components/Header.js
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Header() {
  const [scrollText, setScrollText] = useState("Welcome to Oakline Bank – Secure, Convenient, and Innovative Banking Solutions!");

  // For scrolling effect
  useEffect(() => {
    const interval = setInterval(() => {
      setScrollText((prev) => prev.slice(1) + prev[0]);
    }, 200);
    return () => clearInterval(interval);
  }, []);

  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <header style={styles.header}>
      <div style={styles.topBar}>
        <img src="/images/logo-primary.png.jpg" alt="Oakline Bank Logo" style={styles.logo} />
        <p style={styles.scrollText}>{scrollText}</p>
      </div>
      <nav style={styles.nav}>
        <div style={styles.menu}>
          <button
            style={styles.dropbtn}
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            Bank Services ▼
          </button>
          {dropdownOpen && (
            <div style={styles.dropdownContent}>
              <h4 style={styles.dropdownHeading}>Accounts</h4>
              <Link href="/application">Checking Account</Link>
              <Link href="/application">Savings Account</Link>
              <Link href="/application">Business Account</Link>
              <Link href="/application">Student Account</Link>
              <Link href="/application">Joint Account</Link>

              <h4 style={styles.dropdownHeading}>Loans</h4>
              <Link href="/application">Home Loan</Link>
              <Link href="/application">Personal Loan</Link>
              <Link href="/application">Auto Loan</Link>
              <Link href="/application">Business Loan</Link>
              <Link href="/application">Education Loan</Link>
            </div>
          )}
        </div>
        <div style={styles.links}>
          <Link href="/application" style={styles.navLink}>Apply</Link>
          <Link href="/enroll" style={styles.navLink}>Enroll</Link>
          <Link href="/login" style={styles.navLink}>Sign In</Link>
        </div>
      </nav>
    </header>
  );
}

const styles = {
  header: {
    width: '100%',
    backgroundColor: '#f8f9fa',
    borderBottom: '1px solid #ddd',
    position: 'sticky',
    top: 0,
    zIndex: 1000,
  },
  topBar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '10px 20px',
    backgroundColor: '#0070f3',
    color: '#fff',
  },
  logo: {
    height: '50px',
  },
  scrollText: {
    fontWeight: 'bold',
    fontSize: '1rem',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
  },
  nav: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px 20px',
    backgroundColor: '#e5f1fb',
  },
  menu: {
    position: 'relative',
  },
  dropbtn: {
    backgroundColor: '#0070f3',
    color: '#fff',
    padding: '10px 15px',
    fontSize: '1rem',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  dropdownContent: {
    position: 'absolute',
    top: '40px',
    left: 0,
    backgroundColor: '#fff',
    minWidth: '220px',
    padding: '15px',
    boxShadow: '0px 8px 16px rgba(0,0,0,0.2)',
    borderRadius: '8px',
    zIndex: 100,
  },
  dropdownHeading: {
    fontSize: '1rem',
    margin: '10px 0 5px 0',
    color: '#0070f3',
  },
  links: {
    display: 'flex',
    gap: '15px',
  },
  navLink: {
    textDecoration: 'none',
    color: '#0070f3',
    fontWeight: 'bold',
    padding: '8px 12px',
    borderRadius: '5px',
    transition: '0.2s',
  },
};
