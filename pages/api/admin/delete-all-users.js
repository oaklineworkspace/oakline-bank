
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

        // Delete related applications
        const { error: applicationsError } = await supabaseAdmin
          .from('applications')
          .delete()
          .eq('email', userEmail);

        // Delete related accounts
        const { error: accountsError } = await supabaseAdmin
          .from('accounts')
          .delete()
          .eq('email', userEmail);

        // Delete related enrollments
        const { error: enrollmentsError } = await supabaseAdmin
          .from('enrollments')
          .delete()
          .eq('email', userEmail);

        // Delete the user from Supabase Auth
        const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(userId);

        if (deleteError) {
          console.error(`Failed to delete user ${userEmail}:`, deleteError);
          results.push({
            userId,
            email: userEmail,
            success: false,
            error: deleteError.message,
            deletedApplications: !applicationsError,
            deletedAccounts: !accountsError,
            deletedEnrollments: !enrollmentsError
          });
        } else {
          console.log(`✅ Successfully deleted user: ${userEmail}`);
          results.push({
            userId,
            email: userEmail,
            success: true,
            deletedApplications: !applicationsError,
            deletedAccounts: !accountsError,
            deletedEnrollments: !enrollmentsError
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
