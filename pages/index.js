// pages/index.js
import React from 'react';
import Link from 'next/link';

const HomePage = () => {
  return (
    <div style={{ padding: '40px', textAlign: 'center' }}>
      <h1>Welcome to Oakline Bank</h1>
      <p>Your homepage is live!</p>

      <div style={{ marginTop: '20px' }}>
        <Link href="/signup">Go to Signup Page</Link>
      </div>

      <div style={{ marginTop: '20px' }}>
        <Link href="/login">Go to Login Page</Link>
      </div>
    </div>
  );
};

export default HomePage;
