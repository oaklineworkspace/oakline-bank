// pages/index.js
import Header from '../components/Header';
import Hero from '../components/Hero';
import CTAButtons from '../components/CTAButtons';

export default function Home() {
  return (
    <div>
      <Header />
      <Hero />
      <CTAButtons />
    </div>
  );
}
