export default function Footer() {
  return (
    <footer>
      <div className="footer-inner">
        <div className="footer-logo">
          <img src="/images/logo-primary.png.jpg" alt="Oakline Logo" />
        </div>
        <div className="footer-links">
          <a href="index.html">Home</a>
          <a href="about.html">About Us</a>
          <a href="contact.html">Contact</a>
          <a href="privacy.html">Privacy Policy</a>
        </div>
        <div className="footer-copy">
          &copy; {new Date().getFullYear()} Oakline Bank. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
