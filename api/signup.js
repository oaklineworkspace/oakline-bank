// /api/signup.js
import { createClient } from "@supabase/supabase-js";

// Use Vercel environment variables
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY // server-side service role key
);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { first_name, middle_name, last_name, email, password } = req.body;

  if (!first_name || !last_name || !email || !password) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    // 1️⃣ Create user in Supabase Auth (will send confirmation email)
    const { data: user, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_redirect_to: `${process.env.NEXT_PUBLIC_SITE_URL}/login.html`,
      email_confirm: true
    });

    if (authError) {
      console.error("Auth creation error:", authError);
      return res.status(400).json({ error: authError.message });
    }

    if (!user || !user.id) {
      console.error("User ID not returned:", user);
      return res.status(400).json({ error: "User ID not returned from Supabase Auth" });
    }

    // 2️⃣ Insert profile
    const { error: profileError } = await supabase.from("profiles").insert([{
      id: user.id,
      first_name,
      middle_name: middle_name || null,
      last_name,
      email
    }]);

    if (profileError) {
      console.error("Profile insert error:", profileError);
      return res.status(400).json({ error: "Profile insert failed: " + profileError.message });
    }

    // 3️⃣ Create default account
    const account_number = Math.floor(1000000000 + Math.random() * 9000000000).toString();
    const { error: accountError } = await supabase.from("accounts").insert([{
      user_id: user.id,
      account_type: "Checking",
      account_number
    }]);

    if (accountError) {
      console.error("Account creation error:", accountError);
      return res.status(400).json({ error: "Account creation failed: " + accountError.message });
    }

    return res.status(200).json({ success: true, user_id: user.id });

  } catch (err) {
    console.error("Unexpected error:", err);
    return res.status(500).json({ error: "Unexpected server error: " + err.message });
  }
}
