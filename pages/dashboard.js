import { useState } from "react";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import AccountCard from "../components/AccountCard";
import TransactionItem from "../components/TransactionItem";
import NotificationItem from "../components/NotificationItem";
import MessageItem from "../components/MessageItem";
import FormInput from "../components/FormInput";
import Modal from "../components/Modal";
import Footer from "../components/Footer";

export default function Dashboard() {
  const [isModalOpen, setModalOpen] = useState(false);

  // Ensure these arrays are always defined
  const notifications = [
    { message: "Your deposit was successful.", type: "success" },
    { message: "Your password will expire soon.", type: "warning" },
  ] || [];

  const transactions = [
    { date: "2025-09-01", description: "Coffee Shop", amount: "-$5.00", type: "expense" },
    { date: "2025-08-30", description: "Salary", amount: "+$3,500.00", type: "income" },
  ] || [];

  const messages = [
    { sender: "Oakline Bank", text: "Welcome to your dashboard!", timestamp: "09:00 AM" },
    { sender: "Support", text: "Your account upgrade is approved.", timestamp: "Yesterday" },
  ] || [];

  const navbarLinks = [
    { name: "Home", href: "/" },
    { name: "Accounts", href: "/dashboard" },
    { name: "Transactions", href: "/transactions" },
    { name: "Settings", href: "/account-details" },
  ];

  return (
    <div className="app-container">
      <Navbar links={navbarLinks} />

      <Hero
        title="Welcome Back!"
        subtitle="Manage your finances with ease."
        ctaText="View Accounts"
        ctaLink="#accounts"
      />

      <section id="notifications">
        {notifications.map((n, idx) => (
          <NotificationItem key={idx} message={n.message} type={n.type} />
        ))}
      </section>

      <section id="accounts">
        <h2>Your Accounts</h2>
        <div className="grid">
          <AccountCard accountName="Checking Account" balance="$2,345.67" />
          <AccountCard accountName="Savings Account" balance="$12,500.00" />
        </div>
      </section>

      <section id="transactions">
        <h2>Recent Transactions</h2>
        <div className="grid">
          {transactions.map((t, idx) => (
            <TransactionItem
              key={idx}
              date={t.date}
              description={t.description}
              amount={t.amount}
              type={t.type}
            />
          ))}
        </div>
      </section>

      <section id="messages">
        <h2>Messages</h2>
        <div className="grid">
          {messages.map((m, idx) => (
            <MessageItem
              key={idx}
              sender={m.sender}
              text={m.text}
              timestamp={m.timestamp}
            />
          ))}
        </div>
      </section>

      <section id="support">
        <h2>Contact Support</h2>
        <FormInput label="Message" placeholder="Type your message..." />
        <button onClick={() => setModalOpen(true)}>Send Message</button>
      </section>

      <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)}>
        <h3>Message Sent!</h3>
        <p>Our support team will get back to you shortly.</p>
      </Modal>

      <Footer />
    </div>
  );
}
