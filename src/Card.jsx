// Card.jsx
import React from "react";
import "./Card.css";

const emissionFactors = {
  transport: {
    electric_vehicle: 0.00008,
    hybrid_vehicle: 0.00012,
    diesel_truck: 0.00015,
    cng_truck: 0.0001,
    cargo_bicycle: 0,
    cargo_ship: 0.00001,
    cargo_train: 0.00003,
    cargo_plane: 0.001,
    sail_freight: 0.000005,
  },
  last_mile: {
    urban: 0.10,
    rural: 0.15,
  }
};

const calculateEmissions = (product) => {
  const { carbonData } = product;
  const weightKg = carbonData.weight_kg;

  // 1. Material emissions
  const materialEmission = carbonData.material_composition.reduce((total, mat) => {
    const fraction = mat.percentage / 100;
    return total + fraction * weightKg * mat.co2e_per_kg;
  }, 0);

  // 2. Packaging emissions
  const pack = carbonData.packaging;
  const packagingTypes = ['primary', 'secondary', 'tertiary'];
  const packagingEmission = packagingTypes.reduce((total, type) => {
    if (pack[type]) {
      const co2Factor = getPackagingFactor(pack[type].type);
      total += pack[type].weight_kg * co2Factor;
    }
    return total;
  }, 0);

  // 3. Transport emissions
  const transportEmission = carbonData.supply_chain.legs.reduce((total, leg) => {
    const factor = emissionFactors.transport[leg.mode] || 0;
    return total + leg.distance_km * weightKg * factor;
  }, 0);

  // 4. Last-mile (optional)
  const lastMileFactor = emissionFactors.last_mile[carbonData.location_density];
  const lastMileEmission = lastMileFactor ? weightKg * lastMileFactor : 0;

  // Total
  const totalEmission = materialEmission + packagingEmission + transportEmission + lastMileEmission;

  // Determine highest contributor
  const categories = {
    material: materialEmission,
    packaging: packagingEmission,
    transport: transportEmission,
    last_mile: lastMileEmission,
  };
  const highestContributor = Object.entries(categories).reduce((a, b) => a[1] > b[1] ? a : b)[0];

  return {
    totalEmission: totalEmission.toFixed(2),
    breakdown: {
      material: materialEmission.toFixed(2),
      packaging: packagingEmission.toFixed(2),
      transport: transportEmission.toFixed(2),
      last_mile: lastMileEmission.toFixed(2),
    },
    highestContributor
  };
};

const getPackagingFactor = (type) => {
  const factors = {
    recycled_cardboard: 0.7,
    virgin_cardboard: 1.2,
    biodegradable_bag: 1.5,
    recycled_plastic: 2.0,
    virgin_plastic: 3.2,
    glass_container: 0.9,
    aluminum_can: 1.8,
    mushroom_packaging: 0.3,
    seaweed_packaging: 0.2,
    reusable_container: 0,
    compostable_pulp: 0
  };
  return factors[type] || 0;
};

const Card = ({ product }) => {
  const {
    name,
    img_url,
    price,
    originalPrice,
    carbonData,
  } = product;

  const { totalEmission, breakdown, highestContributor } = calculateEmissions(product);

  return (
    <div className="card">
      <img src={img_url} alt={name} className="product-img" />
      <h2>{name}</h2>
      <p>
        <strong>Price:</strong> ₹{price}{" "}
        <span className="original-price">₹{originalPrice}</span>
      </p>

      <div className="section">
        <h4>Carbon Footprint</h4>
        <p><strong>Total Emission:</strong> {totalEmission} kgCO₂e</p>
        <ul>
          <li><strong>Materials:</strong> {breakdown.material} kgCO₂e</li>
          <li><strong>Packaging:</strong> {breakdown.packaging} kgCO₂e</li>
          <li><strong>Transport:</strong> {breakdown.transport} kgCO₂e</li>
          <li><strong>Last Mile:</strong> {breakdown.last_mile} kgCO₂e</li>
        </ul>
        <p><strong>Highest Contributor:</strong> {highestContributor}</p>
      </div>
    </div>
  );
};

export default Card;
