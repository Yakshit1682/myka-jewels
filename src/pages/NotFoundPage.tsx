import { ArrowLeft, Gem } from "lucide-react";

import { Link } from "react-router-dom";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const NotFoundPage = () => {
  return (
    <>
      <Navbar />

      <main className="not-found-page">
        <div className="not-found-content">
          <div className="not-found-icon">
            <Gem size={30} strokeWidth={1.2} />
          </div>

          <p className="home-eyebrow">PAGE NOT FOUND</p>

          <div className="not-found-number">404</div>

          <h1>This piece seems to be missing.</h1>

          <p className="not-found-description">
            The page you're looking for may have been moved, removed or is no
            longer available.
          </p>

          <div className="not-found-actions">
            <Link to="/" className="primary-gold-button">
              <ArrowLeft size={15} />
              Back to Home
            </Link>

            <Link to="/products" className="not-found-shop-link">
              Explore Jewellery
            </Link>
          </div>
        </div>

        <span className="not-found-decoration left">✦</span>

        <span className="not-found-decoration right">✦</span>
      </main>

      <Footer />
    </>
  );
};

export default NotFoundPage;
