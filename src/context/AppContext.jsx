import React, { createContext, useContext, useState, useEffect } from 'react';
import { FEATURED_PROPERTIES, FEATURED_VEHICLES } from '../data/bhutanData';
import confetti from 'canvas-confetti';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [searchTab, setSearchTab] = useState('all'); // 'all', 'properties', 'vehicles'
  const [searchLocation, setSearchLocation] = useState('');
  const [propertyType, setPropertyType] = useState('All Types');
  const [category, setCategory] = useState('All Categories');
  const [budget, setBudget] = useState('Any Budget');

  // Currency: 'BTN' (Nu.), 'USD' ($), 'INR' (₹)
  const [currency, setCurrency] = useState('BTN');

  // Theme: 'light' | 'dark'
  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem('jigme_theme') || 'light';
    } catch {
      return 'light';
    }
  });

  // View Mode: 'grid' | 'map'
  const [viewMode, setViewMode] = useState('grid');

  const [properties, setProperties] = useState(FEATURED_PROPERTIES);
  const [vehicles, setVehicles] = useState(FEATURED_VEHICLES);
  const [favorites, setFavorites] = useState(() => {
    try {
      const saved = localStorage.getItem('jigme_v2_favs');
      return saved ? JSON.parse(saved) : ['prop-1', 'veh-1'];
    } catch {
      return ['prop-1', 'veh-1'];
    }
  });

  // Side-by-Side Comparison
  const [compareList, setCompareList] = useState([]);
  const [compareModalOpen, setCompareModalOpen] = useState(false);

  // AI Concierge
  const [tashiAIOpen, setTashiAIOpen] = useState(false);

  // Multi-Bank Loan Calculator Modal
  const [loanCalculatorOpen, setLoanCalculatorOpen] = useState(false);

  // Modals
  const [loginModal, setLoginModal] = useState({
    isOpen: false,
    roleId: null,
    isRegister: false
  });

  const [detailModal, setDetailModal] = useState({
    isOpen: false,
    item: null,
    type: 'property'
  });

  const [roleDashboardModal, setRoleDashboardModal] = useState({
    isOpen: false,
    roleId: null
  });

  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('jigme_v2_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Mobile menu drawer
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Toast
  const [toastMessage, setToastMessage] = useState(null);

  useEffect(() => {
    localStorage.setItem('jigme_v2_favs', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem('jigme_theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('jigme_v2_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('jigme_v2_user');
    }
  }, [currentUser]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
    showToast(`Switched to ${theme === 'light' ? 'Himalayan Midnight Dark Mode' : 'Light Mode'}`, 'info');
  };

  const showToast = (msg, type = 'success') => {
    setToastMessage({ msg, type, id: Date.now() });
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Currency Converter & Formatter
  const formatCurrency = (amountInNu, suffix = '') => {
    if (!amountInNu && amountInNu !== 0) return 'Price on Request';

    let converted = amountInNu;
    let symbol = 'Nu. ';

    if (currency === 'USD') {
      converted = Math.round(amountInNu * 0.012);
      symbol = '$';
      if (converted >= 1000000) {
        return `${symbol}${(converted / 1000000).toFixed(2)}M ${suffix}`.trim();
      }
      return `${symbol}${converted.toLocaleString('en-US')} ${suffix}`.trim();
    } else if (currency === 'INR') {
      converted = amountInNu;
      symbol = '₹';
    }

    if (converted >= 10000000) {
      return `${symbol}${(converted / 10000000).toFixed(2)} Cr ${suffix}`.trim();
    } else if (converted >= 100000) {
      return `${symbol}${(converted / 100000).toFixed(2)} Lakh ${suffix}`.trim();
    } else {
      return `${symbol}${converted.toLocaleString('en-IN')} ${suffix}`.trim();
    }
  };

  const handleSearch = () => {
    confetti({
      particleCount: 60,
      spread: 65,
      origin: { y: 0.4 }
    });
    showToast(`Searching listings matching "${searchLocation || 'All Bhutan'}"...`, 'info');
  };

  const handlePopularSearch = (chip) => {
    if (chip === 'Land for Sale') {
      setPropertyType('Residential Land & Plots');
      setCategory('For Sale');
      setSearchLocation('');
    } else {
      setSearchLocation(chip);
    }
    showToast(`Filtered by ${chip}`, 'info');
  };

  const toggleCompare = (item, type = 'property') => {
    const exists = compareList.find(i => i.id === item.id);
    if (exists) {
      setCompareList(prev => prev.filter(i => i.id !== item.id));
      showToast(`Removed from comparison`, 'info');
    } else {
      if (compareList.length >= 3) {
        showToast('You can compare up to 3 items at a time', 'error');
        return;
      }
      setCompareList(prev => [...prev, { ...item, compareType: type }]);
      showToast(`Added "${item.title}" to Comparison Tool`, 'success');
    }
  };

  const clearCompare = () => {
    setCompareList([]);
    setCompareModalOpen(false);
  };

  const openRoleLogin = (roleId, isRegister = false) => {
    setLoginModal({ isOpen: true, roleId, isRegister });
    setMobileMenuOpen(false);
  };

  const closeRoleLogin = () => {
    setLoginModal({ isOpen: false, roleId: null, isRegister: false });
  };

  const openRoleDashboard = (roleId) => {
    setRoleDashboardModal({ isOpen: true, roleId });
  };

  const closeRoleDashboard = () => {
    setRoleDashboardModal({ isOpen: false, roleId: null });
  };

  const openDetail = (item, type = 'property') => {
    setDetailModal({ isOpen: true, item, type });
  };

  const closeDetail = () => {
    setDetailModal({ isOpen: false, item: null, type: 'property' });
  };

  const toggleFavorite = (id, title) => {
    if (favorites.includes(id)) {
      setFavorites(prev => prev.filter(f => f !== id));
      showToast(`Removed "${title}" from favorites`, 'info');
    } else {
      setFavorites(prev => [...prev, id]);
      showToast(`Saved "${title}" to favorites!`, 'success');
    }
  };

  return (
    <AppContext.Provider
      value={{
        searchTab,
        setSearchTab,
        searchLocation,
        setSearchLocation,
        propertyType,
        setPropertyType,
        category,
        setCategory,
        budget,
        setBudget,
        currency,
        setCurrency,
        formatCurrency,
        theme,
        setTheme,
        toggleTheme,
        viewMode,
        setViewMode,
        properties,
        vehicles,
        favorites,
        toggleFavorite,
        compareList,
        toggleCompare,
        clearCompare,
        compareModalOpen,
        setCompareModalOpen,
        tashiAIOpen,
        setTashiAIOpen,
        loanCalculatorOpen,
        setLoanCalculatorOpen,
        loginModal,
        openRoleLogin,
        closeRoleLogin,
        roleDashboardModal,
        openRoleDashboard,
        closeRoleDashboard,
        detailModal,
        openDetail,
        closeDetail,
        currentUser,
        setCurrentUser,
        mobileMenuOpen,
        setMobileMenuOpen,
        toastMessage,
        showToast,
        handleSearch,
        handlePopularSearch
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
