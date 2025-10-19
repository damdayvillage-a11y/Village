# Smart Carbon-Free Village - Enhanced Requirements (v2.0)

**Project**: Damday Village - Carbon-Neutral Platform  
**Version**: 2.0 (Enhanced)  
**Last Updated**: 2025-10-19  
**Status**: ✅ Comprehensive Feature Documentation

---

## Document Purpose

This document extends REQUIREMENTS.md with detailed specifications for all implemented and planned features, including complete admin panel functionality, carbon credit system, and marketplace management.

---

## Table of Contents

1. [Admin Panel Complete Feature Set](#admin-panel-complete-feature-set)
2. [Carbon Credit System](#carbon-credit-system)
3. [Marketplace Management](#marketplace-management)
4. [User Management System](#user-management-system)
5. [Media & Content Management](#media--content-management)
6. [IoT & Environmental Monitoring](#iot--environmental-monitoring)
7. [Booking & Homestay Management](#booking--homestay-management)
8. [System Configuration & Control](#system-configuration--control)
9. [Analytics & Reporting](#analytics--reporting)
10. [Navigation & Accessibility](#navigation--accessibility)

---

## Admin Panel Complete Feature Set

### Admin Panel Navigation Structure

The admin panel provides comprehensive management capabilities through an organized sidebar navigation:

#### Main Section
- **Dashboard**: System overview with real-time statistics
- **User Management**: Complete CRUD operations for all users

#### Operations Section
- **Booking Management**: Manage all homestay reservations
- **Reviews & Complaints**: Moderate user feedback and complaints
- **Carbon Credits**: Monitor and manage carbon credit system

#### Commerce Section
- **Marketplace Admin**: Order management and fulfillment
- **Product Management**: Product catalog CRUD operations

#### Content Section
- **Content Editor**: Dynamic page content editing
- **Page Manager**: Static page management
- **Media Manager**: File and image library management

#### Monitoring Section
- **IoT Devices**: Device registration and telemetry
- **Analytics**: Platform usage and business metrics

#### Settings Section
- **Control Center**: Feature toggles, branding, SEO, API keys
- **Theme Customizer**: Visual theme and layout customization
- **System Settings**: Core platform configuration

### Admin Panel Pages (All Accessible)

#### ✅ Implemented Pages
1. `/admin-panel` - Main dashboard with tabs
2. `/admin-panel/users` - Dedicated user management page
3. `/admin-panel/carbon-credits` - Carbon credit management
4. `/admin-panel/media` - Media library and uploads
5. `/admin-panel/marketplace/orders` - Order management
6. `/admin-panel/marketplace/products` - Product management
7. `/admin-panel/control-center` - WordPress-style control center
8. `/admin-panel/status` - System diagnostics and health
9. `/admin-panel/login` - Admin-specific login page

---

## Carbon Credit System

### Overview
Complete carbon credit tracking and management system for monitoring environmental impact and incentivizing sustainable behavior.

### User-Facing Features (FR6)

#### FR6.1: Track User Carbon Credits
- Real-time balance tracking
- Credit accumulation from sustainable actions
- Visual representation of credit history
- Integration with user profile

#### FR6.2: Calculate Activity Carbon Footprints
- Automatic calculation for:
  - Travel (km × emission factor)
  - Accommodation (nights × footprint)
  - Purchases (product carbon footprint)
  - Activities (activity-specific calculations)
- Regional adjustment factors
- Seasonal variations
- Transport mode variations

#### FR6.3: Carbon Credit Transactions
- Transaction types:
  - EARN: Credited from sustainable actions
  - SPEND: Used for offsets
  - TRANSFER: Between users
  - ADJUST: Admin modifications
- Transaction metadata:
  - Amount
  - Type
  - Reason/description
  - Timestamp
  - Related entity (booking, order, etc.)

#### FR6.4: Earn Credits for Sustainable Actions
- Actions that earn credits:
  - Using public transport
  - Choosing eco-friendly homestays
  - Participating in village activities
  - Purchasing sustainable products
  - Contributing to community projects
  - Completing environmental challenges
- Dynamic credit amounts based on impact
- Achievement bonuses for milestones

#### FR6.5: Spend Credits on Offsets
- Use credits for:
  - Carbon offset programs
  - Tree planting initiatives
  - Community environmental projects
  - Discounts on eco-friendly products
  - Premium sustainable services
- Real-time credit deduction
- Receipt and certificate generation

#### FR6.6: Transfer Credits Between Users
- Peer-to-peer credit transfers
- Gift credits to other users
- Transfer limits and validation
- Transaction confirmation
- Transfer history tracking

#### FR6.7: Transaction History
- Complete transaction log
- Filter by type, date, amount
- Search functionality
- Export capability
- Visual timeline representation

### Admin Features (FR6.8-FR6.12)

#### FR6.8: Admin Dashboard with Carbon Statistics
**Location**: `/admin-panel/carbon-credits`

**Statistics Displayed**:
- **Total Credits in System**: Sum of all user balances
- **Total Users with Credits**: Count of users with non-zero balance
- **Total Credits Earned**: Lifetime earned credits
- **Total Credits Spent**: Lifetime spent credits
- **Total Offset**: Environmental impact offset in kg CO2
- **Average Credits per User**: Mean balance across users

**Visual Representations**:
- Trend charts (daily, weekly, monthly)
- Distribution graphs
- Top users by balance
- Recent activity feed

#### FR6.9: View All Users with Carbon Credits
**Features**:
- Sortable user list with:
  - User name and email
  - Current balance
  - Total earned (lifetime)
  - Total spent (lifetime)
  - Last transaction date
  - User role
- Search by name or email
- Filter by balance range
- Filter by activity status
- Export to CSV

**User Details View**:
- Complete transaction history
- Earning patterns
- Spending patterns
- Associated activities

#### FR6.10: Manual Credit Adjustment by Admins
**Capability**: Adjust user carbon credits for:
- Corrections (errors in automatic calculations)
- Rewards (exceptional contributions)
- Penalties (policy violations)
- Compensation (service issues)
- Testing (development/QA)

**Adjustment Form**:
- User selection (search/dropdown)
- Adjustment type (add/subtract)
- Amount (positive number)
- Reason (required, 280 characters)
- Confirmation dialog

**Audit Trail**:
- All adjustments logged
- Admin user recorded
- Timestamp recorded
- Reason permanently stored
- Cannot be deleted (immutable)

#### FR6.11: Carbon Credit Transaction Filtering and Search
**Filter Options**:
- Transaction type (EARN, SPEND, TRANSFER, ADJUST)
- Date range (from/to)
- Amount range (min/max)
- User (specific user or all)
- Related entity (booking ID, order ID, etc.)

**Search Capabilities**:
- User name/email
- Transaction ID
- Reason/description text
- Related entity ID

**Display Options**:
- Table view (default)
- Timeline view
- Chart view
- Per-page limits (10, 20, 50, 100)
- Sorting by any column

#### FR6.12: Export Carbon Credit Reports
**Export Formats**:
- CSV (Excel-compatible)
- PDF (formatted report)
- JSON (API integration)

**Report Types**:
1. **User Balance Report**
   - All users with balances
   - Current balance
   - Lifetime earned/spent
   - Join date, last activity

2. **Transaction Report**
   - All transactions in date range
   - Filterable by user, type, amount
   - Summary statistics

3. **System Summary Report**
   - Overall statistics
   - Trends and charts
   - Top performers
   - Environmental impact metrics

4. **Audit Report**
   - All admin adjustments
   - Who, when, why, how much
   - For compliance and review

**Export Features**:
- Date range selection
- User/group selection
- Custom field selection
- Scheduled exports (future)
- Email delivery (future)

### API Endpoints (All Implemented)

#### Public/User Endpoints
- `GET /api/user/carbon-credits` - Get user's balance
- `GET /api/user/carbon-credits/transactions` - User's transaction history
- `POST /api/user/carbon-credits/transfer` - Transfer credits (future)

#### Admin Endpoints
- `GET /api/admin/carbon/stats` - System statistics
- `GET /api/admin/carbon/users` - All users with credits
- `GET /api/admin/carbon/transactions` - All transactions (filterable)
- `POST /api/admin/carbon/adjust` - Manually adjust user credits

### Database Schema

> **Note**: The schema examples below are for documentation purposes and may not reflect the exact current implementation. For the actual schema, refer to `/prisma/schema.prisma`.

#### CarbonCredit Model
```prisma
model CarbonCredit {
  id        String   @id @default(cuid())
  userId    String   @unique
  balance   Float    @default(0)
  earned    Float    @default(0)  // Lifetime total earned
  spent     Float    @default(0)  // Lifetime total spent
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

#### CarbonTransaction Model
```prisma
model CarbonTransaction {
  id          String            @id @default(cuid())
  creditId    String
  userId      String
  amount      Float
  type        TransactionType
  reason      String?
  metadata    Json?             // Additional data (booking ID, order ID, etc.)
  createdAt   DateTime          @default(now())
  credit      CarbonCredit      @relation(fields: [creditId], references: [id])
  user        User              @relation(fields: [userId], references: [id])
}

enum TransactionType {
  EARN
  SPEND
  TRANSFER_IN
  TRANSFER_OUT
  ADMIN_ADJUST
}
```

### Carbon Footprint Calculation

#### Travel Emissions
```typescript
// Emission factors (kg CO2 per km)
const emissionFactors = {
  car: 0.171,
  bus: 0.089,
  train: 0.041,
  flight_domestic: 0.255,
  flight_international: 0.195,
  bike: 0,
  walk: 0,
};

function calculateTravelEmissions(
  distance: number,
  mode: string
): number {
  return distance * emissionFactors[mode];
}
```

#### Accommodation Emissions
```typescript
// Average kg CO2 per night
const homestayEmission = 5.0;  // Low-impact homestay
const hotelEmission = 20.0;     // Standard hotel

function calculateAccommodationEmissions(
  nights: number,
  type: string
): number {
  return nights * (type === 'homestay' ? homestayEmission : hotelEmission);
}
```

#### Product Carbon Footprint
- Stored per product in database
- Calculated during purchase
- Added to transaction metadata

### Gamification & Achievements

#### Carbon Credit Milestones
- **Bronze**: 100 credits earned
- **Silver**: 500 credits earned
- **Gold**: 1,000 credits earned
- **Platinum**: 5,000 credits earned
- **Diamond**: 10,000 credits earned

#### Special Badges
- **Carbon Neutral**: Offset all personal emissions
- **Tree Hugger**: Plant 10 trees via credits
- **Green Warrior**: Top 10% of credit earners
- **Eco Pioneer**: First to reach platinum
- **Sustainability Champion**: Community voted

### Integration Points

#### Booking System
- Calculate footprint on booking
- Award credits for eco-friendly choices
- Display offset cost
- Offer offset at checkout

#### Marketplace
- Product carbon footprint display
- Credits earned from sustainable purchases
- Spend credits for discounts
- Carbon-neutral product badges

#### Community Projects
- Spend credits to fund projects
- Earn bonus credits for project contributions
- Transparent impact tracking
- Project completion rewards

---

## Marketplace Management

### Product Management (FR7.6)

#### Product CRUD Operations
**Location**: `/admin-panel/marketplace/products`

**Features**:
- Create new products
- Edit existing products
- Delete products
- Bulk operations
- Import/export

**Product Fields**:
- Basic info (name, description, SKU)
- Pricing (base price, sale price, discounts)
- Inventory (stock, low stock alert)
- Images (multiple, sortable)
- Categories and tags
- Carbon footprint
- Shipping info
- SEO metadata

**Product Types**:
- Physical products
- Digital products
- Services
- Subscriptions (future)

#### Stock Management
- Real-time inventory tracking
- Low stock alerts
- Out of stock notifications
- Automatic stock deduction on orders
- Manual stock adjustments
- Stock history log

### Order Management (FR7.5)

#### Order Dashboard
**Location**: `/admin-panel/marketplace/orders`

**Features**:
- View all orders
- Filter by status
- Search by order ID, customer, product
- Sort by date, amount, status
- Bulk status updates

**Order Statuses**:
- PENDING - Awaiting payment
- CONFIRMED - Payment received
- PROCESSING - Being prepared
- SHIPPED - In transit
- DELIVERED - Completed
- CANCELLED - Cancelled by user/admin
- REFUNDED - Refund processed

#### Order Details
- Customer information
- Ordered items
- Pricing breakdown
- Payment details
- Shipping address
- Order timeline
- Status history
- Admin notes

#### Order Actions
- Update status
- Add tracking info
- Process refund
- Add admin notes
- Contact customer
- Cancel order
- Generate invoice

### Seller Management (Future)

#### Multi-Vendor Support
- Seller registration/approval
- Commission tracking
- Payout management
- Seller dashboard
- Performance metrics

### Category Management (Future)

#### Hierarchical Categories
- Main categories
- Subcategories (3 levels deep)
- Category images
- Category descriptions
- SEO optimization

---

## User Management System

### User Management (FR7.2)

#### User Dashboard
**Location**: `/admin-panel/users`

**Features**:
- Complete user list
- Advanced search
- Role-based filtering
- Status filtering
- Bulk operations
- CSV export

**User Fields**:
- Personal info (name, email, phone)
- Role (7 roles available)
- Status (active/inactive)
- Verification status
- Join date
- Last login
- Avatar

**Bulk Actions**:
- Change role
- Activate/deactivate
- Send email
- Delete users
- Export selected

#### User Creation
**Features**:
- Manual user creation by admin
- Auto-password generation
- Custom password option
- Optional welcome email
- Role assignment on creation
- Email verification bypass

**Form Fields**:
- Email (required, validated)
- Name (required)
- Role (dropdown, default: GUEST)
- Auto-generate password (checkbox)
- Send welcome email (checkbox)

**Welcome Email**:
- Personalized greeting
- Login credentials (if auto-generated)
- Getting started guide
- Platform overview
- Support contact info

#### User Editing
**Features**:
- Edit all user fields
- Change role
- Reset password
- Toggle status
- Verify email manually
- Delete user

**Activity Tracking** (Future):
- Login history
- Actions performed
- Content created
- Bookings made
- Orders placed

### Role-Based Access Control (RBAC)

#### Available Roles
1. **GUEST** - Default, limited access
2. **USER** - Registered, full user features
3. **HOST** - Homestay management
4. **SELLER** - Product selling
5. **OPERATOR** - System operations
6. **VILLAGE_COUNCIL** - Community governance
7. **ADMIN** - Full system access

#### Role Permissions
- Defined in `/lib/auth/rbac.ts`
- Hierarchical permission inheritance
- Feature-specific permissions
- API endpoint protection
- UI component visibility

---

## Media & Content Management

### Media Library (FR7.3)

#### Media Manager
**Location**: `/admin-panel/media`

**Features**:
- Grid/list view toggle
- Image upload (drag & drop)
- Multiple file upload
- File preview
- File details editor
- Bulk delete
- Search and filter

**File Types Supported**:
- Images: JPG, PNG, WebP, GIF, SVG
- Videos: MP4, WebM
- Documents: PDF
- Archives: ZIP

**Image Processing**:
- Automatic resizing
- WebP conversion
- Thumbnail generation
- Quality optimization
- Metadata extraction

**Storage Options**:
- Local filesystem
- Cloudinary
- AWS S3
- IPFS (future)

### Content Editor (FR7.3)

#### Dynamic Content Blocks
**Features**:
- Drag & drop block arrangement
- 12 block types available
- Live preview
- Responsive design
- SEO optimization

**Block Types**:
1. TEXT - Rich text editor
2. IMAGE - Image with caption
3. HERO - Hero banner
4. VIDEO - Embedded video
5. CTA - Call-to-action
6. STATS - Statistics display
7. GRID - Multi-column layout
8. CAROUSEL - Image slider
9. TESTIMONIAL - Customer quotes
10. FAQ - Accordion Q&A
11. FORM - Custom forms
12. MAP - Interactive map

---

## IoT & Environmental Monitoring

### Device Management (FR7.8)

#### IoT Dashboard
**Location**: Admin Panel > IoT Devices (tab)

**Features**:
- Device registration
- Device status monitoring
- Telemetry visualization
- Alert configuration
- Device grouping
- Firmware management (future)

**Device Types Supported**:
- Air quality sensors
- Energy meters
- Solar panels
- Weather stations
- Water sensors
- Motion sensors
- Cameras
- Microphones

### Real-Time Monitoring

#### Telemetry Dashboard
- Live sensor readings
- Historical data charts
- Alert notifications
- Data export
- Custom dashboards

#### Alert System
- Threshold-based alerts
- Email notifications
- Admin panel alerts
- Configurable rules
- Alert history

---

## Booking & Homestay Management

### Booking Management (FR7.4)

#### Booking Dashboard
**Features**:
- View all bookings
- Filter by status
- Search by guest/homestay
- Calendar view
- Status updates

#### Booking Statuses
- PENDING - Awaiting confirmation
- CONFIRMED - Confirmed reservation
- CHECKED_IN - Guest checked in
- CHECKED_OUT - Completed
- CANCELLED - Cancelled

### Dynamic Pricing (Implemented)

#### Pricing Engine
**Location**: `/lib/pricing-engine.ts`

**Features**:
- Base price per homestay
- Weekend multipliers
- Holiday multipliers
- Seasonal adjustments
- Occupancy-based pricing
- Discount rules:
  - Early bird (book 30+ days ahead)
  - Last minute (book <7 days ahead)
  - Length of stay (7+ nights)

**Example**:
```typescript
// 90% occupancy = 30% price increase
// Weekend = 20% increase
// Early bird 30+ days = 15% discount
```

---

## System Configuration & Control

### Control Center (FR7.9-FR7.12)

#### WordPress-Style Control Center
**Location**: `/admin-panel/control-center`

**Tabs Available**:
1. **Features**: Toggle platform features on/off
2. **Branding**: Logo, colors, fonts
3. **Theme**: Visual theme customization
4. **SEO**: Meta tags, sitemap, robots.txt
5. **API Keys**: External service integration

#### Feature Toggles
- Enable/disable Web3
- Enable/disable Blockchain logging
- Enable/disable Drone simulation
- Enable/disable IoT features
- Enable/disable specific modules

#### Branding Manager
- Upload logo
- Set primary colors
- Configure fonts
- Custom CSS
- Favicon management

#### SEO Controls
- Site title and description
- Open Graph tags
- Twitter Card tags
- JSON-LD structured data
- Sitemap generation
- Robots.txt configuration

---

## Analytics & Reporting

### Analytics Dashboard (FR7.15)

#### Business Metrics
- Total revenue
- Booking conversion rate
- Product sales
- User growth
- Active users
- Carbon credits stats

#### Platform Metrics
- Page views
- API requests
- Error rates
- Response times
- Uptime

#### Export Capabilities
- CSV reports
- PDF reports
- Scheduled reports (future)
- Custom date ranges

---

## Navigation & Accessibility

### Admin Panel Navigation

#### Sidebar Structure
```
Main
├── Dashboard
└── User Management

Operations
├── Booking Management
├── Reviews & Complaints
└── Carbon Credits

Commerce
├── Marketplace Admin
└── Product Management

Content
├── Content Editor
├── Page Manager
└── Media Manager

Monitoring
├── IoT Devices
└── Analytics

Settings
├── Control Center
├── Theme Customizer
└── System Settings
```

#### Navigation Features
- Collapsible sidebar
- Active page highlighting
- Icon-based recognition
- Mobile responsive
- Quick search (future)

### Accessibility Features

#### WCAG 2.1 AA Compliance
- Keyboard navigation
- Screen reader support
- High contrast mode
- Focus indicators
- ARIA labels
- Alt text for images

#### Multi-language Support
- English (EN)
- Hindi (HI)
- Language switcher
- RTL support (future)
- Translated UI strings

---

## Implementation Status

### ✅ Fully Implemented Features
- Carbon credit system (all 12 requirements)
- Admin panel navigation
- User management
- Product management
- Order management
- Media library
- Content editor
- IoT device management
- Booking system
- Control center
- Analytics dashboard
- Role-based access control

### 🚧 Partially Implemented
- Advanced search (basic version)
- Bulk operations (limited)
- Export capabilities (basic)
- Alert system (basic)

### 📋 Planned Features
- Seller management
- Category management (hierarchical)
- CSV import/export
- Activity tracking
- Scheduled reports
- Advanced analytics
- Mobile apps
- Real-time chat
- Video calls

---

## API Endpoints Summary

### Admin APIs (62 endpoints)
- /api/admin/stats
- /api/admin/users (CRUD)
- /api/admin/content (CRUD)
- /api/admin/bookings (CRUD)
- /api/admin/orders (CRUD)
- /api/admin/products (CRUD)
- /api/admin/reviews (CRUD)
- /api/admin/devices (CRUD)
- /api/admin/carbon/* (4 endpoints)
- /api/admin/settings (CRUD)
- /api/admin/theme (CRUD)
- /api/admin/seo (CRUD)
- /api/admin/features (CRUD)
- /api/admin/backup
- /api/admin/activity
- ... and more

### User APIs (15 endpoints)
- /api/user/profile
- /api/user/bookings
- /api/user/orders
- /api/user/wishlist
- /api/user/carbon-credits
- /api/user/achievements
- /api/user/articles
- /api/user/complaints
- /api/user/notifications
- /api/user/reviews
- ... and more

### Public APIs (10 endpoints)
- /api/health
- /api/village/info
- /api/public/homestays
- /api/public/products
- /api/public/testimonials
- ... and more

---

## Security & Privacy

### Security Features
- Argon2 password hashing
- JWT session tokens
- HTTPS enforcement
- Security headers
- Rate limiting (ready)
- Input validation
- SQL injection prevention
- XSS protection
- CSRF protection

### Privacy Features
- GDPR compliance (ready)
- Data export
- Account deletion
- Cookie consent
- Privacy policy
- Terms of service

---

## Deployment & DevOps

### Deployment Platforms
- CapRover (configured)
- Coolify (configured)
- Docker (containerized)
- Vercel (compatible)

### CI/CD
- Automated testing
- Lint checks
- Build verification
- Health checks
- Rollback capability

---

## Success Metrics

### Business KPIs
- User registrations
- Booking conversions
- Product sales
- Carbon credits earned
- Community engagement

### Technical KPIs
- 99.9% uptime
- <500ms API response
- <3s page load
- 0 critical security issues
- >80% test coverage

---

**Document Version**: 2.0  
**Last Updated**: 2025-10-19  
**Maintained By**: Development Team  
**Status**: Living Document (Continuously Updated)

---

This document should be used in conjunction with REQUIREMENTS.md for complete project specifications. All features listed here are either implemented or planned for implementation.
