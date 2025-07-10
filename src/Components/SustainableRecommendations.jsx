// src/Components/SustainableRecommendations.jsx
import React, { useState, useEffect, useContext } from 'react';
import { Leaf, Circle, AlertCircle, ThumbsUp, Lightbulb } from 'lucide-react';
import './SustainableRecommendations.css';
import SustainabilityService from '../services/SustainabilityService';
import { CartContext } from '../context/CartContext';
import productsData from '../../public/data/Products60.json';

const SustainableRecommendations = ({ userAddress }) => {
  const { cart, addToCart } = useContext(CartContext);
  const [isLoading, setIsLoading] = useState(true);
  const [recommendations, setRecommendations] = useState([]);
  const [cartScores, setCartScores] = useState({});
  const [averageScore, setAverageScore] = useState(0);
  const [overallLevel, setOverallLevel] = useState('medium');
  
  useEffect(() => {
    const fetchSustainabilityData = async () => {
      if (cart.length === 0) {
        setIsLoading(false);
        return;
      }
      
      setIsLoading(true);
      
      try {
        // Calculate scores for each cart item
        const scorePromises = cart.map(item => 
          SustainabilityService.calculateProductScore(item, userAddress)
        );
        
        const scores = await Promise.all(scorePromises);
        
        // Create a map of product ID to score
        const scoresMap = {};
        let totalScore = 0;
        
        cart.forEach((item, index) => {
          scoresMap[item.id] = scores[index];
          totalScore += scores[index].score;
        });
        
        // Store the totalScore in localStorage
        localStorage.setItem("totalScore", totalScore);
        
        // Calculate average score
        const avgScore = cart.length > 0 ? totalScore / cart.length : 0;
        
        // Get sustainable alternatives
        const sustainableAlternatives = await SustainabilityService.getSustainableAlternatives(
          cart, 
          productsData,
          userAddress
        );
        
        // Update state
        setCartScores(scoresMap);
        setAverageScore(avgScore);
        setRecommendations(sustainableAlternatives);
        setOverallLevel(avgScore > 70 ? 'high' : avgScore > 40 ? 'medium' : 'low');
        
      } catch (error) {
        console.error("Error fetching sustainability data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSustainabilityData();
  }, [cart, userAddress]);

  const getScoreColor = (score) => {
    if (score >= 70) return '#10b981'; // Green
    if (score >= 40) return '#f59e0b'; // Orange
    return '#ef4444'; // Red
  };

  if (isLoading) {
    return (
      <div className="sustainability-loading">
        <div className="sustainability-loading-spinner"></div>
        <p>Calculating sustainability scores...</p>
      </div>
    );
  }

  if (cart.length === 0) {
    return null;
  }

  return (
    <div className="sustainability-container">
      <div className="sustainability-header">
        <div className="sustainability-title">
          <Leaf className="leaf-icon" />
          <h2>Sustainability Insights</h2>
        </div>
        
        <div className="overall-score">
          <div className="score-circle" style={{ borderColor: getScoreColor(averageScore) }}>
            <span className="score-value">{Math.round(averageScore)}</span>
          </div>
          <div className="score-label">
            <p>Average</p>
            <p>Score</p>
          </div>
        </div>
      </div>

      <div className="sustainability-insight">
        <div className="insight-icon">
          <Lightbulb size={20} />
        </div>
        <p>
          {overallLevel === 'high' ? 
            'Great job! Your cart has a strong environmental focus.' :
            overallLevel === 'medium' ? 
              'Your cart has a moderate environmental impact. See our recommendations below.' :
              'Your cart has opportunities for improvement. Check out our eco-friendly alternatives.'}
        </p>
      </div>

      {/* Eco Points Preview */}
      <div className="eco-points-preview">
        <div className="eco-points-icon">
          <Leaf size={20} />
        </div>
        <div className="eco-points-text">
          <p>Potential EcoPoints: <span className="points-value">{Math.round(Number(localStorage.getItem("totalScore")) || 0)}</span></p>
          <p className="points-description">Complete your purchase to earn these points!</p>
        </div>
      </div>

      {recommendations.length > 0 && (
        <div className="recommendations-section">
          <h3>Recommended Sustainable Alternatives</h3>
          <div className="recommendations-grid">
            {recommendations.map(product => (
              <div key={product.id} className="recommendation-card">
                <div className="recommendation-image">
                  <img src={product.img_url || product.image} alt={product.name} />
                  {product.badge && <span className="eco-badge">{product.badge}</span>}
                </div>
                <div className="recommendation-details">
                  <h4>{product.name}</h4>
                  <p className="recommendation-price">₹{product.price}</p>
                  <p className="sustainability-highlight">
                    <ThumbsUp size={16} />
                    {product.sustainabilityHighlight || product.impact?.emissions || "Eco-friendly"}
                  </p>
                  <p className="recommendation-reason">{product.reason || "Sustainable alternative"}</p>
                  <button 
                    className="add-recommendation-btn"
                    onClick={() => addToCart(product.id, product)}
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="cart-scores-section">
        <h3>Your Cart Items Sustainability Details</h3>
        <div className="cart-scores-list">
          {cart.map(item => {
            const score = cartScores[item.id];
            if (!score) return null;
            
            return (
              <div key={item.id} className="cart-score-item">
                <div className="cart-score-product">
                  <img src={item.img_url} alt={item.name} className="cart-score-image" />
                  <div className="cart-score-name">{item.name}</div>
                </div>
                
                <div className="cart-score-details">
                  <div className="cart-score-circle" style={{ borderColor: getScoreColor(score.score) }}>
                    {Math.round(score.score)}
                  </div>
                  
                  <div className="cart-score-factors">
                    <div className="positive-factors">
                      <h4>Positives</h4>
                      <ul>
                        {score.factors.positive.map((factor, i) => (
                          <li key={i}>
                            <ThumbsUp size={14} />
                            {factor}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="negative-factors">
                      <h4>Areas for Improvement</h4>
                      <ul>
                        {score.factors.negative.map((factor, i) => (
                          <li key={i}>
                            <AlertCircle size={14} />
                            {factor}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default SustainableRecommendations;