
import { supabaseAdmin } from './lib/supabaseClient.js';

async function checkAllUsers() {
  try {
    console.log('Fetching all users from Supabase Auth...');
    
    const { data: users, error } = await supabaseAdmin.auth.admin.listUsers();
    
    if (error) {
      console.error('Error fetching users:', error);
      return;
    }
    
    console.log(`Found ${users.users.length} users in Supabase Auth:`);
    console.log('');
    
    users.users.forEach((user, index) => {
      console.log(`${index + 1}. ID: ${user.id}`);
      console.log(`   Email: ${user.email}`);
      console.log(`   Created: ${user.created_at}`);
      console.log(`   Last Sign In: ${user.last_sign_in_at || 'Never'}`);
      console.log('   ---');
    });
    
    // Check specifically for the email you mentioned
    const targetUser = users.users.find(user => 
      user.email && user.email.toLowerCase() === 'chrishite2323@gmail.com'
    );
    
    if (targetUser) {
      console.log('');
      console.log('✅ Found user with email chrishite2323@gmail.com:');
      console.log(`   Actual ID: ${targetUser.id}`);
      console.log(`   Created: ${targetUser.created_at}`);
    } else {
      console.log('');
      console.log('❌ No user found with email chrishite2323@gmail.com');
    }
    
  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

checkAllUsers();
