// pages/api/create-auth-user.js
import { supabaseAdmin } from '../../lib/supabaseClient';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { temp_user_id } = req.body;

  if (!temp_user_id) {
    return res.status(400).json({ error: 'Missing temp_user_id' });
  }

  try {
    // 1️⃣ Get user from database
    const { data: existingUser, error: userError } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('id', temp_user_id)
      .single();

    if (userError || !existingUser) {
      return res.status(404).json({ error: 'User not found or invalid enrollment link' });
    }

    // 2️⃣ Check if auth user already exists
    const { data: existingAuthUsers, error: listError } = await supabaseAdmin.auth.admin.listUsers();
    const existingAuthUser = existingAuthUsers?.users?.find(user => user.email === existingUser.email);
    
    if (existingAuthUser) {
      // Auth user already exists
      return res.status(200).json({ 
        message: 'Auth user already exists',
        user: {
          id: existingUser.id,
          email: existingUser.email,
          name: `${existingUser.first_name} ${existingUser.last_name}`,
          auth_created: true,
          supabase_auth_id: existingAuthUser.id
        }
      });
    }

    // 3️⃣ Create auth user immediately with temporary password
    const tempPassword = `temp_${Date.now()}_${Math.random().toString(36).substring(7)}`;
    
    console.log('Creating auth user for:', existingUser.email);
    
    const { data: newAuthData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: existingUser.email,
      password: tempPassword,
      email_confirm: true // Auto-confirm email
    });

    if (authError) {
      console.error('Auth creation error details:', {
        message: authError.message,
        status: authError.status,
        details: authError
      });
      
      // Handle case where user already exists but wasn't found
      if (authError.message?.includes('already registered') || 
          authError.message?.includes('already exists') ||
          authError.message?.includes('User already registered')) {
        console.log('User already exists in auth, returning success');
        return res.status(200).json({ 
          message: 'Auth user already exists (not found in initial search)',
          user: {
            id: existingUser.id,
            email: existingUser.email,
            name: `${existingUser.first_name} ${existingUser.last_name}`,
            country: existingUser.country,
            auth_created: true
          }
        });
      }
      
      return res.status(400).json({ error: `Failed to create auth user: Database error creating new user - ${authError.message}` });
    }

    console.log('Auth user created successfully:', newAuthData.user.id);

    // 4️⃣ Update user record to mark auth as created
    const { error: updateError } = await supabaseAdmin
      .from('users')
      .update({ 
        updated_at: new Date().toISOString()
      })
      .eq('id', temp_user_id);

    if (updateError) {
      console.error('Database update error:', updateError);
      // Don't fail the process for this
    }

    res.status(200).json({ 
      message: 'Auth user created successfully',
      user: {
        id: existingUser.id,
        email: existingUser.email,
        name: `${existingUser.first_name} ${existingUser.last_name}`,
        country: existingUser.country,
        auth_created: true,
        supabase_auth_id: newAuthData.user.id
      }
    });

  } catch (error) {
    console.error('Create auth user error:', error);
    res.status(500).json({ error: 'Internal server error during auth user creation' });
  }
}