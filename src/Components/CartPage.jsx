import React, { useContext } from 'react';
import { CartContext } from '../context/CartContext.jsx';
import Header from './Header';

export default function CartPage() {
  const { cart, updateQuantity, removeFromCart, clearCart, cartCount } = useContext(CartContext);
  const [searchQuery, setSearchQuery] = React.useState('');

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = Math.round(total * 0.08 * 100) / 100; // 8% tax example
  const delivery = cart.length > 0 ? 20 : 0;
  const orderTotal = (total + tax + delivery).toFixed(2);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header cartCount={cartCount} searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      <div className="max-w-6xl mx-auto py-10 px-4 flex flex-col md:flex-row gap-8">
        {/* Cart Items Section */}
        <div className="flex-1 bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold">My Cart <span className="bg-yellow-200 text-yellow-800 px-2 py-1 rounded text-base">{cart.length}</span></h1>
            <button className="text-red-500 text-sm" onClick={clearCart}>Clear Cart</button>
          </div>
          {cart.length === 0 ? (
            <div className="text-gray-500">Your cart is empty.</div>
          ) : (
            <>
              <div className="mb-4 flex items-center">
                <input type="checkbox" className="mr-2" />
                <span className="font-medium">Choose All Product</span>
              </div>
              <div className="space-y-6">
                {cart.map(item => (
                  <div key={item.id} className="flex items-start gap-4 border-b pb-6 last:border-b-0">
                    <input type="checkbox" className="mt-2" />
                    <img src={item.img_url} alt={item.name} className="w-24 h-24 object-cover rounded" />
                    <div className="flex-1">
                      <div className="font-semibold text-lg">{item.name}</div>
                      <div className="text-gray-500 text-sm mb-2">{item.carbonData?.category || 'Product Category'}</div>
                      <div className="text-gray-700 text-sm mb-2">{item.description || ''}</div>
                      <div className="inline-block bg-gray-100 text-xs px-2 py-1 rounded mb-2">Size: 100ml</div>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-xl font-bold">${item.price.toFixed(2)}</span>
                        <button className="ml-2 text-red-500" onClick={() => removeFromCart(item.id)} title="Remove">🗑️</button>
                        <input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={e => updateQuantity(item.id, Math.max(1, Number(e.target.value)))}
                          className="w-12 border rounded p-1 text-center"
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
        <div className="w-full md:w-96 bg-white rounded-lg shadow p-6 h-fit">
          <h2 className="text-xl font-bold mb-4">Order Summary</h2>
          <ul className="mb-4 text-sm">
            {cart.map(item => (
              <li key={item.id} className="flex justify-between mb-1">
                <span>{item.quantity}x {item.name}</span>
                <span>${(item.price * item.quantity).toFixed(2)}</span>
              </li>
            ))}
          </ul>
          <div className="flex justify-between text-sm mb-2">
            <span>Delivery</span>
            <span>${delivery.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm mb-2">
            <span>Tax</span>
            <span>${tax.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-lg font-bold border-t pt-2 mt-2">
            <span>Order Total</span>
            <span>${orderTotal}</span>
          </div>
          <input type="text" placeholder="Add coupon code here" className="w-full mt-4 p-2 border rounded" />
          <button className="w-full mt-4 py-2 bg-yellow-400 text-white font-bold rounded">Checkout</button>
        </div>
      </div>
    </div>
  );
} 