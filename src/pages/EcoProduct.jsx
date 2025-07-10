import React, { useContext, useState } from 'react';
import { Leaf, Wallet, Check, X, ShoppingBag } from 'lucide-react';
import { CartContext } from '../context/CartContext.jsx';

const productsData = [
  {
    id: 1,
    name: "EcoBasics Organic Cotton Tee",
    img_url: "https://m.media-amazon.com/images/I/61zbGRlAuYL._AC_SY550_.jpg",
    price: 200,
    originalPrice: 250,
    carbonData: {
      weight_kg: 0.2,
      material_composition: [
        { material: "organic_cotton", percentage: 100, co2e_per_kg: 2.5 }
      ],
      packaging: {
        primary: { type: "biodegradable_bag", weight_kg: 0.01 },
        secondary: { type: "recycled_cardboard", weight_kg: 0.05 }
      },
      supply_chain: {
        legs: [
          { distance_km: 8000, mode: "cargo_ship" },
          { distance_km: 200, mode: "electric_vehicle" }
        ]
      }
    },
    highest_contributor: "material"
  },
  {
    id: 2,
    name: "FastFashionCo Conventional Cotton Tee",
    img_url: "https://www.selectedhomme.in/cdn/shop/files/118607602_g6.jpg?v=1746509285&width=700",
    price: 150,
    originalPrice: 200,
    carbonData: {
      weight_kg: 0.2,
      material_composition: [
        { material: "conventional_cotton", percentage: 100, co2e_per_kg: 8.0 }
      ],
      packaging: {
        primary: { type: "virgin_plastic", weight_kg: 0.015 },
        secondary: { type: "virgin_cardboard", weight_kg: 0.05 }
      },
      supply_chain: {
        legs: [
          { distance_km: 5000, mode: "cargo_plane" },
          { distance_km: 100, mode: "diesel_truck" }
        ]
      }
    },
    highest_contributor: "transport"
  },
  {
    id: 3,
    name: "GreenBlend Organic/Recycled Tee",
    img_url: "https://www.passenger-clothing.com/cdn/shop/files/DOIsajXJ7tKJtc2cwsgfAPeh44eWXrzK9QrVs12dePg.jpg?v=1721395874&width=493",
    price: 280,
    originalPrice: 320,
    carbonData: {
      weight_kg: 0.2,
      material_composition: [
        { material: "organic_cotton", percentage: 50, co2e_per_kg: 2.5 },
        { material: "recycled_polyester", percentage: 50, co2e_per_kg: 3.2 }
      ],
      packaging: {
        primary: { type: "recycled_plastic", weight_kg: 0.02 },
        secondary: { type: "recycled_cardboard", weight_kg: 0.05 }
      },
      supply_chain: {
        legs: [
          { distance_km: 9000, mode: "cargo_ship" },
          { distance_km: 150, mode: "cargo_train" }
        ]
      }
    },
    highest_contributor: "material"
  },
  {
    id: 4,
    name: "QuickFly Lyocell Tank Green Cotton Tee",
    img_url: "https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcQ0KxFv0x13si1p7A-a_MboWdcqj65KMoPbzwtqaKwd8KPHHCZAlkotWZvTVJfUcZxGKyykO1I",
    price: 220,
    originalPrice: 250,
    carbonData: {
      weight_kg: 0.05,
      material_composition: [
        { material: "tencel_lyocell", percentage: 100, co2e_per_kg: 1.5 }
      ],
      packaging: {
        primary: { type: "biodegradable_bag", weight_kg: 0.005 },
        secondary: { type: "compostable_pulp", weight_kg: 0.01 }
      },
      supply_chain: {
        legs: [{ distance_km: 10000, mode: "cargo_plane" }]
      }
    },
    highest_contributor: "transport"
  }
];

