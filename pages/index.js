import Head from 'next/head'
import Link from 'next/link'
import { useEffect, useRef } from 'react'

export default function Home() {
  const menuPanelRef = useRef(null)
  const accountPanelRef = useRef(null)

  useEffect(() => {
    // Close panels on document click
    const closeAll = () => {
      if (menuPanelRef.current) menuPanelRef.current.style.display = 'none'
      if (accountPanelRef.current) accountPanelRef.current.style.display = 'none'
    }
    document.addEventListener('click', closeAll)
    return () => document.removeEventListener('click', closeAll)
  }, [])

  useEffect(() => {
    // Reveal-on-scroll
    const reveals = document.querySelectorAll('.reveal')
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add('visible')
          io.unobserve(e.target)
        }
      })
    }, { threshold: 0.12 })
    reveals.forEach((r) => io.observe(r))
    return () => io.disconnect()
  }, [])

  useEffect(() => {
    // Subtle pulse for chat button
    const btn = document.getElementById('chatButton')
    if (!btn) return
    const id = setInterval(() => {
      btn.style.transform = btn.style.transform === 'scale(1.06)' ? 'scale(1)' : 'scale(1.06)'
    }, 1600)
    return () => clearInterval(id)
  }, [])

  const togglePanel = (panelRef) => (e) => {
    e.stopPropagation()
    if (!panelRef.current) return
    panelRef.current.style.display = panelRef.current.style.display === 'block' ? 'none' : 'block'
  }

  const toggleTheme = () => {
    const root = document.documentElement
    const isDark = root.getAttribute('data-theme') === 'dark'
    if (isDark) root.removeAttribute('data-theme')
    else root.setAttribute('data-theme', 'dark')
  }

  return (
    <>
      <Head>
        <title>Oakline Bank — Modern Banking</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {/* Font Awesome (same as your HTML) */}
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css"
        />
        {/* Optional: favicon in /public */}
        <link rel="icon" href="/favicon.ico" />
        {/* Optional: Supabase client for public pages that need it */}
        <script src="https://unpkg.com/@supabase/supabase-js@2" defer />
      </Head>

      <header>
        <div className="header-inner">
          <div className="logo-row">
            <img src="/images/logo-primary.png.jpg" alt="Oakline logo" />
            <div className="brand-title">Oakline Bank</div>
          </div>

          <div className="controls">
            {/* Menu */}
            <div style={{ position: 'relative' }}>
              <button className="dropdown-btn" id="menuBtn" onClick={togglePanel(menuPanelRef)} aria-expanded="false">
                <i className="fas fa-bars" />
              </button>
              <div className="dropdown-panel" ref={menuPanelRef} style={{ right: 0, display: 'none', maxHeight: '80vh', overflowY: 'auto', padding: 12, width: 280 }}>
                <h4 style={{ marginBottom: 8, color: 'var(--brand)' }}>Bank Features</h4>
                <Link href="/">Home</Link>
                <Link href="/checking">Checking Accounts</Link>
                <Link href="/savings">Savings Accounts</Link>
                <Link href="/business">Business Accounts</Link>
                <Link href="/loans">Personal &amp; Business Loans</Link>
                <Link href="/cd">Certificates of Deposit (CDs)</Link>
                <Link href="/student">Student Accounts</Link>
                <Link href="/transfer">Instant Transfers</Link>
                <Link href="/billpay">Bill Pay</Link>
                <Link href="/international">International Transfers</Link>
                <Link href="/mobile">Mobile Wallets</Link>
                <Link href="/pos-solutions">POS &amp; Merchant Solutions</Link>
                <Link href="/cards">Debit &amp; Credit Cards</Link>
                <Link href="/virtual-cards">Virtual Cards</Link>
                <Link href="/security">Account Controls &amp; Fraud Protection</Link>
                <Link href="/identity">Identity &amp; Insurance Services</Link>
                <Link href="/invest">Investment Accounts</Link>
                <Link href="/crypto">Crypto Banking</Link>
                <Link href="/rewards">Rewards &amp; Cashback</Link>
                <Link href="/budget">Budgeting &amp; Analytics Tools</Link>
              </div>
            </div>

            {/* Theme toggle */}
            <button id="themeToggle" onClick={toggleTheme} title="Toggle light / dark">
              <i className="fas fa-moon" id="themeIcon" />
            </button>

            {/* Account */}
            <div style={{ position: 'relative' }}>
              <button className="dropdown-btn" id="accountBtn" onClick={togglePanel(accountPanelRef)} aria-expanded="false">
                <i className="fas fa-user-circle" />
              </button>
              <div className="dropdown-panel" ref={accountPanelRef} style={{ right: 0 }}>
                <Link href="/login"><i className="fas fa-right-to-bracket" /> Log In</Link>
                <Link href="/create-account"><i className="fas fa-user-plus" /> Create Account</Link>
              </div>
            </div>
          </div>
        </div>

        <div className="marquee">
          <span>🔐 Welcome to Oakline Bank — secure personal &amp; business banking, competitive rates, and 24/7 support.</span>
        </div>
      </header>

      {/* HERO */}
      <section className="hero" aria-label="Main hero">
        <img className="hero-bg" src="/images/hero-mobile.jpg.PNG" alt="Mobile banking image" />
        <div className="hero-inner">
          <h1>Banking that puts you first — wherever you are.</h1>
          <p>Open accounts in minutes, transfer funds instantly and manage your money securely with the Oakline mobile app.</p>
          <div className="cta-row">
            <Link className="btn-green" href="/create-account">Open Account</Link>
            <Link className="btn-soft" href="/login">Log In</Link>
          </div>
        </div>
      </section>

      {/* Core Features 1st row */}
      <div className="wrap">
        <h2 className="sectionTitle">Our Core Features</h2>
        <p className="sectionSub">Everything you need — from everyday accounts to advanced crypto and business solutions.</p>

        <div className="features-grid">
          <div className="feature reveal">
            <i className="fas fa-credit-card" />
            <h3>Checking</h3>
            <p>Flexible accounts, debit cards, and instant payments.</p>
            <Link className="btn-green" href="/checking">Open Checking</Link>
          </div>

          <div className="feature reveal">
            <i className="fas fa-piggy-bank" />
            <h3>Savings</h3>
            <p>High-yield savings with auto-save options and goals.</p>
            <Link className="btn-green" href="/savings">Open Savings</Link>
          </div>

          <div className="feature reveal">
            <i className="fas fa-building" />
            <h3>Business</h3>
            <p>Business checking, merchant tools, payroll integrations.</p>
            <Link className="btn-green" href="/business">Open Business</Link>
          </div>
        </div>
      </div>

      {/* Big promo image */}
      <section className="promo-only">
        <img src="/images/hero-oakline-features.jpg.PNG" alt="Oakline features" />
      </section>

      {/* More features */}
      <div className="wrap">
        <div className="features-grid">
          <div className="feature reveal">
            <i className="fas fa-hand-holding-dollar" />
            <h3>Loans</h3>
            <p>Personal &amp; business loans with competitive rates.</p>
            <Link className="btn-green" href="/loans">Apply Loan</Link>
          </div>

          <div className="feature reveal">
            <i className="fas fa-coins" />
            <h3>Certificates (CDs)</h3>
            <p>Fixed-term deposits with guaranteed returns.</p>
            <Link className="btn-green" href="/cd">Open CD</Link>
          </div>

          <div className="feature reveal">
            <i className="fas fa-wallet" />
            <h3>Digital Wallet</h3>
            <p>Connect cards for instant mobile payments &amp; wallets.</p>
            <Link className="btn-green" href="/mobile">Learn More</Link>
          </div>

          <div className="feature reveal">
            <i className="fas fa-globe" />
            <h3>International Transfers</h3>
            <p>Fast cross-border payments with competitive FX.</p>
            <Link className="btn-green" href="/international">Send Money</Link>
          </div>

          <div className="feature reveal">
            <i className="fas fa-shield-alt" />
            <h3>Security &amp; Fraud Protection</h3>
            <p>Multi-layer encryption, 2FA and real-time fraud alerts.</p>
            <Link className="btn-green" href="/security">Security</Link>
          </div>

          <div className="feature reveal">
            <i className="fas fa-chart-line" />
            <h3>Investments</h3>
            <p>Advisory, robo-advice and investment accounts.</p>
            <Link className="btn-green" href="/invest">Invest</Link>
          </div>
        </div>
      </div>

      {/* Debit card hero */}
      <section className="product-hero">
        <figure><img src="/images/hero-debit-card-1.jpg.PNG" alt="Oakline debit card" /></figure>
        <div className="ph-text">
          <h2>Oakline Debit Card</h2>
          <p>Secure worldwide, with contactless payments, instant lock &amp; unlock and real-time spend tracking.</p>
          <Link className="btn-green" href="/debit-card">Get Your Debit Card</Link>
        </div>
      </section>

      {/* Mobile promo */}
      <section className="promo-dark">
        <img className="promo-bg" src="/images/hero-mobile-transactions.jpg.PNG" alt="" aria-hidden="true" />
        <div className="promo-inner">
          <h2>Bank On The Go</h2>
          <p>Check balances, make transfers, and track statements right from your phone.</p>
          <Link className="btn-green" href="/mobile">Learn More</Link>
        </div>
      </section>

      {/* Final rows of features */}
      <div className="wrap">
        <div className="features-grid">
          <div className="feature reveal"><i className="fas fa-headset" /><h3>24/7 Support</h3><p>Human support day &amp; night.</p><Link className="btn-green" href="/support">Contact</Link></div>
          <div className="feature reveal"><i className="fas fa-location-dot" /><h3>Branch Locator</h3><p>Find a branch or ATM near you.</p><Link className="btn-green" href="/branches">Find</Link></div>
          <div className="feature reveal"><i className="fas fa-file-invoice-dollar" /><h3>Merchant Services</h3><p>Payment processing &amp; POS solutions.</p><Link className="btn-green" href="/merchant">Merchant</Link></div>
          <div className="feature reveal"><i className="fas fa-credit-card" /><h3>Virtual Cards</h3><p>Create virtual cards for online payments.</p><Link className="btn-green" href="/cards">Create</Link></div>
          <div className="feature reveal"><i className="fas fa-user-lock" /><h3>Account Controls</h3><p>Freeze, limit, or set alerts instantly.</p><Link className="btn-green" href="/security">Manage</Link></div>
          <div className="feature reveal"><i className="fas fa-file-contract" /><h3>Business Loans</h3><p>Working capital &amp; term loans for your company.</p><Link className="btn-green" href="/business-loans">Apply</Link></div>
        </div>
      </div>

      {/* POS hero */}
      <section className="product-hero">
        <figure><img src="/images/hero-pos.jpg.PNG" alt="POS terminal" /></figure>
        <div className="ph-text">
          <h2>POS &amp; Merchant Solutions</h2>
          <p>Fast, secure payment processing and an easy dashboard for merchants.</p>
          <Link className="btn-green" href="/pos-solutions">Explore POS</Link>
        </div>
      </section>

      {/* Dev Fund & Crypto split */}
      <section className="split">
        <div className="split-col">
          <img src="/images/hero-development-fund.jpg.PNG" alt="Development fund" />
        </div>
        <div className="split-col">
          <h2>Oakline Development &amp; Crypto Banking</h2>
          <p>Support innovation with our development fund, and explore crypto banking including secure wallets and trading.</p>
          <ul>
            <li>• Secure Crypto Wallets</li>
            <li>• Real-Time Crypto Trading</li>
            <li>• Investment Tracking &amp; Reports</li>
            <li>• Dedicated Development Fund Initiatives</li>
          </ul>
          <Link className="btn-green" href="/development-crypto">Explore Fund &amp; Crypto</Link>
        </div>
      </section>

      {/* Testimonials */}
      <div className="wrap">
        <h2 className="sectionTitle">What Our Customers Say</h2>
        <div className="test-grid">
          <div className="testimonial reveal">
            <div className="meta"><img src="/images/testimonial-1.jpg.JPG" alt="" /><strong>Jane D.</strong></div>
            <p>"Oakline Bank makes managing my money so simple. The app is fast and secure!"</p>
          </div>
          <div className="testimonial reveal">
            <div className="meta"><img src="/images/testimonial-2.jpg.JPG" alt="" /><strong>Charlotte S.</strong></div>
            <p>"I love their business accounts. The transfers are instant and the support is excellent."</p>
          </div>
          <div className="testimonial reveal">
            <div className="meta"><img src="/images/testimonial-3.jpg.JPG" alt="" /><strong>Scott R.</strong></div>
            <p>"Opening a savings account was so easy. The rates are great compared to other banks."</p>
          </div>
        </div>
      </div>

      {/* More Tools & Services */}
      <div className="wrap">
        <h3 className="sectionTitle small">More Tools &amp; Services</h3>
        <div className="features-grid">
          <div className="feature reveal"><i className="fas fa-file-export" /><h3>Export CSV</h3><p>Download transactions for accounting.</p><Link className="btn-green" href="/reports">Export</Link></div>
          <div className="feature reveal"><i className="fas fa-university" /><h3>Partner Banking</h3><p>White-label &amp; BaaS options.</p><Link className="btn-green" href="/partners">Partner</Link></div>
          <div className="feature reveal"><i className="fas fa-piggy-bank" /><h3>Auto-Save Rules</h3><p>Round-ups and scheduled transfers.</p><Link className="btn-green" href="/autosave">Setup</Link></div>
          <div className="feature reveal"><i className="fas fa-hand-holding-usd" /><h3>Rewards</h3><p>Cashback &amp; loyalty programs.</p><Link className="btn-green" href="/rewards">Join</Link></div>
          <div className="feature reveal"><i className="fas fa-user-shield" /><h3>Identity Protection</h3><p>Monitoring and alerts for identity theft.</p><Link className="btn-green" href="/identity">Protect</Link></div>
          <div className="feature reveal"><i className="fas fa-shield-virus" /><h3>Insurance Services</h3><p>Optional insurance for accounts &amp; cards.</p><Link className="btn-green" href="/insurance">Learn</Link></div>
          <div className="feature reveal"><i className="fas fa-exchange-alt" /><h3>Account Aggregation</h3><p>Link external accounts and see everything in one place.</p><Link className="btn-green" href="/aggregation">Link</Link></div>
          <div className="feature reveal"><i className="fas fa-poll" /><h3>Budgeting Tools</h3><p>Auto-categorization and budgets.</p><Link className="btn-green" href="/budget">Use</Link></div>
          <div className="feature reveal"><i className="fas fa-user-friends" /><h3>Multi-User Banking</h3><p>Household &amp; business multi-user access.</p><Link className="btn-green" href="/multiuser">Setup</Link></div>
          <div className="feature reveal"><i className="fas fa-robot" /><h3>Robo-Advice</h3><p>Automated investment recommendations.</p><Link className="btn-green" href="/robo">Explore</Link></div>
        </div>
      </div>

      {/* Trust badges */}
      <section className="certs">
        <h3>Trusted &amp; Certified</h3>
        <p>Oakline Bank is recognized by industry leaders and follows strict security standards.</p>
        <div className="cert-row">
          <img src="/images/fdic.png" alt="FDIC Insured" />
          <img src="/images/equal-housing.png" alt="Equal Housing Lender" />
          <img src="/images/pci-dss.png" alt="PCI DSS Compliant" />
          <img src="/images/iso27001.png" alt="ISO 27001 Certified" />
          <img src="/images/soc2.png" alt="SOC 2 Certified" />
        </div>
      </section>

      {/* Final CTA */}
      <section className="final-cta">
        <div className="final-inner">
          <h2>Why Choose Oakline Bank?</h2>
          <p>
            At Oakline Bank, we combine innovation, security, and personalized service to give you a banking
            experience unlike any other. Whether you're managing personal finances, running a business,
            investing, or exploring modern opportunities like cryptocurrency banking, we provide tools,
            guidance, and support to help you reach your financial goals. Our intuitive mobile app, responsive
            customer support, and cutting-edge security keep you in control wherever you are. Trust, transparency
            and growth are at the heart of everything we do. Join thousands of satisfied customers who bank
            smarter, faster and safer with Oakline.
          </p>
          <Link className="btn-green big" href="/create-account">Open Account Now</Link>
        </div>
      </section>

      {/* Footer */}
      <footer>
        <div className="footer-grid">
          <div className="col">
            <img src="/images/logo-secondary.png.jpg" alt="Oakline secondary logo" />
            <p>Oakline Bank provides modern, secure banking for individuals and businesses. Fast transfers, reliable service, and innovative products.</p>
          </div>

          <div className="col">
            <h4>Services</h4>
            <ul>
              <li><Link href="/checking">Checking</Link></li>
              <li><Link href="/savings">Savings</Link></li>
              <li><Link href="/business">Business</Link></li>
              <li><Link href="/loans">Loans</Link></li>
            </ul>
          </div>

          <div className="col">
            <h4>Quick Links</h4>
            <ul>
              <li><Link href="/login">Login</Link></li>
              <li><Link href="/create-account">Open Account</Link></li>
              <li><a href="#contact">Contact</a></li>
            </ul>
          </div>

          <div className="col">
            <h4>Follow Us</h4>
            <div className="social">
              <a href="#" aria-label="facebook"><i className="fab fa-facebook-f" /></a>
              <a href="#" aria-label="twitter"><i className="fab fa-twitter" /></a>
              <a href="#" aria-label="linkedin"><i className="fab fa-linkedin-in" /></a>
            </div>
          </div>
        </div>

        <div className="legal">
          <p>&copy; {new Date().getFullYear()} Oakline Bank — All rights reserved.</p>
          <p>Oakline Bank is a member of FDIC and an Equal Housing Lender. Terms, rates and offers are subject to change.</p>
        </div>
      </footer>

      {/* Floating chat */}
      <button
        id="chatButton"
        title="Chat with Oakline"
        onClick={() => window.open('https://oakline-bank.vercel.app/chat', 'oakline-chat', 'width=420,height=620')}
      >
        <i className="fas fa-comments" />
      </button>

      {/* Styles */}
      <style jsx>{`
        :root{
          --brand:#00264d;
          --accent:#36c957;
          --text:#222;
          --bg:#e9f0f6;
          --card:#ffffff;
          --muted:#556;
          --footer:#021631;
          --btn-green:#36c957;
        }
        [data-theme="dark"]{
          --brand:#071535;
          --accent:#39d06a;
          --text:#e6eef8;
          --bg:#081022;
          --card:#0d1624;
          --muted:#98a6b6;
          --footer:#000814;
        }
        *{box-sizing:border-box}
        body{margin:0;font-family:system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial;background:var(--bg);color:var(--text);-webkit-font-smoothing:antialiased}
        a{color:inherit;text-decoration:none}
        img{display:block;max-width:100%;height:auto}

        header{position:sticky;top:0;z-index:1200;background:var(--brand);color:#fff;padding:10px 20px;box-shadow:0 6px 18px rgba(2,6,12,.15)}
        .header-inner{display:flex;align-items:center;justify-content:space-between;gap:12px;max-width:1200px;margin:0 auto}
        .logo-row{display:flex;align-items:center;gap:12px}
        .logo-row img{height:52px}
        .brand-title{font-weight:800;font-size:1.25rem}

        .controls{display:flex;gap:10px;align-items:center}
        .dropdown-btn{width:44px;height:44px;border-radius:10px;border:1px solid rgba(255,255,255,.12);background:transparent;color:#fff;display:inline-flex;align-items:center;justify-content:center;cursor:pointer}
        .dropdown-panel{position:absolute;top:64px;min-width:220px;background:var(--card);color:var(--text);border-radius:10px;box-shadow:0 12px 30px rgba(2,6,12,.18);display:none;padding:8px;z-index:1300}
        .dropdown-panel a{display:block;padding:10px;border-radius:8px;color:var(--text);font-weight:600}
        .dropdown-panel a:hover{background:#f3f6f9}

        #themeToggle{width:44px;height:44px;border-radius:50%;border:none;background:#fff;color:var(--brand);cursor:pointer;display:inline-flex;align-items:center;justify-content:center}

        .marquee{position:relative;overflow:hidden;background:rgba(0,40,90,.9);color:#fff;font-weight:700;text-align:center;white-space:nowrap;height:40px;display:flex;align-items:center;z-index:1500}
        .marquee span{display:inline-block;padding-left:100%;animation:marqueeScroll 20s linear infinite}
        @keyframes marqueeScroll{0%{transform:translateX(0)}100%{transform:translateX(-100%)}}
        .marquee:hover span{animation-play-state:paused}

        .hero{min-height:620px;display:flex;align-items:center;justify-content:center;position:relative;overflow:hidden}
        .hero .hero-bg{position:absolute;inset:0;z-index:0;object-fit:cover;width:100%;height:100%;filter:brightness(.6)}
        .hero .hero-inner{position:relative;z-index:2;text-align:center;color:#fff;padding:40px;max-width:1100px}
        .hero h1{font-size:clamp(2rem,4.5vw,3.2rem);margin:0 0 12px;line-height:1.02}
        .hero p{font-size:1.05rem;margin:0 auto 18px;max-width:720px;color:rgba(255,255,255,.95)}
        .cta-row{display:flex;gap:12px;justify-content:center;flex-wrap:wrap;margin-top:8px}
        .btn-green{background:var(--btn-green);color:#fff;padding:12px 20px;border-radius:10px;font-weight:800;display:inline-block}
        .btn-soft{background:rgba(255,255,255,.12);color:#fff;padding:12px 20px;border-radius:10px;font-weight:700}

        .wrap{max-width:1200px;margin:0 auto;padding:60px 20px}
        .sectionTitle{text-align:center;color:var(--brand);font-size:1.9rem;margin-bottom:6px}
        .sectionTitle.small{font-size:1.4rem}
        .sectionSub{text-align:center;color:var(--muted);max-width:900px;margin:0 auto 24px}

        .features-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:20px}
        .feature{background:var(--card);border-radius:12px;padding:18px;box-shadow:0 8px 22px rgba(2,6,12,.06);text-align:center}
        .feature i{font-size:28px;color:var(--accent);margin-bottom:12px}
        .feature h3{margin:6px 0 10px;font-size:1.05rem}
        .feature p{color:var(--muted);font-size:.95rem;margin-bottom:12px}

        .promo-only{margin:48px auto;max-width:1100px;padding:12px 0;text-align:center;background:transparent}
        .promo-only img{width:100%;border-radius:12px;box-shadow:0 12px 30px rgba(2,6,12,.12);display:block;margin:0 auto}

        .product-hero{margin:48px auto;max-width:1100px;display:flex;flex-direction:column;align-items:center;gap:18px;padding:40px 20px;background:transparent}
        .product-hero figure{margin:0;width:70%;max-width:480px}
        .product-hero img{width:100%;border-radius:14px;box-shadow:0 10px 30px rgba(2,6,12,.12)}
        .ph-text{max-width:820px;text-align:center}
        .ph-text p{color:var(--muted)}

        .promo-dark{margin:36px auto;max-width:1100px;padding:36px;background:linear-gradient(180deg,#08213e,#07112a);position:relative;border-radius:14px;overflow:hidden;text-align:center;color:#fff}
        .promo-dark .promo-bg{position:absolute;right:4%;top:6%;max-width:420px;opacity:.12;filter:grayscale(.1) brightness(.95);pointer-events:none}
        .promo-dark .promo-inner{position:relative;z-index:2;max-width:820px;margin:0 auto}
        .promo-dark .btn-green{margin-top:8px}

        .test-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:20px;margin-top:18px}
        .testimonial{background:var(--card);padding:18px;border-radius:12px;box-shadow:0 8px 22px rgba(2,6,12,.06)}
        .testimonial .meta{display:flex;align-items:center;gap:12px;margin-bottom:10px}
        .testimonial img{width:56px;height:56px;border-radius:50%;object-fit:cover}

        .split{margin:48px auto;max-width:1100px;padding:20px;display:flex;flex-wrap:wrap;gap:24px;align-items:center;justify-content:center}
        .split-col{flex:1 1 420px;min-width:280px}
        .split-col img{border-radius:12px;box-shadow:0 12px 30px rgba(2,6,12,.12);width:100%;height:auto;object-fit:cover}
        .split-col ul{color:var(--muted);line-height:1.6}

        .certs{margin:60px auto;max-width:1200px;padding:28px;text-align:center}
        .certs h3{color:var(--brand)}
        .certs p{color:var(--muted);max-width:900px;margin:8px auto 18px}
        .cert-row{display:flex;gap:24px;justify-content:center;align-items:center;flex-wrap:wrap}
        .cert-row img{height:56px}

        .final-cta{padding:48px 20px;background:var(--bg);text-align:center}
        .final-inner{max-width:1000px;margin:0 auto}
        .final-inner h2{font-size:1.9rem;color:var(--brand)}
        .final-inner p{color:var(--text);line-height:1.7;margin-top:14px}
        .btn-green.big{font-size:1.1rem;padding:14px 28px;display:inline-block;margin-top:18px}

        footer{background:var(--footer);color:#fff;padding:60px 20px}
        .footer-grid{max-width:1200px;margin:0 auto;display:flex;flex-wrap:wrap;gap:28px;justify-content:space-between;align-items:flex-start}
        footer img{height:42px;margin-bottom:12px}
        footer p{color:var(--muted);max-width:340px}
        .col h4{margin:0 0 8px}
        .col ul{list-style:none;padding:0;margin:8px 0 0;color:var(--muted)}
        .col ul li{margin:6px 0}
        .social{display:flex;gap:10px;margin-top:8px}
        .legal{border-top:1px solid rgba(255,255,255,.08);margin-top:28px;padding-top:18px;text-align:center;color:var(--muted)}
        .legal p{margin:6px 0}

        #chatButton{position:fixed;right:22px;bottom:22px;width:64px;height:64px;border-radius:50%;background:var(--accent);color:white;border:none;box-shadow:0 10px 30px rgba(2,6,12,.25);z-index:1400;cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:20px}

        .reveal{opacity:0;transform:translateY(10px);transition:all .6s ease-out}
        .reveal.visible{opacity:1;transform:none}

        @media (max-width:720px){
          .hero{min-height:520px}
          .product-hero figure{width:90%}
          header{padding:12px}
          .header-inner{gap:8px}
        }
      `}</style>
    </>
  )
}
