//// pages/enroll.js
import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useRouter } from 'next/router';

export default function EnrollPage() {
  const router = useRouter();
  const { temp_user_id } = router.query;
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password
      });
      if (error) throw error;

      // Link temp user rows to Auth user
      await supabase.from('users').update({ auth_user_id: data.user.id }).eq('id', temp_user_id);
      await supabase.from('accounts').update({ user_id: data.user.id }).eq('user_id', temp_user_id);

      setMessage('Enrollment successful! You can now log in to your dashboard.');
      setFormData({ email: '', password: '' });
    } catch (err) {
      setMessage(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', minHeight:'100vh', fontFamily:'Arial', textAlign:'center' }}>
      <h1>Enroll in Online Banking</h1>
      <p>User ID: <strong>{temp_user_id || 'Loading...'}</strong></p>
      <form onSubmit={handleSubmit} style={{ display:'flex', flexDirection:'column', gap:'10px', width:300 }}>
        <input type="email" name="email" placeholder="Email" required value={formData.email} onChange={handleChange} />
        <input type="password" name="password" placeholder="Password" required value={formData.password} onChange={handleChange} />
        <button type="submit" disabled={loading}>{loading ? 'Enrolling...' : 'Enroll Now'}</button>
      </form>
      {message && <p style={{ marginTop:20, color: message.startsWith('Error') ? 'red':'green' }}>{message}</p>}
    </div>
  );
}
