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
      <Hero
        images={[
          '/images/hero-mobile.jpg',
          '/images/hero-debit-card-1.jpg.PNG',
          '/images/hero-mobile-transactions.jpg',
        ]}
        title="Welcome to Oakline Bank"
        subtitle="Secure, convenient, and innovative banking solutions for everyone."
      />

      {/* CTA Section */}
      <CTA
        title="Open Your Account Today"
        buttonText="Apply Now"
        buttonLink="/application"
      />
      <CTA
        title="Enroll in Online Banking"
        buttonText="Enroll Now"
        buttonLink="/enroll"
      />

      {/* Testimonials Section */}
      <Testimonials
        testimonials={[
          {
            name: "John D.",
            image: "/images/testimonial-1.jpg.JPG",
            feedback: "Oakline Bank makes banking so easy and reliable!"
          },
          {
            name: "Samantha R.",
            image: "/images/testimonial-2.jpg.JPG",
            feedback: "The customer service is exceptional, highly recommended."
          },
          {
            name: "Michael P.",
            image: "/images/testimonial-3.jpg.JPG",
            feedback: "I love the mobile app and all the convenient features."
          }
        ]}
      />

      <Footer />
    </div>
  );
}
