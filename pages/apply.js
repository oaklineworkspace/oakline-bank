
import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

export default function Apply() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dob: '',
    ssn: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    accountType: '',
    initialDeposit: '',
    employment: '',
    income: '',
    termsAgreed: false
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/applications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        router.push('/success?message=Application submitted successfully!');
      } else {
        alert('Failed to submit application. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting application:', error);
      alert('An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const styles = {
    container: {
      minHeight: '100vh',
      backgroundColor: '#f8f9fa',
      fontFamily: 'Arial, sans-serif'
    },
    header: {
      backgroundColor: '#0070f3',
      color: 'white',
      padding: '1rem 2rem',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    },
    logo: {
      fontSize: '24px',
      fontWeight: 'bold',
      margin: 0
    },
    main: {
      padding: '2rem',
      maxWidth: '800px',
      margin: '0 auto'
    },
    card: {
      backgroundColor: 'white',
      borderRadius: '12px',
      padding: '2rem',
      boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
      marginBottom: '2rem'
    },
    stepIndicator: {
      display: 'flex',
      justifyContent: 'center',
      marginBottom: '2rem',
      gap: '1rem'
    },
    step: {
      width: '40px',
      height: '40px',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontWeight: 'bold',
      color: 'white',
      fontSize: '16px'
    },
    stepActive: {
      backgroundColor: '#0070f3'
    },
    stepCompleted: {
      backgroundColor: '#28a745'
    },
    stepPending: {
      backgroundColor: '#dee2e6',
      color: '#6c757d'
    },
    stepTitle: {
      textAlign: 'center',
      fontSize: '24px',
      fontWeight: 'bold',
      color: '#333',
      marginBottom: '1.5rem'
    },
    form: {
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem'
    },
    formRow: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '1rem',
      '@media (max-width: 768px)': {
        gridTemplateColumns: '1fr'
      }
    },
    formGroup: {
      display: 'flex',
      flexDirection: 'column',
      gap: '0.5rem'
    },
    label: {
      fontWeight: '500',
      color: '#333',
      fontSize: '14px'
    },
    input: {
      padding: '12px',
      border: '2px solid #e1e5e9',
      borderRadius: '8px',
      fontSize: '16px',
      transition: 'border-color 0.3s',
      outline: 'none'
    },
    inputFocus: {
      borderColor: '#0070f3'
    },
    select: {
      padding: '12px',
      border: '2px solid #e1e5e9',
      borderRadius: '8px',
      fontSize: '16px',
      backgroundColor: 'white',
      cursor: 'pointer'
    },
    accountTypeGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
      gap: '1rem',
      marginTop: '1rem'
    },
    accountTypeCard: {
      border: '2px solid #e1e5e9',
      borderRadius: '12px',
      padding: '1.5rem',
      cursor: 'pointer',
      transition: 'all 0.3s',
      textAlign: 'center'
    },
    accountTypeCardSelected: {
      borderColor: '#0070f3',
      backgroundColor: '#f0f7ff'
    },
    accountTypeIcon: {
      fontSize: '32px',
      marginBottom: '0.5rem'
    },
    accountTypeTitle: {
      fontSize: '18px',
      fontWeight: 'bold',
      color: '#333',
      marginBottom: '0.5rem'
    },
    accountTypeDesc: {
      fontSize: '14px',
      color: '#666'
    },
    checkboxGroup: {
      display: 'flex',
      alignItems: 'flex-start',
      gap: '0.5rem',
      padding: '1rem',
      backgroundColor: '#f8f9fa',
      borderRadius: '8px',
      border: '1px solid #e1e5e9'
    },
    checkbox: {
      marginTop: '2px'
    },
    checkboxLabel: {
      fontSize: '14px',
      lineHeight: '1.4',
      color: '#333'
    },
    buttonGroup: {
      display: 'flex',
      justifyContent: 'space-between',
      marginTop: '2rem',
      gap: '1rem'
    },
    button: {
      padding: '12px 24px',
      borderRadius: '8px',
      fontSize: '16px',
      fontWeight: '500',
      cursor: 'pointer',
      transition: 'all 0.3s',
      border: 'none'
    },
    buttonPrimary: {
      backgroundColor: '#0070f3',
      color: 'white'
    },
    buttonSecondary: {
      backgroundColor: 'transparent',
      color: '#0070f3',
      border: '2px solid #0070f3'
    },
    buttonDisabled: {
      backgroundColor: '#dee2e6',
      color: '#6c757d',
      cursor: 'not-allowed'
    },
    backLink: {
      color: '#0070f3',
      textDecoration: 'none',
      fontSize: '14px',
      display: 'inline-flex',
      alignItems: 'center',
      gap: '0.5rem',
      marginTop: '1rem'
    }
  };

  const accountTypes = [
    {
      id: 'checking',
      title: 'Checking Account',
      icon: '💳',
      description: 'Perfect for everyday banking with no monthly fees'
    },
    {
      id: 'savings',
      title: 'Savings Account',
      icon: '💰',
      description: 'Earn competitive interest on your savings'
    },
    {
      id: 'premium',
      title: 'Premium Account',
      icon: '⭐',
      description: 'Premium benefits with priority customer service'
    },
    {
      id: 'business',
      title: 'Business Account',
      icon: '🏢',
      description: 'Tailored solutions for your business needs'
    }
  ];

  const renderStepIndicator = () => (
    <div style={styles.stepIndicator}>
      {[1, 2, 3].map(step => (
        <div
          key={step}
          style={{
            ...styles.step,
            ...(step < currentStep ? styles.stepCompleted : 
                step === currentStep ? styles.stepActive : styles.stepPending)
          }}
        >
          {step}
        </div>
      ))}
    </div>
  );

  const renderStep1 = () => (
    <div>
      <h2 style={styles.stepTitle}>Personal Information</h2>
      <form style={styles.form}>
        <div style={styles.formRow}>
          <div style={styles.formGroup}>
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
          <div style={styles.formGroup}>
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
        </div>

        <div style={styles.formRow}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Email *</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              style={styles.input}
              required
            />
          </div>
          <div style={styles.formGroup}>
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
        </div>

        <div style={styles.formRow}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Date of Birth *</label>
            <input
              type="date"
              name="dob"
              value={formData.dob}
              onChange={handleInputChange}
              style={styles.input}
              required
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Social Security Number *</label>
            <input
              type="text"
              name="ssn"
              value={formData.ssn}
              onChange={handleInputChange}
              style={styles.input}
              placeholder="XXX-XX-XXXX"
              required
            />
          </div>
        </div>

        <div style={styles.formGroup}>
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

        <div style={styles.formRow}>
          <div style={styles.formGroup}>
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
          <div style={styles.formGroup}>
            <label style={styles.label}>State *</label>
            <select
              name="state"
              value={formData.state}
              onChange={handleInputChange}
              style={styles.select}
              required
            >
              <option value="">Select State</option>
              <option value="AL">Alabama</option>
              <option value="CA">California</option>
              <option value="FL">Florida</option>
              <option value="NY">New York</option>
              <option value="TX">Texas</option>
            </select>
          </div>
          <div style={styles.formGroup}>
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
      </form>
    </div>
  );

  const renderStep2 = () => (
    <div>
      <h2 style={styles.stepTitle}>Account Selection</h2>
      <div style={styles.accountTypeGrid}>
        {accountTypes.map(type => (
          <div
            key={type.id}
            style={{
              ...styles.accountTypeCard,
              ...(formData.accountType === type.id ? styles.accountTypeCardSelected : {})
            }}
            onClick={() => setFormData(prev => ({...prev, accountType: type.id}))}
          >
            <div style={styles.accountTypeIcon}>{type.icon}</div>
            <div style={styles.accountTypeTitle}>{type.title}</div>
            <div style={styles.accountTypeDesc}>{type.description}</div>
          </div>
        ))}
      </div>

      <div style={{...styles.formGroup, marginTop: '2rem'}}>
        <label style={styles.label}>Initial Deposit Amount *</label>
        <select
          name="initialDeposit"
          value={formData.initialDeposit}
          onChange={handleInputChange}
          style={styles.select}
          required
        >
          <option value="">Select Amount</option>
          <option value="100">$100 - $499</option>
          <option value="500">$500 - $999</option>
          <option value="1000">$1,000 - $4,999</option>
          <option value="5000">$5,000+</option>
        </select>
      </div>

      <div style={styles.formRow}>
        <div style={styles.formGroup}>
          <label style={styles.label}>Employment Status *</label>
          <select
            name="employment"
            value={formData.employment}
            onChange={handleInputChange}
            style={styles.select}
            required
          >
            <option value="">Select Status</option>
            <option value="employed">Employed Full-time</option>
            <option value="parttime">Employed Part-time</option>
            <option value="selfemployed">Self-employed</option>
            <option value="student">Student</option>
            <option value="retired">Retired</option>
            <option value="unemployed">Unemployed</option>
          </select>
        </div>
        <div style={styles.formGroup}>
          <label style={styles.label}>Annual Income *</label>
          <select
            name="income"
            value={formData.income}
            onChange={handleInputChange}
            style={styles.select}
            required
          >
            <option value="">Select Range</option>
            <option value="under25k">Under $25,000</option>
            <option value="25k-50k">$25,000 - $50,000</option>
            <option value="50k-75k">$50,000 - $75,000</option>
            <option value="75k-100k">$75,000 - $100,000</option>
            <option value="over100k">Over $100,000</option>
          </select>
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div>
      <h2 style={styles.stepTitle}>Review & Submit</h2>
      
      <div style={{backgroundColor: '#f8f9fa', padding: '1.5rem', borderRadius: '8px', marginBottom: '2rem'}}>
        <h3 style={{margin: '0 0 1rem 0', color: '#333'}}>Application Summary</h3>
        <div style={{display: 'grid', gap: '0.5rem', fontSize: '14px'}}>
          <div><strong>Name:</strong> {formData.firstName} {formData.lastName}</div>
          <div><strong>Email:</strong> {formData.email}</div>
          <div><strong>Phone:</strong> {formData.phone}</div>
          <div><strong>Account Type:</strong> {accountTypes.find(t => t.id === formData.accountType)?.title || 'Not selected'}</div>
          <div><strong>Initial Deposit:</strong> {formData.initialDeposit ? `$${formData.initialDeposit}+` : 'Not selected'}</div>
        </div>
      </div>

      <div style={styles.checkboxGroup}>
        <input
          type="checkbox"
          id="terms"
          name="termsAgreed"
          checked={formData.termsAgreed}
          onChange={handleInputChange}
          style={styles.checkbox}
          required
        />
        <label htmlFor="terms" style={styles.checkboxLabel}>
          I agree to the <Link href="/terms" style={{color: '#0070f3'}}>Terms of Service</Link> and <Link href="/privacy" style={{color: '#0070f3'}}>Privacy Policy</Link>. 
          I understand that my application will be reviewed and I will receive an email confirmation once processed.
        </label>
      </div>
    </div>
  );

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.logo}>🏦 Oakline Bank</h1>
        <Link href="/login" style={{color: 'white', textDecoration: 'none'}}>
          Sign In
        </Link>
      </header>

      <main style={styles.main}>
        <div style={styles.card}>
          {renderStepIndicator()}
          
          {currentStep === 1 && renderStep1()}
          {currentStep === 2 && renderStep2()}
          {currentStep === 3 && renderStep3()}

          <div style={styles.buttonGroup}>
            {currentStep > 1 && (
              <button
                type="button"
                onClick={handleBack}
                style={{...styles.button, ...styles.buttonSecondary}}
              >
                Back
              </button>
            )}
            
            <div style={{flex: 1}}></div>

            {currentStep < 3 ? (
              <button
                type="button"
                onClick={handleNext}
                style={{...styles.button, ...styles.buttonPrimary}}
              >
                Next
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={!formData.termsAgreed || isSubmitting}
                style={{
                  ...styles.button,
                  ...(formData.termsAgreed && !isSubmitting ? styles.buttonPrimary : styles.buttonDisabled)
                }}
              >
                {isSubmitting ? 'Submitting...' : 'Submit Application'}
              </button>
            )}
          </div>
        </div>

        <div style={{textAlign: 'center'}}>
          <Link href="/" style={styles.backLink}>
            ← Back to Home
          </Link>
        </div>
      </main>
    </div>
  );
}
