
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { supabase } from '../lib/supabaseClient';

const ACCOUNT_TYPES = [
  { id: 1, name: 'Checking Account', description: 'Perfect for everyday banking needs', icon: '💳', rate: '0.01% APY' },
  { id: 2, name: 'Savings Account', description: 'Grow your money with competitive rates', icon: '💰', rate: '4.50% APY' },
  { id: 3, name: 'Business Checking', description: 'Designed for business operations', icon: '🏢', rate: '0.01% APY' },
  { id: 4, name: 'Business Savings', description: 'Business savings with higher yields', icon: '🏦', rate: '4.25% APY' },
  { id: 5, name: 'Student Checking', description: 'No-fee checking for students', icon: '🎓', rate: '0.01% APY' },
  { id: 6, name: 'Money Market Account', description: 'Premium savings with higher yields', icon: '📈', rate: '4.75% APY' },
  { id: 7, name: 'Certificate of Deposit (CD)', description: 'Secure your future with fixed rates', icon: '🔒', rate: '5.25% APY' },
  { id: 8, name: 'Retirement Account (IRA)', description: 'Plan for your retirement', icon: '🏖️', rate: '4.80% APY' },
  { id: 9, name: 'Joint Checking Account', description: 'Shared checking for couples', icon: '👫', rate: '0.01% APY' },
  { id: 10, name: 'Trust Account', description: 'Manage assets for beneficiaries', icon: '🛡️', rate: '3.50% APY' },
  { id: 11, name: 'Investment Brokerage Account', description: 'Trade stocks, bonds, and more', icon: '📊', rate: 'Variable' },
  { id: 12, name: 'High-Yield Savings Account', description: 'Maximum earning potential', icon: '💎', rate: '5.00% APY' },
  { id: 13, name: 'International Checking', description: 'Banking without borders', icon: '🌍', rate: '0.01% APY' },
  { id: 14, name: 'Foreign Currency Account', description: 'Hold multiple currencies', icon: '💱', rate: 'Variable' },
  { id: 15, name: 'Cryptocurrency Wallet', description: 'Digital asset storage', icon: '₿', rate: 'Variable' },
  { id: 16, name: 'Loan Repayment Account', description: 'Streamline your loan payments', icon: '💳', rate: 'N/A' },
  { id: 17, name: 'Mortgage Account', description: 'Home financing solutions', icon: '🏠', rate: 'Variable' },
  { id: 18, name: 'Auto Loan Account', description: 'Vehicle financing made easy', icon: '🚗', rate: 'Variable' },
  { id: 19, name: 'Credit Card Account', description: 'Flexible spending power', icon: '💳', rate: 'Variable APR' },
  { id: 20, name: 'Prepaid Card Account', description: 'Controlled spending solution', icon: '🎫', rate: 'N/A' },
  { id: 21, name: 'Payroll Account', description: 'Direct deposit convenience', icon: '💼', rate: '0.01% APY' },
  { id: 22, name: 'Nonprofit/Charity Account', description: 'Special rates for nonprofits', icon: '❤️', rate: '2.50% APY' },
  { id: 23, name: 'Escrow Account', description: 'Secure transaction holding', icon: '🔐', rate: '1.50% APY' },
];

const COUNTRIES = [
  { code: 'US', name: 'United States' },
  { code: 'CA', name: 'Canada' },
  { code: 'GB', name: 'United Kingdom' },
  { code: 'AU', name: 'Australia' },
  { code: 'DE', name: 'Germany' },
  { code: 'FR', name: 'France' },
  { code: 'IT', name: 'Italy' },
  { code: 'ES', name: 'Spain' },
  { code: 'NL', name: 'Netherlands' },
  { code: 'SE', name: 'Sweden' },
  { code: 'NO', name: 'Norway' },
  { code: 'DK', name: 'Denmark' },
  { code: 'FI', name: 'Finland' },
  { code: 'IE', name: 'Ireland' },
  { code: 'NZ', name: 'New Zealand' },
  { code: 'JP', name: 'Japan' },
  { code: 'KR', name: 'South Korea' },
  { code: 'CN', name: 'China' },
  { code: 'IN', name: 'India' },
  { code: 'BR', name: 'Brazil' },
  { code: 'MX', name: 'Mexico' },
  { code: 'ZA', name: 'South Africa' },
  { code: 'NG', name: 'Nigeria' },
  { code: 'EG', name: 'Egypt' },
  { code: 'KE', name: 'Kenya' },
  { code: 'SA', name: 'Saudi Arabia' },
  { code: 'AE', name: 'UAE' },
  { code: 'RU', name: 'Russia' },
  { code: 'TR', name: 'Turkey' },
  { code: 'AR', name: 'Argentina' },
  { code: 'OTHER', name: 'Other / Enter Manually' }
];

