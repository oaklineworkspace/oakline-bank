// pages/index.js

export default function Home() {
  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      minHeight: "100vh",
      fontFamily: "Arial, sans-serif",
      backgroundColor: "#f4f4f4",
      textAlign: "center",
      padding: "2rem"
    }}>
      <h1 style={{ color: "#004aad", fontSize: "3rem", marginBottom: "1rem" }}>
        Welcome to Oakline Bank
      </h1>
      <p style={{ fontSize: "1.2rem", maxWidth: "600px", marginBottom: "2rem" }}>
        Your trusted banking platform is live! Access your account, manage transactions, and explore our services.
      </p>
      <div>
        <a
          href="/login"
          style={{
            marginRight: "1rem",
            padding: "10px 20px",
            backgroundColor: "#004aad",
            color: "white",
            textDecoration: "none",
            borderRadius: "5px"
          }}
        >
          Login
        </a>
        <a
          href="/create-account"
          style={{
            padding: "10px 20px",
            backgroundColor: "#0070f3",
            color: "white",
            textDecoration: "none",
            borderRadius: "5px"
          }}
        >
          Sign Up
        </a>
      </div>
    </div>
  );
}
