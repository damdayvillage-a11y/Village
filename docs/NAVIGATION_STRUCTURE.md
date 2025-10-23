# Admin Panel Navigation Structure

This document shows the complete navigation structure of the admin panel after the fixes.

## Navigation Menu (33 Items)

### 📊 Main (3 items)
- **Dashboard** - `/admin-panel`
- **User Management** - `/admin-panel/users`
- **Leadership** - `/admin-panel/leadership`

### ⚙️ Operations (4 items)
- **Booking Calendar** - `/admin-panel/bookings/calendar`
- **Availability** - `/admin-panel/bookings/availability`
- **Booking Analytics** - `/admin-panel/bookings/analytics` ✨ *NEW*
- **Carbon Credits** - `/admin-panel/carbon-credits`

### 🛒 Commerce (4 items)
- **Orders** - `/admin-panel/marketplace/orders`
- **Products** - `/admin-panel/marketplace/products`
- **Categories** - `/admin-panel/marketplace/categories` ✨ *NEW*
- **Sellers** - `/admin-panel/marketplace/sellers`

### 📝 Content Management (5 items)
- **Homepage Editor** - `/admin-panel/homepage-editor`
- **Page Builder** - `/admin-panel/cms/page-builder`
- **Navigation** - `/admin-panel/cms/navigation`
- **SEO Settings** - `/admin-panel/cms/seo`
- **Media Library** - `/admin-panel/media`

### 📈 Monitoring (7 items)
- **IoT Devices** - `/admin-panel/iot/devices`
- **Telemetry** - `/admin-panel/iot/telemetry`
- **IoT Alerts** - `/admin-panel/iot/alerts` ✨ *NEW*
- **System Monitor** - `/admin-panel/monitoring`
- **Analytics** - `/admin-panel/analytics`
- **Reports** - `/admin-panel/reports` ✨ *NEW*
- **Activity Logs** - `/admin-panel/activity-logs`

### 🚀 Projects (2 items)
- **Projects** - `/admin-panel/projects`
- **Project Funds** - `/admin-panel/projects/funds`

### ⚙️ Settings (8 items)
- **Control Center** - `/admin-panel/control-center`
- **Settings** - `/admin-panel/settings`
- **Features** - `/admin-panel/settings/features` ✨ *NEW*
- **Email Templates** - `/admin-panel/settings/email-templates` ✨ *NEW*
- **Theme** - `/admin-panel/cms/theme`
- **Advanced Theme** - `/admin-panel/settings/theme/advanced` ✨ *NEW*
- **Branding** - `/admin-panel/settings/branding`
- **System Status** - `/admin-panel/status`

## Summary

- **Total Navigation Items**: 33
- **Newly Added**: 7 items (marked with ✨)
- **Fixed**: Page Manager now correctly links to Page Builder
- **Enhanced**: Homepage Editor now accessible from main dashboard

## Access

All navigation items are accessible through:
1. **Unified Sidebar** - Available on all admin pages using `AdminPanelLayout`
2. **Main Dashboard** - Available at `/admin-panel` with tab navigation
3. **Direct URLs** - All pages can be accessed directly via their URLs

## Navigation Components

### AdminPanelLayout (`lib/components/admin-panel/AdminPanelLayout.tsx`)
- Used by individual admin pages
- Provides consistent sidebar navigation
- Responsive design with mobile support
- Breadcrumb navigation
- User profile menu

### Main Admin Panel (`src/app/admin-panel/page.tsx`)
- Central dashboard with statistics
- Tab-based navigation for key features
- Links to specialized admin pages

## Note

Some pages in the main admin panel use tab-based navigation for features that are rendered as components (e.g., Content Editor, Theme Customizer). These are integrated into the dashboard itself rather than separate pages.
