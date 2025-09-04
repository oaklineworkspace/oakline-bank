import MainMenu from '../components/MainMenu';
import WelcomeBanner from '../components/WelcomeBanner';
import HeroSection from '../components/HeroSection';
import ServicesSection from '../components/ServicesSection';
import FeaturesSection from '../components/FeaturesSection';
import LoanApprovalSection from '../components/LoanApprovalSection';
import TestimonialsSection from '../components/TestimonialsSection';
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
        <ServicesSection />
        <FeaturesSection />
        <LoanApprovalSection />
        <TestimonialsSection />
        
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
  // Modern homepage with enhanced long-scrolling experience
};
