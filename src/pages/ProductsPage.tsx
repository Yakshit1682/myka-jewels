import { ChevronDown, Search, SlidersHorizontal, X } from "lucide-react";

import { useEffect, useRef, useState } from "react";

import gsap from "gsap";
import { useGSAP } from "@gsap/react";

import Navbar from "../components/Navbar";
import ProductCard from "../components/ProductCard";
import Footer from "../components/Footer";

import { getProducts } from "../api/products.api";

import { getCategories } from "../api/categories.api";

import type { Product, Category } from "../types/product";
import PageLoader from "../components/PageLoader";
import NoProductsFound from "../components/NoProductsFound";

const ProductsPage = () => {
  const pageRef = useRef<HTMLDivElement>(null);

  const [products, setProducts] = useState<Product[]>([]);

  const [categories, setCategories] = useState<Category[]>([]);

  const [selectedCategory, setSelectedCategory] = useState("");

  const [featuredOnly, setFeaturedOnly] = useState(false);

  const [stockStatus, setStockStatus] = useState("");

  const [search, setSearch] = useState("");

  const [minPrice, setMinPrice] = useState("");

  const [maxPrice, setMaxPrice] = useState("");

  const [sort, setSort] = useState("featured");

  const [filterOpen, setFilterOpen] = useState(false);

  const [loading, setLoading] = useState(true);

  const loadProducts = async () => {
    try {
      setLoading(true);

      const response = await getProducts({
        category: selectedCategory || undefined,

        featured: featuredOnly ? true : undefined,

        search: search.trim() || undefined,

        stock_status: stockStatus || undefined,

        min_price: minPrice ? Number(minPrice) : undefined,

        max_price: maxPrice ? Number(maxPrice) : undefined,

        sort,

        limit: 20,
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
  }, []);

  /*
   * Reload whenever filter changes
   */
  useEffect(() => {
    const timeout = setTimeout(() => {
      loadProducts();
    }, 250);

    return () => {
      clearTimeout(timeout);
    };
  }, [
    selectedCategory,
    featuredOnly,
    stockStatus,
    minPrice,
    maxPrice,
    sort,
    search,
  ]);

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
    if (products.length === 0) {
      return;
    }

    const tween = gsap.fromTo(
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

    return () => {
      tween.kill();
    };
  }, [products]);

  const resetFilters = () => {
    setSelectedCategory("");
    setFeaturedOnly(false);
    setStockStatus("");
    setSearch("");
    setMinPrice("");
    setMaxPrice("");
    setSort("featured");
  };

  const activeFilterCount = [
    selectedCategory,
    featuredOnly,
    stockStatus,
    minPrice,
    maxPrice,
    search,
  ].filter(Boolean).length;

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
              onClick={() => setSelectedCategory("")}
            >
              All Jewellery
            </button>

            {categories.map((category) => (
              <button
                key={category.uuid}
                className={selectedCategory === category.slug ? "active" : ""}
                onClick={() => setSelectedCategory(category.slug)}
              >
                {category.name}
              </button>
            ))}
          </div>
        </section>

        <section className="products-section">
          <div className="products-toolbar">
            <button
              className={`filter-button ${filterOpen ? "active" : ""}`}
              onClick={() => setFilterOpen(!filterOpen)}
            >
              <SlidersHorizontal size={17} />
              Filter By
              {activeFilterCount > 0 && (
                <span className="filter-count">{activeFilterCount}</span>
              )}
            </button>

            <span className="product-count">{products.length} Products</span>

            <div className="sort-wrapper">
              <select
                value={sort}
                onChange={(event) => setSort(event.target.value)}
                className="products-sort-select"
              >
                <option value="featured">Featured</option>

                <option value="newest">Newest</option>

                <option value="price_asc">Price: Low to High</option>

                <option value="price_desc">Price: High to Low</option>
              </select>

              <ChevronDown size={15} />
            </div>
          </div>

          {filterOpen && (
            <div className="products-filter-panel">
              <div className="product-filter-search">
                <Search size={16} />

                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search jewellery..."
                />
              </div>

              <div className="product-filter-group">
                <span>Featured</span>

                <label className="featured-filter">
                  <input
                    type="checkbox"
                    checked={featuredOnly}
                    onChange={(event) => setFeaturedOnly(event.target.checked)}
                  />
                  Featured Only
                </label>
              </div>

              <div className="product-filter-group">
                <span>Availability</span>

                <select
                  value={stockStatus}
                  onChange={(event) => setStockStatus(event.target.value)}
                >
                  <option value="">All</option>

                  <option value="IN_STOCK">In Stock</option>

                  <option value="ON_REQUEST">On Request</option>

                  <option value="OUT_OF_STOCK">Out of Stock</option>
                </select>
              </div>

              <div className="product-filter-group">
                <span>Price Range</span>

                <div className="price-filter-row">
                  <input
                    type="number"
                    min="0"
                    value={minPrice}
                    onChange={(event) => setMinPrice(event.target.value)}
                    placeholder="Min ₹"
                  />

                  <input
                    type="number"
                    min="0"
                    value={maxPrice}
                    onChange={(event) => setMaxPrice(event.target.value)}
                    placeholder="Max ₹"
                  />
                </div>
              </div>

              {activeFilterCount > 0 && (
                <button
                  type="button"
                  className="reset-product-filters"
                  onClick={resetFilters}
                >
                  <X size={14} />
                  Clear Filters
                </button>
              )}
            </div>
          )}

          {loading ? (
            <PageLoader text="Loading jewellery..." />
          ) : (
            <div className="product-grid">
              {products.map((product) => (
                <ProductCard key={product.uuid} product={product} />
              ))}
            </div>
          )}

          {!loading && products.length === 0 && (
            <NoProductsFound onClearFilters={resetFilters} />
          )}
        </section>
      </main>

      <Footer />
    </>
  );
};

export default ProductsPage;
