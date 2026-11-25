import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../AuthContext";
import { apiErrors } from "../api";
import Page from "../components/Page";
import Field from "../components/Field";

export default function Login() {
  const { login } = useAuth();
  const nav = useNavigate();
  const from = useLocation().state?.from;
  const [f, setF] = useState({ username: "", password: "" });
  const [err, setErr] = useState({});
  const [busy, setBusy] = useState(false);

  const submit = async (ev) => {
    ev.preventDefault();
    const e = {};
    if (!f.username.trim()) e.username = "Enter your username.";
    if (!f.password) e.password = "Enter your password.";
    setErr(e);
    if (Object.keys(e).length) return;
    setBusy(true);
    try {
      const u = await login(f);
      toast.success(`Welcome back, ${u.username}`);
      nav(from || (u.is_staff ? "/admin" : "/dashboard"), { replace: true });
    } catch (x) { setErr(apiErrors(x)); } finally { setBusy(false); }
  };

  return (
    <Page className="narrow">
      <h1 className="title">Log in</h1>
      <form className="form" onSubmit={submit} noValidate>
        <Field label="Username" value={f.username} autoComplete="username" onChange={(e) => setF({ ...f, username: e.target.value })} error={err.username} />
        <Field label="Password" type="password" value={f.password} autoComplete="current-password" onChange={(e) => setF({ ...f, password: e.target.value })} error={err.password} />
        {err._ && <p className="form-error">{err._}</p>}
        <button className="btn lg" disabled={busy}>{busy ? "Logging in..." : "Log in"}</button>
        <p className="muted">New here? <Link to="/register" className="link">Create an account</Link></p>
        <p className="muted small">Demo: demo / demo123 · Admin: admin / admin123</p>
      </form>
    </Page>
  );
}
