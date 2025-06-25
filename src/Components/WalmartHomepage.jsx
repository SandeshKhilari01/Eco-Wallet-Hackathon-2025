import React, { useState } from 'react';
import Header from './Header';
import HeroSection from './HeroSection';
import CategoriesSection from './CategoriesSection';
import FeaturedProducts from './FeaturedProducts';
import Footer from './Footer';

export default function WalmartHomepage() {
  const [cartCount, setCartCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [/* same as before */];
  const featuredProducts = [/* same as before */];

  const addToCart = (id) => setCartCount(cartCount + 1);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header cartCount={cartCount} searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      <HeroSection />
      <CategoriesSection categories={categories} />
      <FeaturedProducts products={featuredProducts} addToCart={addToCart} />
      <Footer />
    </div>
  );
}
