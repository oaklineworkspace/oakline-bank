
// pages/applications.js
import { useState } from 'react';

export default function ApplicationPage() {
  const [formData, setFormData] = useState({
    first_name: '',
    middle_name: '',
    last_name: '',
    mothers_maiden_name: '',
    email: '',
    phone: '',
    ssn: '',
    id_number: '',
    dob: '',
    address_line1: '',
    address_line2: '',
    city: '',
    state: '',
    county: '',
    country: 'US',
    account_types: []
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const ACCOUNT_TYPES = ['Checking', 'Savings', 'Business', 'Joint', 'Student'];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === 'checkbox') {
      setFormData((prev) => {
        const currentTypes = prev.account_types;
        if (checked) {
          return { ...prev, account_types: [...currentTypes, value] };
        } else {
          return { ...prev, account_types: currentTypes.filter((t) => t !== value) };
        }
      });
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const validateForm = () => {
    // Email must exist
    if (!formData.email) return 'Email is required';

    // DOB must be valid
    if (!formData.dob) return 'Date of birth is required';

    // Country must exist
    if (!formData.country) return 'Country is required';

    // SSN for US, ID number for non-US
    if (formData.country === 'US' && !/^\d{3}-\d{2}-\d{4}$/.test(formData.ssn)) {
      return 'SSN must be in format XXX-XX-XXXX';
    }
    if (formData.country !== 'US' && !formData.id_number) {
      return 'ID Number is required for non-US users';
    }

    // At least one account type
    if (formData.account_types.length === 0) return 'Select at least one account type';

    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    const error = validateForm();
    if (error) {
      setMessage(`Error: ${error}`);
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (res.ok) {
        setMessage('Application submitted successfully! Please check your email to enroll in online banking.');
        setFormData({
          first_name: '',
          middle_name: '',
          last_name: '',
          mothers_maiden_name: '',
          email: '',
          phone: '',
          ssn: '',
          id_number: '',
          dob: '',
          address_line1: '',
          address_line2: '',
          city: '',
          state: '',
          county: '',
          country: 'US',
          account_types: []
        });
      } else {
        setMessage(`Error: ${data.error || 'Something went wrong'}`);
      }
    } catch (err) {
      setMessage(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '700px', margin: '0 auto', padding: '40px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Bank Application Form</h1>
      {message && <p style={{ color: message.startsWith('Error') ? 'red' : 'green' }}>{message}</p>}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <input type="text" name="first_name" placeholder="First Name" required value={formData.first_name} onChange={handleChange} />
        <input type="text" name="middle_name" placeholder="Middle Name" value={formData.middle_name} onChange={handleChange} />
        <input type="text" name="last_name" placeholder="Last Name" required value={formData.last_name} onChange={handleChange} />
        <input type="text" name="mothers_maiden_name" placeholder="Mother's Maiden Name" value={formData.mothers_maiden_name} onChange={handleChange} />
        <input type="email" name="email" placeholder="Email" required value={formData.email} onChange={handleChange} />
        <input type="text" name="phone" placeholder="Phone" value={formData.phone} onChange={handleChange} />
        {formData.country === 'US' ? (
          <input type="text" name="ssn" placeholder="SSN (XXX-XX-XXXX)" value={formData.ssn} onChange={handleChange} />
        ) : (
          <input type="text" name="id_number" placeholder="ID Number" value={formData.id_number} onChange={handleChange} />
        )}
        <input type="date" name="dob" placeholder="Date of Birth" value={formData.dob} onChange={handleChange} />
        <input type="text" name="address_line1" placeholder="Address Line 1" required value={formData.address_line1} onChange={handleChange} />
        <input type="text" name="address_line2" placeholder="Address Line 2" value={formData.address_line2} onChange={handleChange} />
        <input type="text" name="city" placeholder="City" required value={formData.city} onChange={handleChange} />
        <input type="text" name="state" placeholder="State" required value={formData.state} onChange={handleChange} />
        <input type="text" name="county" placeholder="County" value={formData.county} onChange={handleChange} />
        <select name="country" value={formData.country} onChange={handleChange}>
          <option value="US">United States</option>
          <option value="GB">United Kingdom</option>
          <option value="CA">Canada</option>
          <option value="AU">Australia</option>
          <option value="DE">Germany</option>
        </select>

        <div>
          <p>Select Account Types:</p>
          {ACCOUNT_TYPES.map((type) => (
            <label key={type} style={{ display: 'block' }}>
              <input
                type="checkbox"
                name="account_types"
                value={type}
                checked={formData.account_types.includes(type)}
                onChange={handleChange}
              /> {type}
            </label>
          ))}
        </div>

        <button type="submit" disabled={loading} style={{ padding: '10px', backgroundColor: '#0070f3', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
          {loading ? 'Submitting...' : 'Submit Application'}
        </button>
      </form>
    </div>
  );
}
