// CategoryCard.jsx
import React from 'react';

export default function CategoryCard({ name, image, color }) {
  return (
    <div
      className={`${color} rounded-xl p-6 text-center hover:scale-105 transition-transform cursor-pointer group`}
    >
      <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">
        {image}
      </div>
      <h3 className="font-semibold text-gray-800 text-sm">{name}</h3>
    </div>
  );
}
