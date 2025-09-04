import Header from '../components/Header';
import CTA from '../components/CTA';
import Hero from '../components/Hero';
import Testimonials from '../components/Testimonials';
import Footer from '../components/Footer';

export default function Home() {
  return (
    <div>
      <Header />

      {/* Hero Section */}
      <Hero />

      {/* Main CTA Section */}
      <CTA
        title="Ready to Get Started?"
        subtitle="Join thousands of satisfied customers and experience modern banking designed for your success. Open your account in minutes, not days."
        buttonText="Apply for Account"
        buttonLink="/apply"
        variant="primary"
      />

      {/* Testimonials Section */}
      <Testimonials />

      {/* Secondary CTA Section */}
      <CTA
        title="Existing Customer?"
        subtitle="Access your accounts, transfer money, pay bills, and manage your finances with our secure online banking platform."
        buttonText="Sign In to Dashboard"
        buttonLink="/login"
        variant="secondary"
      />

      <Footer />
    </div>
  );
}
