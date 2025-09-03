
// pages/applications.js
import { useState } from 'react';

export default function ApplicationForm() {
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
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const accountOptions = ['Checking', 'Savings', 'Business', 'Joint', 'Student'];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name === 'account_types') {
      let updatedAccounts = [...formData.account_types];
      if (checked) updatedAccounts.push(value);
      else updatedAccounts = updatedAccounts.filter((a) => a !== value);
      setFormData({ ...formData, account_types: updatedAccounts });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    // Frontend validation for SSN / ID
    if (formData.country === 'US' && !formData.ssn) {
      setMessage('SSN is required for US users.');
      setLoading(false);
      return;
    }
    if (formData.country !== 'US' && !formData.id_number) {
      setMessage('ID Number is required for non-US users.');
      setLoading(false);
      return;
    }
    if (formData.account_types.length === 0) {
      setMessage('Please select at least one account type.');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Submission failed');

      // Build the enrollment link with temp_user_id and pre-filled email
      const enrollLink = `https://oaklineworkspac-oakline-bank.repl.co/enroll?temp_user_id=${data.tempUserId}&email=${encodeURIComponent(formData.email)}`;

      setMessage(
        <span>
          Application received! Your first account number: <strong>{data.accountNumbers[0]}</strong>.<br/>
          <a href={enrollLink} target="_blank" style={{ color: '#0070f3', textDecoration: 'underline' }}>
            Click here to enroll in online banking
          </a>
        </span>
      );

      // Reset all fields
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
    } catch (err) {
      setMessage(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: '2rem auto', fontFamily: 'Arial, sans-serif' }}>
      <h1>Open a New Account</h1>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <input name="first_name" placeholder="First Name" value={formData.first_name} onChange={handleChange} required />
        <input name="middle_name" placeholder="Middle Name" value={formData.middle_name} onChange={handleChange} />
        <input name="last_name" placeholder="Last Name" value={formData.last_name} onChange={handleChange} required />
        <input name="mothers_maiden_name" placeholder="Mother's Maiden Name" value={formData.mothers_maiden_name} onChange={handleChange} />
        <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
        <input name="phone" placeholder="Phone" value={formData.phone} onChange={handleChange} />
        <input name="ssn" placeholder="SSN (US only)" value={formData.ssn} onChange={handleChange} />
        <input name="id_number" placeholder="ID Number (Non-US)" value={formData.id_number} onChange={handleChange} />
        <input type="date" name="dob" value={formData.dob} onChange={handleChange} required />
        <input name="address_line1" placeholder="Address Line 1" value={formData.address_line1} onChange={handleChange} required />
        <input name="address_line2" placeholder="Address Line 2" value={formData.address_line2} onChange={handleChange} />
        <input name="city" placeholder="City" value={formData.city} onChange={handleChange} required />
        <input name="state" placeholder="State" value={formData.state} onChange={handleChange} required />
        <input name="county" placeholder="County" value={formData.county} onChange={handleChange} />
        <select name="country" value={formData.country} onChange={handleChange} required>
          <option value="US">United States</option>
          <option value="GB">United Kingdom</option>
          <option value="CA">Canada</option>
          <option value="AU">Australia</option>
          <option value="DE">Germany</option>
        </select>
        <div>
          <label>Select Account Types:</label>
          {accountOptions.map((type) => (
            <div key={type}>
              <input
                type="checkbox"
                name="account_types"
                value={type}
                checked={formData.account_types.includes(type)}
                onChange={handleChange}
              />
              {type}
            </div>
          ))}
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Submitting...' : 'Submit Application'}
        </button>
      </form>
      {message && <div style={{ marginTop: '1rem', color: typeof message === 'string' && message.startsWith('Error') ? 'red' : 'green' }}>{message}</div>}
    </div>
  );
}
