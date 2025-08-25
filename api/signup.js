// File: /api/signup.js
import { createClient } from "@supabase/supabase-js";

// Use your Vercel environment variables
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL; // public project URL
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY; // secret

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { first_name, middle_name, last_name, email, password } = req.body;

  try {
    // Create user in Supabase Auth
    const { data: user, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: false
    });

    if (authError) return res.status(400).json({ error: authError.message });

    // Insert into profiles table
    const { error: profileError } = await supabase
      .from("profiles")
      .insert([{ id: user.id, first_name, middle_name, last_name, email }]);

    if (profileError) return res.status(400).json({ error: profileError.message });

    return res.status(200).json({ success: true, user_id: user.id });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
