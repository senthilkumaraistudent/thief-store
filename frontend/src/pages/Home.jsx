import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { publicApi } from "../api";
import ProductCard from "../components/ProductCard";
import logo from "../assets/logo.png";
import runner from "../assets/runner.png";

const CATEGORIES = ["T-Shirts", "Shirts", "Jeans", "Formal Pants"];
const CATEGORY_LETTER = { "T-Shirts": "T", Shirts: "S", Jeans: "J", "Formal Pants": "F" };
const START_PRICE = { "T-Shirts": "From ₹299", Shirts: "From ₹499", Jeans: "From ₹499", "Formal Pants": "From ₹499" };

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    publicApi.listProducts().then((data) => {
      const list = data.results || data;
      setProducts(list.slice(0, 4));
    }).finally(() => setLoading(false));
  }, []);

  return (
    <div className="view active">
      <section className="hero">
        <div className="hero-stage">
          <img className="hero-runner" src={runner} alt="" />
          <div className="hero-logo"><img src={logo} alt="THIEF STORE logo" /></div>
        </div>
        <div className="hero-eyebrow">MEN'S STREETWEAR · PAN INDIA DELIVERY</div>
        <h1>THIEF STORE</h1>
        <div className="tagline">STEAL THE SPOTLIGHT.</div>
        <p className="desc">
          Small-batch men's essentials — tees, shirts, jeans and formal pants — priced fair, made to
          move fast. Most drops are single pieces, so what you see is what's left.
        </p>
        <div className="hero-cta">
          <Link to="/shop" className="btn">THEFT NOW</Link>
        </div>
      </section>

      <section>
        <div className="section-head"><h2>Shop by Category</h2><p>Four essentials. No clutter.</p></div>
        <div className="cat-grid">
          {CATEGORIES.map((c) => (
            <Link key={c} to={`/shop?cat=${encodeURIComponent(c)}`} className="cat-card">
              <span className="cat-mark">{CATEGORY_LETTER[c]}</span>
              <span>{c}<small>{START_PRICE[c]}</small></span>
            </Link>
          ))}
        </div>
      </section>

      <section>
        <div className="section-head">
          <h2>Available Now</h2>
          <p>{loading ? "Loading..." : products.length ? "Currently in stock — one of each." : "New pieces dropping soon."}</p>
        </div>
        {!loading && (products.length
          ? <div className="product-grid">{products.map((p) => <ProductCard key={p.id} product={p} />)}</div>
          : <div className="empty-note">Nothing in stock right now — check back soon or message us on WhatsApp.</div>)}
      </section>

      <InfoStrip />
    </div>
  );
}

export function InfoStrip() {
  return (
    <div className="info-strip">
      <div className="item"><h4>ORDER VIA WHATSAPP</h4><p>Tap any product, confirm details, we take it from there.</p></div>
      <div className="item"><h4>FOLLOW US</h4><p>@thief_store_ on Instagram</p></div>
      <div className="item"><h4>DELIVERING TO</h4><p>All over India</p></div>
    </div>
  );
}
