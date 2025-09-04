import MainMenu from '../components/MainMenu';
import WelcomeBanner from '../components/WelcomeBanner';
import HeroSection from '../components/HeroSection';
import LoanApprovalSection from '../components/LoanApprovalSection';
import Testimonials from '../components/Testimonials';
import CTA from '../components/CTA';
import Footer from '../components/Footer';

export default function Home() {
  // Check if user is logged in (you can replace this with actual auth logic)
  const user = null; // Set to user object when logged in

  return (
    <div className="page-container">
      <MainMenu user={user} />
      <WelcomeBanner />
      
      <main>
        <HeroSection />
        <LoanApprovalSection />
        
        {/* Features Section */}
        <section className="section-padding" style={styles.featuresSection}>
          <div className="content-container text-center">
            <h2 style={styles.sectionTitle}>Why Choose Oakline Bank?</h2>
            <p style={styles.sectionSubtitle}>
              Experience modern banking with industry-leading features and security
            </p>
            <div className="grid grid-4 gap-8" style={styles.featuresGrid}>
              <div className="card fade-in">
                <div style={styles.featureIcon}>🔒</div>
                <h3 style={styles.featureTitle}>Bank-Level Security</h3>
                <p style={styles.featureDesc}>256-bit encryption and multi-factor authentication</p>
              </div>
              <div className="card fade-in delay-1">
                <div style={styles.featureIcon}>📱</div>
                <h3 style={styles.featureTitle}>Mobile First</h3>
                <p style={styles.featureDesc}>Award-winning mobile app for iOS and Android</p>
              </div>
              <div className="card fade-in delay-2">
                <div style={styles.featureIcon}>💰</div>
                <h3 style={styles.featureTitle}>No Hidden Fees</h3>
                <p style={styles.featureDesc}>Transparent pricing with no monthly maintenance fees</p>
              </div>
              <div className="card fade-in delay-3">
                <div style={styles.featureIcon}>⚡</div>
                <h3 style={styles.featureTitle}>Instant Transfers</h3>
                <p style={styles.featureDesc}>Send money instantly to friends and family</p>
              </div>
            </div>
          </div>
        </section>

        <Testimonials />
        
        {/* Final CTA */}
        <CTA
          title="Ready to Start Your Financial Journey?"
          subtitle="Join over 500,000 customers who trust Oakline Bank for their financial needs. Open your account today and experience the difference."
          buttonText="Open Account Now"
          buttonLink="/apply"
          variant="primary"
        />
      </main>
      
      <Footer />
    </div>
  );
}

const styles = {
  featuresSection: {
    background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
  },
  sectionTitle: {
    fontSize: 'clamp(28px, 4vw, 42px)',
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: '16px',
  },
  sectionSubtitle: {
    fontSize: '18px',
    color: '#64748b',
    marginBottom: '60px',
    maxWidth: '600px',
    margin: '0 auto 60px auto',
  },
  featuresGrid: {
    marginTop: '60px',
  },
  featureIcon: {
    fontSize: '48px',
    marginBottom: '20px',
  },
  featureTitle: {
    fontSize: '20px',
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: '12px',
  },
  featureDesc: {
    fontSize: '16px',
    color: '#64748b',
    lineHeight: '1.6',
  },
};
