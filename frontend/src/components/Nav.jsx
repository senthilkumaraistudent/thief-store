import { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import logo from "../assets/logo.png";
import WaIcon from "./WaIcon";

const WHATSAPP_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER || "918122580147";

function generalWaLink() {
  const text = encodeURIComponent("Hi THIEF STORE 👋\n\nI'd like to know more about your collection.");
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${text}`;
}

export default function Nav() {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  // Automatically close mobile menu on route change
  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const linkClass = ({ isActive }) => (isActive ? "active" : undefined);

  return (
    <header className="site-nav">
      <div className="nav-inner">
        <NavLink to="/" className="nav-brand" onClick={() => setOpen(false)}>
          <img src={logo} alt="THIEF STORE logo" />
        </NavLink>

        <button
          type="button"
          className="nav-toggle"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen(!open)}
        >
          {open ? (
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          ) : (
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          )}
        </button>

        <nav className={`nav-links ${open ? "open" : ""}`}>
          <NavLink to="/" className={linkClass} onClick={() => setOpen(false)}>
            Home
          </NavLink>
          <NavLink to="/shop" className={linkClass} onClick={() => setOpen(false)}>
            Shop
          </NavLink>
          <NavLink to="/about" className={linkClass} onClick={() => setOpen(false)}>
            About
          </NavLink>
          <NavLink to="/contact" className={linkClass} onClick={() => setOpen(false)}>
            Contact
          </NavLink>
          <NavLink
            to="/admin/login"
            style={{ color: "var(--muted-2)" }}
            onClick={() => setOpen(false)}
          >
            Admin
          </NavLink>
          <a
            className="nav-wa"
            href={generalWaLink()}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setOpen(false)}
          >
            <WaIcon />
            Order on WhatsApp
          </a>
        </nav>
      </div>

      {/* Backdrop overlay inside header so it shares header stacking context */}
      {open && <div className="nav-backdrop" onClick={() => setOpen(false)} />}
    </header>
  );
}
