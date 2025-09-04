// components/Footer.js
import Link from 'next/link';

export default function Footer() {
  return (
    <footer style={styles.footer}>
      {/* Main Footer Content */}
      <div style={styles.container}>
        <div style={styles.footerGrid}>
          {/* Company Info */}
          <div style={styles.companySection}>
            <Link href="/" style={styles.logoContainer}>
              <img src="/images/logo-primary.png.jpg" alt="Oakline Bank Logo" style={styles.logo} />
              <span style={styles.companyName}>Oakline Bank</span>
            </Link>
            <p style={styles.companyDescription}>
              Your trusted partner for modern banking solutions. Experience secure, convenient, and innovative financial services designed for your success.
            </p>
            <div style={styles.socialMedia}>
              <a href="#" style={styles.socialLink}>📘</a>
              <a href="#" style={styles.socialLink}>🐦</a>
              <a href="#" style={styles.socialLink}>💼</a>
              <a href="#" style={styles.socialLink}>📸</a>
            </div>
          </div>

          {/* Banking Services */}
          <div style={styles.footerSection}>
            <h4 style={styles.sectionTitle}>Banking Services</h4>
            <ul style={styles.linkList}>
              <li><Link href="/apply" style={styles.footerLink}>Checking Accounts</Link></li>
              <li><Link href="/apply" style={styles.footerLink}>Savings Accounts</Link></li>
              <li><Link href="/apply" style={styles.footerLink}>Business Banking</Link></li>
              <li><Link href="/loans" style={styles.footerLink}>Loans & Credit</Link></li>
              <li><Link href="/investments" style={styles.footerLink}>Investment Services</Link></li>
              <li><Link href="/crypto" style={styles.footerLink}>Crypto Trading</Link></li>
            </ul>
          </div>

          {/* Digital Banking */}
          <div style={styles.footerSection}>
            <h4 style={styles.sectionTitle}>Digital Banking</h4>
            <ul style={styles.linkList}>
              <li><Link href="/login" style={styles.footerLink}>Online Banking</Link></li>
              <li><Link href="/transfer" style={styles.footerLink}>Money Transfer</Link></li>
              <li><Link href="/bill-pay" style={styles.footerLink}>Bill Pay</Link></li>
              <li><Link href="/cards" style={styles.footerLink}>Manage Cards</Link></li>
              <li><Link href="/notifications" style={styles.footerLink}>Account Alerts</Link></li>
              <li><Link href="/security" style={styles.footerLink}>Security Center</Link></li>
            </ul>
          </div>

          {/* Support & Legal */}
          <div style={styles.footerSection}>
            <h4 style={styles.sectionTitle}>Support & Legal</h4>
            <ul style={styles.linkList}>
              <li><Link href="/support" style={styles.footerLink}>Customer Support</Link></li>
              <li><Link href="/faq" style={styles.footerLink}>FAQ</Link></li>
              <li><Link href="/privacy" style={styles.footerLink}>Privacy Policy</Link></li>
              <li><Link href="/terms" style={styles.footerLink}>Terms of Service</Link></li>
              <li><Link href="/compliance" style={styles.footerLink}>Compliance</Link></li>
              <li><Link href="/disclosures" style={styles.footerLink}>Disclosures</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div style={styles.footerSection}>
            <h4 style={styles.sectionTitle}>Contact Us</h4>
            <div style={styles.contactInfo}>
              <div style={styles.contactItem}>
                <span style={styles.contactIcon}>📞</span>
                <div>
                  <p style={styles.contactLabel}>Customer Service</p>
                  <p style={styles.contactValue}>1-800-OAKLINE</p>
                </div>
              </div>
              <div style={styles.contactItem}>
                <span style={styles.contactIcon}>✉️</span>
                <div>
                  <p style={styles.contactLabel}>Email Support</p>
                  <p style={styles.contactValue}>support@oaklinebank.com</p>
                </div>
              </div>
              <div style={styles.contactItem}>
                <span style={styles.contactIcon}>🕒</span>
                <div>
                  <p style={styles.contactLabel}>Support Hours</p>
                  <p style={styles.contactValue}>24/7 Available</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div style={styles.footerBottom}>
        <div style={styles.container}>
          <div style={styles.bottomContent}>
            <p style={styles.copyright}>
              © {new Date().getFullYear()} Oakline Bank. All rights reserved. FDIC Insured | Equal Housing Lender
            </p>
            <div style={styles.certifications}>
              <span style={styles.certification}>🏛️ FDIC Insured</span>
              <span style={styles.certification}>🔒 SSL Secured</span>
              <span style={styles.certification}>✅ SOC 2 Compliant</span>
            </div>
          </div>
          <div style={styles.legalNotice}>
            <p style={styles.legalText}>
              Oakline Bank is a full-service digital bank offering checking, savings, loans, and investment services. 
              Member FDIC. All deposit accounts are FDIC-insured up to $250,000 per depositor.
            </p>
            <div style={styles.additionalInfo}>
              <p style={styles.legalText}>
                NMLS ID: 123456 | Routing Number: 987654321 | Swift Code: OAKLUS33 | Equal Housing Lender
              </p>
              <p style={styles.legalText}>
                Investment products are not FDIC insured, may lose value, and are not bank guaranteed. 
                Cryptocurrency trading involves substantial risk of loss.
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

const styles = {
  footer: {
    backgroundColor: '#1e293b',
    color: '#ffffff',
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 20px',
  },
  footerGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '50px',
    padding: '80px 0 50px 0',
  },
  companySection: {
    gridColumn: 'span 1',
  },
  logoContainer: {
    display: 'flex',
    alignItems: 'center',
    textDecoration: 'none',
    marginBottom: '20px',
    gap: '12px',
  },
  logo: {
    height: '50px',
    width: 'auto',
  },
  companyName: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#ffffff',
  },
  companyDescription: {
    fontSize: '16px',
    lineHeight: '1.6',
    color: '#cbd5e1',
    marginBottom: '30px',
  },
  socialMedia: {
    display: 'flex',
    gap: '15px',
  },
  socialLink: {
    fontSize: '24px',
    textDecoration: 'none',
    transition: 'transform 0.2s',
  },
  footerSection: {},
  sectionTitle: {
    fontSize: '18px',
    fontWeight: 'bold',
    marginBottom: '25px',
    color: '#ffffff',
  },
  linkList: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
  },
  footerLink: {
    color: '#cbd5e1',
    textDecoration: 'none',
    fontSize: '15px',
    lineHeight: '2.2',
    transition: 'color 0.2s',
    display: 'block',
  },
  contactInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  contactItem: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '12px',
  },
  contactIcon: {
    fontSize: '20px',
    marginTop: '2px',
  },
  contactLabel: {
    fontSize: '14px',
    color: '#94a3b8',
    margin: '0 0 4px 0',
  },
  contactValue: {
    fontSize: '15px',
    color: '#ffffff',
    margin: 0,
    fontWeight: '500',
  },
  footerBottom: {
    borderTop: '1px solid #334155',
    backgroundColor: '#0f172a',
  },
  bottomContent: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '30px 0 20px 0',
    flexWrap: 'wrap',
    gap: '20px',
  },
  copyright: {
    fontSize: '14px',
    color: '#94a3b8',
    margin: 0,
  },
  certifications: {
    display: 'flex',
    gap: '20px',
    flexWrap: 'wrap',
  },
  certification: {
    fontSize: '12px',
    color: '#94a3b8',
    fontWeight: '500',
  },
  legalNotice: {
    paddingBottom: '30px',
  },
  legalText: {
    fontSize: '12px',
    color: '#94a3b8',
    lineHeight: '1.5',
    margin: '0 0 8px 0',
    textAlign: 'center',
  },
  additionalInfo: {
    marginTop: '16px',
    paddingTop: '16px',
    borderTop: '1px solid #334155',
  },
};
