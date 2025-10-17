# Admin Panel v2.0 - Quick Reference

## 🚀 Quick Start

### Access the Admin Panel
```
URL: /admin-panel
Login: admin@damdayvillage.org / Admin@123
```

### Logout
Click the logout button (→) in the top-right corner of the header.

## 📱 Navigation

### Desktop (≥1024px)
- Sidebar always visible on the left
- Click any menu item to navigate
- Active item highlighted in blue

### Mobile (<1024px)
- Tap hamburger menu (≡) to open sidebar
- Tap overlay or X to close
- Sidebar slides from left with smooth animation

## 📊 Dashboard Features

### Primary Stats (Top Row)
1. **Total Users** (Blue) - All registered users
2. **Active Bookings** (Green) - Current and upcoming bookings
3. **Revenue** (Purple) - Total earnings
4. **System Health** (Dynamic) - IoT device status

### Secondary Stats (Bottom Row)
1. **Products** - Total marketplace items
2. **Pending Orders** - Orders awaiting fulfillment
3. **Pending Reviews** - Recent reviews (last 7 days)
4. **Online Devices** - Currently connected IoT devices

### Auto-Refresh
- Toggle: Checkbox in Activity Feed header
- Intervals: 10s, 30s, 1m, 5m
- Manual: Click refresh button (🔄)
- Last Update: Shown below Activity Feed title

## 🗺️ Navigation Sections

### MAIN
- **Dashboard** - Overview and stats
- **User Management** - Manage all users

### OPERATIONS  
- **Booking Management** - View and manage bookings
- **Reviews & Complaints** - Moderate reviews

### COMMERCE
- **Marketplace Admin** - Overview of products and orders
- **Product Management** - Manage individual products

### CONTENT
- **Content Editor** - Edit homepage content
- **Page Manager** - Manage static pages (coming soon)
- **Media Manager** - Upload and manage files (coming soon)

### MONITORING
- **IoT Devices** - Monitor village devices
- **Analytics** - View charts and reports (coming soon)

### SETTINGS
- **Theme Customizer** - Customize appearance (coming soon)
- **System Settings** - Configure system (coming soon)

## 🔧 Key Features

### Header Bar
- **Logo**: Damday Village branding
- **Notifications**: Bell icon with badge (pending reviews count)
- **User Profile**: Shows name, role, and avatar
- **Logout**: Secure logout with redirect

### Breadcrumbs
Shows your current location:
```
Home > Admin > [Current Page]
```

### Activity Feed
Real-time feed showing:
- User registrations
- Booking updates
- Order status changes
- Product additions
- Review submissions

Sorted by most recent first, shows last 20 activities.

## 🎨 Color Coding

