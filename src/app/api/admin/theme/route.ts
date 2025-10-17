import { NextRequest, NextResponse } from 'next/server';

// Mock theme storage (in production, this would be in a database)
let themeSettings = {
  primaryColor: '#3B82F6',
  secondaryColor: '#8B5CF6',
  backgroundColor: '#FFFFFF',
  textColor: '#1F2937',
  borderColor: '#E5E7EB',
  successColor: '#10B981',
  warningColor: '#F59E0B',
  errorColor: '#EF4444',
  infoColor: '#3B82F6',
  siteName: 'Village Admin',
  tagline: 'Manage your village platform',
  headerLogoUrl: '',
  footerLogoUrl: '',
  faviconUrl: '',
  fontFamily: 'Inter, system-ui, sans-serif',
  fontSize: 16,
  lineHeight: 1.5,
  fontWeight: 'normal',
  headingFontFamily: 'Inter, system-ui, sans-serif',
  borderRadius: 8,
  boxShadow: true,
  animationSpeed: 'normal',
  spacingScale: 'normal',
  customCSS: '',
  updatedAt: new Date().toISOString(),
};

// GET - Retrieve theme settings
export async function GET(request: NextRequest) {
  try {
    return NextResponse.json({
      success: true,
      theme: themeSettings,
    });
  } catch (error) {
    console.error('Error fetching theme:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch theme settings' },
      { status: 500 }
    );
  }
}

// PATCH - Update theme settings
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { theme } = body;

    if (!theme) {
      return NextResponse.json(
        { success: false, error: 'Theme data is required' },
        { status: 400 }
      );
    }

    // Update theme settings
    themeSettings = {
      ...themeSettings,
      ...theme,
      updatedAt: new Date().toISOString(),
    };

    return NextResponse.json({
      success: true,
      message: 'Theme updated successfully',
      theme: themeSettings,
    });
  } catch (error) {
    console.error('Error updating theme:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update theme settings' },
      { status: 500 }
    );
  }
}
