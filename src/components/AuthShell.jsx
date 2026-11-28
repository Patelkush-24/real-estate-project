import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { FiCheckCircle } from "react-icons/fi";
import Page from "./Page";
import "../auth.css";

// Split screen: looping video + selling points on the left, the form card on the right.
export default function AuthShell({ title, subtitle, points = [], children }) {
  const v = useRef(null);
  useEffect(() => { if (v.current) { v.current.muted = true; v.current.play().catch(() => {}); } }, []);
  return (
    <Page className="flush">
      <div className="auth">
        <aside className="auth-side">
          <video ref={v} className="auth-video" src="/hero.mp4" poster="/hero-poster.jpg" autoPlay muted loop playsInline aria-hidden="true" />
          <div className="auth-shade" />
          <motion.div className="auth-copy" initial="hidden" animate="show" variants={{ show: { transition: { staggerChildren: 0.12, delayChildren: 0.2 } } }}>
            <motion.h2 variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}>{title}</motion.h2>
            <motion.p variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}>{subtitle}</motion.p>
            <ul>
              {points.map((p) => (
                <motion.li key={p} variants={{ hidden: { opacity: 0, x: -24 }, show: { opacity: 1, x: 0 } }}><FiCheckCircle /> {p}</motion.li>
              ))}
            </ul>
          </motion.div>
        </aside>
        <section className="auth-main">
          <motion.div className="auth-card" initial={{ opacity: 0, y: 30, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.5, ease: "easeOut" }}>
            {children}
          </motion.div>
        </section>
      </div>
    </Page>
  );
}
