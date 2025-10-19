/**
 * Carbon Calculator Library
 * Calculates carbon footprints and rewards for various activities
 */

export interface CarbonCalculation {
  footprint: number; // kg CO2
  credits: number; // Carbon credits awarded/deducted
  breakdown?: {
    [key: string]: number;
  };
}

// Constants (kg CO2 per unit)
const CARBON_FACTORS = {
  // Transportation (per km)
  CAR_PETROL: 0.171,
  CAR_DIESEL: 0.165,
  CAR_ELECTRIC: 0.053,
  BUS: 0.089,
  TRAIN: 0.041,
  FLIGHT_DOMESTIC: 0.255,
  FLIGHT_INTERNATIONAL: 0.195,
  BICYCLE: 0,
  WALKING: 0,

  // Accommodation (per night)
  HOMESTAY: 5.0, // Low impact
  HOTEL_STANDARD: 20.0,
  HOTEL_LUXURY: 35.0,

  // Products (per kg)
  LOCAL_ORGANIC: 0.5,
  LOCAL_CONVENTIONAL: 1.2,
  IMPORTED_PRODUCT: 3.5,

  // Energy (per kWh)
  ELECTRICITY_GRID: 0.527,
  SOLAR_POWER: 0.041,

  // Activities
  PLASTIC_BOTTLE: 0.082,
  PAPER_RECYCLED: -0.05, // Negative = carbon saved
  TREE_PLANTED: -21.77, // Average tree absorbs per year
};

// Credit conversion rate (1 credit = 1 kg CO2 offset)
const CREDIT_PER_KG_CO2 = 1;

/**
 * Calculate carbon footprint for travel
 */
export function calculateTravelFootprint(params: {
  mode: keyof typeof CARBON_FACTORS;
  distance: number; // km
  passengers?: number;
}): CarbonCalculation {
  const { mode, distance, passengers = 1 } = params;
  
  const factor = CARBON_FACTORS[mode] || 0;
  const totalFootprint = (factor * distance) / passengers;
  
  // Award credits for low-carbon transport
  const credits = mode === 'BICYCLE' || mode === 'WALKING' 
    ? distance * 0.1 // 0.1 credit per km
    : mode === 'TRAIN' || mode === 'BUS'
    ? distance * 0.05 // 0.05 credit per km for public transport
    : 0;

  return {
    footprint: totalFootprint,
    credits,
    breakdown: {
      transport: totalFootprint,
    },
  };
}

/**
 * Calculate carbon footprint for accommodation
 */
export function calculateAccommodationFootprint(params: {
  type: 'HOMESTAY' | 'HOTEL_STANDARD' | 'HOTEL_LUXURY';
  nights: number;
  guests?: number;
}): CarbonCalculation {
  const { type, nights, guests = 1 } = params;
  
  const factor = CARBON_FACTORS[type] || CARBON_FACTORS.HOTEL_STANDARD;
  const totalFootprint = (factor * nights) / guests;
  
  // Award credits for sustainable accommodation
  const credits = type === 'HOMESTAY' 
    ? nights * 2 // 2 credits per night in homestay
    : 0;

  return {
    footprint: totalFootprint,
    credits,
    breakdown: {
      accommodation: totalFootprint,
    },
  };
}

/**
 * Calculate carbon footprint for product
 */
export function calculateProductFootprint(params: {
  type: 'LOCAL_ORGANIC' | 'LOCAL_CONVENTIONAL' | 'IMPORTED_PRODUCT';
  weight: number; // kg
  quantity?: number;
}): CarbonCalculation {
  const { type, weight, quantity = 1 } = params;
  
  const factor = CARBON_FACTORS[type] || CARBON_FACTORS.LOCAL_CONVENTIONAL;
  const totalFootprint = factor * weight * quantity;
  
  // Award credits for sustainable purchases
  const credits = type === 'LOCAL_ORGANIC' 
    ? weight * quantity * 0.5 // 0.5 credit per kg
    : type === 'LOCAL_CONVENTIONAL'
    ? weight * quantity * 0.2 // 0.2 credit per kg
    : 0;

  return {
    footprint: totalFootprint,
    credits,
    breakdown: {
      product: totalFootprint,
    },
  };
}

/**
 * Calculate shipping carbon footprint
 */
export function calculateShippingFootprint(params: {
  distance: number; // km
  weight: number; // kg
  method: 'AIR' | 'SEA' | 'ROAD' | 'RAIL';
}): CarbonCalculation {
  const { distance, weight, method } = params;
  
  const factors = {
    AIR: 0.602,
    SEA: 0.016,
    ROAD: 0.096,
    RAIL: 0.028,
  };
  
  const factor = factors[method] || factors.ROAD;
  const totalFootprint = factor * distance * weight;

  return {
    footprint: totalFootprint,
    credits: 0,
    breakdown: {
      shipping: totalFootprint,
    },
  };
}

/**
 * Calculate carbon savings from activities
 */
