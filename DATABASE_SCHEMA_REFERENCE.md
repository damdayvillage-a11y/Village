# Database Schema Quick Reference

**Purpose**: Quick reference for correct field names to use in API endpoints and components.

## Core Models Field Reference

### Homestay Model
```typescript
{
  id: string;
  name: string;
  description: string;
  ownerId: string;
  villageId: string;
  
  // Location
  latitude: number;
  longitude: number;
  address: string;           // ⚠️ Use 'address' NOT 'location'
  
  // Capacity
  rooms: number;
  maxGuests: number;
  amenities: Json;           // Array of amenity codes (JSON field)
  photos: Json;              // ⚠️ Array of photo URLs (JSON field) NOT 'images'
  
  // Pricing
  basePrice: number;         // ⚠️ Use 'basePrice' NOT 'pricePerNight'
  pricingPolicyId?: string;
  
  // Availability
  available: boolean;        // ⚠️ Use 'available' NOT 'status' or 'isApproved'
  calendar?: Json;
  
  // Relations
  owner: User;               // ⚠️ Relation is 'owner' NOT 'host'
  village: Village;
  pricingPolicy?: PricingPolicy;
  bookings: Booking[];
  reviews: Review[];
}
```

**Common Mistakes**:
- ❌ `homestay.location` → ✅ `homestay.address`
- ❌ `homestay.pricePerNight` → ✅ `homestay.basePrice`
- ❌ `homestay.images` → ✅ `homestay.photos` (JSON array)
- ❌ `homestay.isApproved` → ✅ `homestay.available`
- ❌ `homestay.host` → ✅ `homestay.owner`

---

### Booking Model
```typescript
{
  id: string;
  homestayId: string;
  guestId: string;          // ⚠️ Use 'guestId' NOT 'userId'
  
  // Booking window
  checkIn: DateTime;        // ⚠️ Use 'checkIn' NOT 'checkInDate'
  checkOut: DateTime;       // ⚠️ Use 'checkOut' NOT 'checkOutDate'
  guests: number;
  
  // Pricing
  pricing: Json;            // {basePrice, taxes, fees, total}
  
  // Status
  status: BookingStatus;    // PENDING, CONFIRMED, CHECKED_IN, CHECKED_OUT, CANCELLED
  paymentRef?: string;
  
  // Relations
  homestay: Homestay;
  guest: User;
  payments: Payment[];
}
```

**Common Mistakes**:
- ❌ `booking.userId` → ✅ `booking.guestId`
- ❌ `booking.checkInDate` → ✅ `booking.checkIn`
- ❌ `booking.checkOutDate` → ✅ `booking.checkOut`

---

### Product Model
```typescript
{
  id: string;
  name: string;
  description: string;
  sellerId: string;
  category: string;         // String field NOT relation
  
  // Pricing
  price: number;
  currency: string;         // Default: "INR"
  
  // Inventory
  stock: number;
  unlimited: boolean;
  
  // Media
  images: Json;             // ⚠️ Array of image URLs (JSON field)
  
  // Sustainability
  carbonFootprint?: number;
  locallySourced: boolean;
  
  // Status
  active: boolean;          // ⚠️ Use 'active' NOT 'status' or 'featured'
  
  // Relations
  seller: User;
  orderItems: OrderItem[];
  wishlists: Wishlist[];
}
```

**Common Mistakes**:
- ❌ `product.status` → ✅ `product.active` (boolean)
- ❌ `product.featured` → ✅ No such field exists
- ❌ `product.imageUrl` → ✅ `product.images` (JSON array)
- ❌ `product.category.name` → ✅ `product.category` (string)

---

### Order Model
```typescript
{
  id: string;
  customerId: string;       // ⚠️ Use 'customerId' NOT 'userId'
  
  // Order details
  total: number;            // ⚠️ Use 'total' NOT 'totalAmount'
  currency: string;         // Default: "INR"
  status: OrderStatus;      // PENDING, CONFIRMED, PROCESSING, SHIPPED, DELIVERED, CANCELLED, REFUNDED
  
  // Shipping
  shippingAddress: Json;
  
  // Relations
  customer: User;
  items: OrderItem[];
  payments: Payment[];
}
```

**Common Mistakes**:
- ❌ `order.userId` → ✅ `order.customerId`
- ❌ `order.totalAmount` → ✅ `order.total`

---

### User Model
```typescript
{
  id: string;
  email: string;
  name: string;
  role: UserRole;           // ADMIN, HOST, GUEST, VENDOR, MODERATOR
  avatar?: string;
  image?: string;           // For NextAuth compatibility
  phone?: string;
  verified: boolean;
  active: boolean;
  locale: string;           // Default: "en"
  
  // Relations
  ownedHomestays: Homestay[];      // ⚠️ via "HomestayOwner" relation
  bookings: Booking[];              // ⚠️ as guest
  orders: Order[];                  // ⚠️ as customer
  products: Product[];              // ⚠️ as seller
  reviews: Review[];
  notifications: Notification[];
  carbonCredit?: CarbonCredit;
  achievements: UserAchievement[];
  wishlist: Wishlist[];
}
```

---

