import { Heart } from "lucide-react";
import { Link } from "react-router-dom";
import type { Product } from "../types/product";

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  return (
    <article className="product-card">
      <Link to={`/products/${product.slug}`} className="product-image-wrapper">
        <img src={product.image} alt={product.name} className="product-image" />

        <button
          className="wishlist-button"
          onClick={(event) => event.preventDefault()}
        >
          <Heart size={19} />
        </button>

        <span className="quick-view">View Details</span>
      </Link>

      <div className="product-content">
        <p className="product-collection">{product.collection}</p>

        <Link to={`/products/${product.slug}`} className="product-name">
          {product.name}
        </Link>

        <p className="product-price">
          ₹{product.price.toLocaleString("en-IN")}
        </p>
      </div>
    </article>
  );
};

export default ProductCard;
