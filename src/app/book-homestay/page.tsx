'use client';

import { useState, useEffect, useCallback } from 'react';
import { format, addDays } from 'date-fns';
import { Card } from '@/lib/components/ui/Card';
import { Button } from '@/lib/components/ui/Button';
import { Input } from '@/lib/components/ui/Input';
import { Badge } from '@/lib/components/ui/Badge';
import { Progress } from '@/lib/components/ui/Progress';
import { 
  Calendar, 
  Users, 
  MapPin, 
  Star, 
  Wifi, 
  Car, 
  Coffee, 
  TreePine,
  CreditCard,
  Check,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { DynamicPricingEngine, defaultPricingPolicy, type BookingDates } from '@/lib/booking/pricing';
import { offlineBookingSync } from '@/lib/booking/offline-sync';

interface Homestay {
  id: string;
  title: string;
  description: string;
  basePrice: number;
  currency: string;
  maxGuests: number;
  bedrooms: number;
  bathrooms: number;
  amenities: string[];
  images: string[];
  location: {
    village: string;
    address: string;
  };
  host: {
    id: string;
    name: string;
    profileImage?: string;
  };
  stats: {
    averageRating: number;
    totalReviews: number;
  };
}

interface BookingStep {
  id: number;
  title: string;
  completed: boolean;
}

const BOOKING_STEPS: BookingStep[] = [
  { id: 1, title: 'Search & Select', completed: false },
  { id: 2, title: 'Guest Details', completed: false },
  { id: 3, title: 'Review & Payment', completed: false },
  { id: 4, title: 'Confirmation', completed: false },
];

const SAMPLE_HOMESTAYS: Homestay[] = [
  {
    id: '1',
    title: 'Traditional Himalayan Cottage',
    description: 'Experience authentic village life in this beautifully restored traditional home with stunning mountain views.',
    basePrice: 2500,
    currency: 'INR',
    maxGuests: 4,
    bedrooms: 2,
    bathrooms: 1,
    amenities: ['Wi-Fi', 'Parking', 'Kitchen', 'Mountain View', 'Garden', 'Local Meals'],
    images: ['/placeholder-homestay1.jpg'],
    location: {
      village: 'Damday Village',
      address: 'Near Village Center, Gangolihat',
    },
    host: {
      id: 'host1',
      name: 'Sita Devi',
      profileImage: '/placeholder-host1.jpg',
    },
    stats: {
      averageRating: 4.8,
      totalReviews: 23,
    },
  },
  {
    id: '2',
    title: 'Eco-Friendly Mountain Retreat',
    description: 'Solar-powered homestay with organic farming and guided nature walks.',
    basePrice: 3000,
    currency: 'INR',
    maxGuests: 6,
    bedrooms: 3,
    bathrooms: 2,
    amenities: ['Wi-Fi', 'Solar Power', 'Organic Farm', 'Nature Walks', 'Cooking Classes'],
    images: ['/placeholder-homestay2.jpg'],
    location: {
      village: 'Damday Village',
      address: 'Hillside Location, Gangolihat',
    },
    host: {
      id: 'host2',
      name: 'Ram Singh',
      profileImage: '/placeholder-host2.jpg',
    },
    stats: {
      averageRating: 4.9,
      totalReviews: 31,
    },
  },
];

const AMENITY_ICONS: Record<string, any> = {
  'Wi-Fi': Wifi,
  'Parking': Car,
  'Kitchen': Coffee,
  'Mountain View': TreePine,
  'Garden': TreePine,
  'Local Meals': Coffee,
  'Solar Power': TreePine,
  'Organic Farm': TreePine,
  'Nature Walks': TreePine,
  'Cooking Classes': Coffee,
};

export default function BookHomestayPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedHomestay, setSelectedHomestay] = useState<Homestay | null>(null);
  const [searchFilters, setSearchFilters] = useState({
    checkIn: format(addDays(new Date(), 7), 'yyyy-MM-dd'),
    checkOut: format(addDays(new Date(), 9), 'yyyy-MM-dd'),
    guests: 2,
  });
  const [guestDetails, setGuestDetails] = useState({
    name: '',
    email: '',
    phone: '',
    specialRequests: '',
  });
  const [pricingBreakdown, setPricingBreakdown] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [bookingConfirmation, setBookingConfirmation] = useState<any>(null);
  const [pendingBookingsCount, setPendingBookingsCount] = useState(0);

  // Check for pending offline bookings
  useEffect(() => {
    const updatePendingCount = () => {
      setPendingBookingsCount(offlineBookingSync.getPendingBookingsCount());
    };

    updatePendingCount();
    const interval = setInterval(updatePendingCount, 5000);
    return () => clearInterval(interval);
  }, []);

  const calculatePricing = useCallback(async () => {
    if (!selectedHomestay) return;

    const pricingEngine = new DynamicPricingEngine({
      ...defaultPricingPolicy,
      homestayId: selectedHomestay.id,
      basePrice: selectedHomestay.basePrice,
      currency: 'INR' as const,
    });

    const bookingDates: BookingDates = {
      checkIn: new Date(searchFilters.checkIn),
      checkOut: new Date(searchFilters.checkOut),
      guests: searchFilters.guests,
    };

    try {
      const pricing = await pricingEngine.calculatePrice(bookingDates, 0.6);
      setPricingBreakdown(pricing);
    } catch (error) {
      console.error('Pricing calculation failed:', error);
    }
  }, [selectedHomestay, searchFilters]);

  // Calculate pricing when homestay or dates change
  useEffect(() => {
    if (selectedHomestay && searchFilters.checkIn && searchFilters.checkOut) {
      calculatePricing();
    }
  }, [selectedHomestay, searchFilters, calculatePricing]);

  const handleHomestaySelect = (homestay: Homestay) => {
    setSelectedHomestay(homestay);
    setCurrentStep(2);
  };

  const handleGuestDetailsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (guestDetails.name && guestDetails.email && guestDetails.phone) {
      setCurrentStep(3);
    }
  };

  const handleBookingSubmit = async () => {
    if (!selectedHomestay || !pricingBreakdown) return;

    setIsLoading(true);

    try {
      const bookingData = {
        homestayId: selectedHomestay.id,
        userId: 'demo-user', // In real app, get from auth
        checkIn: searchFilters.checkIn,
        checkOut: searchFilters.checkOut,
        guests: searchFilters.guests,
        totalAmount: pricingBreakdown.total,
        currency: pricingBreakdown.currency,
        guestDetails,
      };

      // Try online booking first, fall back to offline queue
      if (navigator.onLine) {
        const response = await fetch('/api/bookings', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(bookingData),
        });

        if (response.ok) {
          const confirmation = await response.json();
          setBookingConfirmation(confirmation);
          setCurrentStep(4);
        } else {
          throw new Error('Online booking failed');
        }
      } else {
        throw new Error('Offline mode');
      }
    } catch (error) {
      console.log('Booking offline, queuing for sync...');
      
      // Queue for offline sync
      const offlineId = await offlineBookingSync.queueBooking({
        homestayId: selectedHomestay.id,
        userId: 'demo-user',
        checkIn: searchFilters.checkIn,
        checkOut: searchFilters.checkOut,
        guests: searchFilters.guests,
        totalAmount: pricingBreakdown.total,
        currency: pricingBreakdown.currency,
        guestDetails,
      });

      setBookingConfirmation({
        id: offlineId,
        confirmationNumber: `OFFLINE-${offlineId.slice(-8)}`,
        status: 'QUEUED',
        offline: true,
      });
      setCurrentStep(4);
    } finally {
      setIsLoading(false);
    }
  };

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center mb-8 space-x-4">
      {BOOKING_STEPS.map((step, index) => (
        <div key={step.id} className="flex items-center">
          <div className={`
            flex items-center justify-center w-10 h-10 rounded-full border-2 text-sm font-medium
            ${currentStep >= step.id 
              ? 'bg-green-500 border-green-500 text-white' 
              : 'border-gray-300 text-gray-500'
            }
          `}>
            {currentStep > step.id ? <Check className="w-5 h-5" /> : step.id}
          </div>
          <span className={`ml-2 text-sm ${currentStep >= step.id ? 'text-green-600 font-medium' : 'text-gray-500'}`}>
            {step.title}
          </span>
          {index < BOOKING_STEPS.length - 1 && (
            <ChevronRight className="w-4 h-4 mx-4 text-gray-300" />
          )}
        </div>
      ))}
    </div>
  );

  const renderHomestayCard = (homestay: Homestay) => (
    <Card key={homestay.id} className="p-6 cursor-pointer hover:shadow-lg transition-shadow">
      <div className="flex space-x-4">
        <div className="w-24 h-24 bg-gradient-to-br from-green-100 to-green-200 rounded-lg flex items-center justify-center">
          <TreePine className="w-8 h-8 text-green-600" />
        </div>
        <div className="flex-1">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-lg font-semibold text-gray-900">{homestay.title}</h3>
            <div className="text-right">
              <div className="text-2xl font-bold text-green-600">
                ₹{homestay.basePrice.toLocaleString()}
              </div>
              <div className="text-sm text-gray-500">per night</div>
            </div>
          </div>
          
          <p className="text-gray-600 mb-3 line-clamp-2">{homestay.description}</p>
          
          <div className="flex items-center space-x-4 mb-3 text-sm text-gray-500">
            <div className="flex items-center">
              <MapPin className="w-4 h-4 mr-1" />
              {homestay.location.village}
            </div>
            <div className="flex items-center">
              <Users className="w-4 h-4 mr-1" />
              Up to {homestay.maxGuests} guests
            </div>
            <div className="flex items-center">
              <Star className="w-4 h-4 mr-1 fill-yellow-400 text-yellow-400" />
              {homestay.stats.averageRating} ({homestay.stats.totalReviews})
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2 mb-4">
            {homestay.amenities.slice(0, 4).map((amenity) => {
              const Icon = AMENITY_ICONS[amenity] || Coffee;
              return (
                <Badge key={amenity} variant="default" className="text-xs border border-gray-300">
                  <Icon className="w-3 h-3 mr-1" />
                  {amenity}
                </Badge>
              );
            })}
            {homestay.amenities.length > 4 && (
              <Badge variant="default" className="text-xs border border-gray-300">
                +{homestay.amenities.length - 4} more
              </Badge>
            )}
          </div>
          
          <Button 
            onClick={() => handleHomestaySelect(homestay)}
            className="w-full"
          >
            Select This Homestay
          </Button>
        </div>
      </div>
    </Card>
  );

  const renderSearchStep = () => (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Search Homestays</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Check-in</label>
              <Input
                type="date"
                value={searchFilters.checkIn}
                onChange={(e) => setSearchFilters(prev => ({ ...prev, checkIn: e.target.value }))}
                min={format(new Date(), 'yyyy-MM-dd')}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Check-out</label>
              <Input
                type="date"
                value={searchFilters.checkOut}
                onChange={(e) => setSearchFilters(prev => ({ ...prev, checkOut: e.target.value }))}
                min={searchFilters.checkIn}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Guests</label>
              <Input
                type="number"
                value={searchFilters.guests}
                onChange={(e) => setSearchFilters(prev => ({ ...prev, guests: parseInt(e.target.value) }))}
                min="1"
                max="10"
              />
            </div>
            <div className="flex items-end">
              <Button className="w-full">
                <Calendar className="w-4 h-4 mr-2" />
                Search
              </Button>
            </div>
          </div>
        </Card>
      </div>

      {pendingBookingsCount > 0 && (
        <Card className="p-4 mb-6 bg-blue-50 border-blue-200">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse mr-3"></div>
            <span className="text-blue-700">
              {pendingBookingsCount} booking{pendingBookingsCount > 1 ? 's' : ''} syncing in background...
            </span>
          </div>
        </Card>
      )}

      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-900">Available Homestays</h2>
        {SAMPLE_HOMESTAYS.map(renderHomestayCard)}
      </div>
    </div>
  );

  const renderGuestDetailsStep = () => (
    <div className="max-w-2xl mx-auto">
      <Card className="p-8">
        <h2 className="text-2xl font-semibold mb-6">Guest Information</h2>
        <form onSubmit={handleGuestDetailsSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
            <Input
              type="text"
              value={guestDetails.name}
              onChange={(e) => setGuestDetails(prev => ({ ...prev, name: e.target.value }))}
              required
              placeholder="Enter your full name"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
            <Input
              type="email"
              value={guestDetails.email}
              onChange={(e) => setGuestDetails(prev => ({ ...prev, email: e.target.value }))}
              required
              placeholder="Enter your email address"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
            <Input
              type="tel"
              value={guestDetails.phone}
              onChange={(e) => setGuestDetails(prev => ({ ...prev, phone: e.target.value }))}
              required
              placeholder="Enter your phone number"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Special Requests</label>
            <textarea
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
              rows={4}
              value={guestDetails.specialRequests}
              onChange={(e) => setGuestDetails(prev => ({ ...prev, specialRequests: e.target.value }))}
              placeholder="Any special requests or dietary requirements?"
            />
          </div>
          
          <div className="flex space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setCurrentStep(1)}
              className="flex-1"
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <Button type="submit" className="flex-1">
              Continue to Payment
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );

  const renderReviewStep = () => (
    <div className="max-w-4xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card className="p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Booking Summary</h2>
            {selectedHomestay && (
              <div className="flex space-x-4 mb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-green-100 to-green-200 rounded-lg flex items-center justify-center">
                  <TreePine className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{selectedHomestay.title}</h3>
                  <p className="text-gray-600">{selectedHomestay.location.village}</p>
                  <p className="text-sm text-gray-500">Host: {selectedHomestay.host.name}</p>
                </div>
              </div>
            )}
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-500">Check-in:</span>
                <div className="font-medium">{format(new Date(searchFilters.checkIn), 'MMM dd, yyyy')}</div>
              </div>
              <div>
                <span className="text-gray-500">Check-out:</span>
                <div className="font-medium">{format(new Date(searchFilters.checkOut), 'MMM dd, yyyy')}</div>
              </div>
              <div>
                <span className="text-gray-500">Guests:</span>
                <div className="font-medium">{searchFilters.guests} {searchFilters.guests === 1 ? 'guest' : 'guests'}</div>
              </div>
              <div>
                <span className="text-gray-500">Nights:</span>
                <div className="font-medium">{pricingBreakdown?.nights} {pricingBreakdown?.nights === 1 ? 'night' : 'nights'}</div>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Guest Information</h3>
            <div className="space-y-2 text-sm">
              <div><span className="text-gray-500">Name:</span> <span className="ml-2 font-medium">{guestDetails.name}</span></div>
              <div><span className="text-gray-500">Email:</span> <span className="ml-2 font-medium">{guestDetails.email}</span></div>
              <div><span className="text-gray-500">Phone:</span> <span className="ml-2 font-medium">{guestDetails.phone}</span></div>
              {guestDetails.specialRequests && (
                <div><span className="text-gray-500">Special Requests:</span> <span className="ml-2">{guestDetails.specialRequests}</span></div>
              )}
            </div>
          </Card>
        </div>

        <div>
          <Card className="p-6 sticky top-4">
            <h3 className="text-lg font-semibold mb-4">Pricing Breakdown</h3>
            {pricingBreakdown && (
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span>Base price × {pricingBreakdown.nights} nights</span>
                  <span>₹{pricingBreakdown.subtotal.toLocaleString()}</span>
                </div>
                
                {pricingBreakdown.seasonalAdjustment !== 0 && (
                  <div className="flex justify-between text-orange-600">
                    <span>Seasonal adjustment</span>
                    <span>₹{pricingBreakdown.seasonalAdjustment.toLocaleString()}</span>
                  </div>
                )}
                
                {pricingBreakdown.lengthOfStayDiscount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Length of stay discount</span>
                    <span>-₹{pricingBreakdown.lengthOfStayDiscount.toLocaleString()}</span>
                  </div>
                )}
                
                {pricingBreakdown.earlyBookingDiscount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Early booking discount</span>
                    <span>-₹{pricingBreakdown.earlyBookingDiscount.toLocaleString()}</span>
                  </div>
                )}
                
                <div className="flex justify-between">
                  <span>Service fee</span>
                  <span>₹{pricingBreakdown.serviceFee.toLocaleString()}</span>
                </div>
                
                <div className="flex justify-between">
                  <span>Taxes</span>
                  <span>₹{pricingBreakdown.taxes.toLocaleString()}</span>
                </div>
                
                <hr className="my-3" />
                
                <div className="flex justify-between text-lg font-semibold">
                  <span>Total</span>
                  <span>₹{pricingBreakdown.total.toLocaleString()}</span>
                </div>
              </div>
            )}
            
            <div className="mt-6 space-y-3">
              <Button
                variant="outline"
                onClick={() => setCurrentStep(2)}
                className="w-full"
              >
                <ChevronLeft className="w-4 h-4 mr-2" />
                Back to Details
              </Button>
              <Button
                onClick={handleBookingSubmit}
                disabled={isLoading}
                className="w-full"
              >
                <CreditCard className="w-4 h-4 mr-2" />
                {isLoading ? 'Processing...' : 'Confirm Booking'}
              </Button>
            </div>
            
            <p className="text-xs text-gray-500 mt-4 text-center">
              {navigator.onLine 
                ? 'Secure payment processing with Stripe & Razorpay' 
                : 'Offline mode: Your booking will be processed when connection is restored'
              }
            </p>
          </Card>
        </div>
      </div>
    </div>
  );

  const renderConfirmationStep = () => (
    <div className="max-w-2xl mx-auto text-center">
      <Card className="p-8">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Check className="w-8 h-8 text-green-600" />
        </div>
        
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
          {bookingConfirmation?.offline ? 'Booking Queued!' : 'Booking Confirmed!'}
        </h2>
        
        <p className="text-gray-600 mb-6">
          {bookingConfirmation?.offline 
            ? 'Your booking has been queued and will be processed when internet connection is restored.'
            : 'Your homestay booking has been successfully confirmed.'
          }
        </p>
        
        {bookingConfirmation && (
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="text-sm space-y-2">
              <div><span className="font-medium">Confirmation Number:</span> {bookingConfirmation.confirmationNumber}</div>
              <div><span className="font-medium">Status:</span> 
                <Badge className="ml-2" variant={bookingConfirmation.offline ? 'warning' : 'success'}>
                  {bookingConfirmation.offline ? 'QUEUED FOR SYNC' : bookingConfirmation.status}
                </Badge>
              </div>
              {selectedHomestay && (
                <div><span className="font-medium">Homestay:</span> {selectedHomestay.title}</div>
              )}
            </div>
          </div>
        )}
        
        <div className="space-y-3">
          <Button onClick={() => window.location.reload()} className="w-full">
            Book Another Homestay
          </Button>
          <Button variant="outline" onClick={() => window.location.href = '/'} className="w-full">
            Return to Homepage
          </Button>
        </div>
        
        <p className="text-xs text-gray-500 mt-6">
          You will receive a confirmation email shortly with your booking details.
        </p>
      </Card>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Book Your Homestay</h1>
          <p className="text-gray-600">Experience authentic village life in the beautiful Himalayas</p>
        </div>

        {renderStepIndicator()}

        {currentStep === 1 && renderSearchStep()}
        {currentStep === 2 && renderGuestDetailsStep()}
        {currentStep === 3 && renderReviewStep()}
        {currentStep === 4 && renderConfirmationStep()}
      </div>
    </div>
  );
}