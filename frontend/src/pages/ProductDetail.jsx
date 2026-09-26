import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { publicApi } from "../api";
import WaIcon from "../components/WaIcon";

const WHATSAPP_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER || "918122580147";

function buildWaLink(product) {
  const lines = [
    "Hi THIEF STORE 👋", "",
    "I want to order:", "",
    `Product: ${product.name}`,
    `Product Code: ${product.product_code}`,
    `Price: ₹${product.price}`,
    `Size: ${product.size}`, "",
    "Please confirm availability and order details.",
  ];
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(lines.join("\n"))}`;
}

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [activeImg, setActiveImg] = useState(0);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    setProduct(null);
    setNotFound(false);
    publicApi.getProduct(id).catch(() => setNotFound(true)).then((p) => p && setProduct(p));
  }, [id]);

  if (notFound) {
    return (
      <div className="view active"><div className="simple-page" style={{ textAlign: "center" }}>
        <h1>Page not found</h1><p>That page doesn't exist.</p>
        <Link to="/" className="btn">Back home</Link>
      </div></div>
    );
  }
  if (!product) return null;

  const soldOut = product.stock <= 0;
  const images = product.images && product.images.length ? product.images : [];

  return (
    <div className="view active">
      <div className="wrap" style={{ paddingTop: 22 }}>
        <Link to="/shop" className="back-link">&larr; Back to shop</Link>
      </div>
      <div className="pd-wrap">
        <div className="pd-gallery">
          <div className="pd-main">
            {images.length ? (
              <img src={images[activeImg].image} alt={product.name} />
            ) : (
              <div className="ph-placeholder" style={{ width: "100%", height: "100%" }}>
                <span className="ph-letter">{product.category?.[0]}</span>
                <small>{product.category?.toUpperCase()}</small>
              </div>
            )}
          </div>
          {images.length > 1 && (
            <div className="pd-thumbs">
              {images.map((img, i) => (
                <img
                  key={img.id}
                  src={img.image}
                  className={i === activeImg ? "active" : ""}
                  onClick={() => setActiveImg(i)}
                  alt=""
                />
              ))}
            </div>
          )}
        </div>
        <div className="pd-info">
          <div className="p-code">{product.product_code}</div>
          <h1>{product.name}</h1>
          <div className="pd-price">₹{product.price}</div>
          <span className={`stock-pill ${soldOut ? "out" : ""}`}>
            {soldOut ? "SOLD OUT" : "IN STOCK · 1 PIECE"}
          </span>
          <div className="pd-specs">
            <div className="row"><span>Category</span><span>{product.category}</span></div>
            {product.fabric && <div className="row"><span>Fabric</span><span>{product.fabric}</span></div>}
            {product.gsm && <div className="row"><span>GSM</span><span>{product.gsm}</span></div>}
            <div className="row"><span>Fit</span><span>{product.fit}</span></div>
            <div className="row"><span>Size</span><span>{product.size}</span></div>
          </div>
          {product.description && <p className="pd-desc">{product.description}</p>}
          {soldOut ? (
            <button className="btn block" disabled style={{ opacity: 0.4, cursor: "not-allowed" }}>
              SOLD OUT
            </button>
          ) : (
            <a className="btn wa block" target="_blank" rel="noopener noreferrer" href={buildWaLink(product)}>
              <WaIcon />ORDER ON WHATSAPP
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
