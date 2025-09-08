
import { supabaseAdmin } from './lib/supabaseClient.js';

async function deleteSpecificUser() {
  const userId = '6d4ab9b2-a685-49c9-9d51-bf34cca83128';
  
  try {
    console.log(`Attempting to delete user: ${userId}`);
    
    // First, get user details to confirm existence
    const { data: user, error: getUserError } = await supabaseAdmin.auth.admin.getUserById(userId);
    
    if (getUserError || !user) {
      console.error('User not found:', getUserError);
      return;
    }
    
    console.log(`Found user: ${user.email} (created: ${user.created_at})`);
    
    // Delete related data first
    const userEmail = user.email;
    
    // Delete applications
    const { error: applicationsError } = await supabaseAdmin
      .from('applications')
      .delete()
      .eq('email', userEmail);
    
    if (applicationsError) {
      console.warn('Warning: Could not delete applications data:', applicationsError);
    } else {
      console.log('✓ Deleted applications data');
    }
    
    // Delete accounts
    const { error: accountsError } = await supabaseAdmin
      .from('accounts')
      .delete()
      .eq('email', userEmail);
    
    if (accountsError) {
      console.warn('Warning: Could not delete accounts data:', accountsError);
    } else {
      console.log('✓ Deleted accounts data');
    }
    
    // Delete enrollments
    const { error: enrollmentsError } = await supabaseAdmin
      .from('enrollments')
      .delete()
      .eq('email', userEmail);
    
    if (enrollmentsError) {
      console.warn('Warning: Could not delete enrollments data:', enrollmentsError);
    } else {
      console.log('✓ Deleted enrollments data');
    }
    
    // Finally, delete the auth user
    const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(userId);
    
    if (deleteError) {
      console.error('Error deleting user from auth:', deleteError);
    } else {
      console.log('✅ User deleted successfully from Supabase Auth');
      console.log(`Deleted user: ${userEmail} (${userId})`);
    }
    
  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

// Run the deletion
deleteSpecificUser();
