
import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import Script from "next/script";

// Initialize Supabase
const supabase = createClient(
  "https://nrjdmgltshosdqccaymr.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5yamRtZ2x0c2hvc2RxY2NheW1yIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYwMzYyMjAsImV4cCI6MjA3MTYxMjIyMH0.b9H553W2PCsSNvr8HyyINl4nTSrldHN_QMQ3TVwt6qk"
);

export default function DepositPage() {
  const [userId, setUserId] = useState(null);
  const [amount, setAmount] = useState(10);
  const [paymentMethod, setPaymentMethod] = useState("stripe");

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getSession();
      if (data?.session?.user) {
        setUserId(data.session.user.id);
      }
    };
    getUser();
  }, []);

  // Handle Stripe Payment
  const handleStripeDeposit = async () => {
    if (!userId) return alert("Please log in first.");
    const stripe = window.Stripe("YOUR_STRIPE_PUBLISHABLE_KEY");
    const elements = stripe.elements();
    const card = elements.create("card");
    const { paymentMethod: pm, error } = await stripe.createPaymentMethod({
      type: "card",
      card,
    });
    if (error) return alert(error.message);

    const response = await fetch("/api/deposit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        amount,
        paymentMethodId: pm.id,
        userId,
        method: "stripe",
      }),
    });
    const result = await response.json();
    alert(result.success ? "Deposit successful!" : "Deposit failed");
  };

  // Handle PayPal or Manual Deposits
  const handleManualDeposit = async () => {
    if (!userId) return alert("Please log in first.");
    const response = await fetch("/api/deposit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        amount,
        userId,
        method: paymentMethod,
      }),
    });
    const result = await response.json();
    alert(result.success ? "Manual deposit logged!" : "Deposit failed");
  };

  const manualText = {
    zelle: "Send your deposit to: zelle@email.com",
    chime: "Send your deposit to your Chime account manually.",
    one: "Send your deposit to your One Finance account manually.",
  };

  return (
    <div style={{ fontFamily: "Arial", padding: 20 }}>
      <h2>Deposit Funds</h2>

      <label>Amount ($)</label>
      <input
        type="number"
        min="1"
        step="0.01"
        value={amount}
        onChange={(e) => setAmount(parseFloat(e.target.value))}
      />

      <label>Select Payment Method</label>
      <select
        value={paymentMethod}
        onChange={(e) => setPaymentMethod(e.target.value)}
      >
        <option value="stripe">Card / Bank</option>
        <option value="paypal">PayPal / Venmo</option>
        <option value="zelle">Zelle</option>
        <option value="chime">Chime</option>
        <option value="one">One Finance</option>
      </select>

      {/* Stripe Section */}
      {paymentMethod === "stripe" && (
        <div style={boxStyle}>
          <h3>Card / Bank Info</h3>
          <div id="card-element"></div>
          <button onClick={handleStripeDeposit}>Deposit with Card</button>
        </div>
      )}

      {/* PayPal Section */}
      {paymentMethod === "paypal" && (
        <div style={boxStyle}>
          <h3>Pay with PayPal / Venmo</h3>
          <div id="paypal-button-container"></div>
        </div>
      )}

      {/* Manual Section */}
      {["zelle", "chime", "one"].includes(paymentMethod) && (
        <div style={boxStyle}>
          <h3>Manual Transfer Instructions</h3>
          <p>{manualText[paymentMethod]}</p>
          <button onClick={handleManualDeposit}>Mark Deposit Complete</button>
        </div>
      )}

      {/* Stripe Script */}
      <Script src="https://js.stripe.com/v3/" strategy="lazyOnload" />

      {/* PayPal Script */}
      <Script
        src={`https://www.paypal.com/sdk/js?client-id=YOUR_PAYPAL_CLIENT_ID&components=buttons`}
        strategy="lazyOnload"
        onLoad={() => {
          if (window.paypal) {
            window.paypal
              .Buttons({
                createOrder: (data, actions) => {
                  return actions.order.create({
                    purchase_units: [{ amount: { value: amount.toFixed(2) } }],
                  });
                },
                onApprove: async (data, actions) => {
                  await actions.order.capture();
                  const response = await fetch("/api/deposit", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                      amount,
                      userId,
                      method: "paypal",
                    }),
                  });
                  const result = await response.json();
                  alert(
                    result.success
                      ? "Deposit successful via PayPal!"
                      : "Deposit failed"
                  );
                },
              })
              .render("#paypal-button-container");
          }
        }}
      />
    </div>
  );
}

const boxStyle = {
  border: "1px solid #ccc",
  padding: 15,
  marginBottom: 20,
  borderRadius: 5,
};
