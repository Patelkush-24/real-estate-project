import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { IoBedOutline, IoWaterOutline, IoResizeOutline } from "react-icons/io5";
import { FiMapPin } from "react-icons/fi";
import { inrShort } from "../api";

export default function PropertyCard({ p }) {
  return (
    <motion.article className="card" layout whileHover={{ y: -4 }} transition={{ duration: 0.18 }}>
      <Link to={`/properties/${p.id}`} className="card-img">
        {p.image_url ? <img src={p.image_url} alt={p.title} loading="lazy" onError={(e) => (e.currentTarget.style.display = "none")} /> : null}
        <span className={`tag ${p.status}`}>{p.status === "sold" ? "Sold" : p.property_type}</span>
      </Link>
      <div className="card-body">
        <div className="price">{inrShort(p.price)}</div>
        <h3><Link to={`/properties/${p.id}`}>{p.title}</Link></h3>
        <p className="muted"><FiMapPin /> {p.location}</p>
        <div className="facts">
          {p.bedrooms > 0 && <span><IoBedOutline /> {p.bedrooms} bed</span>}
          {p.bathrooms > 0 && <span><IoWaterOutline /> {p.bathrooms} bath</span>}
          <span><IoResizeOutline /> {p.size_sqft.toLocaleString("en-IN")} sq ft</span>
        </div>
      </div>
    </motion.article>
  );
}
