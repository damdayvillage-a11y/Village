# Changelog

All notable changes to the Smart Carbon-Free Village project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added - PR14: Media Management & Drive Integration (2025-10-18)
- **Media Library Component**: Complete media management interface
  - Grid and list view modes with toggle
  - Search functionality for files and tags
  - Folder-based organization
  - Multi-select support for bulk operations
  - File type filtering (images, videos, documents)
  - Drag-and-drop upload interface
  - Real-time file preview (images show thumbnails)
  - File size formatting and metadata display
  - Delete and external link actions
- **Upload System**: File upload with local storage
  - Multi-file upload support
  - File type detection (image, video, document, other)
  - Automatic filename sanitization
  - Size tracking and display
  - Folder assignment during upload
- **Media APIs**: Complete CRUD operations
  - `GET /api/media` - List files with filtering (folder, type)
  - `POST /api/media/upload` - Upload files with metadata
  - `DELETE /api/media/[id]` - Delete files (disk + database)
  - Admin-only access control
  - File system integration (public/uploads)

### Components Created - PR14 (2)
- `MediaLibrary.tsx` - Full-featured media library with grid/list views
- `src/app/admin-panel/media/page.tsx` - Media management page

### API Endpoints - PR14 (3)
- `GET /api/media` - Fetch media files
- `POST /api/media/upload` - Upload files
- `DELETE /api/media/[id]` - Delete files

### Infrastructure - PR14
- File upload to public/uploads directory
- Database integration with existing Media model
- Automatic directory creation
- File type classification
- MIME type handling

### Added - PR13 Phase 2: Advanced Theme & SEO Controls (2025-10-18)
- **Advanced Theme Customizer**: Complete theme management system
  - Typography settings (8 font options for heading and body)
  - Layout controls (max width, spacing, border radius)
  - Extended color palette (5 colors: primary, secondary, accent, background, text)
  - Tab-based interface (Typography, Layout, Colors)
  - Real-time preview for all settings
  - Font preview with sample text
  - Layout preview with visual examples
- **SEO Controls**: Per-page SEO management
  - Page selector for 7 main pages
  - Meta title with character count (optimal: 30-60)
  - Meta description with character count (optimal: 120-160)
  - Keywords management
  - Open Graph image configuration
  - Canonical URL settings
  - SEO analysis with recommendations
  - Search result preview
  - Real-time validation badges
- **Enhanced Control Center**: Updated navigation
  - Added Theme tab with Brush icon
  - Added SEO tab with Search icon
  - 5-tab navigation (Features, Branding, Theme, SEO, API Keys)
  - Improved layout and spacing

### API Endpoints - PR13 Phase 2 (2 new)
- `GET/POST /api/admin/theme` - Theme customization settings
  - Fonts (heading, body)
  - Layout (maxWidth, spacing, borderRadius)
  - Colors (primary, secondary, accent, background, text)
- `GET/POST /api/admin/seo` - Per-page SEO management
  - Meta tags (title, description, keywords)
  - Open Graph settings
  - Canonical URLs

### Components Created - PR13 Phase 2 (2)
- `ThemeCustomizer.tsx` - Advanced theme management with preview
- `SEOControls.tsx` - Per-page SEO configuration

### Infrastructure - PR13 Phase 2
- Nested AppSettings storage (fonts.heading, layout.spacing, etc.)
- Default SEO templates for common pages
- SEO analysis algorithm
- Real-time validation and feedback

### Added - PR13: Admin Control Center Enhancement (2025-10-18)
- **Feature Toggle Dashboard**: WordPress-style feature management
  - Enable/disable features dynamically
  - 8 feature toggles (Homestays, Marketplace, Tours, Blog, Projects, Carbon Credits, IoT, Analytics)
  - Status indicators (Active, Beta, Planned)
  - Configuration requirements display
  - Database-backed feature state
- **Branding Manager**: Complete brand identity control
  - Site name and tagline customization
  - Color scheme editor (Primary, Secondary, Accent)
  - Live preview of branding changes
  - Logo upload support (structure ready)
  - Favicon upload support (structure ready)
  - Real-time color picker
- **API Key Manager**: Secure external service configuration
  - Support for 5 services (Razorpay, Stripe, SendGrid, Google Drive, Twilio)
  - API key validation and testing
  - Secure key storage with visibility toggle
  - Connection testing functionality
  - Last tested timestamps
  - Status badges (Valid, Invalid, Not Configured)
- **Admin Control Center Page**: Unified admin interface
  - Tab-based navigation (Features, Branding, API Keys)
  - Clean WordPress-style interface
  - Responsive design
  - Integrated all control center components

### API Endpoints - PR13 (2 new)
- `GET/POST /api/admin/branding` - Manage branding settings
- `GET/PATCH /api/admin/features` - Feature toggle management

### Components Created - PR13 (4)
- `FeatureToggleDashboard.tsx` - Feature management interface
- `BrandingManager.tsx` - Brand identity editor
- `APIKeyManager.tsx` - API key configuration
- `control-center/page.tsx` - Main control center page

### Infrastructure - PR13
- Database-backed feature toggles via AppSettings
- Secure API key storage
- Real-time feature enable/disable
- Admin-only access control

### Added - PR12 Phase 5: Booking Flow (2025-10-18)
- **Booking Components**: Complete booking flow UI components
  - GuestInformationForm: Comprehensive guest details form with validation
    - Name, email, phone validation
    - Number of guests with min/max limits
    - Special requests textarea
    - Form state management and error handling
  - BookingConfirmation: Post-booking success screen
    - Booking details display
    - Confirmation number
    - Guest and payment information
    - Download and share options
    - Important information section
- **Booking APIs**: Email and cancellation endpoints
  - POST /api/booking/send-confirmation: Send booking confirmation email
    - Fetches booking details with homestay and guest info
    - Email content generation (ready for email service integration)
    - Authorization checks
  - POST /api/user/bookings/[id]/cancel: Cancel booking with refund calculation
    - Cancellation policy enforcement (24h/12h refund tiers)
    - Automatic refund calculation (100%/50%/0%)
    - Notification creation
    - Status validation (prevent double cancellation)
- **Features**:
  - Guest information validation with real-time feedback
  - Automatic confirmation email sending on booking success
  - Smart refund calculation based on cancellation timing
  - Booking status tracking and updates
  - Email notification integration (structure ready for SMTP/SendGrid)
  - Social sharing for confirmations
  - Download confirmation functionality (structure ready)

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
