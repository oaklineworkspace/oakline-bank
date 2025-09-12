import { supabase } from '../../../lib/supabaseClient';

// Helper functions
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
      // Generate card details
      const cardNumber = generateCardNumber();
      const expiryDate = generateExpiryDate();
      const cvv = generateCVV();

      // Update application status
      const { error: updateError } = await supabase
        .from('card_applications')
        .update({ 
          status: 'approved',
          card_number: cardNumber,
          expiry_date: expiryDate,
          cvv: cvv,
          approved_at: new Date().toISOString()
        })
        .eq('id', applicationId);

      if (updateError) {
        console.error('Error updating application:', updateError);
        return res.status(500).json({ error: 'Failed to update application' });
      }

      // Create the card record
      const { data: cardData, error: cardError } = await supabase
        .from('cards')
        .insert([{
          user_id: application.user_id,
          account_id: application.account_id,
          application_id: applicationId,
          card_number: cardNumber,
          cardholder_name: application.cardholder_name || 'Card Holder',
          expiry_date: expiryDate,
          cvv: cvv,
          card_type: application.card_type || 'debit',
          status: 'active',
          daily_limit: 2000.00,
          monthly_limit: 10000.00,
          created_at: new Date().toISOString()
        }])
        .select()
        .single();

      if (cardError) {
        console.error('Error creating card:', cardError);
        return res.status(500).json({ error: 'Failed to create card' });
      }

    } else if (action === 'reject') {
      // Update application status
      const { error: rejectError } = await supabase
        .from('card_applications')
        .update({ 
          status: 'rejected',
          rejected_at: new Date().toISOString()
        })
        .eq('id', applicationId);

      if (rejectError) {
        console.error('Error rejecting application:', rejectError);
        return res.status(500).json({ error: 'Failed to reject application' });
      }
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