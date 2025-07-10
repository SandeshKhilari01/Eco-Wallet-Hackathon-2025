import React, { useContext } from 'react';
import { CartContext } from '../context/CartContext.jsx';
import Header from './Header';
import './CartPage.css';

export default function CartPage() {
  const { cart, updateQuantity, removeFromCart, clearCart, cartCount } = useContext(CartContext);
  const [searchQuery, setSearchQuery] = React.useState('');

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
              <div className="select-all-container desktop-select-all">
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
                      <div className="cart-item-size desktop-size">Size: 100ml</div>
                      <div className="cart-item-controls desktop-controls">
                        <span className="cart-item-price desktop-price">${item.price.toFixed(2)}</span>
                        <button 
                          className="remove-btn desktop-remove" 
                          onClick={() => removeFromCart(item.id)} 
                          title="Remove"
                        >
                          🗑️
                        </button>
                        <input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={e => updateQuantity(item.id, Math.max(1, Number(e.target.value)))}
                          className="quantity-input desktop-quantity"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Order Summary Section */}
        <div className="order-summary-section walmart-accent desktop-summary">
          <h2 className="order-summary-title desktop-summary-title">Order Summary</h2>
          
          <ul className="order-items-list desktop-summary-items">
            {cart.map(item => (
              <li key={item.id} className="order-item desktop-summary-item">
                <span className="order-item-name desktop-summary-name">
                  {item.quantity}x {item.name}
                </span>
                <span className="order-item-price desktop-summary-price">
                  ${(item.price * item.quantity).toFixed(2)}
                </span>
              </li>
            ))}
          </ul>
          
          <div className="order-calculation desktop-calculation">
            <span className="order-calculation-label">Delivery</span>
            <span className="order-calculation-value">${delivery.toFixed(2)}</span>
          </div>
          
          <div className="order-calculation desktop-calculation">
            <span className="order-calculation-label">Tax</span>
            <span className="order-calculation-value">${tax.toFixed(2)}</span>
          </div>
          
          <div className="order-total desktop-total">
            <span>Order Total</span>
            <span className="order-total-value desktop-total-value">${orderTotal}</span>
          </div>
          
          <input 
            type="text" 
            placeholder="Add coupon code here" 
            className="coupon-input desktop-coupon"
          />
          
          <button className="checkout-btn desktop-checkout">Checkout</button>
        </div>
      </div>
    </div>
  );
}