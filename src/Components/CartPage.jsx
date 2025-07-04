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
    <div className="cart-page">
      <Header cartCount={cartCount} searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      <div className="cart-container">
        {/* Cart Items Section */}
        <div className="cart-items-section walmart-accent">
          <div className="cart-header">
            <h1 className="cart-title">
              My Cart 
              <span className="cart-count-badge">{cart.length}</span>
            </h1>
            <button className="clear-cart-btn" onClick={clearCart}>Clear Cart</button>
          </div>
          
          {cart.length === 0 ? (
            <div className="empty-cart">Your cart is empty.</div>
          ) : (
            <>
              <div className="select-all-container">
                <input type="checkbox" className="select-all-checkbox" />
                <span className="select-all-text">Choose All Product</span>
              </div>
              
              <div className="cart-items-list">
                {cart.map(item => (
                  <div key={item.id} className="cart-item">
                    <input type="checkbox" className="cart-item-checkbox" />
                    <img 
                      src={item.img_url} 
                      alt={item.name} 
                      className="cart-item-image"
                    />
                    <div className="cart-item-details">
                      <div className="cart-item-name">{item.name}</div>
                      <div className="cart-item-category">
                        {item.carbonData?.category || 'Product Category'}
                      </div>
                      <div className="cart-item-description">
                        {item.description || ''}
                      </div>
                      <div className="cart-item-size">Size: 100ml</div>
                      <div className="cart-item-controls">
                        <span className="cart-item-price">${item.price.toFixed(2)}</span>
                        <button 
                          className="remove-btn" 
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
                          className="quantity-input"
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
        <div className="order-summary-section walmart-accent">
          <h2 className="order-summary-title">Order Summary</h2>
          
          <ul className="order-items-list">
            {cart.map(item => (
              <li key={item.id} className="order-item">
                <span className="order-item-name">
                  {item.quantity}x {item.name}
                </span>
                <span className="order-item-price">
                  ${(item.price * item.quantity).toFixed(2)}
                </span>
              </li>
            ))}
          </ul>
          
          <div className="order-calculation">
            <span className="order-calculation-label">Delivery</span>
            <span className="order-calculation-value">${delivery.toFixed(2)}</span>
          </div>
          
          <div className="order-calculation">
            <span className="order-calculation-label">Tax</span>
            <span className="order-calculation-value">${tax.toFixed(2)}</span>
          </div>
          
          <div className="order-total">
            <span>Order Total</span>
            <span className="order-total-value">${orderTotal}</span>
          </div>
          
          <input 
            type="text" 
            placeholder="Add coupon code here" 
            className="coupon-input"
          />
          
          <button className="checkout-btn">Checkout</button>
        </div>
      </div>
    </div>
  );
}