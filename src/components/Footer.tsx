import { Heart, UserRound } from "lucide-react";

import { FaFacebookF, FaInstagram } from "react-icons/fa";

import { Link } from "react-router-dom";

const Footer = () => {
  const token = localStorage.getItem("token");

  return (
    <footer className="luxury-footer">
      <div className="footer-top">
        {/* BRAND */}

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

        {/* SHOP */}

        <div className="footer-links-column">
          <h4>Shop</h4>

          <Link to="/products">All Jewellery</Link>

          <Link to="/products?category=Rings">Rings</Link>

          <Link to="/products?category=Necklaces">Necklaces</Link>

          <Link to="/products?category=Earrings">Earrings</Link>

          <Link to="/products?category=Bracelets">Bracelets</Link>
        </div>

        {/* MYKA */}

        <div className="footer-links-column">
          <h4>MYKA</h4>

          <Link to="/">Home</Link>

          <Link to="/about">About Us</Link>

          <Link to="/contact">Contact Us</Link>

          <Link to="/products">Collections</Link>
        </div>

        {/* ACCOUNT */}

        <div className="footer-links-column">
          <h4>My Account</h4>

          {token ? (
            <>
              <Link to="/profile">
                <UserRound size={13} />
                My Profile
              </Link>

              <Link to="/wishlist">
                <Heart size={13} />
                My Wishlist
              </Link>
            </>
          ) : (
            <>
              <Link to="/login">Login</Link>

              <Link to="/register">Create Account</Link>
            </>
          )}
        </div>
      </div>

      <div className="footer-divider" />

      <div className="footer-bottom">
        <span>
          © {new Date().getFullYear()} MYKA Jewels. All rights reserved.
        </span>

        <div className="footer-location">
          <span>India</span>
          <span>INR ₹</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
