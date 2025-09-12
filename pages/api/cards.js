
import { supabase } from '../../lib/supabaseClient';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const { user_id } = req.query;
      
      if (!user_id) {
        return res.status(400).json({ error: 'User ID is required' });
      }

      const { data: cards, error } = await supabase
        .from('cards')
        .select('*')
        .eq('user_id', user_id)
        .eq('status', 'active');

      if (error) {
        console.error('Error fetching cards:', error);
        return res.status(500).json({ error: 'Failed to fetch cards' });
      }

      return res.status(200).json({ cards });

    } catch (error) {
      console.error('API error:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  if (req.method === 'POST') {
    try {
      const { user_id, account_id, cardholder_name } = req.body;

      if (!user_id || !account_id || !cardholder_name) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      // Generate card details
      const cardNumber = generateCardNumber();
      const expiryDate = generateExpiryDate();
      const cvv = generateCVV();

      // Create card application first
      const { data: application, error: appError } = await supabase
        .from('card_applications')
        .insert([{
          user_id,
          account_id,
          cardholder_name,
          status: 'approved',
          card_number: cardNumber,
          expiry_date: expiryDate,
          cvv: cvv,
          approved_at: new Date().toISOString()
        }])
        .select()
        .single();

      if (appError) {
        console.error('Error creating card application:', appError);
        return res.status(500).json({ error: 'Failed to create card application' });
      }

      // Create the actual card
      const { data: card, error: cardError } = await supabase
        .from('cards')
        .insert([{
          user_id,
          account_id,
          application_id: application.id,
          card_number: cardNumber,
          cardholder_name,
          expiry_date: expiryDate,
          cvv: cvv,
          status: 'active'
        }])
        .select()
        .single();

      if (cardError) {
        console.error('Error creating card:', cardError);
        return res.status(500).json({ error: 'Failed to create card' });
      }

      return res.status(201).json({ card, application });

    } catch (error) {
      console.error('API error:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}

function generateCardNumber() {
  const prefix = '4000';
  const randomDigits = Array.from({length: 12}, () => Math.floor(Math.random() * 10)).join('');
  return `${prefix} ${randomDigits.substring(0,4)} ${randomDigits.substring(4,8)} ${randomDigits.substring(8,12)}`;
}

function generateExpiryDate() {
  const now = new Date();
  const expiry = new Date(now.getFullYear() + 2, now.getMonth());
  return `${String(expiry.getMonth() + 1).padStart(2, '0')}/${String(expiry.getFullYear()).substring(2)}`;
}

function generateCVV() {
  return String(Math.floor(Math.random() * 900) + 100);
}
