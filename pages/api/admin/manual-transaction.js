
import { supabase } from '../../../lib/supabaseClient';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { accountId, userId, type, amount, description } = req.body;

    // Validate required fields
    if (!accountId || !userId || !type || !amount) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    if (amount <= 0) {
      return res.status(400).json({ error: 'Amount must be greater than 0' });
    }

    // Get current account data
    const { data: account, error: accountError } = await supabase
      .from('accounts')
      .select('*')
      .eq('id', accountId)
      .eq('user_id', userId)
      .single();

    if (accountError || !account) {
      return res.status(404).json({ error: 'Account not found' });
    }

    const currentBalance = parseFloat(account.balance);
    let newBalance;
    let transactionAmount;

    // Determine transaction amount and new balance based on type
    switch (type) {
      case 'deposit':
      case 'interest':
      case 'bonus':
      case 'refund':
        transactionAmount = amount;
        newBalance = currentBalance + amount;
        break;
      case 'withdrawal':
      case 'fee':
        transactionAmount = -amount;
        newBalance = currentBalance - amount;
        break;
      case 'adjustment':
        // For adjustments, determine if adding or subtracting based on amount sign
        transactionAmount = amount;
        newBalance = currentBalance + amount;
        break;
      default:
        return res.status(400).json({ error: 'Invalid transaction type' });
    }

    // Check for negative balance (optional - you might want to allow overdrafts)
    if (newBalance < 0 && !['adjustment'].includes(type)) {
      return res.status(400).json({ 
        error: `Transaction would result in negative balance: $${newBalance.toFixed(2)}` 
      });
    }

    // Update account balance
    const { error: updateError } = await supabase
      .from('accounts')
      .update({ 
        balance: newBalance.toFixed(2),
        updated_at: new Date().toISOString()
      })
      .eq('id', accountId);

    if (updateError) {
      throw updateError;
    }

    // Create transaction record
    const { data: transaction, error: transactionError } = await supabase
      .from('transactions')
      .insert([{
        account_id: accountId,
        user_id: userId,
        type: type,
        amount: transactionAmount,
        status: 'completed',
        description: description || `Manual ${type}`,
        reference: `MANUAL_${Date.now()}`,
        created_at: new Date().toISOString()
      }])
      .select()
      .single();

    if (transactionError) {
      // Try to revert balance update if transaction creation fails
      await supabase
        .from('accounts')
        .update({ 
          balance: currentBalance.toFixed(2),
          updated_at: new Date().toISOString()
        })
        .eq('id', accountId);
      
      throw transactionError;
    }

    res.status(200).json({
      success: true,
      message: 'Transaction added successfully',
      transaction: transaction,
      newBalance: newBalance.toFixed(2),
      previousBalance: currentBalance.toFixed(2)
    });

  } catch (error) {
    console.error('Manual transaction error:', error);
    res.status(500).json({
      error: 'Internal server error during transaction processing',
      details: error.message
    });
  }
}
