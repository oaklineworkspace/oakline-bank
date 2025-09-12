
import { supabase } from '../../lib/supabaseClient';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
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

    // Get user's accounts
    const { data: accounts, error: accountsError } = await supabase
      .from('accounts')
      .select('*')
      .eq('user_id', user.id);

    if (accountsError) {
      console.error('Error fetching accounts:', accountsError);
      return res.status(500).json({ message: 'Error fetching accounts' });
    }

    // Get user's cards
    const { data: cards, error: cardsError } = await supabase
      .from('cards')
      .select(`
        *,
        accounts (
          id,
          account_number,
          account_type,
          balance,
          user_id
        )
      `)
      .eq('user_id', user.id)
      .eq('status', 'active');

    if (cardsError) {
      console.error('Error fetching cards:', cardsError);
      return res.status(500).json({ message: 'Error fetching cards' });
    }

    // Get card applications
    const { data: applications, error: applicationsError } = await supabase
      .from('card_applications')
      .select(`
        *,
        accounts (
          id,
          account_number,
          account_type,
          balance,
          user_id
        )
      `)
      .eq('user_id', user.id);

    if (applicationsError) {
      console.error('Error fetching applications:', applicationsError);
      return res.status(500).json({ message: 'Error fetching applications' });
    }

    return res.status(200).json({
      success: true,
      cards: cards || [],
      applications: applications || [],
      accounts: accounts || []
    });

  } catch (error) {
    console.error('Server error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
