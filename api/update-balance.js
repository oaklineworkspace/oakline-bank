// /api/update-balance.js
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

export default async function handler(req, res) {
  try {
    if (req.method === "POST") {
      const { email, action, amount } = req.body;

      if (!email || !action || amount === undefined) {
        return res.status(400).json({ message: "Missing data" });
      }

      let updatedUser;

      if (action === "set") {
        const { data, error } = await supabase
          .from("applications")
          .update({ balance: amount })
          .eq("email", email)
          .single();
        if (error) throw error;
        updatedUser = data;

      } else if (action === "adjust") {
        const { data: user, error: fetchError } = await supabase
          .from("applications")
          .select("balance")
          .eq("email", email)
          .single();
        if (fetchError) throw fetchError;

        const newBalance = (user.balance || 0) + amount;

        const { data, error: updateError } = await supabase
          .from("applications")
          .update({ balance: newBalance })
          .eq("email", email)
          .single();
        if (updateError) throw updateError;

        updatedUser = data;

      } else {
        return res.status(400).json({ message: "Invalid action" });
      }

      return res.status(200).json({ user: updatedUser });

    } else if (req.method === "GET") {
      const { email } = req.query;
      if (!email) return res.status(400).json({ message: "Email required" });

      const { data, error } = await supabase
        .from("applications")
        .select("balance")
        .eq("email", email)
        .single();

      if (error || !data) return res.status(404).json({ message: "User not found" });

      return res.status(200).json({ balance: data.balance || 0 });
    } else {
      res.status(405).json({ message: "Method not allowed" });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
}
