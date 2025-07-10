import React, { createContext, useState, useEffect } from 'react';

export const CartContext = createContext();

export function CartContextProvider({ children }) {
  const [cart, setCart] = useState([]); // [{id, quantity, ...product}]
  const [ecoPoints, setEcoPoints] = useState(0);
  const [showEcoWallet, setShowEcoWallet] = useState(false);

  // Load ecopoints from localStorage on initial render
  useEffect(() => {
    const savedPoints = localStorage.getItem('ecoPoints');
    if (savedPoints) {
      setEcoPoints(parseInt(savedPoints));
    }
  }, []);

  // Save ecopoints to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('ecoPoints', ecoPoints.toString());
  }, [ecoPoints]);

  const addToCart = (productId, productData) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === productId);
      if (existing) {
        return prev.map(item =>
          item.id === productId ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        return [...prev, { ...productData, id: productId, quantity: 1 }];
      }
    });
  };

  const removeFromCart = (productId) => {
    setCart(prev => prev.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId, quantity) => {
    setCart(prev =>
      prev.map(item =>
        item.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => setCart([]);

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Calculate potential ecopoints from cart
  const calculatePotentialEcoPoints = () => {
    return cart.reduce((total, item) => {
      // Use the product's points property if available, otherwise default to 0
      const itemPoints = (item.points || 0) * item.quantity;
      return total + itemPoints;
    }, 0);
  };

  // Add ecopoints to wallet
  const addEcoPoints = (points) => {
    setEcoPoints(prev => prev + points);
  };

  // Handle checkout and award points
  const handleCheckout = () => {
    const pointsToAdd = calculatePotentialEcoPoints();
    addEcoPoints(pointsToAdd);
    
    // You would typically process the order here before clearing the cart
    // For this implementation, we'll just clear the cart after adding points
    clearCart();
    
    // Return the points added for display purposes
    return pointsToAdd;
  };

  // Toggle eco wallet display
  const toggleEcoWallet = () => {
    setShowEcoWallet(prev => !prev);
  };

  return (
    <CartContext.Provider value={{ 
      cart, 
      addToCart, 
      removeFromCart, 
      updateQuantity, 
      clearCart, 
      cartCount,
      ecoPoints,
      addEcoPoints,
      calculatePotentialEcoPoints,
      handleCheckout,
      showEcoWallet,
      toggleEcoWallet
    }}>
      {children}
    </CartContext.Provider>
  );
}