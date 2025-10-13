
import { supabaseAdmin } from '../../lib/supabaseAdmin';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { token, application_id } = req.body;

  if (!token || !application_id) {
    return res.status(400).json({ error: 'Token and application_id are required' });
  }

  try {
    // 1. Verify enrollment token
    const { data: enrollmentData, error: enrollmentError } = await supabaseAdmin
      .from('enrollments')
      .select('*')
      .eq('token', token)
      .eq('is_used', false)
      .single();

    if (enrollmentError || !enrollmentData) {
      return res.status(404).json({ error: 'Invalid or already used enrollment token' });
    }

    // 2. Get application data
    const { data: applicationData, error: applicationError } = await supabaseAdmin
      .from('applications')
      .select('*')
      .eq('id', application_id)
      .single();

    if (applicationError || !applicationData) {
      return res.status(404).json({ error: 'Application not found' });
    }

    // 3. Verify email matches
    if (enrollmentData.email !== applicationData.email) {
      return res.status(400).json({ error: 'Email verification failed' });
    }

    // 4. Check if Supabase Auth user already exists
    let authUser = null;
    
    try {
      const { data: existingUsers, error: listError } = await supabaseAdmin.auth.admin.listUsers();
      if (listError) {
        console.error('Error listing users:', listError);
        return res.status(500).json({ error: 'Failed to check existing users' });
      }
      
      const existingUser = existingUsers?.users?.find(user => user.email === applicationData.email);

      if (!existingUser) {
        // Create Supabase Auth user with temporary password
        const tempPassword = `temp_${Date.now()}_${Math.random().toString(36).substring(2)}`;
        
        console.log('Creating new auth user for:', applicationData.email);
        const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
          email: applicationData.email,
          password: tempPassword,
          email_confirm: true,
          user_metadata: {
            first_name: applicationData.first_name,
            last_name: applicationData.last_name,
            middle_name: applicationData.middle_name,
            application_id: applicationData.id
          }
        });

        if (createError) {
          console.error('Error creating auth user:', createError);
          return res.status(500).json({ 
            error: 'Failed to create user account',
            details: createError.message 
          });
        }

        authUser = newUser.user;
        console.log('Auth user created successfully:', authUser.id);
        
        // Create profile record manually if the trigger didn't work
        try {
          const { error: profileError } = await supabaseAdmin
            .from('profiles')
            .insert({
              id: authUser.id,
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
              ssn: applicationData.ssn,
              id_number: applicationData.id_number,
              application_id: applicationData.id,
              enrollment_completed: false
            });
            
          if (profileError) {
            console.log('Profile creation error (may be expected if trigger works):', profileError.message);
          } else {
            console.log('Profile created successfully');
          }
        } catch (profileCreateError) {
          console.log('Profile creation attempt failed:', profileCreateError.message);
        }
        
      } else {
        authUser = existingUser;
        console.log('Using existing auth user:', authUser.id);
      }
    } catch (userCreationError) {
      console.error('Auth user creation process error:', userCreationError);
      return res.status(500).json({ 
        error: 'Failed to process user authentication',
        details: userCreationError.message 
      });
    }

    res.status(200).json({
      message: 'Auth user ready for enrollment',
      user: {
        id: applicationData.id,
        email: applicationData.email,
        name: `${applicationData.first_name} ${applicationData.middle_name ? applicationData.middle_name + ' ' : ''}${applicationData.last_name}`,
        auth_id: authUser.id
      }
    });

  } catch (error) {
    console.error('Create auth user error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
