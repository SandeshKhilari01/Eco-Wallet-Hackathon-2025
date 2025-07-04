import React, { useState, useContext } from 'react';
import ProductCard from './ProductCard';
import ProductDetails from './ProductDetails';
import productsData from '../../public/data/Products60.json';
import Header from './Header';
import { CartContext } from '../context/CartContext.jsx';

export default function FeaturedProducts() {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const { addToCart, cartCount } = useContext(CartContext);

  const handleProductClick = (product) => {
    setSelectedProduct(product);
  };

  const handleCloseDetails = () => {
    setSelectedProduct(null);
  };

  return (
    <>
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Featured Products</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {productsData.map((product) => (
              <ProductCard 
                key={product.id} 
                product={product} 
                onProductClick={handleProductClick}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Product Details Modal */}
      {selectedProduct && (
        <ProductDetails
          product={selectedProduct}
          onClose={handleCloseDetails}
        />
      )}
    </>
  );
}