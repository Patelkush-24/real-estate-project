import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api";
import Page from "../components/Page";
import StatusBadge from "../components/StatusBadge";

export default function MyEnquiries() {
  const [rows, setRows] = useState(null);
  useEffect(() => { api.get("/enquiries/").then((r) => setRows(r.data)); }, []);

  return (
    <Page>
      <h1 className="title">My enquiries</h1>
      {rows && !rows.length && <p className="empty">You have not sent any enquiries yet. <Link to="/properties" className="link">Browse properties</Link></p>}
      <div className="list">
        {rows?.map((e) => (
          <article key={e.id} className="row-card">
            <div>
              <h3><Link to={`/properties/${e.property}`}>{e.property_title}</Link></h3>
              <p>{e.message}</p>
              <small className="muted">Sent {new Date(e.created_at).toLocaleDateString("en-IN", { dateStyle: "medium" })} · Phone {e.phone}</small>
            </div>
            <StatusBadge s={e.status} />
          </article>
        ))}
      </div>
    </Page>
  );
}
