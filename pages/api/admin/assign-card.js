
import { supabase } from '../../../lib/supabaseAdmin';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { userId, accountId, cardType, cardholderName } = req.body;

    if (!userId || !accountId || !cardholderName) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Generate card details
    const generateCardNumber = () => {
      const prefix = '4532';
      let cardNumber = prefix;
      for (let i = 0; i < 12; i++) {
        cardNumber += Math.floor(Math.random() * 10);
      }
      return cardNumber.match(/.{1,4}/g).join(' ');
    };

    const generateExpiryDate = () => {
      const now = new Date();
      const expiryYear = now.getFullYear() + 3;
      const expiryMonth = String(now.getMonth() + 1).padStart(2, '0');
      return `${expiryMonth}/${expiryYear.toString().slice(-2)}`;
    };

    const generateCVV = () => {
      return Math.floor(100 + Math.random() * 900).toString();
    };

    // Get account details
    const { data: accountData, error: accountError } = await supabase
      .from('accounts')
      .select('account_number')
      .eq('id', accountId)
      .single();

    if (accountError || !accountData) {
      return res.status(404).json({ error: 'Account not found' });
    }

    const cardNumber = generateCardNumber();
    const expiryDate = generateExpiryDate();
    const cvv = generateCVV();

    // Insert card
    const { data: cardData, error: cardError } = await supabase
      .from('cards')
      .insert({
        user_id: userId,
        account_id: accountId,
        account_number: accountData.account_number,
        card_number: cardNumber,
        cardholder_name: cardholderName.toUpperCase(),
        expiry_date: expiryDate,
        cvv: cvv,
        card_type: cardType || 'debit',
        status: 'active',
        daily_limit: 2000.00,
        monthly_limit: 10000.00,
        created_at: new Date().toISOString()
      })
      .select()
      .single();

    if (cardError) {
      throw cardError;
    }

    res.status(200).json({
      success: true,
      card: cardData,
      cardDetails: {
        cardNumber,
        expiryDate,
        cvv
      }
    });

  } catch (error) {
    console.error('Card assignment error:', error);
    res.status(500).json({ error: error.message || 'Failed to assign card' });
  }
}
