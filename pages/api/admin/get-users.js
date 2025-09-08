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
      // Try to get users from different sources
      let usersData = [];
      let error = null;

      // Try profiles table first
      try {
        const { data: profileData, error: profileError } = await supabaseAdmin
          .from('profiles')
          .select(`
            *,
            applications (
              first_name,
              middle_name, 
              last_name,
              phone,
              created_at
            )
          `)
          .order('created_at', { ascending: false });

        if (profileError) {
          console.log('Profiles table query failed:', profileError);
        } else if (profileData && profileData.length > 0) {
          usersData = profileData.map(profile => ({
            id: profile.user_id,
            email: profile.email,
            full_name: `${profile.first_name || ''} ${profile.middle_name ? profile.middle_name + ' ' : ''}${profile.last_name || ''}`.trim(),
            created_at: profile.created_at,
            phone_number: profile.phone,
            source: 'profiles_table'
          }));
        }
      } catch (e) {
        console.log('Profiles table access error:', e.message);
      }

      // If no users found, try enrollments table
      if (usersData.length === 0) {
        try {
          const { data: enrollmentData, error: enrollmentError } = await supabaseAdmin
            .from('enrollments')
            .select('*')
            .order('created_at', { ascending: false });

          if (enrollmentError) {
            console.log('Enrollments table query failed:', enrollmentError);
          } else if (enrollmentData && enrollmentData.length > 0) {
            // Get application data for each enrollment
            for (const enrollment of enrollmentData) {
              try {
                const { data: appData } = await supabaseAdmin
                  .from('applications')
                  .select('*')
                  .eq('id', enrollment.application_id)
                  .single();

                if (appData) {
                  usersData.push({
                    id: enrollment.id,
                    email: enrollment.email,
                    full_name: appData.first_name + (appData.middle_name ? ' ' + appData.middle_name : '') + ' ' + appData.last_name,
                    created_at: enrollment.created_at,
                    phone_number: appData.phone,
                    source: 'enrollments_table'
                  });
                }
              } catch (err) {
                console.log('Error fetching application for enrollment:', err.message);
              }
            }
          }
        } catch (e) {
          console.log('Enrollments table access error:', e.message);
        }
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