const STATES_BY_COUNTRY = {
  US: [
    'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut',
    'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa',
    'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan',
    'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire',
    'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Ohio',
    'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota',
    'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia',
    'Wisconsin', 'Wyoming'
  ],
  CA: [
    'Alberta', 'British Columbia', 'Manitoba', 'New Brunswick', 'Newfoundland and Labrador',
    'Northwest Territories', 'Nova Scotia', 'Nunavut', 'Ontario', 'Prince Edward Island',
    'Quebec', 'Saskatchewan', 'Yukon'
  ],
  AU: [
    'Australian Capital Territory', 'New South Wales', 'Northern Territory', 'Queensland',
    'South Australia', 'Tasmania', 'Victoria', 'Western Australia'
  ],
  IN: [
    'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa', 'Gujarat',
    'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh',
    'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
    'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh',
    'Uttarakhand', 'West Bengal'
  ],
  BR: [
    'Acre', 'Alagoas', 'Amapá', 'Amazonas', 'Bahia', 'Ceará', 'Distrito Federal', 'Espírito Santo',
    'Goiás', 'Maranhão', 'Mato Grosso', 'Mato Grosso do Sul', 'Minas Gerais', 'Pará', 'Paraíba',
    'Paraná', 'Pernambuco', 'Piauí', 'Rio de Janeiro', 'Rio Grande do Norte', 'Rio Grande do Sul',
    'Rondônia', 'Roraima', 'Santa Catarina', 'São Paulo', 'Sergipe', 'Tocantins'
  ]
};

const MAJOR_CITIES_BY_STATE = {
  'California': ['Los Angeles', 'San Francisco', 'San Diego', 'Sacramento', 'San Jose', 'Fresno'],
  'New York': ['New York City', 'Buffalo', 'Rochester', 'Syracuse', 'Albany', 'Yonkers'],
  'Texas': ['Houston', 'Dallas', 'Austin', 'San Antonio', 'Fort Worth', 'El Paso'],
  'Florida': ['Miami', 'Orlando', 'Tampa', 'Jacksonville', 'Fort Lauderdale', 'Tallahassee'],
  'Illinois': ['Chicago', 'Springfield', 'Rockford', 'Peoria', 'Elgin', 'Waukegan'],
  'Ontario': ['Toronto', 'Ottawa', 'Hamilton', 'London', 'Mississauga', 'Windsor'],
  'British Columbia': ['Vancouver', 'Victoria', 'Surrey', 'Burnaby', 'Richmond', 'Abbotsford']
};

