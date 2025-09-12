
import { supabase } from '../../lib/supabaseClient';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get the authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Missing or invalid authorization header' });
    }

    // Extract the token
    const token = authHeader.replace('Bearer ', '');
    
    // Verify the user
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      console.error('Auth error:', authError);
      return res.status(401).json({ error: 'Invalid or expired token' });
    }

    const { accountId, cardholderName } = req.body;

    if (!accountId || !cardholderName) {
      return res.status(400).json({ error: 'Account ID and cardholder name are required' });
    }

    // Check if user already has a pending application
    const { data: existingApplication } = await supabase
      .from('card_applications')
      .select('id')
      .eq('user_id', user.id)
      .eq('status', 'pending')
      .single();

    if (existingApplication) {
      return res.status(400).json({ error: 'You already have a pending card application' });
    }

    // Verify the account exists and belongs to the user
    const { data: account, error: accountError } = await supabase
      .from('accounts')
      .select('id, user_id, email')
      .eq('id', accountId)
      .single();

    if (accountError || !account) {
      return res.status(404).json({ error: 'Account not found' });
    }

    // Check if account belongs to user (either by user_id or email)
    if (account.user_id !== user.id && account.email !== user.email) {
      return res.status(403).json({ error: 'Account does not belong to you' });
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
      message: 'Card application submitted successfully! You will receive an email confirmation shortly.',
      application
    });

  } catch (error) {
    console.error('Error in apply-card:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
import { supabase } from '../../lib/supabaseClient';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ message: 'No authorization header' });
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);

    if (userError || !user) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    const { account_id } = req.body;

    if (!account_id) {
      return res.status(400).json({ message: 'Account ID is required' });
    }

    // Verify the account belongs to the user
    const { data: account, error: accountError } = await supabase
      .from('accounts')
      .select('*')
      .eq('id', account_id)
      .eq('user_id', user.id)
      .single();

    if (accountError || !account) {
      return res.status(404).json({ message: 'Account not found' });
    }

    // Check if user already has a card for this account
    const { data: existingCard } = await supabase
      .from('cards')
      .select('*')
      .eq('account_id', account_id)
      .eq('user_id', user.id)
      .single();

    if (existingCard) {
      return res.status(400).json({ message: 'You already have a card for this account' });
    }

    // Check if there's already a pending application
    const { data: existingApplication } = await supabase
      .from('card_applications')
      .select('*')
      .eq('account_id', account_id)
      .eq('user_id', user.id)
      .eq('status', 'pending')
      .single();

    if (existingApplication) {
      return res.status(400).json({ message: 'You already have a pending application for this account' });
    }

    // Get user profile for cardholder name
    const { data: profile } = await supabase
      .from('applications')
      .select('first_name, last_name')
      .eq('email', user.email)
      .single();

    const cardholderName = profile 
      ? `${profile.first_name || ''} ${profile.last_name || ''}`.trim()
      : user.email.split('@')[0];

    // Create card application
    const { data: application, error: applicationError } = await supabase
      .from('card_applications')
      .insert({
        user_id: user.id,
        account_id: account_id,
        cardholder_name: cardholderName,
        status: 'pending',
        applied_at: new Date().toISOString()
      })
      .select()
      .single();

    if (applicationError) {
      console.error('Error creating application:', applicationError);
      return res.status(500).json({ message: 'Error creating application' });
    }

    return res.status(200).json({
      success: true,
      message: 'Card application submitted successfully',
      application: application
    });

  } catch (error) {
    console.error('Server error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
