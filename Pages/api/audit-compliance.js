import { supabase } from '../../lib/supabaseClient';

// Audit Log
export const logAudit = async (req, res) => {
  const { action, user_id, details } = req.body;

  const { error } = await supabase
    .from('audit_logs')
    .insert([{ action, user_id, details }]);

  if (error) return res.status(400).json({ error: error.message });

  res.status(200).json({ message: 'Audit log created successfully' });
};

// Monitoring Compliance
export const checkCompliance = async (req, res) => {
  const { user_id } = req.query;

  // Check if user passed KYC/AML checks
  const { data, error } = await supabase
    .from('compliance')
    .select('*')
    .eq('user_id', user_id)
    .single();

  if (error) return res.status(400).json({ error: error.message });

  res.status(200).json({ complianceStatus: data.status });
};
