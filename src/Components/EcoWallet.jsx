import React, { useContext } from 'react';
import { CartContext } from '../context/CartContext';
import { Leaf } from 'lucide-react';
import './EcoWallet.css';

export default function EcoWallet() {
  const { ecoPoints, showEcoWallet, toggleEcoWallet } = useContext(CartContext);

  if (!showEcoWallet) return null;

  return (
    <div className="eco-wallet-modal">
      <div className="eco-wallet-content">
        <button className="close-button" onClick={toggleEcoWallet}>&times;</button>
        
        <div className="eco-wallet-header">
          <Leaf size={32} className="eco-icon" />
          <h2>Your EcoWallet</h2>
        </div>
        
        <div className="eco-points-display">
          <span className="eco-points-value">{ecoPoints}</span>
          <span className="eco-points-label">EcoPoints</span>
        </div>
        
        <div className="eco-wallet-info">
          <p>Earn points with every sustainable purchase!</p>
          <p>Redeem your points for special offers and discounts.</p>
        </div>
        
        <button className="redeem-button">Redeem Points</button>
      </div>
    </div>
  );
}