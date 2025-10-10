import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

/**
 * Environment Configuration Check Endpoint
 * 
 * Validates that required environment variables are properly configured.
 * This endpoint is publicly accessible for diagnostic purposes.
 */
export async function GET(request: NextRequest) {
  const requiredVars = [
    'NEXTAUTH_URL',
    'NEXTAUTH_SECRET',
    'DATABASE_URL',
  ];

  const dummyValues = [
    'dummy-secret-for-build',
    'dummy-secret-for-build-only-not-secure',
    'your-nextauth-secret-key',
    'change-me',
    'postgresql://dummy:dummy@localhost:5432/dummy',
  ];

  const placeholderPatterns = [
    /\$\$cap_[^$]+\$\$/,     // CapRover placeholders like $$cap_appname$$
    /\$\{[^}]+\}/,           // Template literals like ${VARIABLE}
    /your-[a-z-]+/i,         // Patterns like your-domain, your-secret
    /change-me/i,            // Common placeholder text
    /example\./i,            // example.com patterns
    /placeholder/i,          // Placeholder text
    /replace-this/i,         // Replace-this patterns
  ];

  const hasPlaceholder = (value: string): boolean => {
    return placeholderPatterns.some(pattern => pattern.test(value));
  };

  const errors: string[] = [];
  const warnings: string[] = [];
  const details: Record<string, any> = {};
  let checkedVars = 0;

  // Check required variables
  for (const varName of requiredVars) {
    checkedVars++;
    const value = process.env[varName];
    
    if (!value) {
      errors.push(`${varName} is not set`);
      details[varName] = { status: 'missing', message: 'Variable not set' };
    } else if (dummyValues.includes(value)) {
      errors.push(`${varName} contains dummy/placeholder value`);
      details[varName] = { status: 'invalid', message: 'Contains dummy value' };
    } else if (hasPlaceholder(value)) {
      errors.push(`${varName} contains unreplaced placeholder (e.g., $$cap_*$$)`);
      details[varName] = { status: 'placeholder', message: 'Contains placeholder pattern' };
    } else {
      details[varName] = { status: 'ok', message: 'Configured' };
      
      // Additional validation for specific variables
      if (varName === 'NEXTAUTH_SECRET' && value.length < 32) {
        warnings.push(`${varName} is too short (${value.length} chars, minimum 32 recommended)`);
        details[varName].message = 'Configured but too short';
      }
      
      if (varName === 'NEXTAUTH_URL') {
        if (process.env.NODE_ENV === 'production' && value.startsWith('http://')) {
          warnings.push(`${varName} uses HTTP in production (HTTPS recommended)`);
          details[varName].warning = 'Should use HTTPS in production';
        }
      }
    }
  }

  // Check NODE_ENV
  const nodeEnv = process.env.NODE_ENV || 'development';
  details.NODE_ENV = { 
    status: 'ok', 
    value: nodeEnv,
    message: nodeEnv === 'production' ? 'Production mode' : 'Development mode'
  };

  const configured = errors.length === 0;
  const hasErrors = errors.length > 0;
  const hasWarnings = warnings.length > 0;

  return NextResponse.json({
    configured,
    hasErrors,
    hasWarnings,
    checkedVars,
    message: configured 
      ? 'All required environment variables are configured'
      : 'Configuration issues detected',
    errors,
    warnings,
    details,
    recommendations: errors.length > 0 ? [
      'Review your environment variables in CapRover dashboard or .env file',
      'Replace all $$cap_*$$ placeholders with actual values',
      'Generate NEXTAUTH_SECRET with: openssl rand -base64 32',
      'Set NEXTAUTH_URL to your actual domain (e.g., https://damdayvillage.com)',
      'Ensure DATABASE_URL points to a running PostgreSQL instance',
    ] : warnings.length > 0 ? [
      'Consider addressing the warnings for better security',
    ] : [
      'Configuration looks good!',
    ]
  });
}
