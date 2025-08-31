// pages/index.js
import React from 'react';
import Link from 'next/link';

const HomePage = () => {
  return (
    <div>
      {/* Hero Section */}
      <section className="hero container my-5 position-relative">
        <h1>Bank Smarter. Faster. Safer.</h1>
        <Link href="/signup">
          <a className="btn-green">Get Your Debit Card</a>
        </Link>
      </section>

      {/* Features Section */}
      <div className="wrap">
        <div className="features-grid">
          <div className="feature reveal">
            <i className="fas fa-hand-holding-dollar"></i>
            <h3>Loans</h3>
            <p>Personal & business loans with competitive rates.</p>
            <Link href="/loans"><a className="btn-green">Apply Loan</a></Link>
          </div>

          <div className="feature reveal">
            <i className="fas fa-coins"></i>
            <h3>Certificates (CDs)</h3>
            <p>Fixed-term deposits with guaranteed returns.</p>
            <Link href="/cd"><a className="btn-green">Open CD</a></Link>
          </div>

          <div className="feature reveal">
            <i className="fas fa-wallet"></i>
            <h3>Digital Wallet</h3>
            <p>Connect cards for instant mobile payments & wallets.</p>
            <Link href="/mobile"><a className="btn-green">Learn More</a></Link>
          </div>

          <div className="feature reveal">
            <i className="fas fa-globe"></i>
            <h3>International Transfers</h3>
            <p>Fast cross-border payments with competitive FX.</p>
            <Link href="/transfers"><a className="btn-green">Send Money</a></Link>
          </div>

          <div className="feature reveal">
            <i className="fas fa-shield-alt"></i>
            <h3>Security & Fraud Protection</h3>
            <p>Multi-layer encryption, 2FA, and real-time fraud alerts.</p>
            <Link href="/security"><a className="btn-green">Security</a></Link>
          </div>

          <div className="feature reveal">
            <i className="fas fa-chart-line"></i>
            <h3>Investments</h3>
            <p>Advisory, robo-advice and investment accounts.</p>
            <Link href="/invest"><a className="btn-green">Invest</a></Link>
          </div>
        </div>
      </div>

      {/* Product Hero: Debit Card */}
      <section className="product-hero" style={{ margin: '48px auto', maxWidth: '1100px', textAlign: 'center' }}>
        <figure>
          <img src="/images/hero-debit-card-1.jpg.PNG" alt="Oakline debit card" />
        </figure>
        <h2>Oakline Debit Card</h2>
        <p style={{ color: 'var(--muted)' }}>
          Secure worldwide, contactless payments, instant lock & unlock, and real-time spend tracking.
        </p>
        <Link href="/debit-card">
          <a className="btn-green">Get Your Debit Card</a>
        </Link>
      </section>

      {/* Testimonials */}
      <div className="wrap" style={{ marginTop: '20px' }}>
        <h2 style={{ textAlign: 'center', color: 'var(--brand)' }}>What Our Customers Say</h2>
        <div className="test-grid" style={{ marginTop: '18px' }}>
          <div className="testimonial reveal">
            <div className="meta">
              <img src="/images/testimonial-1.jpg.JPG" alt="Jane D." />
              <strong>Jane D.</strong>
            </div>
            <p>"Oakline Bank makes managing my money so simple. The app is fast and secure!"</p>
          </div>

          <div className="testimonial reveal">
            <div className="meta">
              <img src="/images/testimonial-2.jpg.JPG" alt="Charlotte S." />
              <strong>Charlotte S.</strong>
            </div>
            <p>"I love their business accounts. The transfers are instant and the support is excellent."</p>
          </div>

          <div className="testimonial reveal">
            <div className="meta">
              <img src="/images/testimonial-3.jpg.JPG" alt="Scott R." />
              <strong>Scott R.</strong>
            </div>
            <p>"Opening a savings account was so easy. The rates are great compared to other banks."</p>
          </div>
        </div>
      </div>

      {/* Final CTA Section */}
      <section style={{ padding: '48px 20px', background: 'var(--bg)', textAlign: 'center' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '1.9rem', color: 'var(--brand)' }}>Why Choose Oakline Bank?</h2>
          <p style={{ color: 'var(--text)', lineHeight: '1.7', marginTop: '14px' }}>
            At Oakline Bank, we combine innovation, security, and personalized service to give you a banking experience unlike any other.
            Whether you're managing personal finances, running a business, investing, or exploring modern opportunities like cryptocurrency banking,
            we provide tools, guidance, and support to help you reach your financial goals. Our intuitive mobile app, responsive customer support,
            and cutting-edge security keep you in control wherever you are. Trust, transparency, and growth are at the heart of everything we do.
            Join thousands of satisfied customers who bank smarter, faster, and safer with Oakline.
          </p>
          <div style={{ marginTop: '18px' }}>
            <Link href="/signup">
              <a className="btn-green" style={{ fontSize: '1.1rem', padding: '14px 28px' }}>Open Account Now</a>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexWrap: 'wrap', gap: '28px', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div style={{ flex: '1', minWidth: '240px' }}>
            <img src="/images/logo-secondary.png.jpg" alt="Oakline secondary logo" style={{ height: '42px', marginBottom: '12px' }} />
            <p style={{ color: 'var(--muted)', maxWidth: '340px' }}>
              Oakline Bank provides modern, secure banking for individuals and businesses. Fast transfers, reliable service, and innovative products.
            </p>
          </div>

          <div style={{ flex: '1', minWidth: '160px' }}>
            <h4>Services</h4>
            <ul style={{ listStyle: 'none', padding: '0', margin: '8px 0 0', color: 'var(--muted)' }}>
              <li><Link href="/checking"><a>Checking</a></Link></li>
              <li><Link href="/savings"><a>Savings</a></Link></li>
              <li><Link href="/business"><a>Business</a></Link></li>
              <li><Link href="/loans"><a>Loans</a></Link></li>
            </ul>
          </div>

          <div style={{ flex: '1', minWidth: '160px' }}>
            <h4>Quick Links</h4>
            <ul style={{ listStyle: 'none', padding: '0', margin: '8px 0 0', color: 'var(--muted)' }}>
              <li><Link href="/login"><a>Login</a></Link></li>
              <li><Link href="/signup"><a>Open Account</a></Link></li>
              <li><a href="#contact">Contact</a></li>
            </ul>
          </div>

          <div style={{ flex: '1', minWidth: '200px' }}>
            <h4>Follow Us</h4>
            <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
              <a href="#" aria-label="facebook" style={{ color: 'inherit' }}><i className="fab fa-facebook-f"></i></a>
              <a href="#" aria-label="twitter" style={{ color: 'inherit' }}><i className="fab fa-twitter"></i></a>
              <a href="#" aria-label="linkedin" style={{ color: 'inherit' }}><i className="fab fa-linkedin-in"></i></a>
            </div>
          </div>
        </div>

        <div style={{ borderTop: '1px solid rgba(255,255,255,.08)', marginTop: '24px', paddingTop: '12px', textAlign: 'center', color: 'var(--muted)' }}>
          &copy; {new Date().getFullYear()} Oakline Bank. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
