import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./notfound.css";

const NotFound = () => {
  const [countdown, setCountdown] = useState(7);
  const navigate = useNavigate();

  useEffect(() => {
    if (countdown <= 0) {
      navigate("/");
      return;
    }

    const timer = setTimeout(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [countdown]);

  const goHome = () => navigate("/");

  return (
    <div className="notfound-container">
      <div className="notfound-box">
        <div className="decorative-circle-1" />
        <div className="decorative-circle-2" />

        <div className="error-code">404</div>
        <h1 className="main-message">Page Not Found</h1>
        <p className="description">
          Sorry, the page you are looking for doesn't exist or has been moved.
        </p>

        <div className="actions">
          <button className="button-primary" onClick={goHome}>
            Go Back Home
          </button>
          <button className="button-secondary" onClick={() => window.history.back()}>
            Go Back
          </button>
        </div>

        <p className="countdown">
          Redirecting to home page in {countdown} seconds...
        </p>
      </div>

      <div className="help-links">
        <a href="#search">Search our site</a>
        <span className="help-separator">•</span>
        <a href="#sitemap">Browse sitemap</a>
        <span className="help-separator">•</span>
        <a href="#help">Help center</a>
      </div>
    </div>
  );
};

export default NotFound;
