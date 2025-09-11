
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '../lib/supabaseClient';

export default function About() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    } catch (error) {
      console.error('Error checking user:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <header style={styles.header}>
        <div style={styles.headerContent}>
          <Link href="/" style={styles.logoContainer}>
            <img src="/images/logo-primary.png.jpg" alt="Oakline Bank" style={styles.logo} />
            <div style={styles.brandInfo}>
              <span style={styles.bankName}>Oakline Bank</span>
              <span style={styles.tagline}>Your Financial Partner</span>
            </div>
          </Link>
          
          <div style={styles.headerActions}>
            <Link href="/" style={styles.headerButton}>Home</Link>
            {user ? (
              <Link href="/dashboard" style={styles.headerButton}>Dashboard</Link>
            ) : (
              <Link href="/login" style={styles.headerButton}>Sign In</Link>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section style={styles.heroSection}>
        <div style={styles.heroContent}>
          <h1 style={styles.heroTitle}>About Oakline Bank</h1>
          <p style={styles.heroSubtitle}>
            Building financial futures with trust, innovation, and personalized service since 1995
          </p>
        </div>
      </section>

      {/* Main Content */}
      <main style={styles.main}>
        {/* Our Story */}
        <section style={styles.section}>
          <div style={styles.sectionContent}>
            <h2 style={styles.sectionTitle}>Our Story</h2>
            <div style={styles.storyGrid}>
              <div style={styles.storyText}>
                <p style={styles.paragraph}>
                  Founded in 1995, Oakline Bank has grown from a small community bank to a leading financial institution 
                  serving over 500,000 customers nationwide. Our commitment to excellence, innovation, and customer-first 
                  approach has made us a trusted partner in achieving financial goals.
                </p>
                <p style={styles.paragraph}>
                  We believe banking should be simple, secure, and accessible. That's why we've invested heavily in 
                  digital innovation while maintaining the personal touch that has defined our service for nearly three decades.
                </p>
              </div>
              <div style={styles.storyImage}>
                <img src="/images/Modern_bank_lobby_interior_d535acc7.png" alt="Modern Bank Lobby" style={styles.image} />
              </div>
            </div>
          </div>
        </section>

        {/* Mission & Values */}
        <section style={styles.section}>
          <div style={styles.sectionContent}>
            <h2 style={styles.sectionTitle}>Our Mission & Values</h2>
            <div style={styles.valuesGrid}>
              <div style={styles.valueCard}>
                <div style={styles.valueIcon}>🎯</div>
                <h3 style={styles.valueTitle}>Mission</h3>
                <p style={styles.valueText}>
                  To empower individuals and businesses to achieve their financial dreams through innovative 
                  banking solutions and exceptional service.
                </p>
              </div>
              
              <div style={styles.valueCard}>
                <div style={styles.valueIcon}>🛡️</div>
                <h3 style={styles.valueTitle}>Trust</h3>
                <p style={styles.valueText}>
                  We safeguard your financial future with the highest standards of security and transparency.
                </p>
              </div>
              
              <div style={styles.valueCard}>
                <div style={styles.valueIcon}>🚀</div>
                <h3 style={styles.valueTitle}>Innovation</h3>
                <p style={styles.valueText}>
                  We continuously evolve our technology and services to meet the changing needs of our customers.
                </p>
              </div>
              
              <div style={styles.valueCard}>
                <div style={styles.valueIcon}>🤝</div>
                <h3 style={styles.valueTitle}>Partnership</h3>
                <p style={styles.valueText}>
                  We build lasting relationships by understanding and supporting your unique financial journey.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Leadership Team */}
        <section style={styles.section}>
          <div style={styles.sectionContent}>
            <h2 style={styles.sectionTitle}>Leadership Team</h2>
            <div style={styles.teamGrid}>
              <div style={styles.teamCard}>
                <div style={styles.teamPhoto}>👨‍💼</div>
                <h3 style={styles.teamName}>Michael Johnson</h3>
                <p style={styles.teamTitle}>Chief Executive Officer</p>
                <p style={styles.teamBio}>
                  With over 25 years in banking, Michael leads Oakline Bank's strategic vision and growth initiatives.
                </p>
              </div>
              
              <div style={styles.teamCard}>
                <div style={styles.teamPhoto}>👩‍💼</div>
                <h3 style={styles.teamName}>Sarah Chen</h3>
                <p style={styles.teamTitle}>Chief Technology Officer</p>
                <p style={styles.teamBio}>
                  Sarah drives our digital transformation and ensures cutting-edge security for all banking operations.
                </p>
              </div>
              
              <div style={styles.teamCard}>
                <div style={styles.teamPhoto}>👨‍💼</div>
                <h3 style={styles.teamName}>David Rodriguez</h3>
                <p style={styles.teamTitle}>Chief Financial Officer</p>
                <p style={styles.teamBio}>
                  David oversees financial strategy and ensures regulatory compliance across all banking activities.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Awards & Recognition */}
        <section style={styles.section}>
          <div style={styles.sectionContent}>
            <h2 style={styles.sectionTitle}>Awards & Recognition</h2>
            <div style={styles.awardsGrid}>
              <div style={styles.awardCard}>
                <div style={styles.awardIcon}>🏆</div>
                <h3 style={styles.awardTitle}>Best Digital Bank 2024</h3>
                <p style={styles.awardOrg}>Banking Excellence Awards</p>
              </div>
              
              <div style={styles.awardCard}>
                <div style={styles.awardIcon}>⭐</div>
                <h3 style={styles.awardTitle}>Customer Choice Award</h3>
                <p style={styles.awardOrg}>Financial Services Review</p>
              </div>
              
              <div style={styles.awardCard}>
                <div style={styles.awardIcon}>🛡️</div>
                <h3 style={styles.awardTitle}>Top Security Rating</h3>
                <p style={styles.awardOrg}>Cybersecurity Institute</p>
              </div>
              
              <div style={styles.awardCard}>
                <div style={styles.awardIcon}>🌟</div>
                <h3 style={styles.awardTitle}>Innovation Leader</h3>
                <p style={styles.awardOrg}>FinTech Association</p>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Info */}
        <section style={styles.section}>
          <div style={styles.sectionContent}>
            <h2 style={styles.sectionTitle}>Get in Touch</h2>
            <div style={styles.contactGrid}>
              <div style={styles.contactCard}>
                <div style={styles.contactIcon}>🏢</div>
                <h3 style={styles.contactTitle}>Headquarters</h3>
                <p style={styles.contactInfo}>
                  123 Financial District<br />
                  New York, NY 10005<br />
                  United States
                </p>
              </div>
              
              <div style={styles.contactCard}>
                <div style={styles.contactIcon}>📞</div>
                <h3 style={styles.contactTitle}>Customer Service</h3>
                <p style={styles.contactInfo}>
                  Phone: 1-800-OAKLINE<br />
                  Available 24/7<br />
                  support@theoaklinebank.com
                </p>
              </div>
              
              <div style={styles.contactCard}>
                <div style={styles.contactIcon}>🏦</div>
                <h3 style={styles.contactTitle}>Banking Details</h3>
                <p style={styles.contactInfo}>
                  Routing Number: 075915826<br />
                  FDIC Insured<br />
                  Member FDIC
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer style={styles.footer}>
        <div style={styles.footerContent}>
          <p style={styles.footerText}>
            © 2024 Oakline Bank. All rights reserved. Member FDIC. Equal Housing Lender.
          </p>
        </div>
      </footer>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#f8fafc',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
  },
  header: {
    backgroundColor: '#1e40af',
    color: 'white',
    padding: '1rem 1.5rem',
    boxShadow: '0 4px 12px rgba(30, 64, 175, 0.2)'
  },
  headerContent: {
    maxWidth: '1400px',
    margin: '0 auto',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap'
  },
  logoContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    textDecoration: 'none',
    color: 'white'
  },
  logo: {
    height: '50px',
    width: 'auto'
  },
  brandInfo: {
    display: 'flex',
    flexDirection: 'column'
  },
  bankName: {
    fontSize: '1.5rem',
    fontWeight: 'bold'
  },
  tagline: {
    fontSize: '0.9rem',
    color: '#bfdbfe'
  },
  headerActions: {
    display: 'flex',
    gap: '1rem'
  },
  headerButton: {
    padding: '0.5rem 1rem',
    backgroundColor: 'rgba(255,255,255,0.15)',
    color: 'white',
    textDecoration: 'none',
    borderRadius: '6px',
    fontSize: '0.9rem',
    fontWeight: '500',
    transition: 'all 0.3s ease'
  },
  heroSection: {
    background: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)',
    color: 'white',
    padding: '4rem 1.5rem',
    textAlign: 'center'
  },
  heroContent: {
    maxWidth: '800px',
    margin: '0 auto'
  },
  heroTitle: {
    fontSize: '3rem',
    fontWeight: 'bold',
    marginBottom: '1rem'
  },
  heroSubtitle: {
    fontSize: '1.2rem',
    opacity: 0.9,
    lineHeight: '1.6'
  },
  main: {
    maxWidth: '1400px',
    margin: '0 auto',
    padding: '0 1.5rem'
  },
  section: {
    padding: '4rem 0',
    borderBottom: '1px solid #e2e8f0'
  },
  sectionContent: {
    maxWidth: '1200px',
    margin: '0 auto'
  },
  sectionTitle: {
    fontSize: '2.5rem',
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: '3rem',
    textAlign: 'center'
  },
  storyGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
    gap: '3rem',
    alignItems: 'center'
  },
  storyText: {
    fontSize: '1.1rem',
    lineHeight: '1.8'
  },
  paragraph: {
    marginBottom: '1.5rem',
    color: '#4b5563'
  },
  storyImage: {
    textAlign: 'center'
  },
  image: {
    width: '100%',
    maxWidth: '500px',
    borderRadius: '12px',
    boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
  },
  valuesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '2rem'
  },
  valueCard: {
    backgroundColor: 'white',
    padding: '2rem',
    borderRadius: '12px',
    textAlign: 'center',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    border: '1px solid #e2e8f0'
  },
  valueIcon: {
    fontSize: '3rem',
    marginBottom: '1rem'
  },
  valueTitle: {
    fontSize: '1.3rem',
    fontWeight: 'bold',
    color: '#1e40af',
    marginBottom: '1rem'
  },
  valueText: {
    color: '#64748b',
    lineHeight: '1.6'
  },
  teamGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '2rem'
  },
  teamCard: {
    backgroundColor: 'white',
    padding: '2rem',
    borderRadius: '12px',
    textAlign: 'center',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    border: '1px solid #e2e8f0'
  },
  teamPhoto: {
    fontSize: '4rem',
    marginBottom: '1rem'
  },
  teamName: {
    fontSize: '1.3rem',
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: '0.5rem'
  },
  teamTitle: {
    color: '#1e40af',
    fontWeight: '600',
    marginBottom: '1rem'
  },
  teamBio: {
    color: '#64748b',
    lineHeight: '1.6'
  },
  awardsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '1.5rem'
  },
  awardCard: {
    backgroundColor: 'white',
    padding: '1.5rem',
    borderRadius: '12px',
    textAlign: 'center',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    border: '1px solid #e2e8f0'
  },
  awardIcon: {
    fontSize: '2.5rem',
    marginBottom: '1rem'
  },
  awardTitle: {
    fontSize: '1.1rem',
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: '0.5rem'
  },
  awardOrg: {
    color: '#64748b',
    fontSize: '0.9rem'
  },
  contactGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '2rem'
  },
  contactCard: {
    backgroundColor: 'white',
    padding: '2rem',
    borderRadius: '12px',
    textAlign: 'center',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    border: '1px solid #e2e8f0'
  },
  contactIcon: {
    fontSize: '2.5rem',
    marginBottom: '1rem'
  },
  contactTitle: {
    fontSize: '1.2rem',
    fontWeight: 'bold',
    color: '#1e40af',
    marginBottom: '1rem'
  },
  contactInfo: {
    color: '#64748b',
    lineHeight: '1.6'
  },
  footer: {
    backgroundColor: '#1f2937',
    color: 'white',
    padding: '2rem 1.5rem',
    textAlign: 'center'
  },
  footerContent: {
    maxWidth: '1400px',
    margin: '0 auto'
  },
  footerText: {
    color: '#d1d5db',
    fontSize: '0.9rem'
  }
};
