const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

function getAccessToken() {
  return localStorage.getItem("az_access_token");
}

async function request(path, { method = "GET", body, auth = false, isForm = false } = {}) {
  const headers = {};
  if (!isForm) headers["Content-Type"] = "application/json";
  if (auth) {
    const token = getAccessToken();
    if (token) headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers,
    body: isForm ? body : body ? JSON.stringify(body) : undefined,
  });

  if (res.status === 401) {
    localStorage.removeItem("az_access_token");
    localStorage.removeItem("az_refresh_token");
    throw new Error("Session expired — please log in again.");
  }

  if (!res.ok) {
    let msg = `Request failed (${res.status})`;
    try {
      const data = await res.json();
      msg = data.detail || JSON.stringify(data);
    } catch (_) {}
    throw new Error(msg);
  }
  if (res.status === 204) return null;
  return res.json();
}

/* ---------------- Public (no auth) ---------------- */
export const publicApi = {
  listProducts: (category) =>
    request(`/products/${category && category !== "All" ? `?category=${encodeURIComponent(category)}` : ""}`),
  getProduct: (id) => request(`/products/${id}/`),
};

/* ---------------- Auth ---------------- */
export const authApi = {
  login: async (username, password) => {
    const data = await request("/auth/login/", { method: "POST", body: { username, password } });
    localStorage.setItem("az_access_token", data.access);
    localStorage.setItem("az_refresh_token", data.refresh);
    return data;
  },
  logout: () => {
    localStorage.removeItem("az_access_token");
    localStorage.removeItem("az_refresh_token");
  },
  isAuthenticated: () => !!getAccessToken(),
};

/* ---------------- Admin (auth required) ---------------- */
export const adminApi = {
  listProducts: () => request("/admin/products/", { auth: true }),
  getProduct: (id) => request(`/admin/products/${id}/`, { auth: true }),
  createProduct: (data) => request("/admin/products/", { method: "POST", body: data, auth: true }),
  updateProduct: (id, data) =>
    request(`/admin/products/${id}/`, { method: "PATCH", body: data, auth: true }),
  deleteProduct: (id) => request(`/admin/products/${id}/`, { method: "DELETE", auth: true }),
  uploadImage: (id, file) => {
    const form = new FormData();
    form.append("image", file);
    return request(`/admin/products/${id}/images/`, { method: "POST", body: form, auth: true, isForm: true });
  },
  deleteImage: (id, imageId) =>
    request(`/admin/products/${id}/images/${imageId}/`, { method: "DELETE", auth: true }),
};
