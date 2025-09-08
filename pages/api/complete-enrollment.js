// pages/api/complete-enrollment.js
import { supabaseAdmin } from '../../lib/supabaseClient';
import crypto from 'crypto';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { temp_user_id, email, password, ssn, id_number, accountNumber, token, application_id } = req.body;

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

    // 🔟 Generate and add new 10-digit account numbers if missing
    const currentAccountNumbers = applicationAccounts.map(acc => acc.account_number);
    const neededAccountNumbersCount = 10 - currentAccountNumbers.length;

    if (neededAccountNumbersCount > 0) {
      const newAccountNumbers = [];
      for (let i = 0; i < neededAccountNumbersCount; i++) {
        let newAccNum;
        do {
          newAccNum = crypto.randomBytes(5).toString('hex'); // Generates 10 hex characters, sufficient for 10 digits
        } while (currentAccountNumbers.includes(newAccNum) || newAccountNumbers.includes(newAccNum));
        newAccountNumbers.push(newAccNum);
      }

      const { error: insertError } = await supabaseAdmin.from('accounts').insert(
        newAccountNumbers.map(accNum => ({
          application_id: application_id,
          account_number: accNum,
          user_id: authUser.user?.id || authUser.id,
          account_type: 'default', // Default account type
          balance: 0 // Default balance
        }))
      );

      if (insertError) {
        console.error('Error inserting new account numbers:', insertError);
        // This is not critical enough to prevent user creation, but should be logged.
      } else {
        // Add newly generated account numbers to the list for the email
        currentAccountNumbers.push(...newAccountNumbers);
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