// components/Hero.js
import styles from "../styles/Hero.module.css";

export default function Hero({ title, subtitle, ctaText, ctaLink, imgSrc }) {
  return (
    <section 
      className={styles.hero} 
      style={{ backgroundImage: `url(${imgSrc || "/images/hero-mobile.jpg.PNG"})` }}
    >
      <h1>{title || "Welcome to Oakline Bank"}</h1>
      <p>{subtitle || "Modern banking at your fingertips."}</p>
      {ctaText && <a href={ctaLink || "#"} className={styles.cta}>{ctaText}</a>}
    </section>
  );
}
