import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FiTrash2 } from "react-icons/fi";
import api from "../api";
import Page from "../components/Page";

export default function AdminEnquiries() {
  const [rows, setRows] = useState([]);
  const load = () => api.get("/enquiries/").then((r) => setRows(r.data));
  useEffect(() => { load(); }, []);

  const setStatus = async (e, status) => {
    await api.patch(`/enquiries/${e.id}/`, { status });
    toast.success("Status updated");
    load();
  };
  const del = async (e) => {
    if (!window.confirm(`Delete the enquiry from ${e.name}?`)) return;
    await api.delete(`/enquiries/${e.id}/`);
    toast.success("Enquiry deleted");
    load();
  };

  return (
    <Page>
      <h1 className="title">Manage enquiries</h1>
      <div className="table-wrap">
        <table>
          <thead><tr><th>From</th><th>Property</th><th>Message</th><th>Date</th><th>Status</th><th /></tr></thead>
          <tbody>
            {rows.map((e) => (
              <tr key={e.id}>
                <td>{e.name}<br /><small className="muted">{e.phone}<br />{e.user_email}</small></td>
                <td>{e.property_title}</td>
                <td className="msg">{e.message}</td>
                <td>{new Date(e.created_at).toLocaleDateString("en-IN", { dateStyle: "medium" })}</td>
                <td>
                  <select className={`badge-select ${e.status}`} value={e.status} onChange={(ev) => setStatus(e, ev.target.value)}>
                    <option value="new">New</option><option value="contacted">Contacted</option><option value="closed">Closed</option>
                  </select>
                </td>
                <td><button className="icon-btn danger" onClick={() => del(e)} aria-label="Delete"><FiTrash2 /></button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {!rows.length && <p className="empty">No enquiries to review.</p>}
    </Page>
  );
}
