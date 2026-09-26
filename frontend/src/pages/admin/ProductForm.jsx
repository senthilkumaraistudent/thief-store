import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { adminApi } from "../../api";
import AdminTopbar from "../../components/AdminTopbar";

const CATEGORIES = ["T-Shirts", "Shirts", "Jeans", "Formal Pants"];

const emptyForm = {
  product_code: "", name: "", category: "T-Shirts", price: "",
  fabric: "", gsm: "", fit: "", size: "", description: "",
  stock: 1, visible: true,
};

export default function ProductForm() {
  const { id } = useParams(); // undefined when adding a new product
  const navigate = useNavigate();
  const [form, setForm] = useState(emptyForm);
  const [productId, setProductId] = useState(id || null);
  const [images, setImages] = useState([]);
  const [err, setErr] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (id) {
      adminApi.getProduct(id).then((p) => {
        setForm({
          product_code: p.product_code, name: p.name, category: p.category, price: p.price,
          fabric: p.fabric, gsm: p.gsm, fit: p.fit, size: p.size, description: p.description,
          stock: p.stock, visible: p.visible,
        });
        setImages(p.images || []);
      });
    }
  }, [id]);

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSave() {
    setErr("");
    if (!form.product_code.trim() || !form.name.trim() || form.price === "" || form.stock === "") {
      setErr("Please fill in product code, name, price and stock.");
      return;
    }
    setSaving(true);
    try {
      const payload = { ...form, price: parseFloat(form.price), stock: parseInt(form.stock, 10) };
      if (productId) {
        await adminApi.updateProduct(productId, payload);
      } else {
        const created = await adminApi.createProduct(payload);
        setProductId(created.id);
        navigate(`/admin/products/edit/${created.id}`, { replace: true });
      }
    } catch (e) {
      setErr(e.message || "Could not save product.");
    } finally {
      setSaving(false);
    }
  }

  async function handleUpload(e) {
    const files = [...e.target.files];
    for (const file of files) {
      const img = await adminApi.uploadImage(productId, file);
      setImages((prev) => [...prev, img]);
    }
    e.target.value = "";
  }

  async function handleRemoveImage(imgId) {
    await adminApi.deleteImage(productId, imgId);
    setImages((prev) => prev.filter((i) => i.id !== imgId));
  }

  return (
    <div className="view active"><div className="admin-shell">
      <AdminTopbar active="products" />
      <Link to="/admin/products" className="back-link">&larr; Back to products</Link>
      <div className="section-head" style={{ textAlign: "left" }}>
        <h2 style={{ fontSize: 22 }}>{id ? "Edit Product" : "Add Product"}</h2>
      </div>

      <div className="admin-form">
        <div className="field">
          <label>Product Photos</label>
          <div className="img-upload-row">
            {images.map((img) => (
              <div className="thumb" key={img.id}>
                <img src={img.image} alt="" />
                <button className="rm" onClick={() => handleRemoveImage(img.id)}>×</button>
              </div>
            ))}
            <label className="upload-btn" style={{ opacity: productId ? 1 : 0.4 }}>
              +
              <input type="file" accept="image/*" multiple disabled={!productId}
                onChange={handleUpload} style={{ display: "none" }} />
            </label>
          </div>
          {!productId && <p style={{ fontSize: 11.5, color: "var(--muted-2)" }}>Save the product once first, then add photos.</p>}
        </div>

        <div className="form-grid2">
          <div className="field"><label>Product Code</label>
            <input value={form.product_code} onChange={(e) => update("product_code", e.target.value)} placeholder="e.g. TS004" />
          </div>
          <div className="field"><label>Category</label>
            <select value={form.category} onChange={(e) => update("category", e.target.value)}>
              {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>
        </div>

        <div className="field"><label>Product Name</label>
          <input value={form.name} onChange={(e) => update("name", e.target.value)} placeholder="e.g. Black Printed Oversized T-Shirt" />
        </div>

        <div className="form-grid2">
          <div className="field"><label>Price (₹)</label>
            <input type="number" min="0" value={form.price} onChange={(e) => update("price", e.target.value)} />
          </div>
          <div className="field"><label>Stock Quantity</label>
            <input type="number" min="0" value={form.stock} onChange={(e) => update("stock", e.target.value)} />
          </div>
        </div>

        <div className="form-grid2">
          <div className="field"><label>Fabric</label>
            <input value={form.fabric} onChange={(e) => update("fabric", e.target.value)} placeholder="e.g. Cotton" />
          </div>
          <div className="field"><label>GSM (optional)</label>
            <input value={form.gsm} onChange={(e) => update("gsm", e.target.value)} placeholder="e.g. 200" />
          </div>
        </div>

        <div className="form-grid2">
          <div className="field"><label>Fit</label>
            <input value={form.fit} onChange={(e) => update("fit", e.target.value)} placeholder="e.g. Oversized" />
          </div>
          <div className="field"><label>Size</label>
            <input value={form.size} onChange={(e) => update("size", e.target.value)} placeholder="e.g. L" />
          </div>
        </div>

        <div className="field"><label>Description</label>
          <textarea value={form.description} onChange={(e) => update("description", e.target.value)} placeholder="Short honest description..." />
        </div>

        <div className="field check">
          <input type="checkbox" id="f_visible" checked={form.visible} onChange={(e) => update("visible", e.target.checked)} />
          <label htmlFor="f_visible" style={{ margin: 0 }}>Visible on public shop</label>
        </div>

        <div className="err-msg">{err}</div>
        <div className="form-actions">
          <button className="btn" onClick={handleSave} disabled={saving}>
            {saving ? "Saving..." : id ? "Save Changes" : "Add Product"}
          </button>
          <Link to="/admin/products" className="btn ghost">Cancel</Link>
        </div>
      </div>
    </div></div>
  );
}