### Review Model
```typescript
{
  id: string;
  rating: number;           // 1-5 stars
  comment?: string;
  userId: string;
  homestayId?: string;
  productId?: string;       // ⚠️ Field exists but no relation
  
  // Relations
  user: User;
  homestay?: Homestay;
  // ⚠️ NO product relation exists
}
```

**Common Mistakes**:
- ❌ `review.featured` → ✅ No such field exists
- ❌ `review.product` → ✅ No relation exists (productId field exists but no relation)

---

### Achievement Model
```typescript
{
  id: string;
  name: string;
  description: string;
  icon?: string;
  category: string;
  points: number;
  criteria: Json;
  active: boolean;
  
  // Relations
  userAchievements: UserAchievement[];
}
```

**Common Mistakes**:
- ❌ `achievement.rarity` → ✅ No such field exists

---

### CarbonCredit Model
```typescript
{
  id: string;
  userId: string;           // ⚠️ One-to-one with User
  balance: Decimal;
  totalEarned: Decimal;
  totalSpent: Decimal;
  tier: string;
  
  // Relations
  user: User;
  transactions: CarbonTransaction[];
}
```

---

### Notification Model
```typescript
{
  id: string;
  userId: string;
  title: string;
  message: string;
  type: NotificationType;   // INFO, SUCCESS, WARNING, ERROR, BOOKING, ORDER, ACHIEVEMENT, CARBON, SYSTEM
  read: boolean;
  actionUrl?: string;
  metadata?: Json;
  createdAt: DateTime;
  
  // Relations
  user: User;
}
```

**Common Mistakes**:
- ❌ `notification.timestamp` → ✅ `notification.createdAt`

---

## Non-Existent Models

These models do NOT exist in the schema:

- ❌ **Article** - Remove all references
- ❌ **Category** - Product.category is a string field, not a relation
- ❌ **Testimonial** - Use Review model with high ratings instead
- ❌ **Invoice** - Planned but not implemented yet

---

## JSON Field Parsing

Many fields store JSON data. Always parse them properly:

```typescript
// ❌ Wrong
const photo = homestay.photos;

// ✅ Correct
const photos = Array.isArray(homestay.photos) ? homestay.photos : [];
const primaryPhoto = photos[0] || '/placeholder.jpg';

// ❌ Wrong
const amenity = homestay.amenities[0];

// ✅ Correct
const amenities = Array.isArray(homestay.amenities) ? homestay.amenities : [];
```

---

## Query Examples

### Correct Homestay Query
```typescript
const homestays = await prisma.homestay.findMany({
  where: {
    available: true,        // ✅ NOT isApproved or status
  },
  include: {
    owner: true,            // ✅ NOT host
    reviews: true,
  },
  orderBy: {
    basePrice: 'asc',       // ✅ NOT pricePerNight
  },
});

// Parse JSON fields
homestays.map(h => ({
  ...h,
  photos: Array.isArray(h.photos) ? h.photos : [],
  amenities: Array.isArray(h.amenities) ? h.amenities : [],
  location: h.address,      // ✅ Map address to location for UI
}));
```

### Correct Booking Query
```typescript
const bookings = await prisma.booking.findMany({
  where: {
    guestId: userId,        // ✅ NOT userId
    checkIn: {              // ✅ NOT checkInDate
      gte: new Date(),
    },
  },
});
```

### Correct Order Query
```typescript
const orders = await prisma.order.findMany({
  where: {
    customerId: userId,     // ✅ NOT userId
  },
  select: {
    total: true,            // ✅ NOT totalAmount
    status: true,
  },
});
```

### Correct Product Query
```typescript
const products = await prisma.product.findMany({
  where: {
    active: true,           // ✅ NOT status: 'ACTIVE' or featured: true
    stock: {
      gt: 0,
    },
  },
});

// Parse images
products.map(p => ({
  ...p,
  images: Array.isArray(p.images) ? p.images : [],
  primaryImage: Array.isArray(p.images) ? p.images[0] : '/placeholder.jpg',
}));
```

---

## Status/Enum Values

### BookingStatus
```typescript
enum BookingStatus {
  PENDING
  CONFIRMED
  CHECKED_IN
  CHECKED_OUT
  CANCELLED
}
```

### OrderStatus
```typescript
enum OrderStatus {
  PENDING
  CONFIRMED
  PROCESSING
  SHIPPED
  DELIVERED
  CANCELLED
  REFUNDED
}
```

### UserRole
```typescript
enum UserRole {
  ADMIN
  HOST
  GUEST
  VENDOR
  MODERATOR
}
```

### NotificationType
```typescript
enum NotificationType {
  INFO
  SUCCESS
  WARNING
  ERROR
  BOOKING
  ORDER
  ACHIEVEMENT
  CARBON
  SYSTEM
}
```

---

## Tips for Avoiding Errors

1. **Always reference this document** when creating new API endpoints
2. **Use TypeScript autocomplete** - let Prisma's types guide you
3. **Test with real data** - seed the database and verify queries work
4. **Parse JSON fields** - never assume JSON fields are arrays
5. **Use correct relation names** - `owner` not `host`, `guestId` not `userId`
6. **Check field existence** - some obvious fields don't exist (featured, rarity, etc.)

---

**Last Updated**: 2025-10-17  
**Schema Version**: As of PR11 completion