export default function Apply() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [showManualCountry, setShowManualCountry] = useState(false);
  const [showManualState, setShowManualState] = useState(false);
  const [showManualCity, setShowManualCity] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const [formData, setFormData] = useState({
    firstName: '',
    middleName: '',
    lastName: '',
    mothersMaidenName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    ssn: '',
    idNumber: '',
    country: 'US',
    manualCountry: '',
    address: '',
    city: '',
    manualCity: '',
    state: '',
    manualState: '',
    zipCode: '',
    accountTypes: [],
    employmentStatus: '',
    annualIncome: '',
    agreeToTerms: false
  });

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePhone = (phone) => /^[\d\s\-\(\)]{10,}$/.test(phone);

  const getEffectiveCountry = () => {
    return formData.country === 'OTHER' ? formData.manualCountry : formData.country;
  };

  const getEffectiveState = () => {
    return showManualState ? formData.manualState : formData.state;
  };

  const getEffectiveCity = () => {
    return showManualCity ? formData.manualCity : formData.city;
  };

  const getAvailableStates = () => {
    const country = getEffectiveCountry();
    return STATES_BY_COUNTRY[country] || [];
  };

  const getAvailableCities = () => {
    const state = getEffectiveState();
    return MAJOR_CITIES_BY_STATE[state] || [];
  };

  const shouldShowManualState = () => {
    const country = getEffectiveCountry();
    return !STATES_BY_COUNTRY[country] || showManualState;
  };

  const shouldShowManualCity = () => {
    const state = getEffectiveState();
    return !MAJOR_CITIES_BY_STATE[state] || showManualCity;
  };

  const validateStep = (step) => {
    const newErrors = {};

    if (step === 1) {
      if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
      if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
      if (!formData.email.trim()) {
        newErrors.email = 'Email is required';
      } else if (!validateEmail(formData.email)) {
        newErrors.email = 'Invalid email format';
      }
      if (!formData.phone.trim()) {
        newErrors.phone = 'Phone number is required';
      } else if (!validatePhone(formData.phone)) {
        newErrors.phone = 'Invalid phone number';
      }
      if (!formData.dateOfBirth) newErrors.dateOfBirth = 'Date of birth is required';
      
      if (!getEffectiveCountry()) newErrors.country = 'Country is required';
      
      if (getEffectiveCountry() === 'US') {
        if (!formData.ssn.trim()) newErrors.ssn = 'SSN is required';
      } else {
        if (!formData.idNumber.trim()) newErrors.idNumber = 'Government ID Number is required';
      }
    }

    if (step === 2) {
      if (!formData.address.trim()) newErrors.address = 'Address is required';
      if (!getEffectiveCity()) newErrors.city = 'City is required';
      if (!getEffectiveState()) newErrors.state = 'State/Province is required';
      if (!formData.zipCode.trim()) newErrors.zipCode = 'ZIP/Postal code is required';
    }

    if (step === 3) {
      if (formData.accountTypes.length === 0) newErrors.accountTypes = 'Select at least one account type';
      if (!formData.employmentStatus) newErrors.employmentStatus = 'Employment status is required';
      if (!formData.annualIncome) newErrors.annualIncome = 'Annual income is required';
      if (!formData.agreeToTerms) newErrors.agreeToTerms = 'You must agree to terms';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    setFormData(prev => {
      const newData = {
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      };

      // Handle country change
      if (name === 'country') {
        setShowManualCountry(value === 'OTHER');
        if (value !== 'OTHER') {
          newData.manualCountry = '';
        }
        // Reset state and city when country changes
        newData.state = '';
        newData.manualState = '';
        newData.city = '';
        newData.manualCity = '';
        setShowManualState(false);
        setShowManualCity(false);
      }

      // Handle state change
      if (name === 'state') {
        // Reset city when state changes
        newData.city = '';
        newData.manualCity = '';
        setShowManualCity(false);
      }

      return newData;
    });

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const toggleAccountType = (accountId) => {
    setFormData(prev => {
      const selected = prev.accountTypes.includes(accountId)
        ? prev.accountTypes.filter(id => id !== accountId)
        : [...prev.accountTypes, accountId];
      return { ...prev, accountTypes: selected };
    });

    if (errors.accountTypes) {
      setErrors(prev => ({ ...prev, accountTypes: '' }));
    }
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    setCurrentStep(prev => prev - 1);
  };

  const handleSubmit = async () => {
    if (!validateStep(3)) return;

    setLoading(true);
    setErrors({});

    try {
      const effectiveCountry = getEffectiveCountry();
      const effectiveState = getEffectiveState();
      const effectiveCity = getEffectiveCity();

      // Insert application data
      const { data: applicationData, error: applicationError } = await supabase
        .from('applications')
        .insert([{
          first_name: formData.firstName.trim(),
          last_name: formData.lastName.trim(),
          email: formData.email.trim().toLowerCase(),
          phone: formData.phone.trim(),
          date_of_birth: formData.dateOfBirth,
          country: effectiveCountry,
          ssn: effectiveCountry === 'US' ? formData.ssn.trim() : null,
          id_number: effectiveCountry !== 'US' ? formData.idNumber.trim() : null,
          address: formData.address.trim(),
          city: effectiveCity,
          state: effectiveState,
          zip_code: formData.zipCode.trim(),
          employment_status: formData.employmentStatus,
          annual_income: formData.annualIncome,
          account_types: formData.accountTypes.map(id => ACCOUNT_TYPES.find(at => at.id === id)?.name),
          agree_to_terms: formData.agreeToTerms
        }])
        .select()
        .single();

      if (applicationError) throw applicationError;

      const applicationId = applicationData.id;

      // Create accounts for each selected account type
      const accountNumbers = [];
      const accountTypes = [];
      
      for (const accountTypeId of formData.accountTypes) {
        const accountType = ACCOUNT_TYPES.find(at => at.id === accountTypeId);
        const accountNumber = `${Date.now()}${Math.random().toString().slice(2, 8)}`;
        
        const { error: accountError } = await supabase
          .from('accounts')
          .insert([{
            application_id: applicationId,
            account_number: accountNumber,
            account_type: accountType.name,
            balance: 0.00
          }]);

        if (accountError) {
          console.error('Account creation error:', accountError);
        } else {
          accountNumbers.push(accountNumber);
          accountTypes.push(accountType.name);
        }
      }

      // Send welcome email with enrollment link
      try {
        const emailResponse = await fetch('/api/send-welcome-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: formData.email.trim().toLowerCase(),
            first_name: formData.firstName.trim(),
            last_name: formData.lastName.trim(),
            account_numbers: accountNumbers,
            account_types: accountTypes,
            application_id: applicationId
          })
        });

        if (!emailResponse.ok) {
          throw new Error('Failed to send welcome email');
        }

        console.log('Welcome email sent successfully');
      } catch (emailError) {
        console.error('Email sending failed:', emailError);
        // Don't fail the entire process for email issues
      }

      // Show success message
      setSubmitSuccess(true);

      // Redirect to success page after a delay
      setTimeout(() => {
        router.push('/dashboard');
      }, 3000);

    } catch (error) {
      console.error('Application submission error:', error);
      setErrors({ submit: 'Failed to submit application. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const styles = {
    container: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Inter", Roboto, Oxygen, Ubuntu, Cantarell, sans-serif',
      padding: '2rem 1rem',
      position: 'relative',
      overflow: 'hidden'
    },
    backgroundPattern: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      opacity: 0.03,
      backgroundImage: 'radial-gradient(circle at 25% 25%, #1e40af 0%, transparent 50%), radial-gradient(circle at 75% 75%, #059669 0%, transparent 50%)',
      zIndex: 0
    },
    content: {
      maxWidth: '1000px',
      margin: '0 auto',
      position: 'relative',
      zIndex: 1
    },
    header: {
      textAlign: 'center',
      marginBottom: '3rem',
      animation: 'fadeInUp 0.8s ease'
    },
    logoContainer: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: '1.5rem'
    },
    logo: {
      height: '60px',
      width: 'auto',
      marginRight: '15px'
    },
    brandText: {
      fontSize: '2rem',
      fontWeight: '700',
      background: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text'
    },
    title: {
      fontSize: 'clamp(28px, 5vw, 42px)',
      fontWeight: '700',
      color: '#1e293b',
      marginBottom: '1rem',
      lineHeight: 1.2
    },
    subtitle: {
      fontSize: '18px',
      color: '#64748b',
      fontWeight: '500',
      maxWidth: '600px',
      margin: '0 auto'
    },
    progressContainer: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: '3rem',
      gap: '1rem'
    },
    progressStep: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '50px',
      height: '50px',
      borderRadius: '50%',
      fontSize: '16px',
      fontWeight: '600',
      transition: 'all 0.3s ease',
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
    },
    progressStepActive: {
      background: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)',
      color: 'white',
      transform: 'scale(1.1)'
    },
    progressStepCompleted: {
      background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
      color: 'white'
    },
    progressStepPending: {
      background: '#e2e8f0',
      color: '#64748b'
    },
    progressLine: {
      height: '3px',
      width: '60px',
      borderRadius: '2px',
      transition: 'all 0.3s ease'
    },
    progressLineCompleted: {
      background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)'
    },
    progressLinePending: {
      background: '#e2e8f0'
    },
    formCard: {
      background: 'white',
      borderRadius: '24px',
      padding: '3rem',
      boxShadow: '0 20px 60px rgba(0,0,0,0.08)',
      border: '1px solid #e2e8f0',
      marginBottom: '2rem',
      animation: 'fadeInUp 0.6s ease'
    },
    sectionTitle: {
      fontSize: '24px',
      fontWeight: '700',
      color: '#1e293b',
      marginBottom: '2rem',
      textAlign: 'center',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '10px'
    },
    formGrid: {
      display: 'grid',
      gap: '1.5rem'
    },
    gridCols2: {
      gridTemplateColumns: 'repeat(2, 1fr)'
    },
    gridCols3: {
      gridTemplateColumns: 'repeat(3, 1fr)'
    },
    inputGroup: {
      display: 'flex',
      flexDirection: 'column',
      gap: '8px'
    },
    label: {
      fontSize: '14px',
      fontWeight: '600',
      color: '#374151',
      display: 'flex',
      alignItems: 'center',
      gap: '5px'
    },
    required: {
      color: '#ef4444'
    },
    input: {
      width: '100%',
      padding: '14px 16px',
      border: '2px solid #e5e7eb',
      borderRadius: '12px',
      fontSize: '16px',
      fontWeight: '500',
      transition: 'all 0.3s ease',
      backgroundColor: '#ffffff',
      fontFamily: 'inherit'
    },
    inputFocus: {
      outline: 'none',
      borderColor: '#3b82f6',
      boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.1)'
    },
    inputError: {
      borderColor: '#ef4444',
      backgroundColor: '#fef2f2'
    },
    select: {
      width: '100%',
      padding: '14px 16px',
      border: '2px solid #e5e7eb',
      borderRadius: '12px',
      fontSize: '16px',
      fontWeight: '500',
      backgroundColor: '#ffffff',
      cursor: 'pointer',
      transition: 'all 0.3s ease'
    },
    errorMessage: {
      color: '#ef4444',
      fontSize: '13px',
      fontWeight: '500',
      marginTop: '4px',
      display: 'flex',
      alignItems: 'center',
      gap: '4px'
    },
    toggleButton: {
      fontSize: '12px',
      color: '#3b82f6',
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      textDecoration: 'underline',
      padding: '4px 0'
    },
    accountTypesGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
      gap: '1rem',
      marginTop: '1rem'
    },
    accountCard: {
      border: '2px solid #e5e7eb',
      borderRadius: '16px',
      padding: '1.5rem',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      backgroundColor: 'white',
      position: 'relative',
      overflow: 'hidden'
    },
    accountCardSelected: {
      borderColor: '#3b82f6',
      backgroundColor: '#eff6ff',
      transform: 'translateY(-2px)',
      boxShadow: '0 8px 25px rgba(59, 130, 246, 0.15)'
    },
    accountCardHover: {
      borderColor: '#9ca3af',
      transform: 'translateY(-1px)',
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
    },
    accountHeader: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      marginBottom: '8px'
    },
    accountIcon: {
      fontSize: '24px',
      padding: '8px',
      borderRadius: '10px',
      backgroundColor: '#f1f5f9'
    },
    accountName: {
      fontSize: '16px',
      fontWeight: '600',
      color: '#1e293b'
    },
    accountDescription: {
      fontSize: '14px',
      color: '#64748b',
      marginBottom: '12px',
      lineHeight: 1.5
    },
    accountRate: {
      fontSize: '14px',
      fontWeight: '600',
      color: '#059669',
      backgroundColor: '#ecfdf5',
      padding: '4px 8px',
      borderRadius: '6px',
      display: 'inline-block'
    },
    checkboxContainer: {
      display: 'flex',
      alignItems: 'flex-start',
      gap: '12px',
      padding: '1.5rem',
      backgroundColor: '#f8fafc',
      borderRadius: '12px',
      border: '2px solid #e2e8f0',
      marginTop: '1.5rem'
    },
    checkbox: {
      width: '20px',
      height: '20px',
      marginTop: '2px',
      cursor: 'pointer',
      accentColor: '#059669',
      transform: 'scale(1.2)',
      backgroundColor: 'transparent',
      border: 'none',
      outline: 'none'
    },
    checkboxLabel: {
      fontSize: '15px',
      color: '#374151',
      lineHeight: 1.6,
      cursor: 'pointer',
      fontWeight: '500',
      flex: 1,
      userSelect: 'none',
      paddingTop: '1px'
    },
    link: {
      color: '#3b82f6',
      textDecoration: 'none',
      fontWeight: '600'
    },
    buttonContainer: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: '3rem',
      gap: '1rem'
    },
    button: {
      padding: '14px 28px',
      borderRadius: '12px',
      fontSize: '16px',
      fontWeight: '600',
      border: 'none',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      minHeight: '52px'
    },
    primaryButton: {
      background: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)',
      color: 'white',
      boxShadow: '0 4px 14px rgba(30, 64, 175, 0.3)'
    },
    secondaryButton: {
      background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
      color: 'white',
      boxShadow: '0 4px 14px rgba(5, 150, 105, 0.3)'
    },
    outlineButton: {
      background: 'transparent',
      color: '#6b7280',
      border: '2px solid #d1d5db'
    },
    buttonDisabled: {
      background: '#9ca3af',
      cursor: 'not-allowed',
      boxShadow: 'none'
    },
    errorAlert: {
      backgroundColor: '#fef2f2',
      border: '1px solid #fecaca',
      borderRadius: '12px',
      padding: '1rem',
      marginTop: '1rem'
    },
    errorAlertText: {
      color: '#dc2626',
      fontSize: '14px',
      fontWeight: '500'
    },
    successAlert: {
      backgroundColor: '#f0fdf4',
      border: '1px solid #bbf7d0',
      borderRadius: '12px',
      padding: '1.5rem',
      marginTop: '1rem',
      textAlign: 'center'
    },
    successAlertText: {
      color: '#16a34a',
      fontSize: '16px',
      fontWeight: '600',
      marginBottom: '0.5rem'
    },
    successMessage: {
      color: '#15803d',
      fontSize: '14px',
      fontWeight: '500'
    },
    footerLinks: {
      textAlign: 'center',
      marginTop: '2rem'
    },
    footerLink: {
      color: '#3b82f6',
      textDecoration: 'none',
      fontSize: '16px',
      fontWeight: '500',
      transition: 'color 0.3s ease'
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.backgroundPattern}></div>
      
      <div style={styles.content}>
        {/* Header */}
        <div style={styles.header}>
          <div style={styles.logoContainer}>
            <img 
              src="/images/logo-primary.png" 
              alt="Oakline Bank" 
              style={styles.logo}
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.marginLeft = '0';
              }}
            />
            <div style={styles.brandText}>Oakline Bank</div>
          </div>
          <h1 style={styles.title}>Open Your Account Today</h1>
          <p style={styles.subtitle}>
            Join thousands of satisfied customers and experience modern banking at its finest
          </p>
        </div>

        {/* Progress Steps */}
        <div style={styles.progressContainer}>
          {[1, 2, 3].map((step, index) => (
            <div key={step} style={{display: 'flex', alignItems: 'center'}}>
              <div style={{
                ...styles.progressStep,
                ...(step === currentStep ? styles.progressStepActive : 
                   step < currentStep ? styles.progressStepCompleted : styles.progressStepPending)
              }}>
                {step < currentStep ? '✓' : step}
              </div>
              {index < 2 && (
                <div style={{
                  ...styles.progressLine,
                  ...(step < currentStep ? styles.progressLineCompleted : styles.progressLinePending)
                }} />
              )}
            </div>
          ))}
        </div>

        {/* Form Card */}
        <div style={styles.formCard}>
          <h2 style={styles.sectionTitle}>
            {currentStep === 1 && (
              <>
                <span>👤</span> Personal Information
              </>
            )}
            {currentStep === 2 && (
              <>
                <span>🏠</span> Address Details
              </>
            )}
            {currentStep === 3 && (
              <>
                <span>💼</span> Account & Employment
              </>
            )}
          </h2>

          {/* Step 1: Personal Information */}
          {currentStep === 1 && (
            <div style={styles.formGrid}>
              <div style={{...styles.formGrid, ...styles.gridCols2}}>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>
                    First Name <span style={styles.required}>*</span>
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    style={{
                      ...styles.input,
                      ...(errors.firstName ? styles.inputError : {})
                    }}
                    placeholder="Enter your first name"
                  />
                  {errors.firstName && (
                    <div style={styles.errorMessage}>⚠️ {errors.firstName}</div>
                  )}
                </div>

                <div style={styles.inputGroup}>
                  <label style={styles.label}>Middle Name</label>
                  <input
                    type="text"
                    name="middleName"
                    value={formData.middleName}
                    onChange={handleInputChange}
                    style={styles.input}
                    placeholder="Enter your middle name"
                  />
                </div>
              </div>

              <div style={{...styles.formGrid, ...styles.gridCols2}}>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>
                    Last Name <span style={styles.required}>*</span>
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    style={{
                      ...styles.input,
                      ...(errors.lastName ? styles.inputError : {})
                    }}
                    placeholder="Enter your last name"
                  />
                  {errors.lastName && (
                    <div style={styles.errorMessage}>⚠️ {errors.lastName}</div>
                  )}
                </div>

                <div style={styles.inputGroup}>
                  <label style={styles.label}>Mother's Maiden Name</label>
                  <input
                    type="text"
                    name="mothersMaidenName"
                    value={formData.mothersMaidenName}
                    onChange={handleInputChange}
                    style={styles.input}
                    placeholder="Enter your mother's maiden name"
                  />
                </div>
              </div>

              <div style={styles.inputGroup}>
                <label style={styles.label}>
                  Email Address <span style={styles.required}>*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  style={{
                    ...styles.input,
                    ...(errors.email ? styles.inputError : {})
                  }}
                  placeholder="Enter your email address"
                />
                {errors.email && (
                  <div style={styles.errorMessage}>⚠️ {errors.email}</div>
                )}
              </div>

              <div style={{...styles.formGrid, ...styles.gridCols2}}>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>
                    Phone Number <span style={styles.required}>*</span>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    style={{
                      ...styles.input,
                      ...(errors.phone ? styles.inputError : {})
                    }}
                    placeholder="(555) 123-4567"
                  />
                  {errors.phone && (
                    <div style={styles.errorMessage}>⚠️ {errors.phone}</div>
                  )}
                </div>

                <div style={styles.inputGroup}>
                  <label style={styles.label}>
                    Date of Birth <span style={styles.required}>*</span>
                  </label>
                  <input
                    type="date"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleInputChange}
                    style={{
                      ...styles.input,
                      ...(errors.dateOfBirth ? styles.inputError : {})
                    }}
                  />
                  {errors.dateOfBirth && (
                    <div style={styles.errorMessage}>⚠️ {errors.dateOfBirth}</div>
                  )}
                </div>
              </div>

              <div style={styles.inputGroup}>
                <label style={styles.label}>
                  Country <span style={styles.required}>*</span>
                </label>
                <select
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                  style={{
                    ...styles.select,
                    ...(errors.country ? styles.inputError : {})
                  }}
                >
                  {COUNTRIES.map(country => (
                    <option key={country.code} value={country.code}>
                      {country.name}
                    </option>
                  ))}
                </select>
                {showManualCountry && (
                  <input
                    type="text"
                    name="manualCountry"
                    value={formData.manualCountry}
                    onChange={handleInputChange}
                    style={styles.input}
                    placeholder="Enter your country"
                  />
                )}
                {errors.country && (
                  <div style={styles.errorMessage}>⚠️ {errors.country}</div>
                )}
              </div>

              <div style={styles.inputGroup}>
                <label style={styles.label}>
                  {getEffectiveCountry() === 'US' ? 'Social Security Number' : 'Government ID Number'} <span style={styles.required}>*</span>
                </label>
                <input
                  type="text"
                  name={getEffectiveCountry() === 'US' ? 'ssn' : 'idNumber'}
                  value={getEffectiveCountry() === 'US' ? formData.ssn : formData.idNumber}
                  onChange={handleInputChange}
                  style={{
                    ...styles.input,
                    ...((getEffectiveCountry() === 'US' ? errors.ssn : errors.idNumber) ? styles.inputError : {})
                  }}
                  placeholder={getEffectiveCountry() === 'US' ? 'XXX-XX-XXXX' : 'Enter your government ID number'}
                />
                {getEffectiveCountry() === 'US' && errors.ssn && (
                  <div style={styles.errorMessage}>⚠️ {errors.ssn}</div>
                )}
                {getEffectiveCountry() !== 'US' && errors.idNumber && (
                  <div style={styles.errorMessage}>⚠️ {errors.idNumber}</div>
                )}
              </div>
            </div>
          )}

          {/* Step 2: Address Information */}
          {currentStep === 2 && (
            <div style={styles.formGrid}>
              <div style={styles.inputGroup}>
                <label style={styles.label}>
                  Street Address <span style={styles.required}>*</span>
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  style={{
                    ...styles.input,
                    ...(errors.address ? styles.inputError : {})
                  }}
                  placeholder="123 Main Street"
                />
                {errors.address && (
                  <div style={styles.errorMessage}>⚠️ {errors.address}</div>
                )}
              </div>

              <div style={{...styles.formGrid, ...styles.gridCols3}}>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>
                    City <span style={styles.required}>*</span>
                  </label>
                  {shouldShowManualCity() ? (
                    <input
                      type="text"
                      name="manualCity"
                      value={formData.manualCity}
                      onChange={handleInputChange}
                      style={{
                        ...styles.input,
                        ...(errors.city ? styles.inputError : {})
                      }}
                      placeholder="Enter your city"
                    />
                  ) : (
                    <select
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      style={{
                        ...styles.select,
                        ...(errors.city ? styles.inputError : {})
                      }}
                    >
                      <option value="">Select City</option>
                      {getAvailableCities().map(city => (
                        <option key={city} value={city}>{city}</option>
                      ))}
                    </select>
                  )}
                  {getAvailableCities().length > 0 && (
                    <button
                      type="button"
                      onClick={() => {
                        setShowManualCity(!showManualCity);
                        setFormData(prev => ({ ...prev, city: '', manualCity: '' }));
                      }}
                      style={styles.toggleButton}
                    >
                      {showManualCity ? 'Select from list' : 'Enter manually'}
                    </button>
                  )}
                  {errors.city && (
                    <div style={styles.errorMessage}>⚠️ {errors.city}</div>
                  )}
                </div>

                <div style={styles.inputGroup}>
                  <label style={styles.label}>
                    State / Province <span style={styles.required}>*</span>
                  </label>
                  {shouldShowManualState() ? (
                    <input
                      type="text"
                      name="manualState"
                      value={formData.manualState}
                      onChange={handleInputChange}
                      style={{
                        ...styles.input,
                        ...(errors.state ? styles.inputError : {})
                      }}
                      placeholder="Enter your state/province"
                    />
                  ) : (
                    <select
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      style={{
                        ...styles.select,
                        ...(errors.state ? styles.inputError : {})
                      }}
                    >
                      <option value="">Select State/Province</option>
                      {getAvailableStates().map(state => (
                        <option key={state} value={state}>{state}</option>
                      ))}
                    </select>
                  )}
                  {getAvailableStates().length > 0 && (
                    <button
                      type="button"
                      onClick={() => {
                        setShowManualState(!showManualState);
                        setFormData(prev => ({ ...prev, state: '', manualState: '', city: '', manualCity: '' }));
                        setShowManualCity(false);
                      }}
                      style={styles.toggleButton}
                    >
                      {showManualState ? 'Select from list' : 'Enter manually'}
                    </button>
                  )}
                  {errors.state && (
                    <div style={styles.errorMessage}>⚠️ {errors.state}</div>
                  )}
                </div>

                <div style={styles.inputGroup}>
                  <label style={styles.label}>
                    ZIP / Postal Code <span style={styles.required}>*</span>
                  </label>
                  <input
                    type="text"
                    name="zipCode"
                    value={formData.zipCode}
                    onChange={handleInputChange}
                    style={{
                      ...styles.input,
                      ...(errors.zipCode ? styles.inputError : {})
                    }}
                    placeholder="12345"
                  />
                  {errors.zipCode && (
                    <div style={styles.errorMessage}>⚠️ {errors.zipCode}</div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Account & Employment */}
          {currentStep === 3 && (
            <div style={styles.formGrid}>
              <div style={styles.inputGroup}>
                <label style={styles.label}>
                  Choose Your Account Types <span style={styles.required}>*</span>
                </label>
                {errors.accountTypes && (
                  <div style={styles.errorMessage}>⚠️ {errors.accountTypes}</div>
                )}
                <div style={styles.accountTypesGrid}>
                  {ACCOUNT_TYPES.map(account => (
                    <div
                      key={account.id}
                      onClick={() => toggleAccountType(account.id)}
                      style={{
                        ...styles.accountCard,
                        ...(formData.accountTypes.includes(account.id) ? styles.accountCardSelected : {})
                      }}
                      onMouseEnter={(e) => {
                        if (!formData.accountTypes.includes(account.id)) {
                          Object.assign(e.target.style, styles.accountCardHover);
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!formData.accountTypes.includes(account.id)) {
                          e.target.style.borderColor = '#e5e7eb';
                          e.target.style.transform = 'translateY(0)';
                          e.target.style.boxShadow = 'none';
                        }
                      }}
                    >
                      <div style={styles.accountHeader}>
                        <div style={{
                          ...styles.accountIcon,
                          backgroundColor: formData.accountTypes.includes(account.id) ? '#dbeafe' : '#f1f5f9'
                        }}>
                          {account.icon}
                        </div>
                        <div style={styles.accountName}>{account.name}</div>
                      </div>
                      <div style={styles.accountDescription}>{account.description}</div>
                      <div style={styles.accountRate}>{account.rate}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{...styles.formGrid, ...styles.gridCols2}}>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>
                    Employment Status <span style={styles.required}>*</span>
                  </label>
                  <select
                    name="employmentStatus"
                    value={formData.employmentStatus}
                    onChange={handleInputChange}
                    style={{
                      ...styles.select,
                      ...(errors.employmentStatus ? styles.inputError : {})
                    }}
                  >
                    <option value="">Select Status</option>
                    <option value="employed_fulltime">Employed Full-time</option>
                    <option value="employed_parttime">Employed Part-time</option>
                    <option value="self_employed">Self-employed</option>
                    <option value="retired">Retired</option>
                    <option value="student">Student</option>
                    <option value="unemployed">Unemployed</option>
                  </select>
                  {errors.employmentStatus && (
                    <div style={styles.errorMessage}>⚠️ {errors.employmentStatus}</div>
                  )}
                </div>

                <div style={styles.inputGroup}>
                  <label style={styles.label}>
                    Annual Income <span style={styles.required}>*</span>
                  </label>
                  <select
                    name="annualIncome"
                    value={formData.annualIncome}
                    onChange={handleInputChange}
                    style={{
                      ...styles.select,
                      ...(errors.annualIncome ? styles.inputError : {})
                    }}
                  >
                    <option value="">Select Income Range</option>
                    <option value="under_25k">Under $25,000</option>
                    <option value="25k_50k">$25,000 - $50,000</option>
                    <option value="50k_75k">$50,000 - $75,000</option>
                    <option value="75k_100k">$75,000 - $100,000</option>
                    <option value="100k_150k">$100,000 - $150,000</option>
                    <option value="over_150k">Over $150,000</option>
                  </select>
                  {errors.annualIncome && (
                    <div style={styles.errorMessage}>⚠️ {errors.annualIncome}</div>
                  )}
                </div>
              </div>

              <div style={styles.checkboxContainer}>
                <input
                  type="checkbox"
                  name="agreeToTerms"
                  checked={formData.agreeToTerms}
                  onChange={handleInputChange}
                  style={styles.checkbox}
                />
                <label style={styles.checkboxLabel}>
                  I agree to the{' '}
                  <Link href="/terms" style={styles.link}>
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link href="/privacy" style={styles.link}>
                    Privacy Policy
                  </Link>{' '}
                  <span style={styles.required}>*</span>
                </label>
              </div>
              {errors.agreeToTerms && (
                <div style={styles.errorMessage}>⚠️ {errors.agreeToTerms}</div>
              )}

              {errors.submit && (
                <div style={styles.errorAlert}>
                  <div style={styles.errorAlertText}>⚠️ {errors.submit}</div>
                </div>
              )}

              {submitSuccess && (
                <div style={styles.successAlert}>
                  <div style={styles.successAlertText}>🎉 Application Submitted Successfully!</div>
                  <div style={styles.successMessage}>
                    Your account has been created and a welcome email with enrollment instructions has been sent to {formData.email}. 
                    Please check your inbox (and spam folder) for the enrollment link.
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Navigation Buttons */}
          <div style={styles.buttonContainer}>
            {currentStep > 1 && (
              <button
                onClick={handleBack}
                style={{...styles.button, ...styles.outlineButton}}
              >
                ← Back
              </button>
            )}

            <div style={{marginLeft: currentStep === 1 ? 'auto' : '0'}}>
              {currentStep < 3 ? (
                <button
                  onClick={handleNext}
                  style={{...styles.button, ...styles.primaryButton}}
                >
                  Next Step →
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={loading || !formData.agreeToTerms}
                  style={{
                    ...styles.button,
                    ...styles.secondaryButton,
                    ...(loading || !formData.agreeToTerms ? styles.buttonDisabled : {})
                  }}
                >
                  {loading ? (
                    <>
                      <span style={{
                        width: '16px',
                        height: '16px',
                        border: '2px solid #ffffff40',
                        borderTop: '2px solid #ffffff',
                        borderRadius: '50%',
                        animation: 'spin 1s linear infinite'
                      }}></span>
                      Submitting...
                    </>
                  ) : (
                    <>
                      🎉 Submit Application
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>

        <div style={styles.footerLinks}>
          <Link href="/login" style={styles.footerLink}>
            Already have an account? Sign In
          </Link>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        
        @media (max-width: 768px) {
          .grid-cols-2 {
            grid-template-columns: 1fr !important;
          }
          .grid-cols-3 {
            grid-template-columns: 1fr !important;
          }
        }
        
        input:focus, select:focus {
          outline: none !important;
          border-color: #3b82f6 !important;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1) !important;
        }
      `}</style>
    </div>
  );
}
