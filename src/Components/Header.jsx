import React from 'react';
import { Search, ShoppingCart, User, Menu, Heart, MapPin } from 'lucide-react';
import './Header.css';

export default function Header({ cartCount, searchQuery, setSearchQuery }) {
  return (
    <header className="header">
      <div className="max-w-7xl mx-auto">
        {/* Top Bar
        <div className="header-top">
          <div className="location">
            <MapPin className="w-4 h-4" />
            <span>How do you want your items?</span>
          </div>
          <div className="account">
            <span>Hi, Guest</span><span>|</span><span>Account</span><span>|</span><span>Sign In</span>
          </div>
        </div> */}

        {/* Main Header */}
        <div className="header-main">
          {/* Left */}
          <div className="header-left">
          <img src="https://mindythelion.com/wp-content/uploads/2016/09/walmart-logo-png-6.png" alt="Walmart Logo" className="header-logo-img"/>
          <h1 className="header-logo">Walmart</h1>
            <button className="header-button">
              <Menu className="w-5 h-5" />
              <span>Departments</span>
            </button>
            <span className="header-link">Services</span>
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
            <User className="w-6 h-6 header-icon" />
            <div className="relative cursor-pointer">
              <ShoppingCart className="w-6 h-6 header-icon" />
              {cartCount > 0 && (
                <span className="header-cart-badge">
                  {cartCount}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
