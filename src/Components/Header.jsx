import React, { useState, useContext } from 'react';
import { Search, ShoppingCart, User, Menu, Heart, MapPin, Leaf } from 'lucide-react';
import './Header.css';
import { Link } from 'react-router-dom';
import UserDetail from './UserDetail';
import { CartContext } from '../context/CartContext';
import EcoWallet from './EcoWallet';

export default function Header({ cartCount, searchQuery, setSearchQuery }) {
  const [showUserDetail, setShowUserDetail] = useState(false);
  const { ecoPoints, toggleEcoWallet } = useContext(CartContext);

  return (
    <>
      <header className="header">
        <div className="max-w-7xl mx-auto">
          {/* Main Header */}
          <div className="header-main">
            {/* Left */}
            <div className="header-left">
              <Link to="/">
                <img src="https://mindythelion.com/wp-content/uploads/2016/09/walmart-logo-png-6.png" alt="Walmart Logo" className="header-logo-img"/>
              </Link>
              <h1 className="header-logo">Walmart</h1>
              <button className="header-button">
                <Menu className="w-5 h-5" />
                <span>Departments</span>
              </button>
              <Link to="/ecostore" className="header-link">EcoStore</Link>
            </div>

            {/* Search */}
            <div className="header-search-container">
              <input
                type="text"
                className="header-search-input"
                placeholder="Search everything at Walmart online and in store"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button className="header-search-button">
                <Search className="w-5 h-5 text-black" />
              </button>
            </div>

            {/* Right */}
            <div className="header-icons">
              <Heart className="w-6 h-6 header-icon" />
              <div className="relative cursor-pointer eco-wallet-icon" onClick={toggleEcoWallet}>
                <Leaf className="w-6 h-6 header-icon" />
                <span className="eco-points-badge">{ecoPoints}</span>
              </div>
              <span onClick={() => setShowUserDetail(true)} style={{cursor: 'pointer'}}>
                <User className="w-6 h-6 header-icon" />
              </span>
              <div className="relative cursor-pointer">
                <Link to="/cart">
                  <ShoppingCart className="w-6 h-6 header-icon" />
                  {cartCount > 0 && (
                    <span className="header-cart-badge">
                      {cartCount}
                    </span>
                  )}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </header>
      
      {showUserDetail && (
        <div className="user-detail-modal">
          <div className="user-detail-modal-content">
            <button className="user-detail-close" onClick={() => setShowUserDetail(false)}>&times;</button>
            <UserDetail />
          </div>
        </div>
      )}
      
      <EcoWallet />
    </>
  );
}