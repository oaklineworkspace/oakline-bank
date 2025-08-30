import { supabase } from '../../lib/supabaseClient';

// Send Notification
export const sendNotification = async (req, res) => {
  const { user_id, message, type } = req.body;

  const { error } = await supabase
    .from('notifications')
    .insert([{ user_id, message, type }]);

  if (error) return res.status(400).json({ error: error.message });

  res.status(200).json({ message: 'Notification sent successfully' });
};

// Send Message
export const sendMessage = async (req, res) => {
  const { user_id, recipient_id, message } = req.body;

  const { error } = await supabase
    .from('messages')
    .insert([{ user_id, recipient_id, message }]);

  if (error) return res.status(400).json({ error: error.message });

  res.status(200).json({ message: 'Message sent successfully' });
};
