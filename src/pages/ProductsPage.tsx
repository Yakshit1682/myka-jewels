import { ChevronDown, SlidersHorizontal } from "lucide-react";
import { useRef } from "react";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

import Navbar from "../components/Navbar";
import ProductCard from "../components/ProductCard";
import Footer from "../components/Footer";
import { products } from "../data/products";

// gsap.registerPlugin(ScrollTrigger);

const ProductsPage = () => {
  const pageRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      // Hero
      gsap.from(".products-hero > *", {
        opacity: 0,
        y: 20,
        duration: 0.7,
        stagger: 0.1,
        ease: "power2.out",
      });

      // Toolbar
      gsap.from(".products-toolbar", {
        opacity: 0,
        y: 15,
        duration: 0.6,
        delay: 0.3,
        ease: "power2.out",
      });

      // Product cards
      gsap.from(".product-card", {
        opacity: 0,
        y: 25,
        duration: 0.6,
        delay: 0.4,
        stagger: 0.08,
        ease: "power2.out",
      });
    },
    {
      scope: pageRef,
    },
  );

  return (
    <>
      <Navbar />

      <main ref={pageRef}>
        <section className="products-hero">
          <p className="breadcrumb">Home / Jewellery</p>

          <p className="section-eyebrow">DISCOVER OUR COLLECTION</p>

          <h1>Fine Jewellery</h1>

          <p className="products-hero-description">
            Timeless pieces thoughtfully created to bring elegance to every
            moment.
          </p>

          <div className="category-nav">
            <button className="active">All Jewellery</button>

            <button>Rings</button>

            <button>Earrings</button>

            <button>Necklaces</button>

            <button>Bracelets</button>
          </div>
        </section>

        <section className="products-section">
          <div className="products-toolbar">
            <button className="filter-button">
              <SlidersHorizontal size={17} />
              Filter By
            </button>

            <span className="product-count">{products.length} Products</span>

            <button className="sort-button">
              Sort: Featured
              <ChevronDown size={16} />
            </button>
          </div>

          <div className="product-grid">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
};

export default ProductsPage;
