
// pages/login.js
import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link'; // Import Next.js Link component
import { supabase } from '../lib/supabaseClient'; // Import Supabase client

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();

    const { user, error: authError } = await supabase.auth.signIn({
      email,
      password,
    });

    if (authError) {
      setError(authError.message);
    } else {
      router.push('/dashboard'); // Redirect to the dashboard after successful login
    }
  };

  return (
    <div>
      {/* Header Section */}
      <header style={{ backgroundColor: '#001f3f', color: 'white', padding: '20px' }}>
        <div className="logo" style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Oakline Bank</div>
        <nav>
          <ul style={{ listStyle: 'none', display: 'flex', gap: '20px', margin: '0', padding: '0' }}>
            <li><Link href="/">Home</Link></li>
            <li><Link href="/signup">Sign Up</Link></li>
            <li><Link href="#contact">Contact</Link></li>
          </ul>
        </nav>
      </header>

      {/* Login Hero Section */}
      <section style={{ background: 'url(https://images.unsplash.com/photo-1556740764-3a42e75e1a54?auto=format&fit=crop&w=1400&q=80)', backgroundSize: 'cover', color: 'white', padding: '120px 20px', textAlign: 'center' }}>
        <h1 style={{ fontSize: '3rem', marginBottom: '20px' }}>Login to Your Account</h1>
        <p>Secure access to your Oakline Bank account anytime, anywhere.</p>
      </section>

      {/* Login Form Section */}
      <section id="login" style={{ padding: '40px 20px', textAlign: 'center' }}>
        <h2>Sign In</h2>
        <form onSubmit={handleLogin} style={{ maxWidth: '400px', margin: 'auto', background: 'white', padding: '40px', borderRadius: '10px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', textAlign: 'left' }}>
          <label htmlFor="email">Email Address</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="you@example.com"
            style={{ width: '100%', padding: '12px', margin: '10px 0 20px 0', border: '1px solid #ccc', borderRadius: '5px' }}
          />
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="Enter your password"
            style={{ width: '100%', padding: '12px', margin: '10px 0 20px 0', border: '1px solid #ccc', borderRadius: '5px' }}
          />
          <button type="submit" style={{ width: '100%', padding: '12px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '1rem' }}>
            Login
          </button>
          {error && <p style={{ color: 'red', marginTop: '15px' }}>{error}</p>}
          <p style={{ textAlign: 'center', marginTop: '15px' }}>
            <Link href="/forgot-password" style={{ color: '#28a745', textDecoration: 'none' }}>
              Forgot Password?
            </Link>
          </p>
        </form>
      </section>

      {/* Footer Section */}
      <footer style={{ backgroundColor: '#111', color: '#eee', padding: '60px 20px', textAlign: 'center' }}>
        <h2>About Oakline Bank</h2>
        <p>Oakline Bank was founded on the principles of trust, innovation, and customer-first banking. We have helped thousands of customers achieve financial success while embracing modern banking technology.</p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '30px', marginTop: '30px' }}>
          <img src="https://randomuser.me/api/portraits/men/34.jpg" alt="Founder" style={{ width: '100px', height: '100px', borderRadius: '50%', objectFit: 'cover' }} />
          <img src="https://randomuser.me/api/portraits/women/25.jpg" alt="Team Member" style={{ width: '100px', height: '100px', borderRadius: '50%', objectFit: 'cover' }} />
          <img src="https://randomuser.me/api/portraits/men/56.jpg" alt="Team Member" style={{ width: '100px', height: '100px', borderRadius: '50%', objectFit: 'cover' }} />
        </div>
        <p style={{ marginTop: '25px', fontSize: '14px', color: '#bbb' }}>Our dedicated team works around the clock to bring modern banking to your fingertips.</p>
      </footer>
    </div>
  );
};

export default Login;
