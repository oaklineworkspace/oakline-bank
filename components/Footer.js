// components/Footer.js
import styles from "../styles/Footer.module.css";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.top}>
        <div className={styles.logo}>Oakline Bank</div>
        <div className={styles.links}>
          <div>
            <h4>Products</h4>
            <Link href="/accounts">Accounts</Link>
            <Link href="/loans">Loans</Link>
            <Link href="/investments">Investments</Link>
          </div>
          <div>
            <h4>Company</h4>
            <Link href="/about">About Us</Link>
            <Link href="/careers">Careers</Link>
            <Link href="/contact">Contact</Link>
          </div>
          <div>
            <h4>Support</h4>
            <Link href="/help">Help Center</Link>
            <Link href="/faq">FAQ</Link>
            <Link href="/security">Security</Link>
          </div>
        </div>
      </div>

      <div className={styles.bottom}>
        <p>© {new Date().getFullYear()} Oakline Bank. All rights reserved.</p>
        <div className={styles.socials}>
          <a href="#"><i className="fab fa-facebook-f"></i></a>
          <a href="#"><i className="fab fa-twitter"></i></a>
          <a href="#"><i className="fab fa-linkedin-in"></i></a>
          <a href="#"><i className="fab fa-instagram"></i></a>
        </div>
      </div>
    </footer>
  );
}
