// components/Testimonials.js
export default function Testimonials({ testimonials }) {
  return (
    <section style={styles.section}>
      <h2 style={styles.heading}>What Our Customers Say</h2>
      <div style={styles.container}>
        {testimonials.map((t, idx) => (
          <div key={idx} style={styles.card}>
            <img src={t.image} alt={t.name} style={styles.image} />
            <p style={styles.text}>"{t.text}"</p>
            <p style={styles.name}>- {t.name}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

const styles = {
  section: {
    padding: '50px 20px',
    backgroundColor: '#ffffff',
    textAlign: 'center',
  },
  heading: {
    fontSize: '2rem',
    marginBottom: '40px',
    color: '#0070f3',
  },
  container: {
    display: 'flex',
    gap: '30px',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  card: {
    maxWidth: '250px',
    padding: '20px',
    borderRadius: '10px',
    boxShadow: '0px 4px 12px rgba(0,0,0,0.1)',
    backgroundColor: '#f9f9f9',
    textAlign: 'center',
  },
  image: {
    width: '80px',
    height: '80px',
    borderRadius: '50%',
    objectFit: 'cover',
    marginBottom: '15px',
  },
  text: {
    fontSize: '0.95rem',
    fontStyle: 'italic',
    marginBottom: '10px',
    color: '#333',
  },
  name: {
    fontWeight: 'bold',
    color: '#0070f3',
  },
};
