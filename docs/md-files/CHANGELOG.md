# Changelog

All notable changes to the Smart Carbon-Free Village project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added - PR12 Phase 4: Payment Integration (2025-10-18)
- **Payment Gateway**: Complete Razorpay integration
  - PaymentGateway component: Full checkout experience with Razorpay
  - Support for booking and order payments
  - Real-time payment status tracking
  - Secure signature verification
  - Error handling and retry mechanisms
- **Payment APIs**: 3 new payment endpoints
  - POST /api/payment/create-order: Create Razorpay order with authentication
  - POST /api/payment/verify: Verify payment signature and update database
  - GET /api/user/transactions: Fetch user transaction history
- **Transaction Management**: TransactionHistory component
  - View all payment transactions
  - Search by transaction ID
  - Filter by status (Completed, Pending, Failed)
  - Download receipts (structure ready)
  - Status badges with icons
- **Database Integration**: Automatic booking/order status updates
  - Booking status changes to CONFIRMED on payment
  - Order status changes to CONFIRMED on payment
  - Payment records linked to bookings/orders
  - Automatic notification creation on successful payment
- **Security**: Payment verification with HMAC signature
  - Razorpay signature validation
  - Transaction integrity checks
  - Encrypted payment data storage

### Added - PR12: Build Fixes & Missing Components (2025-10-18)
- **UI Components**: Created missing UI components for complete admin panel functionality
  - Label component: Basic label with accessibility support
  - Switch component: Toggle switch with callback support
  - Tabs component: Full tab navigation with context API (Tabs, TabsList, TabsTrigger, TabsContent)
- **Hooks**: Created use-toast hook for toast notifications
  - Auto-dismiss after 5 seconds
  - Support for multiple toast variants (default, destructive)
  - Toast management (show, dismiss, list)
- **Build System**: Fixed TypeScript compilation errors
  - Fixed import paths in SettingsManager component
  - Added proper type annotations for event handlers
  - Resolved module resolution issues

### Fixed - PR12: TypeScript Compilation (2025-10-18)
- Fixed module resolution errors for UI components (@/components/ui/* imports)
- Fixed type errors in SettingsManager.tsx event handlers
- Added explicit type annotations for React ChangeEvent handlers
- Fixed undefined object access with proper null checks

### Added - PR11: User Panel Advanced Features (60% Complete)
- **Database Schema**: Added 7 new models (Notification, CarbonCredit, CarbonTransaction, Achievement, UserAchievement, Wishlist)
- **Components**: Created 6 new user panel components
  - EnhancedDashboard: Modern dashboard with 5 stat cards and activity feed
  - ProfileManagement: Complete profile editing with avatar upload
  - BookingManagement: Full booking lifecycle management
  - OrderHistory: Order tracking with status updates
  - Wishlist: Product wishlist with stock management
  - ReviewSubmission: 5-star rating and review system
- **API Endpoints**: Implemented 19 user panel API endpoints with real database integration
  - Profile APIs: GET, PATCH /api/user/profile, POST /api/user/profile/avatar
  - Booking APIs: Full CRUD for bookings with validation and overlap detection
  - Order APIs: GET /api/user/orders with item details
  - Wishlist APIs: GET, POST, DELETE /api/user/wishlist
  - Review APIs: GET, POST /api/user/reviews
  - Updated stats and notifications APIs to use real database queries
- **Infrastructure**: Created Prisma client singleton (lib/db/prisma.ts)
- **Features**:
  - Real-time statistics dashboard
  - Avatar upload with file validation (5MB max, JPEG/PNG/WebP)
  - Search and filter functionality across all list views
  - Automatic notification creation on user actions
  - Comprehensive validation (dates, stock, overlaps, guest limits)
  - Status tracking with visual indicators
  - Responsive design for all components

### Added - Previous Features
- Created comprehensive authentication error page at `/auth/error` with user-friendly error messages
- Added error handling documentation in `docs/AUTH_ERROR_HANDLING.md`
- Added support for conditional provider loading (OAuth and Email providers only load when configured)
- Added error handling wrappers to all NextAuth callbacks and API routes

### Changed
- OAuth providers (Google, GitHub) are now optional and only included when credentials are set
- Email provider is now optional and only included when email server is configured
- Improved error handling in NextAuth configuration to prevent 500 errors
- Updated `docs/TROUBLESHOOTING.md` with new authentication error handling information

### Fixed
- Fixed 500 error when trying to login to admin panel
- Fixed missing `/auth/error` page that caused authentication errors to crash
- Fixed unconfigured OAuth providers causing initialization errors
- Fixed unhandled errors in NextAuth callbacks causing 500 errors
- Fixed TypeScript type safety issues in authentication callbacks
- Fixed error handling in NextAuth API route handler

### Security
- Improved error messages to not leak sensitive information
- Added proper error logging while maintaining security

## [1.0.0] - 2024-01-XX

### Added
- Initial release of Smart Carbon-Free Village platform
- User authentication with NextAuth.js
- Admin panel for village management
- Homestay booking system
- Marketplace for local products
- IoT device integration
- Digital twin visualization
- Carbon footprint tracking
- Multi-language support
- PWA capabilities

[Unreleased]: https://github.com/damdayvillage-a11y/Village/compare/v1.0.0...HEAD
[1.0.0]: https://github.com/damdayvillage-a11y/Village/releases/tag/v1.0.0
