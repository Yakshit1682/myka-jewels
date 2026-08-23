import { ArrowUpRight } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
// import Navbar from "../components/Navbar";
// import Footer from "../components/Footer";

const API_URL = import.meta.env.VITE_API_URL;

type Collection = {
  uuid: string;
  name: string;
  slug: string;
  description?: string | null;
  image_data_uri?: string | null;
  sort_order?: number;
  is_active: boolean;
};

const Collections = () => {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);

  const loadCollections = async () => {
    try {
      const response = await fetch(`${API_URL}/collections`);

      const result = await response.json();

      if (result.success) {
        setCollections(result.data || []);
      }
    } catch (error) {
      console.error("Unable to load collections:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCollections();
  }, []);

  return (
    <>
      {/* <Navbar /> */}

      <main className="collections-page">
        {/* HERO */}

        <section className="collections-page-hero">
          <div className="collections-page-breadcrumb">
            <Link to="/">Home</Link>

            <span>/</span>

            <span>Collections</span>
          </div>

          <div className="collections-page-hero-content">
            <span className="section-eyebrow">DISCOVER MYKA</span>

            <h1>Our Collections</h1>

            <p>
              Explore jewellery curated around timeless craftsmanship, modern
              expression and everyday elegance.
            </p>
          </div>
        </section>

        {/* COLLECTION LIST */}

        <section className="collections-showcase">
          {loading ? (
            <div className="collections-loading">Loading collections...</div>
          ) : collections.length > 0 ? (
            <div className="collections-editorial-grid">
              {collections.map((collection, index) => (
                <Link
                  to={{
                    pathname: "/products",
                    search: `?collection=${encodeURIComponent(collection.slug)}`,
                  }}
                  key={collection.uuid}
                  className={`collections-editorial-card ${
                    index % 5 === 0 ? "collection-featured-card" : ""
                  }`}
                >
                  <div className="collections-editorial-image">
                    {collection.image_data_uri ? (
                      <img
                        src={collection.image_data_uri}
                        alt={collection.name}
                      />
                    ) : (
                      <div className="collection-image-placeholder">
                        <span>MYKA</span>
                      </div>
                    )}
                  </div>

                  <div className="collections-card-overlay" />

                  <div className="collections-card-number">
                    {String(index + 1).padStart(2, "0")}
                  </div>

                  <div className="collections-card-content">
                    <div>
                      <span className="collections-card-eyebrow">
                        COLLECTION
                      </span>

                      <h2>{collection.name}</h2>

                      {collection.description && (
                        <p>{collection.description}</p>
                      )}
                    </div>

                    <div className="collections-card-link">
                      <span>View Collection</span>

                      <ArrowUpRight size={17} />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="collections-empty">
              <span className="section-eyebrow">COLLECTIONS</span>

              <h2>Our collections are coming soon.</h2>
            </div>
          )}
        </section>

        {/* BOTTOM EDITORIAL */}

        <section className="collections-page-footer">
          <span className="section-eyebrow">MYKA JEWELS</span>

          <h2>
            Jewellery made to become
            <br />
            part of your story.
          </h2>

          <Link to="/products" className="outline-luxury-button">
            Shop All Jewellery
            <ArrowUpRight size={15} />
          </Link>
        </section>
      </main>
      {/* <Footer /> */}
    </>
  );
};

export default Collections;
