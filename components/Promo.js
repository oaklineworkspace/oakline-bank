export default function Promo({
  imgSrc,
  title,
  description,
  isDark = false,
  ctaText,
  ctaHref,
}) {
  return (
    <section className={`promo-section ${isDark ? "dark" : ""}`}>
      <div className="promo-image">
        <img src={imgSrc} alt={title} />
      </div>
      <div className="promo-content">
        {title && <h2>{title}</h2>}
        {description && <p>{description}</p>}
        {ctaText && ctaHref && (
          <a className="cta-button" href={ctaHref}>
            {ctaText}
          </a>
        )}
      </div>
    </section>
  );
}
