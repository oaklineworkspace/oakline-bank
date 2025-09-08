
import { supabaseAdmin } from './lib/supabaseClient.js';

async function cleanupStuckUsers() {
  try {
    console.log('🔍 Checking for stuck users...');
    
    // Get all auth users
    const { data: authUsers, error: authError } = await supabaseAdmin.auth.admin.listUsers();
    if (authError) {
      console.error('Error fetching auth users:', authError);
      return;
    }

    console.log(`Found ${authUsers.users.length} auth users`);

    for (const user of authUsers.users) {
      const userEmail = user.email;
      const userId = user.id;
      
      console.log(`\n🔧 Processing user: ${userEmail}`);

      try {
        // Try to delete everything manually in the correct order
        
        // 1. Delete enrollments
        const { error: enrollError } = await supabaseAdmin
          .from('enrollments')
          .delete()
          .eq('email', userEmail);
        
        console.log(`   Enrollments: ${enrollError ? '❌ ' + enrollError.message : '✅ Deleted'}`);

        // 2. Delete accounts  
        const { error: accountError } = await supabaseAdmin
          .from('accounts')
          .delete()
          .eq('email', userEmail);
        
        console.log(`   Accounts: ${accountError ? '❌ ' + accountError.message : '✅ Deleted'}`);

        // 3. Delete applications
        const { error: appError } = await supabaseAdmin
          .from('applications')
          .delete()
          .eq('email', userEmail);
        
        console.log(`   Applications: ${appError ? '❌ ' + appError.message : '✅ Deleted'}`);

        // 4. Delete from users table
        const { error: userError } = await supabaseAdmin
          .from('users')
          .delete()
          .eq('email', userEmail);
        
        console.log(`   Users table: ${userError ? '❌ ' + userError.message : '✅ Deleted'}`);

        // 5. Try to delete auth user with retry logic
        let authDeleted = false;
        for (let attempt = 1; attempt <= 3; attempt++) {
          console.log(`   Auth deletion attempt ${attempt}/3...`);
          
          const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(userId);
          
          if (!deleteError) {
            console.log(`   Auth User: ✅ Deleted on attempt ${attempt}`);
            authDeleted = true;
            break;
          } else {
            console.log(`   Auth User: ❌ Attempt ${attempt} failed: ${deleteError.message}`);
            
            if (attempt < 3) {
              console.log('   Waiting 2 seconds before retry...');
              await new Promise(resolve => setTimeout(resolve, 2000));
            }
          }
        }

        if (!authDeleted) {
          console.log(`   🚨 STUCK USER: ${userEmail} (${userId}) - Auth deletion failed after 3 attempts`);
        }

      } catch (error) {
        console.error(`   💥 Unexpected error processing ${userEmail}:`, error);
      }
    }

    console.log('\n🎯 Cleanup completed!');

  } catch (error) {
    console.error('💥 Script error:', error);
  }
}

// Run the cleanup
cleanupStuckUsers();
