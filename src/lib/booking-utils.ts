/**
 * Booking Utilities
 * Helper functions for booking operations
 */

export interface BookingDates {
  checkIn: Date;
  checkOut: Date;
}

export interface AvailabilityCheck {
  isAvailable: boolean;
  reason?: string;
  conflictingBookings?: any[];
}

/**
 * Calculate number of nights between check-in and check-out
 */
export function calculateNights(checkIn: Date, checkOut: Date): number {
  const msPerDay = 1000 * 60 * 60 * 24;
  const diffMs = checkOut.getTime() - checkIn.getTime();
  return Math.ceil(diffMs / msPerDay);
}

/**
 * Check if date ranges overlap
 */
export function datesOverlap(
  range1: BookingDates,
  range2: BookingDates
): boolean {
  return range1.checkIn < range2.checkOut && range1.checkOut > range2.checkIn;
}

/**
 * Validate booking dates
 */
export function validateBookingDates(
  checkIn: Date,
  checkOut: Date
): { valid: boolean; error?: string } {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  
  // Check if check-in is in the past
  if (checkIn < now) {
    return { valid: false, error: 'Check-in date cannot be in the past' };
  }
  
  // Check if check-out is before check-in
  if (checkOut <= checkIn) {
    return { valid: false, error: 'Check-out must be after check-in' };
  }
  
  // Check if booking is too far in advance (e.g., 365 days)
  const maxAdvanceDays = 365;
  const maxDate = new Date(now);
  maxDate.setDate(maxDate.getDate() + maxAdvanceDays);
  
  if (checkIn > maxDate) {
    return { valid: false, error: `Cannot book more than ${maxAdvanceDays} days in advance` };
  }
  
  return { valid: true };
}

/**
 * Check if homestay is available for given dates
 */
export async function checkAvailability(
  homestayId: string,
  checkIn: Date,
  checkOut: Date,
  existingBookings: any[]
): Promise<AvailabilityCheck> {
  // Check for overlapping bookings
  const conflictingBookings = existingBookings.filter(booking => {
    return datesOverlap(
      { checkIn, checkOut },
      { checkIn: new Date(booking.checkIn), checkOut: new Date(booking.checkOut) }
    );
  });
  
  if (conflictingBookings.length > 0) {
    return {
      isAvailable: false,
      reason: 'Property is already booked for these dates',
      conflictingBookings,
    };
  }
  
  return { isAvailable: true };
}

/**
 * Get available dates for a homestay
 */
export function getAvailableDates(
  startDate: Date,
  endDate: Date,
  bookedDates: Date[],
  blackoutDates: Date[] = []
): Date[] {
  const available: Date[] = [];
  const current = new Date(startDate);
  
  while (current <= endDate) {
    const isBooked = bookedDates.some(d =>
      d.toDateString() === current.toDateString()
    );
    const isBlackedOut = blackoutDates.some(d =>
      d.toDateString() === current.toDateString()
    );
    
    if (!isBooked && !isBlackedOut) {
      available.push(new Date(current));
    }
    
    current.setDate(current.getDate() + 1);
  }
  
  return available;
}

/**
 * Calculate booking status color
 */
export function getBookingStatusColor(status: string): string {
  const colors: Record<string, string> = {
    'pending': 'yellow',
    'confirmed': 'blue',
    'checked-in': 'green',
    'checked-out': 'gray',
    'completed': 'green',
    'cancelled': 'red',
    'refunded': 'orange',
  };
  
  return colors[status.toLowerCase()] || 'gray';
}

/**
 * Calculate booking status badge variant
 */
export function getBookingStatusBadge(status: string): {
  variant: 'default' | 'secondary' | 'destructive' | 'outline';
  label: string;
} {
  const statusMap: Record<string, { variant: any; label: string }> = {
    'pending': { variant: 'outline', label: 'Pending' },
    'confirmed': { variant: 'default', label: 'Confirmed' },
    'checked-in': { variant: 'default', label: 'Checked In' },
    'checked-out': { variant: 'secondary', label: 'Checked Out' },
    'completed': { variant: 'default', label: 'Completed' },
    'cancelled': { variant: 'destructive', label: 'Cancelled' },
    'refunded': { variant: 'outline', label: 'Refunded' },
  };
  
  return statusMap[status] || { variant: 'outline', label: status };
}

/**
 * Calculate cancellation eligibility and refund amount
 */
