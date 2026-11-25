import { FiMail, FiPhone, FiMapPin } from "react-icons/fi";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-in">
        <div>
          <strong>Hearth &amp; Hall</strong>
          <p>Verified listings, honest pricing and a reply to every enquiry within a working day.</p>
        </div>
        <ul>
          <li><FiMail /> Kushp3685@gmail.com</li>
          <li><FiPhone /> +91 9904983139</li>
          <li><FiMapPin /> Near shastri ground, vallabh vidhyanagr, Anand, Gujarat, India </li>
        </ul>
      </div>
      <small>© {new Date().getFullYear()} Hearth &amp; Hall. Demo project.</small>
    </footer>
  );
}
