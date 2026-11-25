import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import api, { apiErrors } from "../api";
import Page from "../components/Page";
import Field from "../components/Field";

const blank = { title: "", location: "", price: "", size_sqft: "", property_type: "apartment", bedrooms: 0, bathrooms: 0, status: "available", image_url: "", description: "" };

// One form for both "Add Property" (C) and "Edit Property" (U).
export default function PropertyForm() {
  const { id } = useParams();
  const nav = useNavigate();
  const [f, setF] = useState(blank);
  const [err, setErr] = useState({});
  const [busy, setBusy] = useState(false);
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  useEffect(() => { if (id) api.get(`/properties/${id}/`).then((r) => setF(r.data)); }, [id]);

  const submit = async (ev) => {
    ev.preventDefault();
    const e = {};
    if (!f.title.trim()) e.title = "Enter a title.";
    if (!f.location.trim()) e.location = "Enter a location.";
    if (!(Number(f.price) > 0)) e.price = "Price must be greater than zero.";
    if (!(Number(f.size_sqft) > 0)) e.size_sqft = "Size must be greater than zero.";
    if (f.image_url && !/^https?:\/\//.test(f.image_url)) e.image_url = "Image link must start with http:// or https://";
    if (f.description.trim().length < 20) e.description = "Description must be at least 20 characters.";
    setErr(e);
    if (Object.keys(e).length) return;
    setBusy(true);
    try {
      id ? await api.put(`/properties/${id}/`, f) : await api.post("/properties/", f);
      toast.success(id ? "Property updated" : "Property added");
      nav("/admin/properties");
    } catch (x) { setErr(apiErrors(x)); } finally { setBusy(false); }
  };

  return (
    <Page className="narrow wide">
      <h1 className="title">{id ? "Edit property" : "Add property"}</h1>
      <form className="form two" onSubmit={submit} noValidate>
        <Field label="Title" value={f.title} onChange={set("title")} error={err.title} />
        <Field label="Location" value={f.location} onChange={set("location")} error={err.location} />
        <Field label="Price (₹)" type="number" value={f.price} onChange={set("price")} error={err.price} />
        <Field label="Size (sq ft)" type="number" value={f.size_sqft} onChange={set("size_sqft")} error={err.size_sqft} />
        <Field as="select" label="Type" value={f.property_type} onChange={set("property_type")}>
          <option value="apartment">Apartment</option><option value="villa">Villa</option><option value="plot">Plot</option><option value="commercial">Commercial</option>
        </Field>
        <Field as="select" label="Status" value={f.status} onChange={set("status")}>
          <option value="available">Available</option><option value="sold">Sold</option>
        </Field>
        <Field label="Bedrooms" type="number" min="0" value={f.bedrooms} onChange={set("bedrooms")} error={err.bedrooms} />
        <Field label="Bathrooms" type="number" min="0" value={f.bathrooms} onChange={set("bathrooms")} error={err.bathrooms} />
        <div className="full"><Field label="Image link" placeholder="https://..." value={f.image_url} onChange={set("image_url")} error={err.image_url} /></div>
        <div className="full"><Field as="textarea" rows={5} label="Description" value={f.description} onChange={set("description")} error={err.description} /></div>
        {err._ && <p className="form-error full">{err._}</p>}
        <div className="full"><button className="btn lg" disabled={busy}>{busy ? "Saving..." : id ? "Save changes" : "Add property"}</button></div>
      </form>
    </Page>
  );
}
