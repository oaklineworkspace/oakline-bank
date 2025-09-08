
import { supabaseAdmin } from '../../lib/supabaseClient';

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
    // 1️⃣ Get application data
    const { data: applicationData, error: applicationError } = await supabaseAdmin
      .from('applications')
      .select('*')
      .eq('id', application_id)
      .single();

    if (applicationError || !applicationData) {
      return res.status(404).json({ error: 'Application not found' });
    }

    // 2️⃣ Verify email matches
    if (applicationData.email !== email) {
      return res.status(400).json({ error: 'Email verification failed' });
    }

    // 3️⃣ Verify identity - either SSN or ID number based on citizenship
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

    // 4️⃣ Verify account number exists for this application
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

    // 5️⃣ Update the user's password in Supabase Auth
    const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
      userId,
      { password: password }
    );

    if (updateError) {
      console.error('Error updating user password:', updateError);
      return res.status(500).json({ error: 'Failed to set password' });
    }

    // 6️⃣ Create or update profile record
    const profileData = {
      id: userId,
      email: applicationData.email,
      first_name: applicationData.first_name,
      last_name: applicationData.last_name,
      middle_name: applicationData.middle_name,
      phone: applicationData.phone,
      date_of_birth: applicationData.date_of_birth,
      country: applicationData.country,
      address: applicationData.address,
      city: applicationData.city,
      state: applicationData.state,
      zip_code: applicationData.zip_code,
      application_id: application_id,
      created_at: new Date().toISOString()
    };

    const { error: profileError } = await supabaseAdmin
      .from('profiles')
      .upsert([profileData], { onConflict: 'id' });

    if (profileError) {
      console.error('Error creating profile record:', profileError);
      // Don't fail the process for profile creation error, just log it
    }

    // 7️⃣ Update enrollment record
    const { error: enrollmentUpdateError } = await supabaseAdmin
      .from('enrollments')
      .update({ 
        is_used: true,
        completed_at: new Date().toISOString(),
        selected_account_number: accountNumber,
        user_id: userId
      })
      .eq('application_id', application_id)
      .eq('email', email);

    if (enrollmentUpdateError) {
      console.error('Error updating enrollment record:', enrollmentUpdateError);
      // Don't fail the process for this
    }

    // 8️⃣ Link accounts to the auth user
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
