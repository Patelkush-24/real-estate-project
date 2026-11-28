import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AnimatePresence, animate, motion, useInView, useScroll, useTransform } from "framer-motion";
import { FiSearch, FiShield, FiMessageCircle, FiKey, FiArrowRight, FiMapPin } from "react-icons/fi";
import api from "../api";
import { useAuth } from "../AuthContext";
import Page from "../components/Page";
import PropertyCard from "../components/PropertyCard";

const stagger = { show: { transition: { staggerChildren: 0.13, delayChildren: 0.15 } } };
const rise = { hidden: { opacity: 0, y: 28 }, show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } } };
const WORDS = ["home", "office", "plot", "villa", "studio"];

// Counts up from 0 when it scrolls into view.
function CountUp({ to }) {
  const ref = useRef(null);
  const seen = useInView(ref, { once: true });
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!seen) return;
    const c = animate(0, to, { duration: 1.4, ease: "easeOut", onUpdate: (v) => setN(Math.round(v)) });
    return () => c.stop();
  }, [seen, to]);
  return <span ref={ref}>{n}</span>;
}

// The word in the headline swaps every couple of seconds.
function WordSwap() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((x) => (x + 1) % WORDS.length), 2200);
    return () => clearInterval(t);
  }, []);
  return (
    <span className="swap">
      <AnimatePresence mode="wait">
        <motion.span key={WORDS[i]} initial={{ y: "70%", opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: "-70%", opacity: 0 }} transition={{ duration: 0.35 }}>
          {WORDS[i]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

export default function Home() {
  const { user } = useAuth();
  const [all, setAll] = useState([]);
  const [q, setQ] = useState("");
  const nav = useNavigate();
  const heroRef = useRef(null);
  const videoRef = useRef(null);

  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const textY = useTransform(scrollYProgress, [0, 1], [0, 90]);
  const fade = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  useEffect(() => { api.get("/properties/").then((r) => setAll(r.data)).catch(() => {}); }, []);
  useEffect(() => {
    const v = videoRef.current;
    if (v) { v.muted = true; v.play().catch(() => {}); }
  }, []);

  const go = (e) => { e.preventDefault(); nav(`/properties?q=${encodeURIComponent(q)}`); };
  const cities = [...new Set(all.map((p) => p.location.split(",").pop().trim()))];
  const types = [...new Set(all.map((p) => p.property_type))];
  const available = all.filter((p) => p.status === "available").length;
  const places = [...new Set(all.map((p) => p.location))];

  return (
    <Page className="flush">
      <section className="vhero" ref={heroRef}>
        <video ref={videoRef} className="vhero-video" src="/hero.mp4" poster="/hero-poster.jpg" autoPlay muted loop playsInline preload="auto" aria-hidden="true" />
        <div className="vhero-shade" />
        <motion.div className="vhero-in" style={{ y: textY, opacity: fade }} variants={stagger} initial="hidden" animate="show">
          <motion.span variants={rise} className="eyebrow">Verified listings · Open pricing</motion.span>
          <motion.h1 variants={rise}>Find the <WordSwap /> you will actually come home to.</motion.h1>
          <motion.p variants={rise}>Apartments, villas, plots and offices, each checked and open to a visit this week.</motion.p>
          <motion.form variants={rise} className="finder glass" onSubmit={go}>
            <FiSearch />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by city, area or property name" aria-label="Search properties" />
            <button className="btn">Search</button>
          </motion.form>
          <motion.div variants={rise} className="hero-links">
            <Link to="/properties" className="btn light">Browse all properties <FiArrowRight /></Link>
            {!user && <Link to="/register" className="btn ghost-light">Create account</Link>}
          </motion.div>
        </motion.div>
        <div className="scroll-cue" aria-hidden="true"><span /></div>
      </section>

      {all.length > 0 && (
        <section className="stats-strip">
          {[["Properties listed", all.length], ["Available now", available], ["Cities", cities.length], ["Property types", types.length]].map(([label, n], i) => (
            <motion.div key={label} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
              <b><CountUp to={n} /></b><span>{label}</span>
            </motion.div>
          ))}
        </section>
      )}

      {places.length > 0 && (
        <div className="marquee" aria-label="Areas we cover">
          <div className="marquee-track">
            {[...places, ...places].map((pl, i) => <span key={i}><FiMapPin /> {pl}</span>)}
          </div>
        </div>
      )}

      <section className="section">
        <motion.div className="section-head" initial={{ opacity: 0, x: -24 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
          <h2>Newly listed</h2>
          <Link to="/properties" className="link">View all properties</Link>
        </motion.div>
        <div className="grid">{all.slice(0, 6).map((p, i) => <PropertyCard key={p.id} p={p} index={i} />)}</div>
        {!all.length && <p className="muted">Listings will appear here once the backend is running. The first load can take up to a minute.</p>}
      </section>

      <section className="section steps">
        <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>How a visit gets booked</motion.h2>
        <ol>
          {[[FiSearch, "Search", "Filter by type, budget and bedrooms."], [FiMessageCircle, "Send an enquiry", "Tell us what you want to know about the property."], [FiKey, "Visit", "An agent calls you to fix a time and walk you through."]].map(([Icon, t, d], i) => (
            <motion.li key={t} initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-40px" }} transition={{ delay: i * 0.15, duration: 0.5 }}>
              <span className="step-no">{i + 1}</span>
              <Icon />
              <div><h3>{t}</h3><p>{d}</p></div>
            </motion.li>
          ))}
        </ol>
        <p className="muted"><FiShield /> Every listing is reviewed by an admin before it goes live.</p>
      </section>

      {!user && (
        <motion.section className="cta-band" initial={{ opacity: 0, scale: 0.97 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
          <div>
            <h2>Found something you like?</h2>
            <p>Create a free account and send your first enquiry in under a minute.</p>
          </div>
          <Link to="/register" className="btn light lg">Create account <FiArrowRight /></Link>
        </motion.section>
      )}
    </Page>
  );
}
