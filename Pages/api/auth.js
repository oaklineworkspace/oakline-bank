
import { supabase } from "../../utils/supabaseClient";

export default async function handler(req, res) {
  const { method } = req;

  switch (method) {
    case 'POST': // Handle Login or Signup
      const { email, password } = req.body;

      // Check if it's login or signup based on the request payload
      if (req.body.isSignup) {
        try {
          // If it's a signup, create a new user
          const { user, error } = await supabase.auth.signUp({ email, password });
          if (error) throw error;
          res.status(200).json({ user });
        } catch (error) {
          res.status(400).json({ error: error.message });
        }
      } else {
        // If it's login, use signIn
        try {
          const { user, error } = await supabase.auth.signIn({ email, password });
          if (error) throw error;
          res.status(200).json({ user });
        } catch (error) {
          res.status(400).json({ error: error.message });
        }
      }
      break;

    case 'PUT': // Handle Reset Password
      const { resetEmail } = req.body;
      try {
        const { data, error } = await supabase.auth.api.resetPasswordForEmail(resetEmail);
        if (error) throw error;
        res.status(200).json({ data });
      } catch (error) {
        res.status(400).json({ error: error.message });
      }
      break;

    default:
      res.status(405).end(); // Method Not Allowed
  }
}
