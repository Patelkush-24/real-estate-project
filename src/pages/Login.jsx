import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, useAnimationControls } from "framer-motion";
import toast from "react-hot-toast";
import { FiUser, FiLock, FiEye, FiEyeOff, FiArrowRight } from "react-icons/fi";
import { useAuth } from "../AuthContext";
import { apiErrors } from "../api";
import AuthShell from "../components/AuthShell";
import AuthInput from "../components/AuthInput";

export default function Login() {
  const { login } = useAuth();
  const nav = useNavigate();
  const from = useLocation().state?.from;
  const shake = useAnimationControls();
  const [f, setF] = useState({ username: "", password: "" });
  const [err, setErr] = useState({});
  const [busy, setBusy] = useState(false);
  const [show, setShow] = useState(false);

  const fail = (e) => { setErr(e); shake.start({ x: [0, -10, 10, -6, 6, 0], transition: { duration: 0.4 } }); };

  const submit = async (ev) => {
    ev.preventDefault();
    const e = {};
    if (!f.username.trim()) e.username = "Enter your username.";
    if (!f.password) e.password = "Enter your password.";
    if (Object.keys(e).length) return fail(e);
    setErr({});
    setBusy(true);
    try {
      const u = await login(f);
      toast.success(`Welcome back, ${u.username}`);
      nav(from || (u.is_staff ? "/admin" : "/dashboard"), { replace: true });
    } catch (x) { fail(apiErrors(x)); } finally { setBusy(false); }
  };

  return (
    <AuthShell
      title="Welcome back."
      subtitle="Log in to track your enquiries and pick up where you left off."
      points={["See every enquiry and its status", "Save time with details pre-filled", "Get a call back within a working day"]}
    >
      <h1>Log in</h1>
      <p className="auth-sub">Enter your details to continue.</p>
      <motion.form animate={shake} onSubmit={submit} noValidate>
        <AuthInput icon={FiUser} label="Username" value={f.username} autoComplete="username" placeholder="your username" onChange={(e) => setF({ ...f, username: e.target.value })} error={err.username} />
        <AuthInput
          icon={FiLock} label="Password" type={show ? "text" : "password"} value={f.password} autoComplete="current-password" placeholder="your password"
          onChange={(e) => setF({ ...f, password: e.target.value })} error={err.password}
          right={<button type="button" className="ai-eye" onClick={() => setShow(!show)} aria-label={show ? "Hide password" : "Show password"}>{show ? <FiEyeOff /> : <FiEye />}</button>}
        />
        {err._ && <p className="form-error">{err._}</p>}
        <button className="btn lg auth-submit" disabled={busy}>
          {busy ? <><span className="spin" /> Logging in...</> : <>Log in <FiArrowRight /></>}
        </button>
      </motion.form>
      <div className="auth-or"><span>or</span></div>
      <button type="button" className="btn ghost auth-demo" onClick={() => { setF({ username: "demo", password: "demo123" }); setErr({}); }}>
        Fill in the demo account
      </button>
      <p className="auth-foot">New here? <Link to="/register" className="link">Create an account</Link></p>
    </AuthShell>
  );
}
