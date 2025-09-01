import styles from '../styles/AccountCard.module.css';

export default function AccountCard({ accountName, balance }) {
  return (
    <div className={styles.card}>
      <h3>{accountName}</h3>
      <p>{balance}</p>
    </div>
  );
}
