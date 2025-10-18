"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/lib/components/ui/Card';
import { Button } from '@/lib/components/ui/Button';
import { Badge } from '@/lib/components/ui/Badge';
import { CreditCard, Loader2, CheckCircle2, XCircle } from 'lucide-react';

interface PaymentGatewayProps {
  amount: number;
  currency?: string;
  bookingId?: string;
  orderId?: string;
  onSuccess: (paymentId: string, transactionId: string) => void;
  onFailure: (error: string) => void;
  customerInfo: {
    name: string;
    email: string;
    phone: string;
  };
}

export const PaymentGateway: React.FC<PaymentGatewayProps> = ({
  amount,
  currency = 'INR',
  bookingId,
  orderId,
  onSuccess,
  onFailure,
  customerInfo,
}) => {
  const [processing, setProcessing] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'success' | 'failed'>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');

  const handlePayment = async () => {
    setProcessing(true);
    setPaymentStatus('processing');
    setErrorMessage('');

    try {
      // Initialize Razorpay payment
      const response = await fetch('/api/payment/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount,
          currency,
          bookingId,
          orderId,
          customerInfo,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create payment order');
      }

      const data = await response.json();

      // Load Razorpay script if not already loaded
      if (typeof window !== 'undefined' && !(window as any).Razorpay) {
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.async = true;
        document.body.appendChild(script);
        
        await new Promise((resolve) => {
          script.onload = resolve;
        });
      }

      // Open Razorpay checkout
      const options = {
        key: data.razorpayKeyId,
        amount: data.amount,
        currency: data.currency,
        name: 'Damday Village',
        description: bookingId ? \`Booking #\${bookingId}\` : \`Order #\${orderId}\`,
        order_id: data.orderId,
        handler: async (response: any) => {
          // Verify payment on server
          const verifyResponse = await fetch('/api/payment/verify', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              bookingId,
              orderId,
            }),
          });

          if (verifyResponse.ok) {
            const verifyData = await verifyResponse.json();
            setPaymentStatus('success');
            onSuccess(response.razorpay_payment_id, verifyData.transactionId);
          } else {
            throw new Error('Payment verification failed');
          }
        },
        prefill: {
          name: customerInfo.name,
          email: customerInfo.email,
          contact: customerInfo.phone,
        },
        theme: {
          color: '#061335',
        },
        modal: {
          ondismiss: () => {
            setProcessing(false);
            setPaymentStatus('idle');
          },
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.on('payment.failed', (response: any) => {
        setPaymentStatus('failed');
        setErrorMessage(response.error.description || 'Payment failed');
        onFailure(response.error.description);
      });
      rzp.open();
    } catch (error) {
      setPaymentStatus('failed');
      const message = error instanceof Error ? error.message : 'Payment failed';
      setErrorMessage(message);
      onFailure(message);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          Payment Details
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-600">Total Amount</span>
            <span className="text-2xl font-bold">
              {currency === 'INR' ? '₹' : '$'}{amount.toLocaleString()}
            </span>
          </div>
          <div className="text-sm text-gray-500">
            Inclusive of all taxes
          </div>
        </div>

        {paymentStatus === 'success' && (
          <div className="flex items-center gap-2 p-4 bg-green-50 border border-green-200 rounded-lg text-green-800">
            <CheckCircle2 className="h-5 w-5" />
            <span>Payment successful!</span>
          </div>
        )}

        {paymentStatus === 'failed' && (
          <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
            <XCircle className="h-5 w-5" />
            <span>{errorMessage || 'Payment failed. Please try again.'}</span>
          </div>
        )}

        <Button
          onClick={handlePayment}
          disabled={processing || paymentStatus === 'success'}
          className="w-full"
        >
          {processing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : paymentStatus === 'success' ? (
            <>
              <CheckCircle2 className="mr-2 h-4 w-4" />
              Payment Completed
            </>
          ) : (
            <>
              <CreditCard className="mr-2 h-4 w-4" />
              Pay {currency === 'INR' ? '₹' : '$'}{amount.toLocaleString()}
            </>
          )}
        </Button>

        <div className="text-xs text-gray-500 text-center">
          Secured by Razorpay • Your payment information is encrypted
        </div>
      </CardContent>
    </Card>
  );
};
