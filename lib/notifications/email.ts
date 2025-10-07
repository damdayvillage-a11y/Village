import sgMail from '@sendgrid/mail';
import nodemailer from 'nodemailer';

// Initialize SendGrid
if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
}

// Initialize Nodemailer (fallback)
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export interface BookingConfirmationData {
  guestEmail: string;
  guestName: string;
  homestayTitle: string;
  hostName: string;
  checkInDate: string;
  checkOutDate: string;
  guests: number;
  totalAmount: number;
  currency: string;
  bookingId: string;
  bookingReference: string;
}

export interface CancellationData {
  guestEmail: string;
  guestName: string;
  homestayTitle: string;
  bookingReference: string;
  refundAmount?: number;
  cancellationReason?: string;
}

export interface HostNotificationData {
  hostEmail: string;
  hostName: string;
  homestayTitle: string;
  guestName: string;
  checkInDate: string;
  checkOutDate: string;
  guests: number;
  bookingReference: string;
  guestContact?: string;
}

export class EmailNotificationService {
  private static async sendWithSendGrid(msg: any): Promise<boolean> {
    try {
      if (!process.env.SENDGRID_API_KEY) {
        throw new Error('SendGrid API key not configured');
      }
      
      await sgMail.send(msg);
      console.log('Email sent successfully via SendGrid');
      return true;
    } catch (error) {
      console.error('SendGrid email failed:', error);
      return false;
    }
  }

