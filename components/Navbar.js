import { useState } from 'react';
import styles from '../styles/Navbar.module.css';

export default function Navbar() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

  return (
    <nav className={styles.navbar}>
      <div className={styles.logo}>Oakline Bank</div>
      <ul className={styles.navLinks}>
        <li><a href="#home">Home</a></li>
        <li><a href="#features">Features</a></li>
        <li 
          className={styles.dropdown}
          onMouseEnter={() => setDropdownOpen(true)}
          onMouseLeave={() => setDropdownOpen(false)}
        >
          <span>Products ▼</span>
          {dropdownOpen && (
            <ul className={styles.dropdownMenu}>
              <li><a href="#accounts">Accounts</a></li>
              <li><a href="#loans">Loans</a></li>
              <li><a href="#investments">Investments</a></li>
            </ul>
          )}
        </li>
        <li><a href="#contact">Contact</a></li>
      </ul>
      <div className={styles.authButtons}>
        <button className={styles.login}>Login</button>
        <button className={styles.signup}>Sign Up</button>
      </div>
    </nav>
  );
}
