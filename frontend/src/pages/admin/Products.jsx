import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { adminApi } from "../../api";
import AdminTopbar from "../../components/AdminTopbar";
import ProductsTable from "../../components/ProductsTable";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  function refresh() {
    setLoading(true);
    adminApi.listProducts().then((data) => setProducts(data.results || data)).finally(() => setLoading(false));
  }
  useEffect(refresh, []);

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
      <AdminTopbar active="products" />
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18, flexWrap: "wrap", gap: 10 }}>
        <p style={{ color: "var(--muted)", margin: 0, fontSize: 13 }}>
          {loading ? "Loading..." : `${products.length} product${products.length === 1 ? "" : "s"} total`}
        </p>
        <Link to="/admin/products/add" className="btn sm">+ ADD PRODUCT</Link>
      </div>
      {!loading && (
        <ProductsTable
          products={products}
          onToggleVisible={toggleVisible}
          onToggleStock={toggleStock}
          onDelete={deleteProduct}
        />
      )}
    </div></div>
  );
}
