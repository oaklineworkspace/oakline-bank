
import { supabaseAdmin } from './lib/supabaseClient.js';

async function testApplicationProcess() {
  console.log('🔧 Testing and fixing application process...\n');
  
  try {
    // Test data
    const testEmail = 'test@example.com';
    
    // 1. Clean up any existing test data
    console.log('1️⃣ Cleaning up existing test data...');
    await supabaseAdmin.from('enrollments').delete().eq('email', testEmail);
    await supabaseAdmin.from('accounts').delete().eq('application_id', '00000000-0000-0000-0000-000000000000');
    await supabaseAdmin.from('applications').delete().eq('email', testEmail);
    
    // Also delete from auth if exists
    const { data: authUsers } = await supabaseAdmin.auth.admin.listUsers();
    const existingUser = authUsers?.users?.find(user => user.email === testEmail);
    if (existingUser) {
      await supabaseAdmin.auth.admin.deleteUser(existingUser.id);
      console.log('   Deleted existing auth user');
    }
    
    console.log('   ✅ Cleanup complete\n');
    
    // 2. Simulate application submission
    console.log('2️⃣ Creating test application...');
    const { data: applicationData, error: applicationError } = await supabaseAdmin
      .from('applications')
      .insert([{
        first_name: 'Test',
        middle_name: 'User',
        last_name: 'Example',
        email: testEmail,
        phone: '555-123-4567',
        date_of_birth: '1990-01-01',
        country: 'US',
        ssn: '123-45-6789',
        address: '123 Test St',
        city: 'Test City',
        state: 'California',
        zip_code: '12345',
        employment_status: 'employed_fulltime',
        annual_income: '50k_75k',
        account_types: ['checking_account', 'savings_account'],
        agree_to_terms: true
      }])
      .select()
      .single();
    
    if (applicationError) {
      console.error('   ❌ Application creation failed:', applicationError);
      return;
    }
    
    console.log('   ✅ Application created:', applicationData.id);
    
    // 3. Create accounts for the application
    console.log('3️⃣ Creating accounts...');
    const accountTypes = ['checking_account', 'savings_account'];
    const accounts = [];
    
    for (const accountType of accountTypes) {
      const accountNumber = Math.floor(Math.random() * 9000000000 + 1000000000).toString();
      
      const { data: accountData, error: accountError } = await supabaseAdmin
        .from('accounts')
        .insert([{
          application_id: applicationData.id,
          account_number: accountNumber,
          account_type: accountType,
          routing_number: '075915826',
          balance: 0.00,
          status: 'pending'
        }])
        .select()
        .single();
      
      if (accountError) {
        console.error('   ❌ Account creation failed:', accountError);
      } else {
        accounts.push(accountData);
        console.log(`   ✅ ${accountType} account created:`, accountNumber);
      }
    }
    
    // 4. Create enrollment record
    console.log('4️⃣ Creating enrollment record...');
    const enrollmentToken = `enroll_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
    
    const { data: enrollmentData, error: enrollmentError } = await supabaseAdmin
      .from('enrollments')
      .insert([{
        email: testEmail,
        application_id: applicationData.id,
        token: enrollmentToken,
        is_used: false
      }])
      .select()
      .single();
    
    if (enrollmentError) {
      console.error('   ❌ Enrollment creation failed:', enrollmentError);
      return;
    }
    
    console.log('   ✅ Enrollment record created');
    
    // 5. Create Supabase Auth user
    console.log('5️⃣ Creating Supabase Auth user...');
    const tempPassword = `temp_${Date.now()}_${Math.random().toString(36).substring(2)}`;
    
    const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
      email: testEmail,
      password: tempPassword,
      email_confirm: true,
      user_metadata: {
        first_name: applicationData.first_name,
        last_name: applicationData.last_name,
        application_id: applicationData.id
      }
    });
    
    if (createError) {
      console.error('   ❌ Auth user creation failed:', createError);
      return;
    }
    
    console.log('   ✅ Auth user created:', newUser.user.id);
    
    // 6. Verify all components exist
    console.log('6️⃣ Verifying all components...');
    
    const { data: appCheck } = await supabaseAdmin
      .from('applications')
      .select('*')
      .eq('id', applicationData.id)
      .single();
    
    const { data: accountsCheck } = await supabaseAdmin
      .from('accounts')
      .select('*')
      .eq('application_id', applicationData.id);
    
    const { data: enrollmentCheck } = await supabaseAdmin
      .from('enrollments')
      .select('*')
      .eq('application_id', applicationData.id)
      .single();
    
    const { data: authCheck } = await supabaseAdmin.auth.admin.getUserById(newUser.user.id);
    
    console.log('\n📋 VERIFICATION RESULTS:');
    console.log('   Application:', appCheck ? '✅ Found' : '❌ Not found');
    console.log('   Accounts:', accountsCheck?.length > 0 ? `✅ Found ${accountsCheck.length}` : '❌ Not found');
    console.log('   Enrollment:', enrollmentCheck ? '✅ Found' : '❌ Not found');
    console.log('   Auth User:', authCheck.user ? '✅ Found' : '❌ Not found');
    
    console.log('\n🎯 Test completed! All components should now be working properly.');
    
    // Cleanup
    console.log('\n🧹 Cleaning up test data...');
    await supabaseAdmin.auth.admin.deleteUser(newUser.user.id);
    await supabaseAdmin.from('enrollments').delete().eq('email', testEmail);
    await supabaseAdmin.from('accounts').delete().eq('application_id', applicationData.id);
    await supabaseAdmin.from('applications').delete().eq('id', applicationData.id);
    console.log('   ✅ Cleanup complete');
    
  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

testApplicationProcess();
