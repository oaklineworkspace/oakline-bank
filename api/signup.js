// /api/signup.js
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY // use service role key here
);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { email, password } = req.body;

  try {
    // Create user with confirmation email
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: false
    });

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    if (!data?.user?.id) {
      return res.status(500).json({ error: "User ID not returned from Supabase" });
    }

    return res.status(200).json({
      success: true,
      message: "Signup successful! Please check your email to confirm your account."
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
