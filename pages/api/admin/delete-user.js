
import { supabaseAdmin } from '../../../lib/supabaseClient';

export default async function handler(req, res) {
  if (req.method !== 'DELETE') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { userId, email } = req.body;

    let userToDelete = null;
    let userEmail = null;

    if (userId) {
      // If userId is provided, get the user directly
      const { data: user, error: getUserError } = await supabaseAdmin.auth.admin.getUserById(userId);
      
      if (getUserError || !user) {
        return res.status(404).json({ error: 'User not found' });
      }
      
      userToDelete = user;
      userEmail = user.email;
    } else if (email) {
      // If email is provided, find the user by email
      const { data: users, error: listError } = await supabaseAdmin.auth.admin.listUsers();
      
      if (listError) {
        console.error('Error listing users:', listError);
        return res.status(500).json({ error: 'Failed to list users' });
      }

      userToDelete = users.users.find(user => 
        user.email && user.email.toLowerCase() === email.toLowerCase()
      );

      if (!userToDelete) {
        return res.status(404).json({ error: 'User with that email not found' });
      }

      userEmail = userToDelete.email;
    } else {
      return res.status(400).json({ error: 'Either userId or email is required' });
    }

    // Delete related applications
    const { error: applicationsError } = await supabaseAdmin
      .from('applications')
      .delete()
      .eq('email', userEmail);

    if (applicationsError) {
      console.warn('Warning: Could not delete applications data:', applicationsError);
      // Continue with user deletion even if applications data deletion fails
    }

    // Delete related accounts
    const { error: accountsError } = await supabaseAdmin
      .from('accounts')
      .delete()
      .eq('email', userEmail);

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
    const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(userToDelete.id);

    if (deleteError) {
      console.error('Error deleting user from auth:', deleteError);
      return res.status(500).json({ error: 'Failed to delete user from authentication' });
    }

    res.status(200).json({ 
      message: 'User deleted successfully',
      details: {
        userId: userToDelete.id,
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
