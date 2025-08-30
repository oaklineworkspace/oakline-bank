// This will handle language settings for internationalization
export const setLanguage = async (req, res) => {
  const { user_id, language } = req.body;

  const { error } = await supabase
    .from('users')
    .update({ language })
    .eq('user_id', user_id);

  if (error) return res.status(400).json
