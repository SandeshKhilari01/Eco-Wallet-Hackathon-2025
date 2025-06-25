import React from 'react';
import { Heart, Star } from 'lucide-react';
import './ProductCard.css';

export default function ProductCard({ product, addToCart }) {
  return (
    <div className="product-card">
      <div className="product-image-container">
        <img src={product.image} alt={product.name} className="product-image" />
        {product.badge && <span className="badge">{product.badge}</span>}
        <button className="wishlist-button">
          <Heart className="wishlist-icon" />
        </button>
      </div>

      <div className="product-details">
        <h3 className="product-name">{product.name}</h3>
        <p className="product-brand">{product.brand}</p>

        <div className="product-rating">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`star-icon ${i < 4 ? 'filled' : ''}`}
            />
          ))}
          <span className="reviews-count">(56)</span>
        </div>

        <div className="product-price-info">
          <span className="product-price">₹{product.price}</span>
          <span className="product-original-price">₹{product.originalPrice}</span>
          <span className="co2-saved">{product.co2SavedKg}kg CO₂ Saved</span>
        </div>

        <button onClick={() => addToCart(product.id)} className="add-to-cart-button">
          Add to Cart
        </button>
      </div>
    </div>
  );
}
