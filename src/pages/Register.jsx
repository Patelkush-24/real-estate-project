import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../AuthContext";
import { apiErrors } from "../api";
import Page from "../components/Page";
import Field from "../components/Field";

export default function Register() {
  const { register } = useAuth();
  const nav = useNavigate();
  const [f, setF] = useState({ username: "", email: "", password: "", confirm: "" });
  const [err, setErr] = useState({});
  const [busy, setBusy] = useState(false);
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  const submit = async (ev) => {
    ev.preventDefault();
    const e = {};
    if (f.username.trim().length < 3) e.username = "Username must be at least 3 characters.";
    if (!/^\S+@\S+\.\S+$/.test(f.email)) e.email = "Enter a valid email address.";
    if (f.password.length < 6) e.password = "Password must be at least 6 characters.";
    if (f.confirm !== f.password) e.confirm = "Passwords do not match.";
    setErr(e);
    if (Object.keys(e).length) return;
    setBusy(true);
    try {
      await register({ username: f.username, email: f.email, password: f.password });
      toast.success("Account created");
      nav("/dashboard");
    } catch (x) { setErr(apiErrors(x)); } finally { setBusy(false); }
  };

  return (
    <Page className="narrow">
      <h1 className="title">Create your account</h1>
      <form className="form" onSubmit={submit} noValidate>
        <Field label="Username" value={f.username} onChange={set("username")} error={err.username} />
        <Field label="Email" type="email" value={f.email} onChange={set("email")} error={err.email} />
        <Field label="Password" type="password" value={f.password} onChange={set("password")} error={err.password} />
        <Field label="Confirm password" type="password" value={f.confirm} onChange={set("confirm")} error={err.confirm} />
        {err._ && <p className="form-error">{err._}</p>}
        <button className="btn lg" disabled={busy}>{busy ? "Creating..." : "Create account"}</button>
        <p className="muted">Already registered? <Link to="/login" className="link">Log in</Link></p>
      </form>
    </Page>
  );
}
