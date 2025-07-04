import React, { useState, useContext } from 'react';
import ProductCard from './ProductCard';
import productsData from '../../public/data/Products60.json';
import Header from './Header';
import { CartContext } from '../context/CartContext.jsx';
import ProductDetails from './ProductDetails';

const getUnique = (arr, key) => [...new Set(arr.map(item => item[key]))];

export default function AllProducts() {
  const { cartCount } = useContext(CartContext);
  const [brand, setBrand] = useState('');
  const [tag, setTag] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Collect unique brands and tags for filters
  const brands = getUnique(productsData, 'brand');
  const tags = Array.from(new Set(productsData.flatMap(p => p.tags || [])));

  // Filtering logic
  const filtered = productsData.filter(product => {
    return (
      (!brand || product.brand === brand) &&
      (!tag || (product.tags && product.tags.includes(tag))) &&
      (!maxPrice || product.price <= Number(maxPrice))
    );
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Header cartCount={cartCount} searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-4xl font-bold mb-6 text-gray-900">All Products</h1>
        <div className="flex flex-wrap gap-4 mb-8">
          <select value={brand} onChange={e => setBrand(e.target.value)} className="p-2 border rounded">
            <option value="">All Brands</option>
            {brands.map(b => <option key={b} value={b}>{b}</option>)}
          </select>
          <select value={tag} onChange={e => setTag(e.target.value)} className="p-2 border rounded">
            <option value="">All Tags</option>
            {tags.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
          <input
            type="number"
            placeholder="Max Price"
            value={maxPrice}
            onChange={e => setMaxPrice(e.target.value)}
            className="p-2 border rounded"
            min="0"
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {filtered.map(product => (
            <ProductCard key={product.id} product={product} onProductClick={setSelectedProduct} />
          ))}
          {filtered.length === 0 && <div className="col-span-full text-center text-gray-500">No products found.</div>}
        </div>
      </div>
      {selectedProduct && (
        <ProductDetails product={selectedProduct} onClose={() => setSelectedProduct(null)} />
      )}
    </div>
  );
} 