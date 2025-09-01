import Image from 'next/image';
import Link from 'next/link';
import styles from '../styles/Home.module.css'; // optional CSS module

export default function Home() {
  return (
    <main>
      {/* HERO SECTION: DEBIT CARD */}
      <section className={styles.productHero}>
        <div className={styles.heroContent}>
          <h1>Oakline Debit Card</h1>
          <p>
            Secure worldwide, with contactless payments, instant lock & unlock, and real-time spend tracking.
          </p>
          <Link href="/debit-card">
            <a className="btn-green">Get Your Debit Card</a>
          </Link>
        </div>
        <div className={styles.heroImage}>
          <Image
            src="/hero-debit-card-1.jpg.PNG"
            alt="Oakline debit card"
            width={600}
            height={400}
          />
        </div>
      </section>

      {/* FEATURES GRID */}
      <section className={styles.features}>
        <div className={styles.featuresGrid}>
          <div className={styles.feature}>
            <i className="fas fa-hand-holding-dollar"></i>
            <h3>Loans</h3>
            <p>Personal & business loans with competitive rates.</p>
            <Link href="/loans"><a className="btn-green">Apply Loan</a></Link>
          </div>

          <div className={styles.feature}>
            <i className="fas fa-coins"></i>
            <h3>Certificates (CDs)</h3>
            <p>Fixed-term deposits with guaranteed returns.</p>
            <Link href="/cd"><a className="btn-green">Open CD</a></Link>
          </div>

          <div className={styles.feature}>
            <i className="fas fa-wallet"></i>
            <h3>Digital Wallet</h3>
            <p>Connect cards for instant mobile payments & wallets.</p>
            <Link href="/mobile"><a className="btn-green">Learn More</a></Link>
          </div>

          <div className={styles.feature}>
            <i className="fas fa-globe"></i>
            <h3>International Transfers</h3>
            <p>Fast cross-border payments with competitive FX.</p>
            <Link href="/transfers"><a className="btn-green">Send Money</a></Link>
          </div>

          <div className={styles.feature}>
            <i className="fas fa-shield-alt"></i>
            <h3>Security & Fraud Protection</h3>
            <p>Multi-layer encryption, 2FA, and real-time fraud alerts.</p>
            <Link href="/security"><a className="btn-green">Security</a></Link>
          </div>

          <div className={styles.feature}>
            <i className="fas fa-chart-line"></i>
            <h3>Investments</h3>
            <p>Advisory, robo-advice and investment accounts.</p>
            <Link href="/invest"><a className="btn-green">Invest</a></Link>
          </div>
        </div>
      </section>

      {/* PRODUCT HERO: MOBILE TRANSACTIONS */}
      <section className={styles.promoDark}>
        <div className={styles.heroContent}>
          <h2>Bank On The Go</h2>
          <p>
            Check balances, make transfers, and track statements right from your phone.
          </p>
          <Link href="/mobile"><a className="btn-green">Learn More</a></Link>
        </div>
        <div className={styles.heroImage}>
          <Image
            src="/hero-mobile-transactions.jpg.PNG"
            alt="Mobile transactions"
            width={600}
            height={400}
            style={{ opacity: 0.12 }}
          />
        </div>
      </section>

      {/* ADDITIONAL FEATURES */}
      <section className={styles.features}>
        <div className={styles.featuresGrid}>
          <div className={styles.feature}>
            <i className="fas fa-bolt"></i>
            <h3>Instant Transfers</h3>
            <p>Inter-account and same-day transfers.</p>
            <Link href="/transfers"><a className="btn-green">Transfer</a></Link>
          </div>

          <div className={styles.feature}>
            <i className="fas fa-receipt"></i>
            <h3>Bill Pay</h3>
            <p>Automate bills and schedule payments easily.</p>
            <Link href="/billpay"><a className="btn-green">Set Up</a></Link>
          </div>

          <div className={styles.feature}>
            <i className="fas fa-file-invoice"></i>
            <h3>Statements & Reporting</h3>
            <p>Download statements, CSV exports and analytics.</p>
            <Link href="/reports"><a className="btn-green">View Reports</a></Link>
          </div>
        </div>
      </section>
    </main>
  );
}
