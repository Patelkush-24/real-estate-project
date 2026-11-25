import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FiInbox, FiSearch, FiClock } from "react-icons/fi";
import api from "../api";
import { useAuth } from "../AuthContext";
import Page from "../components/Page";
import StatusBadge from "../components/StatusBadge";

export default function Dashboard() {
  const { user } = useAuth();
  const [s, setS] = useState(null);
  const [rows, setRows] = useState([]);
  useEffect(() => {
    api.get("/stats/").then((r) => setS(r.data));
    api.get("/enquiries/").then((r) => setRows(r.data.slice(0, 4)));
  }, []);

  return (
    <Page>
      <h1 className="title">Hello, {user.username}</h1>
      <div className="stats">
        <div className="stat"><FiInbox /><b>{s?.enquiries ?? "-"}</b><span>Enquiries sent</span></div>
        <div className="stat"><FiClock /><b>{s?.open ?? "-"}</b><span>Awaiting a close</span></div>
        <Link to="/properties" className="stat action"><FiSearch /><b>Browse</b><span>Find your next property</span></Link>
      </div>
      <div className="section-head"><h2>Recent enquiries</h2><Link to="/my-enquiries" className="link">See all</Link></div>
      {!rows.length && <p className="empty">Nothing here yet. Open a property and send your first enquiry.</p>}
      <div className="list">
        {rows.map((e) => (
          <article key={e.id} className="row-card">
            <div><h3>{e.property_title}</h3><p className="muted">{e.message}</p></div>
            <StatusBadge s={e.status} />
          </article>
        ))}
      </div>
    </Page>
  );
}
