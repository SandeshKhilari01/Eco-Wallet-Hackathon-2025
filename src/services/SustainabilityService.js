// src/services/SustainabilityService.js
import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize the Google Generative AI with your API key
// Note: In production, you should store this in environment variables
const API_KEY = "AIzaSyDilUoGyTxdUnLRlM1GCEKK94qC43nrNqA"; // Replace with your actual Gemini API key
const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

class SustainabilityService {
  /**
   * Calculate sustainability score for a product
   * @param {Object} product - The product object
   * @param {string} userAddress - User's address from profile
   * @returns {Promise<Object>} - Sustainability score and analysis
   */
  static async calculateProductScore(product, userAddress) {
    try {
      // Extract relevant product data
      const { name, brand, carbonData } = product;
      
      // Default values if carbonData is not available
      const productWeight = carbonData?.weight_kg || 1;
      const category = carbonData?.category || "unknown";
      const materialComposition = carbonData?.material_composition || [];
      const packaging = carbonData?.packaging || {};
      const supplyChain = carbonData?.supply_chain || { legs: [] };
      const originCountry = carbonData?.origin_country || "unknown";
      
      // Create a prompt for Gemini to analyze the product's sustainability
      const prompt = `
        Calculate a sustainability score (0-100) for this product:
        
        Product Details:
        - Name: ${name}
        - Brand: ${brand}
        - Category: ${category}
        - Weight: ${productWeight} kg
        - Origin Country: ${originCountry}
        
        Material Composition:
        ${materialComposition.map(m => `- ${m.material}: ${m.percentage}%, CO2e per kg: ${m.co2e_per_kg}`).join('\n')}
        
        Packaging:
        ${Object.entries(packaging).map(([key, value]) => 
          `- ${key}: type: ${value.type}, weight: ${value.weight_kg} kg`
        ).join('\n')}
        
        Supply Chain:
        ${supplyChain.legs ? supplyChain.legs.map(leg => 
          `- Distance: ${leg.distance_km} km, Mode: ${leg.mode}`
        ).join('\n') : 'No supply chain data'}
        
        User Location:
        - Address: ${userAddress}
        
        Calculate:
        1. Overall sustainability score (0-100)
        2. Key factors affecting the score (positive and negative)
        3. Main contributor to environmental impact
        4. Estimated CO2e savings compared to conventional alternatives
        
        Return a JSON object with these fields:
        {
          "score": number,
          "factors": {
            "positive": [string, string],
            "negative": [string, string]
          },
          "mainImpact": string,
          "co2eSavings": number,
          "sustainabilityLevel": "low" | "medium" | "high"
        }
      `;

      // Call Gemini API
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      // Parse the JSON response from Gemini
      // Extract the JSON part from the response (handles cases where Gemini adds explanatory text)
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      
      if (jsonMatch) {
        const jsonResponse = JSON.parse(jsonMatch[0]);
        return jsonResponse;
      } else {
        console.error("Failed to parse Gemini response:", text);
        return this.getFallbackScore(product);
      }
    } catch (error) {
      console.error("Error calculating sustainability score:", error);
      return this.getFallbackScore(product);
    }
  }

