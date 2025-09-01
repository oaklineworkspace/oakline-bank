export default function Features({ start = 0, end = 3 }) {
  const featuresList = [
    {
      icon: "fas fa-university",
      title: "Checking Accounts",
      desc: "Flexible checking accounts with no hidden fees.",
    },
    {
      icon: "fas fa-piggy-bank",
      title: "Savings Accounts",
      desc: "High yield savings for all your financial goals.",
    },
    {
      icon: "fas fa-briefcase",
      title: "Business Accounts",
      desc: "Simplify business banking with Oakline solutions.",
    },
    {
      icon: "fas fa-credit-card",
      title: "Debit & Credit Cards",
      desc: "Secure cards with real-time controls and rewards.",
    },
    {
      icon: "fas fa-mobile-alt",
      title: "Mobile Banking",
      desc: "Bank on the go with our secure mobile app.",
    },
    {
      icon: "fas fa-lock",
      title: "Fraud Protection",
      desc: "Advanced security to protect your funds 24/7.",
    },
    {
      icon: "fas fa-globe",
      title: "International Transfers",
      desc: "Send money worldwide with ease and transparency.",
    },
    {
      icon: "fas fa-chart-line",
      title: "Investments",
      desc: "Grow your wealth with our investment accounts.",
    },
    {
      icon: "fas fa-coins",
      title: "Crypto Banking",
      desc: "Secure wallets and crypto trading solutions.",
    },
    {
      icon: "fas fa-receipt",
      title: "Budget & Analytics",
      desc: "Track your spending and manage your finances.",
    },
    {
      icon: "fas fa-gift",
      title: "Rewards & Cashback",
      desc: "Earn rewards on everyday spending.",
    },
    {
      icon: "fas fa-award",
      title: "Certificates of Deposit",
      desc: "High yield CDs to grow your savings securely.",
    },
    // Add more features as needed
  ];

  return (
    <section className="features-section">
      <div className="features-grid">
        {featuresList.slice(start, end).map((feature, idx) => (
          <div className="feature-card" key={idx}>
            <i className={feature.icon}></i>
            <h3>{feature.title}</h3>
            <p>{feature.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
