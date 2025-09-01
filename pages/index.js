// pages/index.js
import { useState } from 'react';
import Head from 'next/head';

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <Head>
        <title>My Next.js Site</title>
        <meta
          name="description"
          content="A clean Next.js starter homepage with responsive nav."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* HEADER */}
      <header>
        <div className="logo">MyBrand</div>
        <nav>
          <button
            className="menu-toggle"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            ☰
          </button>
          <ul className={menuOpen ? 'show' : ''}>
            <li><a href="#hero" onClick={() => setMenuOpen(false)}>Home</a></li>
            <li>
              <a href="#features" onClick={() => setMenuOpen(false)}>Features</a>
              <ul className="dropdown-content">
                <li><a href="#feature1" onClick={() => setMenuOpen(false)}>Feature 1</a></li>
                <li><a href="#feature2" onClick={() => setMenuOpen(false)}>Feature 2</a></li>
                <li><a href="#feature3" onClick={() => setMenuOpen(false)}>Feature 3</a></li>
              </ul>
            </li>
            <li><a href="#testimonials" onClick={() => setMenuOpen(false)}>Testimonials</a></li>
            <li><a href="#contact" onClick={() => setMenuOpen(false)}>Contact</a></li>
          </ul>
        </nav>
      </header>

      {/* HERO */}
      <section id="hero" className="hero">
        <h1>Welcome to My Next.js Site</h1>
        <p>Your awesome tagline goes here. Build modern, responsive websites easily.</p>
        <a href="#features" className="btn">Get Started</a>
      </section>

      {/* FEATURES */}
      <section id="features">
        <h2>Our Features</h2>
        <div className="grid">
          <div className="box">
            <h3>Fast</h3>
            <p>Optimized for speed with Next.js and modern tooling.</p>
          </div>
          <div className="box">
            <h3>Responsive</h3>
            <p>Mobile-first design that works across all devices.</p>
          </div>
          <div className="box">
            <h3>Scalable</h3>
            <p>Built to scale with your business growth.</p>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section id="testimonials">
        <h2>What People Say</h2>
        <div className="testimonial-grid">
          <div className="testimonial">
            <img src="https://via.placeholder.com/90" alt="User" />
            <p>"This is the best platform I’ve ever used!"</p>
            <h4>- Alex</h4>
          </div>
          <div className="testimonial">
            <img src="https://via.placeholder.com/90" alt="User" />
            <p>"A game-changer for my business."</p>
            <h4>- Jamie</h4>
          </div>
          <div className="testimonial">
            <img src="https://via.placeholder.com/90" alt="User" />
            <p>"Highly recommend to everyone!"</p>
            <h4>- Taylor</h4>
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact">
        <h2>Contact Us</h2>
        <form className="contact-form">
          <input type="text" placeholder="Your Name" required />
          <input type="email" placeholder="Your Email" required />
          <textarea placeholder="Your Message" rows="5" required></textarea>
          <button type="submit">Send</button>
        </form>
      </section>

      {/* FOOTER */}
      <footer>
        <p>&copy; {new Date().getFullYear()} MyBrand. All rights reserved.</p>
      </footer>
    </>
  );
}
