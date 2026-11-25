import axios from "axios";

const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000/api" });

api.interceptors.request.use((cfg) => {
  const token = localStorage.getItem("token");
  if (token) cfg.headers.Authorization = `Token ${token}`;
  return cfg;
});

export const inr = (n) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);

// Short form: 3.85 Cr / 58 L
export const inrShort = (n) => {
  n = Number(n);
  if (n >= 1e7) return `₹${(n / 1e7).toFixed(2).replace(/\.?0+$/, "")} Cr`;
  if (n >= 1e5) return `₹${(n / 1e5).toFixed(1).replace(/\.0$/, "")} L`;
  return inr(n);
};

// Turns a DRF error response into { field: message } plus a general message.
export const apiErrors = (err) => {
  const d = err.response?.data;
  if (!d || typeof d !== "object") return { _: "Something went wrong. Please try again." };
  const out = {};
  Object.entries(d).forEach(([k, v]) => (out[k === "detail" || k === "non_field_errors" ? "_" : k] = [].concat(v)[0]));
  return out;
};

export default api;
