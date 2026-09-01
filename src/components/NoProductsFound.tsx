import { RotateCcw, Search } from "lucide-react";

interface NoProductsFoundProps {
  onClearFilters?: () => void;
}

const NoProductsFound = ({ onClearFilters }: NoProductsFoundProps) => {
  return (
    <div className="no-products-found">
      <div className="no-products-decoration">
        <span />

        <div className="no-products-icon">
          <span aria-hidden="true" style={{ fontSize: "28px" }}>
            &#10024;
          </span>
        </div>

        <span />
      </div>

      <p className="no-products-eyebrow">NOTHING FOUND</p>

      <h2>No jewellery found</h2>

      <p className="no-products-description">
        We couldn't find any pieces matching your current selection. Try
        adjusting your filters or explore our complete collection.
      </p>

      {onClearFilters && (
        <button
          type="button"
          className="no-products-button"
          onClick={onClearFilters}
        >
          <RotateCcw size={14} />
          Clear All Filters
        </button>
      )}

      <div className="no-products-hint">
        <Search size={13} />

        <span>Try another category, price range or search.</span>
      </div>
    </div>
  );
};

export default NoProductsFound;
