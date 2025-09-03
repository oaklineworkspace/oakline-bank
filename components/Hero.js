// components/Hero.js
import Image from 'next/image';

export default function Hero() {
  return (
    <section style={{ textAlign:'center', padding:'50px', background:'#f0f4f8' }}>
      <h1>Welcome to Oakline Bank</h1>
      <p>Secure and convenient banking solutions for everyone.</p>
      <div style={{ display:'flex', justifyContent:'center', flexWrap:'wrap', gap:'20px', marginTop:'30px' }}>
        <Image src="/images/hero-debit-card-1.jpg.PNG" width={300} height={180} alt="Debit Card 1" />
        <Image src="/images/hero-mobile.jpg.PNG" width={300} height={180} alt="Mobile Banking" />
        <Image src="/images/hero-development-fund.jpg.PNG" width={300} height={180} alt="Development Fund" />
      </div>
    </section>
  );
}
