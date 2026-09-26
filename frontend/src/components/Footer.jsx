import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer>
      <div className="foot-brand">THIEF STORE</div>
      <div>STEAL THE SPOTLIGHT.</div>
      <div className="foot-links">
        <Link to="/shop">Shop</Link>
        <Link to="/about">About</Link>
        <Link to="/contact">Contact</Link>
        <a href="https://instagram.com/thief_store_" target="_blank" rel="noopener noreferrer">Instagram</a>
      </div>
      <div>&copy; {new Date().getFullYear()} THIEF STORE · Delivering all over India</div>
    </footer>
  );
}
