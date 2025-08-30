
import { useState } from 'react';

export default function CreateAccountForm() {
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
    accountTypes: [], // Store the selected account types here
  });

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const handleAccountTypeChange = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setFormData((prevData) => ({
        ...prevData,
        accountTypes: [...prevData.accountTypes, value],
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        accountTypes: prevData.accountTypes.filter((item) => item !== value),
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch('/api/account-management', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    if (response.ok) {
      // Handle successful submission, show confirmation message
      alert('Account created successfully!');
    } else {
      // Handle errors
      alert('Error creating account!');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Create Account</h3>
      
      <input
        type="text"
        id="firstName"
        placeholder="First Name"
        value={formData.firstName}
        onChange={handleInputChange}
        required
      />
      <input
        type="text"
        id="middleName"
        placeholder="Middle Name (Optional)"
        value={formData.middleName}
        onChange={handleInputChange}
      />
      <input
        type="text"
        id="lastName"
        placeholder="Last Name"
        value={formData.lastName}
        onChange={handleInputChange}
        required
      />
      <input
        type="date"
        id="dob"
        value={formData.dob}
        onChange={handleInputChange}
        required
      />
      <input
        type="text"
        id="ssn"
        placeholder="SSN (XXX-XX-XXXX)"
        pattern="\d{3}-\d{2}-\d{4}"
        value={formData.ssn}
        onChange={handleInputChange}
        required
      />
      <input
        type="text"
        id="maidenName"
        placeholder="Mother's Maiden Name"
        value={formData.maidenName}
        onChange={handleInputChange}
        required
      />
      <input
        type="text"
        id="address"
        placeholder="Address"
        value={formData.address}
        onChange={handleInputChange}
        required
      />
      <input
        type="text"
        id="city"
        placeholder="City"
        value={formData.city}
        onChange={handleInputChange}
        required
      />
      <input
        type="text"
        id="state"
        placeholder="State/Province"
        value={formData.state}
        onChange={handleInputChange}
        required
      />
      <input
        type="text"
        id="zip"
        placeholder="Zip / Postal Code"
        pattern="\d{5}"
        value={formData.zip}
        onChange={handleInputChange}
        required
      />
      <select id="country" value={formData.country} onChange={handleInputChange} required>
        <option value="">Select Country</option>
        {/* Add countries here */}
      </select>

      <div>
        <h3>Select Account Type</h3>
        <label>
          <input
            type="checkbox"
            value="Personal"
            onChange={handleAccountTypeChange}
          />
          Personal
        </label>
        <label>
          <input
            type="checkbox"
            value="Business"
            onChange={handleAccountTypeChange}
          />
          Business
        </label>
        <label>
          <input
            type="checkbox"
            value="Savings"
            onChange={handleAccountTypeChange}
          />
          Savings
        </label>
        <label>
          <input
            type="checkbox"
            value="Checking"
            onChange={handleAccountTypeChange}
          />
          Checking
        </label>
        <label>
          <input
            type="checkbox"
            value="Investment"
            onChange={handleAccountTypeChange}
          />
          Investment
        </label>
        <label>
          <input
            type="checkbox"
            value="Loan"
            onChange={handleAccountTypeChange}
          />
          Loan
        </label>
        <label>
          <input
            type="checkbox"
            value="Crypto"
            onChange={handleAccountTypeChange}
          />
          Crypto
        </label>
        <label>
          <input
            type="checkbox"
            value="Retirement"
            onChange={handleAccountTypeChange}
          />
          Retirement
        </label>
        <label>
          <input
            type="checkbox"
            value="Trust"
            onChange={handleAccountTypeChange}
          />
          Trust
        </label>
        <label>
          <input
            type="checkbox"
            value="CD" // Certificate of Deposit
            onChange={handleAccountTypeChange}
          />
          Certificate of Deposit (CD)
        </label>
        <label>
          <input
            type="checkbox"
            value="Mortgage"
            onChange={handleAccountTypeChange}
          />
          Mortgage
        </label>
        <label>
          <input
            type="checkbox"
            value="Home Equity"
            onChange={handleAccountTypeChange}
          />
          Home Equity Line of Credit (HELOC)
        </label>
        <label>
          <input
            type="checkbox"
            value="Student Loan"
            onChange={handleAccountTypeChange}
          />
          Student Loan
        </label>
        <label>
          <input
            type="checkbox"
            value="Auto Loan"
            onChange={handleAccountTypeChange}
          />
          Auto Loan
        </label>
      </div>

      <button type="submit">Create Account</button>
    </form>
  );
}
