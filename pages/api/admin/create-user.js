
import { supabaseAdmin } from '../../../lib/supabaseClient';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Basic admin check - in production, you'd want proper admin authentication
  const adminKey = req.headers['x-admin-key'];
  if (adminKey !== process.env.ADMIN_SECRET_KEY) {
    return res.status(401).json({ error: 'Unauthorized - Invalid admin credentials' });
  }

  const {
    firstName,
    middleName,
    lastName,
    mothersMaidenName,
    email,
    phone,
    dateOfBirth,
    ssn,
    idNumber,
    country,
    address,
    city,
    state,
    zipCode,
    accountTypes,
    employmentStatus,
    annualIncome,
    password,
    sendEnrollmentEmail = true
  } = req.body;

  // Validation
  if (!firstName || !lastName || !email || !dateOfBirth || !address || !city || !state || !zipCode || !accountTypes?.length || !annualIncome || !password) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  if (country === 'US' && !ssn) {
    return res.status(400).json({ error: 'SSN is required for US residents' });
  }

  if (country !== 'US' && !idNumber) {
    return res.status(400).json({ error: 'ID number is required for non-US residents' });
  }

  try {
    // 1. Check if user already exists
    const { data: existingUser } = await supabaseAdmin
      .from('applications')
      .select('email')
      .eq('email', email)
      .single();

    if (existingUser) {
      return res.status(409).json({ error: 'User with this email already exists' });
    }

    // 2. Create application record
    const applicationData = {
      first_name: firstName,
      middle_name: middleName || null,
      last_name: lastName,
      mothers_maiden_name: mothersMaidenName || null,
      email: email.toLowerCase(),
      phone: phone || null,
      date_of_birth: dateOfBirth,
      ssn: country === 'US' ? ssn : null,
      id_number: country !== 'US' ? idNumber : null,
      country: country,
      address: address,
      city: city,
      state: state,
      zip_code: zipCode,
      account_types: accountTypes,
      employment_status: employmentStatus,
      annual_income: parseFloat(annualIncome),
      application_status: 'approved', // Admin created applications are pre-approved
      created_by_admin: true,
      submitted_at: new Date().toISOString(),
      processed_at: new Date().toISOString()
    };

    const { data: application, error: applicationError } = await supabaseAdmin
      .from('applications')
      .insert([applicationData])
      .select()
      .single();

    if (applicationError) {
      console.error('Application creation error:', applicationError);
      return res.status(500).json({ error: 'Failed to create application record' });
    }

    // 3. Create accounts for each selected account type
    const accountsData = accountTypes.map(accountType => {
      const accountTypeConfig = {
        'checking': { name: 'Checking Account', initialBalance: 100.00 },
        'savings': { name: 'Savings Account', initialBalance: 0.00 },
        'business': { name: 'Business Account', initialBalance: 500.00 },
        'premium': { name: 'Premium Account', initialBalance: 1000.00 }
      };

      const config = accountTypeConfig[accountType] || { name: 'Standard Account', initialBalance: 0.00 };

      // Generate unique 10-digit account number
      const accountNumber = Array.from({length: 10}, () => Math.floor(Math.random() * 10)).join('');

      return {
        application_id: application.id,
        account_number: accountNumber,
        account_type: accountType,
        account_name: config.name,
        balance: config.initialBalance,
        status: 'active',
        created_at: new Date().toISOString()
      };
    });

    const { data: accounts, error: accountsError } = await supabaseAdmin
      .from('accounts')
      .insert(accountsData)
      .select();

    if (accountsError) {
      console.error('Accounts creation error:', accountsError);
      return res.status(500).json({ error: 'Failed to create account records' });
    }

    // 4. Create Supabase Auth user
    const { data: authUser, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: email.toLowerCase(),
      password: password,
      email_confirm: true,
      user_metadata: {
        first_name: firstName,
        last_name: lastName,
        middle_name: middleName,
        application_id: application.id,
        admin_created: true
      }
    });

    if (authError) {
      console.error('Auth user creation error:', authError);
      return res.status(500).json({ error: 'Failed to create authentication account' });
    }

    // 5. Create profile record
    try {
      const { error: profileError } = await supabaseAdmin
        .from('profiles')
        .insert({
          id: authUser.user.id,
          email: email.toLowerCase(),
          first_name: firstName,
          last_name: lastName,
          middle_name: middleName,
          phone: phone,
          date_of_birth: dateOfBirth,
          country: country,
          address: address,
          city: city,
          state: state,
          zip_code: zipCode,
          application_id: application.id,
          created_at: new Date().toISOString()
        });

      if (profileError) {
        console.error('Profile creation error:', profileError);
        // Don't fail the whole process for profile creation
      }
    } catch (profileError) {
      console.error('Profile creation failed:', profileError);
    }

    // 6. Link accounts to auth user
    const { error: linkError } = await supabaseAdmin
      .from('accounts')
      .update({ user_id: authUser.user.id })
      .eq('application_id', application.id);

    if (linkError) {
      console.error('Account linking error:', linkError);
      // Don't fail for this error
    }

    // 7. Send welcome email if requested
    let emailSent = false;
    if (sendEnrollmentEmail) {
      try {
        const emailResponse = await fetch(`${req.headers.origin}/api/send-welcome-email`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            application_id: application.id,
            send_enrollment: true
          })
        });

        if (emailResponse.ok) {
          emailSent = true;
        }
      } catch (emailError) {
        console.error('Email sending error:', emailError);
      }
    }

    // 8. Success response
    res.status(201).json({
      message: 'User account created successfully',
      user: {
        id: application.id,
        auth_id: authUser.user.id,
        email: email,
        name: `${firstName} ${middleName ? middleName + ' ' : ''}${lastName}`,
        application_status: 'approved',
        created_by_admin: true
      },
      accounts: accounts.map(acc => ({
        account_number: acc.account_number,
        account_type: acc.account_type,
        account_name: acc.account_name,
        balance: acc.balance
      })),
      email_sent: emailSent
    });

  } catch (error) {
    console.error('Admin user creation error:', error);
    res.status(500).json({ error: 'Internal server error during user creation' });
  }
}
