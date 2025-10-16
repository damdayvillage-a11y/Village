# Admin Panel v2.0 - UI Layout

## Desktop View (≥1024px)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  [≡] [🛡️] Admin Panel                          [🔔] John Doe (ADMIN) [→]    │
│       Damday Village                                                         │
├──────────┬──────────────────────────────────────────────────────────────────┤
│          │  [🏠] Home > Admin > Dashboard                                    │
│  MAIN    │                                                                   │
│  ─────   │  ┌────────────┐ ┌────────────┐ ┌────────────┐ ┌────────────┐   │
│  ► Dash  │  │ 👥 Users   │ │ 📅 Bookings│ │ 💰 Revenue │ │ ❤️  Health  │   │
│  • Users │  │    147     │ │     23     │ │   ₹45,000  │ │   Healthy  │   │
│          │  └────────────┘ └────────────┘ └────────────┘ └────────────┘   │
│  OPS     │                                                                   │
│  ─────   │  ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐                   │
│  • Book  │  │📦 45   │ │🛒 12   │ │📝 8    │ │🔌 32   │                   │
│  • Review│  │Products│ │Orders  │ │Reviews │ │Devices │                   │
│          │  └────────┘ └────────┘ └────────┘ └────────┘                   │
│ COMMERCE │                                                                   │
│  ─────   │  ┌───────────────────┐  ┌──────────────────────────────────┐   │
│  • Market│  │ Quick Actions     │  │ Recent Activity         [🔄]     │   │
│  • Prod  │  │ ┌───────────────┐ │  │ • New booking by Alice           │   │
│          │  │ │ ✏️  Edit Home │ │  │ • John registered as HOST        │   │
│ CONTENT  │  │ │ 👥 Users      │ │  │ • Product added: Honey           │   │
│  ─────   │  │ │ 📝 Reviews    │ │  │ • 5-star review from Bob         │   │
│  • Editor│  │ │ 🎨 Theme      │ │  │ • Order #1234 delivered          │   │
│  • Pages │  │ └───────────────┘ │  │                                   │   │
│  • Media │  └───────────────────┘  │ Last updated: 14:32:15          │   │
│          │                          └──────────────────────────────────┘   │
│ MONITOR  │                                                                   │
│  ─────   │                                                                   │
│  • Device│                                                                   │
│  • Analyt│                                                                   │
│          │                                                                   │
│ SETTINGS │                                                                   │
│  ─────   │                                                                   │
│  • Theme │                                                                   │
│  • System│                                                                   │
│          │                                                                   │
└──────────┴──────────────────────────────────────────────────────────────────┘
```

## Mobile View (<1024px) - Sidebar Collapsed

```
┌─────────────────────────────────────────────┐
│ [≡] [🛡️] Admin Panel      [🔔] JD [→]      │
├─────────────────────────────────────────────┤
│ [🏠] > Admin > Dashboard                    │
│                                             │
│ ┌─────────────────────────────────────────┐ │
│ │ 👥 Users                                │ │
│ │ 147                                     │ │
│ └─────────────────────────────────────────┘ │
│                                             │
│ ┌─────────────────────────────────────────┐ │
│ │ 📅 Active Bookings                      │ │
│ │ 23                                      │ │
│ └─────────────────────────────────────────┘ │
│                                             │
│ ┌─────────────────────────────────────────┐ │
│ │ 💰 Revenue                              │ │
│ │ ₹45,000                                 │ │
│ └─────────────────────────────────────────┘ │
│                                             │
│ ┌─────────────────────────────────────────┐ │
│ │ ❤️ System Health                        │ │
│ │ Healthy                                 │ │
│ └─────────────────────────────────────────┘ │
│                                             │
│ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐       │
│ │📦 45 │ │🛒 12 │ │📝 8  │ │🔌 32 │       │
│ └──────┘ └──────┘ └──────┘ └──────┘       │
│                                             │
│ [Quick Actions]                             │
│ [Recent Activity]                           │
│                                             │
└─────────────────────────────────────────────┘
```

## Mobile View - Sidebar Open

```
┌─────────────────────────┬───────────────────┐
│ [×]                     │ ░░░░░░░░░░░░░░░░░ │
│                         │ ░░░░░░░░░░░░░░░░░ │
│ MAIN                    │ ░░░░ Overlay ░░░░ │
│ ──────────────────      │ ░░░░░░░░░░░░░░░░░ │
│ ► Dashboard             │ ░░░░░░░░░░░░░░░░░ │
│ • User Management       │ ░░░░░░░░░░░░░░░░░ │
│                         │ ░░░░░░░░░░░░░░░░░ │
│ OPERATIONS              │ ░░░░░░░░░░░░░░░░░ │
│ ──────────────────      │ ░░░░░░░░░░░░░░░░░ │
│ • Booking Management    │ ░░░░░░░░░░░░░░░░░ │
│ • Reviews & Complaints  │ ░░░░░░░░░░░░░░░░░ │
│                         │ ░░░░░░░░░░░░░░░░░ │
│ COMMERCE                │ ░░░░░░░░░░░░░░░░░ │
│ ──────────────────      │ ░░░░░░░░░░░░░░░░░ │
│ • Marketplace Admin     │ ░░░░░░░░░░░░░░░░░ │
│ • Product Management    │ ░░░░░░░░░░░░░░░░░ │
│                         │ ░░░░░░░░░░░░░░░░░ │
│ CONTENT                 │ ░░░░░░░░░░░░░░░░░ │
│ ──────────────────      │ ░░░░░░░░░░░░░░░░░ │
│ • Content Editor        │ ░░░░░░░░░░░░░░░░░ │
│ • Page Manager          │ ░░░░░░░░░░░░░░░░░ │
│ • Media Manager         │ ░░░░░░░░░░░░░░░░░ │
│                         │ ░░░░░░░░░░░░░░░░░ │
│ MONITORING              │ ░░░░░░░░░░░░░░░░░ │
│ ──────────────────      │ ░░░░░░░░░░░░░░░░░ │
│ • IoT Devices           │ ░░░░░░░░░░░░░░░░░ │
│ • Analytics             │ ░░░░░░░░░░░░░░░░░ │
│                         │ ░░░░░░░░░░░░░░░░░ │
│ SETTINGS                │ ░░░░░░░░░░░░░░░░░ │
│ ──────────────────      │ ░░░░░░░░░░░░░░░░░ │
│ • Theme Customizer      │ ░░░░░░░░░░░░░░░░░ │
│ • System Settings       │ ░░░░░░░░░░░░░░░░░ │
└─────────────────────────┴───────────────────┘
```

## Marketplace Admin Page

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  [≡] [🛡️] Admin Panel                          [🔔] John Doe (ADMIN) [→]    │
├──────────┬──────────────────────────────────────────────────────────────────┤
│ SIDEBAR  │  [🏠] > Admin > Marketplace Admin                                 │
│          │                                                                   │
│ ► Market │  Marketplace Admin                                                │
│          │  Manage products, orders, and sellers                             │
│          │                                                                   │
│          │  ┌──────────────────┐ ┌──────────────────┐ ┌──────────────────┐ │
│          │  │ 📦 Products      │ │ 🛒 Orders        │ │ 💰 Revenue       │ │
│          │  │                  │ │                  │ │                  │ │
│          │  │       45         │ │       12         │ │     ₹45,000      │ │
│          │  │ Total products   │ │ Pending orders   │ │ Total revenue    │ │
│          │  │   listed         │ │                  │ │                  │ │
│          │  └──────────────────┘ └──────────────────┘ └──────────────────┘ │
│          │                                                                   │
│          │  ┌─────────────────────────────────────────────────────────────┐ │
│          │  │ Recent Orders                                                │ │
│          │  │                                                              │ │
│          │  │  Order management interface coming soon...                   │ │
│          │  │                                                              │ │
│          │  └─────────────────────────────────────────────────────────────┘ │
└──────────┴──────────────────────────────────────────────────────────────────┘
```

