import { supabaseAdmin } from '../../../lib/supabaseClient';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Fetch all users from Supabase Auth
    const { data: users, error } = await supabaseAdmin.auth.admin.listUsers();

    if (error) {
      console.error('Error fetching users:', error);
      return res.status(500).json({ error: 'Failed to fetch users' });
    }

    console.log('Raw users data:', JSON.stringify(users.users, null, 2));

    // Transform user data for frontend consumption
    const userData = users.users.map(user => {
      // Try multiple sources for email
      const email = user.email || 
                   user.user_metadata?.email || 
                   user.raw_user_meta_data?.email ||
                   user.identities?.[0]?.identity_data?.email ||
                   'No email found';

      console.log(`User ${user.id} email sources:`, {
        direct_email: user.email,
        user_metadata: user.user_metadata,
        raw_metadata: user.raw_user_meta_data,
        identities: user.identities
      });

      return {
        id: user.id,
        email: email,
        created_at: user.created_at,
        last_sign_in_at: user.last_sign_in_at,
        confirmed_at: user.confirmed_at,
        raw_user: user // For debugging
      };
    });

    res.status(200).json({
      users: userData,
      count: userData.length
    });

  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}