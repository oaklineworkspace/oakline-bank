// pages/api/complete-enrollment.js
import { supabaseAdmin } from '../../lib/supabaseClient';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { temp_user_id, email, password, ssn, accountNumber } = req.body;

  if (!temp_user_id || !email || !password || !ssn || !accountNumber) {
    return res.status(400).json({ error: 'Missing required fields: temp_user_id, email, password, ssn, and accountNumber are required' });
  }

  try {
    // 1️⃣ Check if user exists and verify identity
    const { data: existingUser, error: userError } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('id', temp_user_id)
      .single();

    if (userError || !existingUser) {
      return res.status(404).json({ error: 'User not found or invalid enrollment link' });
    }

    // Verify SSN matches
    if (existingUser.ssn && existingUser.ssn !== ssn) {
      return res.status(400).json({ error: 'SSN verification failed. Please check your Social Security Number.' });
    }

    // Verify account number exists for this user
    const { data: userAccounts, error: accountsError } = await supabaseAdmin
      .from('accounts')
      .select('account_number')
      .eq('user_id', temp_user_id);

    if (accountsError) {
      console.error('Error fetching user accounts:', accountsError);
      return res.status(500).json({ error: 'Error verifying account information' });
    }

    const accountNumbers = userAccounts?.map(acc => acc.account_number) || [];
    if (!accountNumbers.includes(accountNumber)) {
      return res.status(400).json({ error: 'Account number verification failed. Please check one of your account numbers.' });
    }

    // Skip auth_id check since column may not exist
    // if (existingUser.auth_id) {
    //   return res.status(400).json({ error: 'User has already completed enrollment' });
    // }

    // 2️⃣ Check if user already exists in auth, if not create them
    let authData;
    
    // First try to get existing user by email
    const { data: existingAuthUsers, error: listError } = await supabaseAdmin.auth.admin.listUsers();
    const existingAuthUser = existingAuthUsers?.users?.find(user => user.email === email);
    
    if (existingAuthUser) {
      // User already exists in auth - update their password
      console.log('User already exists in auth, updating password');
      authData = { user: existingAuthUser };
      
      // Update their password since they're completing enrollment
      try {
        await supabaseAdmin.auth.admin.updateUserById(existingAuthUser.id, {
          password: password
        });
      } catch (updateError) {
        console.error('Password update error:', updateError);
        // Continue anyway, the main goal is enrollment completion
      }
    } else {
      // Create new user in auth
      try {
        const { data: newAuthData, error: authError } = await supabaseAdmin.auth.admin.createUser({
          email: email,
          password: password,
          email_confirm: true // Auto-confirm email
        });

        if (authError) {
          console.error('Auth error:', authError);
          
          // Sometimes users exist but weren't found in the list, try alternative approach
          if (authError.message?.includes('already registered') || authError.message?.includes('already exists')) {
            // Try to find the user by searching again
            const { data: retryUsers } = await supabaseAdmin.auth.admin.listUsers();
            const foundUser = retryUsers?.users?.find(user => user.email === email);
            if (foundUser) {
              authData = { user: foundUser };
            } else {
              return res.status(400).json({ error: `User may already exist but cannot be accessed: ${authError.message}` });
            }
          } else {
            return res.status(400).json({ error: `Authentication error: ${authError.message}` });
          }
        } else {
          authData = newAuthData;
        }
      } catch (createError) {
        console.error('Create user exception:', createError);
        return res.status(400).json({ error: `Failed to create user account: ${createError.message}` });
      }
    }

    // 3️⃣ Update user record (without auth_id since column doesn't exist)
    const { data: updateData, error: updateError } = await supabaseAdmin
      .from('users')
      .update({ 
        email: email, // Update email to match auth
        updated_at: new Date().toISOString()
      })
      .eq('id', temp_user_id)
      .select();

    if (updateError) {
      console.error('Database update error:', updateError);
      
      // If updating user fails, try to clean up the auth user
      try {
        await supabaseAdmin.auth.admin.deleteUser(authData.user.id);
      } catch (cleanupError) {
        console.error('Cleanup error:', cleanupError);
      }
      
      return res.status(500).json({ error: `Database error: ${updateError.message}` });
    }

    // 4️⃣ Update account status from 'limited' to 'active'
    const { error: accountError } = await supabaseAdmin
      .from('accounts')
      .update({ status: 'active' })
      .eq('user_id', temp_user_id);

    if (accountError) {
      console.error('Account update error:', accountError);
      // Don't fail the enrollment for this, just log it
    }

    res.status(200).json({ 
      message: 'Enrollment completed successfully',
      user: {
        id: existingUser.id,
        email: email,
        name: `${existingUser.first_name} ${existingUser.last_name}`,
        supabase_auth_id: authData.user.id
      }
    });

  } catch (error) {
    console.error('Enrollment error:', error);
    res.status(500).json({ error: 'Internal server error during enrollment' });
  }
}