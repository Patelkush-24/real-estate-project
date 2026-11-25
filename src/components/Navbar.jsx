import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { FiHome, FiLogOut, FiMenu, FiX, FiGrid } from "react-icons/fi";
import { useAuth } from "../AuthContext";
import toast from "react-hot-toast";

export default function Navbar() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const nav = useNavigate();
  const close = () => setOpen(false);

  const out = async () => {
    await logout();
    toast.success("Logged out");
    close();
    nav("/");
  };

  return (
    <header className="nav">
      <div className="nav-in">
        <Link to="/" className="brand" onClick={close}><FiHome /> Hearth &amp; Hall</Link>
        <button className="icon-btn menu" onClick={() => setOpen(!open)} aria-label="Toggle menu">
          {open ? <FiX /> : <FiMenu />}
        </button>
        <nav className={`links ${open ? "open" : ""}`} onClick={close}>
          <NavLink to="/properties">Properties</NavLink>
          {user && !user.is_staff && <NavLink to="/my-enquiries">My enquiries</NavLink>}
          {user && <NavLink to={user.is_staff ? "/admin" : "/dashboard"}><FiGrid /> Dashboard</NavLink>}
          {user ? (
            <button className="btn ghost" onClick={out}><FiLogOut /> Log out</button>
          ) : (
            <>
              <NavLink to="/login">Log in</NavLink>
              <Link to="/register" className="btn">Create account</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
