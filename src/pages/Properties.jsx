import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { FiSearch } from "react-icons/fi";
import api from "../api";
import Page from "../components/Page";
import PropertyCard from "../components/PropertyCard";

export default function Properties() {
  const [sp] = useSearchParams();
  const [f, setF] = useState({ q: sp.get("q") || "", type: "", max_price: "", bedrooms: "", ordering: "-created_at" });
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  useEffect(() => {
    const t = setTimeout(() => {
      setLoading(true);
      const params = Object.fromEntries(Object.entries(f).filter(([, v]) => v));
      api.get("/properties/", { params }).then((r) => setItems(r.data)).finally(() => setLoading(false));
    }, 250);
    return () => clearTimeout(t);
  }, [f]);

  return (
    <Page>
      <h1 className="title">Properties</h1>
      <div className="filters">
        <div className="search"><FiSearch /><input placeholder="Search city, area or name" value={f.q} onChange={set("q")} /></div>
        <select value={f.type} onChange={set("type")}>
          <option value="">All types</option><option value="apartment">Apartment</option><option value="villa">Villa</option>
          <option value="plot">Plot</option><option value="commercial">Commercial</option>
        </select>
        <select value={f.max_price} onChange={set("max_price")}>
          <option value="">Any budget</option><option value="5000000">Up to ₹50 L</option><option value="15000000">Up to ₹1.5 Cr</option>
          <option value="30000000">Up to ₹3 Cr</option><option value="50000000">Up to ₹5 Cr</option>
        </select>
        <select value={f.bedrooms} onChange={set("bedrooms")}>
          <option value="">Any bedrooms</option><option value="1">1+</option><option value="2">2+</option><option value="3">3+</option><option value="4">4+</option>
        </select>
        <select value={f.ordering} onChange={set("ordering")}>
          <option value="-created_at">Newest</option><option value="price">Price: low to high</option>
          <option value="-price">Price: high to low</option><option value="-size_sqft">Largest</option>
        </select>
      </div>
      <p className="muted">{loading ? "Searching..." : `${items.length} propert${items.length === 1 ? "y" : "ies"} found`}</p>
      <div className="grid"><AnimatePresence>{items.map((p) => <PropertyCard key={p.id} p={p} />)}</AnimatePresence></div>
      {!loading && !items.length && <p className="empty">No properties match these filters. Try a wider budget or clear the search.</p>}
    </Page>
  );
}
