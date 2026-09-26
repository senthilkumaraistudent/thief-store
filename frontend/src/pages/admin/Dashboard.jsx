import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { adminApi } from "../../api";
import AdminTopbar from "../../components/AdminTopbar";
import ProductsTable from "../../components/ProductsTable";

export default function Dashboard() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  function refresh() {
    setLoading(true);
    adminApi.listProducts().then((data) => setProducts(data.results || data)).finally(() => setLoading(false));
  }
  useEffect(refresh, []);

  const available = products.filter((p) => p.stock > 0 && p.visible).length;
  const sold = products.filter((p) => p.stock <= 0).length;
  const hidden = products.filter((p) => !p.visible).length;

  async function toggleVisible(p) {
    await adminApi.updateProduct(p.id, { visible: !p.visible });
    refresh();
  }
  async function toggleStock(p) {
    if (p.stock > 0) {
      if (!window.confirm(`Mark "${p.name}" as sold? This sets stock to 0 and removes it from the public shop. Only do this after you've confirmed payment.`)) return;
      await adminApi.updateProduct(p.id, { stock: 0 });
    } else {
      await adminApi.updateProduct(p.id, { stock: 1 });
    }
    refresh();
  }
  async function deleteProduct(p) {
    if (!window.confirm(`Delete "${p.name}"? This can't be undone.`)) return;
    await adminApi.deleteProduct(p.id);
    refresh();
  }

  return (
    <div className="view active"><div className="admin-shell">
      <AdminTopbar active="dashboard" />
      <div className="stat-grid">
        <div className="stat-card"><div className="num">{products.length}</div><div className="lbl">TOTAL PRODUCTS</div></div>
        <div className="stat-card"><div className="num">{available}</div><div className="lbl">AVAILABLE</div></div>
        <div className="stat-card"><div className="num">{sold}</div><div className="lbl">SOLD (STOCK 0)</div></div>
        <div className="stat-card"><div className="num">{hidden}</div><div className="lbl">HIDDEN</div></div>
      </div>
      <Link to="/admin/products/add" className="btn">+ ADD PRODUCT</Link>
      <div style={{ marginTop: 34 }}>
        <div className="section-head" style={{ textAlign: "left", marginBottom: 16 }}>
          <h2 style={{ fontSize: 20 }}>Recent products</h2>
        </div>
        {!loading && (
          <ProductsTable
            products={products.slice(0, 5)}
            onToggleVisible={toggleVisible}
            onToggleStock={toggleStock}
            onDelete={deleteProduct}
          />
        )}
      </div>
    </div></div>
  );
}
