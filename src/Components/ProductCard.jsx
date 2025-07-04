import React, { useContext } from 'react';
import { Heart, Star } from 'lucide-react';
import './ProductCard.css';
import { CartContext } from '../context/CartContext.jsx';

export default function ProductCard({ product, onProductClick }) {
  const { addToCart } = useContext(CartContext);
  return (
    <div className="product-card" onClick={() => onProductClick(product)}>
      <div className="product-image-container">
        <img src={product.img_url} alt={product.name} className="product-image" />
        <button 
          className="wishlist-button"
          onClick={(e) => e.stopPropagation()} // Prevent card click when clicking wishlist
        >
          <Heart className="wishlist-icon" />
        </button>
      </div>
      <div className="product-details">
        <h3 className="product-name">{product.name}</h3>
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
        </div>
        <button 
          onClick={(e) => {
            e.stopPropagation(); // Prevent card click when clicking add to cart
            addToCart(product.id, product);
          }} 
          className="add-to-cart-button"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}