
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '../lib/supabaseClient';

export default function FAQ() {
  const [user, setUser] = useState(null);
  const [activeCategory, setActiveCategory] = useState('general');
  const [openQuestion, setOpenQuestion] = useState(null);

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    } catch (error) {
      console.error('Error checking user:', error);
    }
  };

  const faqData = {
    general: [
      {
        question: "What is Oakline Bank's routing number?",
        answer: "Our routing number is 075915826. You can use this for direct deposits, wire transfers, and ACH transactions."
      },
      {
        question: "What are your customer service hours?",
        answer: "Our customer service is available 24/7. You can reach us at 1-800-OAKLINE or through our secure messaging system."
      },
      {
        question: "Is Oakline Bank FDIC insured?",
        answer: "Yes, Oakline Bank is FDIC insured up to $250,000 per depositor, per insured bank, for each account ownership category."
      },
      {
        question: "How do I reset my online banking password?",
        answer: "Click 'Forgot Password' on the login page, enter your email address, and follow the instructions sent to your email."
      }
    ],
    accounts: [
      {
        question: "What types of accounts do you offer?",
        answer: "We offer 23 different account types including checking, savings, money market, CDs, business accounts, investment accounts, and specialized accounts for students, seniors, and more."
      },
      {
        question: "What is the minimum balance requirement?",
        answer: "Minimum balance requirements vary by account type. Many of our accounts have no minimum balance requirement. Check our account types page for specific details."
      },
      {
        question: "Are there monthly fees?",
        answer: "Many of our accounts have no monthly fees. For accounts that do have fees, they can often be waived by meeting certain requirements like maintaining a minimum balance or setting up direct deposit."
      },
      {
        question: "How do I open a new account?",
        answer: "You can open an account online through our application process, visit one of our branches, or call our customer service team. You'll need a valid ID and initial deposit."
      }
    ],
    digital: [
      {
        question: "Is mobile banking secure?",
        answer: "Yes, our mobile app uses 256-bit SSL encryption, multi-factor authentication, and biometric login options to keep your information secure."
      },
      {
        question: "Can I deposit checks using my phone?",
        answer: "Yes, our mobile deposit feature allows you to deposit checks by taking a photo. Most deposits are available the next business day."
      },
      {
        question: "How do I set up mobile alerts?",
        answer: "Log into your account, go to Settings > Notifications, and choose which alerts you'd like to receive via text, email, or push notification."
      },
      {
        question: "What if I lose my phone with the banking app?",
        answer: "Contact us immediately at 1-800-OAKLINE. We can disable mobile access and help you secure your account. You can re-enable access once you have a new device."
      }
    ],
    transactions: [
      {
        question: "Are there limits on transfers?",
        answer: "Transfer limits vary by account type and transaction method. Online transfers typically have daily limits that can be adjusted based on your needs."
      },
      {
        question: "How long do wire transfers take?",
        answer: "Domestic wire transfers are typically completed the same business day. International wires may take 1-3 business days depending on the destination."
      },
      {
        question: "What are your ATM fees?",
        answer: "We have over 55,000 fee-free ATMs nationwide. Using non-network ATMs may incur fees, but we reimburse ATM fees for certain account types."
      },
      {
        question: "Can I schedule recurring payments?",
        answer: "Yes, you can set up recurring transfers and bill payments through online banking or our mobile app."
      }
    ],
    security: [
      {
        question: "How do you protect my personal information?",
        answer: "We use advanced encryption, secure servers, multi-factor authentication, and continuous monitoring to protect your data. We never share your information without your consent."
      },
      {
        question: "What should I do if I suspect fraud?",
        answer: "Contact us immediately at 1-800-OAKLINE. We'll help secure your account, investigate the issue, and assist with any unauthorized transactions."
      },
      {
        question: "Do you offer identity theft protection?",
        answer: "Yes, we provide identity monitoring services and will assist you if your identity is compromised. Contact us for details about our protection programs."
      },
      {
        question: "How can I make my account more secure?",
        answer: "Enable multi-factor authentication, use strong passwords, set up account alerts, and never share your login credentials. Regularly monitor your account statements."
      }
    ]
  };

  const categories = [
    { key: 'general', name: 'General', icon: '❓' },
    { key: 'accounts', name: 'Accounts', icon: '🏦' },
    { key: 'digital', name: 'Digital Banking', icon: '📱' },
    { key: 'transactions', name: 'Transactions', icon: '💸' },
    { key: 'security', name: 'Security', icon: '🔒' }
  ];

  const toggleQuestion = (index) => {
    setOpenQuestion(openQuestion === index ? null : index);
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <header style={styles.header}>
        <div style={styles.headerContent}>
          <Link href="/" style={styles.logoContainer}>
            <img src="/images/logo-primary.png.jpg" alt="Oakline Bank" style={styles.logo} />
            <div style={styles.brandInfo}>
              <span style={styles.bankName}>Oakline Bank</span>
              <span style={styles.tagline}>Your Financial Partner</span>
            </div>
          </Link>
          
          <div style={styles.headerActions}>
            <Link href="/" style={styles.headerButton}>Home</Link>
            <Link href="/support" style={styles.headerButton}>Support</Link>
            {user ? (
              <Link href="/dashboard" style={styles.headerButton}>Dashboard</Link>
            ) : (
              <Link href="/login" style={styles.headerButton}>Sign In</Link>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section style={styles.heroSection}>
        <div style={styles.heroContent}>
          <h1 style={styles.heroTitle}>Frequently Asked Questions</h1>
          <p style={styles.heroSubtitle}>
            Find answers to common questions about Oakline Bank services and features
          </p>
        </div>
      </section>

      {/* Main Content */}
      <main style={styles.main}>
        {/* Category Navigation */}
        <section style={styles.categorySection}>
          <div style={styles.categoryNav}>
            {categories.map(category => (
              <button
                key={category.key}
                onClick={() => setActiveCategory(category.key)}
                style={{
                  ...styles.categoryButton,
                  ...(activeCategory === category.key ? styles.activeCategoryButton : {})
                }}
              >
                <span style={styles.categoryIcon}>{category.icon}</span>
                {category.name}
              </button>
            ))}
          </div>
        </section>

        {/* FAQ Content */}
        <section style={styles.faqSection}>
          <div style={styles.faqContent}>
            <h2 style={styles.faqCategoryTitle}>
              {categories.find(cat => cat.key === activeCategory)?.name} Questions
            </h2>
            
            <div style={styles.faqList}>
              {faqData[activeCategory]?.map((faq, index) => (
                <div key={index} style={styles.faqItem}>
                  <button
                    onClick={() => toggleQuestion(index)}
                    style={styles.questionButton}
                  >
                    <span style={styles.questionText}>{faq.question}</span>
                    <span style={{
                      ...styles.questionIcon,
                      transform: openQuestion === index ? 'rotate(180deg)' : 'rotate(0deg)'
                    }}>
                      ▼
                    </span>
                  </button>
                  
                  {openQuestion === index && (
                    <div style={styles.answerContent}>
                      <p style={styles.answerText}>{faq.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Quick Links */}
        <section style={styles.quickLinksSection}>
          <div style={styles.quickLinksContent}>
            <h2 style={styles.quickLinksTitle}>Still Need Help?</h2>
            <div style={styles.quickLinksGrid}>
              <Link href="/support" style={styles.quickLink}>
                <div style={styles.quickLinkIcon}>💬</div>
                <h3 style={styles.quickLinkTitle}>Contact Support</h3>
                <p style={styles.quickLinkDesc}>Chat with our support team</p>
              </Link>
              
              <a href="tel:+1-800-OAKLINE" style={styles.quickLink}>
                <div style={styles.quickLinkIcon}>📞</div>
                <h3 style={styles.quickLinkTitle}>Call Us</h3>
                <p style={styles.quickLinkDesc}>1-800-OAKLINE (24/7)</p>
              </a>
              
              <Link href="/branch-locator" style={styles.quickLink}>
                <div style={styles.quickLinkIcon}>🏢</div>
                <h3 style={styles.quickLinkTitle}>Visit a Branch</h3>
                <p style={styles.quickLinkDesc}>Find locations near you</p>
              </Link>
              
              <Link href="/account-types" style={styles.quickLink}>
                <div style={styles.quickLinkIcon}>📚</div>
                <h3 style={styles.quickLinkTitle}>Account Information</h3>
                <p style={styles.quickLinkDesc}>Learn about our accounts</p>
              </Link>
            </div>
          </div>
        </section>

        {/* Contact Information */}
        <section style={styles.contactSection}>
          <div style={styles.contactContent}>
            <h2 style={styles.contactTitle}>Contact Information</h2>
            <div style={styles.contactGrid}>
              <div style={styles.contactItem}>
                <strong>Customer Service:</strong> 1-800-OAKLINE
              </div>
              <div style={styles.contactItem}>
                <strong>Email:</strong> support@theoaklinebank.com
              </div>
              <div style={styles.contactItem}>
                <strong>Routing Number:</strong> 075915826
              </div>
              <div style={styles.contactItem}>
                <strong>Hours:</strong> 24/7 Support Available
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer style={styles.footer}>
        <div style={styles.footerContent}>
          <p style={styles.footerText}>
            © 2024 Oakline Bank. All rights reserved. Member FDIC. Equal Housing Lender.
          </p>
        </div>
      </footer>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#f8fafc',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
  },
  header: {
    backgroundColor: '#1e40af',
    color: 'white',
    padding: '1rem 1.5rem',
    boxShadow: '0 4px 12px rgba(30, 64, 175, 0.2)'
  },
  headerContent: {
    maxWidth: '1400px',
    margin: '0 auto',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap'
  },
  logoContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    textDecoration: 'none',
    color: 'white'
  },
  logo: {
    height: '50px',
    width: 'auto'
  },
  brandInfo: {
    display: 'flex',
    flexDirection: 'column'
  },
  bankName: {
    fontSize: '1.5rem',
    fontWeight: 'bold'
  },
  tagline: {
    fontSize: '0.9rem',
    color: '#bfdbfe'
  },
  headerActions: {
    display: 'flex',
    gap: '1rem'
  },
  headerButton: {
    padding: '0.5rem 1rem',
    backgroundColor: 'rgba(255,255,255,0.15)',
    color: 'white',
    textDecoration: 'none',
    borderRadius: '6px',
    fontSize: '0.9rem',
    fontWeight: '500',
    transition: 'all 0.3s ease'
  },
  heroSection: {
    background: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)',
    color: 'white',
    padding: '3rem 1.5rem',
    textAlign: 'center'
  },
  heroContent: {
    maxWidth: '800px',
    margin: '0 auto'
  },
  heroTitle: {
    fontSize: '2.5rem',
    fontWeight: 'bold',
    marginBottom: '1rem'
  },
  heroSubtitle: {
    fontSize: '1.1rem',
    opacity: 0.9,
    lineHeight: '1.6'
  },
  main: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 1.5rem'
  },
  categorySection: {
    padding: '2rem 0'
  },
  categoryNav: {
    display: 'flex',
    gap: '0.5rem',
    justifyContent: 'center',
    flexWrap: 'wrap'
  },
  categoryButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '1rem 1.5rem',
    backgroundColor: 'white',
    color: '#64748b',
    border: '2px solid #e2e8f0',
    borderRadius: '12px',
    cursor: 'pointer',
    fontSize: '1rem',
    fontWeight: '600',
    transition: 'all 0.3s ease'
  },
  activeCategoryButton: {
    backgroundColor: '#1e40af',
    color: 'white',
    borderColor: '#1e40af'
  },
  categoryIcon: {
    fontSize: '1.2rem'
  },
  faqSection: {
    padding: '2rem 0'
  },
  faqContent: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '2rem',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    border: '1px solid #e2e8f0'
  },
  faqCategoryTitle: {
    fontSize: '1.8rem',
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: '2rem',
    textAlign: 'center'
  },
  faqList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem'
  },
  faqItem: {
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    overflow: 'hidden'
  },
  questionButton: {
    width: '100%',
    padding: '1.5rem',
    backgroundColor: '#f8fafc',
    border: 'none',
    cursor: 'pointer',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: '1rem',
    fontWeight: '600',
    color: '#1e293b',
    transition: 'all 0.3s ease'
  },
  questionText: {
    textAlign: 'left',
    flex: 1
  },
  questionIcon: {
    fontSize: '0.8rem',
    color: '#64748b',
    transition: 'transform 0.3s ease'
  },
  answerContent: {
    padding: '1.5rem',
    backgroundColor: 'white',
    borderTop: '1px solid #e2e8f0'
  },
  answerText: {
    color: '#64748b',
    lineHeight: '1.6',
    margin: 0
  },
  quickLinksSection: {
    padding: '3rem 0'
  },
  quickLinksContent: {
    textAlign: 'center'
  },
  quickLinksTitle: {
    fontSize: '2rem',
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: '2rem'
  },
  quickLinksGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '1.5rem'
  },
  quickLink: {
    display: 'block',
    backgroundColor: 'white',
    padding: '2rem',
    borderRadius: '12px',
    textDecoration: 'none',
    color: 'inherit',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    border: '1px solid #e2e8f0',
    transition: 'all 0.3s ease',
    textAlign: 'center'
  },
  quickLinkIcon: {
    fontSize: '2.5rem',
    marginBottom: '1rem'
  },
  quickLinkTitle: {
    fontSize: '1.2rem',
    fontWeight: 'bold',
    color: '#1e40af',
    marginBottom: '0.5rem'
  },
  quickLinkDesc: {
    color: '#64748b',
    margin: 0
  },
  contactSection: {
    padding: '2rem 0',
    backgroundColor: 'white',
    borderRadius: '12px',
    margin: '2rem 0'
  },
  contactContent: {
    padding: '2rem',
    textAlign: 'center'
  },
  contactTitle: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: '1.5rem'
  },
  contactGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '1rem'
  },
  contactItem: {
    color: '#64748b',
    fontSize: '1rem'
  },
  footer: {
    backgroundColor: '#1f2937',
    color: 'white',
    padding: '2rem 1.5rem',
    textAlign: 'center'
  },
  footerContent: {
    maxWidth: '1400px',
    margin: '0 auto'
  },
  footerText: {
    color: '#d1d5db',
    fontSize: '0.9rem'
  }
};
