// pages/api/applications.js
import { supabaseAdmin } from '../../lib/supabaseClient';
import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const data = req.body;
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
  } = data;

  // Validate required fields
  if (!first_name || !last_name || !email || !dob || !address_line1 || !city || !state || !country || !account_types.length) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  // Validate SSN / ID
  if (country === 'US' && (!ssn || !/^\d{3}-\d{2}-\d{4}$/.test(ssn))) {
    return res.status(400).json({ error: 'Valid SSN is required for US users (format XXX-XX-XXXX)' });
  }
  if (country !== 'US' && !id_number) {
    return res.status(400).json({ error: 'ID number is required for non-US users' });
  }

  try {
    // 1️⃣ Insert user into Supabase
    const { data: user, error: userError } = await supabaseAdmin
      .from('users')
      .insert([{
        first_name,
        middle_name,
        last_name,
        mothers_maiden_name,
        email,
        phone: phone || null,
        ssn: country === 'US' ? ssn : null,
        id_number: country !== 'US' ? id_number : null,
        dob,
        address_line1,
        address_line2: address_line2 || null,
        city,
        state,
        county: county || null,
        country
      }])
      .select()
      .single();
    if (userError) throw userError;

    // 2️⃣ Insert accounts with random 10-digit numbers and permanent routing
    const accountNumbers = [];
    const routingNumber = '075915826'; // your permanent routing number

    for (let type of account_types) {
      let accountNumber;
      do {
        accountNumber = Math.floor(1000000000 + Math.random() * 9000000000).toString();
      } while (accountNumbers.includes(accountNumber)); // avoid duplicates in same submission

      accountNumbers.push(accountNumber);

      await supabaseAdmin.from('accounts').insert({
        user_id: user.id,
        account_number: accountNumber,
        routing_number: routingNumber,
        account_type: type,
        balance: 0,
        status: 'limited'
      });
    }

    // 3️⃣ Send enrollment email
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: true,
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
    });

    const enrollLink = `https://oaklineworkspac-oakline-bank.repl.co/enroll?temp_user_id=${user.id}`;

    await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to: email,
      subject: 'Welcome to Oakline Bank!',
      html: `
        <h2>Welcome, ${first_name}!</h2>
        <p>Your accounts are in limited mode.</p>
        <p>Account Numbers: ${accountNumbers.join(', ')}</p>
        <p><a href="${enrollLink}" style="padding:10px 20px;background:#0070f3;color:#fff;text-decoration:none;border-radius:5px;">Enroll Now</a></p>
      `
    });

    res.status(200).json({ message: 'Application received', accountNumbers });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
}
