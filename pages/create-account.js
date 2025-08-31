// pages/create-account.js

export default function CreateAccount() {
  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      minHeight: "100vh",
      fontFamily: "Arial, sans-serif",
      backgroundColor: "#f0f4f8",
      textAlign: "center",
      padding: "2rem"
    }}>
      <h1 style={{ color: "#0070f3", marginBottom: "1rem" }}>Create Your Oakline Bank Account</h1>
      <form style={{ display: "flex", flexDirection: "column", width: "300px" }}>
        <input
          type="text"
          placeholder="Full Name"
          style={{ marginBottom: "1rem", padding: "10px", borderRadius: "5px", border: "1px solid #ccc" }}
        />
        <input
          type="email"
          placeholder="Email"
          style={{ marginBottom: "1rem", padding: "10px", borderRadius: "5px", border: "1px solid #ccc" }}
        />
        <input
          type="password"
          placeholder="Password"
          style={{ marginBottom: "1rem", padding: "10px", borderRadius: "5px", border: "1px solid #ccc" }}
        />
        <button style={{
          padding: "10px",
          backgroundColor: "#0070f3",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer"
        }}>Create Account</button>
      </form>
    </div>
  );
}
