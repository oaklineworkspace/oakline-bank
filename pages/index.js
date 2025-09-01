import Image from "next/image";
import styles from "../styles/Home.module.css";

export default function Home() {
  return (
    <div>
      {/* HERO SECTION */}
      <section className={styles.productHero}>
        <div className={styles.heroContent}>
          <h1>Welcome to Oakline Bank</h1>
          <p>
            Seamless banking with smart solutions. Manage your accounts, make
            payments, and grow your wealth — all in one place.
          </p>
          <a href="/create-account" className={styles["btn-green"]}>
            Get Started
          </a>
        </div>
        <div className={styles.heroImage}>
          <Image
            src="/hero-mobile.jpg"
            alt="Mobile Banking"
            width={600}
            height={400}
          />
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section className={styles.features}>
        <div className={styles.featuresGrid}>
          <div className={styles.feature}>
            <i className="fas fa-mobile-alt"></i>
            <h3>Mobile Banking</h3>
            <p>Manage your money from anywhere using our intuitive app.</p>
          </div>
          <div className={styles.feature}>
            <i className="fas fa-credit-card"></i>
            <h3>Debit Cards</h3>
            <p>Safe, secure, and globally accepted debit cards for everyday use.</p>
          </div>
          <div className={styles.feature}>
            <i className="fas fa-university"></i>
            <h3>Investment Solutions</h3>
            <p>Grow your wealth with personalized investment strategies.</p>
          </div>
          <div className={styles.feature}>
            <i className="fas fa-shield-alt"></i>
            <h3>Secure & Trusted</h3>
            <p>Your data and money are protected with industry-standard security.</p>
          </div>
        </div>
      </section>

      {/* TESTIMONIAL SECTION */}
      <section className={styles.features}>
        <h2 style={{ textAlign: "center", marginBottom: "40px" }}>
          What Our Clients Say
        </h2>
        <div className={styles.featuresGrid}>
          <div className={styles.feature}>
            <Image
              src="/testimonial-1.jpg.JPG"
              alt="Testimonial 1"
              width={300}
              height={300}
            />
            <p>"Oakline Bank made my banking experience effortless!"</p>
            <strong>- Jane D.</strong>
          </div>
          <div className={styles.feature}>
            <Image
              src="/testimonial-2.jpg.JPG"
              alt="Testimonial 2"
              width={300}
              height={300}
            />
            <p>"Fast, reliable, and secure. I love the mobile app!"</p>
            <strong>- Mark T.</strong>
          </div>
          <div className={styles.feature}>
            <Image
              src="/testimonial-3.jpg.JPG"
              alt="Testimonial 3"
              width={300}
              height={300}
            />
            <p>"Professional customer support and easy account management."</p>
            <strong>- Lisa K.</strong>
          </div>
        </div>
      </section>

      {/* PROMO DARK SECTION */}
      <section className={styles.promoDark}>
        <div className={styles.heroContent}>
          <h2>Start Your Financial Journey Today</h2>
          <p>Open your account in minutes and take control of your finances.</p>
          <a href="/create-account" className={styles["btn-green"]}>
            Open Account
          </a>
        </div>
        <div className={styles.heroImage}>
          <Image
            src="/hero-development-fund.jpg.PNG"
            alt="Development Fund"
            width={600}
            height={400}
          />
        </div>
      </section>
    </div>
  );
}
