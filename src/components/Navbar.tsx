import { Heart, LogIn, LogOut, Menu, Search, UserRound } from "lucide-react";

import { Link, useNavigate } from "react-router-dom";

const API_URL = "http://localhost:5003/api/v1";

const Navbar = () => {
  const navigate = useNavigate();

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

      navigate("/");
    }
  };

  return (
    <header className="navbar">
      <div className="navbar-left">
        <button className="icon-button" aria-label="Open menu">
          <Menu size={19} />
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

        <button className="icon-button" aria-label="Search">
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
              className="icon-button navbar-logout-icon"
              onClick={handleLogout}
              aria-label="Logout"
              title="Logout"
            >
              <LogOut size={18} />
            </button>
          </>
        ) : (
          <div className="navbar-auth-links">
            <Link to="/login" className="navbar-login-link">
              <LogIn size={15} />
              Login
            </Link>

            <Link to="/register" className="navbar-register-link">
              Register
            </Link>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
