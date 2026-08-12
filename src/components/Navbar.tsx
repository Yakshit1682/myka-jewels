import { Heart, LogIn, LogOut, Menu, Search, UserRound, X } from "lucide-react";

import { Link, useNavigate } from "react-router-dom";

import { useState } from "react";

const API_URL = "http://localhost:5003/api/v1";

const Navbar = () => {
  const navigate = useNavigate();

  const [mobileOpen, setMobileOpen] = useState(false);

  const token = localStorage.getItem("token");

  const storedUser = localStorage.getItem("user");

  let user = null;

  try {
    user = storedUser ? JSON.parse(storedUser) : null;
  } catch {
    user = null;
  }

  const isLoggedIn = Boolean(token && user);

  const handleLogout = async () => {
    try {
      if (token) {
        await fetch(`${API_URL}/auth/logout`, {
          method: "POST",

          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      }
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      setMobileOpen(false);

      navigate("/");
    }
  };

  const closeMobileMenu = () => {
    setMobileOpen(false);
  };

  return (
    <>
      <header className="navbar">
        <div className="navbar-left">
          <button
            type="button"
            className="icon-button mobile-menu-button"
            aria-label="Open menu"
            onClick={() => setMobileOpen(true)}
          >
            <Menu size={20} />
          </button>

          <nav className="desktop-nav">
            <Link to="/products">Shop</Link>

            <Link to="/products">Collections</Link>
          </nav>
        </div>

        <Link to="/" className="logo">
          <span className="logo-symbol">MK</span>

          <span className="logo-name">MYKA</span>

          <small>JEWELS</small>
        </Link>

        <div className="navbar-right">
          <nav className="desktop-nav">
            <Link to="/about">About</Link>

            <Link to="/contact">Contact</Link>
          </nav>

          <button
            type="button"
            className="icon-button desktop-only-action"
            aria-label="Search"
          >
            <Search size={18} />
          </button>

          <Link to="/wishlist" className="icon-button" aria-label="Wishlist">
            <Heart size={18} />
          </Link>

          {isLoggedIn ? (
            <>
              <Link to="/profile" className="navbar-profile-link">
                <UserRound size={17} />

                <span>{user?.first_name || "Profile"}</span>
              </Link>

              <button
                type="button"
                className="icon-button navbar-logout-icon desktop-only-action"
                onClick={handleLogout}
                aria-label="Logout"
              >
                <LogOut size={18} />
              </button>
            </>
          ) : (
            <div className="navbar-auth-links">
              <Link to="/login" className="navbar-login-link">
                <LogIn size={15} />

                <span>Login</span>
              </Link>

              <Link to="/register" className="navbar-register-link">
                Register
              </Link>
            </div>
          )}
        </div>
      </header>

      {mobileOpen && (
        <div className="mobile-nav-overlay">
          <div className="mobile-nav-panel">
            <div className="mobile-nav-header">
              <Link
                to="/"
                className="mobile-nav-logo"
                onClick={closeMobileMenu}
              >
                <span>MYKA</span>

                <small>JEWELS</small>
              </Link>

              <button
                type="button"
                className="mobile-nav-close"
                onClick={closeMobileMenu}
                aria-label="Close menu"
              >
                <X size={22} />
              </button>
            </div>

            <nav className="mobile-nav-links">
              <Link to="/products" onClick={closeMobileMenu}>
                Shop
              </Link>

              <Link to="/products" onClick={closeMobileMenu}>
                Collections
              </Link>

              <Link to="/about" onClick={closeMobileMenu}>
                About
              </Link>

              <Link to="/contact" onClick={closeMobileMenu}>
                Contact
              </Link>

              <Link to="/wishlist" onClick={closeMobileMenu}>
                Wishlist
              </Link>

              {isLoggedIn ? (
                <>
                  <Link to="/profile" onClick={closeMobileMenu}>
                    My Profile
                  </Link>

                  <button type="button" onClick={handleLogout}>
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" onClick={closeMobileMenu}>
                    Login
                  </Link>

                  <Link to="/register" onClick={closeMobileMenu}>
                    Register
                  </Link>
                </>
              )}
            </nav>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
