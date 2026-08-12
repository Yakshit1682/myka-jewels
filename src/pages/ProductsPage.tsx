// src/pages/ProductsPage.tsx

import { ChevronDown, SlidersHorizontal } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import gsap from "gsap";
import { useGSAP } from "@gsap/react";

import Navbar from "../components/Navbar";
import ProductCard from "../components/ProductCard";
import Footer from "../components/Footer";

import { getProducts } from "../api/products.api";
import { getCategories } from "../api/categories.api";

import type { Product, Category } from "../types/product";

const ProductsPage = () => {
  const pageRef = useRef<HTMLDivElement>(null);

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  const [selectedCategory, setSelectedCategory] = useState<string>("");

  const [loading, setLoading] = useState(true);

  const loadProducts = async (category?: string) => {
    try {
      setLoading(true);

      const response = await getProducts({
        category: category || undefined,
        limit: 50,
      });

      if (response.success) {
        setProducts(response.data || []);
      }
    } catch (error) {
      console.error("Load products error:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const response = await getCategories();

      if (response.success) {
        setCategories(response.data || []);
      }
    } catch (error) {
      console.error("Load categories error:", error);
    }
  };

  useEffect(() => {
    loadCategories();
    loadProducts();
  }, []);

  useGSAP(
    () => {
      gsap.from(".products-hero > *", {
        opacity: 0,
        y: 20,
        duration: 0.7,
        stagger: 0.1,
        ease: "power2.out",
      });

      gsap.from(".products-toolbar", {
        opacity: 0,
        y: 15,
        duration: 0.6,
        delay: 0.3,
        ease: "power2.out",
      });
    },
    {
      scope: pageRef,
    },
  );

  useEffect(() => {
    if (products.length === 0) return;

    gsap.fromTo(
      ".product-card",
      {
        opacity: 0,
        y: 25,
      },
      {
        opacity: 1,
        y: 0,
        duration: 0.55,
        stagger: 0.06,
        ease: "power2.out",
      },
    );
  }, [products]);

  const handleCategory = async (slug: string) => {
    setSelectedCategory(slug);

    await loadProducts(slug);
  };

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
            <button
              className={selectedCategory === "" ? "active" : ""}
              onClick={() => handleCategory("")}
            >
              All Jewellery
            </button>

            {categories.map((category) => (
              <button
                key={category.uuid}
                className={selectedCategory === category.slug ? "active" : ""}
                onClick={() => handleCategory(category.slug)}
              >
                {category.name}
              </button>
            ))}
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

          {loading ? (
            <div className="products-loading">Loading jewellery...</div>
          ) : (
            <div className="product-grid">
              {products.map((product) => (
                <ProductCard key={product.uuid} product={product} />
              ))}
            </div>
          )}

          {!loading && products.length === 0 && (
            <div className="products-empty">
              No jewellery found in this collection.
            </div>
          )}
        </section>
      </main>

      <Footer />
    </>
  );
};

export default ProductsPage;
