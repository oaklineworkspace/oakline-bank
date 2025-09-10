
import { supabase } from '../../lib/supabaseClient';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { accountId, cardholderName } = req.body;

    if (!accountId || !cardholderName) {
      return res.status(400).json({ error: 'Account ID and cardholder name are required' });
    }

    // Check if user already has a pending application for this account
    const { data: existingApplication, error: checkError } = await supabase
      .from('card_applications')
      .select('id')
      .eq('user_id', user.id)
      .eq('account_id', accountId)
      .eq('status', 'pending')
      .single();

    if (existingApplication) {
      return res.status(400).json({ error: 'You already have a pending card application for this account' });
    }

    // Verify the account belongs to the user
    const { data: account, error: accountError } = await supabase
      .from('accounts')
      .select('id, user_id')
      .eq('id', accountId)
      .single();

    if (accountError || !account) {
      return res.status(404).json({ error: 'Account not found' });
    }

    // Create the card application
    const { data: application, error: applicationError } = await supabase
      .from('card_applications')
      .insert([{
        user_id: user.id,
        account_id: accountId,
        cardholder_name: cardholderName,
        status: 'pending',
        applied_at: new Date().toISOString()
      }])
      .select()
      .single();

    if (applicationError) {
      console.error('Error creating card application:', applicationError);
      return res.status(500).json({ error: 'Failed to submit card application' });
    }

    res.status(200).json({
      success: true,
      message: 'Card application submitted successfully',
      application
    });

  } catch (error) {
    console.error('Error in apply-card:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
