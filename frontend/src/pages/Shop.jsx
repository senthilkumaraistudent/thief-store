import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { publicApi } from "../api";
import ProductCard from "../components/ProductCard";
import { InfoStrip } from "./Home";
import runner from "../assets/runner.png";

const CATEGORIES = ["All", "T-Shirts", "Shirts", "Jeans", "Formal Pants"];

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeCategory = searchParams.get("cat") || "All";
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    publicApi.listProducts(activeCategory).then((data) => {
      setProducts(data.results || data);
    }).finally(() => setLoading(false));
  }, [activeCategory]);

  return (
    <div className="view active">
      <section style={{ paddingTop: 40 }}>
        <div className="section-head">
          <h2>Shop</h2>
          <p>
            {loading
              ? "Loading..."
              : `${products.length} piece${products.length === 1 ? "" : "s"} available`}
          </p>
        </div>

        <div className="filter-row">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              className={`filter-btn ${c === activeCategory ? "active" : ""}`}
              onClick={() => setSearchParams(c === "All" ? {} : { cat: c })}
            >
              {c}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="thief-loader">
            <img src={runner} alt="Loading" />
            <span>Loading...</span>
          </div>
        ) : (
          products.length ? (
            <div className="product-grid">
              {products.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          ) : (
            <div className="empty-note">
              No products here yet. Try another category or check back soon.
            </div>
          )
        )}
      </section>

      <InfoStrip />
    </div>
  );
}