function EcoProduct({ product, onRedeem, walletBalance }) {
  const { name, img_url, price, originalPrice } = product;
  const ecoPoints = price * 4;
  const canAfford = walletBalance >= ecoPoints;
  
  // Calculate eco score
  const materialEmissions = product.carbonData.material_composition.reduce(
    (total, mat) => total + (mat.percentage / 100) * mat.co2e_per_kg * product.carbonData.weight_kg,
    0
  );
  
  const packagingWeights = Object.values(product.carbonData.packaging).reduce(
    (total, item) => total + item.weight_kg,
    0
  );
  
  const supplyChainDistance = product.carbonData.supply_chain.legs.reduce(
    (total, leg) => total + leg.distance_km,
    0
  );
  
  const normalize = (value, max) => Math.max(0, Math.min(100, 100 - (value / max) * 100));
  const scoreMaterial = normalize(materialEmissions, 50);
  const scorePackaging = normalize(packagingWeights, 5);
  const scoreDistance = normalize(supplyChainDistance, 2000);
  
  const ecoScore = (
    scoreMaterial * 0.4 +
    scorePackaging * 0.3 +
    scoreDistance * 0.3
  ).toFixed(0);

  return (
    <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100">
      <div className="relative">
        <img 
          src={img_url} 
          alt={name} 
          className="w-full h-56 object-cover"
        />
        <div className="absolute top-3 right-3 bg-gradient-to-r from-green-400 to-emerald-500 text-white px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1">
          <Leaf size={14} />
          {ecoPoints}
        </div>
      </div>
      
      <div className="p-5">
        <h3 className="text-lg font-bold text-gray-800 mb-2 line-clamp-2">{name}</h3>
        
        <div className="flex items-center gap-2 mb-4">
          <span className="text-xl font-bold text-green-600">₹{price}</span>
          <span className="text-sm text-gray-500 line-through">₹{originalPrice}</span>
          <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full font-medium">
            {Math.round(((originalPrice - price) / originalPrice) * 100)}% OFF
          </span>
        </div>
        
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Wallet className="text-green-600" size={16} />
            <span className="text-sm font-medium text-gray-700">
              {ecoPoints} EcoPoints
            </span>
          </div>
          <div className="text-xs text-gray-500">
            {canAfford ? "✓ Available" : "Insufficient balance"}
          </div>
        </div>
        
        <button
          onClick={() => onRedeem(product)}
          disabled={!canAfford}
          className={`w-full py-3 px-4 rounded-xl font-bold text-sm transition-all duration-200 flex items-center justify-center gap-2 ${
            canAfford 
              ? 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl' 
              : 'bg-gray-200 text-gray-500 cursor-not-allowed'
          }`}
        >
          <ShoppingBag size={16} />
          {canAfford ? 'Redeem Now' : 'Insufficient Points'}
        </button>
      </div>
    </div>
  );
}

function SuccessModal({ product, onClose }) {
  if (!product) return null;
  
  const ecoPoints = product.price * 4;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 text-center animate-pulse">
        <div className="mb-6">
          <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check size={40} className="text-white" />
          </div>
          <h2 className="text-2xl font-bold text-green-800 mb-2">Order Placed Successfully!</h2>
          <p className="text-gray-600">Thank you for choosing eco-friendly products</p>
        </div>
        
        <div className="bg-green-50 rounded-xl p-4 mb-6">
          <h3 className="font-bold text-green-800 mb-2">{product.name}</h3>
          <div className="flex items-center justify-center gap-2 text-green-700">
            <Leaf size={16} />
            <span className="font-medium">{ecoPoints} EcoPoints Redeemed</span>
          </div>
        </div>
        
        <div className="text-center mb-6">
          <p className="text-sm text-gray-600 mb-2">
            🌱 You've made a positive impact on the environment!
          </p>
          <p className="text-sm text-green-700 font-medium">
            Keep shopping eco-friendly products and earn more rewards
          </p>
        </div>
        
        <button
          onClick={onClose}
          className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white py-3 px-6 rounded-xl font-bold transition-all duration-200 shadow-lg hover:shadow-xl"
        >
          Continue Shopping
        </button>
      </div>
    </div>
  );
}

export default function EcoWalletStore() {
  const { ecoPoints, addEcoPoints } = useContext(CartContext);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [redeemedProduct, setRedeemedProduct] = useState(null);

  const handleRedeem = (product) => {
    const ecoPointsCost = product.price * 4;
    if (ecoPoints >= ecoPointsCost) {
      addEcoPoints(-ecoPointsCost);
      setRedeemedProduct(product);
      setShowSuccessModal(true);
    }
  };

  const handleCloseModal = () => {
    setShowSuccessModal(false);
    setRedeemedProduct(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      {/* Header */}
      <div className="bg-white shadow-lg border-b border-green-100">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
                <Leaf className="text-white" size={24} />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-green-800">EcoWallet Store</h1>
                <p className="text-green-600 text-sm">Redeem your eco points for sustainable products</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-3 rounded-xl shadow-lg">
                <div className="flex items-center gap-2">
                  <Wallet size={20} />
                  <div>
                    <p className="text-xs opacity-90">Your Balance</p>
                    <p className="text-xl font-bold">{ecoPoints.toLocaleString()} Points</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            🌿 Exclusive Eco Products - Redeem Only
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            These premium eco-friendly products are exclusively available for redemption with your EcoWallet points. 
            Make sustainable choices while earning rewards!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {productsData.map((product) => (
            <EcoProduct
              key={product.id}
              product={product}
              onRedeem={handleRedeem}
              walletBalance={ecoPoints}
            />
          ))}
        </div>

        {/* Info Banner */}
        <div className="mt-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl p-8 text-center text-white">
          <h3 className="text-2xl font-bold mb-4">How EcoWallet Works</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mb-3">
                <ShoppingBag className="text-black" size={24} />
              </div>
              <h4 className="font-bold mb-2">Shop Eco Products</h4>
              <p className="text-sm opacity-90">Purchase sustainable products and earn EcoPoints</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mb-3">
                <Wallet className="text-black" size={24} />
              </div>
              <h4 className="font-bold mb-2">Earn Points</h4>
              <p className="text-sm opacity-90">Get 4x EcoPoints for every rupee spent</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mb-3">
                <Leaf className="text-black" size={24} />
              </div>
              <h4 className="font-bold mb-2">Redeem Rewards</h4>
              <p className="text-sm opacity-90">Use points for exclusive eco-friendly products</p>
            </div>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      {showSuccessModal && (
        <SuccessModal
          product={redeemedProduct}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
}