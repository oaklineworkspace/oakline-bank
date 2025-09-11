export default function FAQ() {
  return (
    <div>
      <h1>Frequently Asked Questions</h1>
      <p>This is a placeholder for the FAQ page.</p>
    </div>
  );
}
import { useState } from 'react';
import Link from 'next/link';
import MainMenu from '../components/MainMenu';
import Footer from '../components/Footer';

export default function FAQ() {
  const [user, setUser] = useState(null);
  const [openFAQ, setOpenFAQ] = useState(null);

  const faqData = [
    {
      category: 'Account Opening',
      questions: [
        {
          question: 'How do I open an account with Oakline Bank?',
          answer: 'You can open an account online through our application process, visit any branch location, or call our customer service line. You\'ll need a valid ID, Social Security number, and initial deposit.'
        },
        {
          question: 'What documents do I need to open an account?',
          answer: 'You\'ll need a government-issued photo ID (driver\'s license, passport, or state ID), Social Security card or W-2, and proof of address (utility bill or bank statement).'
        },
        {
          question: 'Is there a minimum deposit required?',
          answer: 'Minimum deposits vary by account type. Checking accounts require $100, savings accounts $50, and some premium accounts may require higher minimums.'
        }
      ]
    },
    {
      category: 'Online Banking',
      questions: [
        {
          question: 'How do I access online banking?',
          answer: 'Visit our website and click "Sign In" or download our mobile app. Use your account number and the password you set up during enrollment.'
        },
        {
          question: 'Is online banking secure?',
          answer: 'Yes, we use bank-level 256-bit SSL encryption, multi-factor authentication, and continuous monitoring to protect your information and transactions.'
        },
        {
          question: 'Can I deposit checks through mobile banking?',
          answer: 'Yes, our mobile app includes mobile check deposit. Simply take photos of the front and back of your endorsed check and submit for deposit.'
        }
      ]
    },
    {
      category: 'Fees & Charges',
      questions: [
        {
          question: 'What fees does Oakline Bank charge?',
          answer: 'We believe in transparent pricing. Common fees include overdraft ($35), out-of-network ATM ($2.50), and wire transfers ($15 domestic, $45 international). Many fees can be waived with qualifying balances.'
        },
        {
          question: 'How can I avoid monthly maintenance fees?',
          answer: 'Most accounts waive monthly fees with a minimum daily balance or direct deposit. Specific requirements vary by account type - check your account agreement for details.'
        },
        {
          question: 'Do you charge for using other bank ATMs?',
          answer: 'We charge $2.50 for out-of-network ATM usage, but we reimburse up to $20/month in ATM fees for premium account holders.'
        }
      ]
    },
    {
      category: 'Loans & Credit',
      questions: [
        {
          question: 'What types of loans do you offer?',
          answer: 'We offer personal loans, auto loans, home mortgages, home equity loans, and business loans. Each has competitive rates and flexible terms.'
        },
        {
          question: 'How do I apply for a loan?',
          answer: 'You can apply online, visit a branch, or call us. You\'ll need income documentation, credit information, and details about the loan purpose.'
        },
        {
          question: 'What credit score do I need for a loan?',
          answer: 'Credit requirements vary by loan type. We work with customers across the credit spectrum and offer programs for first-time borrowers and those rebuilding credit.'
        }
      ]
    },
    {
      category: 'Security',
      questions: [
        {
          question: 'How do you protect my personal information?',
          answer: 'We employ multiple security layers including encryption, firewalls, fraud monitoring, and secure authentication. We never ask for sensitive information via email or phone.'
        },
        {
          question: 'What should I do if I suspect fraudulent activity?',
          answer: 'Contact us immediately at 1-800-OAKLINE or through secure messaging in online banking. We\'ll investigate and protect your accounts while resolving any unauthorized transactions.'
        },
        {
          question: 'How do I set up account alerts?',
          answer: 'Log into online banking or our mobile app, go to Settings > Account Alerts, and choose from various notification options including low balance, large transactions, and login alerts.'
        }
      ]
    }
  ];

  const toggleFAQ = (index) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  const styles = {
    container: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    },
    content: {
      maxWidth: '1000px',
      margin: '0 auto',
      padding: '2rem 1rem'
    },
    header: {
      textAlign: 'center',
      marginBottom: '3rem'
    },
    title: {
      fontSize: 'clamp(2.5rem, 5vw, 4rem)',
      fontWeight: '900',
      color: '#1e293b',
      marginBottom: '1rem',
      background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text'
    },
    subtitle: {
      fontSize: '1.2rem',
      color: '#64748b',
      maxWidth: '600px',
      margin: '0 auto'
    },
    categorySection: {
      backgroundColor: 'white',
      borderRadius: '16px',
      padding: '2rem',
      marginBottom: '2rem',
      boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
      border: '1px solid #e2e8f0'
    },
    categoryTitle: {
      fontSize: '1.5rem',
      fontWeight: '700',
      color: '#1e293b',
      marginBottom: '1.5rem',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem'
    },
    categoryIcon: {
      fontSize: '1.2rem'
    },
    faqItem: {
      borderBottom: '1px solid #f1f5f9',
      paddingBottom: '1rem',
      marginBottom: '1rem'
    },
    questionButton: {
      width: '100%',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '1rem 0',
      backgroundColor: 'transparent',
      border: 'none',
      cursor: 'pointer',
      fontSize: '1.1rem',
      fontWeight: '600',
      color: '#374151',
      textAlign: 'left'
    },
    questionText: {
      flex: 1,
      marginRight: '1rem'
    },
    toggleIcon: {
      fontSize: '1.2rem',
      color: '#3b82f6',
      transition: 'transform 0.3s ease'
    },
    answer: {
      padding: '1rem 1.5rem',
      backgroundColor: '#f8fafc',
      borderRadius: '8px',
      marginTop: '0.5rem',
      fontSize: '0.95rem',
      color: '#374151',
      lineHeight: '1.6',
      border: '1px solid #e2e8f0'
    },
    contactSection: {
      backgroundColor: 'white',
      borderRadius: '16px',
      padding: '2.5rem',
      textAlign: 'center',
      boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
      border: '1px solid #e2e8f0'
    },
    contactTitle: {
      fontSize: '1.5rem',
      fontWeight: '700',
      color: '#1e293b',
      marginBottom: '1rem'
    },
    contactText: {
      fontSize: '1rem',
      color: '#64748b',
      marginBottom: '2rem'
    },
    contactButtons: {
      display: 'flex',
      gap: '1rem',
      justifyContent: 'center',
      flexWrap: 'wrap'
    },
    contactButton: {
      padding: '0.75rem 1.5rem',
      borderRadius: '10px',
      textDecoration: 'none',
      fontSize: '0.9rem',
      fontWeight: '600',
      transition: 'all 0.3s ease',
      display: 'inline-flex',
      alignItems: 'center',
      gap: '0.5rem'
    },
    primaryButton: {
      background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
      color: 'white',
      boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)'
    },
    secondaryButton: {
      backgroundColor: 'transparent',
      color: '#3b82f6',
      border: '2px solid #3b82f6'
    }
  };

  return (
    <div style={styles.container}>
      <MainMenu user={user} />
      
      <div style={styles.content}>
        <div style={styles.header}>
          <h1 style={styles.title}>Frequently Asked Questions</h1>
          <p style={styles.subtitle}>
            Find answers to common questions about Oakline Bank services, 
            accounts, and policies.
          </p>
        </div>

        {faqData.map((category, categoryIndex) => (
          <div key={categoryIndex} style={styles.categorySection}>
            <h2 style={styles.categoryTitle}>
              <span style={styles.categoryIcon}>
                {category.category === 'Account Opening' && '📝'}
                {category.category === 'Online Banking' && '💻'}
                {category.category === 'Fees & Charges' && '💳'}
                {category.category === 'Loans & Credit' && '🏠'}
                {category.category === 'Security' && '🔒'}
              </span>
              {category.category}
            </h2>
            
            {category.questions.map((faq, faqIndex) => {
              const globalIndex = `${categoryIndex}-${faqIndex}`;
              const isOpen = openFAQ === globalIndex;
              
              return (
                <div key={faqIndex} style={styles.faqItem}>
                  <button
                    style={styles.questionButton}
                    onClick={() => toggleFAQ(globalIndex)}
                  >
                    <span style={styles.questionText}>{faq.question}</span>
                    <span style={{
                      ...styles.toggleIcon,
                      transform: isOpen ? 'rotate(45deg)' : 'rotate(0deg)'
                    }}>
                      {isOpen ? '−' : '+'}
                    </span>
                  </button>
                  
                  {isOpen && (
                    <div style={styles.answer}>
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ))}

        <div style={styles.contactSection}>
          <h2 style={styles.contactTitle}>Still Have Questions?</h2>
          <p style={styles.contactText}>
            Our customer service team is here to help you with any questions 
            not covered in our FAQ section.
          </p>
          <div style={styles.contactButtons}>
            <Link href="/support" style={{...styles.contactButton, ...styles.primaryButton}}>
              💬 Contact Support
            </Link>
            <Link href="tel:1-800-OAKLINE" style={{...styles.contactButton, ...styles.secondaryButton}}>
              📞 Call Us Now
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
