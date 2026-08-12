import { Heart, Minus, Plus, ShoppingBag, Star } from "lucide-react";
import { useMemo, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import ProductCard from "../components/ProductCard";
import { products } from "../data/products";
import Footer from "../components/Footer";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

const ProductDetailsPage = () => {
  const { slug } = useParams();

  const product = products.find((item) => item.slug === slug);

  const [selectedSize, setSelectedSize] = useState(product?.sizes?.[0] || "");

  const [quantity, setQuantity] = useState(1);

  const pageRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.from(".product-gallery", {
        opacity: 0,
        x: -30,
        duration: 1.0,
        ease: "power2.inOut",
      });

      gsap.from(".product-info-inner", {
        opacity: 0,
        x: 30,
        duration: 1.0,
        delay: 0.15,
        ease: "power2.inOut",
      });

      gsap.from(".product-details-breadcrumb", {
        opacity: 0,
        y: -10,
        duration: 0.5,
        ease: "power2.out",
      });

      gsap.from(".related-heading > *", {
        opacity: 0,
        y: 20,
        duration: 0.6,
        stagger: 0.1,
        delay: 0.5,
        ease: "power2.out",
      });

      gsap.from(".related-products-section .product-card", {
        opacity: 0,
        y: 25,
        duration: 0.6,
        stagger: 0.08,
        delay: 0.65,
        ease: "power2.out",
      });
    },
    {
      scope: pageRef,
      dependencies: [product],
    },
  );

  const relatedProducts = useMemo(() => {
    if (!product) return [];

    return products.filter((item) => item.id !== product.id).slice(0, 4);
  }, [product]);

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
      </>
    );
  }

  const galleryImages =
    product.images.length > 0 ? product.images : [product.image];

  return (
    <>
      <Navbar />

      <main ref={pageRef}>
        <section className="product-details-section">
          <div className="product-details-breadcrumb">
            <Link to="/products">Jewellery</Link>

            <span>/</span>

            <span>{product.category}</span>

            <span>/</span>

            <span>{product.name}</span>
          </div>

          <div className="product-details-layout">
            {/* LEFT GALLERY */}

            <div className="product-gallery">
              <div className="gallery-grid">
                {galleryImages.map((image, index) => (
                  <div
                    className="gallery-image-wrapper"
                    key={`${image}-${index}`}
                  >
                    <img
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      className="gallery-image"
                    />
                  </div>
                ))}

                {galleryImages.length === 1 && (
                  <>
                    <div className="gallery-image-wrapper secondary-gallery">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="gallery-image"
                      />
                    </div>

                    <div className="gallery-image-wrapper secondary-gallery">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="gallery-image"
                      />
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* RIGHT PRODUCT INFO */}

            <aside className="product-info">
              <div className="product-info-inner">
                <p className="product-details-collection">
                  {product.collection}
                </p>

                <div className="product-title-row">
                  <h1>{product.name}</h1>

                  <button
                    type="button"
                    className="details-wishlist-button"
                    aria-label="Add to wishlist"
                  >
                    <Heart size={21} />
                  </button>
                </div>

                <p className="details-price">
                  ₹{product.price.toLocaleString("en-IN")}
                </p>

                <div className="rating-row">
                  <div className="stars">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} size={13} fill="currentColor" />
                    ))}
                  </div>

                  <span>4.9</span>

                  <span className="rating-divider">•</span>

                  <button type="button" className="reviews-button">
                    18 Reviews
                  </button>
                </div>

                <p className="product-description">{product.description}</p>

                <div className="details-divider" />

                <div className="product-option-section">
                  <div className="option-heading-row">
                    <span>Material</span>

                    <span className="selected-option">{product.material}</span>
                  </div>

                  <div className="material-options">
                    <button type="button" className="material-option active">
                      <span className="material-circle gold-circle" />
                      Yellow Gold
                    </button>

                    <button type="button" className="material-option">
                      <span className="material-circle rose-circle" />
                      Rose Gold
                    </button>

                    <button type="button" className="material-option">
                      <span className="material-circle white-circle" />
                      White Gold
                    </button>
                  </div>
                </div>

                {product.sizes.length > 0 && (
                  <div className="product-option-section">
                    <div className="option-heading-row">
                      <span>Select Size</span>

                      <button type="button" className="size-guide">
                        Size Guide
                      </button>
                    </div>

                    <div className="size-options">
                      {product.sizes.map((size) => (
                        <button
                          type="button"
                          key={size}
                          className={`size-button ${
                            selectedSize === size ? "active" : ""
                          }`}
                          onClick={() => setSelectedSize(size)}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="purchase-row">
                  <div className="quantity-selector">
                    <button
                      type="button"
                      onClick={() =>
                        setQuantity((current) => Math.max(1, current - 1))
                      }
                    >
                      <Minus size={15} />
                    </button>

                    <span>{quantity}</span>

                    <button
                      type="button"
                      onClick={() => setQuantity((current) => current + 1)}
                    >
                      <Plus size={15} />
                    </button>
                  </div>

                  <button type="button" className="add-to-bag-button">
                    <ShoppingBag size={17} />
                    Add to Bag
                  </button>
                </div>

                <p className="shipping-note">
                  Complimentary insured shipping on all orders.
                </p>

                <div className="product-accordions">
                  <details open>
                    <summary>Product Details</summary>

                    <div className="accordion-content">
                      <p>
                        Crafted with attention to detail and designed for
                        timeless everyday elegance.
                      </p>

                      <p>
                        <strong>Material:</strong> {product.material}
                      </p>

                      <p>
                        <strong>Collection:</strong> {product.collection}
                      </p>
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
                    <summary>Shipping & Returns</summary>

                    <div className="accordion-content">
                      <p>
                        Orders are carefully packaged and dispatched with
                        insured delivery.
                      </p>
                    </div>
                  </details>
                </div>
              </div>
            </aside>
          </div>
        </section>

        {/* RELATED PRODUCTS */}

        <section className="related-products-section">
          <div className="related-heading">
            <p className="section-eyebrow">CURATED FOR YOU</p>

            <h2>You May Also Like</h2>

            <p>
              Complete your collection with pieces selected to complement this
              design.
            </p>
          </div>

          <div className="product-grid">
            {relatedProducts.map((relatedProduct) => (
              <ProductCard key={relatedProduct.id} product={relatedProduct} />
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default ProductDetailsPage;
