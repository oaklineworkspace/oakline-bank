
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function Apply() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const [states, setStates] = useState([]);
  const [showManualState, setShowManualState] = useState(false);
  const [showManualCountry, setShowManualCountry] = useState(false);

  const [formData, setFormData] = useState({
    firstName: '',
    middleName: '',
    lastName: '',
    email: '',
    phone: '',
    dob: '',
    ssn: '',
    idNumber: '',
    address: '',
    city: '',
    state: '',
    manualState: '',
    zipCode: '',
    country: '',
    manualCountry: '',
    accountTypes: [],
    employment: '',
    income: '',
    termsAgreed: false
  });

  const accountTypes = [
    { id: 1, title: 'Checking Account', icon: '💳', description: 'Everyday banking needs' },
    { id: 2, title: 'Savings Account', icon: '💰', description: 'Earn interest on deposits' },
    { id: 3, title: 'Business Checking', icon: '🏢', description: 'Business transactions' },
    { id: 4, title: 'Business Savings', icon: '🏦', description: 'Business savings with interest' },
    { id: 5, title: 'Student Checking', icon: '🎓', description: 'Low fees for students' },
    { id: 6, title: 'Money Market Account', icon: '📈', description: 'Higher interest rates' },
    { id: 7, title: 'Certificate of Deposit (CD)', icon: '📜', description: 'Fixed-term savings' },
    { id: 8, title: 'Retirement Account (IRA)', icon: '🏖️', description: 'Plan your retirement' },
    { id: 9, title: 'Joint Checking Account', icon: '🤝', description: 'Shared account access' },
    { id: 10, title: 'Trust Account', icon: '🛡️', description: 'Fiduciary management' },
    { id: 11, title: 'Investment Brokerage Account', icon: '📊', description: 'Investment trading' },
    { id: 12, title: 'High-Yield Savings Account', icon: '⭐', description: 'Premium interest rates' },
    { id: 13, title: 'International Checking', icon: '🌍', description: 'Global banking access' },
    { id: 14, title: 'Foreign Currency Account', icon: '💱', description: 'Multi-currency support' },
    { id: 15, title: 'Cryptocurrency Wallet', icon: '🪙', description: 'Digital currency storage' },
    { id: 16, title: 'Loan Repayment Account', icon: '💸', description: 'Dedicated loan payments' },
    { id: 17, title: 'Mortgage Account', icon: '🏠', description: 'Home loan management' },
    { id: 18, title: 'Auto Loan Account', icon: '🚗', description: 'Vehicle financing' },
    { id: 19, title: 'Credit Card Account', icon: '💳', description: 'Revolving credit access' },
    { id: 20, title: 'Prepaid Card Account', icon: '🎫', description: 'Prepaid card management' },
    { id: 21, title: 'Payroll Account', icon: '💼', description: 'Direct deposit setup' },
    { id: 22, title: 'Nonprofit/Charity Account', icon: '❤️', description: 'Non-profit banking' },
    { id: 23, title: 'Escrow Account', icon: '🔒', description: 'Secure fund holding' },
  ];

  const countries = [
    'United States', 'Canada', 'United Kingdom', 'Australia', 'Germany',
    'France', 'Japan', 'South Korea', 'Brazil', 'Mexico', 'India', 'China',
    'Nigeria', 'South Africa', 'Italy', 'Spain', 'Netherlands', 'Sweden',
    'Norway', 'Switzerland', 'Other'
  ];

  const countriesWithStates = ['United States', 'Canada', 'United Kingdom', 'Australia', 'Nigeria'];

  const statesByCountry = {
    'United States': [
      'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut',
      'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa',
      'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan',
      'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire',
      'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Ohio',
      'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota',
      'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia',
      'Wisconsin', 'Wyoming'
    ],
    'Canada': [
      'Alberta', 'British Columbia', 'Manitoba', 'New Brunswick', 'Newfoundland and Labrador',
      'Northwest Territories', 'Nova Scotia', 'Nunavut', 'Ontario', 'Prince Edward Island',
      'Quebec', 'Saskatchewan', 'Yukon'
    ],
    'United Kingdom': ['England', 'Scotland', 'Wales', 'Northern Ireland'],
    'Australia': [
      'Australian Capital Territory', 'New South Wales', 'Northern Territory', 'Queensland',
      'South Australia', 'Tasmania', 'Victoria', 'Western Australia'
    ],
    'Nigeria': [
      'Abia', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa', 'Benue', 'Borno',
      'Cross River', 'Delta', 'Ebonyi', 'Edo', 'Ekiti', 'Enugu', 'Gombe', 'Imo', 'Jigawa',
      'Kaduna', 'Kano', 'Katsina', 'Kebbi', 'Kogi', 'Kwara', 'Lagos', 'Nasarawa', 'Niger',
      'Ogun', 'Ondo', 'Osun', 'Oyo', 'Plateau', 'Rivers', 'Sokoto', 'Taraba', 'Yobe', 'Zamfara'
    ]
  };

  useEffect(() => {
    if (countriesWithStates.includes(formData.country)) {
      setStates(statesByCountry[formData.country] || []);
      setShowManualState(false);
    } else {
      setStates([]);
      setShowManualState(formData.country && formData.country !== '');
    }
  }, [formData.country]);

  useEffect(() => {
    setShowManualCountry(formData.country === 'Other');
  }, [formData.country]);

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const validatePhone = (phone) => {
    const re = /^[\+]?[1-9][\d]{0,15}$/;
    return re.test(phone.replace(/[\s\-\(\)]/g, ''));
  };

  const validateStep = (step) => {
    const newErrors = {};

    if (step === 1) {
      if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
      if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
      if (!formData.email.trim()) {
        newErrors.email = 'Email is required';
      } else if (!validateEmail(formData.email)) {
        newErrors.email = 'Please enter a valid email address';
      }
      if (!formData.phone.trim()) {
        newErrors.phone = 'Phone number is required';
      } else if (!validatePhone(formData.phone)) {
        newErrors.phone = 'Please enter a valid phone number';
      }
      if (!formData.dob) newErrors.dob = 'Date of birth is required';
      if (!formData.address.trim()) newErrors.address = 'Address is required';
      if (!formData.city.trim()) newErrors.city = 'City is required';
      if (!formData.zipCode.trim()) newErrors.zipCode = 'ZIP/Postal code is required';
      
      const finalCountry = formData.country === 'Other' ? formData.manualCountry : formData.country;
      if (!finalCountry.trim()) newErrors.country = 'Country is required';
      
      if (finalCountry === 'United States' && !formData.ssn.trim()) {
        newErrors.ssn = 'SSN is required for US residents';
      } else if (finalCountry !== 'United States' && !formData.idNumber.trim()) {
        newErrors.idNumber = 'ID Number is required';
      }

      if (countriesWithStates.includes(finalCountry)) {
        const finalState = formData.state || formData.manualState;
        if (!finalState.trim()) newErrors.state = 'State/Province is required';
      } else if (showManualState && !formData.manualState.trim()) {
        newErrors.manualState = 'State/Province is required';
      }
    }

    if (step === 2) {
      if (formData.accountTypes.length === 0) {
        newErrors.accountTypes = 'Please select at least one account type';
      }
      if (!formData.employment) newErrors.employment = 'Employment status is required';
      if (!formData.income) newErrors.income = 'Income range is required';
    }

    if (step === 3) {
      if (!formData.termsAgreed) {
        newErrors.termsAgreed = 'You must agree to the terms and privacy policy';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const toggleAccountType = (id) => {
    setFormData(prev => {
      const selected = prev.accountTypes.includes(id)
        ? prev.accountTypes.filter(a => a !== id)
        : [...prev.accountTypes, id];
      return { ...prev, accountTypes: selected };
    });
    
    // Clear account types error when user selects something
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

  const sendConfirmationEmail = async (userEmail, userName) => {
    try {
      const response = await fetch('/api/send-welcome-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: userEmail,
          name: userName,
          type: 'application_confirmation'
        }),
      });

      if (!response.ok) {
        console.error('Failed to send confirmation email');
      }
    } catch (error) {
      console.error('Error sending confirmation email:', error);
    }
  };

  const handleSubmit = async () => {
    if (!validateStep(3)) return;
    
    setIsSubmitting(true);

    try {
      // Prepare final values
      const finalCountry = formData.country === 'Other' ? formData.manualCountry : formData.country;
      const finalState = countriesWithStates.includes(finalCountry) 
        ? (formData.state || formData.manualState) 
        : formData.manualState;

      // Insert user
      const { data: user, error: userError } = await supabase
        .from('users')
        .insert([{
          first_name: formData.firstName.trim(),
          middle_name: formData.middleName.trim(),
          last_name: formData.lastName.trim(),
          email: formData.email.trim().toLowerCase(),
          phone: formData.phone.trim(),
          dob: formData.dob,
          ssn: finalCountry === 'United States' ? formData.ssn.trim() : null,
          id_number: finalCountry !== 'United States' ? formData.idNumber.trim() : null,
          address_line1: formData.address.trim(),
          city: formData.city.trim(),
          state: finalState.trim(),
          zip_code: formData.zipCode.trim(),
          country: finalCountry.trim()
        }])
        .select()
        .single();

      if (userError) throw userError;

      const userId = user.id;

      // Insert employment
      await supabase.from('user_employment').insert([{
        user_id: userId,
        employment_status: formData.employment,
        annual_income: formData.income
      }]);

      // Insert selected account types
      if (formData.accountTypes.length > 0) {
        const accountInserts = formData.accountTypes.map(id => ({
          user_id: userId,
          account_type_id: id
        }));
        await supabase.from('user_account_types').insert(accountInserts);
      }

      // Create application record
      await supabase.from('applications').insert([{
        user_id: userId,
        status: 'pending',
        application_type: 'account_opening',
        submitted_at: new Date().toISOString()
      }]);

      // Send confirmation email
      await sendConfirmationEmail(
        formData.email,
        `${formData.firstName} ${formData.lastName}`
      );

      // Redirect to success page
      router.push('/success?message=Application submitted successfully! You will receive a confirmation email shortly.');

    } catch (error) {
      console.error('Error submitting application:', error);
      setErrors({ submit: 'Failed to submit application. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const finalCountry = formData.country === 'Other' ? formData.manualCountry : formData.country;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-blue-800 mb-2">🏦 Oakline Bank</h1>
          <p className="text-xl text-gray-600">Account Application</p>
          <div className="mt-4">
            <Link href="/login" className="text-blue-600 hover:text-blue-800 underline">
              Already have an account? Sign In
            </Link>
          </div>
        </header>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Step Indicators */}
          <div className="flex justify-center items-center mb-8">
            {[1, 2, 3].map((step, index) => (
              <div key={step} className="flex items-center">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-semibold
                  ${step === currentStep 
                    ? 'bg-blue-600 text-white' 
                    : step < currentStep 
                      ? 'bg-green-500 text-white' 
                      : 'bg-gray-300 text-gray-600'
                  }`}>
                  {step < currentStep ? '✓' : step}
                </div>
                {index < 2 && (
                  <div className={`w-16 h-1 mx-2 ${step < currentStep ? 'bg-green-500' : 'bg-gray-300'}`} />
                )}
              </div>
            ))}
          </div>

          <div className="text-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-800">
              {currentStep === 1 && 'Personal Information'}
              {currentStep === 2 && 'Account Selection & Employment'}
              {currentStep === 3 && 'Review & Submit'}
            </h2>
          </div>

          {/* Step 1: Personal Information */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    First Name *
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.firstName ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter your first name"
                  />
                  {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Middle Name
                  </label>
                  <input
                    type="text"
                    name="middleName"
                    value={formData.middleName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter your middle name (optional)"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.lastName ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter your last name"
                  />
                  {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.email ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter your email address"
                  />
                  {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.phone ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter your phone number"
                  />
                  {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date of Birth *
                  </label>
                  <input
                    type="date"
                    name="dob"
                    value={formData.dob}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.dob ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.dob && <p className="text-red-500 text-sm mt-1">{errors.dob}</p>}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Country *
                </label>
                <select
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.country ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select your country</option>
                  {countries.map(country => (
                    <option key={country} value={country}>{country}</option>
                  ))}
                </select>
                {errors.country && <p className="text-red-500 text-sm mt-1">{errors.country}</p>}
              </div>

              {showManualCountry && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Please specify your country *
                  </label>
                  <input
                    type="text"
                    name="manualCountry"
                    value={formData.manualCountry}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter your country"
                  />
                </div>
              )}

              {finalCountry === 'United States' ? (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Social Security Number (SSN) *
                  </label>
                  <input
                    type="text"
                    name="ssn"
                    value={formData.ssn}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.ssn ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="XXX-XX-XXXX"
                  />
                  {errors.ssn && <p className="text-red-500 text-sm mt-1">{errors.ssn}</p>}
                </div>
              ) : finalCountry && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Government ID Number *
                  </label>
                  <input
                    type="text"
                    name="idNumber"
                    value={formData.idNumber}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.idNumber ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter your ID number"
                  />
                  {errors.idNumber && <p className="text-red-500 text-sm mt-1">{errors.idNumber}</p>}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Street Address *
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.address ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter your street address"
                />
                {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    City *
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.city ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter your city"
                  />
                  {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    State/Province *
                  </label>
                  {states.length > 0 ? (
                    <select
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        errors.state ? 'border-red-500' : 'border-gray-300'
                      }`}
                    >
                      <option value="">Select state/province</option>
                      {states.map(state => (
                        <option key={state} value={state}>{state}</option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type="text"
                      name="manualState"
                      value={formData.manualState}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        errors.manualState || errors.state ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Enter your state/province"
                    />
                  )}
                  {(errors.state || errors.manualState) && (
                    <p className="text-red-500 text-sm mt-1">{errors.state || errors.manualState}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    ZIP/Postal Code *
                  </label>
                  <input
                    type="text"
                    name="zipCode"
                    value={formData.zipCode}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.zipCode ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter ZIP/Postal code"
                  />
                  {errors.zipCode && <p className="text-red-500 text-sm mt-1">{errors.zipCode}</p>}
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Account Selection & Employment */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Select Account Types *</h3>
                {errors.accountTypes && <p className="text-red-500 text-sm mb-4">{errors.accountTypes}</p>}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {accountTypes.map(account => {
                    const selected = formData.accountTypes.includes(account.id);
                    return (
                      <div
                        key={account.id}
                        onClick={() => toggleAccountType(account.id)}
                        className={`p-4 rounded-lg cursor-pointer border-2 transition-all duration-200 ${
                          selected 
                            ? 'border-green-500 bg-green-50 shadow-md' 
                            : 'border-gray-200 bg-white hover:border-blue-300 hover:shadow-sm'
                        }`}
                      >
                        <div className="text-2xl mb-2">{account.icon}</div>
                        <div className="font-semibold text-gray-800 mb-1">{account.title}</div>
                        <div className="text-sm text-gray-600">{account.description}</div>
                        {selected && (
                          <div className="mt-2 text-green-600 font-medium">✓ Selected</div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Employment Status *
                  </label>
                  <select
                    name="employment"
                    value={formData.employment}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.employment ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Select employment status</option>
                    <option value="employed_fulltime">Employed Full-time</option>
                    <option value="employed_parttime">Employed Part-time</option>
                    <option value="self_employed">Self-employed</option>
                    <option value="student">Student</option>
                    <option value="retired">Retired</option>
                    <option value="unemployed">Unemployed</option>
                    <option value="homemaker">Homemaker</option>
                  </select>
                  {errors.employment && <p className="text-red-500 text-sm mt-1">{errors.employment}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Annual Income *
                  </label>
                  <select
                    name="income"
                    value={formData.income}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.income ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Select annual income</option>
                    <option value="under_25k">Under $25,000</option>
                    <option value="25k_50k">$25,000 - $50,000</option>
                    <option value="50k_75k">$50,000 - $75,000</option>
                    <option value="75k_100k">$75,000 - $100,000</option>
                    <option value="100k_150k">$100,000 - $150,000</option>
                    <option value="150k_250k">$150,000 - $250,000</option>
                    <option value="over_250k">Over $250,000</option>
                  </select>
                  {errors.income && <p className="text-red-500 text-sm mt-1">{errors.income}</p>}
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Review & Submit */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Application Summary</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p><strong>Name:</strong> {formData.firstName} {formData.middleName} {formData.lastName}</p>
                    <p><strong>Email:</strong> {formData.email}</p>
                    <p><strong>Phone:</strong> {formData.phone}</p>
                    <p><strong>Date of Birth:</strong> {formData.dob}</p>
                  </div>
                  <div>
                    <p><strong>Country:</strong> {finalCountry}</p>
                    <p><strong>Address:</strong> {formData.address}</p>
                    <p><strong>City:</strong> {formData.city}</p>
                    <p><strong>State:</strong> {countriesWithStates.includes(finalCountry) 
                      ? (formData.state || formData.manualState) 
                      : formData.manualState}</p>
                  </div>
                </div>

                <div className="mt-4">
                  <p><strong>Selected Account Types:</strong></p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.accountTypes.map(id => {
                      const account = accountTypes.find(a => a.id === id);
                      return account ? (
                        <span key={id} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                          {account.title}
                        </span>
                      ) : null;
                    })}
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <p><strong>Employment:</strong> {formData.employment.replace(/_/g, ' ')}</p>
                  <p><strong>Annual Income:</strong> {formData.income.replace(/_/g, ' ')}</p>
                </div>
              </div>

              <div>
                <label className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    name="termsAgreed"
                    checked={formData.termsAgreed}
                    onChange={handleInputChange}
                    className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="text-sm text-gray-700">
                    I agree to the{' '}
                    <Link href="/terms" className="text-blue-600 hover:text-blue-800 underline">
                      Terms of Service
                    </Link>
                    {' '}and{' '}
                    <Link href="/privacy" className="text-blue-600 hover:text-blue-800 underline">
                      Privacy Policy
                    </Link>
                    {' '}*
                  </span>
                </label>
                {errors.termsAgreed && <p className="text-red-500 text-sm mt-1">{errors.termsAgreed}</p>}
              </div>

              {errors.submit && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-red-700">{errors.submit}</p>
                </div>
              )}
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8">
            {currentStep > 1 && (
              <button
                onClick={handleBack}
                className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors duration-200 font-medium"
              >
                Back
              </button>
            )}
            
            {currentStep < 3 ? (
              <button
                onClick={handleNext}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium ml-auto"
              >
                Next
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={!formData.termsAgreed || isSubmitting}
                className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200 font-medium ml-auto"
              >
                {isSubmitting ? 'Submitting Application...' : 'Submit Application'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
