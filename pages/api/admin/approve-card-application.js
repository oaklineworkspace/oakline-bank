
import { supabase } from '../../../lib/supabaseClient';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { applicationId, action } = req.body;

  if (!applicationId || !action) {
    return res.status(400).json({ error: 'Application ID and action required' });
  }

  try {
    // Get the application details
    const { data: application, error: appError } = await supabase
      .from('card_applications')
      .select('*')
      .eq('id', applicationId)
      .single();

    if (appError || !application) {
      return res.status(404).json({ error: 'Application not found' });
    }

    if (action === 'approve') {
      // Update application status
      await supabase
        .from('card_applications')
        .update({ 
          status: 'approved',
          approved_at: new Date().toISOString(),
          approved_by: 'admin'
        })
        .eq('id', applicationId);

      // Create the debit card
      const cardNumber = generateCardNumber();
      const expiryDate = generateExpiryDate();
      const cvv = generateCVV();

      const { error: cardError } = await supabase
        .from('debit_cards')
        .insert([{
          user_id: application.user_id,
          account_id: application.account_id,
          card_number: cardNumber,
          cardholder_name: application.cardholder_name || 'Card Holder',
          expiry_date: expiryDate,
          cvv: cvv,
          card_type: application.card_type || 'Visa',
          status: 'active',
          created_at: new Date().toISOString()
        }]);

      if (cardError) {
        console.error('Error creating debit card:', cardError);
        return res.status(500).json({ error: 'Failed to create debit card' });
      }

    } else if (action === 'reject') {
      // Update application status
      await supabase
        .from('card_applications')
        .update({ 
          status: 'rejected',
          rejected_at: new Date().toISOString(),
          rejected_by: 'admin'
        })
        .eq('id', applicationId);
    }

    res.status(200).json({ 
      success: true, 
      message: `Application ${action}d successfully` 
    });

  } catch (error) {
    console.error('Error processing card application:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

function generateCardNumber() {
  const prefix = '4532';
  let cardNumber = prefix;
  for (let i = 0; i < 12; i++) {
    cardNumber += Math.floor(Math.random() * 10);
  }
  return cardNumber;
}

function generateExpiryDate() {
  const currentDate = new Date();
  const expiryYear = currentDate.getFullYear() + 3;
  const expiryMonth = String(Math.floor(Math.random() * 12) + 1).padStart(2, '0');
  return `${expiryMonth}/${expiryYear.toString().substr(-2)}`;
}

function generateCVV() {
  return Math.floor(Math.random() * 900) + 100;
}
