# Email Service Configuration Guide

## Overview

The Smart Carbon-Free Village platform uses a dual email service system with automatic fallback:
1. **Primary**: SendGrid (recommended for production)
2. **Fallback**: Nodemailer with SMTP (Gmail, custom SMTP servers)

The system automatically attempts SendGrid first and falls back to Nodemailer if SendGrid is not configured or fails.

## Configuration

### Option 1: SendGrid (Recommended)

SendGrid offers reliable delivery, analytics, and better inbox placement.

1. **Sign up for SendGrid**: https://sendgrid.com/
2. **Create an API Key**:
   - Navigate to Settings → API Keys
   - Click "Create API Key"
   - Select "Full Access" or create custom permissions for Mail Send
   - Copy the generated API key

3. **Configure Environment Variables**:
```bash
# SendGrid Configuration
SENDGRID_API_KEY=SG.xxxxxxxxxxxxxxxxxxxx
FROM_EMAIL=bookings@damdayvillage.com
```

### Option 2: SMTP (Gmail, Custom Server)

For development or when SendGrid is not available.

#### Using Gmail

1. **Enable 2-Factor Authentication** on your Gmail account
2. **Generate an App Password**:
   - Go to Google Account → Security → 2-Step Verification → App passwords
   - Select "Mail" and "Other (Custom name)"
   - Copy the generated 16-character password

3. **Configure Environment Variables**:
```bash
# SMTP Configuration (Gmail)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
FROM_EMAIL=your-email@gmail.com
```

#### Using Custom SMTP Server

```bash
# SMTP Configuration (Custom)
SMTP_HOST=mail.yourdomain.com
SMTP_PORT=587  # or 465 for SSL
SMTP_USER=noreply@yourdomain.com
SMTP_PASS=your-password
FROM_EMAIL=noreply@yourdomain.com
```

## Email Templates

The platform includes professionally designed HTML email templates for:

### 1. Booking Confirmation
- Sent when a booking is confirmed
- Includes booking details, check-in/check-out dates
- Links to booking management page
- Displays carbon-neutral features

### 2. Cancellation Confirmation
- Sent when a booking is cancelled
- Includes refund information
- Provides cancellation details

### 3. Host Notification
- Sent to homestay hosts for new bookings
- Includes guest details and contact information
- Links to host dashboard

## Usage

### Booking Confirmation Email

```typescript
import { EmailNotificationService } from '@/lib/notifications/email';

await EmailNotificationService.sendBookingConfirmation({
  guestEmail: 'guest@example.com',
  guestName: 'John Doe',
  homestayTitle: 'Mountain View Villa',
  hostName: 'Jane Smith',
  checkInDate: 'January 15, 2025',
  checkOutDate: 'January 20, 2025',
  guests: 2,
  totalAmount: 5000,
  currency: 'INR',
  bookingId: 'booking-123',
  bookingReference: 'BOOK1234'
});
```

### Cancellation Email

```typescript
await EmailNotificationService.sendCancellationConfirmation({
  guestEmail: 'guest@example.com',
  guestName: 'John Doe',
  homestayTitle: 'Mountain View Villa',
  bookingReference: 'BOOK1234',
  refundAmount: 4500,
  cancellationReason: 'Change of plans'
});
```

### Host Notification

```typescript
await EmailNotificationService.sendHostNotification({
  hostEmail: 'host@example.com',
  hostName: 'Jane Smith',
  homestayTitle: 'Mountain View Villa',
  guestName: 'John Doe',
  checkInDate: 'January 15, 2025',
  checkOutDate: 'January 20, 2025',
  guests: 2,
  bookingReference: 'BOOK1234',
  guestContact: 'guest@example.com'
});
```

## API Endpoints

### Send Booking Confirmation

```
POST /api/booking/send-confirmation
```

**Request Body**:
```json
{
  "bookingId": "clxxxxx",
  "email": "guest@example.com"
}
```

**Response**:
```json
{
  "success": true,
  "message": "Confirmation email sent successfully",
  "emailSent": true
}
```

## Troubleshooting

### SendGrid Issues

**Problem**: "SendGrid API key not configured"
- Ensure `SENDGRID_API_KEY` is set in environment variables
- Verify the API key has Mail Send permissions

**Problem**: Email delivery fails
- Check SendGrid dashboard for delivery status
- Verify sender email is authenticated in SendGrid
- Ensure you're not exceeding SendGrid rate limits

### SMTP Issues

**Problem**: "SMTP credentials not configured"
- Verify `SMTP_USER` and `SMTP_PASS` are set
- Check SMTP host and port are correct

**Problem**: Gmail authentication fails
- Ensure 2FA is enabled
- Generate a new App Password
- Use the 16-character App Password, not your Gmail password

**Problem**: Connection timeout
- Check firewall settings
- Verify SMTP port is not blocked (587 or 465)
- Try alternative SMTP ports

### General Issues

**Problem**: Emails go to spam
- Set up SPF, DKIM, and DMARC records for your domain
- Use SendGrid's domain authentication
- Avoid spam trigger words in subject lines

**Problem**: Email delivery is slow
- SendGrid typically delivers in seconds
- SMTP may be slower depending on server
- Check email queue if using background jobs

## Testing

### Development Testing

For local development, emails will be logged to console if neither SendGrid nor SMTP is configured:

```bash
# The email service will log:
console.log('Email sent successfully via SendGrid');
# or
console.log('Email sent successfully via Nodemailer');
```

### Production Testing

1. Send a test booking confirmation:
```bash
curl -X POST https://your-domain.com/api/booking/send-confirmation \
  -H "Content-Type: application/json" \
  -H "Cookie: your-auth-cookie" \
  -d '{
    "bookingId": "test-booking-id",
    "email": "test@example.com"
  }'
```

2. Check email delivery in:
   - SendGrid dashboard (Activity)
   - Email inbox
   - Spam folder

## Best Practices

1. **Use SendGrid in Production**: Better deliverability and analytics
2. **Set up Domain Authentication**: Improves email deliverability
3. **Monitor Email Logs**: Track delivery success/failures
4. **Handle Failures Gracefully**: The system doesn't fail if email fails
5. **Test Before Deploying**: Send test emails to verify configuration
6. **Keep API Keys Secret**: Never commit keys to version control
7. **Use Environment Variables**: Different configs for dev/staging/prod

## Environment Variables Reference

```bash
# Email Service Configuration
SENDGRID_API_KEY=SG.xxxxxxxxxxxxxxxxxxxx  # Optional, for SendGrid
SMTP_HOST=smtp.gmail.com                  # Optional, for SMTP fallback
SMTP_PORT=587                             # Optional, default: 587
SMTP_USER=your-email@gmail.com            # Optional, for SMTP fallback
SMTP_PASS=your-password                   # Optional, for SMTP fallback
FROM_EMAIL=bookings@damdayvillage.com     # Required, sender email address
```

## Support

If you encounter issues with email configuration:
1. Check the logs in `/api/booking/send-confirmation`
2. Verify environment variables are set correctly
3. Test with a simple email client first
4. Contact SendGrid support for delivery issues

## Security Notes

- Never expose API keys in client-side code
- Use environment variables for all credentials
- Rotate API keys periodically
- Monitor for unauthorized email sending
- Implement rate limiting for email endpoints
