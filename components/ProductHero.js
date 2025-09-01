export default function ProductHero({
  imgSrc,
  title,
  description,
  list,
  ctaText,
  ctaHref,
  imageLeft = false,
}) {
  return (
    <section className="product-hero-section">
      <div className={`product-hero ${imageLeft ? "reverse" : ""}`}>
        <div className="product-image">
          <img src={imgSrc} alt={title} />
        </div>
        <div className="product-content">
          <h2>{title}</h2>
          <p>{description}</p>
          {list && (
            <ul>
              {list.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          )}
          {ctaText && ctaHref && (
            <a className="cta-button" href={ctaHref}>
              {ctaText}
            </a>
          )}
        </div>
      </div>
    </section>
  );
}
