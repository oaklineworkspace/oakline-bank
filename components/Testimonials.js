export default function Testimonials() {
  const testimonials = [
    {
      name: "John Doe",
      position: "Entrepreneur",
      text: "Oakline Bank made managing my business finances so much easier.",
      img: "/images/testimonial1.jpg",
    },
    {
      name: "Jane Smith",
      position: "Freelancer",
      text: "The mobile app is incredibly easy to use. I love it!",
      img: "/images/testimonial2.jpg",
    },
    {
      name: "Michael Lee",
      position: "Investor",
      text: "Their investment and crypto tools are top-notch.",
      img: "/images/testimonial3.jpg",
    },
  ];

  return (
    <section className="testimonials-section">
      <h2>What Our Customers Say</h2>
      <div className="testimonials-grid">
        {testimonials.map((t, idx) => (
          <div className="testimonial-card" key={idx}>
            <img src={t.img} alt={t.name} />
            <p>"{t.text}"</p>
            <h4>{t.name}</h4>
            <span>{t.position}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
