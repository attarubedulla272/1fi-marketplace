import { Link } from 'react-router-dom';
import styles from './ProductCard.module.css';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

function ProductCard({ product }) {
  const discountPercent = product.startingMRP > product.startingPrice
    ? Math.round(((product.startingMRP - product.startingPrice) / product.startingMRP) * 100)
    : 0;

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN').format(price);
  };

  return (
    <Link to={`/products/${product.slug}`} className={styles.card}>
      <div className={styles.imageWrapper}>
        <span className={styles.brandBadge}>{product.brand}</span>
        <img
          src={`${API_BASE}${product.image}`}
          alt={product.name}
          className={styles.productImage}
          loading="lazy"
        />
        {product.rating && (
          <div className={styles.ratingBadge}>
            <span>{product.rating}</span>
            <span className={styles.star}>★</span>
          </div>
        )}
      </div>
      <div className={styles.cardBody}>
        <h3 className={styles.productName}>{product.name}</h3>
        <span className={styles.variantInfo}>
          {product.variantCount} variant{product.variantCount > 1 ? 's' : ''} available
        </span>
        <div className={styles.priceSection}>
          <span className={styles.price}>₹{formatPrice(product.startingPrice)}</span>
          {discountPercent > 0 && (
            <>
              <span className={styles.mrp}>₹{formatPrice(product.startingMRP)}</span>
              <span className={styles.discount}>{discountPercent}% off</span>
            </>
          )}
        </div>
        <div className={styles.emiInfo}>
          <span className={styles.emiLabel}>EMI from</span>
          <span className={styles.emiPrice}>₹{formatPrice(product.startingEMI)}</span>
          <span className={styles.emiTenure}>/month</span>
        </div>
      </div>
    </Link>
  );
}

export default ProductCard;
