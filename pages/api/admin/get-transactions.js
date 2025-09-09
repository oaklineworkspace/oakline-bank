
import { supabaseAdmin } from '../../../lib/supabaseClient';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Fetch all transactions
    const { data: transactions, error } = await supabaseAdmin
      .from('transactions')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(100); // Limit to last 100 transactions

    if (error) {
      console.error('Error fetching transactions:', error);
      return res.status(500).json({ 
        message: 'Failed to fetch transactions',
        error: error.message 
      });
    }

    return res.status(200).json({
      success: true,
      transactions: transactions || []
    });
  } catch (error) {
    console.error('Server error:', error);
    return res.status(500).json({
      message: 'Internal server error',
      error: error.message
    });
  }
}
