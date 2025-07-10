// src/Components/CartPage.jsx
import React, { useContext, useState, useEffect } from 'react';
import { CartContext } from '../context/CartContext.jsx';
import Header from './Header';
import SustainableRecommendations from './SustainableRecommendations';
import './CartPage.css';

export default function CartPage() {
  const { cart, updateQuantity, removeFromCart, clearCart, cartCount } = useContext(CartContext);
  const [searchQuery, setSearchQuery] = useState('');
  const [userAddress, setUserAddress] = useState('');
  
  // Get user address from the profile
  useEffect(() => {
    // In a real app, this might come from an API or context
    // For this demo, we'll use the hardcoded user profile data
    setUserAddress("123 Main St, Springfield, USA");
  }, []);

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = Math.round(total * 0.08 * 100) / 100; // 8% tax example
  const delivery = cart.length > 0 ? 20 : 0;
  const orderTotal = (total + tax + delivery).toFixed(2);

  return (
    <div className="cart-page desktop-optimized">
      <Header cartCount={cartCount} searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      <div className="cart-container desktop-container">
        {/* Cart Items Section */}
        <div className="cart-items-section walmart-accent desktop-cart-section">
          <div className="cart-header desktop-header">
            <h1 className="cart-title desktop-title">
              My Cart 
              <span className="cart-count-badge">{cart.length}</span>
            </h1>
            <button className="clear-cart-btn desktop-clear-btn" onClick={clearCart}>Clear Cart</button>
          </div>
          
          {cart.length === 0 ? (
            <div className="empty-cart desktop-empty">Your cart is empty.</div>
          ) : (
            <>
              {/* Sustainability Recommendations */}
              <SustainableRecommendations userAddress={userAddress} />
              
              <div className="select-all-container">
                <input type="checkbox" className="select-all-checkbox" />
                <span className="select-all-text">Choose All Product</span>
              </div>
              
              <div className="cart-items-list desktop-items-list">
                {cart.map(item => (
                  <div key={item.id} className="cart-item desktop-item">
                    <input type="checkbox" className="cart-item-checkbox" />
                    <img 
                      src={item.img_url} 
                      alt={item.name} 
                      className="cart-item-image desktop-image"
                    />
                    <div className="cart-item-details desktop-details">
                      <div className="cart-item-name desktop-name">{item.name}</div>
                      <div className="cart-item-category desktop-category">
                        {item.carbonData?.category || 'Product Category'}
                      </div>
                      <div className="cart-item-description desktop-description">
                        {item.description || ''}
                      </div>

                      <div className="cart-item-size">
                        {item.size || 'Standard'}
                      </div>
                      <div className="cart-item-controls">
                        <div className="quantity-control">
                          <button 
                            className="quantity-btn"
                            onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                          >
                            -
                          </button>
                          <span className="quantity-value">{item.quantity}</span>
                          <button 
                            className="quantity-btn"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          >
                            +
                          </button>
                        </div>
                        
                        <div className="cart-item-price">₹{item.price}</div>
                        
                        <button 
                          className="remove-btn"
                          onClick={() => removeFromCart(item.id)}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
        
        {/* Order Summary Section */}

        {cart.length > 0 && (
          <div className="order-summary-section">
            <h2 className="order-summary-title">Order Summary</h2>
            
            <div className="summary-row">
              <span>Subtotal ({cart.length} items)</span>
              <span>₹{total.toFixed(2)}</span>
            </div>
            
            <div className="summary-row">
              <span>Tax</span>
              <span>₹{tax.toFixed(2)}</span>
            </div>
            
            <div className="summary-row">
              <span>Delivery</span>
              <span>₹{delivery.toFixed(2)}</span>
            </div>
            
            <div className="summary-divider"></div>
            
            <div className="summary-row total">
              <span>Order Total</span>
              <span>₹{orderTotal}</span>
            </div>
            
            <button className="checkout-btn">Proceed to Checkout</button>
            
            <div className="promo-code">
              <input type="text" placeholder="Enter promo code" />
              <button>Apply</button>
            </div>
            
            <div className="accepted-payment">
              <div className="payment-label">We Accept</div>
              <div className="payment-icons">
                <span className="payment-icon">💳</span>
                <span className="payment-icon">💵</span>
                <span className="payment-icon">🏦</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}