// components/Features.js
import styles from "../styles/Features.module.css";

export default function Features({ start = 0, end = 6 }) {
  const featuresList = [
    "Fast Online Banking",
    "24/7 Customer Support",
    "Secure Transactions",
    "Mobile App",
    "Investment Insights",
    "Multiple Account Management",
    "Debit & Credit Cards",
    "POS Solutions",
    "Crypto Wallets",
    "Real-Time Notifications",
    "Fraud Protection",
    "Bill Payments",
    "Account Analytics",
    "Development Fund Access",
    "Loyalty Rewards",
    "Secure Transfers",
    "Automatic Savings",
    "Global Transfers",
    "Multi-Currency Support",
    "Custom Alerts",
    "Transaction History",
    "Expense Tracking",
    "Account Statements",
    "Loan Management",
    "Investment Tracking",
    "Budget Planner",
    "Merchant Tools",
    "Business Solutions"
  ];

  return (
    <section className={styles.features}>
      {featuresList.slice(start, end).map((feature, idx) => (
        <div key={idx} className={styles.card}>
          <p>{feature}</p>
        </div>
      ))}
    </section>
  );
}