  private static async sendWithNodemailer(msg: any): Promise<boolean> {
    try {
      if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
        throw new Error('SMTP credentials not configured');
      }

      const mailOptions = {
        from: process.env.FROM_EMAIL || 'noreply@damdayvillage.com',
        to: msg.to,
        subject: msg.subject,
        html: msg.html,
      };

      await transporter.sendMail(mailOptions);
      console.log('Email sent successfully via Nodemailer');
      return true;
    } catch (error) {
      console.error('Nodemailer email failed:', error);
      return false;
    }
  }

  private static async sendEmail(msg: any): Promise<boolean> {
    // Try SendGrid first, fallback to Nodemailer
    let success = await this.sendWithSendGrid(msg);
    
    if (!success) {
      success = await this.sendWithNodemailer(msg);
    }

    return success;
  }

  static async sendBookingConfirmation(data: BookingConfirmationData): Promise<boolean> {
    const msg = {
      to: data.guestEmail,
      from: process.env.FROM_EMAIL || 'bookings@damdayvillage.com',
      subject: `Booking Confirmed - ${data.homestayTitle}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Booking Confirmation</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #10b981, #059669); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
            .booking-details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #10b981; }
            .detail-row { display: flex; justify-content: space-between; margin: 10px 0; padding: 8px 0; border-bottom: 1px solid #e5e7eb; }
            .detail-label { font-weight: bold; color: #374151; }
            .detail-value { color: #6b7280; }
            .cta-button { background: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin: 20px 0; }
            .footer { text-align: center; margin-top: 30px; color: #6b7280; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🏔️ Booking Confirmed!</h1>
              <p>Welcome to Damday Village - Your Sustainable Mountain Retreat</p>
            </div>
            
            <div class="content">
              <p>Dear ${data.guestName},</p>
              
              <p>Thank you for choosing Damday Village! Your booking has been confirmed and we're excited to welcome you to our carbon-neutral mountain retreat.</p>
              
              <div class="booking-details">
                <h3>📋 Booking Details</h3>
                <div class="detail-row">
                  <span class="detail-label">Booking Reference:</span>
                  <span class="detail-value">${data.bookingReference}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Homestay:</span>
                  <span class="detail-value">${data.homestayTitle}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Host:</span>
                  <span class="detail-value">${data.hostName}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Check-in:</span>
                  <span class="detail-value">${data.checkInDate}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Check-out:</span>
                  <span class="detail-value">${data.checkOutDate}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Guests:</span>
                  <span class="detail-value">${data.guests}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Total Amount:</span>
                  <span class="detail-value">${data.currency} ${data.totalAmount.toFixed(2)}</span>
                </div>
              </div>
              
              <h3>🌿 What to Expect</h3>
              <ul>
                <li><strong>100% Solar Powered:</strong> Experience sustainable living with our complete solar energy system</li>
                <li><strong>Authentic Culture:</strong> Immerse yourself in traditional Kumaoni mountain culture</li>
                <li><strong>Local Cuisine:</strong> Enjoy organic, locally-sourced traditional meals</li>
                <li><strong>Nature Activities:</strong> Hiking, bird watching, and village tours included</li>
                <li><strong>Carbon Offset:</strong> Your stay actively contributes to carbon sequestration projects</li>
              </ul>
              
              <h3>📍 Getting Here</h3>
              <p>Damday Village is located in Gangolihat, Pithoragarh, Uttarakhand at 2,100m elevation. We'll send detailed directions and transportation options 3 days before your arrival.</p>
              
              <a href="https://village-app.captain.damdayvillage.com/booking/${data.bookingId}" class="cta-button">View Booking Details</a>
              
              <p>If you have any questions, feel free to contact us at bookings@damdayvillage.com or call +91-XXXXX-XXXXX.</p>
              
              <p>We look forward to providing you with an unforgettable sustainable mountain experience!</p>
              
              <p>Warm regards,<br>The Damday Village Team</p>
            </div>
            
            <div class="footer">
              <p>Damday Village - Smart Carbon-Free Model Village<br>
              Gangolihat, Pithoragarh, Uttarakhand 262524, India</p>
              <p>This is a confirmation email. Please keep it for your records.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    };

    return await this.sendEmail(msg);
  }

  static async sendCancellationConfirmation(data: CancellationData): Promise<boolean> {
    const msg = {
      to: data.guestEmail,
      from: process.env.FROM_EMAIL || 'bookings@damdayvillage.com',
      subject: `Booking Cancelled - ${data.homestayTitle}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Booking Cancellation</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #ef4444, #dc2626); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
            .cancellation-details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ef4444; }
            .footer { text-align: center; margin-top: 30px; color: #6b7280; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>❌ Booking Cancelled</h1>
              <p>We're sorry to see you go</p>
            </div>
            
            <div class="content">
              <p>Dear ${data.guestName},</p>
              
              <p>Your booking cancellation has been processed successfully.</p>
              
              <div class="cancellation-details">
                <h3>📋 Cancellation Details</h3>
                <p><strong>Booking Reference:</strong> ${data.bookingReference}</p>
                <p><strong>Homestay:</strong> ${data.homestayTitle}</p>
                ${data.refundAmount ? `<p><strong>Refund Amount:</strong> ₹${data.refundAmount.toFixed(2)}</p>` : ''}
                ${data.cancellationReason ? `<p><strong>Reason:</strong> ${data.cancellationReason}</p>` : ''}
              </div>
              
              ${data.refundAmount ? `
                <h3>💰 Refund Information</h3>
                <p>Your refund of ₹${data.refundAmount.toFixed(2)} will be processed within 5-7 business days to your original payment method.</p>
              ` : ''}
              
              <p>We hope to welcome you to Damday Village in the future. If you have any questions about this cancellation, please contact us at bookings@damdayvillage.com.</p>
              
              <p>Thank you for considering Damday Village for your sustainable travel needs.</p>
              
              <p>Best regards,<br>The Damday Village Team</p>
            </div>
            
            <div class="footer">
              <p>Damday Village - Smart Carbon-Free Model Village<br>
              Gangolihat, Pithoragarh, Uttarakhand 262524, India</p>
            </div>
          </div>
        </body>
        </html>
      `,
    };

    return await this.sendEmail(msg);
  }

  static async sendHostNotification(data: HostNotificationData): Promise<boolean> {
    const msg = {
      to: data.hostEmail,
      from: process.env.FROM_EMAIL || 'bookings@damdayvillage.com',
      subject: `New Booking - ${data.homestayTitle}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>New Booking Notification</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #3b82f6, #2563eb); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
            .booking-details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #3b82f6; }
            .cta-button { background: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin: 20px 0; }
            .footer { text-align: center; margin-top: 30px; color: #6b7280; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎉 New Booking!</h1>
              <p>You have a new guest reservation</p>
            </div>
            
            <div class="content">
              <p>Dear ${data.hostName},</p>
              
              <p>Great news! You have received a new booking for your homestay.</p>
              
              <div class="booking-details">
                <h3>📋 Booking Information</h3>
                <p><strong>Booking Reference:</strong> ${data.bookingReference}</p>
                <p><strong>Homestay:</strong> ${data.homestayTitle}</p>
                <p><strong>Guest Name:</strong> ${data.guestName}</p>
                <p><strong>Check-in:</strong> ${data.checkInDate}</p>
                <p><strong>Check-out:</strong> ${data.checkOutDate}</p>
                <p><strong>Number of Guests:</strong> ${data.guests}</p>
                ${data.guestContact ? `<p><strong>Guest Contact:</strong> ${data.guestContact}</p>` : ''}
              </div>
              
              <h3>📝 Next Steps</h3>
              <ul>
                <li>Prepare your homestay for the guest arrival</li>
                <li>Review guest preferences and special requests</li>
                <li>Plan welcome activities and local experiences</li>
                <li>Ensure all amenities are ready and functional</li>
              </ul>
              
              <a href="https://village-app.captain.damdayvillage.com/host/bookings" class="cta-button">Manage Booking</a>
              
              <p>If you have any questions or need assistance, please contact our support team at support@damdayvillage.com.</p>
              
              <p>Thank you for being part of the Damday Village community!</p>
              
              <p>Best regards,<br>The Damday Village Team</p>
            </div>
            
            <div class="footer">
              <p>Damday Village - Smart Carbon-Free Model Village<br>
              Gangolihat, Pithoragarh, Uttarakhand 262524, India</p>
            </div>
          </div>
        </body>
        </html>
      `,
    };

    return await this.sendEmail(msg);
  }
}