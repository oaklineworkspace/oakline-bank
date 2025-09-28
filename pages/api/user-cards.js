import { supabase } from '../../lib/supabaseClient';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get the authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Missing or invalid authorization header' });
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return res.status(401).json({ error: 'Invalid or expired token' });
    }

    console.log('Fetching cards for user:', user.id, 'Email:', user.email);

    // Find the user in the applications table (where real users are stored)
    const { data: userProfile, error: profileError } = await supabase
      .from('applications')
      .select('*')
      .eq('email', user.email)
      .single();

    if (profileError && profileError.code !== 'PGRST116') {
      console.error('Error fetching user profile:', profileError);
    }

    console.log('Found user profile:', userProfile ? 'Yes' : 'No');

    // Get user's accounts using user_id and application_id
    let userAccounts = [];
    let accountsError = null;

    // First try to get accounts by user_id
    const { data: directAccounts, error: directError } = await supabase
      .from('accounts')
      .select('*')
      .eq('user_id', user.id)
      .eq('status', 'active');

    if (!directError && directAccounts && directAccounts.length > 0) {
      userAccounts = directAccounts;
    } else if (userProfile?.id) {
      // If no direct accounts, try using application_id from user profile
      const { data: appAccounts, error: appError } = await supabase
        .from('accounts')
        .select('*')
        .eq('application_id', userProfile.id)
        .eq('status', 'active');
      
      if (!appError && appAccounts) {
        userAccounts = appAccounts;
      }
      accountsError = appError;
    } else {
      accountsError = directError;
    }

    if (accountsError) {
      console.error('Error fetching accounts:', accountsError);
      throw new Error(`Failed to fetch accounts: ${accountsError.message}`);
    }

    console.log('Found accounts:', userAccounts?.length || 0);

    // Get cards for this user
    let cardsData = [];
    if (userAccounts && userAccounts.length > 0) {
      const accountIds = userAccounts.map(acc => acc.id);
      
      const { data: userCards, error: cardsError } = await supabase
        .from('cards')
        .select(`
          *,
          accounts!inner (
            id,
            account_number,
            account_type,
            balance,
            user_id
          )
        `)
        .or(`user_id.eq.${user.id},account_id.in.(${accountIds.join(',')})`)
        .eq('status', 'active');

      if (cardsError) {
        console.error('Error fetching cards:', cardsError);
      } else {
        cardsData = userCards || [];
      }
    }

    // Also try direct user_id match for cards
    if (cardsData.length === 0) {
      const { data: directCards, error: directError } = await supabase
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
        .eq('user_id', user.id);

      if (!directError && directCards) {
        cardsData = directCards;
      }
    }

    console.log('Found cards:', cardsData.length);

    // Mask sensitive card data for display
    const safeCards = cardsData.map(card => ({
      ...card,
      card_number: card.card_number ? `****-****-****-${card.card_number.slice(-4)}` : '****-****-****-0000',
      cvv: undefined,
      pin_hash: undefined
    }));

    // Get card applications
    let applicationsData = [];
    if (userAccounts && userAccounts.length > 0) {
      const accountIds = userAccounts.map(acc => acc.id);
      
      const { data: userApplications, error: appsError } = await supabase
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
        .or(`user_id.eq.${user.id},account_id.in.(${accountIds.join(',')})`)
        .order('created_at', { ascending: false });

      if (!appsError && userApplications) {
        applicationsData = userApplications;
      }
    }

    // Also try direct user_id match for applications
    if (applicationsData.length === 0) {
      const { data: directApps, error: directAppError } = await supabase
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
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (!directAppError && directApps) {
        applicationsData = directApps;
      }
    }

    console.log('Found applications:', applicationsData.length);

    res.status(200).json({
      success: true,
      cards: safeCards,
      applications: applicationsData,
      userProfile
    });

  } catch (error) {
    console.error('Error fetching user cards:', error);
    res.status(500).json({ error: `Failed to load cards: ${error.message}` });
  }
}
