
import { supabase } from '../../lib/supabaseClient';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Get user's card applications
    const { data: applications, error: applicationsError } = await supabase
      .from('card_applications')
      .select(`
        *,
        accounts!inner(
          id,
          account_number,
          account_type
        )
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    // Get user's approved/active cards
    const { data: cards, error: cardsError } = await supabase
      .from('cards')
      .select(`
        *,
        accounts!inner(
          id,
          account_number,
          account_type
        )
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (applicationsError && cardsError) {
      console.error('Error fetching user cards:', { applicationsError, cardsError });
      return res.status(500).json({ error: 'Failed to fetch card information' });
    }

    res.status(200).json({
      success: true,
      applications: applications || [],
      cards: cards || []
    });

  } catch (error) {
    console.error('Error in get-user-cards:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
