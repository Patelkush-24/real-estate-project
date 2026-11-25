import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { FiMapPin, FiArrowLeft, FiSend } from "react-icons/fi";
import { IoBedOutline, IoWaterOutline, IoResizeOutline, IoPricetagOutline } from "react-icons/io5";
import api, { inr } from "../api";
import Page from "../components/Page";

export default function PropertyDetail() {
  const { id } = useParams();
  const [p, setP] = useState(null);
  const [missing, setMissing] = useState(false);

  useEffect(() => { api.get(`/properties/${id}/`).then((r) => setP(r.data)).catch(() => setMissing(true)); }, [id]);

  if (missing) return <Page><p className="empty">This property is no longer listed. <Link to="/properties" className="link">Back to properties</Link></p></Page>;
  if (!p) return <Page><p className="muted">Loading...</p></Page>;

  return (
    <Page>
      <Link to="/properties" className="link"><FiArrowLeft /> All properties</Link>
      <div className="detail">
        <div className="detail-img">{p.image_url && <img src={p.image_url} alt={p.title} />}</div>
        <div className="detail-info">
          <span className={`tag inline ${p.status}`}>{p.status === "sold" ? "Sold" : p.property_type}</span>
          <h1>{p.title}</h1>
          <p className="muted"><FiMapPin /> {p.location}</p>
          <div className="big-price">{inr(p.price)}</div>
          <dl className="specs">
            <div><IoResizeOutline /><dt>Size</dt><dd>{p.size_sqft.toLocaleString("en-IN")} sq ft</dd></div>
            <div><IoPricetagOutline /><dt>Rate</dt><dd>{inr(p.price / p.size_sqft)} / sq ft</dd></div>
            {p.bedrooms > 0 && <div><IoBedOutline /><dt>Bedrooms</dt><dd>{p.bedrooms}</dd></div>}
            {p.bathrooms > 0 && <div><IoWaterOutline /><dt>Bathrooms</dt><dd>{p.bathrooms}</dd></div>}
          </dl>
          <h3>About this property</h3>
          <p>{p.description}</p>
          {p.status === "available" ? (
            <Link to={`/properties/${p.id}/enquire`} className="btn lg"><FiSend /> Send an enquiry</Link>
          ) : <p className="muted">This property has been sold.</p>}
        </div>
      </div>
    </Page>
  );
}
