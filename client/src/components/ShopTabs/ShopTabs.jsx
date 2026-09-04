import styles from './ShopTabs.module.css';

function ShopTabs({ activeTab, onTabChange }) {
  const tabs = [
    { id: 'brands', label: 'Top Brands', icon: '🏷️' },
    { id: 'stores', label: 'Nearby Stores', icon: '📍' },
    { id: 'marketplace', label: '1Fi Marketplace', icon: '🛒' },
  ];

  return (
    <div className={styles.tabContainer}>
      <div className={styles.tabInner}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`${styles.tab} ${activeTab === tab.id ? styles.tabActive : ''}`}
            onClick={() => onTabChange(tab.id)}
          >
            <span className={styles.tabIcon}>{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export default ShopTabs;
