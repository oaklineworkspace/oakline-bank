// components/Header.js
import Link from 'next/link';

export default function Header() {
  return (
    <header style={{
      width: '100%',
      padding: '1rem 2rem',
      backgroundColor: '#0070f3',
      color: 'white',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }}>
      <h2>Oakline Bank</h2>
      <nav>
        <Link href="/application" style={{ marginRight: '1rem', color: 'white', textDecoration: 'none' }}>Apply</Link>
        <Link href="/enroll" style={{ color: 'white', textDecoration: 'none' }}>Enroll</Link>
      </nav>
    </header>
  );
}
