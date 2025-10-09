# Admin Setup Guide

This document explains how to set up and use the admin credentials for the Damday Village platform.

## 🔑 Default Admin Credentials

After running the database seeding process (`npm run db:seed`), the following default user accounts are created:

### Administrator Account
- **Email**: `admin@damdayvillage.org`
- **Password**: `Admin@123`
- **Role**: ADMIN
- **Permissions**: Full access to admin panel, user management, content management

### Host Account  
- **Email**: `host@damdayvillage.org`
- **Password**: `Host@123`
- **Role**: HOST
- **Permissions**: Manage homestays, bookings, and marketplace products

## 🚀 Quick Setup

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Set up environment**:
   ```bash
   cp .env.example .env
   # Edit .env file with your database URL and other settings
   ```

3. **Generate Prisma client**:
   ```bash
   npm run db:generate
   ```

4. **Run database migrations** (if using a real database):
   ```bash
   npm run db:migrate
   ```

5. **Seed the database**:
   ```bash
   npm run db:seed
   ```

6. **Start the development server**:
   ```bash
   npm run dev
   ```

7. **Access the admin panel**:
   - Navigate to `http://localhost:3000/admin-panel`
   - Log in with admin credentials above

## 🛡️ Security Considerations

### For Development
- The default credentials are safe to use during development and testing
- They are clearly documented and expected to be public

### For Production
⚠️ **IMPORTANT**: You MUST change these default passwords before deploying to production:

1. **After first deployment**, log in with default credentials
2. **Immediately change passwords** through the user profile settings
3. **Consider enabling two-factor authentication** if available
4. **Review user permissions** and remove unnecessary accounts

## 🔐 Password Requirements

The system enforces the following password requirements:
- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter  
- At least one number
- At least one special character
- Cannot be a common password

## 🚪 Admin Panel Access

The admin panel provides access to:
- **User Management**: View, edit, and manage user accounts
- **Content Management**: Manage homestays, products, and articles
- **System Statistics**: View platform usage and health metrics
- **IoT Device Management**: Monitor and configure village devices
- **Project Management**: Oversee community projects and funding

## 🔧 Troubleshooting

### Cannot log in with default credentials
1. Ensure the database has been seeded: `npm run db:seed`
2. Check that the user was created in the database
3. Verify the email and password are exactly as documented
4. Clear browser cache and cookies

### Admin panel shows "Access Denied"
1. Confirm you're logged in with the admin account (not host)
2. Check that the user has ADMIN role in the database
3. Verify session authentication is working

### Forgot admin password
1. Re-run the seed script: `npm run db:seed` (will reset to default)
2. Or manually reset the password through database admin tools
3. Or create a new admin user through the API

## 📞 Support

If you encounter issues with admin setup:
1. Check the main [README.md](../README.md) for general setup instructions
2. Review the [troubleshooting guides](.) in the docs folder
3. Ensure all environment variables are properly configured
4. Check that the database connection is working

---

**Last Updated**: January 2025  
**Default Admin Email**: admin@damdayvillage.org  
**Default Admin Password**: Admin@123