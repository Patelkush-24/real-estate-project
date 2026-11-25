import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import api, { apiErrors } from "../api";
import { useAuth } from "../AuthContext";
import Page from "../components/Page";
import Field from "../components/Field";

export default function Enquire() {
  const { id } = useParams();
  const { user } = useAuth();
  const nav = useNavigate();
  const [p, setP] = useState(null);
  const [f, setF] = useState({ name: user.username, phone: "", message: "" });
  const [err, setErr] = useState({});
  const [busy, setBusy] = useState(false);

  useEffect(() => { api.get(`/properties/${id}/`).then((r) => setP(r.data)).catch(() => nav("/properties")); }, [id, nav]);

  const validate = () => {
    const e = {};
    if (!f.name.trim()) e.name = "Enter your name.";
    if (!/^\+?\d{10,13}$/.test(f.phone)) e.phone = "Enter a valid phone number (10-13 digits).";
    if (f.message.trim().length < 10) e.message = "Message must be at least 10 characters.";
    return e;
  };

  const submit = async (ev) => {
    ev.preventDefault();
    const e = validate();
    setErr(e);
    if (Object.keys(e).length) return;
    setBusy(true);
    try {
      await api.post("/enquiries/", { ...f, property: id });
      toast.success("Enquiry sent. We will call you soon.");
      nav("/my-enquiries");
    } catch (x) { setErr(apiErrors(x)); } finally { setBusy(false); }
  };

  return (
    <Page className="narrow">
      <h1 className="title">Enquire about {p ? p.title : "this property"}</h1>
      <form className="form" onSubmit={submit} noValidate>
        <Field label="Your name" value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} error={err.name} />
        <Field label="Phone number" value={f.phone} inputMode="tel" placeholder="9876543210" onChange={(e) => setF({ ...f, phone: e.target.value })} error={err.phone} />
        <Field as="textarea" rows={5} label="Your question" placeholder="I would like to visit this weekend. Is the price negotiable?" value={f.message} onChange={(e) => setF({ ...f, message: e.target.value })} error={err.message} />
        {err._ && <p className="form-error">{err._}</p>}
        <button className="btn lg" disabled={busy}>{busy ? "Sending..." : "Send enquiry"}</button>
      </form>
    </Page>
  );
}
