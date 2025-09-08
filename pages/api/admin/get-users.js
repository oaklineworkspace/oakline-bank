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
      // Check if user is soft-deleted
      const isDeleted = user.deleted_at !== null;
      
      // Try multiple sources for email
      const email = user.email || 
                   user.user_metadata?.email || 
                   user.raw_user_meta_data?.email ||
                   user.identities?.[0]?.identity_data?.email ||
                   'No email found';

      // Check if email looks encrypted/hashed
      const isEmailEncrypted = email && email.length > 40 && !email.includes('@');

      console.log(`User ${user.id} analysis:`, {
        is_deleted: isDeleted,
        direct_email: user.email,
        email_encrypted: isEmailEncrypted,
        user_metadata: user.user_metadata,
        raw_metadata: user.raw_user_meta_data,
        identities: user.identities,
        deleted_at: user.deleted_at
      });

      return {
        id: user.id,
        email: isEmailEncrypted ? `[ENCRYPTED] ${email.substring(0, 20)}...` : email,
        created_at: user.created_at,
        last_sign_in_at: user.last_sign_in_at,
        confirmed_at: user.confirmed_at,
        deleted_at: user.deleted_at,
        status: isDeleted ? 'SOFT_DELETED' : 'ACTIVE',
        raw_user: user // For debugging
      };
    });

    // Also try to get users from our database tables for cross-reference
    try {
      const { data: dbUsers, error: dbError } = await supabaseAdmin
        .from('applications')
        .select('email, full_name, created_at')
        .order('created_at', { ascending: false });

      if (!dbError && dbUsers) {
        console.log('Database users found:', dbUsers.length);
        userData.forEach(authUser => {
          const matchingDbUser = dbUsers.find(dbUser => 
            dbUser.email && authUser.email && 
            !authUser.email.startsWith('[ENCRYPTED]') &&
            dbUser.email.toLowerCase() === authUser.email.toLowerCase()
          );
          if (matchingDbUser) {
            authUser.db_email = matchingDbUser.email;
            authUser.full_name = matchingDbUser.full_name;
          }
        });
      }
    } catch (dbError) {
      console.log('Could not fetch database users for cross-reference:', dbError.message);
    }

    res.status(200).json({
      users: userData,
      count: userData.length
    });

  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}