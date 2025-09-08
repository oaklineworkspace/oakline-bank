
import { supabaseAdmin } from './lib/supabaseClient.js';

async function fixDatabaseSchema() {
  console.log('🔧 Fixing database schema issues...\n');

  try {
    // 1. Check and fix accounts table structure
    console.log('1️⃣ Checking accounts table...');
    
    // Add missing columns to accounts table if they don't exist
    try {
      const { error: alterError1 } = await supabaseAdmin.rpc('sql', {
        query: `
          DO $$ 
          BEGIN 
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'accounts' AND column_name = 'status') THEN
              ALTER TABLE public.accounts ADD COLUMN status text DEFAULT 'pending';
            END IF;
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'accounts' AND column_name = 'user_id') THEN
              ALTER TABLE public.accounts ADD COLUMN user_id uuid;
              ALTER TABLE public.accounts ADD CONSTRAINT accounts_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id);
            END IF;
          END $$;
        `
      });
      
      if (alterError1) {
        console.log('   Accounts table already has required columns or RPC not available');
      } else {
        console.log('   ✅ Accounts table structure updated');
      }
    } catch (error) {
      console.log('   ⚠️  Could not modify accounts table structure:', error.message);
    }

    // 2. Check and fix enrollments table structure
    console.log('2️⃣ Checking enrollments table...');
    
    try {
      const { error: alterError2 } = await supabaseAdmin.rpc('sql', {
        query: `
          DO $$ 
          BEGIN 
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'enrollments' AND column_name = 'completed_at') THEN
              ALTER TABLE public.enrollments ADD COLUMN completed_at timestamp without time zone;
            END IF;
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'enrollments' AND column_name = 'selected_account_number') THEN
              ALTER TABLE public.enrollments ADD COLUMN selected_account_number text;
            END IF;
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'enrollments' AND column_name = 'user_id') THEN
              ALTER TABLE public.enrollments ADD COLUMN user_id uuid;
              ALTER TABLE public.enrollments ADD CONSTRAINT enrollments_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id);
            END IF;
          END $$;
        `
      });
      
      if (alterError2) {
        console.log('   Enrollments table already has required columns or RPC not available');
      } else {
        console.log('   ✅ Enrollments table structure updated');
      }
    } catch (error) {
      console.log('   ⚠️  Could not modify enrollments table structure:', error.message);
    }

    // 3. Check and fix profiles table structure
    console.log('3️⃣ Checking profiles table...');
    
    try {
      const { error: alterError3 } = await supabaseAdmin.rpc('sql', {
        query: `
          DO $$ 
          BEGIN 
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'first_name') THEN
              ALTER TABLE public.profiles ADD COLUMN first_name text;
            END IF;
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'last_name') THEN
              ALTER TABLE public.profiles ADD COLUMN last_name text;
            END IF;
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'middle_name') THEN
              ALTER TABLE public.profiles ADD COLUMN middle_name text;
            END IF;
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'application_id') THEN
              ALTER TABLE public.profiles ADD COLUMN application_id uuid;
              ALTER TABLE public.profiles ADD CONSTRAINT profiles_application_id_fkey FOREIGN KEY (application_id) REFERENCES public.applications(id);
            END IF;
          END $$;
        `
      });
      
      if (alterError3) {
        console.log('   Profiles table already has required columns or RPC not available');
      } else {
        console.log('   ✅ Profiles table structure updated');
      }
    } catch (error) {
      console.log('   ⚠️  Could not modify profiles table structure:', error.message);
    }

    // 4. Test creating a profile manually
    console.log('4️⃣ Testing profile creation...');
    
    const testEmail = `test_${Date.now()}@example.com`;
    
    try {
      // Create a test auth user
      const { data: testAuthUser, error: testAuthError } = await supabaseAdmin.auth.admin.createUser({
        email: testEmail,
        password: 'testPassword123!',
        email_confirm: true
      });

      if (testAuthError) {
        console.log('   ❌ Could not create test auth user:', testAuthError.message);
      } else {
        console.log('   ✅ Test auth user created:', testAuthUser.user.id);
        
        // Try to create profile
        const { error: profileError } = await supabaseAdmin
          .from('profiles')
          .insert({
            id: testAuthUser.user.id,
            email: testEmail,
            first_name: 'Test',
            last_name: 'User'
          });

        if (profileError) {
          console.log('   ❌ Profile creation failed:', profileError.message);
        } else {
          console.log('   ✅ Profile created successfully');
        }

        // Clean up test user
        await supabaseAdmin.auth.admin.deleteUser(testAuthUser.user.id);
        console.log('   🧹 Test user cleaned up');
      }
    } catch (testError) {
      console.log('   ⚠️  Test creation failed:', testError.message);
    }

    console.log('\n🎯 Schema fix attempt completed!');

  } catch (error) {
    console.error('💥 Schema fix error:', error);
  }
}

// Run the schema fix
fixDatabaseSchema();
