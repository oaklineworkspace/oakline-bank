import { useState } from "react";

export default function Header({ theme, setTheme }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);

  return (
    <>
      <header>
        <div className="header-inner">
          <div className="logo-row">
            <img src="/images/logo-primary.png.jpg" alt="Oakline logo" />
            <div className="brand-title">Oakline Bank</div>
          </div>
          <div className="controls">
            <div style={{ position: "relative" }}>
              <button
                className="dropdown-btn"
                onClick={() => setMenuOpen(!menuOpen)}
              >
                <i className="fas fa-bars"></i>
              </button>
              {menuOpen && (
                <div className="dropdown-panel">
                  <h4 style={{ color: "#00264d" }}>Bank Features</h4>
                  <a href="index.html">Home</a>
                  <a href="checking.html">Checking Accounts</a>
                  <a href="savings.html">Savings Accounts</a>
                  <a href="business.html">Business Accounts</a>
                  <a href="loans.html">Personal & Business Loans</a>
                  <a href="cd.html">Certificates of Deposit (CDs)</a>
                  <a href="student.html">Student Accounts</a>
                  <a href="transfers.html">Instant Transfers</a>
                  <a href="billpay.html">Bill Pay</a>
                  <a href="international.html">International Transfers</a>
                  <a href="mobile.html">Mobile Wallets</a>
                  <a href="pos-solutions.html">POS & Merchant Solutions</a>
                  <a href="cards.html">Debit & Credit Cards</a>
                  <a href="virtual-cards.html">Virtual Cards</a>
                  <a href="security.html">Account Controls & Fraud Protection</a>
                  <a href="identity.html">Identity & Insurance Services</a>
                  <a href="invest.html">Investment Accounts</a>
                  <a href="crypto.html">Crypto Banking</a>
                  <a href="rewards.html">Rewards & Cashback</a>
                  <a href="budget.html">Budgeting & Analytics Tools</a>
                </div>
              )}
            </div>

            <button
              id="themeToggle"
              title="Toggle light / dark"
              onClick={() =>
                setTheme(theme === "dark" ? "light" : "dark")
              }
            >
              <i className={`fas ${theme === "dark" ? "fa-sun" : "fa-moon"}`}></i>
            </button>

            <div style={{ position: "relative" }}>
              <button
                className="dropdown-btn"
                onClick={() => setAccountOpen(!accountOpen)}
              >
                <i className="fas fa-user-circle"></i>
              </button>
              {accountOpen && (
                <div className="dropdown-panel">
                  <a href="login.html">
                    <i className="fas fa-right-to-bracket"></i> Log In
                  </a>
                  <a href="signup.html">
                    <i className="fas fa-user-plus"></i> Create Account
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="marquee">
          <span>
            🔐 Welcome to Oakline Bank — secure personal & business banking,
            competitive rates, and 24/7 support.
          </span>
        </div>
      </header>
    </>
  );
}
