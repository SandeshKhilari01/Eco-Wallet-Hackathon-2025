// src/Components/CartPage.jsx
import React, { useContext, useState, useEffect } from 'react';
import { CartContext } from '../context/CartContext.jsx';
import Header from './Header';
import SustainableRecommendations from './SustainableRecommendations';
import { Leaf } from 'lucide-react';
import './CartPage.css';

export default function CartPage() {
  const { 
    cart, 
    updateQuantity, 
    removeFromCart, 
    clearCart, 
    cartCount, 
    handleCheckout, 
    addEcoPoints,
    ecoPoints,
    applyEcoDiscount,
    toggleEcoDiscount,
    appliedEcoPoints,
    calculateEcoDiscount,
    getMaxUsablePoints
  } = useContext(CartContext);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [userAddress, setUserAddress] = useState('');
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [pointsAdded, setPointsAdded] = useState(0);
  
  // Get user address from the profile
  useEffect(() => {
    // In a real app, this might come from an API or context
    // For this demo, we'll use the hardcoded user profile data
    setUserAddress("123 Main St, Springfield, USA");
  }, []);

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = Math.round(total * 0.08 * 100) / 100; // 8% tax example
  const delivery = cart.length > 0 ? 20 : 0;
  
  // Calculate eco discount if applicable
  const ecoDiscount = applyEcoDiscount ? calculateEcoDiscount(appliedEcoPoints) : 0;
  
  // Calculate order total with possible eco discount
  const orderTotal = (total + tax + delivery - ecoDiscount).toFixed(2);
  
  // Calculate the maximum points that can be used for this order
  const maxUsablePoints = getMaxUsablePoints(total + tax + delivery);

  const onCheckout = () => {
    // Get totalScore from localStorage
    const totalScore = localStorage.getItem('totalScore');
    
    // Convert to number
    const ecoPointsToAdd = totalScore ? Math.round(Number(totalScore)) : 0;
    
    // Add the eco points from the sustainability score
    // This is critical - add the points from sustainability score first
    addEcoPoints(ecoPointsToAdd);
    
    // Call handleCheckout which will handle discount and add points from cart
    handleCheckout();
    
    // Set the points added for the success message
    setPointsAdded(ecoPointsToAdd);
    
    // Show success message
    setShowSuccessMessage(true);
    
    // Hide success message after 5 seconds
    setTimeout(() => {
      setShowSuccessMessage(false);
    }, 5000);
  };

  return (
    <div className="cart-page desktop-optimized">
      <Header cartCount={cartCount} searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      
      {showSuccessMessage && (
        <div className="checkout-success-message">
          <div className="success-content">
            <div className="success-icon">
              <Leaf size={24} />
            </div>
            <div className="success-text">
              <h3>Order Completed!</h3>
              <p>You've earned {pointsAdded} EcoPoints for sustainable shopping.</p>
            </div>
          </div>
        </div>
      )}
      
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
            <div className="empty-cart">
              <p>Your cart is empty</p>
              <p>Add items to your cart to get started!</p>
            </div>
          ) : (
            <>
              <div className="cart-items-container">
                {cart.map(item => (
                  <div key={item.id} className="cart-item">
                    <div className="cart-item-image-container">
                      <img src={item.img_url || item.image} alt={item.name} className="cart-item-image" />
                    </div>
                    <div className="cart-item-details">
                      <div className="cart-item-info">
                        <h3 className="cart-item-name">{item.name}</h3>
                        <p className="cart-item-description">{item.description}</p>
                        
                        {item.points > 0 && (
                          <div className="cart-item-points">
                            <span className="points-icon">
                              <Leaf size={14} />
                            </span>
                            <span>Earn {item.points * item.quantity} EcoPoints</span>
                          </div>
                        )}
                      </div>
                      
                      <div className="cart-item-controls">
                        <div className="quantity-control">
                          <input
                            type="number"
                            min="1"
                            value={item.quantity}
                            onChange={(e) => updateQuantity(item.id, parseInt(e.target.value))}
                            className="quantity-input"
                          />
                        </div>
                        
                        <div className="cart-item-price">
                          ₹{(item.price * item.quantity).toFixed(2)}
                        </div>
                        
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
            
            {/* EcoPoints Discount Section */}
            {ecoPoints > 0 && (
              <div className="eco-discount-section">
                <div className="eco-discount-toggle">
                  <label className="eco-toggle-label">
                    <input 
                      type="checkbox" 
                      checked={applyEcoDiscount}
                      onChange={() => toggleEcoDiscount(total + tax + delivery)}
                      className="eco-toggle-input"
                    />
                    <span className="eco-toggle-text">
                      Use EcoPoints ({maxUsablePoints} max)
                    </span>
                  </label>
                </div>
                
                {applyEcoDiscount && (
                  <div className="summary-row discount">
                    <span>EcoPoints Discount</span>
                    <span className="discount-value">-₹{ecoDiscount.toFixed(2)}</span>
                  </div>
                )}
                
                <div className="eco-points-available">
                  <Leaf size={16} className="eco-icon" />
                  <span>Available: {ecoPoints} points (₹{(ecoPoints * 0.25).toFixed(2)} value)</span>
                </div>
              </div>
            )}
            
            {/* Display potential eco points */}
            <div className="summary-row eco-points">
              <span>Potential EcoPoints</span>
              <span className="points-value">
                {localStorage.getItem('totalScore') ? 
                  Math.round(Number(localStorage.getItem('totalScore'))) : 0}
              </span>
            </div>
            
            <div className="summary-divider"></div>
            
            <div className="summary-row total">
              <span>Order Total</span>
              <span>₹{orderTotal}</span>
            </div>
            <div className='change-align'>
              <button className="checkout-btn" onClick={onCheckout}>
                Proceed to Checkout
              </button>
              
              <div className="promo-code">
                <input type="text" placeholder="Enter promo code" />
                <button className="checkout-btn-apply">Apply</button>
              </div>
            </div>
            <div className="accepted-payment">
              <div className="payment-label">We Accept</div>
              <div className="payment-icons">
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Sustainable Recommendations */}
      {cart.length > 0 && <SustainableRecommendations />}
    </div>
  );
}