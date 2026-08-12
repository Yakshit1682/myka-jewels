import { Heart, MessageCircle } from "lucide-react";

import { useEffect, useRef, useState } from "react";

import { Link, useNavigate, useParams } from "react-router-dom";

import gsap from "gsap";
import { useGSAP } from "@gsap/react";

import Navbar from "../components/Navbar";
import ProductCard from "../components/ProductCard";
import Footer from "../components/Footer";

import { getProductBySlug, getProducts } from "../api/products.api";

import type { Product } from "../types/product";

const ProductDetailsPage = () => {
  const { slug } = useParams();

  const navigate = useNavigate();

  const pageRef = useRef<HTMLDivElement>(null);

  const [product, setProduct] = useState<Product | null>(null);

  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);

  const [loading, setLoading] = useState(true);

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const [authChecking, setAuthChecking] = useState(true);

  const [inquiryLoading, setInquiryLoading] = useState(false);

  const [isWishlisted, setIsWishlisted] = useState(false);

  const [wishlistLoading, setWishlistLoading] = useState(false);

  useEffect(() => {
    const checkAuthentication = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setIsLoggedIn(false);
        setAuthChecking(false);
        return;
      }

      try {
        const response = await fetch("http://localhost:5003/api/v1/auth/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const result = await response.json();

        if (response.ok && result.success) {
          setIsLoggedIn(true);

          // Refresh cached user
          localStorage.setItem("user", JSON.stringify(result.data));
        } else {
          localStorage.removeItem("token");

          localStorage.removeItem("user");

          setIsLoggedIn(false);
        }
      } catch (error) {
        console.error("Authentication check error:", error);

        setIsLoggedIn(false);
      } finally {
        setAuthChecking(false);
      }
    };

    checkAuthentication();
  }, []);


  /*
   * LOAD PRODUCT
   */

  useEffect(() => {
    const loadProduct = async () => {
      if (!slug) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        const response = await getProductBySlug(slug);

        if (!response.success || !response.data) {
          setProduct(null);
          return;
        }

        const currentProduct = response.data as Product;

        setProduct(currentProduct);

        /*
         * RELATED PRODUCTS
         */

        const relatedResponse = await getProducts({
          limit: 8,
        });

        if (relatedResponse.success) {
          const items: Product[] = relatedResponse.data || [];

          setRelatedProducts(
            items
              .filter((item) => item.uuid !== currentProduct.uuid)
              .slice(0, 4),
          );
        }
      } catch (error) {
        console.error("Load product error:", error);

        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [slug]);

  useEffect(() => {
    const checkWishlist = async () => {
      if (!product) return;

      const token = localStorage.getItem("token");

      if (!token) {
        setIsWishlisted(false);
        return;
      }

      try {
        const response = await fetch("http://localhost:5003/api/v1/wishlist", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");

          setIsWishlisted(false);

          return;
        }

        const result = await response.json();

        if (!result.success) return;

        const exists = (result.data || []).some(
          (item: any) => item.product?.uuid === product.uuid,
        );

        setIsWishlisted(exists);
      } catch (error) {
        console.error("Check wishlist error:", error);
      }
    };

    checkWishlist();
  }, [product]);

  /*
   * ANIMATION
   */

  useGSAP(
    () => {
      if (!product) return;

      gsap.from(".product-gallery", {
        opacity: 0,
        x: -25,
        duration: 0.8,
        ease: "power2.out",
      });

      gsap.from(".product-info-inner", {
        opacity: 0,
        x: 25,
        duration: 0.8,
        delay: 0.1,
        ease: "power2.out",
      });

      gsap.from(".product-details-breadcrumb", {
        opacity: 0,
        y: -10,
        duration: 0.5,
      });

      gsap.from(".related-products-section", {
        opacity: 0,
        y: 25,
        duration: 0.7,
        delay: 0.4,
      });
    },
    {
      scope: pageRef,
      dependencies: [product],
    },
  );


  const handleWishlist = async () => {
    if (!product) return;

    const token = localStorage.getItem("token");

    /*
     * Not logged in
     */
    if (!token || !isLoggedIn) {
      navigate(`/login?redirect=/products/${product.slug}`);

      return;
    }

    try {
      setWishlistLoading(true);

      /*
       * REMOVE FROM WISHLIST
       */
      if (isWishlisted) {
        const response = await fetch(
          `http://localhost:5003/api/v1/wishlist/${product.uuid}`,
          {
            method: "DELETE",

            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        const result = await response.json();

        if (response.status === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");

          setIsLoggedIn(false);

          navigate(`/login?redirect=/products/${product.slug}`);

          return;
        }

        if (!result.success) {
          alert(result.message || "Unable to remove product from wishlist");

          return;
        }

        setIsWishlisted(false);

        return;
      }

      /*
       * ADD TO WISHLIST
       */
      const response = await fetch("http://localhost:5000/api/v1/wishlist", {
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

      if (response.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        setIsLoggedIn(false);

        navigate(`/login?redirect=/products/${product.slug}`);

        return;
      }

      if (!result.success) {
        alert(result.message || "Unable to add product to wishlist");

        return;
      }

      setIsWishlisted(true);
    } catch (error) {
      console.error("Wishlist error:", error);

      alert("Unable to update wishlist.");
    } finally {
      setWishlistLoading(false);
    }
  };

  /*
   * WHATSAPP INQUIRY
   */

  const handleWhatsAppInquiry = async () => {
    if (!product) return;

    const token = localStorage.getItem("token");

    if (!token || !isLoggedIn) {
      navigate(`/login?redirect=/products/${product.slug}`);

      return;
    }

    try {
      setInquiryLoading(true);

      const response = await fetch(
        `http://localhost:5003/api/v1/inquiries/products/${product.uuid}`,
        {
          method: "POST",

          headers: {
            Authorization: `Bearer ${token}`,

            "Content-Type": "application/json",
          },
        },
      );

      const result = await response.json();

      /*
       * Session expired / invalid
       */
      if (response.status === 401) {
        localStorage.removeItem("token");

        localStorage.removeItem("user");

        setIsLoggedIn(false);

        navigate(`/login?redirect=/products/${product.slug}`);

        return;
      }

      if (!result.success) {
        alert(result.message || "Unable to create inquiry");

        return;
      }

      /*
       * Backend already records the
       * inquiry before returning this URL.
       */
      if (result.data?.whatsapp_url) {
        window.open(result.data.whatsapp_url, "_blank", "noopener,noreferrer");
      }
    } catch (error) {
      console.error("WhatsApp inquiry error:", error);

      alert("Unable to start WhatsApp inquiry.");
    } finally {
      setInquiryLoading(false);
    }
  };

  /*
   * LOADING
   */

  if (loading) {
    return (
      <>
        <Navbar />

        <main className="product-details-loading">
          <div>
            <span>MYKA</span>
            <p>Loading jewellery...</p>
          </div>
        </main>

        <Footer />
      </>
    );
  }

  /*
   * NOT FOUND
   */

  if (!product) {
    return (
      <>
        <Navbar />

        <main className="not-found-page">
          <h1>Product not found</h1>

          <Link to="/products" className="luxury-button">
            Back to Jewellery
          </Link>
        </main>

        <Footer />
      </>
    );
  }

  const galleryImages = product.images || [];

  const category = product.categories?.[0];

  return (
    <>
      <Navbar />

      <main ref={pageRef}>
        <section className="product-details-section">
          {/* BREADCRUMB */}

          <div className="product-details-breadcrumb">
            <Link to="/products">Jewellery</Link>

            {category && (
              <>
                <span>/</span>

                <span>{category.name}</span>
              </>
            )}

            <span>/</span>

            <span>{product.name}</span>
          </div>

          <div className="product-details-layout">
            {/* GALLERY */}

            <div className="product-gallery">
              {galleryImages.length > 0 ? (
                <div className="gallery-grid">
                  {galleryImages
                    .sort((a, b) => a.sort_order - b.sort_order)
                    .map((image, index) => (
                      <div
                        className="gallery-image-wrapper"
                        key={image.uuid || index}
                      >
                        <img
                          src={image.data_uri}
                          alt={image.alt_text || `${product.name} ${index + 1}`}
                          className="gallery-image"
                        />
                      </div>
                    ))}
                </div>
              ) : (
                <div className="product-details-no-image">
                  No image available
                </div>
              )}
            </div>

            {/* PRODUCT INFORMATION */}

            <aside className="product-info">
              <div className="product-info-inner">
                <p className="product-details-collection">
                  {category?.name || "MYKA Collection"}
                </p>

                <div className="product-title-row">
                  <h1>{product.name}</h1>

                  <button
                    type="button"
                    className={`details-wishlist-button ${
                      isWishlisted ? "active" : ""
                    }`}
                    onClick={handleWishlist}
                    disabled={wishlistLoading}
                    aria-label={
                      isWishlisted ? "Remove from wishlist" : "Add to wishlist"
                    }
                    title={
                      isWishlisted ? "Remove from wishlist" : "Add to wishlist"
                    }
                  >
                    <Heart
                      size={21}
                      fill={isWishlisted ? "currentColor" : "none"}
                    />
                  </button>
                </div>

                {/* PRICE */}

                <div className="details-price-wrapper">
                  <p className="details-price">
                    {product.price
                      ? `₹${Number(product.price).toLocaleString("en-IN")}`
                      : "Price on request"}
                  </p>

                  {product.compare_at_price &&
                    Number(product.compare_at_price) >
                      Number(product.price || 0) && (
                      <span className="details-old-price">
                        ₹
                        {Number(product.compare_at_price).toLocaleString(
                          "en-IN",
                        )}
                      </span>
                    )}
                </div>

                {/* STOCK */}

                <div className="product-stock-row">
                  <span
                    className={`product-stock ${
                      product.stock_status === "IN_STOCK"
                        ? "in-stock"
                        : product.stock_status === "OUT_OF_STOCK"
                          ? "out-of-stock"
                          : "on-request"
                    }`}
                  >
                    {product.stock_status === "IN_STOCK"
                      ? "In Stock"
                      : product.stock_status === "OUT_OF_STOCK"
                        ? "Out of Stock"
                        : "Available on Request"}
                  </span>

                  {product.sku && (
                    <span className="product-sku">SKU: {product.sku}</span>
                  )}
                </div>

                {/* DESCRIPTION */}

                <p className="product-description">
                  {product.description ||
                    product.short_description ||
                    "A timeless piece from the MYKA jewellery collection."}
                </p>

                <div className="details-divider" />

                {/* MATERIAL */}

                {product.material && (
                  <div className="product-option-section">
                    <div className="option-heading-row">
                      <span>Material</span>

                      <span className="selected-option">
                        {product.material}
                      </span>
                    </div>
                  </div>
                )}

                {/* METAL COLOR */}

                {product.metal_color && (
                  <div className="product-option-section">
                    <div className="option-heading-row">
                      <span>Metal Colour</span>

                      <span className="selected-option">
                        {product.metal_color}
                      </span>
                    </div>
                  </div>
                )}

                {/* WEIGHT */}

                {product.weight_grams && (
                  <div className="product-option-section">
                    <div className="option-heading-row">
                      <span>Weight</span>

                      <span className="selected-option">
                        {product.weight_grams} grams
                      </span>
                    </div>
                  </div>
                )}

                {/* WHATSAPP */}

                <div className="whatsapp-inquiry-section">
                  {authChecking ? (
                    <button
                      type="button"
                      className="whatsapp-inquiry-button"
                      disabled
                    >
                      Checking account...
                    </button>
                  ) : isLoggedIn ? (
                    <>
                      <button
                        type="button"
                        className="whatsapp-inquiry-button"
                        onClick={handleWhatsAppInquiry}
                        disabled={
                          inquiryLoading ||
                          product.stock_status === "OUT_OF_STOCK"
                        }
                      >
                        <MessageCircle size={19} />

                        {inquiryLoading
                          ? "Opening WhatsApp..."
                          : "Enquire on WhatsApp"}
                      </button>

                      <p>
                        Have a question about this piece? Contact our jewellery
                        team directly on WhatsApp.
                      </p>
                    </>
                  ) : (
                    <>
                      <button
                        type="button"
                        className="login-to-inquire-button"
                        onClick={() =>
                          navigate(`/login?redirect=/products/${product.slug}`)
                        }
                      >
                        Login to Enquire
                      </button>

                      <p>
                        Please sign in to enquire about this jewellery piece.
                      </p>
                    </>
                  )}
                </div>

                {/* DETAILS */}

                <div className="product-accordions">
                  <details open>
                    <summary>Product Details</summary>

                    <div className="accordion-content">
                      {product.short_description && (
                        <p>{product.short_description}</p>
                      )}

                      {product.material && (
                        <p>
                          <strong>Material:</strong> {product.material}
                        </p>
                      )}

                      {product.metal_color && (
                        <p>
                          <strong>Metal Colour:</strong> {product.metal_color}
                        </p>
                      )}

                      {product.weight_grams && (
                        <p>
                          <strong>Weight:</strong> {product.weight_grams} grams
                        </p>
                      )}

                      {category && (
                        <p>
                          <strong>Collection:</strong> {category.name}
                        </p>
                      )}

                      {product.sku && (
                        <p>
                          <strong>SKU:</strong> {product.sku}
                        </p>
                      )}
                    </div>
                  </details>

                  <details>
                    <summary>Materials & Care</summary>

                    <div className="accordion-content">
                      <p>
                        Store your jewellery separately in a soft pouch and
                        avoid direct contact with perfumes, chemicals and
                        excessive moisture.
                      </p>
                    </div>
                  </details>

                  <details>
                    <summary>Need Assistance?</summary>

                    <div className="accordion-content">
                      <p>
                        Contact our team on WhatsApp for product information,
                        availability or any questions about this jewellery
                        piece.
                      </p>
                    </div>
                  </details>
                </div>
              </div>
            </aside>
          </div>
        </section>

        {/* RELATED PRODUCTS */}

        {relatedProducts.length > 0 && (
          <section className="related-products-section">
            <div className="related-heading">
              <p className="section-eyebrow">CURATED FOR YOU</p>

              <h2>You May Also Like</h2>

              <p>
                Discover more pieces selected from our jewellery collection.
              </p>
            </div>

            <div className="product-grid">
              {relatedProducts.map((relatedProduct) => (
                <ProductCard
                  key={relatedProduct.uuid}
                  product={relatedProduct}
                />
              ))}
            </div>
          </section>
        )}
      </main>

      <Footer />
    </>
  );
};

export default ProductDetailsPage;
