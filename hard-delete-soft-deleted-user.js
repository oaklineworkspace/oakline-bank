
import { supabaseAdmin } from './lib/supabaseClient.js';

async function hardDeleteSoftDeletedUser() {
  const targetUserId = '88b64128-a58d-414d-aceb-76714d65a7e3';
  
  console.log('🗑️ Hard deleting soft-deleted user:', targetUserId);
  
  try {
    // First, let's get the current user state
    const { data: user, error: getUserError } = await supabaseAdmin.auth.admin.getUserById(targetUserId);
    
    if (getUserError) {
      console.log('❌ Could not fetch user:', getUserError.message);
      return;
    }
    
    if (!user) {
      console.log('✅ User not found - may already be deleted');
      return;
    }
    
    console.log('📋 User status:', user.deleted_at ? 'SOFT_DELETED' : 'ACTIVE');
    console.log('📧 User email:', user.email);
    
    // Try to clean up any remaining database references first
    console.log('\n🧹 Cleaning up database references...');
    
    // Method 1: Clean up by user ID (most reliable)
    const cleanupTasks = [
      { table: 'enrollments', column: 'user_id' },
      { table: 'enrollments', column: 'application_id' },
      { table: 'applications', column: 'id' },
      { table: 'applications', column: 'user_id' },
      { table: 'accounts', column: 'user_id' },
      { table: 'profiles', column: 'id' }, // This might be the issue
      { table: 'profiles', column: 'user_id' },
    ];
    
    for (const task of cleanupTasks) {
      try {
        const { error } = await supabaseAdmin
          .from(task.table)
          .delete()
          .eq(task.column, targetUserId);
        
        if (error && !error.message.includes('does not exist')) {
          console.log(`   ${task.table}.${task.column}: ❌ ${error.message}`);
        } else {
          console.log(`   ${task.table}.${task.column}: ✅ Cleaned`);
        }
      } catch (e) {
        console.log(`   ${task.table}.${task.column}: ⚠️ Table/column not found`);
      }
    }
    
    // Method 2: Try to clean up by email if available
    if (user.email && !user.email.includes('ggLmhDCzKZB2tYV')) {
      console.log('\n🔧 Cleaning by email reference...');
      const emailCleanupTasks = [
        { table: 'enrollments', column: 'email' },
        { table: 'applications', column: 'email' },
        { table: 'accounts', column: 'email' },
        { table: 'accounts', column: 'user_email' }
      ];
      
      for (const task of emailCleanupTasks) {
        try {
          const { error } = await supabaseAdmin
            .from(task.table)
            .delete()
            .eq(task.column, user.email);
          
          if (error && !error.message.includes('does not exist')) {
            console.log(`   ${task.table}.${task.column}: ❌ ${error.message}`);
          } else {
            console.log(`   ${task.table}.${task.column}: ✅ Cleaned`);
          }
        } catch (e) {
          console.log(`   ${task.table}.${task.column}: ⚠️ Table/column not found`);
        }
      }
    }
    
    // Method 3: Now try different deletion approaches
    console.log('\n💀 Attempting hard deletion...');
    
    // Approach 1: Force hard delete (shouldSoftDelete = false)
    try {
      const { error: hardDeleteError } = await supabaseAdmin.auth.admin.deleteUser(targetUserId, false);
      if (!hardDeleteError) {
        console.log('✅ Hard delete successful!');
        return;
      } else {
        console.log('❌ Hard delete failed:', hardDeleteError.message);
      }
    } catch (e) {
      console.log('❌ Hard delete exception:', e.message);
    }
    
    // Approach 2: Use SQL to delete directly from auth.users
    try {
      console.log('🔧 Trying direct SQL deletion...');
      
      // First delete from auth.identities
      const { error: identitiesError } = await supabaseAdmin.rpc('exec_sql', {
        query: `DELETE FROM auth.identities WHERE user_id = '${targetUserId}';`
      });
      
      if (identitiesError) {
        console.log('⚠️ Could not delete identities:', identitiesError.message);
      } else {
        console.log('✅ Deleted auth identities');
      }
      
      // Then delete from auth.users
      const { error: usersError } = await supabaseAdmin.rpc('exec_sql', {
        query: `DELETE FROM auth.users WHERE id = '${targetUserId}';`
      });
      
      if (usersError) {
        console.log('❌ Direct SQL deletion failed:', usersError.message);
      } else {
        console.log('✅ Direct SQL deletion successful!');
        return;
      }
    } catch (e) {
      console.log('❌ Direct SQL approach failed:', e.message);
    }
    
    // Approach 3: If still exists, try to completely anonymize
    console.log('\n🎭 Attempting to anonymize user...');
    try {
      const randomId = Math.random().toString(36).substring(2);
      const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(targetUserId, {
        email: `deleted_${randomId}@deleted.local`,
        email_confirm: false,
        banned_until: new Date(Date.now() + 100 * 365 * 24 * 60 * 60 * 1000).toISOString(),
        user_metadata: { deleted: true, original_deleted_at: user.deleted_at }
      });
      
      if (!updateError) {
        console.log('✅ User anonymized successfully');
      } else {
        console.log('❌ Anonymization failed:', updateError.message);
      }
    } catch (e) {
      console.log('❌ Anonymization exception:', e.message);
    }
    
    // Final verification
    console.log('\n🔍 Final verification...');
    const { data: finalCheck } = await supabaseAdmin.auth.admin.getUserById(targetUserId);
    if (finalCheck) {
      console.log('⚠️ User still exists but may be cleaned/anonymized');
      console.log('Status:', finalCheck.deleted_at ? 'SOFT_DELETED' : 'ACTIVE');
      console.log('Email:', finalCheck.email);
    } else {
      console.log('✅ User successfully removed!');
    }
    
  } catch (error) {
    console.error('💥 Script error:', error);
  }
}

hardDeleteSoftDeletedUser();