## IoT Device Management Page

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  [≡] [🛡️] Admin Panel                          [🔔] John Doe (ADMIN) [→]    │
├──────────┬──────────────────────────────────────────────────────────────────┤
│ SIDEBAR  │  [🏠] > Admin > IoT Devices                                       │
│          │                                                                   │
│ ► Device │  IoT Device Management                                            │
│          │  Monitor and manage village IoT devices                           │
│          │                                                                   │
│          │  ┌──────────────────┐ ┌──────────────────┐ ┌──────────────────┐ │
│          │  │ 🟢 Online        │ │ ❤️  Health       │ │ 🔔 Alerts        │ │
│          │  │                  │ │                  │ │                  │ │
│          │  │       32         │ │    Healthy       │ │        0         │ │
│          │  │ Devices currently│ │ Overall system   │ │ Active alerts    │ │
│          │  │    online        │ │     status       │ │                  │ │
│          │  └──────────────────┘ └──────────────────┘ └──────────────────┘ │
│          │                                                                   │
│          │  ┌─────────────────────────────────────────────────────────────┐ │
│          │  │ Device List                                                  │ │
│          │  │                                                              │ │
│          │  │  Device monitoring interface coming soon...                  │ │
│          │  │                                                              │ │
│          │  └─────────────────────────────────────────────────────────────┘ │
└──────────┴──────────────────────────────────────────────────────────────────┘
```

## Header Components Breakdown

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ [≡]  [🛡️] Admin Panel              [🔔·]  [JD ▼]  John Doe  [→ Logout]      │
│  │    │    │                         │      │      │ ADMIN                  │
│  │    │    └─ Title                  │      │      └─ User info             │
│  │    └────── Logo                   │      └──────── Avatar                │
│  └─────────── Menu (mobile)          └─────────────── Notifications         │
└─────────────────────────────────────────────────────────────────────────────┘
```

