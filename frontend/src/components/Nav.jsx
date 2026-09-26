import { useState } from "react";
import { NavLink } from "react-router-dom";
import logo from "../assets/logo.png";
import WaIcon from "./WaIcon";

const WHATSAPP_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER || "918122580147";

function generalWaLink() {
  const text = encodeURIComponent("Hi THIEF STORE 👋\n\nI'd like to know more about your collection.");
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${text}`;
}

export default function Nav() {
  const [open, setOpen] = useState(false);
  const linkClass = ({ isActive }) => (isActive ? "active" : undefined);

  return (
    <header className="site-nav">
      <div className="nav-inner">
        <NavLink to="/" className="nav-brand" onClick={() => setOpen(false)}>
          <img src={logo} alt="THIEF STORE logo" />
        </NavLink>
        <nav className={`nav-links ${open ? "open" : ""}`}>
          <NavLink to="/" className={linkClass} onClick={() => setOpen(false)}>Home</NavLink>
          <NavLink to="/shop" className={linkClass} onClick={() => setOpen(false)}>Shop</NavLink>
          <NavLink to="/about" className={linkClass} onClick={() => setOpen(false)}>About</NavLink>
          <NavLink to="/contact" className={linkClass} onClick={() => setOpen(false)}>Contact</NavLink>
          <NavLink to="/admin/login" style={{ color: "var(--muted-2)" }} onClick={() => setOpen(false)}>Admin</NavLink>
          <a className="nav-wa" href={generalWaLink()} target="_blank" rel="noopener noreferrer">
            <WaIcon />Order on WhatsApp
          </a>
        </nav>
        <button className="nav-toggle" aria-label="Menu" onClick={() => setOpen(!open)}>☰</button>
      </div>
    </header>
  );
}
