// pages/signup.js
import { useState } from 'react';
import { createClient } from '@supabase/supabase-js';

// Supabase client (pulls values from .env.local)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function Signup() {
  const ROUTING_NUMBER = '075915826';

  const [formData, setFormData] = useState({
    firstName: '',
    middleName: '',
    lastName: '',
    dob: '',
    ssn: '',
    maidenName: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    country: '',
    email: '',
    phone: '',
    password: ''
  });

  const [accountTypes, setAccountTypes] = useState({
    checking: true,
    savings: true,
    money_market: false,
    cd: false,
    joint: false,
    credit: false,
    investment: false
  });

  // Generate random account numbers
  const generateAccountNumber = (type) => {
    let prefix = '';
    switch (type) {
      case 'checking': prefix = '01'; break;
      case 'savings': prefix = '02'; break;
      case 'money_market': prefix = '03'; break;
      case 'cd': prefix = '04'; break;
      case 'joint': prefix = '05'; break;
      case 'credit': prefix = '06'; break;
      case 'investment': prefix = '07'; break;
    }
    return prefix + Math.floor(10000000 + Math.random() * 90000000).toString();
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCheckboxChange = (e) => {
    setAccountTypes({ ...accountTypes, [e.target.value]: e.target.checked });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Collect checked account types
    const selectedAccounts = Object.keys(accountTypes).filter(type => accountTypes[type]);

    const accounts = {};
    selectedAccounts.forEach(type => {
      accounts[`${type}_account_number`] = generateAccountNumber(type);
      accounts[`${type}_balance`] = 1000;
    });

    const personalInfo = {
      first_name: formData.firstName,
      middle_name: formData.middleName,
      last_name: formData.lastName,
      dob: formData.dob,
      ssn: formData.ssn,
      maiden_name: formData.maidenName,
      address: formData.address,
      city: formData.city,
      state: formData.state,
      zip: formData.zip,
      country: formData.country,
      email: formData.email,
      phone: formData.phone,
      password: formData.password,
      routing_number: ROUTING_NUMBER
    };

    const { error } = await supabase.from('oakline_accounts').insert([{ ...personalInfo, ...accounts }]);

    if (error) {
      alert('Error creating account: ' + error.message);
      return;
    }

    alert(`Welcome to Oakline Bank! Your accounts have been created.\nRouting Number: ${ROUTING_NUMBER}`);
    window.location.href = `${process.env.NEXT_PUBLIC_SITE_URL}/login`;
  };

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', background: '#f5f5f5', padding: '50px', textAlign: 'center' }}>
      <div style={{ background: '#fff', padding: '30px', borderRadius: '8px', boxShadow: '0 0 15px rgba(0,0,0,0.1)', maxWidth: '600px', margin: 'auto', textAlign: 'left' }}>
        <h2 style={{ textAlign: 'center' }}>Oakline Bank Signup</h2>
        <form onSubmit={handleSubmit}>
          <h3 style={{ textAlign: 'center' }}>Personal Information</h3>
          <input name="firstName" placeholder="First Name" required onChange={handleInputChange} />
          <input name="middleName" placeholder="Middle Name (Optional)" onChange={handleInputChange} />
          <input name="lastName" placeholder="Last Name" required onChange={handleInputChange} />
          <input type="date" name="dob" required onChange={handleInputChange} />
          <input name="ssn" placeholder="SSN (XXX-XX-XXXX)" pattern="\d{3}-\d{2}-\d{4}" required onChange={handleInputChange} />
          <input name="maidenName" placeholder="Mother's Maiden Name" required onChange={handleInputChange} />
          <input name="address" placeholder="Address" required onChange={handleInputChange} />
          <input name="city" placeholder="City" required onChange={handleInputChange} />
          <input name="state" placeholder="State/Province" required onChange={handleInputChange} />
          <input name="zip" placeholder="Zip / Postal Code" pattern="\d{5}" required onChange={handleInputChange} />
          <select name="country" required onChange={handleInputChange}>
            <option value="">Select Country</option>
            <option value="US">United States</option>
            <option value="CA">Canada</option>
            <option value="GB">United Kingdom</option>
            <option value="AU">Australia</option>
          </select>
          <input type="email" name="email" placeholder="Email" required onChange={handleInputChange} />
          <input type="tel" name="phone" placeholder="Phone Number" required onChange={handleInputChange} />
          <input type="password" name="password" placeholder="Password" required onChange={handleInputChange} />

          <h3 style={{ textAlign: 'center' }}>Account Types</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            {Object.keys(accountTypes).map(type => (
              <label key={type}>
                <input
                  type="checkbox"
                  value={type}
                  checked={accountTypes[type]}
                  onChange={handleCheckboxChange}
                /> {type.replace('_', ' ')}
              </label>
            ))}
          </div>
          <button type="submit" style={{ background: '#007bff', color: '#fff', border: 'none', padding: '10px', marginTop: '10px', cursor: 'pointer' }}>Sign Up</button>
        </form>
      </div>
    </div>
  );
}
