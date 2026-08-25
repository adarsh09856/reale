import React, { createContext, useContext, useState, useEffect } from 'react';
import { FEATURED_PROPERTIES, FEATURED_VEHICLES } from '../data/bhutanData';
import confetti from 'canvas-confetti';
import { api } from '../api/client';

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

  // CRM Admin View Mode
  const [isAdminView, setIsAdminView] = useState(false);

  // Data Collections (initialized with offline fallback, synced with live API)
  const [properties, setProperties] = useState(FEATURED_PROPERTIES);
  const [vehicles, setVehicles] = useState(FEATURED_VEHICLES);
  const [loadingCatalog, setLoadingCatalog] = useState(true);

  // Synchronize with Live Database API on Mount
  useEffect(() => {
    const fetchLiveCatalog = async () => {
      try {
        const [propsRes, vehsRes] = await Promise.allSettled([
          api.getProperties(),
          api.getVehicles()
        ]);

        if (propsRes.status === 'fulfilled' && propsRes.value?.properties?.length > 0) {
          const liveProps = propsRes.value.properties.map(p => ({
            id: p.id,
            title: p.title,
            location: p.location,
            priceNu: p.priceNu,
            priceDisplay: p.priceDisplay || `Nu. ${(p.priceNu / 10000000).toFixed(2)} Cr`,
            type: p.type,
            beds: p.beds || 3,
            baths: p.baths || 2,
            area: p.area || '15 Decimals',
            description: p.description,
            image: p.image,
            images: p.images ? (typeof p.images === 'string' ? JSON.parse(p.images) : p.images) : [p.image],
            featured: p.isFeatured || false,
            verified: p.isVerified !== false,
            lagthramNo: p.lagthramNo || 'THIM-2026-NLC',
            plotNo: p.plotNo || 'PL-08',
            thramHolder: p.thramHolder || 'Verified Landowner'
          }));
          setProperties(liveProps);
        }

        if (vehsRes.status === 'fulfilled' && vehsRes.value?.vehicles?.length > 0) {
          const liveVehs = vehsRes.value.vehicles.map(v => ({
            id: v.id,
            title: v.title,
            make: v.make,
            model: v.model,
            year: v.year,
            priceNu: v.priceNu,
            priceDisplay: v.priceDisplay || `Nu. ${(v.priceNu / 100000).toFixed(2)} Lakh`,
            mileage: v.mileage,
            fuelType: v.fuelType,
            transmission: v.transmission,
            location: v.location,
            description: v.description,
            image: v.image,
            images: v.images ? (typeof v.images === 'string' ? JSON.parse(v.images) : v.images) : [v.image],
            rstaVerified: v.isVerified !== false
          }));
          setVehicles(liveVehs);
        }
      } catch (err) {
        console.warn('[AppContext Platform 2] API Sync:', err.message);
      } finally {
        setLoadingCatalog(false);
      }
    };

    fetchLiveCatalog();
  }, []);

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

  const toggleFavorite = (id, title = 'Item') => {
    if (favorites.includes(id)) {
      setFavorites(prev => prev.filter(i => i !== id));
      showToast(`Removed "${title}" from favorites`, 'info');
    } else {
      setFavorites(prev => [...prev, id]);
      showToast(`Saved "${title}" to your favorites!`, 'success');
    }
  };

  const isFavorite = (id) => favorites.includes(id);

  const openRoleLogin = (roleId = null, isRegister = false) => {
    setLoginModal({
      isOpen: true,
      roleId,
      isRegister
    });
  };

  const closeRoleLogin = () => {
    setLoginModal({
      isOpen: false,
      roleId: null,
      isRegister: false
    });
  };

  const openRoleDashboard = (roleId) => {
    setRoleDashboardModal({
      isOpen: true,
      roleId
    });
  };

  const closeRoleDashboard = () => {
    setRoleDashboardModal({
      isOpen: false,
      roleId: null
    });
  };

  const openDetailModal = (item, type = 'property') => {
    setDetailModal({
      isOpen: true,
      item,
      type
    });
  };

  const closeDetailModal = () => {
    setDetailModal({
      isOpen: false,
      item: null,
      type: 'property'
    });
  };

  const openCalculatorModal = () => setLoanCalculatorOpen(true);
  const closeCalculatorModal = () => setLoanCalculatorOpen(false);

  const handleLogout = () => {
    api.logout();
    setCurrentUser(null);
    showToast('Signed out successfully', 'info');
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
        theme,
        toggleTheme,
        viewMode,
        setViewMode,
        isAdminView,
        setIsAdminView,
        properties,
        setProperties,
        vehicles,
        setVehicles,
        loadingCatalog,
        favorites,
        toggleFavorite,
        isFavorite,
        compareList,
        toggleCompare,
        clearCompare,
        compareModalOpen,
        setCompareModalOpen,
        tashiAIOpen,
        setTashiAIOpen,
        loanCalculatorOpen,
        openCalculatorModal,
        closeCalculatorModal,
        loginModal,
        openRoleLogin,
        closeRoleLogin,
        detailModal,
        openDetailModal,
        closeDetailModal,
        roleDashboardModal,
        openRoleDashboard,
        closeRoleDashboard,
        currentUser,
        setCurrentUser,
        mobileMenuOpen,
        setMobileMenuOpen,
        toastMessage,
        showToast,
        formatCurrency,
        handleSearch,
        handlePopularSearch,
        handleLogout
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
