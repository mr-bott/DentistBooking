import { useState, useEffect } from "react";
import "./header.css";
import { Link } from "react-router-dom";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const logout = () => {
    Cookies.remove("token"); // Remove token from cookies
    navigate("/login"); // Redirect to login
  };

  return (
    <header className={`header ${isScrolled ? "scrolled" : ""}`}>
      <Link to="/" className="logo-link">
        <div className="logo">
          <h1>OralVis HealthCare</h1>
        </div>
      </Link>

      <nav className="desktop-nav">
        <ul>
          <li>
            <Link to="/" className="logo-link">
              Home
            </Link>
          </li>
          <li>
            <Link to="/available/doctors" className="logo-link">
             Book Your Slot
            </Link>
          </li>
          <li>
            <Link to="/patient/appointments" className="logo-link">
              My Appointments
            </Link>
          </li>
          <li onClick={() => logout()}   className="logout-btn">LogOut</li>
        </ul>
      </nav>

      <button
        onClick={toggleMobileMenu}
        className="mobile-menu-button"
        aria-label="Toggle menu"
      >
        <div className={`bar top ${isMobileMenuOpen ? "open" : ""}`}></div>
        <div className={`bar middle ${isMobileMenuOpen ? "open" : ""}`}></div>
        <div className={`bar bottom ${isMobileMenuOpen ? "open" : ""}`}></div>
      </button>

      {isMobileMenuOpen && (
        <div className="mobile-menu">
          <ul>
          <li>
            <Link to="/" className="logo-link">
              Home
            </Link>
          </li>
          <li>
            <Link to="/available/doctors" className="logo-link">
             Book Your Slot
            </Link>
          </li>
          <li>
            <Link to="/patient/appointments" className="logo-link">
              My Appointments
            </Link>
          </li>
          <li onClick={() => logout()}   className="logout-btn">LogOut</li>
          </ul>
        </div>
      )}
    </header>
  );
};

export default Header;
