
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
  { id: 'checking', name: 'Checking Account', description: 'Everyday banking account' },
  { id: 'savings', name: 'Savings Account', description: 'High-yield savings account' },
  { id: 'business', name: 'Business Account', description: 'Business banking account' },
  { id: 'premium', name: 'Premium Account', description: 'Premium banking with exclusive benefits' }
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

export default function CreateUser() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
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
    
    if (type === 'checkbox' && name === 'accountTypes') {
      setFormData(prev => ({
        ...prev,
        accountTypes: checked 
          ? [...prev.accountTypes, value]
          : prev.accountTypes.filter(type => type !== value)
      }));
    } else if (type === 'checkbox') {
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const validateForm = () => {
    const errors = [];
    
    if (!formData.firstName.trim()) errors.push('First name is required');
    if (!formData.lastName.trim()) errors.push('Last name is required');
    if (!formData.email.trim()) errors.push('Email is required');
    if (!formData.dateOfBirth) errors.push('Date of birth is required');
    if (!formData.address.trim()) errors.push('Address is required');
    if (!formData.city.trim()) errors.push('City is required');
    if (!formData.state.trim()) errors.push('State is required');
    if (!formData.zipCode.trim()) errors.push('ZIP code is required');
    if (formData.accountTypes.length === 0) errors.push('At least one account type is required');
    if (!formData.annualIncome.trim()) errors.push('Annual income is required');
    if (!formData.password.trim()) errors.push('Password is required');
    
    // Validate SSN or ID number based on country
    if (formData.country === 'US' && !formData.ssn.trim()) {
      errors.push('SSN is required for US residents');
    } else if (formData.country !== 'US' && !formData.idNumber.trim()) {
      errors.push('ID number is required for non-US residents');
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      errors.push('Valid email address is required');
    }
    
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const errors = validateForm();
    if (errors.length > 0) {
      setMessage(`❌ Validation errors:\n${errors.join('\n')}`);
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
      } else {
        setMessage(`❌ Error: ${data.error}`);
      }
    } catch (error) {
      setMessage(`❌ Error: ${error.message}`);
    }
    
    setLoading(false);
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', maxWidth: '800px', margin: '0 auto' }}>
      <h1>Admin - Create User Account</h1>
      
      <form onSubmit={handleSubmit} style={{ marginBottom: '30px' }}>
        {/* Personal Information */}
        <div style={{ marginBottom: '30px', padding: '20px', border: '1px solid #ddd', borderRadius: '8px' }}>
          <h3>Personal Information</h3>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px', marginBottom: '15px' }}>
            <div>
              <label>First Name *</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
                required
              />
            </div>
            <div>
              <label>Middle Name</label>
              <input
                type="text"
                name="middleName"
                value={formData.middleName}
                onChange={handleInputChange}
                style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
              />
            </div>
            <div>
              <label>Last Name *</label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
                required
              />
            </div>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
            <div>
              <label>Email Address *</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
                required
              />
            </div>
            <div>
              <label>Phone Number</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
              />
            </div>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px', marginBottom: '15px' }}>
            <div>
              <label>Date of Birth *</label>
              <input
                type="date"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleInputChange}
                style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
                required
              />
            </div>
            <div>
              <label>Country *</label>
              <select
                name="country"
                value={formData.country}
                onChange={handleInputChange}
                style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
                required
              >
                {COUNTRIES.map(country => (
                  <option key={country.code} value={country.code}>{country.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label>{formData.country === 'US' ? 'SSN *' : 'ID Number *'}</label>
              <input
                type="text"
                name={formData.country === 'US' ? 'ssn' : 'idNumber'}
                value={formData.country === 'US' ? formData.ssn : formData.idNumber}
                onChange={handleInputChange}
                style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
                placeholder={formData.country === 'US' ? 'XXX-XX-XXXX' : 'Government ID Number'}
                required
              />
            </div>
          </div>
          
          <div>
            <label>Mother's Maiden Name</label>
            <input
              type="text"
              name="mothersMaidenName"
              value={formData.mothersMaidenName}
              onChange={handleInputChange}
              style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
            />
          </div>
        </div>

        {/* Address Information */}
        <div style={{ marginBottom: '30px', padding: '20px', border: '1px solid #ddd', borderRadius: '8px' }}>
          <h3>Address Information</h3>
          
          <div style={{ marginBottom: '15px' }}>
            <label>Street Address *</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
              required
            />
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px' }}>
            <div>
              <label>City *</label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
                required
              />
            </div>
            <div>
              <label>State/Province *</label>
              <input
                type="text"
                name="state"
                value={formData.state}
                onChange={handleInputChange}
                style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
                required
              />
            </div>
            <div>
              <label>ZIP/Postal Code *</label>
              <input
                type="text"
                name="zipCode"
                value={formData.zipCode}
                onChange={handleInputChange}
                style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
                required
              />
            </div>
          </div>
        </div>

        {/* Account & Financial Information */}
        <div style={{ marginBottom: '30px', padding: '20px', border: '1px solid #ddd', borderRadius: '8px' }}>
          <h3>Account & Financial Information</h3>
          
          <div style={{ marginBottom: '15px' }}>
            <label>Account Types *</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '8px' }}>
              {ACCOUNT_TYPES.map(accountType => (
                <label key={accountType.id} style={{ display: 'flex', alignItems: 'center' }}>
                  <input
                    type="checkbox"
                    name="accountTypes"
                    value={accountType.id}
                    checked={formData.accountTypes.includes(accountType.id)}
                    onChange={handleInputChange}
                    style={{ marginRight: '8px' }}
                  />
                  <div>
                    <strong>{accountType.name}</strong>
                    <br />
                    <small style={{ color: '#666' }}>{accountType.description}</small>
                  </div>
                </label>
              ))}
            </div>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
            <div>
              <label>Employment Status *</label>
              <select
                name="employmentStatus"
                value={formData.employmentStatus}
                onChange={handleInputChange}
                style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
                required
              >
                {EMPLOYMENT_OPTIONS.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>
            <div>
              <label>Annual Income *</label>
              <input
                type="number"
                name="annualIncome"
                value={formData.annualIncome}
                onChange={handleInputChange}
                style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
                placeholder="Enter annual income"
                min="0"
                required
              />
            </div>
          </div>
        </div>

        {/* Account Security */}
        <div style={{ marginBottom: '30px', padding: '20px', border: '1px solid #ddd', borderRadius: '8px' }}>
          <h3>Account Security</h3>
          
          <div style={{ marginBottom: '15px' }}>
            <label>Initial Password *</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
              placeholder="Set initial password for user"
              required
            />
          </div>
          
          <label style={{ display: 'flex', alignItems: 'center' }}>
            <input
              type="checkbox"
              name="sendEnrollmentEmail"
              checked={formData.sendEnrollmentEmail}
              onChange={handleInputChange}
              style={{ marginRight: '8px' }}
            />
            Send enrollment email to user
          </label>
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            padding: '12px 30px',
            backgroundColor: loading ? '#6c757d' : '#0070f3',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: loading ? 'not-allowed' : 'pointer',
            fontSize: '16px',
            fontWeight: 'bold'
          }}
        >
          {loading ? 'Creating Account...' : 'Create User Account'}
        </button>
      </form>

      {/* Status Message */}
      {message && (
        <div style={{
          padding: '15px',
          margin: '20px 0',
          backgroundColor: message.includes('✅') ? '#d1edff' : '#f8d7da',
          border: '1px solid',
          borderColor: message.includes('✅') ? '#bee5eb' : '#f5c6cb',
          borderRadius: '5px',
          color: message.includes('✅') ? '#0c5460' : '#721c24',
          whiteSpace: 'pre-line'
        }}>
          {message}
        </div>
      )}

      <div style={{ marginTop: '30px', padding: '15px', backgroundColor: '#fff3cd', border: '1px solid #ffeaa7', borderRadius: '5px' }}>
        <h4>🛡️ Admin Notes:</h4>
        <ul>
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
