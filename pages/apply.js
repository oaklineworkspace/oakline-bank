import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '../lib/supabaseClient';

export default function Apply() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    // Personal Information
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    ssn: '',

    // Address Information
    address: '',
    city: '',
    state: '',
    zipCode: '',

    // Employment Information
    employmentStatus: '',
    employer: '',
    annualIncome: '',

    // Account Selection
    accountType: '',
    initialDeposit: '',

    // Identity Verification
    idType: '',
    idNumber: '',

    // Terms
    termsAccepted: false,
    privacyAccepted: false
  });

  useEffect(() => {
    const getUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
    };
    getUser();
  }, []);

  const accountTypes = [
    {
      id: 'premium-checking',
      name: 'Premium Checking',
      icon: '💎',
      rate: '0.25% APY',
      description: 'Luxury banking with exclusive perks and premium benefits',
      minDeposit: 100,
      features: ['No monthly fees', 'Premium debit card', 'Concierge service', 'Free checks']
    },
    {
      id: 'high-yield-savings',
      name: 'High-Yield Savings',
      icon: '⭐',
      rate: '5.00% APY',
      description: 'Maximum earning potential with competitive rates',
      minDeposit: 25,
      features: ['High interest rates', 'No minimum balance', 'Mobile banking', 'Compound interest']
    },
    {
      id: 'business-checking',
      name: 'Business Checking',
      icon: '🏢',
      rate: '0.15% APY',
      description: 'Professional banking solutions for growing businesses',
      minDeposit: 500,
      features: ['Business banking', 'Merchant services', 'Payroll integration', 'Professional support']
    },
    {
      id: 'investment-account',
      name: 'Investment Account',
      icon: '📈',
      rate: 'Variable',
      description: 'Trade stocks, bonds, ETFs, and mutual funds',
      minDeposit: 1000,
      features: ['Commission-free trades', 'Research tools', 'Advisory services', 'Portfolio management']
    }
  ];

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleNext = () => {
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Simulate submission
      await new Promise(resolve => setTimeout(resolve, 2000));
      alert('Application submitted successfully! We will review your application and contact you within 24 hours.');
      // Reset form or redirect
    } catch (error) {
      alert('Error submitting application. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div style={styles.stepContent}>
            <h2 style={styles.stepTitle}>Personal Information</h2>
            <div style={styles.formGrid}>
              <div style={styles.inputGroup}>
                <label style={styles.label}>First Name *</label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  style={styles.input}
                  required
                />
              </div>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Last Name *</label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  style={styles.input}
                  required
                />
              </div>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Email Address *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  style={styles.input}
                  required
                />
              </div>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Phone Number *</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  style={styles.input}
                  required
                />
              </div>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Date of Birth *</label>
                <input
                  type="date"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleInputChange}
                  style={styles.input}
                  required
                />
              </div>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Social Security Number *</label>
                <input
                  type="password"
                  name="ssn"
                  value={formData.ssn}
                  onChange={handleInputChange}
                  style={styles.input}
                  placeholder="XXX-XX-XXXX"
                  required
                />
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div style={styles.stepContent}>
            <h2 style={styles.stepTitle}>Address Information</h2>
            <div style={styles.formGrid}>
              <div style={{...styles.inputGroup, gridColumn: '1 / -1'}}>
                <label style={styles.label}>Street Address *</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  style={styles.input}
                  required
                />
              </div>
              <div style={styles.inputGroup}>
                <label style={styles.label}>City *</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  style={styles.input}
                  required
                />
              </div>
              <div style={styles.inputGroup}>
                <label style={styles.label}>State *</label>
                <select
                  name="state"
                  value={formData.state}
                  onChange={handleInputChange}
                  style={styles.select}
                  required
                >
                  <option value="">Select State</option>
                  <option value="CA">California</option>
                  <option value="NY">New York</option>
                  <option value="TX">Texas</option>
                  <option value="FL">Florida</option>
                  {/* Add more states as needed */}
                </select>
              </div>
              <div style={styles.inputGroup}>
                <label style={styles.label}>ZIP Code *</label>
                <input
                  type="text"
                  name="zipCode"
                  value={formData.zipCode}
                  onChange={handleInputChange}
                  style={styles.input}
                  required
                />
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div style={styles.stepContent}>
            <h2 style={styles.stepTitle}>Employment Information</h2>
            <div style={styles.formGrid}>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Employment Status *</label>
                <select
                  name="employmentStatus"
                  value={formData.employmentStatus}
                  onChange={handleInputChange}
                  style={styles.select}
                  required
                >
                  <option value="">Select Status</option>
                  <option value="employed">Employed</option>
                  <option value="self-employed">Self-Employed</option>
                  <option value="unemployed">Unemployed</option>
                  <option value="retired">Retired</option>
                  <option value="student">Student</option>
                </select>
              </div>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Employer</label>
                <input
                  type="text"
                  name="employer"
                  value={formData.employer}
                  onChange={handleInputChange}
                  style={styles.input}
                />
              </div>
              <div style={{...styles.inputGroup, gridColumn: '1 / -1'}}>
                <label style={styles.label}>Annual Income *</label>
                <input
                  type="number"
                  name="annualIncome"
                  value={formData.annualIncome}
                  onChange={handleInputChange}
                  style={styles.input}
                  placeholder="$0"
                  required
                />
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div style={styles.stepContent}>
            <h2 style={styles.stepTitle}>Choose Your Account</h2>
            <div style={styles.accountGrid}>
              {accountTypes.map((account) => (
                <div
                  key={account.id}
                  style={{
                    ...styles.accountCard,
                    ...(formData.accountType === account.id ? styles.accountCardSelected : {})
                  }}
                  onClick={() => setFormData(prev => ({ ...prev, accountType: account.id }))}
                >
                  <div style={styles.accountIcon}>{account.icon}</div>
                  <h3 style={styles.accountName}>{account.name}</h3>
                  <div style={styles.accountRate}>{account.rate}</div>
                  <p style={styles.accountDescription}>{account.description}</p>
                  <div style={styles.minDeposit}>Min. Deposit: ${account.minDeposit}</div>
                  <ul style={styles.featuresList}>
                    {account.features.map((feature, index) => (
                      <li key={index} style={styles.featureItem}>
                        <span style={styles.checkmark}>✓</span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {formData.accountType && (
              <div style={styles.depositSection}>
                <label style={styles.label}>Initial Deposit Amount *</label>
                <input
                  type="number"
                  name="initialDeposit"
                  value={formData.initialDeposit}
                  onChange={handleInputChange}
                  style={styles.input}
                  placeholder="$0"
                  required
                />
              </div>
            )}
          </div>
        );

      case 5:
        return (
          <div style={styles.stepContent}>
            <h2 style={styles.stepTitle}>Terms & Verification</h2>
            <div style={styles.termsSection}>
              <div style={styles.checkboxGroup}>
                <input
                  type="checkbox"
                  id="terms"
                  name="termsAccepted"
                  checked={formData.termsAccepted}
                  onChange={handleInputChange}
                  style={styles.checkbox}
                  required
                />
                <label htmlFor="terms" style={styles.checkboxLabel}>
                  I agree to the <Link href="/terms" style={styles.link}>Terms of Service</Link> and 
                  <Link href="/disclosures" style={styles.link}> Account Disclosures</Link>
                </label>
              </div>

              <div style={styles.checkboxGroup}>
                <input
                  type="checkbox"
                  id="privacy"
                  name="privacyAccepted"
                  checked={formData.privacyAccepted}
                  onChange={handleInputChange}
                  style={styles.checkbox}
                  required
                />
                <label htmlFor="privacy" style={styles.checkboxLabel}>
                  I agree to the <Link href="/privacy" style={styles.link}>Privacy Policy</Link>
                </label>
              </div>
            </div>

            <div style={styles.summarySection}>
              <h3 style={styles.summaryTitle}>Application Summary</h3>
              <div style={styles.summaryGrid}>
                <div style={styles.summaryItem}>
                  <strong>Name:</strong> {formData.firstName} {formData.lastName}
                </div>
                <div style={styles.summaryItem}>
                  <strong>Email:</strong> {formData.email}
                </div>
                <div style={styles.summaryItem}>
                  <strong>Account Type:</strong> {accountTypes.find(a => a.id === formData.accountType)?.name}
                </div>
                <div style={styles.summaryItem}>
                  <strong>Initial Deposit:</strong> ${formData.initialDeposit}
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div style={styles.pageContainer}>
      {/* Header */}
      <header style={styles.header}>
        <div style={styles.headerContainer}>
          <Link href="/" style={styles.logoSection}>
            <img src="/images/logo-primary.png.jpg" alt="Oakline Bank" style={styles.logo} />
            <div>
              <div style={styles.bankName}>Oakline Bank</div>
              <div style={styles.bankTagline}>Your Financial Partner</div>
            </div>
          </Link>

          <div style={styles.headerActions}>
            {user ? (
              <Link href="/dashboard" style={styles.dashboardLink}>
                <span style={styles.buttonIcon}>📊</span>
                Dashboard
              </Link>
            ) : (
              <Link href="/login" style={styles.loginLink}>
                Sign In
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main style={styles.main}>
        <div style={styles.container}>
          {/* Progress Indicator */}
          <div style={styles.progressContainer}>
            <div style={styles.progressHeader}>
              <h1 style={styles.mainTitle}>Open Your Oakline Bank Account</h1>
              <p style={styles.mainSubtitle}>Step {currentStep} of 5</p>
            </div>

            <div style={styles.progressBar}>
              {[1, 2, 3, 4, 5].map((step) => (
                <div
                  key={step}
                  style={{
                    ...styles.progressStep,
                    ...(step <= currentStep ? styles.progressStepActive : {})
                  }}
                >
                  <div style={styles.stepNumber}>{step}</div>
                  <div style={styles.stepLabel}>
                    {step === 1 && 'Personal'}
                    {step === 2 && 'Address'}
                    {step === 3 && 'Employment'}
                    {step === 4 && 'Account'}
                    {step === 5 && 'Review'}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Form Content */}
          <div style={styles.formContainer}>
            <form onSubmit={currentStep === 5 ? handleSubmit : (e) => e.preventDefault()}>
              {renderStep()}

              {/* Navigation Buttons */}
              <div style={styles.buttonContainer}>
                {currentStep > 1 && (
                  <button
                    type="button"
                    onClick={handlePrevious}
                    style={styles.secondaryButton}
                  >
                    Previous
                  </button>
                )}

                {currentStep < 5 ? (
                  <button
                    type="button"
                    onClick={handleNext}
                    style={styles.primaryButton}
                    disabled={!formData.firstName || !formData.lastName || !formData.email}
                  >
                    Next Step
                  </button>
                ) : (
                  <button
                    type="submit"
                    style={{
                      ...styles.primaryButton,
                      ...(isSubmitting ? styles.buttonDisabled : {})
                    }}
                    disabled={isSubmitting || !formData.termsAccepted || !formData.privacyAccepted}
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit Application'}
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer style={styles.footer}>
        <div style={styles.footerContent}>
          <p style={styles.footerText}>
            © 2024 Oakline Bank. Member FDIC. Equal Housing Lender.
          </p>
          <div style={styles.footerLinks}>
            <Link href="/privacy" style={styles.footerLink}>Privacy</Link>
            <Link href="/terms" style={styles.footerLink}>Terms</Link>
            <Link href="/support" style={styles.footerLink}>Support</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

const styles = {
  pageContainer: {
    minHeight: '100vh',
    backgroundColor: '#f8fafc',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
  },

  // Header Styles
  header: {
    backgroundColor: '#1a365d',
    borderBottom: '3px solid #059669',
    boxShadow: '0 4px 12px rgba(26, 54, 93, 0.2)'
  },
  headerContainer: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '1rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  logoSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    textDecoration: 'none'
  },
  logo: {
    height: '40px',
    width: 'auto'
  },
  bankName: {
    fontSize: '1.4rem',
    fontWeight: '800',
    color: '#ffffff'
  },
  bankTagline: {
    fontSize: '0.75rem',
    color: '#cbd5e1'
  },
  headerActions: {
    display: 'flex',
    gap: '1rem'
  },
  dashboardLink: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.5rem 1rem',
    backgroundColor: 'white',
    color: '#1a365d',
    textDecoration: 'none',
    borderRadius: '8px',
    fontWeight: '600',
    fontSize: '0.9rem'
  },
  loginLink: {
    padding: '0.5rem 1rem',
    color: '#059669',
    textDecoration: 'none',
    borderRadius: '8px',
    fontWeight: '600',
    fontSize: '0.9rem',
    border: '2px solid #059669'
  },

  // Main Content
  main: {
    padding: '2rem 0',
    minHeight: 'calc(100vh - 200px)'
  },
  container: {
    maxWidth: '1000px',
    margin: '0 auto',
    padding: '0 1rem'
  },

  // Progress Section
  progressContainer: {
    marginBottom: '3rem'
  },
  progressHeader: {
    textAlign: 'center',
    marginBottom: '2rem'
  },
  mainTitle: {
    fontSize: '2.5rem',
    fontWeight: '900',
    color: '#1a365d',
    marginBottom: '0.5rem'
  },
  mainSubtitle: {
    fontSize: '1.1rem',
    color: '#64748b'
  },
  progressBar: {
    display: 'flex',
    justifyContent: 'center',
    gap: '2rem',
    flexWrap: 'wrap'
  },
  progressStep: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '0.5rem',
    opacity: 0.5
  },
  progressStepActive: {
    opacity: 1
  },
  stepNumber: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    backgroundColor: '#059669',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: '700'
  },
  stepLabel: {
    fontSize: '0.9rem',
    fontWeight: '600',
    color: '#64748b'
  },

  // Form Container
  formContainer: {
    backgroundColor: 'white',
    borderRadius: '20px',
    padding: '3rem',
    boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
    border: '2px solid #e2e8f0'
  },
  stepContent: {
    marginBottom: '2rem'
  },
  stepTitle: {
    fontSize: '1.8rem',
    fontWeight: '800',
    color: '#1a365d',
    marginBottom: '1.5rem',
    textAlign: 'center'
  },

  // Form Elements
  formGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '1.5rem'
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem'
  },
  label: {
    fontSize: '0.9rem',
    fontWeight: '600',
    color: '#374151'
  },
  input: {
    padding: '0.75rem',
    borderRadius: '8px',
    border: '2px solid #e2e8f0',
    fontSize: '1rem',
    transition: 'border-color 0.3s ease'
  },
  select: {
    padding: '0.75rem',
    borderRadius: '8px',
    border: '2px solid #e2e8f0',
    fontSize: '1rem',
    backgroundColor: 'white',
    transition: 'border-color 0.3s ease'
  },

  // Account Selection
  accountGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '1.5rem',
    marginBottom: '2rem'
  },
  accountCard: {
    padding: '2rem',
    border: '2px solid #e2e8f0',
    borderRadius: '16px',
    textAlign: 'center',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    backgroundColor: 'white'
  },
  accountCardSelected: {
    borderColor: '#059669',
    backgroundColor: '#f0fdf4',
    boxShadow: '0 8px 25px rgba(5, 150, 105, 0.15)'
  },
  accountIcon: {
    fontSize: '3rem',
    marginBottom: '1rem'
  },
  accountName: {
    fontSize: '1.3rem',
    fontWeight: '800',
    color: '#1a365d',
    marginBottom: '0.5rem'
  },
  accountRate: {
    fontSize: '1.1rem',
    fontWeight: '700',
    color: '#059669',
    marginBottom: '1rem'
  },
  accountDescription: {
    fontSize: '0.95rem',
    color: '#64748b',
    marginBottom: '1rem',
    lineHeight: '1.5'
  },
  minDeposit: {
    fontSize: '0.9rem',
    fontWeight: '600',
    color: '#374151',
    marginBottom: '1rem'
  },
  featuresList: {
    listStyle: 'none',
    padding: 0,
    margin: 0
  },
  featureItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    fontSize: '0.85rem',
    color: '#64748b',
    marginBottom: '0.5rem'
  },
  checkmark: {
    color: '#059669',
    fontWeight: '700'
  },
  depositSection: {
    maxWidth: '300px',
    margin: '0 auto'
  },

  // Terms Section
  termsSection: {
    marginBottom: '2rem'
  },
  checkboxGroup: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '0.75rem',
    marginBottom: '1rem'
  },
  checkbox: {
    width: '18px',
    height: '18px',
    marginTop: '2px'
  },
  checkboxLabel: {
    fontSize: '0.95rem',
    color: '#374151',
    lineHeight: '1.5'
  },
  link: {
    color: '#059669',
    textDecoration: 'none',
    fontWeight: '600'
  },

  // Summary Section
  summarySection: {
    backgroundColor: '#f8fafc',
    padding: '1.5rem',
    borderRadius: '12px',
    marginBottom: '2rem'
  },
  summaryTitle: {
    fontSize: '1.2rem',
    fontWeight: '700',
    color: '#1a365d',
    marginBottom: '1rem'
  },
  summaryGrid: {
    display: 'grid',
    gap: '0.75rem'
  },
  summaryItem: {
    fontSize: '0.95rem',
    color: '#374151'
  },

  // Buttons
  buttonContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '1rem',
    paddingTop: '2rem',
    borderTop: '2px solid #e2e8f0'
  },
  primaryButton: {
    padding: '1rem 2rem',
    backgroundColor: '#059669',
    color: 'white',
    border: 'none',
    borderRadius: '10px',
    fontSize: '1rem',
    fontWeight: '700',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 12px rgba(5, 150, 105, 0.3)'
  },
  secondaryButton: {
    padding: '1rem 2rem',
    backgroundColor: 'transparent',
    color: '#1a365d',
    border: '2px solid #1a365d',
    borderRadius: '10px',
    fontSize: '1rem',
    fontWeight: '700',
    cursor: 'pointer',
    transition: 'all 0.3s ease'
  },
  buttonDisabled: {
    opacity: 0.6,
    cursor: 'not-allowed'
  },
  buttonIcon: {
    fontSize: '1rem'
  },

  // Footer
  footer: {
    backgroundColor: '#1a365d',
    color: 'white',
    padding: '2rem 0',
    marginTop: '3rem'
  },
  footerContent: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 1rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '1rem'
  },
  footerText: {
    fontSize: '0.9rem',
    opacity: 0.8
  },
  footerLinks: {
    display: 'flex',
    gap: '2rem'
  },
  footerLink: {
    color: '#cbd5e1',
    textDecoration: 'none',
    fontSize: '0.9rem',
    transition: 'color 0.3s ease'
  },

  // Mobile Responsive
  '@media (max-width: 768px)': {
    headerContainer: {
      flexDirection: 'column',
      gap: '1rem'
    },
    mainTitle: {
      fontSize: '2rem'
    },
    formContainer: {
      padding: '2rem 1rem'
    },
    progressBar: {
      gap: '1rem'
    },
    buttonContainer: {
      flexDirection: 'column'
    },
    footerContent: {
      flexDirection: 'column',
      textAlign: 'center'
    }
  }
};