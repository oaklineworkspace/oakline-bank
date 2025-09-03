// components/Hero.js
export default function Hero() {
  return (
    <section style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      padding: '4rem 2rem',
      backgroundColor: '#f0f4f8'
    }}>
      <h1 style={{ color: '#0070f3', marginBottom: '1rem' }}>Welcome to Oakline Bank</h1>
      <p style={{ maxWidth: '500px', marginBottom: '2rem' }}>
        Oakline Bank offers secure and convenient banking solutions. Apply for a new account or enroll in online banking today.
      </p>
    </section>
  );
}
