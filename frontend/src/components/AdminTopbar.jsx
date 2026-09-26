import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function AdminTopbar({ active }) {
  const { logout } = useAuth();
  return (
    <div className="admin-topbar">
      <h1>THIEF STORE Admin</h1>
      <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
        <Link className={`btn ${active === "dashboard" ? "" : "ghost"} sm`} to="/admin/dashboard">Dashboard</Link>
        <Link className={`btn ${active === "products" ? "" : "ghost"} sm`} to="/admin/products">Products</Link>
        <button className="btn ghost sm" onClick={logout}>Log out</button>
      </div>
    </div>
  );
}
