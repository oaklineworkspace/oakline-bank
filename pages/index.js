import { useEffect } from "react";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import "../styles/globals.css";

export default function Home() {
  useEffect(() => {
    // Dropdown toggles
    function togglePanel(btnId, panelId) {
      const btn = document.getElementById(btnId);
      const panel = document.getElementById(panelId);
      if (!btn || !panel) return;

      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        panel.style.display = panel.style.display === "block" ? "none" : "block";
      });

      document.addEventListener("click", () => {
        panel.style.display = "none";
      });
    }

    togglePanel("accountBtn", "accountPanel");
    togglePanel("menuBtn", "menuPanel");

    // Theme toggle
    const themeToggle = document.getElementById("themeToggle");
    const themeIcon = document.getElementById("themeIcon");
    if (document.documentElement.getAttribute("data-theme") === "dark") {
      themeIcon.classList.remove("fa-moon");
      themeIcon.classList.add("fa-sun");
    }
    themeToggle.addEventListener("click", () => {
      const isDark = document.documentElement.getAttribute("data-theme") === "dark";
      if (isDark) {
        document.documentElement.removeAttribute("data-theme");
        themeIcon.classList.replace("fa-sun", "fa-moon");
      } else {
        document.documentElement.setAttribute("data-theme", "dark");
        themeIcon.classList.replace("fa-moon", "fa-sun");
      }
    });

    // Floating chat
    const chatBtn = document.getElementById("chatButton");
    chatBtn?.addEventListener("click", () => {
      window.open("https://oakline-bank.vercel.app/chat", "oakline-chat", "width=420,height=620");
    });

    setInterval(() => {
      if (chatBtn) {
        chatBtn.style.transform = chatBtn.style.transform === "scale(1.06)" ? "scale(1)" : "scale(1.06)";
      }
    }, 1600);

    // Reveal animation
    const reveals = document.querySelectorAll(".reveal");
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("visible");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    reveals.forEach((r) => io.observe(r));
  }, []);

  return (
    <>
      <Head>
        <title>Oakline Bank — Modern Banking</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta charSet="utf-8" />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css"
        />
      </Head>

      {/* HEADER */}
      <header>
        <div className="header-inner">
          <div className="logo-row">
            <Image src="/images/logo-primary.png.jpg" alt="Oakline logo" width={52} height={52} />
            <div className="brand-title">Oakline Bank</div>
          </div>

          <div className="controls">
            <div style={{ position: "relative" }}>
              <button className="dropdown-btn" id="menuBtn" aria-expanded="false">
                <i className="fas fa-bars"></i>
              </button>
              <div
                className="dropdown-panel"
                id="menuPanel"
                style={{ right: 0, display: "none", maxHeight: "80vh", overflowY: "auto", padding: "12px", width: "280px" }}
              >
                <h4 style={{ marginBottom: "8px", color: "var(--brand)" }}>Bank Features</h4>
                <Link href="/">Home</Link>
                <Link href="/checking">Checking Accounts</Link>
                <Link href="/savings">Savings Accounts</Link>
                <Link href="/business">Business Accounts</Link>
                {/* Add rest of links */}
              </div>
            </div>
          </div>

          <button id="themeToggle" title="Toggle light / dark">
            <i id="themeIcon" className="fas fa-moon"></i>
          </button>

          <div style={{ position: "relative" }}>
            <button className="dropdown-btn" id="accountBtn" aria-expanded="false">
              <i className="fas fa-user-circle"></i>
            </button>
            <div className="dropdown-panel" id="accountPanel" style={{ right: 0 }}>
              <Link href="/login">
                <i className="fas fa-right-to-bracket"></i> Log In
              </Link>
              <Link href="/signup">
                <i className="fas fa-user-plus"></i> Create Account
              </Link>
            </div>
          </div>
        </div>

        <div className="marquee">
          <span>🔐 Welcome to Oakline Bank — secure personal & business banking, competitive rates, and 24/7 support.</span>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="hero">
        <Image className="hero-bg" src="/images/hero-mobile.jpg.PNG" alt="Mobile banking image" fill />
        <div className="hero-inner">
          <h1>Banking that puts you first — wherever you are.</h1>
          <p>Open accounts in minutes, transfer funds instantly and manage your money securely with the Oakline mobile app.</p>
          <div className="cta-row">
            <Link className="btn-green" href="/signup">Open Account</Link>
            <Link className="btn-soft" href="/login">Log In</Link>
          </div>
        </div>
      </section>

      {/* FEATURES & REST OF CONTENT */}
      {/* Move over your features, promo sections, testimonials, etc., same as in your HTML but JSX-ready */}

      {/* FLOATING CHAT */}
      <button id="chatButton" title="Chat with Oakline">
        <i className="fas fa-comments"></i>
      </button>
    </>
  );
}
