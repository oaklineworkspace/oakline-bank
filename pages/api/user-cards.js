import { supabase } from '../../lib/supabaseClient';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // 1. Verify auth token
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Missing or invalid authorization header' });
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return res.status(401).json({ error: 'Invalid or expired token' });
    }

    console.log('Fetching cards for user:', user.id);

    // 2. Fetch cards with joined account info
    const { data: cardsData, error: cardsError } = await supabase
      .from('cards')
      .select(`
        *,
        accounts:account_id (
          id,
          account_number,
          account_type,
          balance
        )
      `)
      .eq('user_id', user.id);

    if (cardsError) throw cardsError;

    // Mask sensitive info
    const safeCards = (cardsData || []).map(card => ({
      ...card,
      card_number: card.card_number 
        ? `****-****-****-${card.card_number.slice(-4)}` 
        : '****-****-****-0000',
      cvv: undefined,
      pin_hash: undefined
    }));

    // 3. Fetch card applications
    const { data: applicationsData, error: appsError } = await supabase
      .from('card_applications')
      .select(`
        *,
        accounts:account_id (
          id,
          account_number,
          account_type
        )
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (appsError) throw appsError;

    // 4. Return combined result
    res.status(200).json({
      success: true,
      cards: safeCards,
      applications: applicationsData || []
    });

  } catch (error) {
    console.error('Error fetching user cards:', error);
    res.status(500).json({ error: `Failed to load cards: ${error.message}` });
  }
}
