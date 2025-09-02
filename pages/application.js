
// pages/application.js

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
    country: '',
    account_types: []
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    if (formData.account_types.length === 0) {
      setMessage('Please select at least one account type.');
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
        setMessage('Application submitted successfully!');
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
          country: '',
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
    <div className="container" style={{ maxWidth: '700px', margin: '0 auto', padding: '40px' }}>
      <h1>Bank Application Form</h1>
      {message && <p style={{ color: message.startsWith('Error') ? 'red' : 'green' }}>{message}</p>}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <input type="text" name="first_name" placeholder="First Name" required value={formData.first_name} onChange={handleChange} />
        <input type="text" name="middle_name" placeholder="Middle Name" value={formData.middle_name} onChange={handleChange} />
        <input type="text" name="last_name" placeholder="Last Name" required value={formData.last_name} onChange={handleChange} />
        <input type="text" name="mothers_maiden_name" placeholder="Mother's Maiden Name" value={formData.mothers_maiden_name} onChange={handleChange} />
        <input type="email" name="email" placeholder="Email" required value={formData.email} onChange={handleChange} />
        <input type="text" name="phone" placeholder="Phone" value={formData.phone} onChange={handleChange} />
        <input type="text" name="ssn" placeholder="SSN / National ID" value={formData.ssn} onChange={handleChange} />
        <input type="text" name="id_number" placeholder="ID Number" value={formData.id_number} onChange={handleChange} />
        <input type="date" name="dob" placeholder="Date of Birth" value={formData.dob} onChange={handleChange} />
        <input type="text" name="address_line1" placeholder="Address Line 1" required value={formData.address_line1} onChange={handleChange} />
        <input type="text" name="address_line2" placeholder="Address Line 2" value={formData.address_line2} onChange={handleChange} />
        <input type="text" name="city" placeholder="City" required value={formData.city} onChange={handleChange} />
        <input type="text" name="state" placeholder="State" required value={formData.state} onChange={handleChange} />
        <input type="text" name="county" placeholder="County" value={formData.county} onChange={handleChange} />
        <input type="text" name="country" placeholder="Country" required value={formData.country} onChange={handleChange} />

        <div>
          <p>Select Account Types:</p>
          {['Checking', 'Savings', 'Business', 'Joint', 'Student'].map((type) => (
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

        <button type="submit" disabled={loading}>{loading ? 'Submitting...' : 'Submit Application'}</button>
      </form>
    </div>
  );
}

// No need for getStaticProps or getServerSideProps unless fetching external data
