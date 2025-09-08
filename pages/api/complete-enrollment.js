// pages/api/complete-enrollment.js
import { supabaseAdmin } from '../../lib/supabaseClient';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email, password, ssn, id_number, accountNumber, token, application_id } = req.body;

  if (!application_id || !token || !email || !password || !accountNumber) {
    return res.status(400).json({ error: 'Missing required fields: application_id, token, email, password, and accountNumber are required' });
  }

  // Require either SSN or ID number based on citizenship
  if (!ssn && !id_number) {
    return res.status(400).json({ error: 'Either SSN or ID number is required' });
  }

  try {
    // 1️⃣ Verify enrollment token
    const { data: enrollmentData, error: enrollmentError } = await supabaseAdmin
      .from('enrollments')
      .select('*')
      .eq('token', token)
      .eq('is_used', false) // Should not be used yet
      .single();

    if (enrollmentError || !enrollmentData) {
      return res.status(404).json({ error: 'Invalid or already used enrollment token' });
    }

    // 2️⃣ Get application data
    const { data: applicationData, error: applicationError } = await supabaseAdmin
      .from('applications')
      .select('*')
      .eq('id', application_id)
      .single();

    if (applicationError || !applicationData) {
      return res.status(404).json({ error: 'Application not found' });
    }

    // 3️⃣ Verify email matches
    if (enrollmentData.email !== applicationData.email || applicationData.email !== email) {
      return res.status(400).json({ error: 'Email verification failed' });
    }

    // 4️⃣ Verify identity - either SSN or ID number based on citizenship
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

    // 5️⃣ Verify account number exists for this application
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

    // 6️⃣ Update the user's password in Supabase Auth
    const { data: existingAuthUsers, error: listError } = await supabaseAdmin.auth.admin.listUsers();
    const existingAuthUser = existingAuthUsers?.users?.find(user => user.email === applicationData.email);

    if (!existingAuthUser) {
      return res.status(404).json({ error: 'Auth user not found. Please contact support.' });
    }

    // Update the auth user's password
    const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
      existingAuthUser.id,
      { password: password }
    );

    if (updateError) {
      console.error('Error updating user password:', updateError);
      return res.status(500).json({ error: 'Failed to set password' });
    }

    // 7️⃣ Mark enrollment as completed
    const { error: enrollmentUpdateError } = await supabaseAdmin
      .from('enrollments')
      .update({ 
        is_used: true,
        completed_at: new Date().toISOString(),
        selected_account_number: accountNumber
      })
      .eq('token', token);

    if (enrollmentUpdateError) {
      console.error('Error updating enrollment record:', enrollmentUpdateError);
      // Don't fail the process for this
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

    const accountNumbers = applicationAccounts?.map(acc => acc.account_number) || [];
    if (!accountNumbers.includes(accountNumber)) {
      return res.status(400).json({ error: 'Account number verification failed. Please check one of your account numbers.' });
    }

    // 6️⃣ Create Supabase Auth user if they don't exist
    let authUser = null;
    const { data: users, error: listError } = await supabaseAdmin.auth.admin.listUsers({
      email: email
    });

    if (listError) {
      console.error('Error listing users:', listError);
      return res.status(500).json({ error: 'Error checking for existing user.' });
    }

    if (users.users.length > 0) {
      // User already exists
      authUser = users.users[0];
    } else {
      // Create a new auth user
      try {
        const { data: newUser, error: signUpError } = await supabaseAdmin.auth.admin.createUser({
          email: email,
          password: password,
          email_confirm: true, // Auto-confirm email
        });
        if (signUpError) {
          console.error('Supabase signup error:', signUpError);
          return res.status(500).json({ error: `Failed to create user account: ${signUpError.message}` });
        }
        authUser = newUser;
      } catch (error) {
        console.error('Supabase signup try-catch error:', error);
        return res.status(500).json({ error: 'An unexpected error occurred during user creation.' });
      }
    }

    // 7️⃣ Update the auth user's password if it was provided
    if (password) {
      try {
        await supabaseAdmin.auth.admin.updateUserById(authUser.id, {
          password: password
        });
      } catch (updateError) {
        console.error('Password update error:', updateError);
        return res.status(500).json({ error: 'Failed to set your password. Please try again.' });
      }
    }

    // 8️⃣ Mark the enrollment token as used
    const { error: tokenUpdateError } = await supabaseAdmin
      .from('enrollments')
      .update({ is_used: true })
      .eq('id', enrollmentData.id);

    if (tokenUpdateError) {
      console.error('Error marking token as used:', tokenUpdateError);
    }

    // 9️⃣ Link accounts to the auth user
    const { error: accountError } = await supabaseAdmin
      .from('accounts')
      .update({ 
        user_id: authUser.user?.id || authUser.id // Link accounts to the auth user
      })
      .eq('application_id', application_id);

    if (accountError) {
      console.error('Account update error:', accountError);
      return res.status(500).json({ error: 'Failed to activate accounts. Please contact support.' });
    }

    // Helper function to check if account number is taken
    const isAccountNumberTaken = async (num) => {
      const { data, error } = await supabaseAdmin
        .from('accounts')
        .select('account_number')
        .eq('account_number', num)
        .single();
      return !error && data;
    };

    // Generate unique random 10-digit account number
    const generateAccountNumber = async () => {
      let num;
      let attempts = 0;
      const maxAttempts = 100;

      do {
        num = '';
        for (let i = 0; i < 10; i++) {
          num += Math.floor(Math.random() * 10);
        }
        attempts++;
      } while (await isAccountNumberTaken(num) && attempts < maxAttempts);

      if (attempts === maxAttempts) {
        throw new Error('Could not generate a unique account number after multiple attempts.');
      }
      return num;
    };

    // Generate new account numbers for any missing accounts
    const currentAccountNumbers = applicationAccounts.map(acc => acc.account_number);
    const accountsNeedingNumbers = applicationAccounts.filter(acc => !acc.account_number || acc.account_number === '');

    for (const account of accountsNeedingNumbers) {
      const newAccountNumber = await generateAccountNumber();
      
      // Update the existing account with the new account number
      const { error: updateError } = await supabaseAdmin
        .from('accounts')
        .update({ account_number: newAccountNumber })
        .eq('id', account.id);

      if (updateError) {
        console.error('Error updating account with new account number:', updateError);
      } else {
        currentAccountNumbers.push(newAccountNumber);
      }
    }

    // Simulate sending a welcome email with account numbers
    // In a real application, you would use an email service like Nodemailer or SendGrid
    console.log(`Sending welcome email to ${email} with account numbers: ${currentAccountNumbers.join(', ')}`);

    res.status(200).json({
      message: 'Enrollment completed successfully',
      user: {
        id: applicationData.id,
        email: email,
        name: `${applicationData.first_name} ${applicationData.last_name}`,
        supabase_auth_id: authUser.id,
        account_numbers: currentAccountNumbers // Include account numbers in the response
      }
    });

  } catch (error) {
    console.error('Enrollment completion error:', error);
    res.status(500).json({ error: 'Internal server error during enrollment completion' });
  }
}