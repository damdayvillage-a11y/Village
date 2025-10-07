import Razorpay from 'razorpay';
import crypto from 'crypto';

// Initialize Razorpay with API keys
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export interface RazorpayOrderData {
  amount: number;
  currency: string;
  notes: {
    bookingId: string;
    homestayId: string;
    guestEmail: string;
    checkIn: string;
    checkOut: string;
    guests: number;
  };
}

export interface RazorpayRefundData {
  paymentId: string;
  amount?: number; // In smallest currency unit
  notes?: Record<string, string>;
}

export class RazorpayPaymentService {
  static async createOrder(data: RazorpayOrderData): Promise<any> {
    try {
      const order = await razorpay.orders.create({
        amount: Math.round(data.amount * 100), // Convert to paise
        currency: data.currency.toUpperCase(),
        notes: data.notes,
        partial_payment: false,
      });

      return order;
    } catch (error) {
      console.error('Razorpay order creation failed:', error);
      throw new Error('Failed to create payment order');
    }
  }

  static async verifyPayment(
    orderId: string,
    paymentId: string,
    signature: string
  ): Promise<boolean> {
    try {
      const body = orderId + '|' + paymentId;
      const expectedSignature = crypto
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
        .update(body.toString())
        .digest('hex');

      return expectedSignature === signature;
    } catch (error) {
      console.error('Razorpay payment verification failed:', error);
      return false;
    }
  }

  static async capturePayment(paymentId: string, amount: number): Promise<any> {
    try {
      const payment = await razorpay.payments.capture(paymentId, amount * 100, 'INR');
      return payment;
    } catch (error) {
      console.error('Razorpay payment capture failed:', error);
      throw new Error('Failed to capture payment');
    }
  }

  static async refundPayment(data: RazorpayRefundData): Promise<any> {
    try {
      const refund = await razorpay.payments.refund(data.paymentId, {
        amount: data.amount,
        notes: data.notes,
      });

      return refund;
    } catch (error) {
      console.error('Razorpay refund failed:', error);
      throw new Error('Failed to process refund');
    }
  }

  static async getPayment(paymentId: string): Promise<any> {
    try {
      const payment = await razorpay.payments.fetch(paymentId);
      return payment;
    } catch (error) {
      console.error('Failed to fetch payment:', error);
      throw new Error('Failed to retrieve payment');
    }
  }

  static async getOrder(orderId: string): Promise<any> {
    try {
      const order = await razorpay.orders.fetch(orderId);
      return order;
    } catch (error) {
      console.error('Failed to fetch order:', error);
      throw new Error('Failed to retrieve order');
    }
  }

  static async getRefund(refundId: string): Promise<any> {
    try {
      const refund = await razorpay.refunds.fetch(refundId);
      return refund;
    } catch (error) {
      console.error('Failed to fetch refund:', error);
      throw new Error('Failed to retrieve refund');
    }
  }

  static generateSignature(orderId: string, paymentId: string): string {
    const body = orderId + '|' + paymentId;
    return crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
      .update(body.toString())
      .digest('hex');
  }
}

export default razorpay;