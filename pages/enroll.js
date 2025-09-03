// pages/enroll.js
import { useState } from 'react';

export default function EnrollPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    accountNumber: '',
    ssnLast4: '',
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    if (formData.password !== formData.confirmPassword) {
      setMessage('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/enroll', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (res.ok) {
        setMessage('Enrollment successful! You can now log in.');
        setFormData({
          email: '',
          password: '',
          confirmPassword: '',
          accountNumber: '',
          ssnLast4: '',
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
    <div className="container" style={{ maxWidth: '600px', margin: '0 auto', padding: '40px' }}>
      <h1>Enroll in Online Banking</h1>
      <p style={{ color: '#555' }}>Enter your details to create an online banking login.</p>
      {message && <p style={{ color: message.startsWith('Error') ? 'red' : 'green' }}>{message}</p>}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <input
          type="text"
          name="accountNumber"
          placeholder="Account Number"
          required
          value={formData.accountNumber}
          onChange={handleChange}
        />
        <input
          type="text"
          name="ssnLast4"
          placeholder="Last 4 digits of SSN"
          required
          value={formData.ssnLast4}
          onChange={handleChange}
        />
        <input
          type="email"
          name="email"
          placeholder="Email Address"
          required
          value={formData.email}
          onChange={handleChange}
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          required
          value={formData.password}
          onChange={handleChange}
        />
        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm Password"
          required
          value={formData.confirmPassword}
          onChange={handleChange}
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Enrolling...' : 'Enroll'}
        </button>
      </form>
    </div>
  );
}
