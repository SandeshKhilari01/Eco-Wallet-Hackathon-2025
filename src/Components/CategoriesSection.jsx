// CategoriesSection.jsx
import React from 'react';
import CategoryCard from './CategoryCard';

export default function CategoriesSection() {
  const categories = [
    { name: 'Grocery', image: '🛒', color: 'bg-green-100' },
    { name: 'Home & Garden', image: '🏠', color: 'bg-yellow-100' },
    { name: 'Clothing', image: '👕', color: 'bg-purple-100' },
    { name: 'Health & Beauty', image: '💄', color: 'bg-pink-100' },
  ];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
          Shop by Category
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10 justify-center">
          {categories.map((cat, idx) => (
            <CategoryCard key={idx} {...cat} />
          ))}
        </div>
      </div>
    </section>
  );
}
