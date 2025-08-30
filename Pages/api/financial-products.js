import { supabase } from '../../lib/supabaseClient';

// Investment Creation
export const createInvestment = async (req, res) => {
  const { user_id, amount, investment_type } = req.body;

  // Add investment details to the database
  const { error } = await supabase
    .from('investments')
    .insert([{ user_id, amount, investment_type }]);

  if (error) return res.status(400).json({ error: error.message });

  res.status(200).json({ message: 'Investment created successfully' });
};

// Loan Application
export const applyForLoan = async (req, res) => {
  const { user_id, amount, loan_type } = req.body;

  // Insert loan application details
  const { error } = await supabase
    .from('loans')
    .insert([{ user_id, amount, loan_type }]);

  if (error) return res.status(400).json({ error: error.message });

  res.status(200).json({ message: 'Loan application submitted successfully' });
};

// Crypto Purchase
export const purchaseCrypto = async (req, res) => {
  const { user_id, amount, crypto_type } = req.body;

  // Insert crypto transaction details
  const { error } = await supabase
    .from('crypto')
    .insert([{ user_id, amount, crypto_type }]);

  if (error) return res.status(400).json({ error: error.message });

  res.status(200).json({ message: 'Crypto purchased successfully' });
};
