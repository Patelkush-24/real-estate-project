import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { useAuth } from "./AuthContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Properties from "./pages/Properties";
import PropertyDetail from "./pages/PropertyDetail";
import Enquire from "./pages/Enquire";
import MyEnquiries from "./pages/MyEnquiries";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/AdminDashboard";
import AdminProperties from "./pages/AdminProperties";
import PropertyForm from "./pages/PropertyForm";
import AdminEnquiries from "./pages/AdminEnquiries";

function Guard({ admin, children }) {
  const { user } = useAuth();
  const loc = useLocation();
  if (!user) return <Navigate to="/login" state={{ from: loc.pathname }} replace />;
  if (admin && !user.is_staff) return <Navigate to="/dashboard" replace />;
  return children;
}

export default function App() {
  const loc = useLocation();
  return (
    <>
      <Navbar />
      <main>
        <AnimatePresence mode="wait">
          <Routes location={loc} key={loc.pathname}>
            <Route path="/" element={<Home />} />
            <Route path="/properties" element={<Properties />} />
            <Route path="/properties/:id" element={<PropertyDetail />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/properties/:id/enquire" element={<Guard><Enquire /></Guard>} />
            <Route path="/my-enquiries" element={<Guard><MyEnquiries /></Guard>} />
            <Route path="/dashboard" element={<Guard><Dashboard /></Guard>} />
            <Route path="/admin" element={<Guard admin><AdminDashboard /></Guard>} />
            <Route path="/admin/properties" element={<Guard admin><AdminProperties /></Guard>} />
            <Route path="/admin/properties/new" element={<Guard admin><PropertyForm /></Guard>} />
            <Route path="/admin/properties/:id/edit" element={<Guard admin><PropertyForm /></Guard>} />
            <Route path="/admin/enquiries" element={<Guard admin><AdminEnquiries /></Guard>} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AnimatePresence>
      </main>
      <Footer />
    </>
  );
}
