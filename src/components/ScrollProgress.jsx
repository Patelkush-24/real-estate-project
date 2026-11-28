import { motion, useScroll, useSpring } from "framer-motion";

// Thin brass bar at the very top that fills as the visitor scrolls.
export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 24, mass: 0.3 });
  return <motion.div className="progress" style={{ scaleX }} />;
}
