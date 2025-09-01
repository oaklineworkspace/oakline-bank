// components/ProductHero.js
import styles from "../styles/ProductHero.module.css";
import Link from "next/link";

export default function ProductHero({ imgSrc, title, description, list, ctaText, ctaHref, imageLeft }) {
  return (
    <section className={`${styles.productHero} ${imageLeft ? styles.imageLeft : ""}`}>
      {imgSrc && <img src={imgSrc} alt={title} className={styles.image} />}
      <div className={styles.content}>
        {title && <h2>{title}</h2>}
        {description && <p>{description}</p>}
        {list && (
          <ul>
            {list.map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
        )}
        {ctaText && ctaHref && (
          <Link href={ctaHref}>
            <button>{ctaText}</button>
          </Link>
        )}
      </div>
    </section>
  );
}
