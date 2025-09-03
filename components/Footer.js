// components/Footer.js
export default function Footer() {
  return (
    <footer style={styles.footer}>
      <div>
        <img src="/images/logo-primary.png.jpg" alt="Oakline Bank Logo" style={styles.logo} />
        <p style={styles.text}>© {new Date().getFullYear()} Oakline Bank. All rights reserved.</p>
      </div>
      <div style={styles.links}>
        <a href="/application" style={styles.link}>Apply</a>
        <a href="/enroll" style={styles.link}>Enroll</a>
        <a href="/contact" style={styles.link}>Contact</a>
      </div>
    </footer>
  );
}

const styles = {
  footer: {
    backgroundColor: '#0070f3',
    color: '#fff',
    padding: '30px 20px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '15px',
  },
  logo: {
    width: '120px',
    marginBottom: '10px',
  },
  text: {
    fontSize: '0.9rem',
  },
  links: {
    display: 'flex',
    gap: '20px',
  },
  link: {
    color: '#ffffff',
    textDecoration: 'none',
    fontWeight: 'bold',
  },
};
