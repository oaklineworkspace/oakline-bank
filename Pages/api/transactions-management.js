import { supabase } from '../../lib/supabaseClient';

// Deposit
export const deposit = async (req, res) => {
  const { user_id, amount } = req.body;

  // Update balance in user account
  const { error } = await supabase
    .from('accounts')
    .update({ balance: supabase.raw('balance + ?', [amount]) })
    .eq('user_id', user_id);

  if (error) return res.status(400).json({ error: error.message });

  // Log the deposit transaction
  await supabase.from('transactions').insert([{ user_id, type: 'deposit', amount }]);

  res.status(200).json({ message: 'Deposit successful' });
};

// Withdrawal
export const withdraw = async (req, res) => {
  const { user_id, amount } = req.body;

  // Check if the balance is sufficient
  const { data: account } = await supabase
    .from('accounts')
    .select('balance')
    .eq('user_id', user_id)
    .single();

  if (account.balance < amount) return res.status(400).json({ error: 'Insufficient funds' });

  // Update balance
  const { error } = await supabase
    .from('accounts')
    .update({ balance: account.balance - amount })
    .eq('user_id', user_id);

  if (error) return res.status(400).json({ error: error.message });

  // Log the withdrawal transaction
  await supabase.from('transactions').insert([{ user_id, type: 'withdrawal', amount }]);

  res.status(200).json({ message: 'Withdrawal successful' });
};

// Transfer
export const transfer = async (req, res) => {
  const { user_id, to_user_id, amount } = req.body;

  // Check if balance is sufficient
  const { data: account } = await supabase
    .from('accounts')
    .select('balance')
    .eq('user_id', user_id)
    .single();

  if (account.balance < amount) return res.status(400).json({ error: 'Insufficient funds' });

  // Transfer to another user
  const { error } = await supabase
    .from('accounts')
    .update({ balance: account.balance - amount })
    .eq('user_id', user_id);

  if (error) return res.status(400).json({ error: error.message });

  // Add to recipient's account
  await supabase
    .from('accounts')
    .update({ balance: supabase.raw('balance + ?', [amount]) })
    .eq('user_id', to_user_id);

  // Log the transaction
  await supabase.from('transactions').insert([
    { user_id, type: 'transfer', amount, to_user_id },
    { user_id: to_user_id, type: 'received', amount }
  ]);

  res.status(200).json({ message: 'Transfer successful' });
};

// Get Transactions
export const getTransactions = async (req, res) => {
  const { user_id } = req.query;

  const { data, error } = await supabase
    .from('transactions')
    .select('*')
    .eq('user_id', user_id);

  if (error) return res.status(400).json({ error: error.message });

  res.status(200).json(data);
};
