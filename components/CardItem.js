// components/CardItem.js
import styles from '../styles/CardItem.module.css';

export default function CardItem({ title, description, icon }) {
  return (
    <div className={styles.card}>
      <img src={icon} alt={title} className={styles.icon} />
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
}
