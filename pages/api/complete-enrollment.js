// pages/api/complete-enrollment.js
import { supabaseAdmin } from '../../lib/supabaseClient';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { temp_user_id, email, password } = req.body;

  if (!temp_user_id || !email || !password) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    // 1️⃣ Check if user exists and hasn't already enrolled
    const { data: existingUser, error: userError } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('id', temp_user_id)
      .single();

    if (userError || !existingUser) {
      return res.status(404).json({ error: 'User not found or invalid enrollment link' });
    }

    if (existingUser.auth_id) {
      return res.status(400).json({ error: 'User has already completed enrollment' });
    }

    // 2️⃣ Create user in Supabase Auth
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: email,
      password: password,
      email_confirm: true // Auto-confirm email
    });

    if (authError) {
      console.error('Auth error:', authError);
      return res.status(400).json({ error: `Authentication error: ${authError.message}` });
    }

    // 3️⃣ Update user record with auth_id
    const { data: updateData, error: updateError } = await supabaseAdmin
      .from('users')
      .update({ 
        auth_id: authData.user.id,
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
        auth_id: authData.user.id
      }
    });

  } catch (error) {
    console.error('Enrollment error:', error);
    res.status(500).json({ error: 'Internal server error during enrollment' });
  }
}