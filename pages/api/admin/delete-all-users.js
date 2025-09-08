
import { supabaseAdmin } from '../../../lib/supabaseClient';

export default async function handler(req, res) {
  if (req.method !== 'DELETE') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { confirmation } = req.body;

    // Safety check - require explicit confirmation
    if (confirmation !== 'DELETE_ALL_USERS') {
      return res.status(400).json({ 
        error: 'Confirmation required. Send { "confirmation": "DELETE_ALL_USERS" } to proceed.' 
      });
    }

    console.log('Starting bulk user deletion process...');

    // Fetch all users from Supabase Auth
    const { data: users, error: listError } = await supabaseAdmin.auth.admin.listUsers();

    if (listError) {
      console.error('Error listing users:', listError);
      return res.status(500).json({ error: 'Failed to list users' });
    }

    if (!users || users.users.length === 0) {
      return res.status(200).json({ 
        message: 'No users found to delete',
        results: []
      });
    }

    console.log(`Found ${users.users.length} users to delete`);

    const results = [];

    // Delete each user and their related data
    for (const user of users.users) {
      const userEmail = user.email;
      const userId = user.id;
      
      try {
        console.log(`Deleting user: ${userEmail} (${userId})`);

        // Delete related data in order (to avoid foreign key constraints)
        
        // 1. Delete enrollments first
        const { error: enrollmentsError } = await supabaseAdmin
          .from('enrollments')
          .delete()
          .eq('email', userEmail);

        // 2. Delete applications
        const { error: applicationsError } = await supabaseAdmin
          .from('applications')
          .delete()
          .eq('email', userEmail);

        // 3. Try to delete accounts (handle column name issues)
        let accountsError = null;
        try {
          const { error: accError } = await supabaseAdmin
            .from('accounts')
            .delete()
            .eq('email', userEmail);
          accountsError = accError;
        } catch (accErr) {
          // Try with user_email if email column doesn't exist
          try {
            const { error: accError2 } = await supabaseAdmin
              .from('accounts')
              .delete()
              .eq('user_email', userEmail);
            accountsError = accError2;
          } catch (accErr2) {
            accountsError = accErr2;
          }
        }

        // 4. Try to delete from users table if it exists
        let usersError = null;
        try {
          const { error: uError } = await supabaseAdmin
            .from('users')
            .delete()
            .eq('email', userEmail);
          usersError = uError;
        } catch (uErr) {
          // Try with different column name
          try {
            const { error: uError2 } = await supabaseAdmin
              .from('users')
              .delete()
              .eq('user_email', userEmail);
            usersError = uError2;
          } catch (uErr2) {
            usersError = uErr2;
          }
        }

        // 5. Force delete the user from Supabase Auth with retry logic
        let deleteError = null;
        let authDeleted = false;
        
        for (let attempt = 1; attempt <= 3; attempt++) {
          try {
            const { error } = await supabaseAdmin.auth.admin.deleteUser(userId, true); // shouldSoftDelete = true to bypass constraints
            deleteError = error;
            
            if (!error) {
              authDeleted = true;
              break;
            }
            
            console.log(`Auth deletion attempt ${attempt} failed for ${userEmail}:`, error);
            
            if (attempt < 3) {
              await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2 seconds
            }
          } catch (err) {
            deleteError = err;
            console.log(`Auth deletion attempt ${attempt} threw error for ${userEmail}:`, err);
            
            if (attempt < 3) {
              await new Promise(resolve => setTimeout(resolve, 2000));
            }
          }
        }

        if (!authDeleted) {
          console.error(`Failed to delete auth user ${userEmail} after 3 attempts:`, deleteError);
          results.push({
            userId,
            email: userEmail,
            success: false,
            error: deleteError?.message || 'Auth deletion failed after retries',
            deletedEnrollments: !enrollmentsError,
            deletedAccounts: !accountsError,
            deletedApplications: !applicationsError,
            deletedUsers: !usersError,
            deletedAuth: false,
            attempts: 3
          });
        } else {
          console.log(`✅ Successfully deleted user: ${userEmail}`);
          results.push({
            userId,
            email: userEmail,
            success: true,
            deletedEnrollments: !enrollmentsError,
            deletedAccounts: !accountsError,
            deletedApplications: !applicationsError,
            deletedUsers: !usersError,
            deletedAuth: true
          });
        }

      } catch (userError) {
        console.error(`Error processing user ${userEmail}:`, userError);
        results.push({
          userId,
          email: userEmail,
          success: false,
          error: userError.message
        });
      }
    }

    const successCount = results.filter(r => r.success).length;
    const failureCount = results.filter(r => !r.success).length;

    console.log(`Bulk deletion completed: ${successCount} successful, ${failureCount} failed`);

    res.status(200).json({
      message: `Bulk user deletion completed`,
      summary: {
        totalUsers: users.users.length,
        successful: successCount,
        failed: failureCount
      },
      results
    });

  } catch (error) {
    console.error('Bulk delete users error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
