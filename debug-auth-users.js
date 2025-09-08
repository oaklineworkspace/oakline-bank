
import { supabaseAdmin } from './lib/supabaseClient.js';

async function debugAuthUsers() {
  try {
    console.log('🔍 Debugging Supabase Auth Users...\n');
    
    // Get all auth users
    const { data: authUsers, error: authError } = await supabaseAdmin.auth.admin.listUsers();
    if (authError) {
      console.error('Error fetching auth users:', authError);
      return;
    }

    console.log(`Found ${authUsers.users.length} auth users\n`);

    authUsers.users.forEach((user, index) => {
      console.log(`========== USER ${index + 1} ==========`);
      console.log(`ID: ${user.id}`);
      console.log(`Email (direct): ${user.email}`);
      console.log(`Created: ${user.created_at}`);
      console.log(`Confirmed: ${user.confirmed_at}`);
      console.log(`Last Sign In: ${user.last_sign_in_at || 'Never'}`);
      console.log(`User Metadata:`, JSON.stringify(user.user_metadata, null, 2));
      console.log(`Raw User Meta Data:`, JSON.stringify(user.raw_user_meta_data, null, 2));
      console.log(`App Metadata:`, JSON.stringify(user.app_metadata, null, 2));
      console.log(`Identities:`, JSON.stringify(user.identities, null, 2));
      console.log(`Phone: ${user.phone || 'None'}`);
      console.log(`Role: ${user.role || 'None'}`);
      console.log(`===================================\n`);
    });

    // Check for any related data
    console.log('\n🔍 Checking related data...\n');
    
    for (const user of authUsers.users) {
      const userEmail = user.email || 
                       user.user_metadata?.email || 
                       user.raw_user_meta_data?.email ||
                       user.identities?.[0]?.identity_data?.email;
      
      console.log(`Checking data for user: ${userEmail} (${user.id})`);
      
      // Check enrollments
      const { data: enrollments, error: enrollError } = await supabaseAdmin
        .from('enrollments')
        .select('*')
        .or(`email.eq.${userEmail},user_id.eq.${user.id}`);
      
      console.log(`  Enrollments: ${enrollments?.length || 0} records`);
      if (enrollments?.length > 0) {
        console.log(`    Data:`, JSON.stringify(enrollments, null, 4));
      }
      
      // Check applications
      const { data: applications, error: appError } = await supabaseAdmin
        .from('applications')
        .select('*')
        .or(`email.eq.${userEmail},user_id.eq.${user.id}`);
      
      console.log(`  Applications: ${applications?.length || 0} records`);
      if (applications?.length > 0) {
        console.log(`    Data:`, JSON.stringify(applications, null, 4));
      }
      
      console.log('');
    }

  } catch (error) {
    console.error('💥 Debug script error:', error);
  }
}

// Run the debug script
debugAuthUsers();