  /**
   * Find sustainable product alternatives
   * @param {Array} cartProducts - Products in the cart
   * @param {Array} allProducts - All available products
   * @param {string} userAddress - User's address
   * @returns {Promise<Array>} - Suggested sustainable alternatives
   */
  static async getSustainableAlternatives(cartProducts, allProducts, userAddress) {
    try {
      // Extract product IDs, categories, and low sustainability items
      const cartProductIds = cartProducts.map(p => p.id);
      const cartCategories = new Set(cartProducts.map(p => p.carbonData?.category || "unknown"));
      
      // Find products that are not in cart and match the categories
      const potentialAlternatives = allProducts.filter(product => 
        !cartProductIds.includes(product.id) && 
        (cartCategories.has(product.carbonData?.category) || 
         product.tags?.some(tag => ["eco-friendly", "organic", "sustainable", "recyclable"].includes(tag)))
      );
      
      // Sort by sustainability indicators (if available in the product data)
      const sortedAlternatives = potentialAlternatives.sort((a, b) => {
        const aScore = a.points || 0;
        const bScore = b.points || 0;
        return bScore - aScore; // Higher points = more sustainable
      });
      
      // Take top 4 alternatives
      const topAlternatives = sortedAlternatives.slice(0, 4);
      
      // Enhance with Gemini analysis
      const cartItemsText = cartProducts.map(p => p.name).join(", ");
      
      const prompt = `
        I have these items in my shopping cart: ${cartItemsText}
        
        From the following potential sustainable alternatives:
        ${topAlternatives.map(p => `- ${p.name} (${p.brand})`).join('\n')}
        
        Recommend which would be the best sustainable additions to my cart based on:
        1. Complementary to existing items
        2. High sustainability impact
        3. Variety of product categories
        
        For each recommendation, explain briefly why it's sustainable and why it complements my cart.
        
        Return a JSON array where each object has:
        {
          "productId": number,
          "reason": string,
          "sustainabilityHighlight": string,
          "complementaryTo": string
        }
      `;
      
      // Call Gemini API
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      // Parse the JSON response
      const jsonMatch = text.match(/\[[\s\S]*\]/);
      
      if (jsonMatch) {
        const recommendations = JSON.parse(jsonMatch[0]);
        
        // Match recommendations back to actual product objects
        return recommendations.map(rec => {
          const product = topAlternatives.find(p => p.id === rec.productId) || 
                         topAlternatives.find((_, index) => index === 0); // Fallback to first alternative
          
          return {
            ...product,
            reason: rec.reason,
            sustainabilityHighlight: rec.sustainabilityHighlight,
            complementaryTo: rec.complementaryTo
          };
        });
      } else {
        // Fallback to simple recommendation if Gemini response can't be parsed
        return topAlternatives.map(product => ({
          ...product,
          reason: "Sustainable alternative",
          sustainabilityHighlight: product.impact?.emissions || "Eco-friendly option",
          complementaryTo: "Your cart items"
        }));
      }
    } catch (error) {
      console.error("Error getting sustainable alternatives:", error);
      // Fallback to simple recommendations
      return allProducts
        .filter(p => p.points > 0 && !cartProducts.map(cp => cp.id).includes(p.id))
        .slice(0, 4)
        .map(product => ({
          ...product,
          reason: "Sustainable alternative",
          sustainabilityHighlight: product.impact?.emissions || "Eco-friendly option",
          complementaryTo: "Your cart items"
        }));
    }
  }

  /**
   * Provide a fallback score when API calls fail
   * @param {Object} product - The product object
   * @returns {Object} - Basic sustainability score
   */
  static getFallbackScore(product) {
    // Use any available sustainability data from the product itself
    const hasEcoTags = product.tags?.some(tag => 
      ["eco-friendly", "organic", "sustainable", "recyclable", "biodegradable"].includes(tag)
    );
    
    const co2Saved = product.co2SavedKg || 0;
    const ecoPoints = product.points || 0;
    
    // Calculate a basic score based on available data
    let score = 50; // Default middle score
    
    if (hasEcoTags) score += 15;
    if (co2Saved > 0) score += Math.min(co2Saved * 10, 20);
    if (ecoPoints > 0) score += Math.min(ecoPoints / 10, 15);
    
    // Cap score at 100
    score = Math.min(score, 100);
    
    return {
      score,
      factors: {
        positive: [
          hasEcoTags ? "Eco-friendly product tags" : "Standard product",
          co2Saved > 0 ? `Saves ${co2Saved}kg of CO2` : "No documented CO2 savings"
        ],
        negative: [
          "Limited sustainability data available",
          "Unable to perform detailed analysis"
        ]
      },
      mainImpact: "Unknown",
      co2eSavings: co2Saved,
      sustainabilityLevel: score > 70 ? "high" : score > 40 ? "medium" : "low"
    };
  }
}

export default SustainabilityService;