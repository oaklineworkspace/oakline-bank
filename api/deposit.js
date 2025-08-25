import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: "2025-08-25" });

// Initialize Supabase
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, message: "Method not allowed" });
  }

  const { amount, paymentMethodId, userId, method } = req.body;

  try {
    let status = "pending";
    let transactionId = null;

    if (method === "stripe") {
      // Create a Stripe PaymentIntent
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // convert dollars to cents
        currency: "usd",
        payment_method: paymentMethodId,
        confirm: true,
      });
      status = paymentIntent.status === "succeeded" ? "completed" : "pending";
      transactionId = paymentIntent.id;
    } else if (method === "paypal") {
      // PayPal payments are confirmed on the front-end (onApprove)
      status = "completed";
      transactionId = "paypal_" + Date.now();
    } else if (["zelle", "chime", "one"].includes(method)) {
      // Manual methods, user sends money outside
      status = "pending"; 
      transactionId = method + "_" + Date.now();
    } else {
      return res.status(400).json({ success: false, message: "Invalid payment method" });
    }

    // Log deposit in Supabase
    const { error } = await supabase.from("deposits").insert([
      {
        user_id: userId,
        amount,
        method,
        status,
        transaction_id: transactionId,
      },
    ]);

    if (error) throw error;

    return res.status(200).json({ success: true, status, transactionId });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: err.message });
  }
}
