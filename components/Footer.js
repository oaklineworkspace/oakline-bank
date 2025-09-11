
import Link from 'next/link';

export default function Footer() {
  return (
    <footer style={styles.footer}>
      {/* Pre-footer with quick actions */}
      <div style={styles.preFooter}>
        <div style={styles.container}>
          <div style={styles.quickActions}>
            <div style={styles.quickActionCard}>
              <div style={styles.quickActionIcon}>📱</div>
              <h4 style={styles.quickActionTitle}>Mobile Banking</h4>
              <p style={styles.quickActionDesc}>Bank on the go with our secure mobile app</p>
              <Link href="/apply" style={styles.quickActionBtn}>Download App</Link>
            </div>
            <div style={styles.quickActionCard}>
              <div style={styles.quickActionIcon}>💬</div>
              <h4 style={styles.quickActionTitle}>24/7 Support</h4>
              <p style={styles.quickActionDesc}>Get help whenever you need it</p>
              <Link href="/support" style={styles.quickActionBtn}>Contact Us</Link>
            </div>
            <div style={styles.quickActionCard}>
              <div style={styles.quickActionIcon}>🔒</div>
              <h4 style={styles.quickActionTitle}>Security Center</h4>
              <p style={styles.quickActionDesc}>Keep your accounts safe and secure</p>
              <Link href="/security" style={styles.quickActionBtn}>Learn More</Link>
            </div>
            <div style={styles.quickActionCard}>
              <div style={styles.quickActionIcon}>🏦</div>
              <h4 style={styles.quickActionTitle}>Find Branches</h4>
              <p style={styles.quickActionDesc}>Locate ATMs and branches near you</p>
              <Link href="/locations" style={styles.quickActionBtn}>Find Locations</Link>
            </div>
          </div>
        </div>
      </div>

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
              <a href="https://facebook.com/oaklinebank" style={styles.socialLink} target="_blank" rel="noopener noreferrer">
                <span style={styles.socialIcon}>📘</span>
              </a>
              <a href="https://twitter.com/oaklinebank" style={styles.socialLink} target="_blank" rel="noopener noreferrer">
                <span style={styles.socialIcon}>🐦</span>
              </a>
              <a href="https://linkedin.com/company/oaklinebank" style={styles.socialLink} target="_blank" rel="noopener noreferrer">
                <span style={styles.socialIcon}>💼</span>
              </a>
              <a href="https://instagram.com/oaklinebank" style={styles.socialLink} target="_blank" rel="noopener noreferrer">
                <span style={styles.socialIcon}>📸</span>
              </a>
              <a href="https://youtube.com/oaklinebank" style={styles.socialLink} target="_blank" rel="noopener noreferrer">
                <span style={styles.socialIcon}>📺</span>
              </a>
            </div>
            <div style={styles.awards}>
              <div style={styles.award}>🏆 Best Digital Bank 2024</div>
              <div style={styles.award}>⭐ 5-Star Customer Service</div>
              <div style={styles.award}>🛡️ Top Security Rating</div>
            </div>
          </div>

          {/* Personal Banking */}
          <div style={styles.footerSection}>
            <h4 style={styles.sectionTitle}>Personal Banking</h4>
            <ul style={styles.linkList}>
              <li><Link href="/apply" style={styles.footerLink}>Checking Accounts</Link></li>
              <li><Link href="/apply" style={styles.footerLink}>Savings Accounts</Link></li>
              <li><Link href="/apply" style={styles.footerLink}>Money Market</Link></li>
              <li><Link href="/apply" style={styles.footerLink}>Certificates of Deposit</Link></li>
              <li><Link href="/cards" style={styles.footerLink}>Debit & Credit Cards</Link></li>
              <li><Link href="/loans" style={styles.footerLink}>Personal Loans</Link></li>
              <li><Link href="/loans" style={styles.footerLink}>Auto Loans</Link></li>
              <li><Link href="/loans" style={styles.footerLink}>Home Mortgages</Link></li>
            </ul>
          </div>

          {/* Business Banking */}
          <div style={styles.footerSection}>
            <h4 style={styles.sectionTitle}>Business Banking</h4>
            <ul style={styles.linkList}>
              <li><Link href="/apply" style={styles.footerLink}>Business Checking</Link></li>
              <li><Link href="/apply" style={styles.footerLink}>Business Savings</Link></li>
              <li><Link href="/loans" style={styles.footerLink}>Business Loans</Link></li>
              <li><Link href="/loans" style={styles.footerLink}>Commercial Real Estate</Link></li>
              <li><Link href="/loans" style={styles.footerLink}>Equipment Financing</Link></li>
              <li><Link href="/bill-pay" style={styles.footerLink}>Merchant Services</Link></li>
              <li><Link href="/transfer" style={styles.footerLink}>Treasury Management</Link></li>
              <li><Link href="/cards" style={styles.footerLink}>Business Cards</Link></li>
            </ul>
          </div>

          {/* Investment & Wealth */}
          <div style={styles.footerSection}>
            <h4 style={styles.sectionTitle}>Investment & Wealth</h4>
            <ul style={styles.linkList}>
              <li><Link href="/investments" style={styles.footerLink}>Investment Portfolio</Link></li>
              <li><Link href="/investments" style={styles.footerLink}>Retirement Planning</Link></li>
              <li><Link href="/crypto" style={styles.footerLink}>Cryptocurrency</Link></li>
              <li><Link href="/financial-advisory" style={styles.footerLink}>Financial Advisory</Link></li>
              <li><Link href="/investments" style={styles.footerLink}>Mutual Funds</Link></li>
              <li><Link href="/investments" style={styles.footerLink}>Stock Trading</Link></li>
              <li><Link href="/investments" style={styles.footerLink}>Bonds & ETFs</Link></li>
              <li><Link href="/apply" style={styles.footerLink}>IRA Accounts</Link></li>
            </ul>
          </div>

          {/* Digital Services */}
          <div style={styles.footerSection}>
            <h4 style={styles.sectionTitle}>Digital Banking</h4>
            <ul style={styles.linkList}>
              <li><Link href="/login" style={styles.footerLink}>Online Banking</Link></li>
              <li><Link href="/transfer" style={styles.footerLink}>Wire Transfers</Link></li>
              <li><Link href="/bill-pay" style={styles.footerLink}>Bill Pay Service</Link></li>
              <li><Link href="/cards" style={styles.footerLink}>Card Management</Link></li>
              <li><Link href="/notifications" style={styles.footerLink}>Account Alerts</Link></li>
              <li><Link href="/security" style={styles.footerLink}>Security Settings</Link></li>
              <li><Link href="/mfa-setup" style={styles.footerLink}>Two-Factor Auth</Link></li>
              <li><Link href="/profile" style={styles.footerLink}>Profile Settings</Link></li>
            </ul>
          </div>

          {/* Support & Resources */}
          <div style={styles.footerSection}>
            <h4 style={styles.sectionTitle}>Support & Resources</h4>
            <ul style={styles.linkList}>
              <li><Link href="/support" style={styles.footerLink}>Customer Support</Link></li>
              <li><Link href="/faq" style={styles.footerLink}>FAQ</Link></li>
              <li><Link href="/market-news" style={styles.footerLink}>Market News</Link></li>
              <li><Link href="/financial-education" style={styles.footerLink}>Financial Education</Link></li>
              <li><Link href="/calculators" style={styles.footerLink}>Financial Calculators</Link></li>
              <li><Link href="/forms" style={styles.footerLink}>Forms & Documents</Link></li>
              <li><Link href="/rates" style={styles.footerLink}>Current Rates</Link></li>
              <li><Link href="/locations" style={styles.footerLink}>Branch Locator</Link></li>
            </ul>
          </div>

          {/* Contact & Legal */}
          <div style={styles.footerSection}>
            <h4 style={styles.sectionTitle}>Contact & Legal</h4>
            <div style={styles.contactInfo}>
              <div style={styles.contactItem}>
                <span style={styles.contactIcon}>📞</span>
                <div>
                  <p style={styles.contactLabel}>Customer Service</p>
                  <p style={styles.contactValue}>1-800-OAKLINE (625-5463)</p>
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
              <div style={styles.contactItem}>
                <span style={styles.contactIcon}>📍</span>
                <div>
                  <p style={styles.contactLabel}>Headquarters</p>
                  <p style={styles.contactValue}>123 Financial District, NY 10001</p>
                </div>
              </div>
            </div>
            <div style={styles.legalLinks}>
              <Link href="/privacy" style={styles.footerLink}>Privacy Policy</Link>
              <Link href="/terms" style={styles.footerLink}>Terms of Service</Link>
              <Link href="/compliance" style={styles.footerLink}>Compliance</Link>
              <Link href="/disclosures" style={styles.footerLink}>Disclosures</Link>
              <Link href="/accessibility" style={styles.footerLink}>Accessibility</Link>
            </div>
          </div>
        </div>
      </div>

      {/* Newsletter Signup */}
      <div style={styles.newsletter}>
        <div style={styles.container}>
          <div style={styles.newsletterContent}>
            <div style={styles.newsletterText}>
              <h3 style={styles.newsletterTitle}>Stay Updated with Oakline Bank</h3>
              <p style={styles.newsletterDesc}>Get the latest financial news, tips, and exclusive offers delivered to your inbox.</p>
            </div>
            <div style={styles.newsletterForm}>
              <input 
                type="email" 
                placeholder="Enter your email address" 
                style={styles.newsletterInput}
              />
              <button style={styles.newsletterBtn}>Subscribe</button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div style={styles.footerBottom}>
        <div style={styles.container}>
          <div style={styles.bottomContent}>
            <p style={styles.copyright}>
              © {new Date().getFullYear()} Oakline Bank. All rights reserved. FDIC Insured | Equal Housing Lender | NMLS ID: 123456
            </p>
            <div style={styles.certifications}>
              <span style={styles.certification}>🏛️ FDIC Insured</span>
              <span style={styles.certification}>🔒 SSL Secured</span>
              <span style={styles.certification}>✅ SOC 2 Compliant</span>
              <span style={styles.certification}>⚖️ Equal Housing Lender</span>
            </div>
          </div>
          <div style={styles.legalNotice}>
            <p style={styles.legalText}>
              Oakline Bank is a full-service digital bank offering checking, savings, loans, and investment services. 
              Member FDIC. All deposit accounts are FDIC-insured up to $250,000 per depositor, per insured bank, for each account ownership category.
            </p>
            <div style={styles.additionalInfo}>
              <p style={styles.legalText}>
                <strong>Banking Information:</strong> Routing Number: 987654321 | Swift Code: OAKLUS33 | 
                NMLS ID: 123456 | Equal Housing Lender | Member FDIC
              </p>
              <p style={styles.legalText}>
                <strong>Investment Disclaimer:</strong> Investment products are not FDIC insured, may lose value, and are not bank guaranteed. 
                Cryptocurrency trading involves substantial risk of loss and may not be suitable for all investors.
              </p>
              <p style={styles.legalText}>
                <strong>Regulatory Information:</strong> Securities and investment advisory services offered through Oakline Securities, LLC, 
                member FINRA/SIPC. Insurance products offered through Oakline Insurance Agency.
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
  preFooter: {
    backgroundColor: '#2d3748',
    padding: '60px 0',
  },
  container: {
    maxWidth: '1400px',
    margin: '0 auto',
    padding: '0 20px',
  },
  quickActions: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '30px',
  },
  quickActionCard: {
    backgroundColor: '#ffffff',
    padding: '30px',
    borderRadius: '15px',
    textAlign: 'center',
    color: '#1e293b',
    boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
  },
  quickActionIcon: {
    fontSize: '3rem',
    marginBottom: '15px',
  },
  quickActionTitle: {
    fontSize: '1.3rem',
    fontWeight: 'bold',
    marginBottom: '10px',
    color: '#1e3a8a',
  },
  quickActionDesc: {
    fontSize: '0.95rem',
    color: '#64748b',
    marginBottom: '20px',
    lineHeight: '1.5',
  },
  quickActionBtn: {
    backgroundColor: '#059669',
    color: '#ffffff',
    textDecoration: 'none',
    padding: '10px 20px',
    borderRadius: '8px',
    fontWeight: '600',
    fontSize: '0.9rem',
    display: 'inline-block',
    transition: 'all 0.2s',
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
    marginBottom: '25px',
  },
  socialLink: {
    textDecoration: 'none',
    transition: 'transform 0.2s',
    display: 'inline-block',
  },
  socialIcon: {
    fontSize: '24px',
    display: 'block',
  },
  awards: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  award: {
    fontSize: '12px',
    color: '#94a3b8',
    fontWeight: '500',
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
    marginBottom: '25px',
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
  legalLinks: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  newsletter: {
    backgroundColor: '#0f172a',
    padding: '50px 0',
  },
  newsletterContent: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '40px',
    alignItems: 'center',
  },
  newsletterText: {},
  newsletterTitle: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: '10px',
  },
  newsletterDesc: {
    fontSize: '16px',
    color: '#94a3b8',
    lineHeight: '1.5',
  },
  newsletterForm: {
    display: 'flex',
    gap: '15px',
  },
  newsletterInput: {
    flex: 1,
    padding: '15px',
    borderRadius: '8px',
    border: '1px solid #334155',
    backgroundColor: '#1e293b',
    color: '#ffffff',
    fontSize: '16px',
  },
  newsletterBtn: {
    backgroundColor: '#059669',
    color: '#ffffff',
    border: 'none',
    padding: '15px 30px',
    borderRadius: '8px',
    fontWeight: '600',
    fontSize: '16px',
    cursor: 'pointer',
    transition: 'all 0.2s',
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

// Add media queries for mobile responsiveness
if (typeof window !== 'undefined') {
  const mediaQuery = window.matchMedia('(max-width: 768px)');
  
  if (mediaQuery.matches) {
    styles.quickActions.gridTemplateColumns = '1fr';
    styles.footerGrid.gridTemplateColumns = 'repeat(auto-fit, minmax(200px, 1fr))';
    styles.bottomContent.flexDirection = 'column';
    styles.newsletterForm.flexDirection = 'column';
    styles.certifications.justifyContent = 'center';
  }
}
