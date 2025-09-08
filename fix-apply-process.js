
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
    const accountNumbers = [];

    for (const accountType of accountTypes) {
      const accountNumber = (Math.floor(Math.random() * 9000000000) + 1000000000).toString();
      
      const { data: accountData, error: accountError } = await supabaseAdmin
        .from('accounts')
        .insert([{
          application_id: applicationData.id,
          account_number: accountNumber,
          account_type: accountType,
          balance: 0.00,
          status: 'active',
          routing_number: '075915826'
        }])
        .select()
        .single();

      if (accountError) {
        console.error('   ❌ Account creation failed:', accountError);
        continue;
      }

      accountNumbers.push(accountNumber);
      console.log(`   ✅ ${accountType} account created: ${accountNumber}`);
    }

    // 4. Create enrollment record
    console.log('4️⃣ Creating enrollment record...');
    const enrollmentToken = `enroll_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;

    const { data: enrollmentData, error: enrollmentError } = await supabaseAdmin
      .from('enrollments')
      .insert([{
        email: testEmail,
        token: enrollmentToken,
        is_used: false,
        application_id: applicationData.id
      }])
      .select()
      .single();

    if (enrollmentError) {
      console.error('   ❌ Enrollment creation failed:', enrollmentError);
    } else {
      console.log('   ✅ Enrollment record created');
    }

    // 5. Create Supabase Auth user
    console.log('5️⃣ Creating Supabase Auth user...');
    const { data: authUser, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: testEmail,
      password: 'tempPassword123!',
      email_confirm: true,
      user_metadata: {
        application_id: applicationData.id,
        first_name: 'Test',
        last_name: 'Example'
      }
    });

    if (authError) {
      console.error('   ❌ Auth user creation failed:', authError);
    } else {
      console.log('   ✅ Auth user created:', authUser.user.id);
    }

    // 6. Verify all components
    console.log('6️⃣ Verifying all components...');
    
    // Check application
    const { data: checkApp } = await supabaseAdmin
      .from('applications')
      .select('*')
      .eq('id', applicationData.id)
      .single();

    // Check accounts
    const { data: checkAccounts } = await supabaseAdmin
      .from('accounts')
      .select('*')
      .eq('application_id', applicationData.id);

    // Check enrollment
    const { data: checkEnrollment } = await supabaseAdmin
      .from('enrollments')
      .select('*')
      .eq('application_id', applicationData.id)
      .single();

    // Check auth user
    const { data: checkAuthUser } = await supabaseAdmin.auth.admin.getUserById(authUser?.user?.id);

    console.log('\n📋 VERIFICATION RESULTS:');
    console.log(`   Application: ${checkApp ? '✅ Found' : '❌ Not found'}`);
    console.log(`   Accounts: ${checkAccounts?.length > 0 ? '✅ Found' : '❌ Not found'}`);
    console.log(`   Enrollment: ${checkEnrollment ? '✅ Found' : '❌ Not found'}`);
    console.log(`   Auth User: ${checkAuthUser?.user ? '✅ Found' : '❌ Not found'}`);

    console.log('\n🎯 Test completed! All components should now be working properly.');

    // Cleanup test data
    console.log('\n🧹 Cleaning up test data...');
    await supabaseAdmin.from('enrollments').delete().eq('email', testEmail);
    await supabaseAdmin.from('accounts').delete().eq('application_id', applicationData.id);
    await supabaseAdmin.from('applications').delete().eq('email', testEmail);
    
    if (authUser?.user) {
      await supabaseAdmin.auth.admin.deleteUser(authUser.user.id);
    }
    
    console.log('   ✅ Cleanup complete');

  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

testApplicationProcess();
