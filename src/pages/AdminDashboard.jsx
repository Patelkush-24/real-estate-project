import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FiHome, FiInbox, FiUsers, FiPlus, FiList } from "react-icons/fi";
import api, { inrShort } from "../api";
import Page from "../components/Page";
import StatusBadge from "../components/StatusBadge";

export default function AdminDashboard() {
  const [s, setS] = useState(null);
  const [rows, setRows] = useState([]);
  useEffect(() => {
    api.get("/stats/").then((r) => setS(r.data));
    api.get("/enquiries/").then((r) => setRows(r.data.slice(0, 5)));
  }, []);

  return (
    <Page>
      <h1 className="title">Admin dashboard</h1>
      <div className="stats four">
        <div className="stat"><FiHome /><b>{s?.properties ?? "-"}</b><span>{s ? `${s.available} available` : "Properties"}</span></div>
        <div className="stat"><FiInbox /><b>{s?.enquiries ?? "-"}</b><span>{s ? `${s.new_enquiries} new` : "Enquiries"}</span></div>
        <div className="stat"><FiUsers /><b>{s?.users ?? "-"}</b><span>Registered users</span></div>
        <div className="stat"><FiList /><b>{s ? inrShort(s.portfolio_value) : "-"}</b><span>Value on the market</span></div>
      </div>
      <div className="actions">
        <Link to="/admin/properties/new" className="btn"><FiPlus /> Add property</Link>
        <Link to="/admin/properties" className="btn ghost">Manage properties</Link>
        <Link to="/admin/enquiries" className="btn ghost">Manage enquiries</Link>
        <a href="http://localhost:8000/admin/" target="_blank" rel="noreferrer" className="btn ghost">Django admin panel</a>
      </div>
      <h2>Latest enquiries</h2>
      {!rows.length && <p className="empty">No enquiries yet.</p>}
      <div className="list">
        {rows.map((e) => (
          <article key={e.id} className="row-card">
            <div><h3>{e.name} · {e.property_title}</h3><p className="muted">{e.message}</p></div>
            <StatusBadge s={e.status} />
          </article>
        ))}
      </div>
    </Page>
  );
}
