
import { supabaseAdmin } from '../../../lib/supabaseAdmin';

export default async function handler(req, res) {
  if (req.method !== 'DELETE') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { userId } = req.body;
    if (!userId) {
      return res.status(400).json({ error: 'userId is required' });
    }

    // --- Delete dependent records in proper order ---
    const deleteQueries = [
      { table: 'zelle_transactions', column: 'sender_id' },
      { table: 'zelle_settings', column: 'user_id' },
      { table: 'zelle_contacts', column: 'user_id' },
      { table: 'transactions', column: 'user_id' },
      { table: 'profiles', column: 'id' },
      { table: 'accounts', column: 'user_id' },
      { table: 'applications', column: 'user_id' },
      { table: 'cards', column: 'user_id' },
      { table: 'card_applications', column: 'user_id' },
      { table: 'beneficiaries', column: 'user_id' },
      { table: 'notifications', column: 'user_id' },
      { table: 'loans', column: 'user_id' },
    ];

    for (const { table, column } of deleteQueries) {
      const { error } = await supabaseAdmin
        .from(table)
        .delete()
        .eq(column, userId);
      if (error) console.warn(`⚠️ Failed to delete from ${table}:`, error.message);
    }

    // Delete related loan payments separately using subquery
    const { error: loanPaymentError } = await supabaseAdmin.rpc('delete_loan_payments_by_user', {
      uid: userId
    });

    if (loanPaymentError) {
      console.warn('⚠️ Could not delete loan payments via RPC:', loanPaymentError.message);
    }

    // Finally delete user from Supabase Auth
    const { error: authError } = await supabaseAdmin.auth.admin.deleteUser(userId);
    if (authError) {
      console.error('❌ Error deleting user from authentication:', authError.message);
      return res.status(500).json({ error: 'Failed to delete user from authentication' });
    }

    return res.status(200).json({
      message: '✅ User and all related data deleted successfully',
      userId,
    });

  } catch (error) {
    console.error('❌ Delete user error:', error);
    return res.status(500).json({ error: error.message });
  }
}
