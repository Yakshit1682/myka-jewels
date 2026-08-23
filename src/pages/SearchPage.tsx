import { Search, X } from "lucide-react";

import { useEffect, useRef, useState } from "react";

// import Navbar from "../components/Navbar";
// import Footer from "../components/Footer";
import ProductCard from "../components/ProductCard";
import PageLoader from "../components/PageLoader";
import NoProductsFound from "../components/NoProductsFound";

import { getProducts } from "../api/products.api";

import type { Product } from "../types/product";

const SearchPage = () => {
  const inputRef = useRef<HTMLInputElement>(null);

  const [search, setSearch] = useState("");

  const [products, setProducts] = useState<Product[]>([]);

  const [loading, setLoading] = useState(false);

  const [hasSearched, setHasSearched] = useState(false);

  /*
   * Focus input when page opens
   */
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  /*
   * Debounced global product search
   */
  useEffect(() => {
    const query = search.trim();

    if (!query) {
      setProducts([]);
      setHasSearched(false);
      setLoading(false);

      return;
    }

    const timeout = setTimeout(async () => {
      try {
        setLoading(true);

        const response = await getProducts({
          search: query,
          limit: 50,
        });

        if (response.success) {
          setProducts(response.data || []);
        }

        setHasSearched(true);
      } catch (error) {
        console.error("Search products error:", error);

        setProducts([]);
        setHasSearched(true);
      } finally {
        setLoading(false);
      }
    }, 400);

    return () => {
      clearTimeout(timeout);
    };
  }, [search]);

  const clearSearch = () => {
    setSearch("");
    setProducts([]);
    setHasSearched(false);

    inputRef.current?.focus();
  };

  return (
    <>
      {/* <Navbar /> */}

      <main className="search-page">
        <section className="search-page-header">
          <p className="section-eyebrow">DISCOVER MYKA</p>

          <h1>Search Jewellery</h1>

          <p>Find pieces by name, material, collection or style.</p>

          <div className="global-search-box">
            <Search size={20} strokeWidth={1.4} />

            <input
              ref={inputRef}
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search rings, earrings, gold..."
              aria-label="Search jewellery"
            />

            {search && (
              <button
                type="button"
                onClick={clearSearch}
                aria-label="Clear search"
              >
                <X size={18} />
              </button>
            )}
          </div>
        </section>

        <section className="search-results-section">
          {!search.trim() && (
            <div className="search-empty-state">
              <Search size={34} strokeWidth={1} />

              <h2>What are you looking for?</h2>

              <p>
                Search our jewellery collection using a product name, material
                or style.
              </p>
            </div>
          )}

          {loading && <PageLoader text="Searching jewellery..." />}

          {!loading && hasSearched && products.length > 0 && (
            <>
              <div className="search-results-heading">
                <div>
                  <span>SEARCH RESULTS</span>

                  <h2>Results for “{search}”</h2>
                </div>

                <p>
                  {products.length} {products.length === 1 ? "piece" : "pieces"}
                </p>
              </div>

              <div className="product-grid">
                {products.map((product) => (
                  <ProductCard key={product.uuid} product={product} />
                ))}
              </div>
            </>
          )}

          {!loading && hasSearched && products.length === 0 && (
            <NoProductsFound onClearFilters={clearSearch} />
          )}
        </section>
      </main>

      {/* <Footer />   */}
    </>
  );
};

export default SearchPage;
