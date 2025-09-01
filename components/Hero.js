// components/Hero.js
import styles from "../styles/Hero.module.css";
import Link from "next/link";

export default function Hero({ title, subtitle, ctaText, ctaHref, imgSrc }) {
  return (
    <section className={styles.hero}>
      <div className={styles.content}>
        <h1>{title}</h1>
        <p>{subtitle}</p>
        <Link href={ctaHref}>
          <button>{ctaText}</button>
        </Link>
      </div>
      {imgSrc && <img src={imgSrc} alt={title} className={styles.image} />}
    </section>
  );
}
