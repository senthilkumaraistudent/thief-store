import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import logo from "../../assets/logo.png";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setErr("");
    try {
      await login(username, password);
      navigate("/admin/dashboard");
    } catch (e2) {
      setErr("Incorrect username or password.");
    }
  }

  return (
    <div className="view active">
      <form className="admin-login-box" onSubmit={handleSubmit}>
        <img src={logo} style={{ height: 48, margin: "0 auto" }} alt="logo" />
        <h2>Admin Login</h2>
        <p className="hint">Owner access only — this is your real Django account.</p>
        <div className="field" style={{ textAlign: "left" }}>
          <label>Username</label>
          <input value={username} onChange={(e) => setUsername(e.target.value)} autoFocus />
        </div>
        <div className="field" style={{ textAlign: "left" }}>
          <label>Password</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <div className="err-msg">{err}</div>
        <button className="btn block" type="submit">LOG IN</button>
      </form>
    </div>
  );
}
