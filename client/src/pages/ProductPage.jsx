import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import styles from './ProductPage.module.css';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

function ProductPage() {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(0);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    fetchProduct();
  }, [slug]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await axios.get(`${API_BASE}/api/products/${slug}`);
      setProduct(res.data.data);
      // Auto-select the "Most Popular" plan or the first one
      const popularIdx = res.data.data.emiPlans.findIndex(p => p.tag === 'Most Popular');
      setSelectedPlan(popularIdx >= 0 ? popularIdx : 0);
    } catch (err) {
      console.error('Failed to fetch product:', err);
      setError('Product not found');
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price) => new Intl.NumberFormat('en-IN').format(price);

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span key={i} className={i <= Math.round(rating) ? styles.starFilled : styles.starEmpty}>
          ★
        </span>
      );
    }
    return stars;
  };

  if (loading) {
    return (
      <div className={styles.productPage}>
        <div className={styles.loading}>
          <div className={`skeleton ${styles.loadingImage}`} />
          <div className={styles.loadingDetails}>
            <div className={`skeleton ${styles.loadingLine} ${styles.loadingLineShort}`} />
            <div className={`skeleton ${styles.loadingLine}`} />
            <div className={`skeleton ${styles.loadingLine} ${styles.loadingLineXS}`} />
            <div className={`skeleton ${styles.loadingLine}`} style={{ height: 40 }} />
            <div className={`skeleton ${styles.loadingLine}`} style={{ height: 60 }} />
            <div className={`skeleton ${styles.loadingLine}`} style={{ height: 60 }} />
            <div className={`skeleton ${styles.loadingLine}`} style={{ height: 60 }} />
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className={styles.productPage}>
        <div className={styles.errorState}>
          <div className={styles.errorIcon}>📱</div>
          <h2 className={styles.errorTitle}>Product Not Found</h2>
          <p className={styles.errorMessage}>
            The product you&apos;re looking for doesn&apos;t exist or has been removed.
          </p>
          <Link to="/shop" className={styles.backBtn}>Back to Shop</Link>
        </div>
      </div>
    );
  }

  const variant = product.variants[selectedVariant];
  const discountPercent = Math.round(((variant.mrp - variant.price) / variant.mrp) * 100);
  const plan = selectedPlan !== null ? product.emiPlans[selectedPlan] : null;

  return (
    <div className={styles.productPage}>
      {/* Breadcrumb */}
      <nav className={styles.breadcrumb}>
        <Link to="/shop" className={styles.breadcrumbLink}>Shop</Link>
        <span className={styles.breadcrumbSep}>›</span>
        <span className={styles.breadcrumbLink}>{product.category}</span>
        <span className={styles.breadcrumbSep}>›</span>
        <span className={styles.breadcrumbLink}>{product.brand}</span>
        <span className={styles.breadcrumbSep}>›</span>
        <span className={styles.breadcrumbCurrent}>{product.name}</span>
      </nav>

      <div className={styles.productLayout}>
        {/* Left: Image Gallery */}
        <div className={styles.imageSection}>
          <div className={styles.mainImageWrapper}>
            <img
              src={`${API_BASE}${product.images[activeImage]}`}
              alt={product.name}
              className={styles.mainImage}
            />
            {plan && plan.cashback && (
              <span className={styles.cashbackTag}>{plan.cashback}</span>
            )}
          </div>
          <div className={styles.thumbnailRow}>
            {product.images.map((img, idx) => (
              <button
                key={idx}
                className={`${styles.thumbnail} ${activeImage === idx ? styles.thumbnailActive : ''}`}
                onClick={() => setActiveImage(idx)}
              >
                <img src={`${API_BASE}${img}`} alt={`${product.name} view ${idx + 1}`} />
              </button>
            ))}
          </div>
        </div>

        {/* Right: Product Details */}
        <div className={styles.detailSection}>
          {/* Product Info */}
          <div className={styles.productHeader}>
            <span className={styles.brandPill}>{product.brand}</span>
            <h1 className={styles.productTitle}>
              {product.name} ({variant.color}, {variant.storage})
            </h1>
            <div className={styles.ratingRow}>
              <div className={styles.stars}>{renderStars(product.rating)}</div>
              <span className={styles.ratingText}>{product.rating}</span>
              <span className={styles.reviewCount}>({product.reviewCount.toLocaleString()} reviews)</span>
            </div>
          </div>

          {/* Variant Selector */}
          <div className={styles.variantSection}>
            <span className={styles.sectionLabel}>Select Variant</span>
            <div className={styles.variantGrid}>
              {product.variants.map((v, idx) => (
                <div
                  key={idx}
                  className={`${styles.variantCard} ${selectedVariant === idx ? styles.variantCardActive : ''} ${!v.inStock ? styles.variantCardDisabled : ''}`}
                  onClick={() => v.inStock && setSelectedVariant(idx)}
                >
                  <div className={styles.radioCircle + (selectedVariant === idx ? ` ${styles.radioCircleActive}` : '')}>
                    <div className={styles.radioDot + (selectedVariant === idx ? ` ${styles.radioDotActive}` : '')} />
                  </div>
                  <div className={styles.colorDot} style={{ backgroundColor: v.colorHex }} />
                  <div className={styles.variantDetails}>
                    <div className={styles.variantName}>{v.color}</div>
                    <div className={styles.variantStorage}>{v.storage}</div>
                  </div>
                  {v.inStock ? (
                    <span className={styles.variantPrice}>₹{formatPrice(v.price)}</span>
                  ) : (
                    <span className={styles.outOfStock}>Out of Stock</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Price Display */}
          <div className={styles.priceBlock}>
            <div className={styles.priceRow}>
              <span className={styles.currentPrice}>₹{formatPrice(variant.price)}</span>
              <span className={styles.originalPrice}>₹{formatPrice(variant.mrp)}</span>
              {discountPercent > 0 && (
                <span className={styles.discountBadge}>{discountPercent}% off</span>
              )}
            </div>
            <span className={styles.priceNote}>Inclusive of all taxes</span>
          </div>

          {/* EMI Plans */}
          <div className={styles.emiSection}>
            <div className={styles.emiSectionHeader}>
              <span className={styles.emiSectionTitle}>Choose EMI Plan</span>
              <span className={styles.emiPoweredBy}>Backed by Mutual Funds</span>
            </div>
            <div className={styles.emiPlanList}>
              {product.emiPlans.map((emiPlan, idx) => (
                <div
                  key={idx}
                  className={`${styles.emiPlan} ${selectedPlan === idx ? styles.emiPlanActive : ''}`}
                  onClick={() => setSelectedPlan(idx)}
                >
                  <div className={styles.radioCircle + (selectedPlan === idx ? ` ${styles.radioCircleActive}` : '')}>
                    <div className={styles.radioDot + (selectedPlan === idx ? ` ${styles.radioDotActive}` : '')} />
                  </div>
                  <div className={styles.emiPlanContent}>
                    <div className={styles.emiPlanTop}>
                      <span className={styles.emiMonthly}>₹{formatPrice(emiPlan.monthlyPayment)}</span>
                      <span className={styles.emiPerMonth}>/month</span>
                    </div>
                    <div className={styles.emiPlanBottom}>
                      <span className={styles.emiTenure}>{emiPlan.tenure} months</span>
                      <span className={styles.emiTenure}>•</span>
                      <span className={emiPlan.interestRate === 0 ? styles.emiInterest : styles.emiInterestPaid}>
                        {emiPlan.interestRate === 0 ? '0% Interest' : `${emiPlan.interestRate}% Interest`}
                      </span>
                      {emiPlan.cashback && (
                        <span className={styles.emiCashback}>🎁 {emiPlan.cashback}</span>
                      )}
                    </div>
                    <span className={styles.emiFund}>{emiPlan.fundName}</span>
                  </div>
                  {emiPlan.tag && (
                    <span className={`${styles.emiTag} ${emiPlan.tag === 'Most Popular' ? '' : styles.emiTagGreen}`}>
                      {emiPlan.tag}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Description */}
          <div className={styles.descriptionSection}>
            <span className={styles.sectionLabel}>About this product</span>
            <p className={styles.descriptionText} style={{ marginTop: 10 }}>
              {product.description}
            </p>
          </div>
        </div>
      </div>

      {/* Sticky Footer */}
      {plan && (
        <div className={styles.stickyFooter}>
          <div className={styles.footerInner}>
            <div className={styles.footerPrice}>
              <span className={styles.footerLabel}>Selected EMI Plan</span>
              <div>
                <span className={styles.footerAmount}>₹{formatPrice(plan.monthlyPayment)}</span>
                <span className={styles.footerTenure}> /mo × {plan.tenure} months</span>
              </div>
            </div>
            <button className={styles.proceedBtn} onClick={() => alert('Proceeding with EMI plan! 🎉\n\nProduct: ' + product.name + '\nVariant: ' + variant.name + '\nPlan: ₹' + formatPrice(plan.monthlyPayment) + '/mo × ' + plan.tenure + ' months')}>
              Proceed with EMI →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProductPage;
