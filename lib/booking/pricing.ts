import { addDays, differenceInDays, format, isWeekend } from 'date-fns';

export interface PricingPolicy {
  id: string;
  homestayId: string;
  basePrice: number;
  currency: 'INR' | 'USD';
  seasonalMultipliers: {
    peak: number;
    offPeak: number;
    festival: number;
  };
  weekendMultiplier: number;
  occupancyMultiplier: {
    high: number; // > 80% occupancy
    medium: number; // 50-80% occupancy
    low: number; // < 50% occupancy
  };
  weatherMultiplier: {
    excellent: number;
    good: number;
    poor: number;
  };
  lengthOfStayDiscounts: {
    weekly: number; // 7+ days
    monthly: number; // 30+ days
  };
  earlyBookingDiscount: {
    days: number;
    discount: number;
  };
}

export interface BookingDates {
  checkIn: Date;
  checkOut: Date;
  guests: number;
}

export interface PricingBreakdown {
  basePrice: number;
  nights: number;
  subtotal: number;
  seasonalAdjustment: number;
  weekendAdjustment: number;
  occupancyAdjustment: number;
  weatherAdjustment: number;
  lengthOfStayDiscount: number;
  earlyBookingDiscount: number;
  taxes: number;
  serviceFee: number;
  total: number;
  currency: string;
  breakdown: Array<{
    date: string;
    basePrice: number;
    adjustedPrice: number;
    factors: string[];
  }>;
}

export class DynamicPricingEngine {
  private policy: PricingPolicy;

  constructor(policy: PricingPolicy) {
    this.policy = policy;
  }

  async calculatePrice(dates: BookingDates, currentOccupancy: number = 0.5): Promise<PricingBreakdown> {
    const nights = differenceInDays(dates.checkOut, dates.checkIn);
    if (nights <= 0) {
      throw new Error('Invalid date range');
    }

    const breakdown = this.generateDailyBreakdown(dates, currentOccupancy);
    const subtotal = breakdown.reduce((sum, day) => sum + day.adjustedPrice, 0);

    // Apply length of stay discounts
    const lengthOfStayDiscount = this.calculateLengthOfStayDiscount(nights, subtotal);
    
    // Apply early booking discount
    const earlyBookingDiscount = this.calculateEarlyBookingDiscount(dates.checkIn, subtotal);
    
    // Calculate taxes and fees
    const taxes = Math.round((subtotal - lengthOfStayDiscount - earlyBookingDiscount) * 0.12); // 12% GST
    const serviceFee = Math.round((subtotal - lengthOfStayDiscount - earlyBookingDiscount) * 0.05); // 5% service fee

    const total = subtotal - lengthOfStayDiscount - earlyBookingDiscount + taxes + serviceFee;

    return {
      basePrice: this.policy.basePrice,
      nights,
      subtotal,
      seasonalAdjustment: breakdown.reduce((sum, day) => sum + (day.adjustedPrice - this.policy.basePrice), 0),
      weekendAdjustment: breakdown
        .filter(day => day.factors.includes('Weekend'))
        .reduce((sum, day) => sum + (day.adjustedPrice * 0.2), 0),
      occupancyAdjustment: 0, // Calculated in daily breakdown
      weatherAdjustment: 0, // Calculated in daily breakdown
      lengthOfStayDiscount,
      earlyBookingDiscount,
      taxes,
      serviceFee,
      total: Math.round(total),
      currency: this.policy.currency,
      breakdown
    };
  }

  private generateDailyBreakdown(dates: BookingDates, currentOccupancy: number) {
    const breakdown: PricingBreakdown['breakdown'] = [];
    let currentDate = new Date(dates.checkIn);

    while (currentDate < dates.checkOut) {
      const factors: string[] = [];
      let dayPrice = this.policy.basePrice;

      // Seasonal adjustment
      const seasonMultiplier = this.getSeasonMultiplier(currentDate);
      if (seasonMultiplier !== 1) {
        dayPrice *= seasonMultiplier;
        factors.push(seasonMultiplier > 1 ? 'Peak Season' : 'Off Peak');
      }

      // Weekend adjustment
      if (isWeekend(currentDate)) {
        dayPrice *= this.policy.weekendMultiplier;
        factors.push('Weekend');
      }

      // Occupancy adjustment
      const occupancyMultiplier = this.getOccupancyMultiplier(currentOccupancy);
      if (occupancyMultiplier !== 1) {
        dayPrice *= occupancyMultiplier;
        factors.push(occupancyMultiplier > 1 ? 'High Demand' : 'Low Demand');
      }

      // Weather adjustment (simulated)
      const weatherMultiplier = this.getWeatherMultiplier(currentDate);
      if (weatherMultiplier !== 1) {
        dayPrice *= weatherMultiplier;
        factors.push(weatherMultiplier > 1 ? 'Perfect Weather' : 'Weather Advisory');
      }

      breakdown.push({
        date: format(currentDate, 'yyyy-MM-dd'),
        basePrice: this.policy.basePrice,
        adjustedPrice: Math.round(dayPrice),
        factors
      });

      currentDate = addDays(currentDate, 1);
    }

    return breakdown;
  }

