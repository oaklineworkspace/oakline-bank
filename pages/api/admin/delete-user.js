
import { supabaseAdmin } from '../../../lib/supabaseAdmin';

export default async function handler(req, res) {
  if (req.method !== 'DELETE') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { userId, email } = req.body;
    
    let userIdToDelete = userId;
    
    // If email provided, find the user ID
    if (!userId && email) {
      const { data: existingUsers, error: listError } = await supabaseAdmin.auth.admin.listUsers();
      if (listError) {
        console.error('Error listing users:', listError);
        return res.status(500).json({ error: 'Failed to find user by email' });
      }
      
      const user = existingUsers?.users?.find(u => u.email === email);
      if (!user) {
        return res.status(404).json({ error: 'User not found with provided email' });
      }
      
      userIdToDelete = user.id;
      console.log(`Found user ID ${userIdToDelete} for email ${email}`);
    }
    
    if (!userIdToDelete) {
      return res.status(400).json({ error: 'userId or email is required' });
    }

    console.log(`Starting deletion process for user: ${userIdToDelete}`);

    // Delete enrollments by email if provided, otherwise try by user_id
    if (email) {
      const { error: enrollError } = await supabaseAdmin
        .from('enrollments')
        .delete()
        .eq('email', email);
      if (enrollError) console.warn(`⚠️ Failed to delete enrollments:`, enrollError.message);
    }

    // --- Delete dependent records in proper order ---
    const deleteQueries = [
      { table: 'zelle_transactions', column: 'sender_id' },
      { table: 'zelle_transactions', column: 'recipient_user_id' },
      { table: 'zelle_settings', column: 'user_id' },
      { table: 'zelle_contacts', column: 'user_id' },
      { table: 'card_transactions', column: 'card_id', needsSubquery: true },
      { table: 'transactions', column: 'user_id' },
      { table: 'cards', column: 'user_id' },
      { table: 'card_applications', column: 'user_id' },
      { table: 'beneficiaries', column: 'user_id' },
      { table: 'notifications', column: 'user_id' },
      { table: 'loans', column: 'user_id' },
      { table: 'accounts', column: 'user_id' },
      { table: 'applications', column: 'user_id' },
      { table: 'profiles', column: 'id' },
    ];

    for (const { table, column, needsSubquery } of deleteQueries) {
      if (needsSubquery && table === 'card_transactions') {
        // Delete card transactions for cards owned by this user
        const { data: userCards } = await supabaseAdmin
          .from('cards')
          .select('id')
          .eq('user_id', userIdToDelete);
        
        if (userCards && userCards.length > 0) {
          const cardIds = userCards.map(c => c.id);
          const { error } = await supabaseAdmin
            .from('card_transactions')
            .delete()
            .in('card_id', cardIds);
          if (error) console.warn(`⚠️ Failed to delete from ${table}:`, error.message);
        }
      } else {
        const { error } = await supabaseAdmin
          .from(table)
          .delete()
          .eq(column, userIdToDelete);
        if (error) console.warn(`⚠️ Failed to delete from ${table}:`, error.message);
      }
    }

    // Delete related loan payments separately using subquery (if RPC exists)
    try {
      const { error: loanPaymentError } = await supabaseAdmin.rpc('delete_loan_payments_by_user', {
        uid: userIdToDelete
      });

      if (loanPaymentError) {
        console.warn('⚠️ Could not delete loan payments via RPC:', loanPaymentError.message);
      }
    } catch (rpcError) {
      console.warn('⚠️ RPC not available, skipping loan payments deletion:', rpcError.message);
    }

    // Finally delete user from Supabase Auth
    const { error: authError } = await supabaseAdmin.auth.admin.deleteUser(userIdToDelete);
    if (authError) {
      console.error('❌ Error deleting user from authentication:', authError.message);
      return res.status(500).json({ 
        error: 'Failed to delete user from authentication',
        details: authError.message 
      });
    }

    console.log(`✅ Successfully deleted user: ${userIdToDelete}`);

    return res.status(200).json({
      message: '✅ User and all related data deleted successfully',
      userId: userIdToDelete,
      email: email || 'N/A'
    });

  } catch (error) {
    console.error('❌ Delete user error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      details: error.message 
    });
  }
}
