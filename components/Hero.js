// components/Hero.js
export default function Hero() {
  return (
    <section 
      className="hero"
      style={{ backgroundImage: 'url("/images/hero-mobile.jpg")' }}
    >
      <h1>Welcome to Oakline Bank</h1>
      <p>Secure and convenient banking solutions for your everyday needs.</p>
      <p>Apply for a new account or enroll in online banking today.</p>
    </section>
  );
}
