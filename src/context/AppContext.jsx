import React, { createContext, useContext, useState } from 'react';
import { FEATURED_PROPERTIES, FEATURED_VEHICLES } from '../data/bhutanData';
import confetti from 'canvas-confetti';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [searchTab, setSearchTab] = useState('all'); // 'all', 'properties', 'vehicles'
  const [searchLocation, setSearchLocation] = useState('');
  const [propertyType, setPropertyType] = useState('All Types');
  const [category, setCategory] = useState('All Categories');
  const [budget, setBudget] = useState('Any Budget');

  const [properties, setProperties] = useState(FEATURED_PROPERTIES);
  const [vehicles, setVehicles] = useState(FEATURED_VEHICLES);
  const [favorites, setFavorites] = useState(['prop-1', 'veh-1']);

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

  const [currentUser, setCurrentUser] = useState(null);

  // Toast
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg, type = 'success') => {
    setToastMessage({ msg, type, id: Date.now() });
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const handleSearch = () => {
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.4 }
    });
    showToast(`Searching listings matching "${searchLocation || 'All Locations'}"...`, 'info');
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

  const openRoleLogin = (roleId, isRegister = false) => {
    setLoginModal({ isOpen: true, roleId, isRegister });
  };

  const closeRoleLogin = () => {
    setLoginModal({ isOpen: false, roleId: null, isRegister: false });
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
        properties,
        vehicles,
        favorites,
        toggleFavorite,
        loginModal,
        openRoleLogin,
        closeRoleLogin,
        detailModal,
        openDetail,
        closeDetail,
        currentUser,
        setCurrentUser,
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
