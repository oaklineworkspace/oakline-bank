
import { supabaseAdmin } from './lib/supabaseAdmin.js';

async function recoverUserEmails() {
  console.log('🔍 Recovering user emails from database...\n');

  try {
    // Get auth users
    const { data: authUsers, error: authError } = await supabaseAdmin.auth.admin.listUsers();
    
    if (authError) {
      console.error('Error fetching auth users:', authError);
      return;
    }

    console.log(`Found ${authUsers.users.length} auth users\n`);

    // Get applications (which should have real emails)
    const { data: applications, error: appError } = await supabaseAdmin
      .from('applications')
      .select('*')
      .order('created_at', { ascending: false });

    if (appError) {
      console.log('Applications table error:', appError.message);
    } else {
      console.log(`Found ${applications?.length || 0} applications\n`);
    }

    // Get enrollments
    const { data: enrollments, error: enrollError } = await supabaseAdmin
      .from('enrollments')
      .select('*')
      .order('created_at', { ascending: false });

    if (enrollError) {
      console.log('Enrollments table error:', enrollError.message);
    } else {
      console.log(`Found ${enrollments?.length || 0} enrollments\n`);
    }

    // Cross-reference and display results
    authUsers.users.forEach((authUser, index) => {
      console.log(`========== AUTH USER ${index + 1} ==========`);
      console.log(`ID: ${authUser.id}`);
      console.log(`Auth Email: ${authUser.email}`);
      console.log(`Status: ${authUser.deleted_at ? 'SOFT_DELETED' : 'ACTIVE'}`);
      console.log(`Created: ${authUser.created_at}`);
      
      if (authUser.deleted_at) {
        console.log(`Deleted: ${authUser.deleted_at}`);
      }

      // Look for matching application
      const matchingApp = applications?.find(app => 
        app.id === authUser.id || 
        app.user_id === authUser.id ||
        (app.email && authUser.email && app.email.toLowerCase() === authUser.email.toLowerCase())
      );

      if (matchingApp) {
        console.log(`📧 REAL EMAIL FOUND: ${matchingApp.email}`);
        console.log(`📝 Full Name: ${matchingApp.full_name}`);
        console.log(`📱 Phone: ${matchingApp.phone_number}`);
      } else {
        console.log(`❌ No matching application found`);
      }

      // Look for matching enrollment
      const matchingEnrollment = enrollments?.find(enroll => 
        enroll.application_id === authUser.id ||
        enroll.user_id === authUser.id
      );

      if (matchingEnrollment) {
        console.log(`🔗 Enrollment found - Token: ${matchingEnrollment.token?.substring(0, 20)}...`);
        console.log(`🔗 Enrollment Status: ${matchingEnrollment.status}`);
      }

      console.log(`=====================================\n`);
    });

    // Show all applications for reference
    if (applications && applications.length > 0) {
      console.log('\n📋 ALL APPLICATIONS:');
      applications.forEach((app, idx) => {
        console.log(`${idx + 1}. ${app.email} - ${app.full_name} (${app.created_at})`);
      });
    }

    // Show all enrollments for reference
    if (enrollments && enrollments.length > 0) {
      console.log('\n🎯 ALL ENROLLMENTS:');
      enrollments.forEach((enroll, idx) => {
        console.log(`${idx + 1}. App ID: ${enroll.application_id} - Status: ${enroll.status} (${enroll.created_at})`);
      });
    }

  } catch (error) {
    console.error('Recovery error:', error);
  }
}

recoverUserEmails();
