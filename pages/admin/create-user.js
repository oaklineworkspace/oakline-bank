
import { useState } from 'react';

const COUNTRIES = [
  { code: 'US', name: 'United States' },
  { code: 'CA', name: 'Canada' },
  { code: 'GB', name: 'United Kingdom' },
  { code: 'AU', name: 'Australia' },
  { code: 'DE', name: 'Germany' },
  { code: 'FR', name: 'France' },
  { code: 'JP', name: 'Japan' },
  { code: 'BR', name: 'Brazil' },
  { code: 'IN', name: 'India' },
  { code: 'OTHER', name: 'Other (specify)' }
];

const ACCOUNT_TYPES = [
  { id: 'checking', name: 'Checking Account', description: 'Everyday banking account for daily transactions', icon: '💳', features: ['No monthly fees', 'Unlimited transactions', 'Online banking'] },
  { id: 'savings', name: 'Savings Account', description: 'High-yield savings account to grow your money', icon: '💰', features: ['4.50% APY', 'FDIC insured', 'Monthly interest'] },
  { id: 'business', name: 'Business Account', description: 'Professional banking for business operations', icon: '🏢', features: ['Business tools', 'Wire transfers', 'Merchant services'] },
  { id: 'premium', name: 'Premium Account', description: 'Exclusive banking with premium benefits', icon: '⭐', features: ['Personal banker', 'Premium rewards', 'Investment access'] }
];

const EMPLOYMENT_OPTIONS = [
  'Employed Full-time',
  'Employed Part-time', 
  'Self-employed',
  'Student',
  'Retired',
  'Unemployed',
  'Other'
];

const US_STATES = [
  'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware',
  'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky',
  'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi',
  'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico',
  'New York', 'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania',
  'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont',
  'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'
];

