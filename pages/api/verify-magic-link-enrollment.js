
import { supabaseAdmin } from '../../lib/supabaseAdmin';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { userId, email, applicationId } = req.body;

  if (!userId || !email || !applicationId) {
    return res.status(400).json({ error: 'User ID, email, and application ID are required' });
  }

  try {
    // Verify the auth user exists
    const { data: authUser, error: authError } = await supabaseAdmin.auth.admin.getUserById(userId);
    
    if (authError || !authUser.user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (authUser.user.email !== email) {
      return res.status(400).json({ error: 'Email mismatch' });
    }

    // Get application data
    const { data: applicationData, error: applicationError } = await supabaseAdmin
      .from('applications')
      .select('*')
      .eq('id', applicationId)
      .eq('email', email)
      .single();

    if (applicationError || !applicationData) {
      return res.status(404).json({ error: 'Application not found or email mismatch' });
    }

    // Get account numbers for this application
    const { data: accounts, error: accountsError } = await supabaseAdmin
      .from('accounts')
      .select('account_number, account_type')
      .eq('application_id', applicationId);

    if (accountsError) {
      console.error('Error fetching accounts:', accountsError);
    }

    const accountNumbers = accounts?.filter(acc => acc.account_number).map(acc => acc.account_number) || [];

    res.status(200).json({
      message: 'Magic link verification successful',
      application: applicationData,
      account_numbers: accountNumbers,
      user: {
        id: authUser.user.id,
        email: authUser.user.email
      }
    });

  } catch (error) {
    console.error('Magic link verification error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