  private getSeasonMultiplier(date: Date): number {
    const month = date.getMonth();
    
    // Peak season: October to March (winter months in Uttarakhand)
    if (month >= 9 || month <= 2) {
      return this.policy.seasonalMultipliers.peak;
    }
    
    // Festival season adjustments
    if (this.isFestivalSeason(date)) {
      return this.policy.seasonalMultipliers.festival;
    }
    
    // Off-peak: April to September (monsoon and hot season)
    return this.policy.seasonalMultipliers.offPeak;
  }

  private isFestivalSeason(date: Date): boolean {
    const month = date.getMonth();
    const day = date.getDate();
    
    // Major festivals in Uttarakhand
    const festivals = [
      { month: 10, start: 15, end: 25 }, // Diwali period (November)
      { month: 2, start: 1, end: 15 },   // Holi period (March)
      { month: 7, start: 15, end: 31 },  // Janmashtami/Nag Panchami (August)
    ];
    
    return festivals.some(festival => 
      month === festival.month && day >= festival.start && day <= festival.end
    );
  }

  private getOccupancyMultiplier(occupancy: number): number {
    if (occupancy > 0.8) return this.policy.occupancyMultiplier.high;
    if (occupancy > 0.5) return this.policy.occupancyMultiplier.medium;
    return this.policy.occupancyMultiplier.low;
  }

  private getWeatherMultiplier(date: Date): number {
    // Simulate weather conditions based on season
    const month = date.getMonth();
    
    // Excellent weather: Oct-Nov, Feb-Mar
    if ((month >= 9 && month <= 10) || (month >= 1 && month <= 2)) {
      return this.policy.weatherMultiplier.excellent;
    }
    
    // Poor weather: Jun-Sep (monsoon)
    if (month >= 5 && month <= 8) {
      return this.policy.weatherMultiplier.poor;
    }
    
    // Good weather: rest of the year
    return this.policy.weatherMultiplier.good;
  }

  private calculateLengthOfStayDiscount(nights: number, subtotal: number): number {
    if (nights >= 30) {
      return Math.round(subtotal * this.policy.lengthOfStayDiscounts.monthly);
    }
    if (nights >= 7) {
      return Math.round(subtotal * this.policy.lengthOfStayDiscounts.weekly);
    }
    return 0;
  }

  private calculateEarlyBookingDiscount(checkIn: Date, subtotal: number): number {
    const daysUntilCheckIn = differenceInDays(checkIn, new Date());
    if (daysUntilCheckIn >= this.policy.earlyBookingDiscount.days) {
      return Math.round(subtotal * this.policy.earlyBookingDiscount.discount);
    }
    return 0;
  }
}

// Default pricing policy for Damday Village homestays
export const defaultPricingPolicy: PricingPolicy = {
  id: 'default',
  homestayId: 'default',
  basePrice: 2500, // ₹2,500 per night
  currency: 'INR',
  seasonalMultipliers: {
    peak: 1.5,    // 50% increase during peak season
    offPeak: 0.8, // 20% decrease during off-peak
    festival: 2.0 // 100% increase during festivals
  },
  weekendMultiplier: 1.2, // 20% weekend premium
  occupancyMultiplier: {
    high: 1.3,   // 30% increase when >80% occupied
    medium: 1.0, // No change at medium occupancy
    low: 0.9     // 10% decrease when <50% occupied
  },
  weatherMultiplier: {
    excellent: 1.1, // 10% premium for perfect weather
    good: 1.0,      // No adjustment
    poor: 0.9       // 10% discount for poor weather
  },
  lengthOfStayDiscounts: {
    weekly: 0.1,  // 10% discount for 7+ days
    monthly: 0.2  // 20% discount for 30+ days
  },
  earlyBookingDiscount: {
    days: 30,     // Book 30 days in advance
    discount: 0.05 // 5% early booking discount
  }
};