import { supabase } from '../../lib/supabaseClient';
import nodemailer from 'nodemailer';

// Send Email Function
const sendEmail = async (to, subject, text) => {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: true, // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const mailOptions = {
    from: process.env.SMTP_FROM,
    to,
    subject,
    text,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully');
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

// Account Creation (User Registration)
export const createAccount = async (req, res) => {
  const {
    firstName,
    middleName,
    lastName,
    dob,
    ssn,
    maidenName,
    address,
    city,
    state,
    zip,
    country,
    accountType,
  } = req.body;

  try {
    // Create user with Supabase Auth
    const { user, error: authError } = await supabase.auth.signUp({
      email: `${firstName}.${lastName}@example.com`, // Generate a unique email address (replace with your logic)
      password: 'SecurePassword123', // You can ask the user to create a password later, or do it here
    });

    if (authError) {
      return res.status(400).json({ error: authError.message });
    }

    // Store user details in 'users' table
    const { error: insertError } = await supabase
      .from('users')
      .insert([
        {
          user_id: user.id,
          first_name: firstName,
          middle_name: middleName,
          last_name: lastName,
          dob,
          ssn,
          maiden_name: maidenName,
          address,
          city,
          state,
          zip,
          country,
          account_type: accountType, // Store selected account types as an array
          status: 'limited', // Initially, the account will be in 'limited' mode
        },
      ]);

    if (insertError) {
      return res.status(400).json({ error: insertError.message });
    }

    // Send email to user
    const emailSubject = 'Welcome to Oakline Bank';
    const emailBody = `Hello ${firstName} ${lastName},\n\nYour account has been created successfully. Please follow the instructions to complete your account setup.`;

    await sendEmail(user.email, emailSubject, emailBody);

    return res.status(200).json({ message: 'Account created successfully' });
  } catch (error) {
    return res.status(500).json({ error: 'Something went wrong' });
  }
};

// Reset Password
export const resetPassword = async (req, res) => {
  const { email } = req.body;

  const { error } = await supabase.auth.api.resetPasswordForEmail(email);

  if (error) return res.status(400).json({ error: error.message });

  // Send password reset email (Supabase handles this automatically)
  const subject = 'Password Reset Request';
  const text = `You requested a password reset. Please follow the instructions in the email from Supabase to reset your password.`;

  await sendEmail(email, subject, text);

  res.status(200).json({ message: 'Password reset email sent' });
};

// MFA Setup
export const setupMFA = async (req, res) => {
  const { user_id, mfa_method } = req.body;
  // Add logic to set up MFA (e.g., using OTP, SMS, or Authenticator App)
  res.status(200).json({ message: 'MFA setup successful' });
};

// Profile Update
export const updateProfile = async (req, res) => {
  const { user_id, name, phone_number } = req.body;

  const { error } = await supabase
    .from('users')
    .update({ name, phone_number })
    .eq('user_id', user_id);

  if (error) return res.status(400).json({ error: error.message });

  // Send profile update email notification
  const subject = 'Profile Updated';
  const text = `Hello ${name},\n\nYour profile information has been updated successfully.`;

  await sendEmail(req.body.email, subject, text);

  res.status(200).json({ message: 'Profile updated successfully' });
};
