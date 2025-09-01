// pages/index.js
import Link from "next/link";
import Head from "next/head";

export default function Home() {
  return (
    <>
      <Head>
        <title>Oakline Bank</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div style={{
        fontFamily: "Arial, sans-serif",
        textAlign: "center",
        padding: "50px"
      }}>
        <h1>Welcome to Oakline Bank</h1>
        <p>Your trusted digital banking platform.</p>

        <div style={{ marginTop: "20px" }}>
          <Link href="/login">
            <button style={{
              padding: "10px 20px",
              margin: "10px",
              fontSize: "16px",
              cursor: "pointer"
            }}>
              Login
            </button>
          </Link>

          <Link href="/create-account">
            <button style={{
              padding: "10px 20px",
              margin: "10px",
              fontSize: "16px",
              cursor: "pointer"
            }}>
              Create Account
            </button>
          </Link>
        </div>
      </div>
    </>
  );
}
