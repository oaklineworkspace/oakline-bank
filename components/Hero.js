// components/Hero.js
import { useState } from 'react';
import styles from '../styles/Hero.module.css';

export default function Hero() {
  const [accountType, setAccountType] = useState('Savings');

  const handleSelect = (e) => {
    setAccountType(e.target.value);
  };

  const handleGetStarted = () => {
    alert(`You selected ${accountType} account! Redirecting to application...`);
    // Here you can redirect to the application page
    // e.g., router.push('/create-account')
  };

  return (
    <section className={styles.hero}>
      <div className={styles.content}>
        <h1>Welcome to Oakline Bank</h1>
        <p>Your modern banking experience starts here. Open an account instantly and manage everything online.</p>

        <div className={styles.cta}>
          <select value={accountType} onChange={handleSelect} className={styles.dropdown}>
            <option value="Savings">Savings Account</option>
            <option value="Checking">Checking Account</option>
            <option value="Business">Business Account</option>
          </select>
          <button className={styles.getStarted} onClick={handleGetStarted}>
            Get Started
          </button>
        </div>
      </div>
      <div className={styles.image}>
        <img src="/hero.jpg" alt="Banking hero image" />
      </div>
    </section>
  );
}
