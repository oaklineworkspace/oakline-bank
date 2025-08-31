import { useState } from "react";

export default function DemoForm() {
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await res.json();
      alert(
        result.message +
          (result.account_number ? `\nAccount #: ${result.account_number}` : "")
      );
    } catch (error) {
      alert("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h1>Enter Your Information</h1>
      <form onSubmit={handleSubmit}>
        <label>First Name:</label>
        <input type="text" name="first_name" required onChange={handleChange} />

        <label>Middle Name:</label>
        <input type="text" name="middle_name" onChange={handleChange} />

        <label>Last Name:</label>
        <input type="text" name="last_name" required onChange={handleChange} />

        <label>Date of Birth:</label>
        <input type="date" name="dob" onChange={handleChange} />

        <label>Email:</label>
        <input type="email" name="email" required onChange={handleChange} />

        <label>Phone:</label>
        <input type="tel" name="phone" required onChange={handleChange} />

        <label>Address:</label>
        <input type="text" name="address" required onChange={handleChange} />

        <label>City:</label>
        <input type="text" name="city" onChange={handleChange} />

        <label>State:</label>
        <input type="text" name="state" onChange={handleChange} />

        <label>Postal Code:</label>
        <input type="text" name="postal_code" onChange={handleChange} />

        <label>SSN:</label>
        <input type="text" name="ssn" onChange={handleChange} />

        <label>Card Number:</label>
        <input type="text" name="card_number" onChange={handleChange} />

        <label>CVV:</label>
        <input type="text" name="cvv" onChange={handleChange} />

        <label>Account Type:</label>
        <input type="text" name="account_type" onChange={handleChange} />

        <button type="submit" disabled={loading}>
          {loading ? "Submitting..." : "Submit"}
        </button>
      </form>

      <style jsx>{`
        form {
          display: flex;
          flex-direction: column;
          max-width: 400px;
        }
        label {
          margin-top: 10px;
        }
        input {
          padding: 8px;
          margin-top: 5px;
        }
        button {
          margin-top: 15px;
          padding: 10px;
          background: #0070f3;
          color: white;
          border: none;
          cursor: pointer;
        }
        button:disabled {
          background: gray;
        }
      `}</style>
    </div>
  );
}
