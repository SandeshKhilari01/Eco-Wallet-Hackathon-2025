// src/context/CartContext.jsx
import React, { createContext, useState, useEffect } from 'react';

export const CartContext = createContext();

export function CartContextProvider({ children }) {
  const [cart, setCart] = useState([]); // [{id, quantity, ...product}]
  const [ecoPoints, setEcoPoints] = useState(0);
  const [showEcoWallet, setShowEcoWallet] = useState(false);
  const [applyEcoDiscount, setApplyEcoDiscount] = useState(false);
  const [appliedEcoPoints, setAppliedEcoPoints] = useState(0);

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

  const clearCart = () => {
    setCart([]);
    setApplyEcoDiscount(false);
    setAppliedEcoPoints(0);
  };

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Calculate potential ecopoints from cart
  const calculatePotentialEcoPoints = () => {
    return cart.reduce((total, item) => {
      // Use the product's points property if available, otherwise default to 0
      const itemPoints = (item.points || 0) * item.quantity;
      return total + itemPoints;
    }, 0);
  };

  // Calculate ecopoints discount (0.25 rupees per point)
  const calculateEcoDiscount = (pointsToUse) => {
    return pointsToUse * 0.25;
  };

  // Get max available points that can be used
  const getMaxUsablePoints = (orderTotal) => {
    // Don't allow more discount than the order total
    const maxDiscountPoints = Math.floor(orderTotal / 0.25);
    return Math.min(ecoPoints, maxDiscountPoints);
  };

  // Toggle eco discount application
  const toggleEcoDiscount = (orderTotal) => {
    if (!applyEcoDiscount) {
      const pointsToUse = getMaxUsablePoints(orderTotal);
      setAppliedEcoPoints(pointsToUse);
      setApplyEcoDiscount(true);
    } else {
      setAppliedEcoPoints(0);
      setApplyEcoDiscount(false);
    }
  };

  // Add ecopoints to wallet
  const addEcoPoints = (points) => {
    setEcoPoints(prev => prev + points);
  };

  // Use ecopoints for discount
  const useEcoPoints = (points) => {
    setEcoPoints(prev => prev - points);
  };

  // Handle checkout and award points
  const handleCheckout = () => {
    const pointsToAdd = calculatePotentialEcoPoints();
    
    // Apply eco discount if selected - this needs to happen BEFORE clearing the cart
    if (applyEcoDiscount && appliedEcoPoints > 0) {
      // Use the ecopoints (reduce from wallet)
      useEcoPoints(appliedEcoPoints);
    }
    
    // Add points from potential ecopoints in cart
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
      toggleEcoWallet,
      applyEcoDiscount,
      toggleEcoDiscount,
      appliedEcoPoints,
      calculateEcoDiscount,
      getMaxUsablePoints,
      useEcoPoints
    }}>
      {children}
    </CartContext.Provider>
  );
}