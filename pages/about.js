import { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function About() {
  const [activeSection, setActiveSection] = useState('mission');
  const [teamMembers, setTeamMembers] = useState([]); // Default empty array for teamMembers
  const [achievements, setAchievements] = useState([]); // Assuming achievements might also be fetched
  const [locations, setLocations] = useState([]); // Assuming locations might also be fetched

  // In a real application, you would fetch this data:
  // useEffect(() => {
  //   fetch('/api/team')
  //     .then(res => res.json())
  //     .then(data => setTeamMembers(data));
  //   fetch('/api/achievements')
  //     .then(res => res.json())
  //     .then(data => setAchievements(data));
  //   fetch('/api/locations')
  //     .then(res => res.json())
  //     .then(data => setLocations(data));
  // }, []);

  return (
    <div style={styles.container}>
      <Navbar />

      <div style={styles.hero}>
        <div style={styles.heroContent}>
          <h1 style={styles.heroTitle}>About Oakline Bank</h1>
          <p style={styles.heroSubtitle}>
            Your trusted partner in modern banking since our founding
          </p>
        </div>
      </div>

      <div style={styles.content}>
        <div style={styles.sidebar}>
          <nav style={styles.nav}>
            <button 
              style={activeSection === 'mission' ? {...styles.navButton, ...styles.activeNav} : styles.navButton}
              onClick={() => setActiveSection('mission')}
            >
              Our Mission
            </button>
            <button 
              style={activeSection === 'history' ? {...styles.navButton, ...styles.activeNav} : styles.navButton}
              onClick={() => setActiveSection('history')}
            >
              Our History
            </button>
            <button 
              style={activeSection === 'values' ? {...styles.navButton, ...styles.activeNav} : styles.navButton}
              onClick={() => setActiveSection('values')}
            >
              Our Values
            </button>
            <button 
              style={activeSection === 'team' ? {...styles.navButton, ...styles.activeNav} : styles.navButton}
              onClick={() => setActiveSection('team')}
            >
              Leadership Team
            </button>
          </nav>
        </div>

        <div style={styles.mainContent}>
          {activeSection === 'mission' && (
            <section style={styles.section}>
              <h2 style={styles.sectionTitle}>Our Mission</h2>
              <p style={styles.paragraph}>
                At Oakline Bank, we're committed to providing exceptional banking services that empower individuals and businesses to achieve their financial goals. We believe in combining cutting-edge technology with personalized service to create banking experiences that are both innovative and trustworthy.
              </p>
              <p style={styles.paragraph}>
                Our mission is to democratize access to modern banking services, making financial tools and resources available to everyone, regardless of their background or economic status.
              </p>
            </section>
          )}

          {activeSection === 'history' && (
            <section style={styles.section}>
              <h2 style={styles.sectionTitle}>Our History</h2>
              <p style={styles.paragraph}>
                Founded with the vision of revolutionizing the banking industry, Oakline Bank has grown from a small community-focused institution to a leading digital banking platform. Our journey has been marked by continuous innovation and an unwavering commitment to our customers.
              </p>
              <div style={styles.timeline}>
                <div style={styles.timelineItem}>
                  <h4 style={styles.timelineTitle}>Digital First Approach</h4>
                  <p style={styles.timelineText}>
                    From day one, we embraced digital technology to provide seamless banking experiences.
                  </p>
                </div>
                <div style={styles.timelineItem}>
                  <h4 style={styles.timelineTitle}>Customer-Centric Innovation</h4>
                  <p style={styles.timelineText}>
                    We continuously evolve our services based on customer feedback and emerging needs.
                  </p>
                </div>
                <div style={styles.timelineItem}>
                  <h4 style={styles.timelineTitle}>Security Leadership</h4>
                  <p style={styles.timelineText}>
                    We implement industry-leading security measures to protect our customers' financial data.
                  </p>
                </div>
              </div>
            </section>
          )}

          {activeSection === 'values' && (
            <section style={styles.section}>
              <h2 style={styles.sectionTitle}>Our Values</h2>
              <div style={styles.valuesGrid}>
                <div style={styles.valueCard}>
                  <h4 style={styles.valueTitle}>🛡️ Security First</h4>
                  <p style={styles.valueText}>
                    We prioritize the security and privacy of our customers' financial information above all else.
                  </p>
                </div>
                <div style={styles.valueCard}>
                  <h4 style={styles.valueTitle}>💡 Innovation</h4>
                  <p style={styles.valueText}>
                    We continuously innovate to provide cutting-edge banking solutions that meet evolving needs.
                  </p>
                </div>
                <div style={styles.valueCard}>
                  <h4 style={styles.valueTitle}>🤝 Transparency</h4>
                  <p style={styles.valueText}>
                    We believe in clear, honest communication with no hidden fees or surprises.
                  </p>
                </div>
                <div style={styles.valueCard}>
                  <h4 style={styles.valueTitle}>🌍 Accessibility</h4>
                  <p style={styles.valueText}>
                    Banking services should be accessible to everyone, regardless of location or background.
                  </p>
                </div>
              </div>
            </section>
          )}

          {activeSection === 'team' && (
            <section style={styles.section}>
              <h2 style={styles.sectionTitle}>Leadership Team</h2>
              <div style={styles.teamGrid}>
                {teamMembers && teamMembers.length > 0 && teamMembers.map((member, index) => (
                  <div key={index} style={styles.teamCard}>
                    <div style={styles.avatar}>👨‍💼</div>
                    <h4 style={styles.teamName}>{member.name}</h4>
                    <p style={styles.teamRole}>{member.role}</p>
                    <p style={styles.teamBio}>
                      {member.bio}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#f8f9fa',
  },
  hero: {
    background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
    color: 'white',
    padding: '80px 20px',
    textAlign: 'center',
  },
  heroContent: {
    maxWidth: '800px',
    margin: '0 auto',
  },
  heroTitle: {
    fontSize: '3rem',
    fontWeight: 'bold',
    marginBottom: '20px',
  },
  heroSubtitle: {
    fontSize: '1.2rem',
    opacity: 0.9,
  },
  content: {
    display: 'flex',
    maxWidth: '1200px',
    margin: '40px auto',
    padding: '0 20px',
    gap: '40px',
  },
  sidebar: {
    width: '250px',
    flexShrink: 0,
  },
  nav: {
    position: 'sticky',
    top: '20px',
    background: 'white',
    borderRadius: '12px',
    padding: '20px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  },
  navButton: {
    width: '100%',
    padding: '12px 16px',
    border: 'none',
    background: 'transparent',
    textAlign: 'left',
    cursor: 'pointer',
    borderRadius: '8px',
    marginBottom: '8px',
    fontSize: '14px',
    fontWeight: '500',
    transition: 'all 0.2s ease',
  },
  activeNav: {
    background: '#1e3c72',
    color: 'white',
  },
  mainContent: {
    flex: 1,
    background: 'white',
    borderRadius: '12px',
    padding: '40px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  },
  section: {
    animation: 'fadeIn 0.3s ease-in',
  },
  sectionTitle: {
    fontSize: '2rem',
    fontWeight: 'bold',
    color: '#1e3c72',
    marginBottom: '24px',
  },
  paragraph: {
    fontSize: '16px',
    lineHeight: '1.6',
    color: '#555',
    marginBottom: '16px',
  },
  timeline: {
    marginTop: '30px',
  },
  timelineItem: {
    borderLeft: '3px solid #1e3c72',
    paddingLeft: '20px',
    marginBottom: '30px',
  },
  timelineTitle: {
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#1e3c72',
    marginBottom: '8px',
  },
  timelineText: {
    fontSize: '14px',
    color: '#666',
    lineHeight: '1.5',
  },
  valuesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '20px',
    marginTop: '20px',
  },
  valueCard: {
    padding: '24px',
    border: '1px solid #e0e0e0',
    borderRadius: '12px',
    textAlign: 'center',
  },
  valueTitle: {
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#1e3c72',
    marginBottom: '12px',
  },
  valueText: {
    fontSize: '14px',
    color: '#666',
    lineHeight: '1.5',
  },
  teamGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '30px',
    marginTop: '20px',
  },
  teamCard: {
    textAlign: 'center',
    padding: '24px',
    border: '1px solid #e0e0e0',
    borderRadius: '12px',
  },
  avatar: {
    fontSize: '48px',
    marginBottom: '16px',
  },
  teamName: {
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#1e3c72',
    marginBottom: '8px',
  },
  teamRole: {
    fontSize: '14px',
    color: '#666',
    fontWeight: '500',
    marginBottom: '12px',
  },
  teamBio: {
    fontSize: '14px',
    color: '#666',
    lineHeight: '1.5',
  },
};
