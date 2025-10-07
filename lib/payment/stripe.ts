import Stripe from 'stripe';

// Initialize Stripe with API key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-02-24.acacia',
});

export interface PaymentIntentData {
  amount: number;
  currency: string;
  customerId?: string;
  metadata: {
    bookingId: string;
    homestayId: string;
    guestEmail: string;
    checkIn: string;
    checkOut: string;
    guests: number;
  };
}

export interface RefundData {
  paymentIntentId: string;
  amount?: number; // If not provided, full refund
  reason?: 'duplicate' | 'fraudulent' | 'requested_by_customer';
}

export class StripePaymentService {
  static async createPaymentIntent(data: PaymentIntentData): Promise<Stripe.PaymentIntent> {
    try {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(data.amount * 100), // Convert to cents
        currency: data.currency.toLowerCase(),
        customer: data.customerId,
        metadata: data.metadata,
        automatic_payment_methods: {
          enabled: true,
        },
        capture_method: 'manual', // Manual capture for booking confirmation
      });

      return paymentIntent;
    } catch (error) {
      console.error('Stripe payment intent creation failed:', error);
      throw new Error('Failed to create payment intent');
    }
  }

  static async confirmPaymentIntent(paymentIntentId: string): Promise<Stripe.PaymentIntent> {
    try {
      const paymentIntent = await stripe.paymentIntents.confirm(paymentIntentId);
      return paymentIntent;
    } catch (error) {
      console.error('Stripe payment confirmation failed:', error);
      throw new Error('Failed to confirm payment');
    }
  }

  static async capturePaymentIntent(paymentIntentId: string): Promise<Stripe.PaymentIntent> {
    try {
      const paymentIntent = await stripe.paymentIntents.capture(paymentIntentId);
      return paymentIntent;
    } catch (error) {
      console.error('Stripe payment capture failed:', error);
      throw new Error('Failed to capture payment');
    }
  }

  static async refundPayment(data: RefundData): Promise<Stripe.Refund> {
    try {
      const refund = await stripe.refunds.create({
        payment_intent: data.paymentIntentId,
        amount: data.amount ? Math.round(data.amount * 100) : undefined,
        reason: data.reason,
      });

      return refund;
    } catch (error) {
      console.error('Stripe refund failed:', error);
      throw new Error('Failed to process refund');
    }
  }

  static async createCustomer(email: string, name: string): Promise<Stripe.Customer> {
    try {
      const customer = await stripe.customers.create({
        email,
        name,
      });

      return customer;
    } catch (error) {
      console.error('Stripe customer creation failed:', error);
      throw new Error('Failed to create customer');
    }
  }

  static async getPaymentIntent(paymentIntentId: string): Promise<Stripe.PaymentIntent> {
    try {
      const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
      return paymentIntent;
    } catch (error) {
      console.error('Failed to retrieve payment intent:', error);
      throw new Error('Failed to retrieve payment');
    }
  }

  static async createSetupIntent(customerId: string): Promise<Stripe.SetupIntent> {
    try {
      const setupIntent = await stripe.setupIntents.create({
        customer: customerId,
        automatic_payment_methods: {
          enabled: true,
        },
      });

      return setupIntent;
    } catch (error) {
      console.error('Setup intent creation failed:', error);
      throw new Error('Failed to create setup intent');
    }
  }

  static async getCustomerPaymentMethods(customerId: string): Promise<Stripe.PaymentMethod[]> {
    try {
      const paymentMethods = await stripe.paymentMethods.list({
        customer: customerId,
        type: 'card',
      });

      return paymentMethods.data;
    } catch (error) {
      console.error('Failed to get payment methods:', error);
      throw new Error('Failed to retrieve payment methods');
    }
  }
}

export default stripe;