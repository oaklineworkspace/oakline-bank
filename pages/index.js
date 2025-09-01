import Head from "next/head";
import Image from "next/image";

import Header from "../components/Header";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import ProductHero from "../components/ProductHero";
import Features from "../components/Features";
import Certificates from "../components/Certificates";
import Promo from "../components/Promo";
import Testimonials from "../components/Testimonials";
import Footer from "../components/Footer";
import ChatButton from "../components/ChatButton";

export default function Home() {
  return (
    <div className="app-container">
      <Head>
        <title>Oakline Bank - Modern Banking Solutions</title>
        <meta name="description" content="Oakline Bank offers modern banking, investment, and financial services for individuals and businesses." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/logo-primary.png.jpg" />
      </Head>

      {/* Header and Navbar */}
      <Header />
      <Navbar />

      {/* Hero Section */}
      <Hero>
        <Image 
          src="/hero-mobile.jpg" 
          alt="Mobile Banking" 
          width={600} 
          height={400} 
          priority
        />
      </Hero>

      {/* Product / Feature Highlights */}
      <ProductHero>
        <Image 
          src="/hero-debit-card-1.jpg.PNG" 
          alt="Debit Card" 
          width={600} 
          height={400} 
        />
        <Image 
          src="/hero-debit-card-2.jpg.PNG" 
          alt="Debit Card 2" 
          width={600} 
          height={400} 
        />
      </ProductHero>

      <Features />

      {/* Certificates / Achievements */}
      <Certificates />

      {/* Promo or CTA */}
      <Promo />

      {/* Testimonials */}
      <Testimonials>
        <Image src="/testimonial-1.jpg.JPG" alt="Customer 1" width={150} height={150} />
        <Image src="/testimonial-2.jpg.JPG" alt="Customer 2" width={150} height={150} />
        <Image src="/testimonial-3.jpg.JPG" alt="Customer 3" width={150} height={150} />
      </Testimonials>

      {/* Footer */}
      <Footer />

      {/* Floating Chat Button */}
      <ChatButton />
    </div>
  );
}
