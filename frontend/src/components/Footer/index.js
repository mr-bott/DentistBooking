import React, { useState } from "react";
import {
  FaTwitter,
  FaFacebookF,
  FaLinkedinIn,
  FaInstagram,
} from "react-icons/fa";
import "./footer.css";

const Footer = () => {
  const [activeAccordion, setActiveAccordion] = useState(null);

  const toggleAccordion = (index) => {
    setActiveAccordion(activeAccordion === index ? null : index);
  };

  const footerLinks = [
    {
      title: "Company",
      links: ["About Us", "Our Team", "Careers", "News"],
    },
    {
      title: "Support",
      links: ["Help Center", "FAQ", "Contact Us", "Privacy Policy"],
    },
  ];

  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-container">
     
        <div className="footer-sections">
         
          <div className="footer-brand">
            <h2>AGRO FX</h2>
            <p>
              lorem1 ipsum dolor sit amet, consectetur adipiscing elit. Sed do
              eiusmod tempor 
            </p>

            <div className="social-icons">
              <a
                href="https://twitter.com"
                className="social-btn"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaTwitter />
              </a>
              <a
                href="https://facebook.com"
                className="social-btn"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaFacebookF />
              </a>
              <a
                href="https://linkedin.com"
                className="social-btn"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaLinkedinIn />
              </a>
              <a
                href="https://instagram.com"
                className="social-btn"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaInstagram />
              </a>
            </div>
          </div>

          {/* Link Sections */}
          <div className="footer-links-container">
            {footerLinks.map((column, index) => (
              <div key={index} className="footer-column">
                <h3>{column.title}</h3>
                <ul>
                  {column.links.map((link, idx) => (
                    <li key={idx}>
                      <a href={`#${link.toLowerCase().replace(/\s+/g, "-")}`}>
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile Accordion */}
        <div className="footer-accordion">
          <div className="footer-brand mobile">
            <h2>AGRO FX</h2>
            <p>
              Creating beautiful digital experiences that transform businesses
              and delight users around the world.
            </p>
            <div className="social-icons">
              <a href="https://twitter.com" className="social-btn">
                <FaTwitter />
              </a>
              <a href="https://facebook.com" className="social-btn">
                <FaFacebookF />
              </a>
              <a href="https://linkedin.com" className="social-btn">
                <FaLinkedinIn />
              </a>
              <a href="https://instagram.com" className="social-btn">
                <FaInstagram />
              </a>
            </div>
          </div>

          {footerLinks.map((section, index) => (
            <div key={index} className="accordion-item">
              <button onClick={() => toggleAccordion(index)}>
                {section.title}
                <span className={activeAccordion === index ? "rotated" : ""}>
                  ▼
                </span>
              </button>
              <div
                className={`accordion-content ${
                  activeAccordion === index ? "open" : ""
                }`}
              >
                <ul>
                  {section.links.map((link, i) => (
                    <li key={i}>
                      <a href={`#${link.toLowerCase().replace(/\s+/g, "-")}`}>
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Line */}
        <div className="footer-bottom">
          <p>© {currentYear} AGRO FX. All rights reserved.</p>
          <ul>
            {["Terms", "Privacy", "Cookies"].map((item) => (
              <li key={item}>
                <a href={`#${item.toLowerCase()}`}>{item}</a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
