// components/CTAButtons.js
import Link from 'next/link';

export default function CTAButtons() {
  return (
    <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', justifyContent: 'center', marginTop: '30px' }}>
      <Link href="/application">
        <button style={buttonStyle}>Apply for an Account</button>
      </Link>
      <Link href="/enroll">
        <button style={{ ...buttonStyle, backgroundColor: '#28a745' }}>Enroll in Online Banking</button>
      </Link>
    </div>
  );
}

const buttonStyle = {
  padding: '15px 30px',
  fontSize: '16px',
  fontWeight: '600',
  color: 'white',
  backgroundColor: '#0070f3',
  border: 'none',
  borderRadius: '8px',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
};
