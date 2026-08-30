import { ChevronDown, Search, SlidersHorizontal, X } from "lucide-react";

import { useEffect, useRef, useState } from "react";

import gsap from "gsap";

import { useGSAP } from "@gsap/react";

import { useSearchParams } from "react-router-dom";

// import Navbar from "../components/Navbar";

import ProductCard from "../components/ProductCard";

// import Footer from "../components/Footer";

import { getProducts } from "../api/products.api";

import { getCategories } from "../api/categories.api";

import type { Product, Category } from "../types/product";

import PageLoader from "../components/PageLoader";

import NoProductsFound from "../components/NoProductsFound";

const ProductsPage = () => {
  const pageRef = useRef<HTMLDivElement>(null);

  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedCollection, setSelectedCollection] = useState(
    searchParams.get("collection") || "",
  );

  /*
  |--------------------------------------------------------------------------
  | DATA
  |--------------------------------------------------------------------------
  */

  const [products, setProducts] = useState<Product[]>([]);

  const [categories, setCategories] = useState<Category[]>([]);

  

  /*
  |--------------------------------------------------------------------------
  | FILTER STATE
  |--------------------------------------------------------------------------
  |
  | Initial values come from URL.
  |
  */

  const [selectedCategory, setSelectedCategory] = useState(
    searchParams.get("category") || "",
  );

  const [featuredOnly, setFeaturedOnly] = useState(
    searchParams.get("featured") === "true",
  );

  const [stockStatus, setStockStatus] = useState(
    searchParams.get("stock_status") || "",
  );

  const [search, setSearch] = useState(searchParams.get("search") || "");

  const [minPrice, setMinPrice] = useState(searchParams.get("min_price") || "");

  const [maxPrice, setMaxPrice] = useState(searchParams.get("max_price") || "");

  const [sort, setSort] = useState(searchParams.get("sort") || "featured");

  const [filterOpen, setFilterOpen] = useState(false);

  const [loading, setLoading] = useState(true);

  /*
  |--------------------------------------------------------------------------
  | LOAD PRODUCTS
  |--------------------------------------------------------------------------
  */

  const loadProducts = async () => {
    try {
      setLoading(true);

      const response = await getProducts({
        category: selectedCategory || undefined,

        collection: selectedCollection || undefined,

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

  /*
  |--------------------------------------------------------------------------
  | LOAD CATEGORIES
  |--------------------------------------------------------------------------
  */

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
  |--------------------------------------------------------------------------
  | UPDATE URL QUERY STRING
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    const params = new URLSearchParams();

    if (selectedCategory) {
      params.set("category", selectedCategory);
    }

    if (selectedCollection) {
      params.set("collection", selectedCollection);
    }

    if (featuredOnly) {
      params.set("featured", "true");
    }

    if (stockStatus) {
      params.set("stock_status", stockStatus);
    }

    if (search.trim()) {
      params.set("search", search.trim());
    }

    if (minPrice) {
      params.set("min_price", minPrice);
    }

    if (maxPrice) {
      params.set("max_price", maxPrice);
    }

    /*
     * Don't clutter URL with
     * default sort value.
     */
    if (sort !== "featured") {
      params.set("sort", sort);
    }

    setSearchParams(params, {
      replace: true,
    });
  }, [
    selectedCategory,
    selectedCollection,
    featuredOnly,
    stockStatus,
    search,
    minPrice,
    maxPrice,
    sort,
    setSearchParams,
  ]);

  /*
  |--------------------------------------------------------------------------
  | LOAD PRODUCTS WHEN FILTER CHANGES
  |--------------------------------------------------------------------------
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
    selectedCollection,
    featuredOnly,
    stockStatus,
    minPrice,
    maxPrice,
    sort,
    search,
  ]);

  /*
  |--------------------------------------------------------------------------
  | PAGE ANIMATION
  |--------------------------------------------------------------------------
  */

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

  /*
  |--------------------------------------------------------------------------
  | PRODUCT ANIMATION
  |--------------------------------------------------------------------------
  */

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

  /*
  |--------------------------------------------------------------------------
  | RESET FILTERS
  |--------------------------------------------------------------------------
  */

  const resetFilters = () => {
    setSelectedCategory("");

    setSelectedCollection("");

    setFeaturedOnly(false);

    setStockStatus("");

    setSearch("");

    setMinPrice("");

    setMaxPrice("");

    setSort("featured");

    /*
     * This immediately clears URL too.
     */
    setSearchParams({});
  };

  /*
  |--------------------------------------------------------------------------
  | ACTIVE FILTER COUNT
  |--------------------------------------------------------------------------
  */

  const activeFilterCount = [
    selectedCategory,

    featuredOnly,

    stockStatus,

    minPrice,

    maxPrice,

    search,
  ].filter(Boolean).length;

  /*
  |--------------------------------------------------------------------------
  | JSX
  |--------------------------------------------------------------------------
  */

  const selectedSlug = searchParams.get("category") || "";

  const selectedParent:any = categories.find(
    (category) =>
      category.slug === selectedSlug ||
      category.children?.some((child: any) => child.slug === selectedSlug),
  );

  const selectedChild = selectedParent?.children?.find(
    (child: any) => child.slug === selectedSlug,
  );

  // const selectCategory = (slug: string) => {
  //   if (slug) {
  //     setSelectedCategory;(slug);
  //   } else {
  //     setSelectedCategory("");
  //   }
  // };

  return (
    <>
      {/* <Navbar /> */}

      <main ref={pageRef}>
        {/* HERO */}

        <section className="products-hero">
          <p className="breadcrumb">Home / Jewellery</p>

          <p className="section-eyebrow">DISCOVER OUR COLLECTION</p>

          <h1>Fine Jewellery</h1>

          <p className="products-hero-description">
            Timeless pieces thoughtfully created to bring elegance to every
            moment.
          </p>

          {/* CATEGORY NAV */}

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
                className={
                  selectedParent?.uuid === category.uuid ? "active" : ""
                }
                onClick={() => setSelectedCategory(category.slug)}
              >
                {category.name}
              </button>
            ))}
          </div>
          <hr/>
          {selectedParent?.children?.length > 0 && (
            <div className="category-nav subcategory-nav">
              {selectedParent.children.map((child: any) => (
                <button
                  key={child.uuid}
                  className={selectedChild?.uuid === child.uuid ? "active" : ""}
                  onClick={() => setSelectedCategory(child.slug)}
                >
                  {child.name}
                </button>
              ))}
            </div>
          )}
        </section>

        {/* PRODUCTS */}

        <section className="products-section">
          {/* TOOLBAR */}

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

          {/* FILTER PANEL */}

          {filterOpen && (
            <div className="products-filter-panel">
              {/* SEARCH */}

              <div className="product-filter-search">
                <Search size={16} />

                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search jewellery..."
                />
              </div>

              {/* FEATURED */}

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

              {/* AVAILABILITY */}

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

              {/* PRICE */}

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

              {/* RESET */}

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

          {/* PRODUCTS */}

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

      {/* <Footer /> */}
    </>
  );
};

export default ProductsPage;
