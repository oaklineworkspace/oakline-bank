
import { supabase } from '../../../lib/supabaseClient';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get all card applications
    const { data: applications, error } = await supabase
      .from('card_applications')
      .select(`
        *,
        users:user_id (
          id,
          name,
          email
        ),
        accounts:account_id (
          id,
          account_number,
          account_type,
          balance
        )
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching card applications:', error);
      return res.status(500).json({ error: 'Failed to fetch card applications' });
    }

    res.status(200).json({ 
      success: true, 
      applications: applications || [] 
    });
  } catch (error) {
    console.error('Error in get-card-applications:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
import { supabase } from '../../../lib/supabaseClient';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Fetch all card applications
    const { data: applications, error } = await supabase
      .from('card_applications')
      .select(`
        *,
        users (
          id,
          email,
          name
        ),
        accounts (
          id,
          account_number,
          account_type,
          balance
        )
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching card applications:', error);
      return res.status(500).json({ 
        success: false,
        message: 'Failed to fetch card applications',
        error: error.message 
      });
    }

    return res.status(200).json({
      success: true,
      applications: applications || []
    });
  } catch (error) {
    console.error('Server error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
}
