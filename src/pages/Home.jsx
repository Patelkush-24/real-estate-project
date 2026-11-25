import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FiSearch, FiShield, FiMessageCircle, FiKey } from "react-icons/fi";
import api from "../api";
import Page from "../components/Page";
import PropertyCard from "../components/PropertyCard";

const stagger = { show: { transition: { staggerChildren: 0.12 } } };
const rise = { hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0, transition: { duration: 0.5 } } };

export default function Home() {
  const [items, setItems] = useState([]);
  const [q, setQ] = useState("");
  const nav = useNavigate();

  useEffect(() => { api.get("/properties/").then((r) => setItems(r.data.slice(0, 6))).catch(() => {}); }, []);

  const go = (e) => { e.preventDefault(); nav(`/properties?q=${encodeURIComponent(q)}`); };

  return (
    <Page>
      <section className="hero">
        <motion.div variants={stagger} initial="hidden" animate="show" className="hero-copy">
          <motion.h1 variants={rise}>Find the address you will actually come home to.</motion.h1>
          <motion.p variants={rise}>Apartments, villas, plots and offices - each listing checked, priced openly and open to a visit this week.</motion.p>
          <motion.form variants={rise} className="finder" onSubmit={go}>
            <FiSearch />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by city, area or property name" aria-label="Search properties" />
            <button className="btn">Search</button>
          </motion.form>
        </motion.div>
        <motion.div className="hero-art" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3, duration: 0.6 }}>
          {items.slice(0, 3).map((p, i) => (
            <img key={p.id} src={p.image_url} alt="" className={`stack s${i}`} />
          ))}
        </motion.div>
      </section>

      <section className="section">
        <div className="section-head">
          <h2>Newly listed</h2>
          <Link to="/properties" className="link">View all properties</Link>
        </div>
        <div className="grid">{items.map((p) => <PropertyCard key={p.id} p={p} />)}</div>
        {!items.length && <p className="muted">Listings will appear here once the backend is running.</p>}
      </section>

      <section className="section steps">
        <h2>How a visit gets booked</h2>
        <ol>
          <li><FiSearch /><div><h3>Search</h3><p>Filter by type, budget and bedrooms.</p></div></li>
          <li><FiMessageCircle /><div><h3>Send an enquiry</h3><p>Tell us what you want to know about the property.</p></div></li>
          <li><FiKey /><div><h3>Visit</h3><p>An agent calls you to fix a time and walk you through.</p></div></li>
        </ol>
        <p className="muted"><FiShield /> Every listing is reviewed by an admin before it goes live.</p>
      </section>
    </Page>
  );
}
