import * as argon2 from 'argon2';

/**
 * Hash a password using Argon2id (most secure variant)
 */
export async function hashPassword(password: string): Promise<string> {
  try {
    return await argon2.hash(password, {
      type: argon2.argon2id,
      memoryCost: 65536, // 64 MB
      timeCost: 3,       // 3 iterations
      parallelism: 4,    // 4 parallel threads
    });
  } catch (error) {
    console.error('Password hashing failed:', error);
    throw new Error('Failed to hash password');
  }
}

/**
 * Verify a password against its hash
 */
export async function verifyPassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  try {
    return await argon2.verify(hashedPassword, password);
  } catch (error) {
    console.error('Password verification failed:', error);
    return false;
  }
}

/**
 * Generate a secure random password
 */
export function generateSecurePassword(length: number = 16): string {
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
  let password = '';
  
  // Ensure at least one character from each category
  const categories = [
    'abcdefghijklmnopqrstuvwxyz',
    'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 
    '0123456789',
    '!@#$%^&*'
  ];
  
  // Add one character from each category
  for (const category of categories) {
    password += category.charAt(Math.floor(Math.random() * category.length));
  }
  
  // Fill remaining length with random characters
  for (let i = password.length; i < length; i++) {
    password += charset.charAt(Math.floor(Math.random() * charset.length));
  }
  
  // Shuffle the password
  return password.split('').sort(() => 0.5 - Math.random()).join('');
}

/**
 * Validate password strength
 */
export function validatePasswordStrength(password: string): {
  isValid: boolean;
  errors: string[];
  score: number;
} {
  const errors: string[] = [];
  let score = 0;
  
  // Length check
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  } else if (password.length >= 12) {
    score += 2;
  } else {
    score += 1;
  }
  
  // Character variety checks
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  } else {
    score += 1;
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  } else {
    score += 1;
  }
  
  if (!/\d/.test(password)) {
    errors.push('Password must contain at least one number');
  } else {
    score += 1;
  }
  
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>?]/.test(password)) {
    errors.push('Password must contain at least one special character');
  } else {
    score += 1;
  }
  
  // Common password check
  const commonPasswords = [
    'password', '123456', 'password123', 'admin', 'qwerty',
    'letmein', 'welcome', '123456789', 'password1'
  ];
  
  if (commonPasswords.includes(password.toLowerCase())) {
    errors.push('Password is too common');
    score -= 2;
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    score: Math.max(0, score)
  };
}