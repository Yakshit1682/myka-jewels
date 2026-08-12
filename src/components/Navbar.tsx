import { Heart, Menu, Search, ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <header className="navbar">
      <div className="navbar-left">
        <button className="icon-button">
          <Menu size={19} />
        </button>

        <nav className="desktop-nav">
          <Link to="/products">Shop</Link>
          <a href="#">Collections</a>
        </nav>
      </div>

      <Link to="/" className="logo">
        <span className="logo-symbol">MK</span>
        <span className="logo-name">MYKA</span>
        <small>JEWELS</small>
      </Link>

      <div className="navbar-right">
        <nav className="desktop-nav">
          <a href="#">About</a>
          <a href="#">Contact</a>
        </nav>

        <button className="icon-button">
          <Search size={18} />
        </button>

        <button className="icon-button">
          <Heart size={18} />
        </button>

        <button className="icon-button">
          <ShoppingBag size={18} />
        </button>
      </div>
    </header>
  );
};

export default Navbar;
