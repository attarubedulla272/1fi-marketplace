import { useState, useEffect } from 'react';
import axios from 'axios';
import ShopTabs from '../components/ShopTabs/ShopTabs';
import ProductCard from '../components/ProductCard/ProductCard';
import styles from './Shop.module.css';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

function Shop() {
  const [activeTab, setActiveTab] = useState('marketplace');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await axios.get(`${API_BASE}/api/products`);
      setProducts(res.data.data);
    } catch (err) {
      console.error('Failed to fetch products:', err);
      setError('Unable to load products. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderPlaceholder = (icon, title, text) => (
    <div className={styles.placeholder}>
      <div className={styles.placeholderIcon}>{icon}</div>
      <h2 className={styles.placeholderTitle}>{title}</h2>
      <p className={styles.placeholderText}>{text}</p>
    </div>
  );

  const renderSkeleton = () => (
    <div className={styles.loadingGrid}>
      {[1, 2, 3].map(i => (
        <div key={i} className={styles.skeletonCard}>
          <div className={`skeleton ${styles.skeletonImage}`} />
          <div className={styles.skeletonBody}>
            <div className={`skeleton ${styles.skeletonLine}`} />
            <div className={`skeleton ${styles.skeletonLine} ${styles.skeletonLineShort}`} />
            <div className={`skeleton ${styles.skeletonLinePrice}`} />
          </div>
        </div>
      ))}
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'brands':
        return renderPlaceholder('🏷️', 'Top Brands', 'Discover premium brands with exclusive EMI offers. Coming soon to 1Fi Marketplace.');
      case 'stores':
        return renderPlaceholder('📍', 'Nearby Stores', 'Find partner stores near you for in-person shopping with EMI options. Coming soon.');
      case 'marketplace':
        if (loading) return renderSkeleton();
        if (error) {
          return (
            <div className={styles.error}>
              <div className={styles.errorIcon}>⚠️</div>
              <p className={styles.errorText}>{error}</p>
              <button className={styles.retryBtn} onClick={fetchProducts}>Try Again</button>
            </div>
          );
        }
        return (
          <>
            <div className={styles.marketplaceHeader}>
              <div>
                <h1 className={styles.sectionTitle}>1Fi Marketplace</h1>
                <p className={styles.sectionSubtitle}>Shop with mutual fund backed EMI plans</p>
              </div>
              <span className={styles.productCount}>{products.length} products</span>
            </div>
            <div className={styles.productGrid}>
              {products.map(product => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className={styles.shopPage}>
      <ShopTabs activeTab={activeTab} onTabChange={setActiveTab} />
      <div className={styles.tabContent}>
        {renderContent()}
      </div>
    </div>
  );
}

export default Shop;
