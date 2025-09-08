// pages/api/create-auth-user.js
import { supabaseAdmin } from '../../lib/supabaseClient';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { token } = req.body; // Expecting a token, not temp_user_id

  if (!token) {
    return res.status(400).json({ error: 'Missing token' });
  }

  try {
    // 1️⃣ Get enrollment data using the token
    const { data: enrollmentData, error: enrollmentError } = await supabaseAdmin
      .from('enrollments')
      .select('*')
      .eq('token', token)
      .eq('is_used', false) // Ensure the token hasn't been used
      .single();

    if (enrollmentError || !enrollmentData) {
      return res.status(404).json({ error: 'Invalid or used enrollment token' });
    }

    // Fetch application data using the email from enrollment
    const { data: applicationData, error: applicationError } = await supabaseAdmin
      .from('applications')
      .select('*')
      .eq('email', enrollmentData.email)
      .single();

    if (applicationError || !applicationData) {
      return res.status(404).json({ error: 'Application data not found for this email' });
    }

    // 4️⃣ Check if auth user already exists
    const { data: existingAuthUsers, error: listError } = await supabaseAdmin.auth.admin.listUsers();
    const existingAuthUser = existingAuthUsers?.users?.find(user => user.email === applicationData.email);

    if (existingAuthUser) {
      // Mark token as used
      await supabaseAdmin
        .from('enrollments')
        .update({ is_used: true })
        .eq('token', token);

      return res.status(200).json({
        message: 'Auth user already exists',
        user: {
          id: applicationData.id,
          email: applicationData.email,
          name: `${applicationData.first_name} ${applicationData.last_name}`,
          auth_created: true,
          supabase_auth_id: existingAuthUser.id
        }
      });
    }

    // 5️⃣ Create Supabase Auth user with proper user metadata
    const userMetadata = {
      first_name: applicationData.first_name,
      last_name: applicationData.last_name,
      country: applicationData.country,
      application_id: applicationData.id
    };

    // Add the appropriate ID field based on country
    if (applicationData.country === 'US') {
      userMetadata.ssn = applicationData.ssn;
    } else {
      userMetadata.id_number = applicationData.id_number;
    }

    const { data: newAuthData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: applicationData.email,
      password: 'temp_password_' + Date.now(), // Temporary password
      email_confirm: true,
      user_metadata: userMetadata
    });

    if (authError) {
      console.error('Auth user creation error:', authError);

      // Handle case where user already exists in auth but wasn't caught by listUsers
      if (authError.message?.includes('already registered') ||
          authError.message?.includes('already exists') ||
          authError.message?.includes('User already registered')) {
        console.log('User already exists in auth, marking token as used and returning success');
        await supabaseAdmin
          .from('enrollments')
          .update({ is_used: true })
          .eq('token', token);
        return res.status(200).json({
          message: 'Auth user already exists (not found in initial search)',
          user: {
            id: applicationData.id,
            email: applicationData.email,
            name: `${applicationData.first_name} ${applicationData.last_name}`,
            country: applicationData.country,
            auth_created: true
          }
        });
      }

      return res.status(400).json({ error: `Failed to create auth user: ${authError.message}` });
    }

    console.log('Auth user created successfully:', newAuthData.user.id);

    // 6️⃣ Mark enrollment token as used
    const { error: updateError } = await supabaseAdmin
      .from('enrollments')
      .update({ is_used: true })
      .eq('token', token);

    if (updateError) {
      console.error('Token update error:', updateError);
      // Don't fail the process for this
    }

    res.status(200).json({
      message: 'Auth user created successfully',
      user: {
        id: applicationData.id,
        email: applicationData.email,
        name: `${applicationData.first_name} ${applicationData.last_name}`,
        country: applicationData.country,
        auth_created: true,
        supabase_auth_id: newAuthData.user.id
      }
    });

  } catch (error) {
    console.error('Create auth user error:', error);
    res.status(500).json({ error: 'Internal server error during auth user creation' });
  }
}