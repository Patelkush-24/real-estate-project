import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, useAnimationControls } from "framer-motion";
import toast from "react-hot-toast";
import { FiUser, FiMail, FiLock, FiEye, FiEyeOff, FiArrowRight } from "react-icons/fi";
import { useAuth } from "../AuthContext";
import { apiErrors } from "../api";
import AuthShell from "../components/AuthShell";
import AuthInput from "../components/AuthInput";

// 0-3 score shown as a bar under the password box.
const strength = (p) => (p.length < 6 ? 0 : 1) + (p.length >= 8 && /\d/.test(p) ? 1 : 0) + (p.length >= 10 && /[A-Z]/.test(p) && /[^A-Za-z0-9]/.test(p) ? 1 : 0);
const LABELS = ["Too short", "Okay", "Good", "Strong"];
const COLORS = ["#b3402a", "#c58b2a", "#6f9a3c", "#2f7a55"];

export default function Register() {
  const { register } = useAuth();
  const nav = useNavigate();
  const shake = useAnimationControls();
  const [f, setF] = useState({ username: "", email: "", password: "", confirm: "" });
  const [err, setErr] = useState({});
  const [busy, setBusy] = useState(false);
  const [show, setShow] = useState(false);
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });
  const s = strength(f.password);

  const fail = (e) => { setErr(e); shake.start({ x: [0, -10, 10, -6, 6, 0], transition: { duration: 0.4 } }); };

  const submit = async (ev) => {
    ev.preventDefault();
    const e = {};
    if (f.username.trim().length < 3) e.username = "Username must be at least 3 characters.";
    if (!/^\S+@\S+\.\S+$/.test(f.email)) e.email = "Enter a valid email address.";
    if (f.password.length < 6) e.password = "Password must be at least 6 characters.";
    if (f.confirm !== f.password) e.confirm = "Passwords do not match.";
    if (Object.keys(e).length) return fail(e);
    setErr({});
    setBusy(true);
    try {
      await register({ username: f.username, email: f.email, password: f.password });
      toast.success("Account created");
      nav("/dashboard");
    } catch (x) { fail(apiErrors(x)); } finally { setBusy(false); }
  };

  return (
    <AuthShell
      title="Your next address starts here."
      subtitle="A free account lets you send enquiries and follow each one until it is closed."
      points={["Free, takes under a minute", "Enquire on any available property", "Your details stay with our team only"]}
    >
      <h1>Create account</h1>
      <p className="auth-sub">Join to send enquiries and track replies.</p>
      <motion.form animate={shake} onSubmit={submit} noValidate>
        <AuthInput icon={FiUser} label="Username" value={f.username} autoComplete="username" onChange={set("username")} error={err.username} />
        <AuthInput icon={FiMail} label="Email" type="email" value={f.email} autoComplete="email" onChange={set("email")} error={err.email} />
        <AuthInput
          icon={FiLock} label="Password" type={show ? "text" : "password"} value={f.password} autoComplete="new-password" onChange={set("password")} error={err.password}
          right={<button type="button" className="ai-eye" onClick={() => setShow(!show)} aria-label={show ? "Hide password" : "Show password"}>{show ? <FiEyeOff /> : <FiEye />}</button>}
        />
        {f.password && (
          <div className="meter" aria-live="polite">
            <div className="meter-bar"><motion.i animate={{ width: `${((s + 1) / 4) * 100}%`, background: COLORS[s] }} transition={{ duration: 0.3 }} /></div>
            <small style={{ color: COLORS[s] }}>{LABELS[s]}</small>
          </div>
        )}
        <AuthInput icon={FiLock} label="Confirm password" type={show ? "text" : "password"} value={f.confirm} autoComplete="new-password" onChange={set("confirm")} error={err.confirm} />
        {err._ && <p className="form-error">{err._}</p>}
        <button className="btn lg auth-submit" disabled={busy}>
          {busy ? <><span className="spin" /> Creating...</> : <>Create account <FiArrowRight /></>}
        </button>
      </motion.form>
      <p className="auth-foot">Already registered? <Link to="/login" className="link">Log in</Link></p>
    </AuthShell>
  );
}
