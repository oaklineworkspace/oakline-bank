// components/CTA.js
import styles from "../styles/CTA.module.css";

export default function CTA() {
  return (
    <section className={styles.cta}>
      <h2>Get Started with Oakline Bank Today</h2>
      <a href="/signup" className={styles.ctaButton}>Sign Up Now</a>
    </section>
  );
}
