// /api/signup.js
import { createClient } from "@supabase/supabase-js";

// Use Vercel environment variables
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY // service role key for secure server-side operations
);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { first_name, middle_name, last_name, email, password } = req.body;

  try {
    // 1️⃣ Create the user in Supabase Auth (will send confirmation email)
    const { data: user, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_redirect_to: `${process.env.NEXT_PUBLIC_SITE_URL}/login.html`,
      email_confirm: true
    });

    if (authError || !user) {
      return res.status(400).json({ error: authError?.message || "Failed to create user" });
    }

    // 2️⃣ Insert profile into `profiles` table
    const { error: profileError } = await supabase
      .from("profiles")
      .insert([{
        id: user.id,
        first_name,
        middle_name,
        last_name,
        email
      }]);

    if (profileError) {
      return res.status(400).json({ error: profileError.message });
    }

    // 3️⃣ Optionally create default account for user in `accounts` table
    const account_number = Math.floor(1000000000 + Math.random() * 9000000000).toString();
    const { error: accountError } = await supabase
      .from("accounts")
      .insert([{
        user_id: user.id,
        account_type: "Checking",
        account_number
      }]);

    if (accountError) {
      return res.status(400).json({ error: accountError.message });
    }

    return res.status(200).json({ success: true, user_id: user.id });

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
