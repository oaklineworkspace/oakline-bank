
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '../lib/supabaseClient';

export default function Home() {
  const [user, setUser] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [dropdownOpen, setDropdownOpen] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();

    const interval = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % 4);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  const heroSlides = [
    {
      image: '/images/hero-mobile.jpg.PNG',
      title: 'Welcome to Oakline Bank',
      subtitle: 'Your trusted financial partner for over 50 years',
      cta: 'Open Account'
    },
    {
      image: '/images/hero-debit-card-1.jpg.PNG',
      title: 'Premium Banking Experience',
      subtitle: 'Advanced digital banking with personalized service',
      cta: 'Learn More'
    },
    {
      image: '/images/hero-pos.jpg.PNG',
      title: 'Secure Digital Payments',
      subtitle: 'Pay anywhere, anytime with complete security',
      cta: 'Get Started'
    },
    {
      image: '/images/hero-development-fund.jpg.PNG',
      title: 'Investment Solutions',
      subtitle: 'Grow your wealth with our expert guidance',
      cta: 'Invest Now'
    }
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Small Business Owner',
      image: '/images/testimonial-1.jpg.JPG',
      text: 'Oakline Bank has been instrumental in growing my business. Their loan processes are transparent and their support is exceptional.'
    },
    {
      name: 'Michael Chen',
      role: 'Software Engineer',
      image: '/images/testimonial-2.jpg.JPG',
      text: 'The mobile banking experience is outstanding. I can manage all my finances seamlessly from anywhere.'
    },
    {
      name: 'Emma Rodriguez',
      role: 'Financial Advisor',
      image: '/images/testimonial-3.jpg.JPG',
      text: 'As a financial professional, I appreciate Oakline\'s commitment to security and innovative banking solutions.'
    }
  ];

  return (
    <div style={styles.container}>
      {/* Header */}
      <header style={styles.header}>
        <div style={styles.headerContent}>
          <div style={styles.logo}>
            <img src="/images/logo-primary.png" alt="Oakline Bank" style={styles.logoImage} />
          </div>

          <nav style={styles.nav}>
            <div style={styles.navItem} 
                 onMouseEnter={() => setDropdownOpen('personal')}
                 onMouseLeave={() => setDropdownOpen('')}>
              <span style={styles.navLink}>Personal Banking</span>
              {dropdownOpen === 'personal' && (
                <div style={styles.dropdown}>
                  <div style={styles.dropdownSection}>
                    <h4 style={styles.dropdownHeading}>Accounts</h4>
                    <Link href="/apply" style={styles.dropdownLink}>Checking Account</Link>
                    <Link href="/apply" style={styles.dropdownLink}>Savings Account</Link>
                    <Link href="/apply" style={styles.dropdownLink}>Money Market</Link>
                    <Link href="/apply" style={styles.dropdownLink}>CDs</Link>
                  </div>
                  <div style={styles.dropdownSection}>
                    <h4 style={styles.dropdownHeading}>Cards</h4>
                    <Link href="/cards" style={styles.dropdownLink}>Debit Cards</Link>
                    <Link href="/cards" style={styles.dropdownLink}>Credit Cards</Link>
                    <Link href="/cards" style={styles.dropdownLink}>Prepaid Cards</Link>
                  </div>
                  <div style={styles.dropdownSection}>
                    <h4 style={styles.dropdownHeading}>Services</h4>
                    <Link href="/transfer" style={styles.dropdownLink}>Online Banking</Link>
                    <Link href="/bill-pay" style={styles.dropdownLink}>Bill Pay</Link>
                    <Link href="/investments" style={styles.dropdownLink}>Investment Services</Link>
                  </div>
                </div>
              )}
            </div>

            <div style={styles.navItem}
                 onMouseEnter={() => setDropdownOpen('business')}
                 onMouseLeave={() => setDropdownOpen('')}>
              <span style={styles.navLink}>Business Banking</span>
              {dropdownOpen === 'business' && (
                <div style={styles.dropdown}>
                  <div style={styles.dropdownSection}>
                    <h4 style={styles.dropdownHeading}>Accounts</h4>
                    <Link href="/apply" style={styles.dropdownLink}>Business Checking</Link>
                    <Link href="/apply" style={styles.dropdownLink}>Business Savings</Link>
                    <Link href="/apply" style={styles.dropdownLink}>Merchant Services</Link>
                  </div>
                  <div style={styles.dropdownSection}>
                    <h4 style={styles.dropdownHeading}>Loans</h4>
                    <Link href="/loans" style={styles.dropdownLink}>Business Loans</Link>
                    <Link href="/loans" style={styles.dropdownLink}>Equipment Financing</Link>
                    <Link href="/loans" style={styles.dropdownLink}>Commercial Real Estate</Link>
                  </div>
                </div>
              )}
            </div>

            <div style={styles.navItem}
                 onMouseEnter={() => setDropdownOpen('loans')}
                 onMouseLeave={() => setDropdownOpen('')}>
              <span style={styles.navLink}>Loans & Mortgages</span>
              {dropdownOpen === 'loans' && (
                <div style={styles.dropdown}>
                  <div style={styles.dropdownSection}>
                    <h4 style={styles.dropdownHeading}>Home Loans</h4>
                    <Link href="/loans" style={styles.dropdownLink}>Mortgage Loans</Link>
                    <Link href="/loans" style={styles.dropdownLink}>Refinancing</Link>
                    <Link href="/loans" style={styles.dropdownLink}>Home Equity</Link>
                  </div>
                  <div style={styles.dropdownSection}>
                    <h4 style={styles.dropdownHeading}>Personal Loans</h4>
                    <Link href="/loans" style={styles.dropdownLink}>Auto Loans</Link>
                    <Link href="/loans" style={styles.dropdownLink}>Personal Loans</Link>
                    <Link href="/loans" style={styles.dropdownLink}>Student Loans</Link>
                  </div>
                </div>
              )}
            </div>

            <Link href="/investments" style={styles.navLink}>Wealth Management</Link>
          </nav>

          <div style={styles.headerActions}>
            {user ? (
              <>
                <Link href="/dashboard" style={styles.dashboardButton}>Dashboard</Link>
                <button onClick={handleLogout} style={styles.logoutButton}>Logout</button>
              </>
            ) : (
              <>
                <Link href="/login" style={styles.loginButton}>Login</Link>
                <Link href="/apply" style={styles.applyButton}>Open Account</Link>
              </>
            )}
          </div>

          <button 
            style={styles.mobileMenuToggle}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            ☰
          </button>
        </div>

        {mobileMenuOpen && (
          <div style={styles.mobileMenu}>
            <Link href="/apply" style={styles.mobileLink}>Personal Banking</Link>
            <Link href="/loans" style={styles.mobileLink}>Business Banking</Link>
            <Link href="/investments" style={styles.mobileLink}>Loans & Mortgages</Link>
            <Link href="/investments" style={styles.mobileLink}>Wealth Management</Link>
            {user ? (
              <>
                <Link href="/dashboard" style={styles.mobileLink}>Dashboard</Link>
                <button onClick={handleLogout} style={styles.mobileLink}>Logout</button>
              </>
            ) : (
              <>
                <Link href="/login" style={styles.mobileLink}>Login</Link>
                <Link href="/apply" style={styles.mobileLink}>Open Account</Link>
              </>
            )}
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section style={styles.hero}>
        <div style={styles.heroSlide}>
          <img 
            src={heroSlides[currentSlide].image} 
            alt="Hero" 
            style={styles.heroImage}
          />
          <div style={styles.heroOverlay}></div>
          <div style={styles.heroContent}>
            <h1 style={styles.heroTitle}>{heroSlides[currentSlide].title}</h1>
            <p style={styles.heroSubtitle}>{heroSlides[currentSlide].subtitle}</p>
            <Link href="/apply" style={styles.heroButton}>{heroSlides[currentSlide].cta}</Link>
          </div>
        </div>
        <div style={styles.slideIndicators}>
          {heroSlides.map((_, index) => (
            <button
              key={index}
              style={{
                ...styles.indicator,
                ...(currentSlide === index ? styles.indicatorActive : {})
              }}
              onClick={() => setCurrentSlide(index)}
            />
          ))}
        </div>
      </section>

      {/* Services Section */}
      <section style={styles.services}>
        <div style={styles.container}>
          <h2 style={styles.sectionTitle}>Banking Services That Work For You</h2>
          <div style={styles.servicesGrid}>
            <div style={styles.serviceCard}>
              <img src="/images/hero2-mobile.jpg.JPG" alt="Mobile Banking" style={styles.serviceImage} />
              <h3 style={styles.serviceTitle}>Mobile Banking</h3>
              <p style={styles.serviceDesc}>Bank anytime, anywhere with our award-winning mobile app. Secure, fast, and intuitive.</p>
              <Link href="/apply" style={styles.serviceButton}>Learn More</Link>
            </div>
            <div style={styles.serviceCard}>
              <img src="/images/hero3-mobile.jpg.PNG" alt="Digital Payments" style={styles.serviceImage} />
              <h3 style={styles.serviceTitle}>Digital Payments</h3>
              <p style={styles.serviceDesc}>Send money instantly, pay bills online, and manage all your payments from one secure platform.</p>
              <Link href="/transfer" style={styles.serviceButton}>Get Started</Link>
            </div>
            <div style={styles.serviceCard}>
              <img src="/images/hero4-mobile.jpg.JPG" alt="Investment Services" style={styles.serviceImage} />
              <h3 style={styles.serviceTitle}>Investment Services</h3>
              <p style={styles.serviceDesc}>Grow your wealth with expert guidance and comprehensive investment solutions.</p>
              <Link href="/investments" style={styles.serviceButton}>Invest Now</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Debit Card Section */}
      <section style={styles.cardSection}>
        <div style={styles.container}>
          <div style={styles.cardContent}>
            <div style={styles.cardInfo}>
              <h2 style={styles.cardTitle}>Premium Oakline Debit Card</h2>
              <p style={styles.cardDesc}>Experience banking freedom with our premium debit card. Zero monthly fees, worldwide acceptance, and advanced security features.</p>
              <ul style={styles.cardFeatures}>
                <li>No monthly maintenance fees</li>
                <li>Free ATM access at 55,000+ locations</li>
                <li>Contactless payments with chip technology</li>
                <li>24/7 fraud monitoring and protection</li>
                <li>Instant purchase notifications</li>
                <li>Emergency card replacement worldwide</li>
              </ul>
              <Link href="/cards" style={styles.cardButton}>Apply for Card</Link>
            </div>
            <div style={styles.cardDisplay}>
              <div style={styles.debitCard}>
                <div style={styles.cardChip}></div>
                <div style={styles.cardLogo}>OAKLINE</div>
                <div style={styles.cardNumber}>4532 1234 5678 9012</div>
                <div style={styles.cardDetails}>
                  <div>
                    <div style={styles.cardLabel}>VALID THRU</div>
                    <div style={styles.cardExpiry}>12/28</div>
                  </div>
                  <div>
                    <div style={styles.cardLabel}>CARDHOLDER</div>
                    <div style={styles.cardName}>JOHN SMITH</div>
                  </div>
                </div>
                <div style={styles.cardNetwork}>VISA</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ATM Locations Section */}
      <section style={styles.atmSection}>
        <div style={styles.container}>
          <h2 style={styles.sectionTitle}>Convenient ATM Access</h2>
          <div style={styles.atmGrid}>
            <div style={styles.atmCard}>
              <img src="/images/Mobile_banking_user_experience_576bb7a3.png" alt="ATM Network" style={styles.atmImage} />
              <h3 style={styles.atmTitle}>55,000+ ATM Locations</h3>
              <p style={styles.atmDesc}>Access your money fee-free at our extensive ATM network across the country.</p>
            </div>
            <div style={styles.atmCard}>
              <img src="/images/Digital_investment_dashboard_36d35f19.png" alt="Mobile ATM Locator" style={styles.atmImage} />
              <h3 style={styles.atmTitle}>Mobile ATM Locator</h3>
              <p style={styles.atmDesc}>Find the nearest ATM instantly with our mobile app's built-in locator feature.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Discussion Hall Section */}
      <section style={styles.discussionSection}>
        <div style={styles.container}>
          <h2 style={styles.sectionTitle}>Expert Financial Guidance</h2>
          <div style={styles.discussionContent}>
            <div style={styles.discussionImages}>
              <img src="/images/Bank_hall_business_discussion_72f98bbe.png" alt="Banking Discussion" style={styles.discussionImage} />
              <img src="/images/Banking_executive_team_meeting_c758f3ec.png" alt="Financial Advisory" style={styles.discussionImage} />
            </div>
            <div style={styles.discussionInfo}>
              <h3 style={styles.discussionTitle}>Personalized Financial Advisory</h3>
              <p style={styles.discussionDesc}>
                Our experienced financial advisors work closely with you to understand your goals and create 
                customized strategies for your financial success. From retirement planning to investment 
                management, we're here to guide you every step of the way.
              </p>
              <div style={styles.discussionFeatures}>
                <div style={styles.feature}>✓ One-on-one consultation sessions</div>
                <div style={styles.feature}>✓ Comprehensive financial planning</div>
                <div style={styles.feature}>✓ Investment portfolio management</div>
                <div style={styles.feature}>✓ Retirement and estate planning</div>
              </div>
              <Link href="/financial-advisory" style={styles.discussionButton}>Schedule Consultation</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section style={styles.testimonialsSection}>
        <div style={styles.container}>
          <h2 style={styles.sectionTitle}>What Our Customers Say</h2>
          <div style={styles.testimonialsGrid}>
            {testimonials.map((testimonial, index) => (
              <div key={index} style={styles.testimonialCard}>
                <div style={styles.testimonialImage}>
                  <img src={testimonial.image} alt={testimonial.name} style={styles.testimonialPhoto} />
                </div>
                <h4 style={styles.testimonialName}>{testimonial.name}</h4>
                <p style={styles.testimonialRole}>{testimonial.role}</p>
                <p style={styles.testimonialText}>"{testimonial.text}"</p>
                <div style={styles.testimonialStars}>
                  {'★★★★★'.split('').map((star, i) => (
                    <span key={i} style={styles.star}>{star}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Loan Approval Section */}
      <section style={styles.loanSection}>
        <div style={styles.container}>
          <div style={styles.loanContent}>
            <div style={styles.loanInfo}>
              <h2 style={styles.loanTitle}>Quick Loan Approvals</h2>
              <p style={styles.loanDesc}>
                Get the funding you need with our streamlined loan process. From personal loans 
                to mortgages, we make borrowing simple and transparent.
              </p>
              <div style={styles.loanFeatures}>
                <div style={styles.loanFeature}>
                  <span style={styles.loanIcon}>🚀</span>
                  <div>
                    <h4>Fast Approval</h4>
                    <p>Get approved in as little as 24 hours</p>
                  </div>
                </div>
                <div style={styles.loanFeature}>
                  <span style={styles.loanIcon}>💰</span>
                  <div>
                    <h4>Competitive Rates</h4>
                    <p>Industry-leading interest rates</p>
                  </div>
                </div>
                <div style={styles.loanFeature}>
                  <span style={styles.loanIcon}>📝</span>
                  <div>
                    <h4>Simple Process</h4>
                    <p>Minimal paperwork, maximum convenience</p>
                  </div>
                </div>
              </div>
              <Link href="/loans" style={styles.loanButton}>Apply for Loan</Link>
            </div>
            <div style={styles.loanImages}>
              <img src="/images/Loan_approval_celebration_banner_919a886f.png" alt="Loan Approval" style={styles.loanImage} />
            </div>
          </div>
        </div>
      </section>

      {/* Security Section */}
      <section style={styles.securitySection}>
        <div style={styles.container}>
          <h2 style={styles.sectionTitle}>Your Security is Our Priority</h2>
          <div style={styles.securityGrid}>
            <div style={styles.securityCard}>
              <div style={styles.securityIcon}>🔐</div>
              <h3>Bank-Grade Encryption</h3>
              <p>All your data is protected with 256-bit SSL encryption, the same technology used by major financial institutions.</p>
            </div>
            <div style={styles.securityCard}>
              <div style={styles.securityIcon}>🛡️</div>
              <h3>Fraud Protection</h3>
              <p>24/7 fraud monitoring with instant alerts and zero liability protection on unauthorized transactions.</p>
            </div>
            <div style={styles.securityCard}>
              <div style={styles.securityIcon}>📱</div>
              <h3>Biometric Authentication</h3>
              <p>Access your account securely with fingerprint and face recognition technology on our mobile app.</p>
            </div>
            <div style={styles.securityCard}>
              <div style={styles.securityIcon}>🏦</div>
              <h3>FDIC Insured</h3>
              <p>Your deposits are insured up to $250,000 per depositor by the Federal Deposit Insurance Corporation.</p>
            </div>
          </div>
        </div>
      </section>

      {/* News & Updates Section */}
      <section style={styles.newsSection}>
        <div style={styles.container}>
          <h2 style={styles.sectionTitle}>Latest News & Updates</h2>
          <div style={styles.newsGrid}>
            <article style={styles.newsCard}>
              <img src="/images/Modern_bank_lobby_interior_d535acc7.png" alt="Bank Interior" style={styles.newsImage} />
              <div style={styles.newsContent}>
                <h3 style={styles.newsTitle}>New Branch Opening in Downtown</h3>
                <p style={styles.newsDesc}>We're excited to announce the opening of our newest branch featuring state-of-the-art facilities and extended hours.</p>
                <span style={styles.newsDate}>December 15, 2024</span>
              </div>
            </article>
            <article style={styles.newsCard}>
              <img src="/images/Digital_investment_dashboard_36d35f19.png" alt="Mobile App Update" style={styles.newsImage} />
              <div style={styles.newsContent}>
                <h3 style={styles.newsTitle}>Mobile App Enhancement</h3>
                <p style={styles.newsDesc}>New features including budget tracking, investment insights, and enhanced security options are now available.</p>
                <span style={styles.newsDate}>December 10, 2024</span>
              </div>
            </article>
            <article style={styles.newsCard}>
              <img src="/images/Mobile_banking_user_experience_576bb7a3.png" alt="Interest Rates" style={styles.newsImage} />
              <div style={styles.newsContent}>
                <h3 style={styles.newsTitle}>Competitive Savings Rates</h3>
                <p style={styles.newsDesc}>We've increased our savings account interest rates to help you grow your money faster than ever before.</p>
                <span style={styles.newsDate}>December 5, 2024</span>
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={styles.ctaSection}>
        <div style={styles.container}>
          <div style={styles.ctaContent}>
            <h2 style={styles.ctaTitle}>Ready to Get Started?</h2>
            <p style={styles.ctaDesc}>Join thousands of satisfied customers who trust Oakline Bank with their financial future.</p>
            <div style={styles.ctaButtons}>
              <Link href="/apply" style={styles.ctaPrimary}>Open Account</Link>
              <Link href="/contact" style={styles.ctaSecondary}>Contact Us</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={styles.footer}>
        <div style={styles.container}>
          <div style={styles.footerContent}>
            <div style={styles.footerSection}>
              <h4 style={styles.footerTitle}>Personal Banking</h4>
              <Link href="/apply" style={styles.footerLink}>Checking Accounts</Link>
              <Link href="/apply" style={styles.footerLink}>Savings Accounts</Link>
              <Link href="/cards" style={styles.footerLink}>Debit & Credit Cards</Link>
              <Link href="/loans" style={styles.footerLink}>Personal Loans</Link>
              <Link href="/investments" style={styles.footerLink}>Investment Services</Link>
            </div>
            <div style={styles.footerSection}>
              <h4 style={styles.footerTitle}>Business Banking</h4>
              <Link href="/apply" style={styles.footerLink}>Business Checking</Link>
              <Link href="/apply" style={styles.footerLink}>Business Savings</Link>
              <Link href="/loans" style={styles.footerLink}>Business Loans</Link>
              <Link href="/cards" style={styles.footerLink}>Business Credit Cards</Link>
              <Link href="/support" style={styles.footerLink}>Merchant Services</Link>
            </div>
            <div style={styles.footerSection}>
              <h4 style={styles.footerTitle}>Resources</h4>
              <Link href="/support" style={styles.footerLink}>Customer Support</Link>
              <Link href="/faq" style={styles.footerLink}>FAQ</Link>
              <Link href="/security" style={styles.footerLink}>Security Center</Link>
              <Link href="/terms" style={styles.footerLink}>Terms & Conditions</Link>
              <Link href="/privacy" style={styles.footerLink}>Privacy Policy</Link>
            </div>
            <div style={styles.footerSection}>
              <h4 style={styles.footerTitle}>Contact Info</h4>
              <p style={styles.footerContact}>📞 1-800-OAKLINE</p>
              <p style={styles.footerContact}>📧 support@oaklinebank.com</p>
              <p style={styles.footerContact}>🏦 150+ Branch Locations</p>
              <p style={styles.footerContact}>🕒 24/7 Customer Service</p>
              <div style={styles.socialMedia}>
                <span style={styles.socialIcon}>📘</span>
                <span style={styles.socialIcon}>📷</span>
                <span style={styles.socialIcon}>🐦</span>
                <span style={styles.socialIcon}>💼</span>
              </div>
            </div>
          </div>
          <div style={styles.footerBottom}>
            <p style={styles.copyright}>© 2024 Oakline Bank. All rights reserved. Member FDIC. Equal Housing Lender.</p>
            <p style={styles.disclaimer}>
              Investment and insurance products are not FDIC insured, are not bank guaranteed, and may lose value.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#ffffff'
  },

  // Header Styles
  header: {
    backgroundColor: '#ffffff',
    borderBottom: '1px solid #e5e7eb',
    position: 'sticky',
    top: 0,
    zIndex: 1000,
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  },
  headerContent: {
    maxWidth: '1400px',
    margin: '0 auto',
    padding: '0 1rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: '70px'
  },
  logo: {
    display: 'flex',
    alignItems: 'center'
  },
  logoImage: {
    height: '45px',
    width: 'auto'
  },
  nav: {
    display: 'flex',
    alignItems: 'center',
    gap: '2rem',
    '@media (max-width: 768px)': {
      display: 'none'
    }
  },
  navItem: {
    position: 'relative'
  },
  navLink: {
    color: '#1e3a8a',
    textDecoration: 'none',
    fontSize: '0.95rem',
    fontWeight: '600',
    padding: '0.5rem 0',
    cursor: 'pointer',
    transition: 'color 0.2s'
  },
  dropdown: {
    position: 'absolute',
    top: '100%',
    left: '0',
    backgroundColor: '#ffffff',
    minWidth: '700px',
    padding: '2rem',
    boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
    borderRadius: '12px',
    border: '1px solid #e5e7eb',
    zIndex: 200,
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '2rem'
  },
  dropdownSection: {
    minWidth: '200px'
  },
  dropdownHeading: {
    fontSize: '0.9rem',
    fontWeight: '700',
    color: '#1e3a8a',
    marginBottom: '1rem',
    paddingBottom: '0.5rem',
    borderBottom: '2px solid #e5e7eb'
  },
  dropdownLink: {
    display: 'block',
    color: '#6b7280',
    textDecoration: 'none',
    padding: '0.5rem 0',
    fontSize: '0.85rem',
    fontWeight: '500',
    transition: 'color 0.2s'
  },
  headerActions: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    '@media (max-width: 768px)': {
      display: 'none'
    }
  },
  loginButton: {
    color: '#1e3a8a',
    textDecoration: 'none',
    padding: '0.6rem 1.2rem',
    border: '2px solid #1e3a8a',
    borderRadius: '8px',
    fontSize: '0.9rem',
    fontWeight: '600',
    transition: 'all 0.3s'
  },
  applyButton: {
    backgroundColor: '#059669',
    color: 'white',
    textDecoration: 'none',
    padding: '0.6rem 1.2rem',
    borderRadius: '8px',
    fontSize: '0.9rem',
    fontWeight: '600',
    transition: 'all 0.3s'
  },
  dashboardButton: {
    backgroundColor: '#1e3a8a',
    color: 'white',
    textDecoration: 'none',
    padding: '0.6rem 1.2rem',
    borderRadius: '8px',
    fontSize: '0.9rem',
    fontWeight: '600'
  },
  logoutButton: {
    backgroundColor: '#dc2626',
    color: 'white',
    border: 'none',
    padding: '0.6rem 1.2rem',
    borderRadius: '8px',
    fontSize: '0.9rem',
    fontWeight: '600',
    cursor: 'pointer'
  },
  mobileMenuToggle: {
    display: 'none',
    background: 'none',
    border: 'none',
    fontSize: '1.5rem',
    color: '#1e3a8a',
    cursor: 'pointer',
    '@media (max-width: 768px)': {
      display: 'block'
    }
  },
  mobileMenu: {
    backgroundColor: 'white',
    borderTop: '1px solid #e5e7eb',
    padding: '1rem',
    display: 'none',
    '@media (max-width: 768px)': {
      display: 'block'
    }
  },
  mobileLink: {
    display: 'block',
    color: '#1e3a8a',
    textDecoration: 'none',
    padding: '1rem 0',
    borderBottom: '1px solid #f1f5f9',
    fontWeight: '500'
  },

  // Hero Styles
  hero: {
    position: 'relative',
    height: '600px',
    overflow: 'hidden',
    '@media (max-width: 768px)': {
      height: '500px'
    }
  },
  heroSlide: {
    position: 'relative',
    width: '100%',
    height: '100%'
  },
  heroImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover'
  },
  heroOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'linear-gradient(135deg, rgba(30, 58, 138, 0.8) 0%, rgba(5, 150, 105, 0.6) 100%)'
  },
  heroContent: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    textAlign: 'center',
    color: 'white',
    maxWidth: '600px',
    padding: '0 1rem'
  },
  heroTitle: {
    fontSize: '3.5rem',
    fontWeight: '700',
    marginBottom: '1rem',
    textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
    '@media (max-width: 768px)': {
      fontSize: '2.5rem'
    }
  },
  heroSubtitle: {
    fontSize: '1.25rem',
    marginBottom: '2rem',
    opacity: 0.95,
    '@media (max-width: 768px)': {
      fontSize: '1.1rem'
    }
  },
  heroButton: {
    backgroundColor: '#059669',
    color: 'white',
    textDecoration: 'none',
    padding: '1rem 2.5rem',
    borderRadius: '8px',
    fontSize: '1.1rem',
    fontWeight: '600',
    boxShadow: '0 4px 12px rgba(5, 150, 105, 0.4)',
    transition: 'all 0.3s'
  },
  slideIndicators: {
    position: 'absolute',
    bottom: '20px',
    left: '50%',
    transform: 'translateX(-50%)',
    display: 'flex',
    gap: '8px',
    zIndex: 3
  },
  indicator: {
    width: '12px',
    height: '12px',
    borderRadius: '50%',
    border: '2px solid white',
    background: 'transparent',
    cursor: 'pointer',
    transition: 'all 0.3s'
  },
  indicatorActive: {
    backgroundColor: 'white'
  },

  // Services Styles
  services: {
    padding: '5rem 0',
    backgroundColor: '#f8fafc'
  },
  sectionTitle: {
    fontSize: '2.5rem',
    fontWeight: '700',
    color: '#1e293b',
    textAlign: 'center',
    marginBottom: '3rem',
    '@media (max-width: 768px)': {
      fontSize: '2rem'
    }
  },
  servicesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
    gap: '2rem',
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 1rem'
  },
  serviceCard: {
    backgroundColor: 'white',
    borderRadius: '16px',
    padding: '2rem',
    textAlign: 'center',
    boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
    transition: 'transform 0.3s'
  },
  serviceImage: {
    width: '100%',
    height: '200px',
    objectFit: 'cover',
    borderRadius: '12px',
    marginBottom: '1.5rem'
  },
  serviceTitle: {
    fontSize: '1.5rem',
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: '1rem'
  },
  serviceDesc: {
    color: '#64748b',
    marginBottom: '1.5rem',
    lineHeight: 1.6
  },
  serviceButton: {
    color: '#1e3a8a',
    textDecoration: 'none',
    fontWeight: '600',
    padding: '0.75rem 1.5rem',
    border: '2px solid #1e3a8a',
    borderRadius: '8px',
    transition: 'all 0.3s'
  },

  // Card Section Styles
  cardSection: {
    padding: '5rem 0',
    backgroundColor: 'white'
  },
  cardContent: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '4rem',
    alignItems: 'center',
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 1rem',
    '@media (max-width: 768px)': {
      gridTemplateColumns: '1fr',
      gap: '2rem'
    }
  },
  cardInfo: {
    padding: '1rem'
  },
  cardTitle: {
    fontSize: '2.5rem',
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: '1.5rem'
  },
  cardDesc: {
    fontSize: '1.1rem',
    color: '#64748b',
    marginBottom: '2rem',
    lineHeight: 1.6
  },
  cardFeatures: {
    listStyle: 'none',
    padding: 0,
    marginBottom: '2rem'
  },
  cardButton: {
    backgroundColor: '#059669',
    color: 'white',
    textDecoration: 'none',
    padding: '1rem 2rem',
    borderRadius: '8px',
    fontSize: '1.1rem',
    fontWeight: '600',
    transition: 'all 0.3s'
  },
  cardDisplay: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  debitCard: {
    width: '340px',
    height: '215px',
    background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 50%, #059669 100%)',
    borderRadius: '16px',
    padding: '24px',
    color: 'white',
    position: 'relative',
    boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
    fontFamily: 'monospace'
  },
  cardChip: {
    width: '32px',
    height: '26px',
    background: '#ffd700',
    borderRadius: '4px',
    marginBottom: '20px'
  },
  cardLogo: {
    fontSize: '1.2rem',
    fontWeight: 'bold',
    marginBottom: '15px',
    letterSpacing: '2px'
  },
  cardNumber: {
    fontSize: '1.4rem',
    fontWeight: '500',
    marginBottom: '20px',
    letterSpacing: '2px'
  },
  cardDetails: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '15px'
  },
  cardLabel: {
    fontSize: '0.7rem',
    marginBottom: '4px',
    opacity: 0.8
  },
  cardExpiry: {
    fontSize: '1rem',
    fontWeight: '500'
  },
  cardName: {
    fontSize: '1rem',
    fontWeight: '500'
  },
  cardNetwork: {
    position: 'absolute',
    bottom: '20px',
    right: '24px',
    fontSize: '1.2rem',
    fontWeight: 'bold',
    fontStyle: 'italic'
  },

  // ATM Section Styles
  atmSection: {
    padding: '5rem 0',
    backgroundColor: '#f8fafc'
  },
  atmGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
    gap: '3rem',
    maxWidth: '1000px',
    margin: '0 auto',
    padding: '0 1rem'
  },
  atmCard: {
    backgroundColor: 'white',
    borderRadius: '16px',
    padding: '2rem',
    textAlign: 'center',
    boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
  },
  atmImage: {
    width: '100%',
    height: '250px',
    objectFit: 'cover',
    borderRadius: '12px',
    marginBottom: '1.5rem'
  },
  atmTitle: {
    fontSize: '1.5rem',
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: '1rem'
  },
  atmDesc: {
    color: '#64748b',
    lineHeight: 1.6
  },

  // Discussion Section Styles
  discussionSection: {
    padding: '5rem 0',
    backgroundColor: 'white'
  },
  discussionContent: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '4rem',
    alignItems: 'center',
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 1rem',
    '@media (max-width: 768px)': {
      gridTemplateColumns: '1fr',
      gap: '2rem'
    }
  },
  discussionImages: {
    display: 'grid',
    gridTemplateColumns: '1fr',
    gap: '1rem'
  },
  discussionImage: {
    width: '100%',
    height: '200px',
    objectFit: 'cover',
    borderRadius: '12px'
  },
  discussionInfo: {
    padding: '1rem'
  },
  discussionTitle: {
    fontSize: '2rem',
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: '1.5rem'
  },
  discussionDesc: {
    fontSize: '1.1rem',
    color: '#64748b',
    marginBottom: '2rem',
    lineHeight: 1.6
  },
  discussionFeatures: {
    marginBottom: '2rem'
  },
  feature: {
    color: '#059669',
    fontWeight: '500',
    marginBottom: '0.5rem'
  },
  discussionButton: {
    backgroundColor: '#1e3a8a',
    color: 'white',
    textDecoration: 'none',
    padding: '1rem 2rem',
    borderRadius: '8px',
    fontSize: '1.1rem',
    fontWeight: '600',
    transition: 'all 0.3s'
  },

  // Testimonials Styles
  testimonialsSection: {
    padding: '5rem 0',
    backgroundColor: '#f8fafc'
  },
  testimonialsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '2rem',
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 1rem'
  },
  testimonialCard: {
    backgroundColor: 'white',
    borderRadius: '16px',
    padding: '2rem',
    textAlign: 'center',
    boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
  },
  testimonialImage: {
    width: '80px',
    height: '80px',
    borderRadius: '50%',
    overflow: 'hidden',
    margin: '0 auto 1rem',
    border: '4px solid #e5e7eb'
  },
  testimonialPhoto: {
    width: '100%',
    height: '100%',
    objectFit: 'cover'
  },
  testimonialName: {
    fontSize: '1.2rem',
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: '0.5rem'
  },
  testimonialRole: {
    color: '#64748b',
    fontSize: '0.9rem',
    marginBottom: '1rem'
  },
  testimonialText: {
    color: '#374151',
    fontStyle: 'italic',
    marginBottom: '1rem',
    lineHeight: 1.6
  },
  testimonialStars: {
    display: 'flex',
    justifyContent: 'center',
    gap: '2px'
  },
  star: {
    color: '#fbbf24',
    fontSize: '1.2rem'
  },

  // Loan Section Styles
  loanSection: {
    padding: '5rem 0',
    backgroundColor: 'white'
  },
  loanContent: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '4rem',
    alignItems: 'center',
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 1rem',
    '@media (max-width: 768px)': {
      gridTemplateColumns: '1fr',
      gap: '2rem'
    }
  },
  loanInfo: {
    padding: '1rem'
  },
  loanTitle: {
    fontSize: '2.5rem',
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: '1.5rem'
  },
  loanDesc: {
    fontSize: '1.1rem',
    color: '#64748b',
    marginBottom: '2rem',
    lineHeight: 1.6
  },
  loanFeatures: {
    display: 'grid',
    gap: '1rem',
    marginBottom: '2rem'
  },
  loanFeature: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem'
  },
  loanIcon: {
    fontSize: '2rem'
  },
  loanButton: {
    backgroundColor: '#059669',
    color: 'white',
    textDecoration: 'none',
    padding: '1rem 2rem',
    borderRadius: '8px',
    fontSize: '1.1rem',
    fontWeight: '600',
    transition: 'all 0.3s'
  },
  loanImages: {
    display: 'flex',
    justifyContent: 'center'
  },
  loanImage: {
    width: '100%',
    height: '300px',
    objectFit: 'cover',
    borderRadius: '12px'
  },

  // Security Section Styles
  securitySection: {
    padding: '5rem 0',
    backgroundColor: '#f8fafc'
  },
  securityGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '2rem',
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 1rem'
  },
  securityCard: {
    backgroundColor: 'white',
    borderRadius: '16px',
    padding: '2rem',
    textAlign: 'center',
    boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
  },
  securityIcon: {
    fontSize: '3rem',
    marginBottom: '1rem'
  },

  // News Section Styles
  newsSection: {
    padding: '5rem 0',
    backgroundColor: 'white'
  },
  newsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
    gap: '2rem',
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 1rem'
  },
  newsCard: {
    backgroundColor: 'white',
    borderRadius: '16px',
    overflow: 'hidden',
    boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
    transition: 'transform 0.3s'
  },
  newsImage: {
    width: '100%',
    height: '200px',
    objectFit: 'cover'
  },
  newsContent: {
    padding: '1.5rem'
  },
  newsTitle: {
    fontSize: '1.3rem',
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: '0.5rem'
  },
  newsDesc: {
    color: '#64748b',
    marginBottom: '1rem',
    lineHeight: 1.5
  },
  newsDate: {
    fontSize: '0.85rem',
    color: '#9ca3af'
  },

  // CTA Section Styles
  ctaSection: {
    padding: '5rem 0',
    background: 'linear-gradient(135deg, #1e3a8a 0%, #059669 100%)',
    color: 'white'
  },
  ctaContent: {
    textAlign: 'center',
    maxWidth: '800px',
    margin: '0 auto',
    padding: '0 1rem'
  },
  ctaTitle: {
    fontSize: '2.5rem',
    fontWeight: '700',
    marginBottom: '1rem'
  },
  ctaDesc: {
    fontSize: '1.2rem',
    marginBottom: '2rem',
    opacity: 0.9
  },
  ctaButtons: {
    display: 'flex',
    gap: '1rem',
    justifyContent: 'center',
    '@media (max-width: 568px)': {
      flexDirection: 'column',
      alignItems: 'center'
    }
  },
  ctaPrimary: {
    backgroundColor: 'white',
    color: '#1e3a8a',
    textDecoration: 'none',
    padding: '1rem 2rem',
    borderRadius: '8px',
    fontSize: '1.1rem',
    fontWeight: '600',
    transition: 'all 0.3s'
  },
  ctaSecondary: {
    backgroundColor: 'transparent',
    color: 'white',
    textDecoration: 'none',
    padding: '1rem 2rem',
    border: '2px solid white',
    borderRadius: '8px',
    fontSize: '1.1rem',
    fontWeight: '600',
    transition: 'all 0.3s'
  },

  // Footer Styles
  footer: {
    backgroundColor: '#1f2937',
    color: 'white',
    padding: '3rem 0 1rem'
  },
  footerContent: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '2rem',
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 1rem',
    marginBottom: '2rem'
  },
  footerSection: {
    marginBottom: '1rem'
  },
  footerTitle: {
    fontSize: '1.2rem',
    fontWeight: '600',
    color: '#f9fafb',
    marginBottom: '1rem'
  },
  footerLink: {
    display: 'block',
    color: '#d1d5db',
    textDecoration: 'none',
    padding: '0.25rem 0',
    fontSize: '0.9rem',
    transition: 'color 0.2s'
  },
  footerContact: {
    color: '#d1d5db',
    fontSize: '0.9rem',
    marginBottom: '0.5rem'
  },
  socialMedia: {
    display: 'flex',
    gap: '1rem',
    marginTop: '1rem'
  },
  socialIcon: {
    fontSize: '1.5rem',
    cursor: 'pointer'
  },
  footerBottom: {
    borderTop: '1px solid #374151',
    paddingTop: '1rem',
    textAlign: 'center',
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '1rem'
  },
  copyright: {
    fontSize: '0.85rem',
    color: '#9ca3af',
    marginBottom: '0.5rem'
  },
  disclaimer: {
    fontSize: '0.75rem',
    color: '#6b7280',
    fontStyle: 'italic'
  }
};
