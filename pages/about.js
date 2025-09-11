
import { useState } from 'react';
import Link from 'next/link';
import MainMenu from '../components/MainMenu';
import Footer from '../components/Footer';

export default function About() {
  const [user, setUser] = useState(null);

  const styles = {
    container: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    },
    content: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '2rem 1rem'
    },
    header: {
      textAlign: 'center',
      marginBottom: '3rem'
    },
    title: {
      fontSize: 'clamp(2.5rem, 5vw, 4rem)',
      fontWeight: '900',
      color: '#1e293b',
      marginBottom: '1rem',
      background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text'
    },
    subtitle: {
      fontSize: '1.2rem',
      color: '#64748b',
      maxWidth: '600px',
      margin: '0 auto'
    },
    section: {
      backgroundColor: 'white',
      borderRadius: '16px',
      padding: '2.5rem',
      marginBottom: '2rem',
      boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
      border: '1px solid #e2e8f0'
    },
    sectionTitle: {
      fontSize: '1.8rem',
      fontWeight: '700',
      color: '#1e293b',
      marginBottom: '1.5rem'
    },
    text: {
      fontSize: '1rem',
      color: '#374151',
      lineHeight: '1.7',
      marginBottom: '1rem'
    },
    statsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '2rem',
      marginTop: '2rem'
    },
    statCard: {
      textAlign: 'center',
      padding: '1.5rem',
      backgroundColor: '#f8fafc',
      borderRadius: '12px',
      border: '2px solid #e2e8f0'
    },
    statNumber: {
      fontSize: '2.5rem',
      fontWeight: '900',
      color: '#3b82f6',
      marginBottom: '0.5rem'
    },
    statLabel: {
      fontSize: '0.9rem',
      color: '#64748b',
      fontWeight: '600'
    },
    teamGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
      gap: '2rem',
      marginTop: '2rem'
    },
    teamCard: {
      textAlign: 'center',
      padding: '2rem',
      backgroundColor: '#f8fafc',
      borderRadius: '16px',
      border: '2px solid #e2e8f0'
    },
    teamPhoto: {
      width: '100px',
      height: '100px',
      borderRadius: '50%',
      backgroundColor: '#3b82f6',
      margin: '0 auto 1rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '2rem',
      color: 'white'
    },
    teamName: {
      fontSize: '1.2rem',
      fontWeight: '700',
      color: '#1e293b',
      marginBottom: '0.5rem'
    },
    teamRole: {
      fontSize: '0.9rem',
      color: '#3b82f6',
      fontWeight: '600',
      marginBottom: '1rem'
    },
    teamBio: {
      fontSize: '0.85rem',
      color: '#64748b',
      lineHeight: '1.5'
    }
  };

  return (
    <div style={styles.container}>
      <MainMenu user={user} />
      
      <div style={styles.content}>
        <div style={styles.header}>
          <h1 style={styles.title}>About Oakline Bank</h1>
          <p style={styles.subtitle}>
            Building financial partnerships since 1985. Your trusted community bank 
            with modern digital solutions.
          </p>
        </div>

        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Our Story</h2>
          <p style={styles.text}>
            Founded in 1985 with a simple mission: to provide personalized banking services 
            that help individuals and businesses achieve their financial goals. Over nearly 
            four decades, we've grown from a single branch to a full-service financial 
            institution serving over 500,000 customers nationwide.
          </p>
          <p style={styles.text}>
            We believe banking should be simple, transparent, and accessible. That's why 
            we've invested heavily in technology while maintaining the personal touch that 
            sets us apart from larger institutions.
          </p>

          <div style={styles.statsGrid}>
            <div style={styles.statCard}>
              <div style={styles.statNumber}>500K+</div>
              <div style={styles.statLabel}>Happy Customers</div>
            </div>
            <div style={styles.statCard}>
              <div style={styles.statNumber}>38</div>
              <div style={styles.statLabel}>Years of Service</div>
            </div>
            <div style={styles.statCard}>
              <div style={styles.statNumber}>$2.5B+</div>
              <div style={styles.statLabel}>Assets Under Management</div>
            </div>
            <div style={styles.statCard}>
              <div style={styles.statNumber}>150+</div>
              <div style={styles.statLabel}>Branch Locations</div>
            </div>
          </div>
        </div>

        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Our Mission</h2>
          <p style={styles.text}>
            To empower our customers' financial success through innovative banking solutions, 
            exceptional service, and unwavering commitment to their financial well-being. 
            We strive to be more than just a bank – we're your financial partner for life.
          </p>
        </div>

        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Our Values</h2>
          <p style={styles.text}>
            <strong>Trust:</strong> Building lasting relationships through transparency and reliability.
          </p>
          <p style={styles.text}>
            <strong>Innovation:</strong> Embracing technology to enhance your banking experience.
          </p>
          <p style={styles.text}>
            <strong>Community:</strong> Supporting the communities we serve through local investment and involvement.
          </p>
          <p style={styles.text}>
            <strong>Excellence:</strong> Delivering superior service and financial solutions every day.
          </p>
        </div>

        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Leadership Team</h2>
          <div style={styles.teamGrid}>
            <div style={styles.teamCard}>
              <div style={styles.teamPhoto}>👨‍💼</div>
              <h3 style={styles.teamName}>Michael Johnson</h3>
              <p style={styles.teamRole}>Chief Executive Officer</p>
              <p style={styles.teamBio}>
                With over 25 years in banking, Michael leads our strategic vision 
                and commitment to customer excellence.
              </p>
            </div>
            <div style={styles.teamCard}>
              <div style={styles.teamPhoto}>👩‍💼</div>
              <h3 style={styles.teamName}>Sarah Chen</h3>
              <p style={styles.teamRole}>Chief Financial Officer</p>
              <p style={styles.teamBio}>
                Sarah oversees our financial operations and ensures regulatory 
                compliance across all business units.
              </p>
            </div>
            <div style={styles.teamCard}>
              <div style={styles.teamPhoto}>👨‍💻</div>
              <h3 style={styles.teamName}>David Rodriguez</h3>
              <p style={styles.teamRole}>Chief Technology Officer</p>
              <p style={styles.teamBio}>
                David drives our digital transformation and innovative technology 
                solutions for modern banking needs.
              </p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