- **Blue** (#3B82F6) - Users, primary actions
- **Green** (#10B981) - Bookings, success states, healthy
- **Purple** (#8B5CF6) - Revenue, commerce
- **Yellow** (#F59E0B) - Warnings, pending reviews
- **Red** (#EF4444) - Errors, critical alerts
- **Orange** (#F97316) - Orders
- **Cyan** (#06B6D4) - Devices, IoT

## 📝 API Endpoints

### Statistics
```
GET /api/admin/stats
```
Returns all dashboard statistics.

### Activity Feed
```
GET /api/admin/activity
```
Returns recent activities from all sources.

### Users
```
GET    /api/admin/users          - List users
POST   /api/admin/users          - Create user
PATCH  /api/admin/users          - Update user
DELETE /api/admin/users?id=...   - Delete user
```

### Content
```
GET    /api/admin/content        - List content blocks
POST   /api/admin/content        - Create content
PUT    /api/admin/content        - Update content
DELETE /api/admin/content?id=... - Delete content
```

### Bookings
```
GET   /api/admin/bookings        - List bookings
PATCH /api/admin/bookings        - Update booking status
```

### Reviews
```
GET    /api/admin/reviews          - List reviews
PATCH  /api/admin/reviews          - Update review
DELETE /api/admin/reviews?id=...   - Delete review
```

### Products ⭐ NEW
```
GET    /api/admin/products         - List products
POST   /api/admin/products         - Create product
PATCH  /api/admin/products         - Update product
DELETE /api/admin/products?id=...  - Delete product
```

### Orders ⭐ NEW
```
GET   /api/admin/orders           - List orders
PATCH /api/admin/orders           - Update order status
```

### Devices ⭐ NEW
```
GET    /api/admin/devices          - List devices
POST   /api/admin/devices          - Add device
PATCH  /api/admin/devices          - Update device
DELETE /api/admin/devices?id=...   - Delete device
```

## 🔐 Security

### Authentication
- All routes require valid NextAuth session
- Admin or Village Council role required
- Unauthorized users redirected to login

### Authorization
Each API endpoint verifies:
1. Valid session exists
2. User has admin or council role
3. Returns 401 (Unauthorized) or 403 (Forbidden) if not

### Logout
- Uses NextAuth `signOut()`
- Clears session cookies
- Redirects to `/admin-panel/login`

## 📱 Mobile Tips

### Best Practices
1. Use landscape mode for better dashboard view
2. Tap and hold to see hover states
3. Swipe sidebar open/closed
4. Use native browser back button

### Touch Targets
All buttons and links have minimum 44x44px touch area for easy tapping.

## 🎯 Common Tasks

### Add a New User
1. Navigate to User Management
2. Click "Add User" button
3. Fill in required fields
4. Select role
5. Click "Save"

### Moderate a Review
1. Navigate to Reviews & Complaints
2. Find the review
3. Click actions menu
4. Choose: Approve, Delete, or Respond

### Update Booking Status
1. Navigate to Booking Management
2. Find the booking
3. Select new status
4. Confirm change

### View Product List
1. Navigate to Marketplace Admin
2. Click "View Products"
3. Use search and filters
4. Edit or delete as needed

### Monitor IoT Devices
1. Navigate to IoT Devices
2. View online/offline status
3. Click device for details
4. Update configuration if needed

## ⚡ Keyboard Shortcuts

Coming soon in future update!

## 🆘 Troubleshooting

### Can't See Stats
1. Check if you're logged in
2. Verify admin/council role
3. Refresh page
4. Check browser console for errors

### Activity Feed Not Updating
1. Check auto-refresh toggle
2. Verify internet connection
3. Click manual refresh button
4. Check database connection

### Sidebar Won't Close (Mobile)
1. Tap overlay background
2. Tap X button
3. Reload page if stuck

### Logout Not Working
1. Clear browser cache
2. Try different browser
3. Check network connection
4. Contact system admin

## 📈 Performance Tips

### For Best Performance
- Use modern browser (Chrome, Firefox, Safari, Edge)
- Clear cache regularly
- Disable unnecessary browser extensions
- Use wired/stable internet connection

### Recommended Auto-Refresh
- Development: 10-30s
- Production: 1-5m
- Heavy load: Disable auto-refresh

## 📚 Documentation

### Full Documentation
- **adminpanel.md** - Complete implementation guide
- **ADMIN_PANEL_V2_SUMMARY.md** - Feature summary
- **ADMIN_PANEL_COMPARISON.md** - Before/after comparison
- **ADMIN_PANEL_FEATURE_MATRIX.md** - Feature status
- **ADMIN_PANEL_V2_IMPLEMENTATION.md** - Technical details
- **ADMIN_PANEL_UI_LAYOUT.md** - UI diagrams
- **ADMIN_PANEL_QUICK_REFERENCE.md** - This file

### Getting Help
1. Check documentation first
2. Review error messages
3. Check browser console
4. Contact development team

## 🔄 Version Information

**Current Version**: 2.0.0
**Release Date**: 2025-10-16
**Status**: Production Ready

### What's New in v2.0
✅ Professional header with logout
✅ Organized sidebar (6 sections)
✅ Enhanced dashboard (8 stat cards)
✅ Mobile responsive design
✅ 3 new API endpoints
✅ Marketplace admin interface
✅ IoT device monitoring
✅ Analytics placeholder

### Previous Version (v1.0)
- Basic dashboard
- Real database queries
- User/content management
- Booking/review management

## 🎓 Training Resources

### For Administrators
1. Watch demo video (coming soon)
2. Review this quick reference
3. Practice in test environment
4. Ask questions during training session

### For Developers
1. Read technical documentation
2. Review code in `/src/app/admin-panel/`
3. Check API route files
4. Test locally before deploying

## 🌟 Pro Tips

1. **Use Breadcrumbs**: Always know where you are
2. **Check Activity Feed**: Stay updated on recent changes
3. **Monitor System Health**: Watch for device issues
4. **Regular Logout**: For security, don't stay logged in
5. **Mobile Access**: Admin on-the-go with mobile support
6. **Batch Operations**: Use bulk actions when available
7. **Export Data**: Download reports for offline analysis
8. **Backup Often**: Regular backups prevent data loss

## 📞 Contact & Support

**Technical Issues**: Contact development team
**Feature Requests**: Submit via GitHub issues
**Security Concerns**: Email security team immediately
**Training**: Schedule with admin team

---

**Last Updated**: 2025-10-16
**Version**: 2.0.0
**Author**: Damday Village Development Team
