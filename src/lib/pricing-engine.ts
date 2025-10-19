/**
 * Dynamic Pricing Engine
 * Calculates booking prices based on multiple factors
 */

export interface PricingFactors {
  homestayId: string;
  checkIn: Date;
  checkOut: Date;
  guests: number;
  promoCode?: string;
  isEarlyBird?: boolean;
  isLastMinute?: boolean;
}

export interface PriceBreakdown {
  basePrice: number;
  nightlyRates: Array<{ date: Date; rate: number }>;
  subtotal: number;
  discounts: Array<{ type: string; amount: number; description: string }>;
  totalDiscount: number;
  cleaningFee: number;
  serviceFee: number;
  taxes: number;
  totalPrice: number;
  savings: number;
}

export interface PricingRule {
  type: 'weekend' | 'holiday' | 'seasonal' | 'occupancy' | 'length-of-stay';
  multiplier?: number;
  discount?: number;
  condition?: any;
}

/**
 * Calculate number of nights between two dates
 */
export function calculateNights(checkIn: Date, checkOut: Date): number {
  const msPerDay = 1000 * 60 * 60 * 24;
  const diffMs = checkOut.getTime() - checkIn.getTime();
  return Math.ceil(diffMs / msPerDay);
}

/**
 * Check if date is a weekend (Friday or Saturday)
 */
export function isWeekend(date: Date): boolean {
  const day = date.getDay();
  return day === 5 || day === 6; // Friday or Saturday
}

/**
 * Check if date is a holiday
 */
