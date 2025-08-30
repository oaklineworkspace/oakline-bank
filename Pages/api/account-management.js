import { supabase } from '../../lib/supabaseClient';

// Account Creation (User Registration)
export const createAccount = async (req, res) => {
  const { email, password, name } = req.body;
  const { data, error } = await supabase.auth.signUp({
    email,
    password
  });

  if (error) return res.status(400).json({ error: error.message });

  // Store additional user data in a users table if needed
  const { error: insertError } = await supabase
    .from('users')
    .insert([{ email, name, user_id: data.user.id }]);

  if (insertError) return res.status(400).json({ error: insertError.message });

  res.status(200).json({ message: 'Account created successfully' });
};

// Reset Password
export const resetPassword = async (req, res) => {
  const { email } = req.body;
  const { error } = await supabase.auth.api.resetPasswordForEmail(email);

  if (error) return res.status(400).json({ error: error.message });

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

  res.status(200).json({ message: 'Profile updated successfully' });
};
