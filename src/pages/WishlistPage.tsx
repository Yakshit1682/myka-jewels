import { Heart, Trash2 } from "lucide-react";

import { useEffect, useState } from "react";

import { Link, useNavigate } from "react-router-dom";

// import Navbar from "../components/Navbar";
// import Footer from "../components/Footer";

import type { Product } from "../types/product";

const API_URL = import.meta.env.VITE_API_URL;;

type WishlistItem = {
  id: number;
  created_at: string;
  product: Product;
};

const WishlistPage = () => {
  const navigate = useNavigate();

  const [items, setItems] = useState<WishlistItem[]>([]);

  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  const loadWishlist = async () => {
    if (!token) {
      navigate("/login?redirect=/wishlist");

      return;
    }

    try {
      setLoading(true);

      const response = await fetch(`${API_URL}/wishlist`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await response.json();

      if (response.status === 401) {
        localStorage.removeItem("token");

        localStorage.removeItem("user");

        navigate("/login?redirect=/wishlist");

        return;
      }

      if (result.success) {
        setItems(result.data || []);
      }
    } catch (error) {
      console.error("Wishlist error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWishlist();
  }, []);

  const removeItem = async (productUuid: string) => {
    if (!token) return;

    try {
      const response = await fetch(`${API_URL}/wishlist/${productUuid}`, {
        method: "DELETE",

        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await response.json();

      if (!result.success) {
        alert(result.message);
        return;
      }

      setItems((current) =>
        current.filter((item) => item.product.uuid !== productUuid),
      );
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      {/* <Navbar /> */}

      <main className="wishlist-page" style={{ minHeight: "calc(100vh - 200px)" }}>
        <section className="wishlist-header">
          <p className="home-eyebrow">YOUR COLLECTION</p>

          <h1>My Wishlist</h1>

          <p>
            Save the jewellery pieces you love and return to them whenever you
            like.
          </p>
        </section>

        {loading ? (
          <div className="wishlist-loading">Loading wishlist...</div>
        ) : items.length > 0 ? (
          <div className="wishlist-grid">
            {items.map((item) => {
              const product = item.product;

              const image =
                product.images?.find((image) => image.is_primary) ||
                product.images?.[0];

              return (
                <article className="wishlist-card" key={product.uuid}>
                  <Link
                    to={`/products/${product.slug}`}
                    className="wishlist-image"
                  >
                    {image ? (
                      <img
                        src={image.data_uri}
                        alt={image.alt_text || product.name}
                      />
                    ) : (
                      <div>No image</div>
                    )}
                  </Link>

                  <div className="wishlist-card-content">
                    <p className="home-eyebrow">
                      {product.categories?.[0]?.name || "MYKA"}
                    </p>

                    <Link to={`/products/${product.slug}`}>
                      <h2>{product.name}</h2>
                    </Link>

                    <strong>
                      {product.price
                        ? `₹${Number(product.price).toLocaleString("en-IN")}`
                        : "Price on request"}
                    </strong>

                    <div className="wishlist-actions">
                      <Link
                        to={`/products/${product.slug}`}
                        className="wishlist-view-button"
                      >
                        View Product
                      </Link>

                      <button
                        type="button"
                        onClick={() => removeItem(product.uuid)}
                        className="wishlist-remove-button"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="wishlist-empty">
            <Heart size={34} />

            <h2>Your wishlist is empty.</h2>

            <p>Discover our jewellery and save your favourite pieces.</p>

            <Link to="/products" className="primary-gold-button">
              Explore Jewellery
            </Link>
          </div>
        )}
      </main>

      {/* <Footer /> */}
    </>
  );
};

export default WishlistPage;
