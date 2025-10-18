"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/lib/components/ui/Card';
import { Button } from '@/lib/components/ui/Button';
import { Badge } from '@/lib/components/ui/Badge';
import { 
  CheckCircle2, 
  Calendar, 
  MapPin, 
  Users, 
  Mail, 
  Phone,
  Download,
  Home,
  Share2
} from 'lucide-react';
import { format } from 'date-fns';

interface BookingDetails {
  bookingId: string;
  homestayName: string;
  hostName: string;
  checkIn: Date;
  checkOut: Date;
  numberOfGuests: number;
  totalAmount: number;
  currency: string;
  guestInfo: {
    name: string;
    email: string;
    phone: string;
  };
  paymentId?: string;
  confirmationNumber?: string;
}

interface BookingConfirmationProps {
  booking: BookingDetails;
  onDownloadConfirmation?: () => void;
  onGoHome?: () => void;
}

export const BookingConfirmation: React.FC<BookingConfirmationProps> = ({
  booking,
  onDownloadConfirmation,
  onGoHome,
}) => {
  const [emailSent, setEmailSent] = useState(false);

  useEffect(() => {
    // Send confirmation email
    sendConfirmationEmail();
  }, []);

  const sendConfirmationEmail = async () => {
    try {
      const response = await fetch('/api/booking/send-confirmation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          bookingId: booking.bookingId,
          email: booking.guestInfo.email,
        }),
      });

      if (response.ok) {
        setEmailSent(true);
      }
    } catch (error) {
      console.error('Failed to send confirmation email:', error);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Booking Confirmation',
          text: `Booking confirmed for ${booking.homestayName}`,
          url: window.location.href,
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Success Message */}
      <Card className="bg-green-50 border-green-200">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center text-center">
            <div className="rounded-full bg-green-500 p-3 mb-4">
              <CheckCircle2 className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-green-800 mb-2">
              Booking Confirmed!
            </h2>
            <p className="text-green-700 mb-4">
              Your booking has been successfully confirmed.
            </p>
            {emailSent && (
              <Badge className="bg-green-100 text-green-800">
                <Mail className="h-3 w-3 mr-1" />
                Confirmation email sent
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Booking Details */}
      <Card>
        <CardHeader>
          <CardTitle>Booking Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Confirmation Number */}
          {booking.confirmationNumber && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Confirmation Number</p>
              <p className="text-xl font-bold font-mono">
                {booking.confirmationNumber}
              </p>
            </div>
          )}

          {/* Homestay Info */}
          <div className="border-b pb-4">
            <h3 className="font-semibold text-lg mb-2">{booking.homestayName}</h3>
            <p className="text-gray-600 flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Host: {booking.hostName}
            </p>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600 mb-1">
                <Calendar className="inline h-4 w-4 mr-1" />
                Check-in
              </p>
              <p className="font-semibold">
                {format(new Date(booking.checkIn), 'PPP')}
              </p>
              <p className="text-sm text-gray-500">After 2:00 PM</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">
                <Calendar className="inline h-4 w-4 mr-1" />
                Check-out
              </p>
              <p className="font-semibold">
                {format(new Date(booking.checkOut), 'PPP')}
              </p>
              <p className="text-sm text-gray-500">Before 11:00 AM</p>
            </div>
          </div>

          {/* Guest Info */}
          <div className="border-t pt-4">
            <p className="font-semibold mb-2">Guest Information</p>
            <div className="space-y-2 text-sm">
              <p className="flex items-center gap-2">
                <Users className="h-4 w-4 text-gray-500" />
                {booking.numberOfGuests} {booking.numberOfGuests === 1 ? 'Guest' : 'Guests'}
              </p>
              <p className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-gray-500" />
                {booking.guestInfo.email}
              </p>
              <p className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-gray-500" />
                {booking.guestInfo.phone}
              </p>
            </div>
          </div>

          {/* Payment Info */}
          <div className="border-t pt-4">
            <div className="flex justify-between items-center mb-2">
              <span className="font-semibold">Total Amount Paid</span>
              <span className="text-2xl font-bold">
                {booking.currency === 'INR' ? '₹' : '$'}
                {booking.totalAmount.toLocaleString()}
              </span>
            </div>
            {booking.paymentId && (
              <p className="text-sm text-gray-500">
                Payment ID: {booking.paymentId}
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {onDownloadConfirmation && (
          <Button
            variant="outline"
            onClick={onDownloadConfirmation}
            className="w-full"
          >
            <Download className="mr-2 h-4 w-4" />
            Download Confirmation
          </Button>
        )}
        <Button
          variant="outline"
          onClick={handleShare}
          className="w-full"
        >
          <Share2 className="mr-2 h-4 w-4" />
          Share
        </Button>
      </div>

      {onGoHome && (
        <Button
          onClick={onGoHome}
          className="w-full"
        >
          <Home className="mr-2 h-4 w-4" />
          Go to Dashboard
        </Button>
      )}

      {/* Important Information */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-6">
          <h3 className="font-semibold mb-2">Important Information</h3>
          <ul className="text-sm text-gray-700 space-y-1 list-disc list-inside">
            <li>Please carry a valid ID proof at the time of check-in</li>
            <li>Check-in time: 2:00 PM | Check-out time: 11:00 AM</li>
            <li>For any queries, contact the host directly</li>
            <li>Cancellation policy applies as per booking terms</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};
