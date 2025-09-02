// pages/api/applications.js

import { supabaseAdmin } from '../../lib/supabaseClient'; // Use admin client
import { sendEmail } from '../../lib/email';

// Generate a random 10-digit account number
function generateAccountNumber() {
  return Math.floor(1000000000 + Math.random() * 9000000000).toString();
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const {
    first_name,
    middle_name,
    last_name,
    mothers_maiden_name,
    email,
    phone,
    ssn,
    id_number,
    dob,
    address_line1,
    address_line2,
    city,
    state,
    county,
    country,
    account_types,
  } = req.body;

  try {
    // Insert user into Supabase using admin client
    const { data: user, error: userError } = await supabaseAdmin
      .from('users')
      .insert([{
        first_name,
        middle_name,
        last_name,
        mothers_maiden_name,
        email,
        phone,
        ssn,
        id_number,
        dob,
        address_line1,
        address_line2,
        city,
        state,
        county,
        country,
      }])
      .select()
      .single();

    if (userError) throw userError;

    const createdAccounts = [];

    // Insert accounts for each selected account type
    for (const type of account_types) {
      const accountNumber = generateAccountNumber();
      const { data: account, error: accountError } = await supabaseAdmin
        .from('accounts')
        .insert([{
          user_id: user.id,
          account_number: accountNumber,
          account_type: type,
        }])
        .select()
        .single();

      if (accountError) throw accountError;

      createdAccounts.push(account);
    }

    // Insert application record
    await supabaseAdmin
      .from('applications')
      .insert([{
        user_id: user.id,
        account_number: createdAccounts.map(acc => acc.account_number).join(', '),
      }]);

    // Send welcome email
    const accountNumbersList = createdAccounts.map(acc => `<li>${acc.account_type}: ${acc.account_number}</li>`).join('');
    await sendEmail({
      to: email,
      subject: 'Welcome to Oakline Bank!',
      text: `Hello ${first_name},\n\nYour application has been received!\nYour accounts:\n${createdAccounts.map(acc => acc.account_type + ': ' + acc.account_number).join('\n')}\nEnroll in online banking at: ${process.env.NEXT_PUBLIC_SITE_URL}/login`,
      html: `
        <p>Hello <strong>${first_name}</strong>,</p>
        <p>Your application has been received!</p>
        <p>Your accounts:</p>
        <ul>
          ${accountNumbersList}
        </ul>
        <p><a href="${process.env.NEXT_PUBLIC_SITE_URL}/login">Click here to enroll in online banking</a></p>
      `,
    });

    res.status(200).json({ message: 'Application submitted and email sent!' });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to submit application', details: err.message });
  }
}
