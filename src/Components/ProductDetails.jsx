import React, { useState, useContext } from 'react';
import { Heart, Star, ArrowLeft, Leaf, Package, Truck, Award } from 'lucide-react';
import './ProductDetails.css';
import { CartContext } from '../context/CartContext.jsx';

export default function ProductDetails({ product, onClose }) {
  const { addToCart } = useContext(CartContext);
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);

  if (!product) return null;

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(product.id, product);
    }
  };

  const toggleWishlist = () => {
    setIsWishlisted(!isWishlisted);
  };

  return (
    <div className="product-details-overlay">
      <div className="product-details-modal">
        <button className="back-button" onClick={onClose}>
          <ArrowLeft size={20} />
          <span>Back to Products</span>
        </button>
        
        <div className="product-details-content">
          {/* Product Image Section */}
          <div className="product-image-section">
            <div className="product-image-container">
              <img src={product.img_url} alt={product.name} className="product-detail-image" />
            </div>
          </div>

          {/* Product Information Section */}
          <div className="product-info-section">
            <div className="product-header">
              <div className="product-title-section">
                <h1 className="product-title">{product.name}</h1>
              </div>
              <button 
                className={`wishlist-btn ${isWishlisted ? 'wishlisted' : ''}`}
                onClick={toggleWishlist}
              >
                <Heart size={24} fill={isWishlisted ? '#ef4444' : 'none'} />
              </button>
            </div>

            {/* Rating Section */}
            <div className="rating-section">
              <div className="stars">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={20}
                    className={`star ${i < 4 ? 'filled' : ''}`}
                    fill={i < 4 ? '#fbbf24' : 'none'}
                  />
                ))}
              </div>
              <span className="rating-text">4.0 (56 reviews)</span>
            </div>

            {/* Price Section */}
            <div className="price-section">
              <div className="price-info">
                <span className="current-price">₹{product.price}</span>
                <span className="original-price">₹{product.originalPrice}</span>
                <span className="discount">
                  {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                </span>
              </div>
            </div>

            {/* Tags Section */}
            {Array.isArray(product.tags) && product.tags.length > 0 && (
              <div className="tags-section">
                {product.tags.map((tag, index) => (
                  <span key={index} className="product-tag">
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Impact Section */}
            {product.carbonData && (
              <div className="co2-highlight">
                <div className="co2-circle">
                  <Leaf className="co2-icon" size={24} />
                  <div className="co2-text">
                    <span className="co2-amount">{product.carbonData.weight_kg}kg</span>
                    <span className="co2-label">Product Weight</span>
                  </div>
                </div>
                <div className="co2-description">
                  <p>Category: <strong>{product.carbonData.category}</strong></p>
                  <p>Origin: <strong>{product.carbonData.origin_country}</strong> → {product.carbonData.destination_country}</p>
                </div>
              </div>
            )}

            {/* Quantity and Add to Cart Section */}
            <div className="purchase-section">
              <div className="quantity-section">
                <label htmlFor="quantity">Quantity:</label>
                <div className="quantity-controls">
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="quantity-btn"
                  >
                    -
                  </button>
                  <span className="quantity-display">{quantity}</span>
                  <button 
                    onClick={() => setQuantity(quantity + 1)}
                    className="quantity-btn"
                  >
                    +
                  </button>
                </div>
              </div>
              
              <button className="add-to-cart-btn" onClick={handleAddToCart}>
                Add to Cart - ₹{product.price * quantity}
              </button>
            </div>

            {/* Points Section */}
            {typeof product.points === 'number' && (
              <div className="points-section">
                <div className="points-info">
                  <span className="points-label">Earn Points:</span>
                  <span className="points-value">{product.points * quantity} points</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}