
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useRouter } from 'next/router';

export default function Dashboard() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchUserData = async () => {
      const user = supabase.auth.user();
      if (!user) {
        router.push('/login'); // Redirect to login if not authenticated
        return;
      }

      // Fetch user data from Supabase
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error) {
        console.log('Error fetching user data:', error.message);
        return;
      }

      setUserData(data);
      setLoading(false);
    };

    fetchUserData();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="dashboard-container">
      <h2>Welcome, {userData.first_name}!</h2>
      <p>Account Number: {userData.account_number}</p>
      <p>Status: {userData.status}</p>

      <button onClick={handleLogout}>Logout</button>

      {/* Display user-specific data like balance, transactions, etc. */}
      <div>
        <h3>Your Account Information</h3>
        <p>Address: {userData.address}</p>
        <p>City: {userData.city}</p>
        <p>State: {userData.state}</p>
        <p>Country: {userData.country}</p>
      </div>
    </div>
  );
}
