import MainMenu from '../components/MainMenu';
import WelcomeBanner from '../components/WelcomeBanner';
import HeroSection from '../components/HeroSection';
import ServicesSection from '../components/ServicesSection';
import FeaturesSection from '../components/FeaturesSection';
import LoanApprovalSection from '../components/LoanApprovalSection';
import TestimonialsSection from '../components/TestimonialsSection';
import CTA from '../components/CTA';
import Footer from '../components/Footer';
import Link from 'next/link';

export default function Home() {
  // Check if user is logged in (replace with actual auth logic)
  const user = null;

  return (
    <div className="page-container">
      <MainMenu user={user} />
      <WelcomeBanner />

      <main>
        <HeroSection />
        <ServicesSection />
        <FeaturesSection />
        <LoanApprovalSection />
        <TestimonialsSection />

        {/* Online Banking Enrollment Section */}
        <section style={styles.enrollmentSection}>
          <div style={styles.container}>
            <div style={styles.enrollmentContent}>
              <h2 style={styles.enrollmentTitle}>Already Have an Account?</h2>
              <p style={styles.enrollmentSubtitle}>
                Enroll for online banking access to manage your accounts, transfer funds, pay bills, and more.
              </p>
              <div style={styles.enrollmentButtons}>
                <Link href="/enroll" style={styles.enrollButton}>
                  <span style={styles.enrollButtonIcon}>🔐</span>
                  Enroll for Online Access
                </Link>
                <Link href="/login" style={styles.loginButton}>
                  Already Enrolled? Sign In
                </Link>
              </div>
              <div style={styles.enrollmentFeatures}>
                <div style={styles.feature}>
                  <span style={styles.featureIcon}>📱</span>
                  <span>Mobile Banking</span>
                </div>
                <div style={styles.feature}>
                  <span style={styles.featureIcon}>💳</span>
                  <span>Bill Pay</span>
                </div>
                <div style={styles.feature}>
                  <span style={styles.featureIcon}>📊</span>
                  <span>Account Management</span>
                </div>
                <div style={styles.feature}>
                  <span style={styles.featureIcon}>🔒</span>
                  <span>Secure Transfers</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* New Account Opening CTA */}
        <CTA
          title="New to Oakline Bank?"
          subtitle="Join over 500,000 customers who trust Oakline Bank for their financial needs. Open your account today and experience the difference."
          buttonText="Open New Account"
          buttonLink="/apply"
          variant="primary"
        />

        {/* Existing Customer CTA */}
        <CTA
          title="Ready to Start Your Financial Journey?"
          subtitle="Whether you're opening a new account or need banking services, we're here to help you achieve your financial goals."
          buttonText="Explore Our Services"
          buttonLink="/apply"
          variant="secondary"
        />
      </main>

      <Footer />
    </div>
  );
}

const styles = {
  enrollmentSection: {
    padding: '4rem 0',
    background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
    borderTop: '1px solid #e2e8f0',
    borderBottom: '1px solid #e2e8f0'
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 2rem'
  },
  enrollmentContent: {
    textAlign: 'center',
    maxWidth: '800px',
    margin: '0 auto'
  },
  enrollmentTitle: {
    fontSize: 'clamp(28px, 4vw, 36px)',
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: '1rem',
    lineHeight: '1.2'
  },
  enrollmentSubtitle: {
    fontSize: '18px',
    color: '#64748b',
    marginBottom: '2.5rem',
    lineHeight: '1.6'
  },
  enrollmentButtons: {
    display: 'flex',
    gap: '1rem',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: '3rem',
    flexWrap: 'wrap'
  },
  enrollButton: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    padding: '16px 32px',
    background: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)',
    color: 'white',
    textDecoration: 'none',
    borderRadius: '12px',
    fontSize: '16px',
    fontWeight: '600',
    boxShadow: '0 4px 14px rgba(30, 64, 175, 0.3)',
    transition: 'all 0.3s ease',
    minHeight: '52px'
  },
  enrollButtonIcon: {
    fontSize: '18px'
  },
  loginButton: {
    display: 'inline-flex',
    alignItems: 'center',
    padding: '16px 32px',
    background: 'transparent',
    color: '#1e40af',
    textDecoration: 'none',
    borderRadius: '12px',
    fontSize: '16px',
    fontWeight: '600',
    border: '2px solid #1e40af',
    transition: 'all 0.3s ease',
    minHeight: '52px'
  },
  enrollmentFeatures: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '1.5rem',
    marginTop: '2rem'
  },
  feature: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    padding: '1rem',
    background: 'white',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    fontSize: '14px',
    fontWeight: '500',
    color: '#374151'
  },
  featureIcon: {
    fontSize: '18px'
  }
};
