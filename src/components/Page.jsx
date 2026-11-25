import { motion } from "framer-motion";

// Light route transition + consistent page width.
export default function Page({ children, className = "" }) {
  return (
    <motion.div
      className={`page ${className}`}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.22 }}
    >
      {children}
    </motion.div>
  );
}
