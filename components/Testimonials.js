// components/Testimonials.js
import styles from "../styles/Testimonials.module.css";

const testimonialsList = [
  { name: "John Doe", text: "Oakline Bank makes banking easy and secure!", img: "/images/testimonial-1.jpg.JPG" },
  { name: "Jane Smith", text: "I love their mobile app. Everything is at my fingertips.", img: "/images/testimonial-2.jpg.JPG" },
  { name: "Sam Wilson", text: "Customer service is top-notch and always helpful.", img: "/images/testimonial-3.jpg.JPG" },
];

export default function Testimonials() {
  return (
    <section className={styles.testimonials}>
      <h2>What Our Customers Say</h2>
      <div className={styles.list}>
        {testimonialsList.map((t, idx) => (
          <div key={idx} className={styles.card}>
            <img src={t.img} alt={t.name} className={styles.profile} />
            <p>"{t.text}"</p>
            <span>- {t.name}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
