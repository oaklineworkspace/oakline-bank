
import { supabaseAdmin } from '../../../lib/supabaseClient';

export default async function handler(req, res) {
  if (req.method !== 'DELETE') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { userId } = req.body;

  if (!userId) {
    return res.status(400).json({ error: 'User ID is required' });
  }

  try {
    // First, get user details to find associated application data
    const { data: user, error: userError } = await supabaseAdmin.auth.admin.getUserById(userId);
    
    if (userError) {
      console.error('Error fetching user:', userError);
      return res.status(404).json({ error: 'User not found' });
    }

    const userEmail = user.user.email;

    // Delete related data from applications table
    const { error: applicationsError } = await supabaseAdmin
      .from('applications')
      .delete()
      .eq('email', userEmail);

    if (applicationsError) {
      console.warn('Warning: Could not delete applications data:', applicationsError);
      // Continue with user deletion even if application data deletion fails
    }

    // Delete related data from accounts table (if linked to applications)
    const { error: accountsError } = await supabaseAdmin
      .from('accounts')
      .delete()
      .in('application_id', 
        supabaseAdmin
          .from('applications')
          .select('id')
          .eq('email', userEmail)
      );

    if (accountsError) {
      console.warn('Warning: Could not delete accounts data:', accountsError);
      // Continue with user deletion even if accounts data deletion fails
    }

    // Delete related enrollments
    const { error: enrollmentsError } = await supabaseAdmin
      .from('enrollments')
      .delete()
      .eq('email', userEmail);

    if (enrollmentsError) {
      console.warn('Warning: Could not delete enrollments data:', enrollmentsError);
    }

    // Finally, delete the user from Supabase Auth
    const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(userId);

    if (deleteError) {
      console.error('Error deleting user from auth:', deleteError);
      return res.status(500).json({ error: 'Failed to delete user from authentication' });
    }

    res.status(200).json({ 
      message: 'User deleted successfully',
      details: {
        userId: userId,
        email: userEmail,
        deletedApplications: !applicationsError,
        deletedAccounts: !accountsError,
        deletedEnrollments: !enrollmentsError
      }
    });

  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
