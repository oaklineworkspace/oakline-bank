// pages/api/applications.js
import { supabaseAdmin } from '../../lib/supabaseClient';
import nodemailer from 'nodemailer';

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
    account_types
  } = req.body;

  // Basic server-side validation
  if (!first_name || !last_name || !email || !dob || !address_line1 || !city || !state || !country || account_types.length === 0) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  if (country === 'US' && !/^\d{3}-\d{2}-\d{4}$/.test(ssn)) {
    return res.status(400).json({ error: 'Invalid SSN format' });
  }

  if (country !== 'US' && !id_number) {
    return res.status(400).json({ error: 'ID number required for non-US users' });
  }

  try {
    // Insert user into 'users' table
    const { data: user, error: userError } = await supabaseAdmin
      .from('users')
      .insert([{
        first_name,
        middle_name,
        last_name,
        mothers_maiden_name,
        email,
        phone,
        ssn: ssn || null,
        id_number: id_number || null,
        dob,
        address_line1,
        address_line2,
        city,
        state,
        county,
        country
      }])
      .select()
      .single();

    if (userError) {
      return res.status(400).json({ error: userError.message });
    }

    // Generate unique account number
    const accountNumber = 'AC' + Math.floor(10000000 + Math.random() * 90000000);

    // Insert first selected account type (you can loop if multiple accounts)
    const { data: account, error: accountError } = await supabaseAdmin
      .from('accounts')
      .insert([{
        user_id: user.id,
        account_number: accountNumber,
        account_type: account_types[0],
        balance: 0.00
      }])
      .select()
      .single();

    if (accountError) {
      return res.status(400).json({ error: accountError.message });
    }

    // Send welcome email with enroll link
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: true,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });

    const enrollLink = `${process.env.NEXT_PUBLIC_SITE_URL}/enroll?account=${accountNumber}`;

    const mailOptions = {
      from: process.env.SMTP_FROM,
      to: email,
      subject: 'Welcome to Oakline Bank!',
      html: `
        <h2>Welcome, ${first_name}!</h2>
        <p>Your account has been created in limited mode.</p>
        <p><strong>Account Number:</strong> ${accountNumber}</p>
        <p>Click below to enroll in online banking and set your password:</p>
        <a href="${enrollLink}" style="display:inline-block;padding:10px 20px;background-color:#0070f3;color:#fff;border-radius:5px;text-decoration:none;">Enroll Now</a>
        <p>Thank you for choosing Oakline Bank.</p>
      `
    };

    await transporter.sendMail(mailOptions);

    return res.status(200).json({ message: 'Application submitted successfully', accountNumber });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
}
