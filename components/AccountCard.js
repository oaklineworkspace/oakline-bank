// components/AccountCard.js
import styles from '../styles/AccountCard.module.css';

export default function AccountCard({ type, benefits }) {
  return (
    <div className={styles.card}>
      <h3>{type}</h3>
      <ul>
        {benefits.map((b, i) => <li key={i}>{b}</li>)}
      </ul>
      <a href="/create-account" className={styles.button}>Get Started</a>
    </div>
  );
}
