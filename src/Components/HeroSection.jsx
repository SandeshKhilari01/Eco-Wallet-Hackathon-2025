import React, { useContext } from 'react';
import './HeroSection.css';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext.jsx';

export default function HeroSection() {
  const navigate = useNavigate();
  const { cartCount } = useContext(CartContext);
  return (
    <section className="relative bg-gradient-to-r from-blue-600 to-blue-800 text-white py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="flex items-center mb-4">
            <span className="spark-badge">Sparkathon 2025</span>
            </div>
            <h1 className="text-5xl font-bold mb-6 leading-tight">
              <span className="block">EcoWallet: Sustainable</span>
              <span className="block text-yellow-300">Shopping Rewards</span>
            </h1>
            <p className="text-xl mb-8 opacity-90 max-w-lg">
              Earn points for eco-friendly purchases and track your environmental impact with Walmart.
            </p>
            <div className="flex space-x-4">
              <button className="hero-button-primary" onClick={() => navigate('/shop')}> Shop Now </button>
              <button className="hero-button-secondary"> Learn More </button>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-8 shadow-2xl text-center">
            <div className="text-6xl mb-4">🛍️</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">Reedem and earn Special Offers</h3>
            <p className="text-gray-600 mb-4">Up to 50% off on sustainable products</p>
            <button className="hero-button-view"> View Deals </button>
          </div>
        </div>
      </div>
    </section>
  );
}