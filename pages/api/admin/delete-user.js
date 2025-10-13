
import { supabaseAdmin } from '../../../lib/supabaseClient';

export default async function handler(req, res) {
  if (req.method !== 'DELETE') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { userId, email } = req.body;

  if (!userId && !email) {
    return res.status(400).json({ error: 'Either userId or email is required' });
  }

  try {
    let resolvedUserId = userId;

    // 🕵️ If only email is provided, get user by email
    if (!resolvedUserId && email) {
      const { data: users, error: listError } = await supabaseAdmin.auth.admin.listUsers();
      if (listError) {
        console.error('Error listing users:', listError);
        return res.status(500).json({ error: 'Failed to retrieve users' });
      }

      const userMatch = users.users.find(
        (u) => u.email && u.email.toLowerCase() === email.toLowerCase()
      );

      if (!userMatch) {
        return res.status(404).json({ error: 'User not found with that email' });
      }

      resolvedUserId = userMatch.id;
    }

    // 🧹 Step 1: Delete dependent records from related tables
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
      const { error } = await supabaseAdmin.from(table).delete().eq(column, resolvedUserId);
      if (error) console.warn(`Warning deleting from ${table}:`, error.message);
    }

    // 🧾 Delete loan payments linked to user’s loans
    const { data: loans } = await supabaseAdmin
      .from('loans')
      .select('id')
      .eq('user_id', resolvedUserId);

    if (loans && loans.length > 0) {
      const loanIds = loans.map((l) => l.id);
      const { error: loanPaymentsError } = await supabaseAdmin
        .from('loan_payments')
        .delete()
        .in('loan_id', loanIds);
      if (loanPaymentsError)
        console.warn('Warning deleting loan payments:', loanPaymentsError.message);
    }

    // 🧾 Delete enrollments linked to applications
    const { data: apps } = await supabaseAdmin
      .from('applications')
      .select('id')
      .eq('user_id', resolvedUserId);

    if (apps && apps.length > 0) {
      const appIds = apps.map((a) => a.id);
      const { error: enrollmentsError } = await supabaseAdmin
        .from('enrollments')
        .delete()
        .in('application_id', appIds);
      if (enrollmentsError)
        console.warn('Warning deleting enrollments:', enrollmentsError.message);
    }

    // 🧹 Step 2: Delete from Supabase Auth
    const { error: deleteUserError } = await supabaseAdmin.auth.admin.deleteUser(resolvedUserId);
    if (deleteUserError) {
      console.error('Error deleting user from authentication:', deleteUserError.message);
      return res.status(500).json({ error: 'Failed to delete user from authentication' });
    }

    // ✅ Step 3: Return success
    return res.status(200).json({
      message: 'User and all related records deleted successfully',
      userId: resolvedUserId,
    });
  } catch (error) {
    console.error('Error deleting user:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
