import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/config';
import { UserRole } from '@prisma/client';

export const dynamic = 'force-dynamic';

// Mock storage for settings (in production, this would be in database)
let settings = {
  email: {
    provider: 'smtp',
    smtpHost: '',
    smtpPort: 587,
    smtpUser: '',
    smtpPassword: '',
    sendgridApiKey: '',
    fromEmail: '',
    fromName: 'Village Admin',
  },
  payment: {
    provider: 'razorpay',
    razorpayKeyId: '',
    razorpayKeySecret: '',
    stripePublishableKey: '',
    stripeSecretKey: '',
    currency: 'INR',
  },
  apiKeys: {
    googleMapsKey: '',
    weatherApiKey: '',
    smsApiKey: '',
  },
  features: {
    bookingEnabled: true,
    marketplaceEnabled: true,
    reviewsEnabled: true,
    iotEnabled: true,
    analyticsEnabled: true,
  },
  system: {
    maintenanceMode: false,
    lastBackup: 'Never',
    databaseSize: '248 MB',
    storageUsed: '1.2 GB',
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

    // Return settings (masking sensitive data)
    const maskedSettings = {
      ...settings,
      email: {
        ...settings.email,
        smtpPassword: settings.email.smtpPassword ? '••••••••' : '',
        sendgridApiKey: settings.email.sendgridApiKey ? '••••••••' : '',
      },
      payment: {
        ...settings.payment,
        razorpayKeySecret: settings.payment.razorpayKeySecret ? '••••••••' : '',
        stripeSecretKey: settings.payment.stripeSecretKey ? '••••••••' : '',
      },
      apiKeys: {
        googleMapsKey: settings.apiKeys.googleMapsKey ? '••••••••' : '',
        weatherApiKey: settings.apiKeys.weatherApiKey ? '••••••••' : '',
        smsApiKey: settings.apiKeys.smsApiKey ? '••••••••' : '',
      },
    };

    return NextResponse.json(maskedSettings);
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
    const { type, data } = body;

    if (!type || !data) {
      return NextResponse.json({ error: 'Missing type or data' }, { status: 400 });
    }

    // Update settings based on type
    if (type === 'email') {
      // Don't overwrite password if it's masked
      if (data.smtpPassword === '••••••••') {
        data.smtpPassword = settings.email.smtpPassword;
      }
      if (data.sendgridApiKey === '••••••••') {
        data.sendgridApiKey = settings.email.sendgridApiKey;
      }
      settings.email = { ...settings.email, ...data };
    } else if (type === 'payment') {
      // Don't overwrite keys if they're masked
      if (data.razorpayKeySecret === '••••••••') {
        data.razorpayKeySecret = settings.payment.razorpayKeySecret;
      }
      if (data.stripeSecretKey === '••••••••') {
        data.stripeSecretKey = settings.payment.stripeSecretKey;
      }
      settings.payment = { ...settings.payment, ...data };
    } else if (type === 'apiKeys') {
      // Don't overwrite keys if they're masked
      if (data.googleMapsKey === '••••••••') {
        data.googleMapsKey = settings.apiKeys.googleMapsKey;
      }
      if (data.weatherApiKey === '••••••••') {
        data.weatherApiKey = settings.apiKeys.weatherApiKey;
      }
      if (data.smsApiKey === '••••••••') {
        data.smsApiKey = settings.apiKeys.smsApiKey;
      }
      settings.apiKeys = { ...settings.apiKeys, ...data };
    } else if (type === 'features') {
      settings.features = { ...settings.features, ...data };
    } else if (type === 'system') {
      settings.system = { ...settings.system, ...data };
    } else {
      return NextResponse.json({ error: 'Invalid settings type' }, { status: 400 });
    }

    return NextResponse.json({ success: true, message: 'Settings updated successfully' });
  } catch (error) {
    console.error('Failed to update settings:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