export function isHoliday(date: Date): boolean {
  // Common holidays (can be extended)
  const holidays = [
    '01-01', // New Year
    '01-26', // Republic Day (India)
    '08-15', // Independence Day (India)
    '10-02', // Gandhi Jayanti
    '12-25', // Christmas
  ];
  
  const monthDay = `${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  return holidays.includes(monthDay);
}

/**
 * Get season for a date
 */
export function getSeason(date: Date): 'peak' | 'high' | 'shoulder' | 'low' {
  const month = date.getMonth();
  
  // Peak season: Oct-Nov, Dec-Jan (holidays & festivals)
  if ([9, 10, 11, 0].includes(month)) return 'peak';
  
  // High season: Feb-Mar (pleasant weather)
  if ([1, 2].includes(month)) return 'high';
  
  // Shoulder season: Apr-May, Sep
  if ([3, 4, 8].includes(month)) return 'shoulder';
  
  // Low season: Jun-Aug (monsoon)
  return 'low';
}

/**
 * Calculate early bird discount (booking 30+ days in advance)
 */
export function calculateEarlyBirdDiscount(
  checkIn: Date,
  basePrice: number
): number {
  const today = new Date();
  const daysInAdvance = Math.ceil((checkIn.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  
  if (daysInAdvance >= 60) return basePrice * 0.15; // 15% for 60+ days
  if (daysInAdvance >= 30) return basePrice * 0.10; // 10% for 30+ days
  return 0;
}

/**
 * Calculate last-minute discount (booking within 7 days)
 */
export function calculateLastMinuteDiscount(
  checkIn: Date,
  basePrice: number,
  occupancyRate: number
): number {
  const today = new Date();
  const daysInAdvance = Math.ceil((checkIn.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  
  // Only if low occupancy and within 3 days
  if (daysInAdvance <= 3 && occupancyRate < 0.5) {
    return basePrice * 0.20; // 20% discount
  }
  return 0;
}

/**
 * Calculate length of stay discount
 */
export function calculateLengthOfStayDiscount(
  nights: number,
  subtotal: number
): number {
  if (nights >= 28) return subtotal * 0.30; // 30% for monthly stays
  if (nights >= 14) return subtotal * 0.20; // 20% for 2+ weeks
  if (nights >= 7) return subtotal * 0.10; // 10% for 1+ week
  return 0;
}

/**
 * Calculate seasonal multiplier
 */
export function getSeasonalMultiplier(season: string): number {
  switch (season) {
    case 'peak': return 1.5;
    case 'high': return 1.25;
    case 'shoulder': return 1.0;
    case 'low': return 0.8;
    default: return 1.0;
  }
}

/**
 * Calculate occupancy-based price adjustment
 */
export function calculateOccupancyMultiplier(occupancyRate: number): number {
  if (occupancyRate >= 0.9) return 1.3; // 30% increase when nearly full
  if (occupancyRate >= 0.7) return 1.15; // 15% increase when 70%+ full
  if (occupancyRate >= 0.5) return 1.0; // No change
  if (occupancyRate >= 0.3) return 0.9; // 10% discount when < 50% full
  return 0.8; // 20% discount when < 30% full
}

/**
 * Calculate nightly rate with all factors
 */
export function calculateNightlyRate(
  baseRate: number,
  date: Date,
  occupancyRate: number = 0.5
): number {
  let rate = baseRate;
  
  // Weekend multiplier
  if (isWeekend(date)) {
    rate *= 1.2; // 20% increase for weekends
  }
  
  // Holiday multiplier
  if (isHoliday(date)) {
    rate *= 1.4; // 40% increase for holidays
  }
  
  // Seasonal adjustment
  const season = getSeason(date);
  rate *= getSeasonalMultiplier(season);
  
  // Occupancy adjustment
  rate *= calculateOccupancyMultiplier(occupancyRate);
  
  return Math.round(rate);
}

/**
 * Apply promo code discount
 */
export function applyPromoCode(
  code: string,
  subtotal: number
): { valid: boolean; discount: number; description: string } {
  // Mock promo codes (should be fetched from database)
  const promoCodes: Record<string, { discount: number; type: 'percent' | 'fixed'; description: string }> = {
    'WELCOME10': { discount: 10, type: 'percent', description: 'Welcome discount' },
    'SUMMER20': { discount: 20, type: 'percent', description: 'Summer special' },
    'SAVE500': { discount: 500, type: 'fixed', description: 'Fixed discount' },
  };
  
  const promo = promoCodes[code.toUpperCase()];
  if (!promo) {
    return { valid: false, discount: 0, description: '' };
  }
  
  const discount = promo.type === 'percent'
    ? subtotal * (promo.discount / 100)
    : promo.discount;
  
  return { valid: true, discount, description: promo.description };
}

/**
 * Main pricing calculation function
 */
export async function calculateBookingPrice(
  factors: PricingFactors,
  homestayData: {
    basePricePerNight: number;
    cleaningFee: number;
    serviceFeePercent: number;
    taxPercent: number;
    currentOccupancyRate?: number;
  }
): Promise<PriceBreakdown> {
  const nights = calculateNights(factors.checkIn, factors.checkOut);
  const occupancyRate = homestayData.currentOccupancyRate || 0.5;
  
  // Calculate nightly rates for each date
  const nightlyRates: Array<{ date: Date; rate: number }> = [];
  let subtotal = 0;
  
  for (let i = 0; i < nights; i++) {
    const date = new Date(factors.checkIn);
    date.setDate(date.getDate() + i);
    
    const rate = calculateNightlyRate(
      homestayData.basePricePerNight,
      date,
      occupancyRate
    );
    
    nightlyRates.push({ date, rate });
    subtotal += rate;
  }
  
  // Calculate discounts
  const discounts: Array<{ type: string; amount: number; description: string }> = [];
  
  // Early bird discount
  if (factors.isEarlyBird) {
    const earlyBirdDiscount = calculateEarlyBirdDiscount(factors.checkIn, subtotal);
    if (earlyBirdDiscount > 0) {
      discounts.push({
        type: 'early-bird',
        amount: earlyBirdDiscount,
        description: 'Early bird discount',
      });
    }
  }
  
  // Last minute discount
  if (factors.isLastMinute) {
    const lastMinuteDiscount = calculateLastMinuteDiscount(
      factors.checkIn,
      subtotal,
      occupancyRate
    );
    if (lastMinuteDiscount > 0) {
      discounts.push({
        type: 'last-minute',
        amount: lastMinuteDiscount,
        description: 'Last minute deal',
      });
    }
  }
  
  // Length of stay discount
  const losDiscount = calculateLengthOfStayDiscount(nights, subtotal);
  if (losDiscount > 0) {
    discounts.push({
      type: 'length-of-stay',
      amount: losDiscount,
      description: `${nights} nights discount`,
    });
  }
  
  // Promo code discount
  if (factors.promoCode) {
    const promoResult = applyPromoCode(factors.promoCode, subtotal);
    if (promoResult.valid) {
      discounts.push({
        type: 'promo-code',
        amount: promoResult.discount,
        description: promoResult.description,
      });
    }
  }
  
  const totalDiscount = discounts.reduce((sum, d) => sum + d.amount, 0);
  const discountedSubtotal = subtotal - totalDiscount;
  
  // Calculate fees and taxes
  const cleaningFee = homestayData.cleaningFee;
  const serviceFee = discountedSubtotal * (homestayData.serviceFeePercent / 100);
  const taxes = (discountedSubtotal + cleaningFee + serviceFee) * (homestayData.taxPercent / 100);
  
  const totalPrice = discountedSubtotal + cleaningFee + serviceFee + taxes;
  
  return {
    basePrice: homestayData.basePricePerNight,
    nightlyRates,
    subtotal,
    discounts,
    totalDiscount,
    cleaningFee,
    serviceFee,
    taxes,
    totalPrice: Math.round(totalPrice),
    savings: totalDiscount,
  };
}

/**
 * Get price recommendation based on market conditions
 */
export function getPriceRecommendation(
  basePrice: number,
  occupancyRate: number,
  competitorPrices: number[] = []
): {
  recommendedPrice: number;
  reason: string;
  expectedOccupancyIncrease: number;
} {
  const avgCompetitorPrice = competitorPrices.length > 0
    ? competitorPrices.reduce((a, b) => a + b, 0) / competitorPrices.length
    : basePrice;
  
  // Low occupancy - recommend lower price
  if (occupancyRate < 0.3) {
    return {
      recommendedPrice: Math.round(basePrice * 0.85),
      reason: 'Low occupancy - decrease price to attract bookings',
      expectedOccupancyIncrease: 15,
    };
  }
  
  // High occupancy - recommend higher price
  if (occupancyRate > 0.8) {
    return {
      recommendedPrice: Math.round(basePrice * 1.15),
      reason: 'High demand - increase price for revenue optimization',
      expectedOccupancyIncrease: -5,
    };
  }
  
  // Competitive pricing
  if (basePrice > avgCompetitorPrice * 1.1) {
    return {
      recommendedPrice: Math.round(avgCompetitorPrice * 1.05),
      reason: 'Price above market - adjust for competitiveness',
      expectedOccupancyIncrease: 10,
    };
  }
  
  // Current price is good
  return {
    recommendedPrice: basePrice,
    reason: 'Current price is optimal for market conditions',
    expectedOccupancyIncrease: 0,
  };
}
