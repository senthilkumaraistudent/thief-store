import { Link } from "react-router-dom";

const CATEGORY_LETTER = { "T-Shirts": "T", Shirts: "S", Jeans: "J", "Formal Pants": "F" };

export default function ProductCard({ product }) {
  const soldOut = product.stock <= 0;
  const mainImage = product.images && product.images.length ? product.images[0].image : null;

  return (
    <Link to={`/product/${product.id}`} className="product-card">
      <div className="product-thumb">
        {mainImage ? (
          <img src={mainImage} alt={product.name} />
        ) : (
          <div className="ph-placeholder">
            <span className="ph-letter">{CATEGORY_LETTER[product.category] || "A"}</span>
            <small>{product.category?.toUpperCase()}</small>
          </div>
        )}
        {soldOut && <span className="badge sold">SOLD OUT</span>}
      </div>
      <div className="product-info">
        <div className="p-code">{product.product_code}</div>
        <div className="p-name">{product.name}</div>
        <div className="p-meta">
          {product.fit} · Size {product.size}
          {product.fabric ? ` · ${product.fabric}` : ""}
        </div>
        <div className="p-price">₹{product.price}</div>
      </div>
    </Link>
  );
}
