
import { supabaseAdmin } from '../../lib/supabaseAdmin';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email, application_id, token } = req.body;

  if ((!email && !token) || !application_id) {
    return res.status(400).json({ error: 'Email/token and application_id are required' });
  }

  try {
    // Get application data if it exists
    let applicationData = null;
    if (application_id) {
      const { data, error: applicationError } = await supabaseAdmin
        .from('applications')
        .select('*')
        .eq('id', application_id)
        .maybeSingle();
      
      applicationData = data;
    }

    const userEmail = email || applicationData?.email;
    
    if (!userEmail) {
      return res.status(400).json({ error: 'Email is required' });
    }

    // Check if Supabase Auth user already exists
    let authUser = null;
    
    try {
      const { data: existingUsers, error: listError } = await supabaseAdmin.auth.admin.listUsers();
      if (listError) {
        console.error('Error listing users:', listError);
        return res.status(500).json({ error: 'Failed to check existing users' });
      }
      
      const existingUser = existingUsers?.users?.find(user => user.email === userEmail);

      if (!existingUser) {
        // Create Supabase Auth user with temporary password
        const tempPassword = `temp_${Date.now()}_${Math.random().toString(36).substring(2)}`;
        
        console.log('Creating new auth user for:', userEmail);
        const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
          email: userEmail,
          password: tempPassword,
          email_confirm: true,
          user_metadata: {
            first_name: applicationData?.first_name || '',
            last_name: applicationData?.last_name || '',
            middle_name: applicationData?.middle_name || '',
            application_id: application_id
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

        // Wait a moment for auth user to fully propagate
        await new Promise(resolve => setTimeout(resolve, 500));

        // Create profile record immediately after auth user creation
        if (applicationData) {
          try {
            const { error: profileError } = await supabaseAdmin
              .from('profiles')
              .insert([{
                id: authUser.id,
                application_id: application_id,
                email: userEmail,
                first_name: applicationData.first_name,
                middle_name: applicationData.middle_name || null,
                last_name: applicationData.last_name,
                phone: applicationData.phone || null,
                date_of_birth: applicationData.date_of_birth || null,
                country: applicationData.country || null,
                city: applicationData.city || null,
                state: applicationData.state || null,
                zip_code: applicationData.zip_code || null,
                address: applicationData.address || null,
                ssn: applicationData.ssn || null,
                id_number: applicationData.id_number || null,
                employment_status: applicationData.employment_status || null,
                annual_income: applicationData.annual_income || null,
                mothers_maiden_name: applicationData.mothers_maiden_name || null,
                account_types: applicationData.account_types || [],
                enrollment_completed: false,
                password_set: false,
                application_status: 'pending'
              }]);

            if (profileError) {
              console.error('Error creating profile:', profileError);
              // If it's a duplicate, try updating instead
              if (profileError.code === '23505') {
                const { error: updateError } = await supabaseAdmin
                  .from('profiles')
                  .update({
                    application_id: application_id,
                    email: userEmail,
                    first_name: applicationData.first_name,
                    middle_name: applicationData.middle_name || null,
                    last_name: applicationData.last_name,
                    updated_at: new Date().toISOString()
                  })
                  .eq('id', authUser.id);

                if (!updateError) {
                  console.log('Profile updated successfully for user:', authUser.id);
                }
              }
            } else {
              console.log('Profile created successfully for user:', authUser.id);
            }
          } catch (profileErr) {
            console.error('Profile creation failed:', profileErr);
            // Continue anyway - profile can be created during enrollment
          }
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
        id: application_id,
        email: userEmail,
        name: applicationData ? `${applicationData.first_name} ${applicationData.middle_name ? applicationData.middle_name + ' ' : ''}${applicationData.last_name}` : '',
        auth_id: authUser.id
      }
    });

  } catch (error) {
    console.error('Create auth user error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
