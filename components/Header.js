// components/Header.js
import { useState } from "react";
import Link from "next/link";
import styles from "../styles/Header.module.css";

export default function Header({ theme, setTheme }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className={styles.header}>
      <div className={styles.logo}>
        <Link href="/">Oakline Bank</Link>
      </div>

      <nav className={`${styles.nav} ${menuOpen ? styles.open : ""}`}>
        <Link href="/">Home</Link>
        <Link href="/features">Features</Link>
        <Link href="/debit-card">Debit Card</Link>
        <Link href="/mobile">Mobile</Link>
        <Link href="/pos-solutions">POS</Link>
        <Link href="/development-crypto">Crypto</Link>
      </nav>

      <div className={styles.actions}>
        <button onClick={() => setTheme(theme === "light" ? "dark" : "light")}>
          {theme === "light" ? "🌙" : "☀️"}
        </button>
        <button className={styles.hamburger} onClick={() => setMenuOpen(!menuOpen)}>
          ☰
        </button>
      </div>
    </header>
  );
}
