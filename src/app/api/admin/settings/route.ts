import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/config';
import { UserRole } from '@prisma/client';
import prisma from '@/lib/db/prisma';

export const dynamic = 'force-dynamic';

// PR13 Phase 1: Database-backed settings with AppSettings model
// Default settings structure for initialization
const DEFAULT_SETTINGS = {
  features: {
    homestaysEnabled: { value: true, label: 'Homestays & Bookings', description: 'Enable homestay listings and booking functionality' },
    marketplaceEnabled: { value: true, label: 'Marketplace', description: 'Enable product marketplace and orders' },
    toursEnabled: { value: false, label: 'Tours & Experiences', description: 'Enable tour booking system (PR15)' },
    blogEnabled: { value: false, label: 'Community Blog', description: 'Enable blog and content management (PR16)' },
    projectsEnabled: { value: false, label: 'Community Projects', description: 'Enable volunteering and donations (PR17)' },
    carbonCreditsEnabled: { value: false, label: 'Carbon Credits (Blockchain)', description: 'Enable tree NFTs and carbon marketplace (PR18-19)' },
    iotEnabled: { value: true, label: 'IoT Monitoring', description: 'Enable environmental sensor dashboard' },
    analyticsEnabled: { value: true, label: 'Analytics Dashboard', description: 'Enable admin analytics and insights' },
    reviewsEnabled: { value: true, label: 'Reviews & Ratings', description: 'Enable user reviews and complaints system' },
  },
  email: {
    provider: { value: 'smtp', label: 'Email Provider', description: 'SMTP or SendGrid' },
    smtpHost: { value: '', label: 'SMTP Host', description: 'e.g., smtp.gmail.com' },
    smtpPort: { value: 587, label: 'SMTP Port', description: 'Usually 587 or 465' },
    smtpUser: { value: '', label: 'SMTP Username', description: 'Email address' },
    smtpPassword: { value: '', label: 'SMTP Password', description: 'App password or SMTP password', sensitive: true },
    sendgridApiKey: { value: '', label: 'SendGrid API Key', description: 'Alternative to SMTP', sensitive: true },
    fromEmail: { value: '', label: 'From Email', description: 'Sender email address' },
    fromName: { value: 'Damday Village', label: 'From Name', description: 'Sender name' },
  },
  payment: {
    provider: { value: 'razorpay', label: 'Payment Provider', description: 'Razorpay or Stripe' },
    razorpayKeyId: { value: '', label: 'Razorpay Key ID', description: 'Public key' },
    razorpayKeySecret: { value: '', label: 'Razorpay Key Secret', description: 'Secret key', sensitive: true },
    stripePublishableKey: { value: '', label: 'Stripe Publishable Key', description: 'Public key' },
    stripeSecretKey: { value: '', label: 'Stripe Secret Key', description: 'Secret key', sensitive: true },
    currency: { value: 'INR', label: 'Currency', description: 'Default currency code' },
  },
  storage: {
    provider: { value: 'local', label: 'Storage Provider', description: 'local, google-drive, s3' },
    googleDriveEnabled: { value: false, label: 'Google Drive Integration', description: 'Enable Drive sync (PR14)' },
    googleDriveClientId: { value: '', label: 'Google Drive Client ID', description: 'OAuth client ID' },
    googleDriveClientSecret: { value: '', label: 'Google Drive Client Secret', description: 'OAuth secret', sensitive: true },
    s3Bucket: { value: '', label: 'S3 Bucket Name', description: 'AWS S3 bucket' },
    s3AccessKey: { value: '', label: 'S3 Access Key', description: 'AWS access key', sensitive: true },
    s3SecretKey: { value: '', label: 'S3 Secret Key', description: 'AWS secret key', sensitive: true },
  },
  sms: {
    provider: { value: 'twilio', label: 'SMS Provider', description: 'Twilio or MSG91' },
    twilioAccountSid: { value: '', label: 'Twilio Account SID', description: 'Account identifier' },
    twilioAuthToken: { value: '', label: 'Twilio Auth Token', description: 'Authentication token', sensitive: true },
    twilioPhoneNumber: { value: '', label: 'Twilio Phone Number', description: 'From number' },
    msg91AuthKey: { value: '', label: 'MSG91 Auth Key', description: 'Alternative to Twilio', sensitive: true },
    msg91SenderId: { value: '', label: 'MSG91 Sender ID', description: 'Sender identifier' },
  },
  system: {
    maintenanceMode: { value: false, label: 'Maintenance Mode', description: 'Enable to show maintenance page to public' },
    siteName: { value: 'Damday Village', label: 'Site Name', description: 'Name of the village/site' },
    timezone: { value: 'Asia/Kolkata', label: 'Timezone', description: 'Default timezone' },
    dateFormat: { value: 'DD/MM/YYYY', label: 'Date Format', description: 'Display format for dates' },
    maxUploadSize: { value: 10, label: 'Max Upload Size (MB)', description: 'Maximum file upload size' },
  },
};

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check admin permissions
    if (session.user?.role !== UserRole.ADMIN && session.user?.role !== UserRole.VILLAGE_COUNCIL) {
      return NextResponse.json({ error: 'Forbidden - Admin access required' }, { status: 403 });
    }

    // Fetch all settings from database
    const dbSettings = await prisma.appSettings.findMany();
    
    // Build settings object from database, merging with defaults
    const settings: any = {};
    
    for (const category in DEFAULT_SETTINGS) {
      settings[category] = {};
      const defaultCategorySettings = DEFAULT_SETTINGS[category as keyof typeof DEFAULT_SETTINGS];
      
      for (const key in defaultCategorySettings) {
        const defaultValue = (defaultCategorySettings as any)[key];
        
        // Find from database
        const dbSetting = dbSettings.find(s => s.category === category && s.key === key);
        
        if (dbSetting) {
          // Use database value
          settings[category][key] = {
            ...defaultValue,
            value: dbSetting.value,
          };
        } else {
          // Use default
          settings[category][key] = defaultValue;
        }
        
        // Mask sensitive data
        if ((defaultValue as any).sensitive && settings[category][key].value) {
          settings[category][key].value = '••••••••';
          settings[category][key].masked = true;
        }
      }
    }

    return NextResponse.json(settings);
  } catch (error) {
    console.error('Failed to fetch settings:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check admin permissions
    if (session.user?.role !== UserRole.ADMIN && session.user?.role !== UserRole.VILLAGE_COUNCIL) {
      return NextResponse.json({ error: 'Forbidden - Admin access required' }, { status: 403 });
    }

    const body = await request.json();
    const { category, key, value } = body;

    if (!category || !key || value === undefined) {
      return NextResponse.json({ error: 'Missing category, key, or value' }, { status: 400 });
    }

    // Validate category and key exist in defaults
    if (!(category in DEFAULT_SETTINGS)) {
      return NextResponse.json({ error: 'Invalid category' }, { status: 400 });
    }
    
    const categorySettings = DEFAULT_SETTINGS[category as keyof typeof DEFAULT_SETTINGS];
    if (!(key in categorySettings)) {
      return NextResponse.json({ error: 'Invalid key for category' }, { status: 400 });
    }

    // Don't update if value is masked (indicates no change to sensitive field)
    if (value === '••••••••') {
      return NextResponse.json({ success: true, message: 'No changes to sensitive field' });
    }

    // Upsert setting in database
    await prisma.appSettings.upsert({
      where: {
        category_key: {
          category,
          key,
        },
      },
      update: {
        value,
        updatedBy: session.user.id,
      },
      create: {
        category,
        key,
        value,
        isPublic: false, // Default to private
        updatedBy: session.user.id,
      },
    });

    return NextResponse.json({ success: true, message: 'Setting updated successfully' });
  } catch (error) {
    console.error('Failed to update setting:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
