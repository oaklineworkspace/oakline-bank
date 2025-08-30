import React from 'react';

const HomePage = () => {
  return (
    <div>
      {/* Hero Section */}
      <section className="hero container my-5 position-relative">
        <h1>Bank Smarter. Faster. Safer.</h1>
        <a href="signup.html" className="btn-green">Get Your Debit Card</a>
      </section>

      {/* Features Section */}
      <div className="wrap">
        <div className="features-grid">
          <div className="feature reveal">
            <i className="fas fa-hand-holding-dollar"></i>
            <h3>Loans</h3>
            <p>Personal & business loans with competitive rates.</p>
            <a className="btn-green" href="loans.html">Apply Loan</a>
          </div>

          <div className="feature reveal">
            <i className="fas fa-coins"></i>
            <h3>Certificates (CDs)</h3>
            <p>Fixed-term deposits with guaranteed returns.</p>
            <a className="btn-green" href="cd.html">Open CD</a>
          </div>

          <div className="feature reveal">
            <i className="fas fa-wallet"></i>
            <h3>Digital Wallet</h3>
            <p>Connect cards for instant mobile payments & wallets.</p>
            <a className="btn-green" href="mobile.html">Learn More</a>
          </div>

          <div className="feature reveal">
            <i className="fas fa-globe"></i>
            <h3>International Transfers</h3>
            <p>Fast cross-border payments with competitive FX.</p>
            <a className="btn-green" href="transfers.html">Send Money</a>
          </div>

          <div className="feature reveal">
            <i className="fas fa-shield-alt"></i>
            <h3>Security & Fraud Protection</h3>
            <p>Multi-layer encryption, 2FA, and real-time fraud alerts.</p>
            <a className="btn-green" href="security.html">Security</a>
          </div>

          <div className="feature reveal">
            <i className="fas fa-chart-line"></i>
            <h3>Investments</h3>
            <p>Advisory, robo-advice and investment accounts.</p>
            <a className="btn-green" href="invest.html">Invest</a>
          </div>
        </div>
      </div>

      {/* Product Hero: Debit Card */}
      <section className="product-hero" style={{ margin: '48px auto', maxWidth: '1100px' }}>
        <figure>
          <img src="images/hero-debit-card-1.jpg.PNG" alt="Oakline debit card" />
        </figure>
        <div style={{ maxWidth: '820px', textAlign: 'center' }}>
          <h2>Oakline Debit Card</h2>
          <p style={{ color: 'var(--muted)' }}>
            Secure worldwide, with contactless payments, instant lock & unlock, and real-time spend tracking.
          </p>
          <a className="btn-green" href="debit-card.html">Get Your Debit Card</a>
        </div>
      </section>

      {/* Testimonial Section */}
      <div className="wrap" style={{ marginTop: '20px' }}>
        <h2 style={{ textAlign: 'center', color: 'var(--brand)' }}>What Our Customers Say</h2>
        <div className="test-grid" style={{ marginTop: '18px' }}>
          <div className="testimonial reveal">
            <div className="meta"><img src="images/testimonial-1.jpg.JPG" alt="" /><strong>Jane D.</strong></div>
            <p>"Oakline Bank makes managing my money so simple. The app is fast and secure!"</p>
          </div>

          <div className="testimonial reveal">
            <div className="meta"><img src="images/testimonial-2.jpg.JPG" alt="" /><strong>Charlotte S.</strong></div>
            <p>"I love their business accounts. The transfers are instant and the support is excellent."</p>
          </div>

          <div className="testimonial reveal">
            <div className="meta"><img src="images/testimonial-3.jpg.JPG" alt="" /><strong>Scott R.</strong></div>
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
            <a className="btn-green" href="signup.html" style={{ fontSize: '1.1rem', padding: '14px 28px' }}>Open Account Now</a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexWrap: 'wrap', gap: '28px', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div style={{ flex: '1', minWidth: '240px' }}>
            <img src="images/logo-secondary.png.jpg" alt="Oakline secondary logo" style={{ height: '42px', marginBottom: '12px' }} />
            <p style={{ color: 'var(--muted)', maxWidth: '340px' }}>
              Oakline Bank provides modern, secure banking for individuals and businesses. Fast transfers, reliable service, and innovative products.
            </p>
          </div>

          <div style={{ flex: '1', minWidth: '160px' }}>
            <h4>Services</h4>
            <ul style={{ listStyle: 'none', padding: '0', margin: '8px 0 0', color: 'var(--muted)' }}>
              <li><a href="checking.html">Checking</a></li>
              <li><a href="savings.html">Savings</a></li>
              <li><a href="business.html">Business</a></li>
              <li><a href="loans.html">Loans</a></li>
            </ul>
          </div>

          <div style={{ flex: '1', minWidth: '160px' }}>
            <h4>Quick Links</h4>
            <ul style={{ listStyle: 'none', padding: '0', margin: '8px 0 0', color: 'var(--muted)' }}>
              <li><a href="login.html">Login</a></li>
              <li><a href="signup.html">Open Account</a></li>
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

        <div style={{ borderTop: '1px solid rgba(255,255,255,.08)', marginTop: '28px', paddingTop: '18px', textAlign: 'center', color: 'var(--muted)' }}>
          <p style={{ margin: '8px 0' }}>&copy; 2025 Oakline Bank — All rights reserved.</p>
          <p style={{ margin: '0', fontSize: '.85rem' }}>
            Oakline Bank is a member of FDIC and an Equal Housing Lender. Terms, rates, and offers are subject to change.
          </p>
        </div>
      </footer>

      {/* Floating Chat */}
      <button id="chatButton" title="Chat with Oakline">
        <i className="fas fa-comments"></i>
      </button>

      {/* Scripts for interactions */}
      <script>
        // Floating chat button logic
        const chatBtn = document.getElementById('chatButton');
        chatBtn.addEventListener('click', () => {
          window.open('https://oakline-bank.vercel.app/chat', 'oakline-chat', 'width=420,height=620');
        });
      </script>
    </div>
  );
};

export default HomePage;