export function calculateCancellationRefund(
  booking: {
    checkIn: Date;
    totalPrice: number;
    cancellationPolicy: 'flexible' | 'moderate' | 'strict';
  }
): {
  eligible: boolean;
  refundAmount: number;
  refundPercentage: number;
  reason: string;
} {
  const now = new Date();
  const daysUntilCheckIn = Math.ceil(
    (booking.checkIn.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
  );
  
  // Past check-in date - no refund
  if (daysUntilCheckIn < 0) {
    return {
      eligible: false,
      refundAmount: 0,
      refundPercentage: 0,
      reason: 'Check-in date has passed',
    };
  }
  
  let refundPercentage = 0;
  let reason = '';
  
  switch (booking.cancellationPolicy) {
    case 'flexible':
      if (daysUntilCheckIn >= 1) {
        refundPercentage = 100;
        reason = 'Full refund (24+ hours before check-in)';
      } else {
        refundPercentage = 50;
        reason = 'Partial refund (less than 24 hours)';
      }
      break;
      
    case 'moderate':
      if (daysUntilCheckIn >= 5) {
        refundPercentage = 100;
        reason = 'Full refund (5+ days before check-in)';
      } else if (daysUntilCheckIn >= 2) {
        refundPercentage = 50;
        reason = 'Partial refund (2-4 days before)';
      } else {
        refundPercentage = 0;
        reason = 'No refund (less than 2 days)';
      }
      break;
      
    case 'strict':
      if (daysUntilCheckIn >= 14) {
        refundPercentage = 100;
        reason = 'Full refund (14+ days before check-in)';
      } else if (daysUntilCheckIn >= 7) {
        refundPercentage = 50;
        reason = 'Partial refund (7-13 days before)';
      } else {
        refundPercentage = 0;
        reason = 'No refund (less than 7 days)';
      }
      break;
  }
  
  const refundAmount = (booking.totalPrice * refundPercentage) / 100;
  
  return {
    eligible: refundPercentage > 0,
    refundAmount,
    refundPercentage,
    reason,
  };
}

/**
 * Generate booking confirmation message
 */
export function generateConfirmationMessage(booking: {
  id: string;
  homestayName: string;
  checkIn: Date;
  checkOut: Date;
  guests: number;
  totalPrice: number;
}): string {
  const nights = calculateNights(booking.checkIn, booking.checkOut);
  
  return `
Booking Confirmed! 🎉

Booking ID: ${booking.id}
Property: ${booking.homestayName}
Check-in: ${booking.checkIn.toLocaleDateString()}
Check-out: ${booking.checkOut.toLocaleDateString()}
Guests: ${booking.guests}
Nights: ${nights}
Total: ₹${booking.totalPrice.toLocaleString()}

We look forward to hosting you!
  `.trim();
}

/**
 * Calculate booking progress percentage
 */
export function calculateBookingProgress(booking: {
  createdAt: Date;
  checkIn: Date;
  checkOut: Date;
  status: string;
}): number {
  const now = new Date();
  
  if (booking.status === 'cancelled') return 0;
  if (booking.status === 'completed') return 100;
  
  // Before check-in
  if (now < booking.checkIn) {
    const totalTime = booking.checkIn.getTime() - booking.createdAt.getTime();
    const elapsed = now.getTime() - booking.createdAt.getTime();
    return Math.min(Math.round((elapsed / totalTime) * 50), 50); // 0-50%
  }
  
  // During stay
  if (now >= booking.checkIn && now <= booking.checkOut) {
    const totalStay = booking.checkOut.getTime() - booking.checkIn.getTime();
    const stayElapsed = now.getTime() - booking.checkIn.getTime();
    return 50 + Math.round((stayElapsed / totalStay) * 50); // 50-100%
  }
  
  // After check-out
  return 100;
}

/**
 * Determine next action for booking
 */
export function getNextBookingAction(booking: {
  checkIn: Date;
  checkOut: Date;
  status: string;
  paymentStatus: string;
}): {
  action: string;
  label: string;
  urgent: boolean;
} {
  const now = new Date();
  
  if (booking.status === 'cancelled') {
    return { action: 'none', label: 'Cancelled', urgent: false };
  }
  
  if (booking.paymentStatus !== 'completed') {
    return { action: 'payment', label: 'Complete Payment', urgent: true };
  }
  
  if (booking.status === 'pending') {
    return { action: 'confirm', label: 'Confirm Booking', urgent: true };
  }
  
  const daysUntilCheckIn = Math.ceil(
    (booking.checkIn.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
  );
  
  if (daysUntilCheckIn <= 7 && daysUntilCheckIn > 0) {
    return { action: 'prepare', label: 'Prepare for Arrival', urgent: true };
  }
  
  if (now >= booking.checkIn && now <= booking.checkOut) {
    return { action: 'check-out', label: 'Check Out', urgent: false };
  }
  
  if (now > booking.checkOut && booking.status !== 'completed') {
    return { action: 'complete', label: 'Complete Booking', urgent: true };
  }
  
  return { action: 'wait', label: 'Confirmed', urgent: false };
}

/**
 * Validate guest count
 */
export function validateGuestCount(
  guests: number,
  maxGuests: number
): { valid: boolean; error?: string } {
  if (guests < 1) {
    return { valid: false, error: 'At least 1 guest is required' };
  }
  
  if (guests > maxGuests) {
    return {
      valid: false,
      error: `Maximum ${maxGuests} guests allowed for this property`,
    };
  }
  
  return { valid: true };
}

/**
 * Format booking date range
 */
export function formatBookingDates(checkIn: Date, checkOut: Date): string {
  const nights = calculateNights(checkIn, checkOut);
  const checkInStr = checkIn.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
  const checkOutStr = checkOut.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
  
  return `${checkInStr} - ${checkOutStr} (${nights} night${nights !== 1 ? 's' : ''})`;
}
