import { Link, useLocation } from 'react-router-dom';
import styles from './Header.module.css';

function Header() {
  const location = useLocation();
  
  return (
    <header className={styles.header}>
      <div className={styles.headerInner}>
        <Link to="/shop" className={styles.logoSection}>
          <div className={styles.logoIcon}>
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M2 17L12 22L22 17" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M2 12L12 17L22 12" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div className={styles.logoText}>
            <span className={styles.logoName}>1Fi</span>
            <span className={styles.logoTagline}>Marketplace</span>
          </div>
        </Link>
        
        <nav className={styles.navLinks}>
          <Link 
            to="/shop" 
            className={`${styles.navLink} ${location.pathname === '/shop' ? styles.navLinkActive : ''}`}
          >
            Shop
          </Link>
        </nav>

        <div className={styles.searchBar}>
          <svg className={styles.searchIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <path d="M21 21l-4.35-4.35" />
          </svg>
          <input 
            type="text" 
            placeholder="Search phones, tablets..." 
            className={styles.searchInput}
          />
        </div>
      </div>
    </header>
  );
}

export default Header;
