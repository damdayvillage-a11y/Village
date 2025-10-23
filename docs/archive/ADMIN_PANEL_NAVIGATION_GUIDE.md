# Admin Panel Navigation Integration Guide

## Overview

We've created a unified `AdminPanelLayout` component that provides:
- ✅ Consistent navigation menu across all admin pages
- ✅ Responsive sidebar with mobile support
- ✅ Breadcrumb navigation
- ✅ User profile and logout
- ✅ Quick link to view site

## Already Updated Pages

The following pages have been integrated with the new layout:

1. ✅ `/admin-panel/leadership` - Leadership Management
2. ✅ `/admin-panel/homepage-editor` - Homepage Editor
3. ✅ `/admin-panel/cms/page-builder` - Page Builder

## Navigation Structure

The navigation is organized into 7 sections:

### 1. Main
- Dashboard (`/admin-panel`)
- User Management (`/admin-panel/users`)
- Leadership (`/admin-panel/leadership`) ⭐ NEW

### 2. Operations
- Booking Calendar (`/admin-panel/bookings/calendar`)
- Availability (`/admin-panel/bookings/availability`)
- Carbon Credits (`/admin-panel/carbon-credits`)

### 3. Commerce
- Orders (`/admin-panel/marketplace/orders`)
- Products (`/admin-panel/marketplace/products`)
- Sellers (`/admin-panel/marketplace/sellers`)

### 4. Content
- Homepage Editor (`/admin-panel/homepage-editor`) ⭐ INTEGRATED
- Page Builder (`/admin-panel/cms/page-builder`) ⭐ INTEGRATED
- Navigation (`/admin-panel/cms/navigation`)
- SEO Settings (`/admin-panel/cms/seo`)
- Media Library (`/admin-panel/media`)

### 5. Monitoring
- IoT Devices (`/admin-panel/iot/devices`)
- Telemetry (`/admin-panel/iot/telemetry`)
- System Monitor (`/admin-panel/monitoring`)
- Analytics (`/admin-panel/analytics`)
- Activity Logs (`/admin-panel/activity-logs`)

### 6. Projects
- Projects (`/admin-panel/projects`)
- Project Funds (`/admin-panel/projects/funds`)

### 7. Settings
- Control Center (`/admin-panel/control-center`)
- Settings (`/admin-panel/settings`)
- Theme (`/admin-panel/cms/theme`)
- Branding (`/admin-panel/settings/branding`)
- System Status (`/admin-panel/status`)

## How to Integrate a Page

To add the layout to an existing admin page:

### Step 1: Add Imports

```tsx
import { useSession } from 'next-auth/react';
import { AdminPanelLayout } from '@/lib/components/admin-panel/AdminPanelLayout';
```

### Step 2: Get Session

```tsx
export default function YourPage() {
  const { data: session } = useSession();
  // ... rest of your component
```

### Step 3: Wrap Content with Layout

**Before:**
```tsx
return (
  <div className="p-8 bg-gray-50 min-h-screen">
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold">Your Page Title</h1>
      <p className="text-gray-600">Your description</p>
      {/* Your content */}
    </div>
  </div>
);
```

**After:**
```tsx
return (
  <AdminPanelLayout
    session={session}
    title="Your Page Title"
    subtitle="Your description"
  >
    <div className="max-w-6xl mx-auto">
      {/* Your content (without title/subtitle) */}
    </div>
  </AdminPanelLayout>
);
```

### Step 4: Remove Duplicate Headers

The layout provides:
- Page title
- Page subtitle
- Breadcrumbs
- Navigation sidebar
- User menu

So remove these from your page content.

## Layout Props

```tsx
interface AdminPanelLayoutProps {
  children: ReactNode;           // Your page content
  session?: any;                 // Next-auth session
  title?: string;                // Page title (optional)
  subtitle?: string;             // Page subtitle (optional)
  showBreadcrumb?: boolean;      // Show breadcrumb (default: true)
}
```

## Example Integration

See these files for examples:
- `/src/app/admin-panel/leadership/page.tsx`
- `/src/app/admin-panel/homepage-editor/page.tsx`
- `/src/app/admin-panel/cms/page-builder/page.tsx`

## Remaining Pages to Update

Priority pages that should be updated:

### High Priority (Core Admin Functions)
- [ ] `/admin-panel/page.tsx` - Main Dashboard
- [ ] `/admin-panel/users/page.tsx` - User Management
- [ ] `/admin-panel/control-center/page.tsx` - Control Center
- [ ] `/admin-panel/settings/page.tsx` - Settings

### Medium Priority (Content Management)
- [ ] `/admin-panel/cms/navigation/page.tsx` - Navigation
- [ ] `/admin-panel/cms/seo/page.tsx` - SEO Settings
- [ ] `/admin-panel/cms/theme/page.tsx` - Theme
- [ ] `/admin-panel/media/page.tsx` - Media Library

### Lower Priority (Specialized Features)
- [ ] All booking pages
- [ ] All marketplace pages
- [ ] All IoT pages
- [ ] All project pages
- [ ] All settings sub-pages

## Benefits of Integration

1. **Consistent UX**: Same navigation and layout across all pages
2. **Mobile Friendly**: Responsive sidebar works on all devices
3. **Quick Navigation**: Easy access to all admin features
4. **Breadcrumbs**: Clear location indicator
5. **Reduced Code**: No need to duplicate navigation logic

## Notes

- The main dashboard (`/admin-panel/page.tsx`) has its own layout - consider keeping it or integrating carefully
- Login page (`/admin-panel/login/page.tsx`) should NOT use this layout
- The layout automatically highlights the active page in navigation
- Breadcrumbs are automatically generated from URL structure

## Testing Checklist

After integrating a page:

- [ ] Navigation shows correct active state
- [ ] Breadcrumbs display correctly
- [ ] Mobile sidebar works (toggle, close on navigation)
- [ ] Page title and subtitle display properly
- [ ] Session/user info shows in header
- [ ] No duplicate headers or navigation elements
- [ ] Content area has proper spacing
- [ ] All functionality works as before

## Support

For issues or questions:
1. Check the example pages mentioned above
2. Review the `AdminPanelLayout` component source
3. Test in browser console for any errors
4. Ensure Next-auth session is available
