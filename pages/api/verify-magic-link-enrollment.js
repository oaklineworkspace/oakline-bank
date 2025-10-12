
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

    // Check if enrollment is already completed (enrollment record may not exist for magic links)
    const { data: enrollment, error: enrollmentError } = await supabaseAdmin
      .from('enrollments')
      .select('is_used, completed_at')
      .eq('application_id', applicationId)
      .eq('email', email)
      .maybeSingle(); // Use maybeSingle() instead of single() to allow null results

    // Only block if enrollment record exists and is already used
    if (enrollment && enrollment.is_used) {
      return res.status(400).json({ 
        error: 'This enrollment has already been completed. Please sign in using your password.',
        enrollment_completed: true
      });
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
      enrollment_completed: false,
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
