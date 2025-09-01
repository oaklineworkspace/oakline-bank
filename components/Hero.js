import styles from '../styles/Hero.module.css';
import Link from 'next/link';

export default function Hero({ title, subtitle, ctaText, ctaLink }) {
  return (
    <section className={styles.hero}>
      <h1>{title}</h1>
      <p>{subtitle}</p>
      <Link href={ctaLink}>
        <a className={styles.ctaButton}>{ctaText}</a>
      </Link>
    </section>
  );
}
