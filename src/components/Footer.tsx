import { ArrowRight } from "lucide-react";
import { FaFacebookF, FaInstagram } from "react-icons/fa";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="luxury-footer">
      <div className="footer-top">
        <div className="footer-brand">
          <Link to="/" className="footer-logo">
            <div className="footer-logo-circle">MK</div>

            <div className="footer-logo-text">
              <h3>MYKA</h3>
              <span>JEWELS</span>
            </div>
          </Link>

          <p>Timeless jewellery created for life's most beautiful moments.</p>

          <div className="footer-socials">
            <a href="#" aria-label="Instagram" className="footer-social-button">
              <FaInstagram size={16} />
            </a>

            <a href="#" aria-label="Facebook" className="footer-social-button">
              <FaFacebookF size={16} />
            </a>
          </div>
        </div>

        <div className="footer-links-column">
          <h4>Shop</h4>

          <Link to="/products">All Jewellery</Link>

          <Link to="/products?category=Rings">Rings</Link>

          <Link to="/products?category=Necklaces">Necklaces</Link>

          <Link to="/products?category=Earrings">Earrings</Link>

          <Link to="/products?category=Bracelets">Bracelets</Link>
        </div>

        <div className="footer-links-column">
          <h4>Discover</h4>

          <Link to="/about">Our Story</Link>

          <Link to="/about">Craftsmanship</Link>

          <Link to="/products">Collections</Link>

          <Link to="/contact">Contact</Link>
        </div>

        <div className="footer-links-column">
          <h4>Customer Care</h4>

          <Link to="/contact">Shipping & Returns</Link>

          <Link to="/contact">Jewellery Care</Link>

          <Link to="/contact">Size Guide</Link>

          <Link to="/contact">FAQ</Link>
        </div>

        <div className="footer-newsletter">
          <h4>Stay Connected</h4>

          <p>
            Discover new collections, private events and stories from the world
            of MYKA.
          </p>

          <form
            className="footer-newsletter-form"
            onSubmit={(event) => event.preventDefault()}
          >
            <input
              type="email"
              placeholder="Email address"
              aria-label="Email address"
            />

            <button type="submit" aria-label="Subscribe">
              <ArrowRight size={16} />
            </button>
          </form>

          <span className="footer-newsletter-note">
            Subscribe to our jewellery journal.
          </span>
        </div>
      </div>

      <div className="footer-divider" />

      <div className="footer-bottom">
        <span>
          © {new Date().getFullYear()} MYKA Jewels. All rights reserved.
        </span>

        <div className="footer-bottom-links">
          <a href="#">Privacy Policy</a>

          <a href="#">Terms & Conditions</a>

          <a href="#">Cookies</a>
        </div>

        <div className="footer-location">
          <span>India</span>
          <span>INR ₹</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
