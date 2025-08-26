import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,  // your Supabase project URL
  process.env.SUPABASE_SERVICE_KEY       // your service role key (hidden in env)
);

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { email, action, amount } = req.body;

    if (!email || amount === undefined || !action) {
      return res.status(400).json({ message: "Missing data" });
    }

    try {
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
      }

      return res.status(200).json({ user: updatedUser });

    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Failed to update balance" });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
