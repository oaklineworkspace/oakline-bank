
import { supabaseAdmin } from '../../lib/supabaseAdmin';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { userId, email, password, ssn, id_number, accountNumber, application_id } = req.body;

  if (!userId || !application_id || !email || !password || !accountNumber) {
    return res.status(400).json({ error: 'Missing required fields: userId, application_id, email, password, and accountNumber are required' });
  }

  // Require either SSN or ID number based on citizenship
  if (!ssn && !id_number) {
    return res.status(400).json({ error: 'Either SSN or ID number is required' });
  }

  try {
    // 1️⃣ Check if user has already completed enrollment
    const { data: existingProfile, error: profileCheckError } = await supabaseAdmin
      .from('profiles')
      .select('id, enrollment_completed, email')
      .eq('email', email)
      .maybeSingle();

    if (existingProfile && existingProfile.enrollment_completed) {
      return res.status(400).json({ 
        error: 'This enrollment has already been completed. Please sign in using your password at the login page.',
        enrollment_completed: true
      });
    }

    // 2️⃣ Check enrollment record for expiration
    const { data: enrollmentData, error: enrollmentError } = await supabaseAdmin
      .from('enrollments')
      .select('*')
      .eq('application_id', application_id)
      .eq('email', email)
      .maybeSingle();

    if (enrollmentData) {
      // Check if enrollment is already used
      if (enrollmentData.is_used) {
        return res.status(400).json({ 
          error: 'This enrollment has already been completed. Please sign in using your password at the login page.',
          enrollment_completed: true
        });
      }

      // Check if enrollment link is expired (24 hours)
      const tokenCreatedAt = new Date(enrollmentData.created_at);
      const now = new Date();
      const hoursSinceCreation = (now - tokenCreatedAt) / (1000 * 60 * 60);
      
      if (hoursSinceCreation > 24) {
        return res.status(400).json({ 
          error: 'This enrollment link has expired. Please request a new enrollment link.',
          expired: true
        });
      }
    }

    // 3️⃣ Get application data
    const { data: applicationData, error: applicationError } = await supabaseAdmin
      .from('applications')
      .select('*')
      .eq('id', application_id)
      .single();

    if (applicationError || !applicationData) {
      return res.status(404).json({ error: 'Application not found' });
    }

    // 4️⃣ Verify email matches
    if (applicationData.email !== email) {
      return res.status(400).json({ error: 'Email verification failed' });
    }

    // 5️⃣ Verify identity - either SSN or ID number based on citizenship
    if (applicationData.country === 'US') {
      // US citizens - verify SSN
      const cleanSSN = ssn ? ssn.replace(/-/g, '') : '';
      const applicationSSN = applicationData.ssn ? applicationData.ssn.replace(/-/g, '') : '';
      if (applicationSSN && applicationSSN !== cleanSSN) {
        return res.status(400).json({ error: 'SSN verification failed. Please check your Social Security Number.' });
      }
    } else {
      // International citizens - verify ID number
      if (applicationData.id_number && applicationData.id_number !== id_number) {
        return res.status(400).json({ error: 'ID number verification failed. Please check your Government ID Number.' });
      }
    }

    // 6️⃣ Verify account number exists for this application
    const { data: applicationAccounts, error: accountsError } = await supabaseAdmin
      .from('accounts')
      .select('account_number, account_type, balance')
      .eq('application_id', application_id);

    if (accountsError) {
      console.error('Error fetching application accounts:', accountsError);
      return res.status(500).json({ error: 'Error verifying account information' });
    }

    if (!applicationAccounts || applicationAccounts.length === 0) {
      return res.status(404).json({ error: 'No accounts found for this application' });
    }

    // Verify the selected account number belongs to this application
    const selectedAccount = applicationAccounts.find(acc => acc.account_number === accountNumber);
    if (!selectedAccount) {
      return res.status(400).json({ error: 'Invalid account number selected' });
    }

    // 7️⃣ Update the user's password in Supabase Auth
    const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
      userId,
      { password: password }
    );

    if (updateError) {
      console.error('Error updating user password:', updateError);
      return res.status(500).json({ error: 'Failed to set password' });
    }

    // 8️⃣ Create or update profile record with enrollment_completed = true
    const profileData = {
      id: userId,
      email: applicationData.email,
      enrollment_completed: true,
      enrollment_completed_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const { error: profileError } = await supabaseAdmin
      .from('profiles')
      .upsert([profileData], { onConflict: 'id' });

    if (profileError) {
      console.error('Error creating profile record:', profileError);
      // Don't fail the process for profile creation error, just log it
    } else {
      console.log('✅ Profile marked as enrollment_completed with timestamp');
    }

    // 9️⃣ Mark enrollment as used (password setup completed)
    const { error: enrollmentUpdateError } = await supabaseAdmin
      .from('enrollments')
      .update({ 
        is_used: true,
        updated_at: new Date().toISOString()
      })
      .eq('application_id', application_id)
      .eq('email', email);

    if (enrollmentUpdateError) {
      console.error('Error marking enrollment as used:', enrollmentUpdateError);
      // Don't fail the process for this
    } else {
      console.log('✅ Enrollment marked as used (is_used = true)');
    }

    // 🔟 Link accounts to the auth user
    const { error: accountError } = await supabaseAdmin
      .from('accounts')
      .update({ 
        user_id: userId
      })
      .eq('application_id', application_id);

    if (accountError) {
      console.error('Account update error:', accountError);
      return res.status(500).json({ error: 'Failed to activate accounts. Please contact support.' });
    }

    res.status(200).json({
      message: 'Enrollment completed successfully',
      user: {
        id: applicationData.id,
        email: applicationData.email,
        name: `${applicationData.first_name} ${applicationData.last_name}`,
        selected_account: selectedAccount
      }
    });

  } catch (error) {
    console.error('Complete enrollment error:', error);
    res.status(500).json({ error: 'Internal server error during enrollment completion' });
  }
}
