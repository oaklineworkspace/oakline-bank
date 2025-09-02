import Link from "next/link";

export default function Header() {
  return (
    <header style={{ padding: "20px", background: "#1E1E1E", color: "white", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <h1>MySite</h1>
      <nav>
        <Link href="/" style={{ margin: "0 10px", color: "white" }}>Home</Link>
        <Link href="/login" style={{ margin: "0 10px", color: "white" }}>Login</Link>
        <Link href="/dashboard" style={{ margin: "0 10px", color: "white" }}>Dashboard</Link>
      </nav>
    </header>
  );
}
