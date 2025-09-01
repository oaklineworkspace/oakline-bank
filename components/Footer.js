// components/Footer.js
import styles from '../styles/Footer.module.css';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <p>&copy; {new Date().getFullYear()} Oakline Bank. All rights reserved.</p>
      <div className={styles.links}>
        <Link href="/privacy">Privacy Policy</Link>
        <Link href="/terms">Terms & Conditions</Link>
        <Link href="/support">Support</Link>
      </div>
    </footer>
  );
}
