import { createClient } from "@supabase/supabase-js";

// Server-side: use service role key, never expose to frontend
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { first_name, middle_name, last_name, email, password } = req.body;

  if (!email || !password || !first_name || !last_name) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    // 1️⃣ Create user in Supabase Auth using service role key
    const { data: user, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: false
    });

    if (authError) {
      console.error("Auth creation error:", authError);
      return res.status(400).json({ error: authError.message });
    }

    if (!user || !user.id) {
      return res.status(500).json({ error: "User ID not returned from Supabase Auth" });
    }

    // 2️⃣ Insert profile into 'profiles' table
    const { error: profileError } = await supabase
      .from("profiles")
      .insert([
        {
          id: user.id,          // Must use the Auth user ID
          first_name,
          middle_name,
          last_name,
          email
        }
      ]);

    if (profileError) {
      console.error("Profile insert error:", profileError);
      return res.status(400).json({ error: profileError.message });
    }

    return res.status(200).json({ success: true, user_id: user.id });
  } catch (err) {
    console.error("Unexpected server error:", err);
    return res.status(500).json({ error: err.message });
  }
}
