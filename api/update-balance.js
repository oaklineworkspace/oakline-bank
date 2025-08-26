// update-balance.js (API)
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { email, action, amount } = req.body;

    try {
      // Load existing user
      const { data: user, error: selectError } = await supabase
        .from("applications")
        .select("*")
        .eq("email", email)
        .single();

      if (selectError || !user) {
        return res.status(404).json({ message: "User not found" });
      }

      let newBalance = user.balance;

      if (action === "set") {
        newBalance = amount;
      } else if (action === "adjust") {
        newBalance += amount;
      }

      const { data: updatedUser, error: updateError } = await supabase
        .from("applications")
        .update({ balance: newBalance, updated_at: new Date() })
        .eq("email", email)
        .select()
        .single(); // <- important: select single returns the updated row

      if (updateError) {
        return res.status(500).json({ message: "Failed to update balance" });
      }

      // ✅ Always return { user } so front-end sees success
      res.status(200).json({ user: updatedUser });

    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Internal server error" });
    }
  } else if (req.method === "GET") {
    // Load balance
    const email = req.query.email;
    if (!email) return res.status(400).json({ message: "Email is required" });

    const { data: user, error } = await supabase
      .from("applications")
      .select("balance")
      .eq("email", email)
      .single();

    if (error || !user) return res.status(404).json({ message: "User not found" });

    res.status(200).json({ balance: user.balance });
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
