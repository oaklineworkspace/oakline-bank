
import { supabaseAdmin } from './lib/supabaseClient.js';

async function forceDeleteStuckUsers() {
  try {
    console.log('🔍 Starting aggressive cleanup of stuck users...');
    
    // Get all auth users
    const { data: authUsers, error: authError } = await supabaseAdmin.auth.admin.listUsers();
    if (authError) {
      console.error('Error fetching auth users:', authError);
      return;
    }

    console.log(`Found ${authUsers.users.length} auth users to process`);

    for (const user of authUsers.users) {
      const userEmail = user.email;
      const userId = user.id;
      
      console.log(`\n🔧 Aggressively processing user: ${userEmail}`);

      try {
        // Try different table/column combinations for cleanup
        
        // Clean enrollments table
        try {
          const { error: enrollError } = await supabaseAdmin
            .from('enrollments')
            .delete()
            .eq('email', userEmail);
          console.log(`   Enrollments: ${enrollError ? '❌ ' + enrollError.message : '✅ Deleted'}`);
        } catch (e) {
          console.log(`   Enrollments: ❌ Table error: ${e.message}`);
        }

        // Clean applications table
        try {
          const { error: appError } = await supabaseAdmin
            .from('applications')
            .delete()
            .eq('email', userEmail);
          console.log(`   Applications: ${appError ? '❌ ' + appError.message : '✅ Deleted'}`);
        } catch (e) {
          console.log(`   Applications: ❌ Table error: ${e.message}`);
        }

        // Try multiple approaches for accounts table
        let accountsDeleted = false;
        try {
          const { error: accError } = await supabaseAdmin
            .from('accounts')
            .delete()
            .eq('email', userEmail);
          if (!accError) accountsDeleted = true;
          console.log(`   Accounts (email): ${accError ? '❌ ' + accError.message : '✅ Deleted'}`);
        } catch (e) {
          try {
            const { error: accError2 } = await supabaseAdmin
              .from('accounts')
              .delete()
              .eq('user_email', userEmail);
            if (!accError2) accountsDeleted = true;
            console.log(`   Accounts (user_email): ${accError2 ? '❌ ' + accError2.message : '✅ Deleted'}`);
          } catch (e2) {
            console.log(`   Accounts: ❌ Both approaches failed`);
          }
        }

        // Try to clean users table
        try {
          const { error: userError } = await supabaseAdmin
            .from('users')
            .delete()
            .eq('email', userEmail);
          console.log(`   Users table: ${userError ? '❌ ' + userError.message : '✅ Deleted'}`);
        } catch (e) {
          console.log(`   Users table: ❌ Table doesn't exist or other error`);
        }

        // Force delete auth user with multiple strategies
        let authDeleted = false;
        
        // Strategy 1: Normal delete
        try {
          const { error } = await supabaseAdmin.auth.admin.deleteUser(userId);
          if (!error) {
            console.log(`   Auth User (normal): ✅ Deleted`);
            authDeleted = true;
          } else {
            console.log(`   Auth User (normal): ❌ ${error.message}`);
          }
        } catch (e) {
          console.log(`   Auth User (normal): ❌ ${e.message}`);
        }

        // Strategy 2: Soft delete if normal failed
        if (!authDeleted) {
          try {
            const { error } = await supabaseAdmin.auth.admin.deleteUser(userId, true);
            if (!error) {
              console.log(`   Auth User (soft): ✅ Deleted`);
              authDeleted = true;
            } else {
              console.log(`   Auth User (soft): ❌ ${error.message}`);
            }
          } catch (e) {
            console.log(`   Auth User (soft): ❌ ${e.message}`);
          }
        }

        // Strategy 3: Try to disable/anonymize the user if deletion fails
        if (!authDeleted) {
          try {
            // Try to update user to make it inactive
            const { error } = await supabaseAdmin.auth.admin.updateUserById(userId, {
              email_confirm: false,
              banned_until: new Date(Date.now() + 100 * 365 * 24 * 60 * 60 * 1000).toISOString(), // Ban for 100 years
            });
            
            if (!error) {
              console.log(`   Auth User (disabled): ✅ User disabled/banned`);
            } else {
              console.log(`   Auth User (disabled): ❌ ${error.message}`);
            }
          } catch (e) {
            console.log(`   Auth User (disabled): ❌ ${e.message}`);
          }
        }

        if (!authDeleted) {
          console.log(`   🚨 PERMANENTLY STUCK USER: ${userEmail} (${userId})`);
        }

      } catch (error) {
        console.error(`   💥 Unexpected error processing ${userEmail}:`, error);
      }
    }

    console.log('\n🎯 Aggressive cleanup completed!');

  } catch (error) {
    console.error('💥 Script error:', error);
  }
}

// Run the aggressive cleanup
forceDeleteStuckUsers();
