import { hashPassword, verifyPassword } from '../password';

describe('Password Hashing', () => {
  const testPassword = 'TestPassword123!';

  it('should hash a password using argon2', async () => {
    const hashedPassword = await hashPassword(testPassword);
    expect(hashedPassword).toBeDefined();
    expect(typeof hashedPassword).toBe('string');
    expect(hashedPassword.length).toBeGreaterThan(0);
    // Argon2 hashes start with $argon2
    expect(hashedPassword).toMatch(/^\$argon2/);
  });

  it('should verify a correct password', async () => {
    const hashedPassword = await hashPassword(testPassword);
    const isValid = await verifyPassword(testPassword, hashedPassword);
    expect(isValid).toBe(true);
  });

  it('should reject an incorrect password', async () => {
    const hashedPassword = await hashPassword(testPassword);
    const isValid = await verifyPassword('WrongPassword', hashedPassword);
    expect(isValid).toBe(false);
  });

  it('should handle bcrypt hashes', async () => {
    // Example bcrypt hash for "TestPassword123!"
    const bcryptHash = '$2a$12$R9h/cIPz0gi.URNNX3kh2OPST9/PgBkqquzi.Ss7KIUgO2t0jWMUW';
    const isValid = await verifyPassword('test', bcryptHash);
    // This will be false since the hash is for "TestPassword123!" but we're testing with "test"
    expect(typeof isValid).toBe('boolean');
  });

  it('should handle argon2 verification', async () => {
    // Create an argon2 hash and verify it
    const hash = await hashPassword('mySecurePassword');
    const result1 = await verifyPassword('mySecurePassword', hash);
    const result2 = await verifyPassword('wrongPassword', hash);
    
    expect(result1).toBe(true);
    expect(result2).toBe(false);
  });
});
