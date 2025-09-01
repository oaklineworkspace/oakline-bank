// pages/index.js
import Head from "next/head";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function Home() {
  return (
    <>
      <Head>
        <title>Oakline Bank — Modern Banking</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <Header theme="light" setTheme={() => {}} />

      <main style={{ padding: "2rem", textAlign: "center" }}>
        <h1>Welcome to Oakline Bank</h1>
        <p>
          Your secure and modern banking experience. Focus on creating your account below.
        </p>

        {/* Temporary account creation placeholder */}
        <div style={{ marginTop: "2rem" }}>
          <a
            href="/signup"
            style={{
              padding: "1rem 2rem",
              backgroundColor: "#0070f3",
              color: "#fff",
              borderRadius: "5px",
              textDecoration: "none",
            }}
          >
            Create Account
          </a>
        </div>
      </main>

      <Footer />
    </>
  );
}
