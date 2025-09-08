
import { supabaseAdmin } from './lib/supabaseAdmin.js';

async function forceCleanupUser() {
  const targetUserId = '88b64128-a58d-414d-aceb-76714d65a7e3';
  
  console.log('🧹 Force cleaning up user:', targetUserId);
  
  try {
    // 1. Delete from all related tables first
    console.log('\n1️⃣ Cleaning database tables...');
    
    // Delete enrollments
    const { error: enrollError } = await supabaseAdmin
      .from('enrollments')
      .delete()
      .or(`user_id.eq.${targetUserId},application_id.eq.${targetUserId}`);
    
    if (enrollError) {
      console.log('❌ Enrollments cleanup error:', enrollError.message);
    } else {
      console.log('✅ Enrollments cleaned');
    }

    // Delete applications
    const { error: appError } = await supabaseAdmin
      .from('applications')
      .delete()
      .eq('id', targetUserId);
    
    if (appError) {
      console.log('❌ Applications cleanup error:', appError.message);
    } else {
      console.log('✅ Applications cleaned');
    }

    // Delete accounts (if exists)
    const { error: accountError } = await supabaseAdmin
      .from('accounts')
      .delete()
      .eq('user_id', targetUserId);
    
    if (accountError) {
      console.log('❌ Accounts cleanup error:', accountError.message);
    } else {
      console.log('✅ Accounts cleaned');
    }

    // 2. Now try to delete from auth
    console.log('\n2️⃣ Attempting auth cleanup...');
    
    // Method 1: Normal deletion
    try {
      const { error: authError1 } = await supabaseAdmin.auth.admin.deleteUser(targetUserId);
      if (authError1) {
        console.log('❌ Normal auth deletion failed:', authError1.message);
        
        // Method 2: Try with shouldSoftDelete: false
        console.log('🔄 Trying hard delete...');
        const { error: authError2 } = await supabaseAdmin.auth.admin.deleteUser(targetUserId, false);
        if (authError2) {
          console.log('❌ Hard delete failed:', authError2.message);
          
          // Method 3: Update user to mark as deleted manually
          console.log('🔄 Trying manual soft delete update...');
          
          // This is a direct database approach (use with extreme caution)
          const { error: rawUpdateError } = await supabaseAdmin
            .rpc('delete_auth_user_forcefully', { user_uuid: targetUserId });
          
          if (rawUpdateError) {
            console.log('❌ Manual deletion failed:', rawUpdateError.message);
            console.log('🏳️ User may need manual cleanup from Supabase dashboard');
          } else {
            console.log('✅ Manual deletion successful');
          }
        } else {
          console.log('✅ Hard delete successful');
        }
      } else {
        console.log('✅ Normal deletion successful');
      }
    } catch (error) {
      console.log('❌ Auth deletion exception:', error.message);
    }

    console.log('\n🎯 Cleanup attempt completed!');
    
    // Verify cleanup
    console.log('\n3️⃣ Verifying cleanup...');
    const { data: remainingUsers } = await supabaseAdmin.auth.admin.listUsers();
    const userStillExists = remainingUsers.users.find(u => u.id === targetUserId);
    
    if (userStillExists) {
      console.log('⚠️ User still exists in auth:', userStillExists.deleted_at ? 'SOFT_DELETED' : 'ACTIVE');
    } else {
      console.log('✅ User successfully removed from auth');
    }

  } catch (error) {
    console.error('Force cleanup error:', error);
  }
}

forceCleanupUser();