## Sidebar Section Groups

```
┌────────────────────┐
│ MAIN               │  Core admin functions
│ ────────────────   │
│ ► Dashboard        │
│ • Users            │
├────────────────────┤
│ OPERATIONS         │  Daily operations
│ ────────────────   │
│ • Bookings         │
│ • Reviews          │
├────────────────────┤
│ COMMERCE           │  E-commerce features
│ ────────────────   │
│ • Marketplace      │
│ • Products         │
├────────────────────┤
│ CONTENT            │  Content management
│ ────────────────   │
│ • Editor           │
│ • Pages            │
│ • Media            │
├────────────────────┤
│ MONITORING         │  System monitoring
│ ────────────────   │
│ • Devices          │
│ • Analytics        │
├────────────────────┤
│ SETTINGS           │  Configuration
│ ────────────────   │
│ • Theme            │
│ • System           │
└────────────────────┘
```

## Color Palette

```
┌────────────────────────────────────────────┐
│ Primary (Blue)     #3B82F6  ████████████  │
│ Success (Green)    #10B981  ████████████  │
│ Warning (Yellow)   #F59E0B  ████████████  │
│ Error (Red)        #EF4444  ████████████  │
│ Info (Purple)      #8B5CF6  ████████████  │
│ Secondary (Orange) #F97316  ████████████  │
│ Accent (Cyan)      #06B6D4  ████████████  │
│ Gray Scale         #6B7280  ████████████  │
└────────────────────────────────────────────┘
```

## Icon Legend

```
🛡️  Shield - Admin/Security
👥  Users - User Management
📅  Calendar - Bookings
💰  Money - Revenue/Finance
❤️   Heart - Health Status
📦  Package - Products
🛒  Cart - Orders
📝  Note - Reviews/Content
🔌  Plug - Devices/IoT
🔔  Bell - Notifications
🏠  Home - Homepage/Dashboard
✏️  Edit - Content Editor
🎨  Palette - Theme
⚙️  Gear - Settings
📊  Chart - Analytics
🔄  Refresh - Auto-refresh
→  Arrow - Logout
≡  Menu - Hamburger
×  X - Close
🟢  Green dot - Online
🔴  Red dot - Offline
```

## Stat Card Anatomy

```
┌──────────────────────────────┐
│ ┌───┐                        │
│ │ 👥│  Total Users            │  ← Title (gray)
│ └───┘                        │  ← Icon (colored bg)
│                              │
│      147                     │  ← Value (large, bold)
│                              │
└──────────────────────────────┘
     ↑
   Hover effect (shadow increase)
```

## Mini Stat Card

```
┌──────────────┐
│              │
│  📦  45      │  ← Icon + Value
│  Products    │  ← Label
│              │
└──────────────┘
```

---

**Legend:**
- `►` Active/selected item
- `•` Regular menu item
- `🟢` Status indicator (online/healthy)
- `🔴` Status indicator (offline/error)
- `░` Overlay background (semi-transparent)
- `─` Section divider

**Responsive:**
- Desktop (≥1024px): Full layout with sidebar
- Tablet (640-1023px): Collapsed sidebar
- Mobile (<640px): Hidden sidebar, hamburger menu
