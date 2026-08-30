// import { Heart, UserRound } from "lucide-react";

import { FaFacebookF, FaInstagram } from "react-icons/fa";

import { Link } from "react-router-dom";

import myka_logo from "../assets/myka_logo.png";

const Footer = () => {
  // const token = localStorage.getItem("token");

  return (
    <footer className="luxury-footer">
      <div className="footer-top">
        {/* BRAND */}

        <div className="footer-brand">
          {/* <Link to="/" className="footer-logo">
            <div className="footer-logo-circle">MK</div>

            <div className="footer-logo-text">
              <h3>MYKA</h3>
              <span>JEWELS</span>
            </div>
          </Link> */}

          <Link to="/" className="footer-logo">
            <img
              src={myka_logo}
              alt="Myka Jewels"
              className="footer-logo-image"
            />
          </Link>

          <p>Timeless jewellery created for life's most beautiful moments.</p>

          <div className="footer-socials">
            <a
              href="https://www.instagram.com/mykajewels"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="footer-social-button"
            >
              <FaInstagram size={16} />
            </a>

            <a
              href="https://www.facebook.com/mykajewels/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="footer-social-button"
            >
              <FaFacebookF size={16} />
            </a>
          </div>
        </div>
        <div className="footer-golden-line">
          <span>✦</span>
        </div>

        {/* SHOP */}

        <div className="footer-links-column">
          <h4>Shop</h4>

          <Link to="/products">All Jewellery</Link>

          <Link to="/products?category=rings">Rings</Link>

          <Link to="/products?category=necklaces">Necklaces</Link>

          <Link to="/products?category=earrings">Earrings</Link>

          <Link to="/products?category=bracelets">Bracelets</Link>
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

        {/* <div className="footer-links-column">
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
        </div> */}
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
