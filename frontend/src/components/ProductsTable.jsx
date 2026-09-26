import { Link } from "react-router-dom";

const CATEGORY_LETTER = { "T-Shirts": "T", Shirts: "S", Jeans: "J", "Formal Pants": "F" };

export default function ProductsTable({ products, onToggleVisible, onToggleStock, onDelete }) {
  if (!products.length) return <div className="empty-note">No products yet.</div>;

  return (
    <div className="table-scroll">
      <table className="admin-table">
        <thead>
          <tr>
            <th></th><th>Code</th><th>Name</th><th>Category</th><th>Price</th>
            <th>Stock</th><th>Status</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => {
            const status = p.stock <= 0
              ? <span className="status-tag out">SOLD</span>
              : !p.visible
                ? <span className="status-tag hidden">HIDDEN</span>
                : <span className="status-tag live">LIVE</span>;
            const thumb = p.images && p.images.length ? p.images[0].image : null;
            return (
              <tr key={p.id}>
                <td>
                  {thumb ? (
                    <img className="row-thumb" src={thumb} alt="" />
                  ) : (
                    <div className="row-thumb" style={{
                      display: "flex", alignItems: "center", justifyContent: "center",
                      background: "#151412", color: "var(--gold-dim)",
                      fontFamily: "var(--font-display)", fontSize: 14,
                    }}>
                      {CATEGORY_LETTER[p.category] || "A"}
                    </div>
                  )}
                </td>
                <td>{p.product_code}</td>
                <td>{p.name}</td>
                <td>{p.category}</td>
                <td>₹{p.price}</td>
                <td>{p.stock}</td>
                <td>{status}</td>
                <td>
                  <div className="row-actions">
                    <Link className="icon-btn" to={`/admin/products/edit/${p.id}`}>Edit</Link>
                    <button className="icon-btn" onClick={() => onToggleVisible(p)}>
                      {p.visible ? "Hide" : "Show"}
                    </button>
                    <button className="icon-btn" onClick={() => onToggleStock(p)}>
                      {p.stock > 0 ? "Mark Sold (0)" : "Restock (1)"}
                    </button>
                    <button className="icon-btn danger" onClick={() => onDelete(p)}>Delete</button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