export function calculateCarbonSavings(activity: {
  type: 'RECYCLE_PAPER' | 'PLANT_TREE' | 'SOLAR_ENERGY' | 'COMPOSTING';
  amount: number; // kg for paper, number for trees, kWh for energy
}): CarbonCalculation {
  const { type, amount } = activity;
  
  let saved = 0;
  let credits = 0;
  
  switch (type) {
    case 'RECYCLE_PAPER':
      saved = amount * Math.abs(CARBON_FACTORS.PAPER_RECYCLED);
      credits = amount * 0.1; // 0.1 credit per kg
      break;
    case 'PLANT_TREE':
      saved = amount * Math.abs(CARBON_FACTORS.TREE_PLANTED);
      credits = amount * 10; // 10 credits per tree
      break;
    case 'SOLAR_ENERGY':
      saved = amount * (CARBON_FACTORS.ELECTRICITY_GRID - CARBON_FACTORS.SOLAR_POWER);
      credits = amount * 0.05; // 0.05 credit per kWh
      break;
    case 'COMPOSTING':
      saved = amount * 0.5; // Estimate
      credits = amount * 0.2; // 0.2 credit per kg
      break;
  }

  return {
    footprint: -saved, // Negative = carbon saved
    credits,
    breakdown: {
      [type.toLowerCase()]: -saved,
    },
  };
}

/**
 * Calculate booking footprint (comprehensive)
 */
export function calculateBookingFootprint(params: {
  travel: {
    mode: keyof typeof CARBON_FACTORS;
    distance: number;
  };
  accommodation: {
    type: 'HOMESTAY' | 'HOTEL_STANDARD' | 'HOTEL_LUXURY';
    nights: number;
  };
  guests: number;
}): CarbonCalculation {
  const { travel, accommodation, guests } = params;
  
  const travelCalc = calculateTravelFootprint({
    mode: travel.mode,
    distance: travel.distance,
    passengers: guests,
  });
  
  const accomCalc = calculateAccommodationFootprint({
    type: accommodation.type,
    nights: accommodation.nights,
    guests,
  });
  
  return {
    footprint: travelCalc.footprint + accomCalc.footprint,
    credits: travelCalc.credits + accomCalc.credits,
    breakdown: {
      ...travelCalc.breakdown,
      ...accomCalc.breakdown,
    },
  };
}

/**
 * Calculate offset cost
 */
export function calculateOffsetCost(footprintKgCO2: number): {
  credits: number;
  cost: number; // In currency
} {
  const credits = Math.ceil(footprintKgCO2 * CREDIT_PER_KG_CO2);
  const costPerCredit = 10; // ₹10 per credit (configurable)
  
  return {
    credits,
    cost: credits * costPerCredit,
  };
}

/**
 * Award credits for sustainable actions
 */
export function awardCreditsForAction(action: {
  type: 'HOMESTAY_BOOKING' | 'LOCAL_PURCHASE' | 'GREEN_TRANSPORT' | 'RECYCLING' | 'TREE_PLANTING';
  amount: number; // Amount depends on type
}): number {
  const { type, amount } = action;
  
  const creditRates = {
    HOMESTAY_BOOKING: 2.0, // per night
    LOCAL_PURCHASE: 0.5, // per kg
    GREEN_TRANSPORT: 0.1, // per km
    RECYCLING: 0.1, // per kg
    TREE_PLANTING: 10.0, // per tree
  };
  
  const rate = creditRates[type] || 0;
  return amount * rate;
}

/**
 * Get carbon impact level
 */
export function getCarbonImpactLevel(footprintKgCO2: number): {
  level: 'LOW' | 'MEDIUM' | 'HIGH' | 'VERY_HIGH';
  color: string;
  message: string;
} {
  if (footprintKgCO2 < 10) {
    return {
      level: 'LOW',
      color: 'green',
      message: 'Excellent! Your carbon footprint is very low.',
    };
  } else if (footprintKgCO2 < 50) {
    return {
      level: 'MEDIUM',
      color: 'yellow',
      message: 'Good! Your carbon footprint is moderate.',
    };
  } else if (footprintKgCO2 < 100) {
    return {
      level: 'HIGH',
      color: 'orange',
      message: 'Consider reducing your carbon footprint.',
    };
  } else {
    return {
      level: 'VERY_HIGH',
      color: 'red',
      message: 'Your carbon footprint is high. Please consider offsetting.',
    };
  }
}

/**
 * Generate carbon report
 */
export function generateCarbonReport(data: {
  totalFootprint: number;
  creditsEarned: number;
  creditsSpent: number;
  offsetPercentage: number;
}): {
  netFootprint: number;
  netCredits: number;
  rating: string;
  recommendations: string[];
} {
  const { totalFootprint, creditsEarned, creditsSpent, offsetPercentage } = data;
  
  const netFootprint = totalFootprint * (1 - offsetPercentage / 100);
  const netCredits = creditsEarned - creditsSpent;
  
  let rating = 'NEEDS_IMPROVEMENT';
  if (offsetPercentage >= 100) rating = 'CARBON_NEUTRAL';
  else if (offsetPercentage >= 75) rating = 'EXCELLENT';
  else if (offsetPercentage >= 50) rating = 'GOOD';
  else if (offsetPercentage >= 25) rating = 'FAIR';
  
  const recommendations: string[] = [];
  if (offsetPercentage < 100) {
    recommendations.push('Offset remaining carbon footprint');
  }
  if (netCredits < 0) {
    recommendations.push('Earn more credits through sustainable actions');
  }
  recommendations.push('Use public transport or bicycle');
  recommendations.push('Choose local and organic products');
  recommendations.push('Stay in homestays instead of hotels');
  
  return {
    netFootprint,
    netCredits,
    rating,
    recommendations: recommendations.slice(0, 3),
  };
}