export default function CreateUser() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState({});
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
    address: '',
    city: '',
    state: '',
    zipCode: '',
    accountTypes: ['checking'], // Default to checking account
    employmentStatus: 'Employed Full-time',
    annualIncome: '',
    password: '',
    sendEnrollmentEmail: true
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (type === 'checkbox' && name === 'sendEnrollmentEmail') {
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }

    // Clear errors when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const toggleAccountType = (accountId) => {
    setFormData(prev => {
      const isSelected = prev.accountTypes.includes(accountId);
      if (isSelected) {
        // Don't allow removing if it's the only one selected
        if (prev.accountTypes.length === 1) return prev;
        return { ...prev, accountTypes: prev.accountTypes.filter(id => id !== accountId) };
      } else {
        return { ...prev, accountTypes: [...prev.accountTypes, accountId] };
      }
    });

    if (errors.accountTypes) {
      setErrors(prev => ({ ...prev, accountTypes: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.dateOfBirth) newErrors.dateOfBirth = 'Date of birth is required';
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.state.trim()) newErrors.state = 'State is required';
    if (!formData.zipCode.trim()) newErrors.zipCode = 'ZIP code is required';
    if (formData.accountTypes.length === 0) newErrors.accountTypes = 'At least one account type is required';
    if (!formData.annualIncome.trim()) newErrors.annualIncome = 'Annual income is required';
    if (!formData.password.trim()) newErrors.password = 'Password is required';
    
    // Validate SSN or ID number based on country
    if (formData.country === 'US' && !formData.ssn.trim()) {
      newErrors.ssn = 'SSN is required for US residents';
    } else if (formData.country !== 'US' && !formData.idNumber.trim()) {
      newErrors.idNumber = 'ID number is required for non-US residents';
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      newErrors.email = 'Valid email address is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      setMessage('❌ Please fix the validation errors below');
      return;
    }
    
    setLoading(true);
    setMessage('Creating user account...');
    
    try {
      // Submit the application using the existing API
      const response = await fetch('/api/applications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          agreeToTerms: true, // Admin creation implies terms agreement
          adminCreated: true
        })
      });

      const data = await response.json();
      
      if (response.ok) {
        setMessage(`✅ User account created successfully!\n\nApplication ID: ${data.application.id}\nGenerated Accounts: ${data.accounts?.length || 0}\nEmail: ${formData.email}\n\n${formData.sendEnrollmentEmail ? 'Enrollment email has been sent.' : 'No enrollment email sent.'}`);
        
        // Reset form
        setFormData({
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
          address: '',
          city: '',
          state: '',
          zipCode: '',
          accountTypes: ['checking'],
          employmentStatus: 'Employed Full-time',
          annualIncome: '',
          password: '',
          sendEnrollmentEmail: true
        });
        setErrors({});
      } else {
        setMessage(`❌ Error: ${data.error}`);
      }
    } catch (error) {
      setMessage(`❌ Error: ${error.message}`);
    }
    
    setLoading(false);
  };

  // Styles
  const styles = {
    container: {
      padding: '20px',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      maxWidth: '1000px',
      margin: '0 auto',
      backgroundColor: '#f8fafc',
      minHeight: '100vh'
    },
    header: {
      background: 'linear-gradient(135deg, #0070f3 0%, #0051a5 100%)',
      color: 'white',
      padding: '2rem',
      borderRadius: '16px',
      marginBottom: '2rem',
      textAlign: 'center',
      boxShadow: '0 8px 32px rgba(0, 112, 243, 0.3)'
    },
    form: {
      backgroundColor: 'white',
      borderRadius: '16px',
      padding: '2rem',
      boxShadow: '0 4px 24px rgba(0, 0, 0, 0.08)',
      border: '1px solid #e2e8f0'
    },
    section: {
      marginBottom: '2.5rem',
      padding: '1.5rem',
      backgroundColor: '#f8fafc',
      borderRadius: '12px',
      border: '1px solid #e2e8f0'
    },
    sectionTitle: {
      fontSize: '18px',
      fontWeight: '600',
      color: '#1e293b',
      marginBottom: '1.5rem',
      paddingBottom: '0.5rem',
      borderBottom: '2px solid #0070f3'
    },
    inputGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
      gap: '1rem',
      marginBottom: '1rem'
    },
    inputGroup: {
      marginBottom: '1rem'
    },
    label: {
      display: 'block',
      marginBottom: '0.5rem',
      fontWeight: '500',
      color: '#374151',
      fontSize: '14px'
    },
    input: {
      width: '100%',
      padding: '12px 16px',
      border: '2px solid #e5e7eb',
      borderRadius: '8px',
      fontSize: '14px',
      backgroundColor: '#ffffff',
      transition: 'all 0.2s ease',
      boxSizing: 'border-box'
    },
    inputFocus: {
      borderColor: '#0070f3',
      outline: 'none',
      boxShadow: '0 0 0 3px rgba(0, 112, 243, 0.1)'
    },
    inputError: {
      borderColor: '#ef4444'
    },
    select: {
      width: '100%',
      padding: '12px 16px',
      border: '2px solid #e5e7eb',
      borderRadius: '8px',
      fontSize: '14px',
      backgroundColor: '#ffffff',
      cursor: 'pointer',
      transition: 'all 0.2s ease'
    },
    accountTypesGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
      gap: '1rem',
      marginTop: '1rem'
    },
    accountCard: {
      border: '2px solid #e5e7eb',
      borderRadius: '12px',
      padding: '1.5rem',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      backgroundColor: 'white',
      position: 'relative'
    },
    accountCardSelected: {
      borderColor: '#0070f3',
      backgroundColor: '#eff6ff',
      transform: 'translateY(-2px)',
      boxShadow: '0 8px 25px rgba(0, 112, 243, 0.15)'
    },
    accountIcon: {
      fontSize: '24px',
      marginBottom: '8px'
    },
    accountName: {
      fontSize: '16px',
      fontWeight: '600',
      color: '#1e293b',
      marginBottom: '4px'
    },
    accountDescription: {
      fontSize: '14px',
      color: '#64748b',
      marginBottom: '12px'
    },
    accountFeatures: {
      fontSize: '12px',
      color: '#64748b'
    },
    submitButton: {
      width: '100%',
      padding: '16px',
      backgroundColor: loading ? '#94a3b8' : '#0070f3',
      color: 'white',
      border: 'none',
      borderRadius: '12px',
      fontSize: '16px',
      fontWeight: '600',
      cursor: loading ? 'not-allowed' : 'pointer',
      transition: 'all 0.2s ease',
      marginTop: '2rem'
    },
    errorText: {
      color: '#ef4444',
      fontSize: '12px',
      marginTop: '4px',
      fontWeight: '500'
    },
    messageBox: {
      padding: '1rem',
      margin: '1rem 0',
      borderRadius: '8px',
      whiteSpace: 'pre-line',
      fontSize: '14px'
    },
    successMessage: {
      backgroundColor: '#d1fae5',
      color: '#065f46',
      border: '1px solid #a7f3d0'
    },
    errorMessage: {
      backgroundColor: '#fef2f2',
      color: '#991b1b',
      border: '1px solid #fecaca'
    },
    checkbox: {
      width: '18px',
      height: '18px',
      marginRight: '8px',
      accentColor: '#0070f3'
    },
    checkboxLabel: {
      display: 'flex',
      alignItems: 'center',
      cursor: 'pointer',
      padding: '8px 0'
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={{ margin: 0, fontSize: '2rem', fontWeight: '700' }}>👥 Admin - Create User Account</h1>
        <p style={{ margin: '0.5rem 0 0 0', opacity: 0.9 }}>Create a new user account with banking services</p>
      </div>
      
      <form onSubmit={handleSubmit} style={styles.form}>
        {/* Personal Information */}
        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>👤 Personal Information</h3>
          
          <div style={styles.inputGrid}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>First Name *</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                style={{
                  ...styles.input,
                  ...(errors.firstName ? styles.inputError : {})
                }}
                placeholder="Enter first name"
                required
              />
              {errors.firstName && <div style={styles.errorText}>{errors.firstName}</div>}
            </div>
            
            <div style={styles.inputGroup}>
              <label style={styles.label}>Middle Name</label>
              <input
                type="text"
                name="middleName"
                value={formData.middleName}
                onChange={handleInputChange}
                style={styles.input}
                placeholder="Enter middle name (optional)"
              />
            </div>
            
            <div style={styles.inputGroup}>
              <label style={styles.label}>Last Name *</label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                style={{
                  ...styles.input,
                  ...(errors.lastName ? styles.inputError : {})
                }}
                placeholder="Enter last name"
                required
              />
              {errors.lastName && <div style={styles.errorText}>{errors.lastName}</div>}
            </div>
          </div>
          
          <div style={styles.inputGrid}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Email Address *</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                style={{
                  ...styles.input,
                  ...(errors.email ? styles.inputError : {})
                }}
                placeholder="Enter email address"
                required
              />
              {errors.email && <div style={styles.errorText}>{errors.email}</div>}
            </div>
            
            <div style={styles.inputGroup}>
              <label style={styles.label}>Phone Number</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                style={styles.input}
                placeholder="Enter phone number"
              />
            </div>
          </div>
          
          <div style={styles.inputGrid}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Date of Birth *</label>
              <input
                type="date"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleInputChange}
                style={{
                  ...styles.input,
                  ...(errors.dateOfBirth ? styles.inputError : {})
                }}
                required
              />
              {errors.dateOfBirth && <div style={styles.errorText}>{errors.dateOfBirth}</div>}
            </div>
            
            <div style={styles.inputGroup}>
              <label style={styles.label}>Country *</label>
              <select
                name="country"
                value={formData.country}
                onChange={handleInputChange}
                style={styles.select}
                required
              >
                {COUNTRIES.map(country => (
                  <option key={country.code} value={country.code}>{country.name}</option>
                ))}
              </select>
            </div>
            
            <div style={styles.inputGroup}>
              <label style={styles.label}>{formData.country === 'US' ? 'SSN *' : 'ID Number *'}</label>
              <input
                type="text"
                name={formData.country === 'US' ? 'ssn' : 'idNumber'}
                value={formData.country === 'US' ? formData.ssn : formData.idNumber}
                onChange={handleInputChange}
                style={{
                  ...styles.input,
                  ...(errors.ssn || errors.idNumber ? styles.inputError : {})
                }}
                placeholder={formData.country === 'US' ? 'XXX-XX-XXXX' : 'Government ID Number'}
                required
              />
              {(errors.ssn || errors.idNumber) && (
                <div style={styles.errorText}>{errors.ssn || errors.idNumber}</div>
              )}
            </div>
          </div>
          
          <div style={styles.inputGroup}>
            <label style={styles.label}>Mother's Maiden Name</label>
            <input
              type="text"
              name="mothersMaidenName"
              value={formData.mothersMaidenName}
              onChange={handleInputChange}
              style={styles.input}
              placeholder="Enter mother's maiden name (optional)"
            />
          </div>
        </div>

        {/* Address Information */}
        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>🏠 Address Information</h3>
          
          <div style={styles.inputGroup}>
            <label style={styles.label}>Street Address *</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              style={{
                ...styles.input,
                ...(errors.address ? styles.inputError : {})
              }}
              placeholder="Enter street address"
              required
            />
            {errors.address && <div style={styles.errorText}>{errors.address}</div>}
          </div>
          
          <div style={styles.inputGrid}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>City *</label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                style={{
                  ...styles.input,
                  ...(errors.city ? styles.inputError : {})
                }}
                placeholder="Enter city"
                required
              />
              {errors.city && <div style={styles.errorText}>{errors.city}</div>}
            </div>
            
            <div style={styles.inputGroup}>
              <label style={styles.label}>State/Province *</label>
              {formData.country === 'US' ? (
                <select
                  name="state"
                  value={formData.state}
                  onChange={handleInputChange}
                  style={{
                    ...styles.select,
                    ...(errors.state ? styles.inputError : {})
                  }}
                  required
                >
                  <option value="">Select state</option>
                  {US_STATES.map(state => (
                    <option key={state} value={state}>{state}</option>
                  ))}
                </select>
              ) : (
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleInputChange}
                  style={{
                    ...styles.input,
                    ...(errors.state ? styles.inputError : {})
                  }}
                  placeholder="Enter state/province"
                  required
                />
              )}
              {errors.state && <div style={styles.errorText}>{errors.state}</div>}
            </div>
            
            <div style={styles.inputGroup}>
              <label style={styles.label}>ZIP/Postal Code *</label>
              <input
                type="text"
                name="zipCode"
                value={formData.zipCode}
                onChange={handleInputChange}
                style={{
                  ...styles.input,
                  ...(errors.zipCode ? styles.inputError : {})
                }}
                placeholder="Enter ZIP/postal code"
                required
              />
              {errors.zipCode && <div style={styles.errorText}>{errors.zipCode}</div>}
            </div>
          </div>
        </div>

        {/* Account & Financial Information */}
        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>💼 Account & Financial Information</h3>
          
          <div style={styles.inputGroup}>
            <label style={styles.label}>Account Types * (Select at least one)</label>
            <div style={styles.accountTypesGrid}>
              {ACCOUNT_TYPES.map(accountType => {
                const isSelected = formData.accountTypes.includes(accountType.id);
                return (
                  <div
                    key={accountType.id}
                    onClick={() => toggleAccountType(accountType.id)}
                    style={{
                      ...styles.accountCard,
                      ...(isSelected ? styles.accountCardSelected : {})
                    }}
                  >
                    <div style={styles.accountIcon}>{accountType.icon}</div>
                    <div style={styles.accountName}>{accountType.name}</div>
                    <div style={styles.accountDescription}>{accountType.description}</div>
                    <div style={styles.accountFeatures}>
                      {accountType.features.map((feature, index) => (
                        <div key={index}>• {feature}</div>
                      ))}
                    </div>
                    {isSelected && (
                      <div style={{
                        position: 'absolute',
                        top: '12px',
                        right: '12px',
                        backgroundColor: '#0070f3',
                        color: 'white',
                        borderRadius: '50%',
                        width: '24px',
                        height: '24px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '14px'
                      }}>
                        ✓
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            {errors.accountTypes && <div style={styles.errorText}>{errors.accountTypes}</div>}
          </div>
          
          <div style={styles.inputGrid}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Employment Status *</label>
              <select
                name="employmentStatus"
                value={formData.employmentStatus}
                onChange={handleInputChange}
                style={styles.select}
                required
              >
                {EMPLOYMENT_OPTIONS.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>
            
            <div style={styles.inputGroup}>
              <label style={styles.label}>Annual Income *</label>
              <input
                type="number"
                name="annualIncome"
                value={formData.annualIncome}
                onChange={handleInputChange}
                style={{
                  ...styles.input,
                  ...(errors.annualIncome ? styles.inputError : {})
                }}
                placeholder="Enter annual income"
                min="0"
                required
              />
              {errors.annualIncome && <div style={styles.errorText}>{errors.annualIncome}</div>}
            </div>
          </div>
        </div>

        {/* Account Security */}
        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>🔒 Account Security</h3>
          
          <div style={styles.inputGroup}>
            <label style={styles.label}>Initial Password *</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              style={{
                ...styles.input,
                ...(errors.password ? styles.inputError : {})
              }}
              placeholder="Set initial password for user"
              required
            />
            {errors.password && <div style={styles.errorText}>{errors.password}</div>}
          </div>
          
          <label style={styles.checkboxLabel}>
            <input
              type="checkbox"
              name="sendEnrollmentEmail"
              checked={formData.sendEnrollmentEmail}
              onChange={handleInputChange}
              style={styles.checkbox}
            />
            Send enrollment email to user
          </label>
        </div>

        <button
          type="submit"
          disabled={loading}
          style={styles.submitButton}
        >
          {loading ? '⏳ Creating Account...' : '✅ Create User Account'}
        </button>
      </form>

      {/* Status Message */}
      {message && (
        <div style={{
          ...styles.messageBox,
          ...(message.includes('✅') ? styles.successMessage : styles.errorMessage)
        }}>
          {message}
        </div>
      )}

      <div style={{
        marginTop: '2rem',
        padding: '1.5rem',
        backgroundColor: '#fffbeb',
        border: '1px solid #f59e0b',
        borderRadius: '12px'
      }}>
        <h4 style={{ margin: '0 0 1rem 0', color: '#92400e' }}>🛡️ Admin Notes:</h4>
        <ul style={{ margin: 0, paddingLeft: '1.5rem', color: '#92400e' }}>
          <li>This form creates a complete user application with accounts</li>
          <li>The user will receive login credentials and account details</li>
          <li>All required KYC information must be provided</li>
          <li>Account numbers and initial balances are automatically generated</li>
          <li>If enrollment email is enabled, the user will receive setup instructions</li>
        </ul>
      </div>
    </div>
  );
}
