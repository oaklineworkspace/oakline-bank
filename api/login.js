// /api/login.js
import { createClient } from "@supabase/supabase-js";

// Use anon key for client-side authentication
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { email, password } = req.body;

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) return res.status(400).json({ error: error.message });

    return res.status(200).json({ success: true, user: data.user });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
