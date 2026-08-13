import { Heart } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import type { Product } from "../types/product";

interface ProductCardProps {
  product: Product;
}

const API_URL = import.meta.env.VITE_API_URL;

const ProductCard = ({ product }: ProductCardProps) => {
  const navigate = useNavigate();

  const [isWishlisted, setIsWishlisted] = useState(false);

  const [wishlistLoading, setWishlistLoading] = useState(false);

  const primaryImage =
    product.images?.find((image) => image.is_primary) || product.images?.[0];

  const primaryCategory = product.categories?.[0];

  useEffect(() => {
    const checkWishlist = async () => {
      const token = localStorage.getItem("token");

      if (!token) return;

      try {
        const response = await fetch(`${API_URL}/wishlist`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const result = await response.json();

        if (!result.success) return;

        const found = (result.data || []).some(
          (item: any) => item.product?.uuid === product.uuid,
        );

        setIsWishlisted(found);
      } catch (error) {
        console.error("Wishlist check error:", error);
      }
    };

    checkWishlist();
  }, [product.uuid]);

  const handleWishlist = async (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();

    const token = localStorage.getItem("token");

    if (!token) {
      navigate(`/login?redirect=/products/${product.slug}`);

      return;
    }

    try {
      setWishlistLoading(true);

      if (isWishlisted) {
        const response = await fetch(`${API_URL}/wishlist/${product.uuid}`, {
          method: "DELETE",

          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const result = await response.json();

        if (!result.success) {
          alert(result.message || "Unable to remove wishlist item");

          return;
        }

        setIsWishlisted(false);
      } else {
        const response = await fetch(`${API_URL}/wishlist`, {
          method: "POST",

          headers: {
            "Content-Type": "application/json",

            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify({
            product_uuid: product.uuid,
          }),
        });

        const result = await response.json();

        if (!result.success) {
          alert(result.message || "Unable to add to wishlist");

          return;
        }

        setIsWishlisted(true);
      }
    } catch (error) {
      console.error("Wishlist error:", error);
    } finally {
      setWishlistLoading(false);
    }
  };

  return (
    <article className="product-card">
      <Link to={`/products/${product.slug}`} className="product-image-wrapper">
        {primaryImage ? (
          <img
            src={primaryImage.data_uri}
            alt={primaryImage.alt_text || product.name}
            className="product-image"
          />
        ) : (
          <div className="product-image-placeholder">No image</div>
        )}

        <button
          type="button"
          className={`wishlist-button ${isWishlisted ? "active" : ""}`}
          onClick={handleWishlist}
          disabled={wishlistLoading}
          aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart size={19} fill={isWishlisted ? "currentColor" : "none"} />
        </button>

        <span className="quick-view">View Details</span>
      </Link>

      <div className="product-content">
        <p className="product-collection">
          {primaryCategory?.name || "MYKA Collection"}
        </p>

        <Link to={`/products/${product.slug}`} className="product-name">
          {product.name}
        </Link>

        <p className="product-price">
          {product.price
            ? `₹${Number(product.price).toLocaleString("en-IN")}`
            : "Price on request"}
        </p>
      </div>
    </article>
  );
};

export default ProductCard;
