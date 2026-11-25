import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { FiEdit2, FiPlus, FiTrash2 } from "react-icons/fi";
import api, { inrShort } from "../api";
import Page from "../components/Page";

export default function AdminProperties() {
  const [rows, setRows] = useState([]);
  const load = () => api.get("/properties/").then((r) => setRows(r.data));
  useEffect(() => { load(); }, []);

  const del = async (p) => {
    if (!window.confirm(`Delete "${p.title}"? Its enquiries will be deleted too.`)) return;
    await api.delete(`/properties/${p.id}/`);
    toast.success("Property deleted");
    load();
  };

  return (
    <Page>
      <div className="section-head">
        <h1 className="title">Manage properties</h1>
        <Link to="/admin/properties/new" className="btn"><FiPlus /> Add property</Link>
      </div>
      <div className="table-wrap">
        <table>
          <thead><tr><th>Title</th><th>Location</th><th>Type</th><th>Price</th><th>Status</th><th /></tr></thead>
          <tbody>
            {rows.map((p) => (
              <tr key={p.id}>
                <td><Link to={`/properties/${p.id}`}>{p.title}</Link></td>
                <td>{p.location}</td><td>{p.property_type}</td><td>{inrShort(p.price)}</td>
                <td><span className={`badge ${p.status}`}>{p.status}</span></td>
                <td className="ops">
                  <Link to={`/admin/properties/${p.id}/edit`} className="icon-btn" aria-label="Edit"><FiEdit2 /></Link>
                  <button className="icon-btn danger" onClick={() => del(p)} aria-label="Delete"><FiTrash2 /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {!rows.length && <p className="empty">No properties yet. Add the first one.</p>}
    </Page>
  );
}
