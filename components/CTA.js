// components/CTA.js
import Link from 'next/link';

export default function CTA({ title, buttonText, buttonLink }) {
  return (
    <section className="cta">
      <h3>{title}</h3>
      <Link href={buttonLink}>
        <button>{buttonText}</button>
      </Link>
    </section>
  );
}
