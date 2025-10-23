# Homepage Requirements & Implementation Guide 🏠✨

**Document Version**: 1.0  
**Created**: 2025-10-20  
**Project**: Smart Carbon-Free Village Platform  
**Purpose**: Comprehensive homepage enhancement with Three.js animations and admin panel integration

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Current State Analysis](#current-state-analysis)
3. [Requirements & Goals](#requirements--goals)
4. [Three.js Animation Features](#threejs-animation-features)
5. [Admin Panel Integration](#admin-panel-integration)
6. [10 Suggested Improvements](#10-suggested-improvements)
7. [Step-by-Step Implementation Guide](#step-by-step-implementation-guide)
8. [Debugging & Troubleshooting](#debugging--troubleshooting)
9. [Testing with Playwright](#testing-with-playwright)
10. [Screenshots & Visual Documentation](#screenshots--visual-documentation)
11. [Performance Optimization](#performance-optimization)
12. [Future Enhancements](#future-enhancements)

---

## Executive Summary

### Vision
Transform the homepage into a stunning, 4K-ready, professional showcase featuring:
- **Beautiful Three.js animations** (particle systems, geometric shapes, interactive 3D elements)
- **Complete admin panel control** for all visual elements
- **Zero errors** and smooth performance across all devices
- **Professional aesthetics** befitting a world-class sustainable village platform

### Key Objectives
✅ Create an immersive, attractive homepage that captures visitors' attention  
✅ Implement smooth, performant 3D background animations using Three.js  
✅ Enable admin control of all homepage elements without coding  
✅ Ensure mobile responsiveness and accessibility  
✅ Achieve sub-3-second load times even with animations  
✅ Pass all tests and maintain code quality standards

---

## Current State Analysis

### Existing Homepage Features
**Location**: `/src/app/page.tsx`

#### ✅ Currently Implemented
- **Hero Section**: Welcome message with village description
- **Live Statistics**: Real-time village data (homestays, products, bookings, users, reviews, carbon offset)
- **Environmental Data**: Live sensor readings
- **Featured Homestays**: Dynamic grid of top 6 homestays
- **Featured Products**: Dynamic grid of top 8 products
- **Call-to-Action Buttons**: 
  - 🏔️ Explore Digital Twin
  - 🌐 360° Village Tour
  - 🏠 Browse Homestays
- **SEO Optimization**: JSON-LD structured data
- **Real-time Indicators**: Solar grid, air quality, carbon neutral status

#### 🚧 Areas for Enhancement
- **Visual Impact**: Static gradients, needs dynamic animations
- **Engagement**: Lacks interactive 3D elements
- **Professional Polish**: Needs more visual sophistication
- **Background**: Simple gradient, needs animated particles/shapes
- **Admin Control**: No CMS for homepage customization

### Technology Stack Review

#### Frontend (Confirmed ✅)
- **Next.js**: 14.2.33 (App Router)
- **React**: 18.3.1
- **TypeScript**: 5.9.3
- **Three.js**: 0.158.0 ✅ Already installed!
- **Framer Motion**: 12.23.22 (for smooth transitions)
- **Tailwind CSS**: 3.4.18 (styling)
- **Lucide React**: 0.469.0 (icons)

#### Backend & Infrastructure
- **Prisma ORM**: 6.17.1 (database)
- **PostgreSQL**: 14+ (data storage)
- **NextAuth.js**: 4.24.11 (authentication)

#### Admin Panel Capabilities
- **Control Center**: WordPress-style admin controls
- **Feature Toggles**: Enable/disable platform features
- **Branding Manager**: Logo, colors, fonts
- **Theme Customizer**: Visual theme customization
- **SEO Controls**: Meta tags and SEO optimization
- **Media Manager**: File and image library

---

## Requirements & Goals

### Functional Requirements

#### FR1: Attractive Homepage Design
**Priority**: P0 (Critical)  
**Description**: Create a visually stunning homepage that immediately captures attention

**Acceptance Criteria**:
- Modern, professional design aesthetic
- Smooth animations without performance issues
- Mobile-responsive (320px to 4K displays)
- Accessible (WCAG 2.1 AA compliant)
- Load time < 3 seconds on standard connection
- No console errors or warnings
- Cross-browser compatible (Chrome, Firefox, Safari, Edge)

#### FR2: Three.js Background Animation
**Priority**: P0 (Critical)  
**Description**: Implement beautiful 4K-ready background animations using Three.js

**Acceptance Criteria**:
- Particle system with 1000+ particles
- Floating geometric shapes (spheres, cubes, toruses)
- Smooth 60 FPS performance
- Responsive to user interaction (mouse/touch)
- Adaptive quality based on device capability
- Graceful degradation on low-power devices
- Option to disable for accessibility

**Features**:
1. **Particle System**
   - Starfield effect with depth
   - Color transitions
   - Mouse interaction (particles follow cursor)
   - Organic movement patterns

2. **Geometric Shapes**
   - 3-5 floating shapes in scene
   - Slow rotation and translation
   - Transparent/glass material
   - Edge lighting effects

3. **Camera Movement**
   - Subtle parallax scrolling
   - Smooth easing
   - Auto-rotation option

4. **Color Themes**
   - Primary: Green/Nature theme (matches village)
   - Alternate: Blue/Tech theme
   - Sunset: Warm orange/pink
   - Night: Deep blue/purple

#### FR3: Admin Panel Homepage Controls
**Priority**: P0 (Critical)  
**Description**: Enable administrators to control all homepage elements from admin panel

**Acceptance Criteria**:
- Visual homepage editor in admin panel
- Real-time preview of changes
- Save/publish workflow
- Revert to previous versions
- No coding required for common changes

**Control Elements**:
1. **Hero Section Controls**
   - Edit heading text
   - Edit description
   - Upload/change background image
   - Toggle animation on/off
   - Adjust animation speed
   - Choose animation type

2. **Statistics Controls**
   - Toggle visibility of stats
   - Choose which stats to display
   - Customize stat labels
   - Set update frequency

3. **Featured Content Controls**
   - Select featured homestays (manual or auto)
   - Select featured products (manual or auto)
   - Set number to display
   - Sort order options

4. **Call-to-Action Controls**
   - Edit button text
   - Edit button links
   - Choose button style
   - Add/remove buttons

5. **Animation Controls**
   - Enable/disable animations
   - Choose animation preset
   - Adjust particle count
   - Choose color theme
   - Set animation speed
   - Mobile behavior

#### FR4: Performance Optimization
**Priority**: P1 (High)  
**Description**: Ensure homepage loads fast and performs smoothly

**Acceptance Criteria**:
- Lighthouse Performance score > 90
- First Contentful Paint < 1.5s
- Time to Interactive < 3.0s
- Cumulative Layout Shift < 0.1
- 60 FPS animation on desktop
- 30 FPS minimum on mobile
- Memory usage < 100MB

**Optimizations**:
- Lazy load Three.js scene after critical content
- Use Web Workers for heavy calculations
- Implement LOD (Level of Detail) for 3D objects
- Reduce particle count on mobile
- Use requestAnimationFrame efficiently
- Implement intersection observer for on-scroll animations
- Compress and optimize images
- Code splitting for Three.js bundle

#### FR5: Mobile Responsiveness
**Priority**: P1 (High)  
**Description**: Perfect experience on all device sizes

**Acceptance Criteria**:
- Test on iPhone SE (320px)
- Test on standard mobile (375px)
- Test on tablets (768px)
- Test on desktop (1920px)
- Test on 4K displays (3840px)
- Touch interactions work smoothly
- Reduced animations on mobile for performance

**Responsive Behaviors**:
- Hero text scales appropriately
- Grid layouts adapt (1/2/3/4 columns)
- Buttons stack vertically on mobile
- Stats display in 2 columns on mobile
- Particles reduced to 300 on mobile
- Shapes reduced to 2 on mobile
- Animation quality auto-adjusts

---

## Three.js Animation Features

### Architecture Overview

```
HomePage
  ├── HeroSection (React)
  │   ├── Text Content
  │   └── ThreeJSBackground (Canvas)
  ├── StatsSection (React)
  ├── FeaturedHomestays (React)
  └── FeaturedProducts (React)
```

### Component Structure

#### 1. ThreeJSBackground Component
**File**: `/src/components/animations/ThreeJSBackground.tsx`

**Purpose**: Render animated Three.js scene behind homepage content

**Features**:
- Canvas with transparent background
- Particle system manager
- Geometric shape renderer
- Camera controller
- Performance monitor
- Event handlers (mouse, scroll, resize)

**Props**:
```typescript
interface ThreeJSBackgroundProps {
  preset?: 'nature' | 'tech' | 'sunset' | 'night';
  particleCount?: number;
  enableInteraction?: boolean;
  animationSpeed?: number;
  quality?: 'low' | 'medium' | 'high' | 'ultra';
  enableShapes?: boolean;
  shapeCount?: number;
  enableParallax?: boolean;
  className?: string;
}
```

**Implementation Details**:
```typescript
// Particle System
- Use THREE.Points with BufferGeometry
- Position particles in 3D space (-100 to 100 on all axes)
- Animate with sine/cosine waves for organic movement
- Color based on depth (near = bright, far = dim)
- Size based on depth (near = large, far = small)

// Geometric Shapes
- Create 3-5 simple geometries (sphere, box, torus)
- Apply MeshPhysicalMaterial with transparency
- Slow rotation (0.001 radians per frame)
- Gentle floating motion (sine wave translation)
- Bloom effect with edge lighting

// Camera
- PerspectiveCamera with FOV 75
- Position at (0, 0, 100)
- LookAt (0, 0, 0)
- Smooth dolly on scroll (lerp factor 0.1)
- Mouse parallax effect (subtle movement)

// Optimization
- Use InstancedMesh for repeated geometries
- Frustum culling enabled
- Dispose of geometries/materials on unmount
- RequestAnimationFrame with delta time
- Auto-adjust quality based on FPS
```

#### 2. ParticleSystem Class
**File**: `/src/lib/three/ParticleSystem.ts`

**Purpose**: Manage particle behavior and rendering

**Methods**:
- `init()`: Create particles with random positions
- `update(deltaTime)`: Animate particle positions
- `setCount(count)`: Adjust particle count dynamically
- `setColors(colorArray)`: Change particle colors
- `dispose()`: Clean up resources

**Algorithm**:
```typescript
// Position update per frame
particle.x += Math.sin(time + particle.offset) * speed;
particle.y += Math.cos(time + particle.offset) * speed;
particle.z += Math.sin(time * 0.5) * speed * 0.5;

// Wrap around boundaries
if (particle.x > 100) particle.x = -100;
if (particle.y > 100) particle.y = -100;
if (particle.z > 100) particle.z = -100;

// Mouse interaction (within 20 units)
const dx = mouseX - particle.x;
const dy = mouseY - particle.y;
const distance = Math.sqrt(dx * dx + dy * dy);
if (distance < 20) {
  particle.x += dx * 0.05;
  particle.y += dy * 0.05;
}
```

#### 3. ShapeRenderer Class
**File**: `/src/lib/three/ShapeRenderer.ts`

**Purpose**: Render and animate floating geometric shapes

**Shapes**:
- **IcosahedronGeometry**: radius 10, detail 1
- **TorusGeometry**: radius 8, tube 3
- **OctahedronGeometry**: radius 7, detail 0
- **BoxGeometry**: 12x12x12
- **SphereGeometry**: radius 9, segments 32

**Materials**:
```typescript
new THREE.MeshPhysicalMaterial({
  color: themeColor,
  transparent: true,
  opacity: 0.3,
  roughness: 0.2,
  metalness: 0.8,
  clearcoat: 1.0,
  clearcoatRoughness: 0.2,
  transmission: 0.5,
  thickness: 5,
  envMapIntensity: 1.5
})
```

**Animation**:
```typescript
// Rotation
shape.rotation.x += 0.001;
shape.rotation.y += 0.0015;

// Floating
shape.position.y = baseY + Math.sin(time + offset) * 5;
shape.position.x = baseX + Math.cos(time * 0.7 + offset) * 3;
```

#### 4. Color Themes

**Nature Theme** (Default):
```typescript
{
  background: 0x0a4d3c,
  particles: [0x10b981, 0x34d399, 0x6ee7b7],
  shapes: 0x047857,
  fog: 0x064e3b
}
```

**Tech Theme**:
```typescript
{
  background: 0x0f172a,
  particles: [0x3b82f6, 0x60a5fa, 0x93c5fd],
  shapes: 0x1e40af,
  fog: 0x1e293b
}
```

**Sunset Theme**:
```typescript
{
  background: 0x7c2d12,
  particles: [0xf97316, 0xfb923c, 0xfdba74],
  shapes: 0xea580c,
  fog: 0x9a3412
}
```

**Night Theme**:
```typescript
{
  background: 0x1e1b4b,
  particles: [0x6366f1, 0x818cf8, 0xa5b4fc],
  shapes: 0x4338ca,
  fog: 0x312e81
}
```

### Performance Monitoring

**FPS Counter**:
```typescript
let fps = 0;
let frameCount = 0;
let lastTime = performance.now();

function updateFPS() {
  frameCount++;
  const currentTime = performance.now();
  
  if (currentTime >= lastTime + 1000) {
    fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
    frameCount = 0;
    lastTime = currentTime;
    
    // Auto-adjust quality
    if (fps < 30) reduceQuality();
    if (fps > 55 && quality < 'high') increaseQuality();
  }
}
```

**Quality Levels**:
- **Ultra**: 2000 particles, 5 shapes, full effects
- **High**: 1000 particles, 4 shapes, most effects
- **Medium**: 500 particles, 3 shapes, basic effects
- **Low**: 300 particles, 2 shapes, minimal effects
- **Mobile**: 300 particles, 1 shape, no effects


---

## Admin Panel Integration

### Overview
Enable non-technical administrators to control all homepage elements through an intuitive admin interface.

### Location
**New Page**: `/src/app/admin-panel/homepage-editor/page.tsx`  
**API Routes**: `/src/app/api/admin/homepage/*`  
**Database Model**: `HomepageConfig` (to be added to Prisma schema)

### Database Schema Addition

```prisma
model HomepageConfig {
  id              String   @id @default(cuid())
  
  // Hero Section
  heroTitle       String   @default("Welcome to Smart Carbon-Free Village")
  heroSubtitle    String   @default("Experience Damday Village...")
  heroImage       String?
  
  // Animation Settings
  animationEnabled Boolean @default(true)
  animationPreset String   @default("nature") // nature, tech, sunset, night
  particleCount   Int      @default(1000)
  shapeCount      Int      @default(4)
  animationSpeed  Float    @default(1.0)
  enableInteraction Boolean @default(true)
  enableParallax  Boolean  @default(true)
  quality         String   @default("auto") // auto, ultra, high, medium, low
  
  // Statistics
  showStats       Boolean  @default(true)
  statsToShow     Json     @default("[]") // ["homestays", "products", "bookings", "users", "reviews", "carbon"]
  statsUpdateInterval Int  @default(30000) // milliseconds
  
  // Featured Content
  featuredHomestaysCount Int @default(6)
  featuredHomestaysAuto  Boolean @default(true)
  featuredHomestayIds    Json @default("[]")
  featuredProductsCount  Int @default(8)
  featuredProductsAuto   Boolean @default(true)
  featuredProductIds     Json @default("[]")
  
  // CTA Buttons
  ctaButtons      Json     @default("[]") // Array of {text, link, variant}
  
  // Environmental Indicators
  showEnvIndicators Boolean @default(true)
  indicators        Json    @default("[]") // Array of indicator configs
  
  // Meta
  active          Boolean  @default(true)
  version         Int      @default(1)
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  publishedAt     DateTime?
  createdBy       String?
  updatedBy       String?
  
  @@map("homepage_config")
}
```

### Admin Interface Components

#### 1. Homepage Editor Dashboard
**Component**: `HomepageEditor.tsx`

**Layout**:
```
┌─────────────────────────────────────────────┐
│ Homepage Editor                    [Preview]│
├─────────────────────────────────────────────┤
│  Tabs:                                      │
│  [Hero] [Animations] [Stats] [Featured]    │
│  [CTAs] [Advanced]                          │
├─────────────────────────────────────────────┤
│                                             │
│  Tab Content Area                           │
│                                             │
├─────────────────────────────────────────────┤
│  [Save Draft] [Preview] [Publish] [Revert] │
└─────────────────────────────────────────────┘
```

#### 2. Hero Section Editor Tab

**Fields**:
- **Title** (text input, max 100 chars)
  - Preview text size
  - Character counter
  - Formatting options

- **Subtitle** (textarea, max 300 chars)
  - Preview text
  - Line break support

- **Background Image** (media picker)
  - Upload new image
  - Choose from media library
  - Remove image option
  - Image preview

**Preview**: Live preview of hero section

#### 3. Animation Settings Tab

**Controls**:

**Enable/Disable Animation**:
```
┌─────────────────────────────────────┐
│ [✓] Enable Background Animation    │
│                                     │
│ Animation Preset:                   │
│ ( ) Nature (Green) [Preview]        │
│ ( ) Tech (Blue) [Preview]           │
│ ( ) Sunset (Orange) [Preview]       │
│ (•) Night (Purple) [Preview]        │
│                                     │
│ Particle Count: [====·····] 1000   │
│ ◄────────────────────────►         │
│ 100        1000        2000         │
│                                     │
│ Shape Count: [===·······] 4        │
│ ◄────────────────────────►         │
│ 1     2    3    4    5              │
│                                     │
│ Animation Speed: [=====····] 1.0x  │
│ ◄────────────────────────►         │
│ 0.5x         1.0x        2.0x       │
│                                     │
│ [✓] Enable Mouse Interaction        │
│ [✓] Enable Parallax Scrolling       │
│                                     │
│ Quality:                            │
│ (•) Auto-detect                     │
│ ( ) Ultra (2000 particles)          │
│ ( ) High (1000 particles)           │
│ ( ) Medium (500 particles)          │
│ ( ) Low (300 particles)             │
│                                     │
│ [Preview Animation] [Reset Defaults]│
└─────────────────────────────────────┘
```

**Live Preview**: Mini canvas showing animation preview

#### 4. Statistics Tab

**Controls**:
```
┌─────────────────────────────────────┐
│ [✓] Show Statistics Section         │
│                                     │
│ Statistics to Display:              │
│ [✓] Total Homestays                 │
│ [✓] Total Products                  │
│ [✓] Total Bookings                  │
│ [✓] Registered Users                │
│ [✓] Reviews & Ratings               │
│ [✓] Carbon Offset (kg CO2)          │
│                                     │
│ Update Interval:                    │
│ [====·····] 30 seconds              │
│ 10s      30s      60s      120s     │
│                                     │
│ Display Format:                     │
│ (•) Grid (2x3)                      │
│ ( ) Grid (3x2)                      │
│ ( ) Single Row                      │
│                                     │
│ Animation: (•) Count Up             │
│           ( ) Fade In               │
│           ( ) None                  │
└─────────────────────────────────────┘
```

#### 5. Featured Content Tab

**Homestays Section**:
```
┌─────────────────────────────────────┐
│ Featured Homestays                  │
│                                     │
│ Selection Mode:                     │
│ (•) Automatic (by rating/bookings)  │
│ ( ) Manual Selection                │
│                                     │
│ Number to Display: [===···] 6      │
│ ◄────────────────────────►         │
│ 3         6         9         12    │
│                                     │
│ If Automatic:                       │
│ Sort by: [Rating ▼]                 │
│   - Rating (highest first)          │
│   - Bookings (most popular)         │
│   - Recent (newly added)            │
│   - Price (lowest first)            │
│                                     │
│ If Manual:                          │
│ [Select Homestays...]               │
│   ┌────────────────────────────┐   │
│   │ [✓] Mountain View Cottage  │   │
│   │ [✓] Himalayan Retreat      │   │
│   │ [ ] Valley House           │   │
│   │ [ ] Sunrise Villa          │   │
│   └────────────────────────────┘   │
└─────────────────────────────────────┘
```

**Products Section**: Similar to homestays

#### 6. Call-to-Action Buttons Tab

**Button Manager**:
```
┌─────────────────────────────────────┐
│ CTA Buttons                         │
│                                     │
│ Button 1:                           │
│ Text: [Explore Digital Twin        ]│
│ Link: [/digital-twin               ]│
│ Icon: [🏔️] [Choose Icon...]         │
│ Style: [Primary ▼]                  │
│ [Remove Button]                     │
│                                     │
│ Button 2:                           │
│ Text: [360° Village Tour           ]│
│ Link: [/village-tour               ]│
│ Icon: [🌐] [Choose Icon...]         │
│ Style: [Outline ▼]                  │
│ [Remove Button]                     │
│                                     │
│ Button 3:                           │
│ Text: [Browse Homestays            ]│
│ Link: [/homestays                  ]│
│ Icon: [🏠] [Choose Icon...]         │
│ Style: [Outline ▼]                  │
│ [Remove Button]                     │
│                                     │
│ [+ Add Button] (max 5)              │
│                                     │
│ Button Layout:                      │
│ (•) Row                             │
│ ( ) Column                          │
│ ( ) Grid                            │
└─────────────────────────────────────┘
```

#### 7. Advanced Settings Tab

**Additional Controls**:
- Environmental indicators toggle
- Custom CSS injection
- SEO settings for homepage
- Schema.org markup editor
- Performance settings
- Accessibility options

### API Endpoints

#### GET `/api/admin/homepage/config`
**Purpose**: Retrieve current homepage configuration

**Response**:
```json
{
  "success": true,
  "data": {
    "id": "cuid...",
    "heroTitle": "Welcome to Smart Carbon-Free Village",
    "animationEnabled": true,
    "animationPreset": "nature",
    "particleCount": 1000,
    // ... all config fields
  }
}
```

#### POST `/api/admin/homepage/config`
**Purpose**: Save new homepage configuration

**Request Body**:
```json
{
  "heroTitle": "New Title",
  "animationEnabled": false,
  // ... fields to update
}
```

**Response**:
```json
{
  "success": true,
  "message": "Homepage configuration saved as draft",
  "data": { /* updated config */ }
}
```

#### POST `/api/admin/homepage/publish`
**Purpose**: Publish draft configuration to live site

**Response**:
```json
{
  "success": true,
  "message": "Homepage configuration published",
  "publishedAt": "2025-10-20T15:00:00Z"
}
```

#### POST `/api/admin/homepage/revert`
**Purpose**: Revert to previous published version

**Response**:
```json
{
  "success": true,
  "message": "Reverted to version 3",
  "data": { /* reverted config */ }
}
```

#### GET `/api/public/homepage/config`
**Purpose**: Get published homepage configuration for frontend

**Response**: Published config (lightweight, public fields only)

### Preview Mode

**Implementation**:
- Use React Context to inject preview config
- Preview URL: `/admin-panel/homepage-editor/preview`
- Side-by-side preview (split screen)
- Mobile preview option
- Refresh preview on changes

**Preview Component**:
```typescript
<PreviewFrame>
  <HomePage config={previewConfig} isPreview={true} />
</PreviewFrame>
```

### Version Control

**Features**:
- Auto-save drafts every 30 seconds
- Manual save option
- Version history (last 10 versions)
- Compare versions
- Restore from history

**Version History UI**:
```
┌─────────────────────────────────────┐
│ Version History                     │
├─────────────────────────────────────┤
│ v5 Current Draft                    │
│ Oct 20, 2025 3:45 PM                │
│ By: Admin User                      │
│ [View] [Delete]                     │
├─────────────────────────────────────┤
│ v4 ✓ Published                      │
│ Oct 20, 2025 2:30 PM                │
│ By: Admin User                      │
│ [View] [Restore]                    │
├─────────────────────────────────────┤
│ v3 Oct 19, 2025 5:00 PM             │
│ By: Admin User                      │
│ [View] [Restore]                    │
└─────────────────────────────────────┘
```

---

## 10 Suggested Improvements

### 1. 🎨 Advanced Color Customization
**Description**: Allow admins to create custom color themes beyond presets

**Features**:
- Color picker for each element (particles, shapes, background)
- Save custom themes
- Import/export theme JSON
- Color palette generator
- Accessibility contrast checker

**Implementation**:
```typescript
interface CustomTheme {
  name: string;
  colors: {
    background: string;
    particles: string[];
    shapes: string;
    fog: string;
    text: {
      primary: string;
      secondary: string;
    };
  };
  gradient?: {
    enabled: boolean;
    from: string;
    to: string;
    angle: number;
  };
}
```

**Benefits**:
- Brand consistency
- Seasonal themes (e.g., holiday themes)
- Event-specific customization
- A/B testing different color schemes

**Priority**: P2 (Medium)  
**Effort**: 3 days

### 2. 🎭 Animation Presets Gallery
**Description**: Pre-built animation scenarios users can choose from

**Presets**:
- **Fireflies**: Glowing particles with random brightness
- **Snowfall**: Particles falling with slight side movement
- **Stars**: Twinkling stars with different sizes
- **DNA Helix**: Particles forming double helix pattern
- **Galaxy Spiral**: Particles spiraling outward
- **Aurora**: Wave-like colorful particles
- **Rain**: Falling particles with speed variation
- **Bubbles**: Floating upward with wobble

**Implementation**:
- Preset configuration files
- Preview animations for each preset
- One-click apply
- Customize preset parameters

**Benefits**:
- Quick setup for non-technical users
- Inspiration gallery
- Seasonal/event themes ready to go

**Priority**: P2 (Medium)  
**Effort**: 5 days

### 3. 📱 Mobile-First Animation Variants
**Description**: Separate animation configs for mobile devices

**Features**:
- Desktop vs Mobile animation toggle
- Different particle counts
- Different quality settings
- Touch interaction patterns
- Battery-saving mode

**Controls**:
```
┌─────────────────────────────────────┐
│ Device-Specific Settings            │
│                                     │
│ Desktop (>768px):                   │
│ Particles: [====·····] 1000         │
│ Shapes: [===·······] 4              │
│ Quality: High                       │
│                                     │
│ Mobile (<768px):                    │
│ Particles: [==·······] 300          │
│ Shapes: [=·········] 1              │
│ Quality: Low                        │
│                                     │
│ [✓] Reduce motion on low battery    │
│ [✓] Disable on slow connection      │
└─────────────────────────────────────┘
```

**Benefits**:
- Better mobile performance
- Longer battery life
- Improved user experience
- Accessibility (prefers-reduced-motion)

**Priority**: P1 (High)  
**Effort**: 2 days

### 4. 🎬 Scroll-Triggered Animations
**Description**: Animate sections as user scrolls down

**Features**:
- Fade in on scroll
- Slide in from sides
- Scale up animation
- Stagger animations for grid items
- Parallax effects
- Counter animations

**Implementation**:
```typescript
useIntersectionObserver(ref, (entry) => {
  if (entry.isIntersecting) {
    controls.start({
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 }
    });
  }
});
```

**Sections to Animate**:
- Stats counters (count up when visible)
- Featured homestays (stagger fade-in)
- Featured products (stagger slide-in)
- Environmental indicators (pulse)

**Benefits**:
- More engaging experience
- Guides user attention
- Professional feel
- Storytelling opportunity

**Priority**: P1 (High)  
**Effort**: 3 days

### 5. 🌐 Internationalization (i18n) for Homepage
**Description**: Multi-language support for all homepage text

**Features**:
- Language switcher in header
- Support English, Hindi (initially)
- Store translations in database
- Admin can edit translations
- Auto-detect browser language
- SEO for multiple languages

**Admin Interface**:
```
┌─────────────────────────────────────┐
│ Homepage Translations               │
│                                     │
│ Language: [English ▼] [+ Add]      │
│                                     │
│ Hero Title:                         │
│ EN: [Welcome to Smart Carbon-Free   │
│      Village                      ] │
│                                     │
│ HI: [स्मार्ट कार्बन-मुक्त गांव में   │
│      आपका स्वागत है               ] │
│                                     │
│ [Copy from English] [AI Translate]  │
│                                     │
│ Hero Subtitle:                      │
│ EN: [Experience Damday Village...] │
│ HI: [दामडे गांव का अनुभव करें...] │
│                                     │
│ [Save Translations]                 │
└─────────────────────────────────────┘
```

**Benefits**:
- Reach wider audience
- Better user experience for Hindi speakers
- SEO in multiple languages
- Cultural inclusivity

**Priority**: P2 (Medium)  
**Effort**: 5 days

### 6. 📊 A/B Testing Framework
**Description**: Test different homepage variants to optimize conversion

**Features**:
- Create variants (A, B, C)
- Split traffic percentage
- Track metrics (clicks, time on page, conversions)
- Statistical significance calculator
- Auto-switch to winner

**Variants**:
- Different hero text
- Different animation types
- Different CTAs
- Different layouts
- Different colors

**Admin Dashboard**:
```
┌─────────────────────────────────────┐
│ A/B Test: Homepage Hero             │
│ Status: Running (3 days)            │
├─────────────────────────────────────┤
│ Variant A (Control) - 50%           │
│ "Welcome to Smart Carbon-Free..."   │
│ Conversions: 12.3%                  │
│ Avg Time: 2:34                      │
├─────────────────────────────────────┤
│ Variant B - 50%                     │
│ "Discover Sustainable Living..."    │
│ Conversions: 14.7% ↑                │
│ Avg Time: 3:12 ↑                    │
├─────────────────────────────────────┤
│ [End Test] [Declare Winner]         │
└─────────────────────────────────────┘
```

**Benefits**:
- Data-driven decisions
- Improve conversion rates
- Learn what works
- Continuous optimization

**Priority**: P3 (Low)  
**Effort**: 7 days

### 7. 🎥 Video Background Option
**Description**: Alternative to Three.js - use video background

**Features**:
- Upload video (MP4, WebM)
- YouTube/Vimeo embed
- Auto-play, loop, mute
- Fallback to image
- Mobile: show image instead

**Admin Controls**:
```
┌─────────────────────────────────────┐
│ Background Type:                    │
│ (•) Animation (Three.js)            │
│ ( ) Video                           │
│ ( ) Image                           │
│ ( ) Gradient                        │
│                                     │
│ If Video:                           │
│ Video File: [Upload] [Choose]      │
│ [preview.mp4]                       │
│                                     │
│ [✓] Auto-play                       │
│ [✓] Loop                            │
│ [✓] Mute                            │
│ [ ] Show controls                   │
│                                     │
│ Fallback Image: [Choose]            │
│ Mobile Behavior:                    │
│ ( ) Show video                      │
│ (•) Show image                      │
│ ( ) None (solid color)              │
└─────────────────────────────────────┘
```

**Use Cases**:
- Drone footage of village
- Time-lapse of sunrise
- Village activities
- Seasonal changes

**Benefits**:
- More realistic representation
- Showcase actual village
- No GPU performance concerns
- Easier for admins

**Priority**: P2 (Medium)  
**Effort**: 3 days

### 8. 🎯 Personalized Homepage
**Description**: Show different content based on user type/history

**Personalization Factors**:
- User role (guest, user, host, admin)
- Previous bookings
- Browsing history
- Location
- Time of day
- Device type

**Examples**:
- **Returning guest**: "Welcome back! Check out new homestays"
- **Host**: "Manage your listings | View bookings"
- **First-time visitor**: "Take a tour | Learn about us"
- **Researcher**: "Access data | View reports"

**Implementation**:
```typescript
function getPersonalizedContent(user, history) {
  if (!user) return defaultContent;
  
  if (user.role === 'HOST') {
    return {
      hero: "Manage Your Homestay",
      cta: "View Dashboard",
      featured: userHomestays
    };
  }
  
  if (history.bookings.length > 0) {
    return {
      hero: "Welcome Back!",
      featured: recommendedHomestays
    };
  }
  
  return defaultContent;
}
```

**Benefits**:
- Higher engagement
- Better conversion
- Reduced bounce rate
- User feels valued

**Priority**: P3 (Future)  
**Effort**: 10 days

### 9. 🎪 Interactive Homepage Tour
**Description**: Guided tour for first-time visitors

**Features**:
- Tooltip-based tutorial
- Highlights key features
- Skip or take tour
- Progress indicator
- Don't show again option

**Tour Steps**:
1. "Welcome! Let's show you around"
2. "These are live stats from our village"
3. "See real-time environmental data"
4. "Browse our sustainable homestays"
5. "Shop local artisan products"
6. "Ready to explore?"

**Implementation**:
- Use library like Intro.js or Shepherd.js
- Store tour completion in localStorage
- Admin can edit tour steps

**Benefits**:
- Better onboarding
- Reduced confusion
- Showcase features
- Increase engagement

**Priority**: P2 (Medium)  
**Effort**: 3 days

### 10. 🌟 Achievement Showcase
**Description**: Display village achievements prominently

**Features**:
- Awards carousel
- Certifications
- Statistics badges
- Media mentions
- Milestones timeline

**Examples**:
- "Carbon Neutral Since 2020"
- "100% Solar Powered"
- "500+ Happy Guests"
- "Featured in National Geographic"
- "UN SDG Contributor"

**Admin Management**:
```
┌─────────────────────────────────────┐
│ Homepage Achievements               │
│                                     │
│ Achievement 1:                      │
│ Icon: [🏆]                          │
│ Title: [Carbon Neutral Since 2020] │
│ Badge: [Upload Image]               │
│ [Remove]                            │
│                                     │
│ Achievement 2:                      │
│ Icon: [☀️]                          │
│ Title: [100% Solar Powered]        │
│ Badge: [Upload Image]               │
│ [Remove]                            │
│                                     │
│ [+ Add Achievement]                 │
│                                     │
│ Display:                            │
│ (•) Carousel                        │
│ ( ) Grid                            │
│ ( ) List                            │
└─────────────────────────────────────┘
```

**Benefits**:
- Build trust
- Showcase credibility
- Inspire visitors
- SEO benefits

**Priority**: P2 (Medium)  
**Effort**: 2 days

---

## Step-by-Step Implementation Guide

This comprehensive guide walks through implementing the homepage enhancements from start to finish.

### Prerequisites Checklist

**Environment Setup**:
- [ ] Node.js 20+ installed
- [ ] npm or yarn installed
- [ ] Git configured
- [ ] Code editor (VS Code recommended)
- [ ] Browser dev tools familiarity

**Project Setup**:
- [ ] Repository cloned
- [ ] Dependencies installed (`npm install`)
- [ ] Database configured
- [ ] `.env` file created from `.env.example`
- [ ] Database migrated and seeded

**Knowledge Requirements**:
- [ ] Basic TypeScript
- [ ] React fundamentals
- [ ] Next.js App Router
- [ ] Three.js basics (optional, we'll guide you)
- [ ] CSS/Tailwind

### Phase 1: Setup & Configuration (Day 1)

#### Step 1.1: Install Additional Dependencies

```bash
# Three.js is already installed (0.158.0)
# Install additional animation utilities
npm install @react-three/fiber @react-three/drei
npm install react-intersection-observer

# Install Playwright for testing
npm install --save-dev @playwright/test
npx playwright install
```

#### Step 1.2: Create Project Structure

```bash
# Create directories
mkdir -p src/components/animations
mkdir -p src/lib/three
mkdir -p src/app/api/admin/homepage
mkdir -p tests/e2e

# Create files
touch src/components/animations/ThreeJSBackground.tsx
touch src/lib/three/ParticleSystem.ts
touch src/lib/three/ShapeRenderer.ts
touch src/lib/three/ColorThemes.ts
touch src/app/api/admin/homepage/config/route.ts
touch tests/e2e/homepage.spec.ts
```

#### Step 1.3: Update Prisma Schema

```bash
# Open prisma/schema.prisma
# Add HomepageConfig model (see schema in Admin Panel Integration section)

# Generate Prisma client
npm run db:generate

# Push schema changes
npm run db:push
```

#### Step 1.4: Create Type Definitions

Create `/src/types/homepage.ts`:
```typescript
export interface HomepageConfig {
  id: string;
  heroTitle: string;
  heroSubtitle: string;
  heroImage?: string;
  animationEnabled: boolean;
  animationPreset: 'nature' | 'tech' | 'sunset' | 'night';
  particleCount: number;
  shapeCount: number;
  animationSpeed: number;
  enableInteraction: boolean;
  enableParallax: boolean;
  quality: 'auto' | 'ultra' | 'high' | 'medium' | 'low';
  showStats: boolean;
  statsToShow: string[];
  ctaButtons: CTAButton[];
  // ... other fields
}

export interface CTAButton {
  id: string;
  text: string;
  link: string;
  icon?: string;
  variant: 'primary' | 'outline' | 'ghost';
  order: number;
}

export interface ThreeJSBackgroundProps {
  preset: 'nature' | 'tech' | 'sunset' | 'night';
  particleCount: number;
  shapeCount: number;
  animationSpeed: number;
  enableInteraction: boolean;
  enableParallax: boolean;
  quality: 'auto' | 'ultra' | 'high' | 'medium' | 'low';
  className?: string;
}
```


### Phase 2: Three.js Animation Implementation (Days 2-3)

#### Step 2.1: Create Color Themes Module

File: `/src/lib/three/ColorThemes.ts`

```typescript
export interface ColorTheme {
  name: string;
  background: number;
  particles: number[];
  shapes: number;
  fog: number;
}

export const ColorThemes: Record<string, ColorTheme> = {
  nature: {
    name: 'Nature',
    background: 0x0a4d3c,
    particles: [0x10b981, 0x34d399, 0x6ee7b7],
    shapes: 0x047857,
    fog: 0x064e3b,
  },
  tech: {
    name: 'Tech',
    background: 0x0f172a,
    particles: [0x3b82f6, 0x60a5fa, 0x93c5fd],
    shapes: 0x1e40af,
    fog: 0x1e293b,
  },
  sunset: {
    name: 'Sunset',
    background: 0x7c2d12,
    particles: [0xf97316, 0xfb923c, 0xfdba74],
    shapes: 0xea580c,
    fog: 0x9a3412,
  },
  night: {
    name: 'Night',
    background: 0x1e1b4b,
    particles: [0x6366f1, 0x818cf8, 0xa5b4fc],
    shapes: 0x4338ca,
    fog: 0x312e81,
  },
};

export function getTheme(name: string): ColorTheme {
  return ColorThemes[name] || ColorThemes.nature;
}
```

#### Step 2.2: Create Particle System

File: `/src/lib/three/ParticleSystem.ts`

```typescript
import * as THREE from 'three';

export class ParticleSystem {
  private particles: THREE.Points;
  private geometry: THREE.BufferGeometry;
  private material: THREE.PointsMaterial;
  private particlePositions: Float32Array;
  private particleVelocities: Float32Array;
  private count: number;
  private time: number = 0;
  
  constructor(count: number, colors: number[]) {
    this.count = count;
    this.particlePositions = new Float32Array(count * 3);
    this.particleVelocities = new Float32Array(count * 3);
    
    // Initialize particle positions randomly
    for (let i = 0; i < count * 3; i += 3) {
      this.particlePositions[i] = (Math.random() - 0.5) * 200;     // x
      this.particlePositions[i + 1] = (Math.random() - 0.5) * 200; // y
      this.particlePositions[i + 2] = (Math.random() - 0.5) * 200; // z
      
      // Random velocities
      this.particleVelocities[i] = (Math.random() - 0.5) * 0.02;
      this.particleVelocities[i + 1] = (Math.random() - 0.5) * 0.02;
      this.particleVelocities[i + 2] = (Math.random() - 0.5) * 0.02;
    }
    
    // Create geometry
    this.geometry = new THREE.BufferGeometry();
    this.geometry.setAttribute(
      'position',
      new THREE.BufferAttribute(this.particlePositions, 3)
    );
    
    // Create material
    this.material = new THREE.PointsMaterial({
      color: colors[0],
      size: 2,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    
    // Create particles mesh
    this.particles = new THREE.Points(this.geometry, this.material);
  }
  
  update(deltaTime: number, mouseX: number = 0, mouseY: number = 0, enableInteraction: boolean = true) {
    this.time += deltaTime;
    
    const positions = this.geometry.attributes.position.array as Float32Array;
    
    for (let i = 0; i < this.count; i++) {
      const i3 = i * 3;
      
      // Apply velocity
      positions[i3] += this.particleVelocities[i3];
      positions[i3 + 1] += this.particleVelocities[i3 + 1];
      positions[i3 + 2] += this.particleVelocities[i3 + 2];
      
      // Add wave motion
      positions[i3] += Math.sin(this.time + i) * 0.01;
      positions[i3 + 1] += Math.cos(this.time + i) * 0.01;
      
      // Wrap around boundaries
      if (positions[i3] > 100) positions[i3] = -100;
      if (positions[i3] < -100) positions[i3] = 100;
      if (positions[i3 + 1] > 100) positions[i3 + 1] = -100;
      if (positions[i3 + 1] < -100) positions[i3 + 1] = 100;
      if (positions[i3 + 2] > 100) positions[i3 + 2] = -100;
      if (positions[i3 + 2] < -100) positions[i3 + 2] = 100;
      
      // Mouse interaction
      if (enableInteraction) {
        const dx = mouseX - positions[i3];
        const dy = mouseY - positions[i3 + 1];
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 20) {
          positions[i3] += dx * 0.05;
          positions[i3 + 1] += dy * 0.05;
        }
      }
    }
    
    this.geometry.attributes.position.needsUpdate = true;
  }
  
  getMesh(): THREE.Points {
    return this.particles;
  }
  
  dispose() {
    this.geometry.dispose();
    this.material.dispose();
  }
}
```

#### Step 2.3: Create Shape Renderer

File: `/src/lib/three/ShapeRenderer.ts`

```typescript
import * as THREE from 'three';

export class ShapeRenderer {
  private shapes: THREE.Mesh[] = [];
  private time: number = 0;
  
  constructor(count: number, color: number) {
    const geometries = [
      new THREE.IcosahedronGeometry(10, 1),
      new THREE.TorusGeometry(8, 3, 16, 100),
      new THREE.OctahedronGeometry(7, 0),
      new THREE.BoxGeometry(12, 12, 12),
      new THREE.SphereGeometry(9, 32, 32),
    ];
    
    const material = new THREE.MeshPhysicalMaterial({
      color: color,
      transparent: true,
      opacity: 0.3,
      roughness: 0.2,
      metalness: 0.8,
      clearcoat: 1.0,
      clearcoatRoughness: 0.2,
      transmission: 0.5,
      thickness: 5,
    });
    
    for (let i = 0; i < count; i++) {
      const geometry = geometries[i % geometries.length];
      const shape = new THREE.Mesh(geometry, material);
      
      // Random position
      shape.position.set(
        (Math.random() - 0.5) * 100,
        (Math.random() - 0.5) * 100,
        (Math.random() - 0.5) * 50
      );
      
      // Random rotation
      shape.rotation.set(
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI
      );
      
      this.shapes.push(shape);
    }
  }
  
  update(deltaTime: number) {
    this.time += deltaTime;
    
    this.shapes.forEach((shape, i) => {
      // Rotate
      shape.rotation.x += 0.001;
      shape.rotation.y += 0.0015;
      
      // Float
      const offset = i * 0.5;
      shape.position.y = shape.position.y + Math.sin(this.time + offset) * 0.05;
      shape.position.x = shape.position.x + Math.cos(this.time * 0.7 + offset) * 0.03;
    });
  }
  
  getShapes(): THREE.Mesh[] {
    return this.shapes;
  }
  
  dispose() {
    this.shapes.forEach(shape => {
      shape.geometry.dispose();
      (shape.material as THREE.Material).dispose();
    });
  }
}
```

#### Step 2.4: Create Main Three.js Component

File: `/src/components/animations/ThreeJSBackground.tsx`

```typescript
'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { ParticleSystem } from '@/lib/three/ParticleSystem';
import { ShapeRenderer } from '@/lib/three/ShapeRenderer';
import { getTheme } from '@/lib/three/ColorThemes';
import { ThreeJSBackgroundProps } from '@/types/homepage';

export function ThreeJSBackground({
  preset = 'nature',
  particleCount = 1000,
  shapeCount = 4,
  animationSpeed = 1.0,
  enableInteraction = true,
  enableParallax = true,
  quality = 'auto',
  className = '',
}: ThreeJSBackgroundProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const particleSystemRef = useRef<ParticleSystem | null>(null);
  const shapeRendererRef = useRef<ShapeRenderer | null>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const frameIdRef = useRef<number>(0);
  
  useEffect(() => {
    if (!containerRef.current) return;
    
    // Get theme colors
    const theme = getTheme(preset);
    
    // Adjust particle count based on quality
    let adjustedParticleCount = particleCount;
    let adjustedShapeCount = shapeCount;
    
    if (quality === 'low') {
      adjustedParticleCount = Math.min(particleCount, 300);
      adjustedShapeCount = Math.min(shapeCount, 2);
    } else if (quality === 'medium') {
      adjustedParticleCount = Math.min(particleCount, 500);
      adjustedShapeCount = Math.min(shapeCount, 3);
    }
    
    // Detect mobile
    const isMobile = window.innerWidth < 768;
    if (isMobile) {
      adjustedParticleCount = Math.min(adjustedParticleCount, 300);
      adjustedShapeCount = Math.min(adjustedShapeCount, 1);
    }
    
    // Setup scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(theme.background);
    scene.fog = new THREE.Fog(theme.fog, 50, 200);
    sceneRef.current = scene;
    
    // Setup camera
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 100;
    cameraRef.current = camera;
    
    // Setup renderer
    const renderer = new THREE.WebGLRenderer({ 
      antialias: !isMobile,
      alpha: false,
      powerPreference: 'high-performance'
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;
    
    // Add lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(50, 50, 50);
    scene.add(directionalLight);
    
    // Create particle system
    const particleSystem = new ParticleSystem(adjustedParticleCount, theme.particles);
    scene.add(particleSystem.getMesh());
    particleSystemRef.current = particleSystem;
    
    // Create shapes
    const shapeRenderer = new ShapeRenderer(adjustedShapeCount, theme.shapes);
    shapeRenderer.getShapes().forEach(shape => scene.add(shape));
    shapeRendererRef.current = shapeRenderer;
    
    // Animation loop
    let lastTime = performance.now();
    const animate = () => {
      const currentTime = performance.now();
      const deltaTime = (currentTime - lastTime) * 0.001 * animationSpeed;
      lastTime = currentTime;
      
      // Update particles
      particleSystem.update(
        deltaTime, 
        mouseRef.current.x, 
        mouseRef.current.y,
        enableInteraction
      );
      
      // Update shapes
      shapeRenderer.update(deltaTime);
      
      // Render
      renderer.render(scene, camera);
      
      frameIdRef.current = requestAnimationFrame(animate);
    };
    animate();
    
    // Mouse move handler
    const handleMouseMove = (event: MouseEvent) => {
      if (!enableInteraction) return;
      
      mouseRef.current.x = (event.clientX / window.innerWidth) * 200 - 100;
      mouseRef.current.y = -(event.clientY / window.innerHeight) * 200 + 100;
      
      if (enableParallax && cameraRef.current) {
        cameraRef.current.position.x = mouseRef.current.x * 0.05;
        cameraRef.current.position.y = mouseRef.current.y * 0.05;
      }
    };
    
    // Resize handler
    const handleResize = () => {
      if (!cameraRef.current || !rendererRef.current) return;
      
      cameraRef.current.aspect = window.innerWidth / window.innerHeight;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(window.innerWidth, window.innerHeight);
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('resize', handleResize);
    
    // Cleanup
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(frameIdRef.current);
      
      particleSystem.dispose();
      shapeRenderer.dispose();
      renderer.dispose();
      
      if (containerRef.current && renderer.domElement) {
        containerRef.current.removeChild(renderer.domElement);
      }
    };
  }, [preset, particleCount, shapeCount, animationSpeed, enableInteraction, enableParallax, quality]);
  
  return (
    <div 
      ref={containerRef} 
      className={`fixed inset-0 -z-10 ${className}`}
      aria-hidden="true"
    />
  );
}
```

#### Step 2.5: Update Homepage to Use Animation

File: `/src/app/page.tsx` (update)

```typescript
import { ThreeJSBackground } from '@/components/animations/ThreeJSBackground';
// ... other imports

export default async function HomePage() {
  // ... existing code
  
  // Fetch homepage config
  const homepageConfig = await getHomepageConfig(); // Implement this function
  
  return (
    <>
      {/* Three.js Background */}
      {homepageConfig.animationEnabled && (
        <ThreeJSBackground
          preset={homepageConfig.animationPreset}
          particleCount={homepageConfig.particleCount}
          shapeCount={homepageConfig.shapeCount}
          animationSpeed={homepageConfig.animationSpeed}
          enableInteraction={homepageConfig.enableInteraction}
          enableParallax={homepageConfig.enableParallax}
          quality={homepageConfig.quality}
        />
      )}
      
      {/* Existing content */}
      <div className="relative z-10">
        {/* ... rest of homepage */}
      </div>
    </>
  );
}
```

### Phase 3: Admin Panel Integration (Days 4-5)

#### Step 3.1: Create API Routes

File: `/src/app/api/admin/homepage/config/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/options';
import { prisma } from '@/lib/prisma';
import { hasPermission } from '@/lib/auth/rbac';

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !hasPermission(session.user.role, 'admin')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Get active config
    const config = await prisma.homepageConfig.findFirst({
      where: { active: true },
      orderBy: { version: 'desc' }
    });
    
    return NextResponse.json({ success: true, data: config || getDefaultConfig() });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch config' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !hasPermission(session.user.role, 'admin')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const data = await req.json();
    
    // Create new config version
    const config = await prisma.homepageConfig.create({
      data: {
        ...data,
        updatedBy: session.user.id,
        version: await getNextVersion(),
      }
    });
    
    return NextResponse.json({ 
      success: true, 
      message: 'Configuration saved',
      data: config 
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to save config' }, { status: 500 });
  }
}

function getDefaultConfig() {
  return {
    heroTitle: "Welcome to Smart Carbon-Free Village",
    heroSubtitle: "Experience Damday Village...",
    animationEnabled: true,
    animationPreset: "nature",
    particleCount: 1000,
    shapeCount: 4,
    animationSpeed: 1.0,
    enableInteraction: true,
    enableParallax: true,
    quality: "auto",
    showStats: true,
    // ... other defaults
  };
}

async function getNextVersion(): Promise<number> {
  const latest = await prisma.homepageConfig.findFirst({
    orderBy: { version: 'desc' }
  });
  return (latest?.version || 0) + 1;
}
```

File: `/src/app/api/admin/homepage/publish/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/options';
import { prisma } from '@/lib/prisma';
import { hasPermission } from '@/lib/auth/rbac';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !hasPermission(session.user.role, 'admin')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const { configId } = await req.json();
    
    // Deactivate all configs
    await prisma.homepageConfig.updateMany({
      where: { active: true },
      data: { active: false }
    });
    
    // Activate selected config
    const config = await prisma.homepageConfig.update({
      where: { id: configId },
      data: { 
        active: true,
        publishedAt: new Date()
      }
    });
    
    return NextResponse.json({ 
      success: true, 
      message: 'Configuration published',
      data: config 
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to publish config' }, { status: 500 });
  }
}
```

File: `/src/app/api/public/homepage/config/route.ts`

```typescript
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // Get active published config
    const config = await prisma.homepageConfig.findFirst({
      where: { 
        active: true,
        publishedAt: { not: null }
      },
      select: {
        heroTitle: true,
        heroSubtitle: true,
        heroImage: true,
        animationEnabled: true,
        animationPreset: true,
        particleCount: true,
        shapeCount: true,
        animationSpeed: true,
        enableInteraction: true,
        enableParallax: true,
        quality: true,
        showStats: true,
        statsToShow: true,
        ctaButtons: true,
        // ... public fields only
      }
    });
    
    return NextResponse.json({ 
      success: true, 
      data: config || getDefaultConfig() 
    });
  } catch (error) {
    return NextResponse.json({ 
      success: true, 
      data: getDefaultConfig() 
    });
  }
}

function getDefaultConfig() {
  // Same as admin route default
  return {
    heroTitle: "Welcome to Smart Carbon-Free Village",
    // ... defaults
  };
}
```


#### Step 3.2: Create Admin Panel Page

File: `/src/app/admin-panel/homepage-editor/page.tsx`

```typescript
'use client';

import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/lib/components/ui/tabs';
import { Button } from '@/lib/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/lib/components/ui/Card';
import { Input } from '@/lib/components/ui/Input';
import { Textarea } from '@/lib/components/ui/Textarea';
import { Switch } from '@/lib/components/ui/Switch';
import { Slider } from '@/lib/components/ui/Slider';
import { Select } from '@/lib/components/ui/Select';
import { toast } from '@/lib/components/ui/Toast';
import { HomepageConfig } from '@/types/homepage';

export default function HomepageEditorPage() {
  const [config, setConfig] = useState<HomepageConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  useEffect(() => {
    fetchConfig();
  }, []);
  
  async function fetchConfig() {
    try {
      const response = await fetch('/api/admin/homepage/config');
      const data = await response.json();
      setConfig(data.data);
    } catch (error) {
      toast.error('Failed to load configuration');
    } finally {
      setLoading(false);
    }
  }
  
  async function saveConfig() {
    setSaving(true);
    try {
      const response = await fetch('/api/admin/homepage/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config),
      });
      const data = await response.json();
      
      if (data.success) {
        toast.success('Configuration saved');
      } else {
        toast.error(data.error || 'Failed to save');
      }
    } catch (error) {
      toast.error('Failed to save configuration');
    } finally {
      setSaving(false);
    }
  }
  
  async function publishConfig() {
    if (!config) return;
    
    try {
      const response = await fetch('/api/admin/homepage/publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ configId: config.id }),
      });
      const data = await response.json();
      
      if (data.success) {
        toast.success('Configuration published!');
      } else {
        toast.error(data.error || 'Failed to publish');
      }
    } catch (error) {
      toast.error('Failed to publish configuration');
    }
  }
  
  if (loading) return <div>Loading...</div>;
  if (!config) return <div>No configuration found</div>;
  
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Homepage Editor</h1>
          <p className="text-gray-600 mt-2">Customize your homepage appearance and content</p>
        </div>
        <div className="flex gap-4">
          <Button variant="outline" onClick={fetchConfig}>
            Refresh
          </Button>
          <Button variant="outline" onClick={saveConfig} disabled={saving}>
            {saving ? 'Saving...' : 'Save Draft'}
          </Button>
          <Button variant="primary" onClick={publishConfig}>
            Publish
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="hero" className="space-y-6">
        <TabsList className="grid grid-cols-5 w-full max-w-4xl">
          <TabsTrigger value="hero">Hero</TabsTrigger>
          <TabsTrigger value="animations">Animations</TabsTrigger>
          <TabsTrigger value="stats">Statistics</TabsTrigger>
          <TabsTrigger value="featured">Featured</TabsTrigger>
          <TabsTrigger value="ctas">CTAs</TabsTrigger>
        </TabsList>
        
        {/* Hero Section Tab */}
        <TabsContent value="hero">
          <Card>
            <CardHeader>
              <CardTitle>Hero Section</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Hero Title</label>
                <Input
                  value={config.heroTitle}
                  onChange={(e) => setConfig({ ...config, heroTitle: e.target.value })}
                  maxLength={100}
                  placeholder="Welcome to..."
                />
                <p className="text-xs text-gray-500 mt-1">
                  {config.heroTitle.length}/100 characters
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Hero Subtitle</label>
                <Textarea
                  value={config.heroSubtitle}
                  onChange={(e) => setConfig({ ...config, heroSubtitle: e.target.value })}
                  maxLength={300}
                  rows={4}
                  placeholder="Experience..."
                />
                <p className="text-xs text-gray-500 mt-1">
                  {config.heroSubtitle.length}/300 characters
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Background Image (Optional)</label>
                <Button variant="outline" onClick={() => {}}>
                  Choose from Media Library
                </Button>
                {config.heroImage && (
                  <div className="mt-2">
                    <img src={config.heroImage} alt="Hero" className="h-32 object-cover rounded" />
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => setConfig({ ...config, heroImage: undefined })}
                    >
                      Remove
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Animations Tab */}
        <TabsContent value="animations">
          <Card>
            <CardHeader>
              <CardTitle>Animation Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium">Enable Background Animation</label>
                  <p className="text-xs text-gray-500">Three.js animated background</p>
                </div>
                <Switch
                  checked={config.animationEnabled}
                  onCheckedChange={(checked) => 
                    setConfig({ ...config, animationEnabled: checked })
                  }
                />
              </div>
              
              {config.animationEnabled && (
                <>
                  <div>
                    <label className="block text-sm font-medium mb-2">Animation Preset</label>
                    <div className="grid grid-cols-2 gap-4">
                      {['nature', 'tech', 'sunset', 'night'].map((preset) => (
                        <button
                          key={preset}
                          onClick={() => setConfig({ ...config, animationPreset: preset as any })}
                          className={`p-4 border rounded-lg ${
                            config.animationPreset === preset 
                              ? 'border-primary-500 bg-primary-50' 
                              : 'border-gray-200'
                          }`}
                        >
                          <div className="font-medium capitalize">{preset}</div>
                          <div className="text-xs text-gray-500">Preview</div>
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Particle Count: {config.particleCount}
                    </label>
                    <Slider
                      value={[config.particleCount]}
                      onValueChange={([value]) => 
                        setConfig({ ...config, particleCount: value })
                      }
                      min={100}
                      max={2000}
                      step={100}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      More particles = more beautiful but slower performance
                    </p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Shape Count: {config.shapeCount}
                    </label>
                    <Slider
                      value={[config.shapeCount]}
                      onValueChange={([value]) => 
                        setConfig({ ...config, shapeCount: value })
                      }
                      min={0}
                      max={5}
                      step={1}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Animation Speed: {config.animationSpeed}x
                    </label>
                    <Slider
                      value={[config.animationSpeed]}
                      onValueChange={([value]) => 
                        setConfig({ ...config, animationSpeed: value })
                      }
                      min={0.5}
                      max={2.0}
                      step={0.1}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium">Mouse Interaction</label>
                      <p className="text-xs text-gray-500">Particles follow cursor</p>
                    </div>
                    <Switch
                      checked={config.enableInteraction}
                      onCheckedChange={(checked) => 
                        setConfig({ ...config, enableInteraction: checked })
                      }
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium">Parallax Scrolling</label>
                      <p className="text-xs text-gray-500">Camera moves with scroll</p>
                    </div>
                    <Switch
                      checked={config.enableParallax}
                      onCheckedChange={(checked) => 
                        setConfig({ ...config, enableParallax: checked })
                      }
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Quality</label>
                    <Select
                      value={config.quality}
                      onValueChange={(value) => 
                        setConfig({ ...config, quality: value as any })
                      }
                    >
                      <option value="auto">Auto-detect</option>
                      <option value="ultra">Ultra (2000 particles)</option>
                      <option value="high">High (1000 particles)</option>
                      <option value="medium">Medium (500 particles)</option>
                      <option value="low">Low (300 particles)</option>
                    </Select>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Other tabs: Stats, Featured, CTAs */}
        {/* Implement similarly... */}
      </Tabs>
    </div>
  );
}
```

### Phase 4: Testing (Day 6)

#### Step 4.1: Setup Playwright

File: `playwright.config.ts`

```typescript
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] },
    },
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
});
```

#### Step 4.2: Create Homepage Tests

File: `tests/e2e/homepage.spec.ts`

```typescript
import { test, expect } from '@playwright/test';

test.describe('Homepage', () => {
  test('should load successfully', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Smart Carbon-Free Village/);
  });
  
  test('should display hero section', async ({ page }) => {
    await page.goto('/');
    
    const heroTitle = page.locator('h1');
    await expect(heroTitle).toContainText('Welcome to');
    
    const heroSubtitle = page.locator('p').first();
    await expect(heroSubtitle).toContainText('Damday Village');
  });
  
  test('should display statistics', async ({ page }) => {
    await page.goto('/');
    
    // Wait for stats to load
    await page.waitForSelector('[data-testid="stats-section"]');
    
    // Check if stats are visible
    await expect(page.locator('text=Total Homestays')).toBeVisible();
    await expect(page.locator('text=Total Products')).toBeVisible();
  });
  
  test('should render Three.js canvas', async ({ page }) => {
    await page.goto('/');
    
    // Wait for canvas to be created
    const canvas = page.locator('canvas');
    await expect(canvas).toBeVisible();
    
    // Check canvas dimensions
    const box = await canvas.boundingBox();
    expect(box).not.toBeNull();
    expect(box!.width).toBeGreaterThan(0);
    expect(box!.height).toBeGreaterThan(0);
  });
  
  test('should have CTA buttons', async ({ page }) => {
    await page.goto('/');
    
    await expect(page.locator('text=Explore Digital Twin')).toBeVisible();
    await expect(page.locator('text=360° Village Tour')).toBeVisible();
    await expect(page.locator('text=Browse Homestays')).toBeVisible();
  });
  
  test('should be mobile responsive', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    
    // Check if content adapts to mobile
    const heroTitle = page.locator('h1');
    await expect(heroTitle).toBeVisible();
    
    // Stats should stack vertically
    const statsSection = page.locator('[data-testid="stats-section"]');
    await expect(statsSection).toBeVisible();
  });
  
  test('should load featured homestays', async ({ page }) => {
    await page.goto('/');
    
    await page.waitForSelector('[data-testid="featured-homestays"]');
    
    const homestayCards = page.locator('[data-testid="homestay-card"]');
    const count = await homestayCards.count();
    
    expect(count).toBeGreaterThan(0);
    expect(count).toBeLessThanOrEqual(6);
  });
  
  test('should take screenshot of homepage', async ({ page }) => {
    await page.goto('/');
    
    // Wait for animations to settle
    await page.waitForTimeout(2000);
    
    // Take full page screenshot
    await page.screenshot({ 
      path: 'tests/screenshots/homepage-full.png',
      fullPage: true
    });
    
    // Take viewport screenshot
    await page.screenshot({ 
      path: 'tests/screenshots/homepage-viewport.png'
    });
  });
});

test.describe('Homepage Animation Performance', () => {
  test('should achieve 30+ FPS', async ({ page }) => {
    await page.goto('/');
    
    // Monitor FPS for 5 seconds
    let frameCount = 0;
    await page.evaluate(() => {
      let lastTime = performance.now();
      
      function countFrames() {
        frameCount++;
        requestAnimationFrame(countFrames);
      }
      countFrames();
      
      return new Promise(resolve => {
        setTimeout(() => {
          const elapsed = performance.now() - lastTime;
          const fps = (frameCount / elapsed) * 1000;
          resolve(fps);
        }, 5000);
      });
    });
    
    // FPS should be at least 30
    // Note: This is a simplified test
  });
});
```

#### Step 4.3: Create Admin Panel Tests

File: `tests/e2e/admin-homepage-editor.spec.ts`

```typescript
import { test, expect } from '@playwright/test';

test.describe('Admin Homepage Editor', () => {
  test.beforeEach(async ({ page }) => {
    // Login as admin first
    await page.goto('/admin-panel/login');
    await page.fill('input[name="email"]', 'admin@damdayvillage.org');
    await page.fill('input[name="password"]', 'Admin@123');
    await page.click('button[type="submit"]');
    await page.waitForURL('/admin-panel');
  });
  
  test('should navigate to homepage editor', async ({ page }) => {
    await page.goto('/admin-panel/homepage-editor');
    
    await expect(page).toHaveTitle(/Homepage Editor/);
    await expect(page.locator('h1')).toContainText('Homepage Editor');
  });
  
  test('should load current configuration', async ({ page }) => {
    await page.goto('/admin-panel/homepage-editor');
    
    // Wait for config to load
    await page.waitForSelector('input[value*="Welcome"]', { timeout: 5000 });
    
    const heroTitle = page.locator('input[placeholder*="Welcome"]');
    await expect(heroTitle).not.toHaveValue('');
  });
  
  test('should update hero title', async ({ page }) => {
    await page.goto('/admin-panel/homepage-editor');
    
    // Go to Hero tab
    await page.click('button[value="hero"]');
    
    // Update title
    const titleInput = page.locator('label:has-text("Hero Title") + input');
    await titleInput.fill('New Homepage Title');
    
    // Save
    await page.click('button:has-text("Save Draft")');
    
    // Wait for success message
    await expect(page.locator('text=Configuration saved')).toBeVisible({ timeout: 5000 });
  });
  
  test('should toggle animation on/off', async ({ page }) => {
    await page.goto('/admin-panel/homepage-editor');
    
    // Go to Animations tab
    await page.click('button[value="animations"]');
    
    // Toggle animation switch
    const animationSwitch = page.locator('text=Enable Background Animation').locator('..').locator('button[role="switch"]');
    await animationSwitch.click();
    
    // Save
    await page.click('button:has-text("Save Draft")');
    await page.waitForTimeout(1000);
  });
  
  test('should change animation preset', async ({ page }) => {
    await page.goto('/admin-panel/homepage-editor');
    
    // Go to Animations tab
    await page.click('button[value="animations"]');
    
    // Select tech preset
    await page.click('button:has-text("Tech")');
    
    // Verify selection
    await expect(page.locator('button:has-text("Tech")')).toHaveClass(/border-primary-500/);
    
    // Save
    await page.click('button:has-text("Save Draft")');
  });
  
  test('should adjust particle count', async ({ page }) => {
    await page.goto('/admin-panel/homepage-editor');
    
    // Go to Animations tab
    await page.click('button[value="animations"]');
    
    // Find slider and drag
    const slider = page.locator('label:has-text("Particle Count") ~ div[role="slider"]');
    const sliderBox = await slider.boundingBox();
    
    if (sliderBox) {
      // Drag to middle
      await page.mouse.move(sliderBox.x, sliderBox.y);
      await page.mouse.down();
      await page.mouse.move(sliderBox.x + sliderBox.width / 2, sliderBox.y);
      await page.mouse.up();
    }
    
    // Save
    await page.click('button:has-text("Save Draft")');
  });
  
  test('should publish configuration', async ({ page }) => {
    await page.goto('/admin-panel/homepage-editor');
    
    // Click publish
    await page.click('button:has-text("Publish")');
    
    // Wait for success
    await expect(page.locator('text=Configuration published')).toBeVisible({ timeout: 5000 });
  });
  
  test('should take screenshots of admin panel', async ({ page }) => {
    await page.goto('/admin-panel/homepage-editor');
    
    // Hero tab screenshot
    await page.click('button[value="hero"]');
    await page.screenshot({ 
      path: 'tests/screenshots/admin-hero-tab.png'
    });
    
    // Animations tab screenshot
    await page.click('button[value="animations"]');
    await page.screenshot({ 
      path: 'tests/screenshots/admin-animations-tab.png'
    });
    
    // Stats tab screenshot
    await page.click('button[value="stats"]');
    await page.screenshot({ 
      path: 'tests/screenshots/admin-stats-tab.png'
    });
  });
});
```

#### Step 4.4: Run Tests

```bash
# Run all tests
npm run test:e2e

# Run specific test file
npx playwright test homepage.spec.ts

# Run tests in headed mode (see browser)
npx playwright test --headed

# Run tests in debug mode
npx playwright test --debug

# Generate HTML report
npx playwright show-report
```

---

## Debugging & Troubleshooting

### Common Issues and Solutions

#### Issue 1: Three.js Canvas Not Rendering

**Symptoms**:
- Blank background
- Console error: "WebGL not supported"
- Black screen

**Solutions**:
1. **Check WebGL Support**:
```typescript
// Add to ThreeJSBackground component
useEffect(() => {
  const canvas = document.createElement('canvas');
  const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
  
  if (!gl) {
    console.error('WebGL not supported');
    // Show fallback
    return;
  }
}, []);
```

2. **Check Browser Compatibility**:
- Update browser to latest version
- Enable hardware acceleration
- Test in different browser

3. **Reduce Quality**:
```typescript
// Try with minimal settings
<ThreeJSBackground
  particleCount={100}
  shapeCount={0}
  quality="low"
/>
```

#### Issue 2: Poor Performance / Low FPS

**Symptoms**:
- Laggy animations
- High CPU usage
- Browser freezing

**Solutions**:
1. **Reduce Particle Count**:
```typescript
// Mobile detection
const isMobile = window.innerWidth < 768;
const particleCount = isMobile ? 200 : 1000;
```

2. **Disable Heavy Features**:
```typescript
// Disable on low-end devices
if (navigator.hardwareConcurrency < 4) {
  animationEnabled = false;
}
```

3. **Use requestIdleCallback**:
```typescript
// Update particles only when browser is idle
requestIdleCallback(() => {
  particleSystem.update(deltaTime);
});
```

4. **Implement FPS-based Quality Adjustment**:
```typescript
let fps = 60;
let adjustmentTimer = 0;

function checkPerformance() {
  if (fps < 30 && adjustmentTimer++ > 60) {
    reduceQuality();
    adjustmentTimer = 0;
  }
}
```

#### Issue 3: Memory Leaks

**Symptoms**:
- Memory usage increases over time
- Browser becomes slower
- Eventually crashes

**Solutions**:
1. **Proper Cleanup**:
```typescript
useEffect(() => {
  // ... setup code
  
  return () => {
    // Dispose geometries
    particleSystem.dispose();
    shapeRenderer.dispose();
    
    // Dispose renderer
    renderer.dispose();
    
    // Remove from DOM
    if (container && renderer.domElement) {
      container.removeChild(renderer.domElement);
    }
    
    // Cancel animation frame
    cancelAnimationFrame(frameId);
  };
}, []);
```

2. **Dispose Materials**:
```typescript
class ParticleSystem {
  dispose() {
    this.geometry.dispose();
    this.material.dispose();
    
    // Clear references
    this.particles = null;
    this.geometry = null;
    this.material = null;
  }
}
```

#### Issue 4: Admin Panel Not Saving

**Symptoms**:
- Save button doesn't work
- No success/error message
- Changes don't persist

**Solutions**:
1. **Check Console for Errors**:
```bash
# Browser console
# Look for 401 Unauthorized or 500 errors
```

2. **Verify API Route**:
```typescript
// Test API directly
fetch('/api/admin/homepage/config', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(testConfig)
})
.then(r => r.json())
.then(console.log)
.catch(console.error);
```

3. **Check Authentication**:
```typescript
// Verify session
const session = await getServerSession(authOptions);
console.log('Session:', session);
console.log('Has permission:', hasPermission(session?.user?.role, 'admin'));
```

4. **Check Database Connection**:
```bash
# Test database
npm run db:studio

# Check logs
tail -f /var/log/postgresql/postgresql.log
```

#### Issue 5: Typescript Errors

**Symptoms**:
- Type errors in IDE
- Build fails with type errors

**Solutions**:
1. **Install Type Definitions**:
```bash
npm install --save-dev @types/three
```

2. **Create Missing Types**:
```typescript
// src/types/three-extensions.d.ts
import 'three';

declare module 'three' {
  interface Vector3 {
    // Add custom methods
  }
}
```

3. **Use Type Assertions (Last Resort)**:
```typescript
const material = new THREE.PointsMaterial({
  // ...
}) as THREE.PointsMaterial;
```

#### Issue 6: Animations Not Smooth

**Symptoms**:
- Jerky movement
- Inconsistent frame times
- Stuttering

**Solutions**:
1. **Use Delta Time**:
```typescript
let lastTime = performance.now();

function animate() {
  const currentTime = performance.now();
  const deltaTime = (currentTime - lastTime) * 0.001;
  lastTime = currentTime;
  
  // Use deltaTime for consistent animation
  particleSystem.update(deltaTime);
  
  requestAnimationFrame(animate);
}
```

2. **Avoid Layout Thrashing**:
```typescript
// Bad: Multiple reads/writes
element.style.top = element.offsetTop + 10 + 'px';
element.style.left = element.offsetLeft + 10 + 'px';

// Good: Batch reads, then batch writes
const top = element.offsetTop;
const left = element.offsetLeft;
element.style.top = top + 10 + 'px';
element.style.left = left + 10 + 'px';
```

3. **Use CSS Transforms**:
```typescript
// GPU-accelerated
element.style.transform = `translate3d(${x}px, ${y}px, 0)`;

// Instead of
element.style.left = x + 'px';
element.style.top = y + 'px';
```

### Debugging Tools

#### Chrome DevTools

1. **Performance Tab**:
- Record while animating
- Look for long tasks (>50ms)
- Check FPS meter
- Identify bottlenecks

2. **Memory Tab**:
- Take heap snapshots
- Look for detached DOM nodes
- Check for growing memory

3. **Console**:
```typescript
// Add performance logging
console.time('particle-update');
particleSystem.update(deltaTime);
console.timeEnd('particle-update');

// Log FPS
let fps = 0;
setInterval(() => {
  console.log('FPS:', fps);
  fps = 0;
}, 1000);

function animate() {
  fps++;
  // ... animation code
}
```

#### Three.js Stats

```typescript
import Stats from 'three/examples/jsm/libs/stats.module';

const stats = Stats();
document.body.appendChild(stats.dom);

function animate() {
  stats.begin();
  
  // ... render code
  
  stats.end();
  requestAnimationFrame(animate);
}
```

---

## Testing with Playwright

### Test Execution Guide

#### Running Tests Locally

```bash
# Install Playwright browsers
npx playwright install

# Run all tests
npx playwright test

# Run specific browser
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit

# Run mobile tests
npx playwright test --project="Mobile Chrome"
npx playwright test --project="Mobile Safari"

# Run specific test file
npx playwright test tests/e2e/homepage.spec.ts

# Run in headed mode (see browser)
npx playwright test --headed

# Run in UI mode (interactive)
npx playwright test --ui

# Debug mode (step through)
npx playwright test --debug

# Run with specific timeout
npx playwright test --timeout=60000
```

#### Generating Test Reports

```bash
# Run tests and generate HTML report
npx playwright test --reporter=html

# Show report
npx playwright show-report

# Generate JSON report
npx playwright test --reporter=json

# Generate JUnit XML (for CI)
npx playwright test --reporter=junit
```

#### Taking Screenshots During Tests

```typescript
// In test file
test('screenshot test', async ({ page }) => {
  await page.goto('/');
  
  // Full page screenshot
  await page.screenshot({ 
    path: 'screenshots/homepage-full.png',
    fullPage: true 
  });
  
  // Viewport screenshot
  await page.screenshot({ 
    path: 'screenshots/homepage-viewport.png'
  });
  
  // Element screenshot
  await page.locator('.hero-section').screenshot({ 
    path: 'screenshots/hero.png'
  });
  
  // With mask (hide dynamic content)
  await page.screenshot({
    path: 'screenshots/masked.png',
    mask: [page.locator('.timestamp')]
  });
});
```

### Screenshot Documentation

All screenshots taken during Playwright tests are saved to `tests/screenshots/` directory.

**Homepage Screenshots**:
- `homepage-full.png` - Full page screenshot
- `homepage-viewport.png` - Above-the-fold content
- `homepage-hero.png` - Hero section only
- `homepage-stats.png` - Statistics section
- `homepage-homestays.png` - Featured homestays
- `homepage-products.png` - Featured products
- `homepage-mobile.png` - Mobile view

**Admin Panel Screenshots**:
- `admin-homepage-editor.png` - Main editor page
- `admin-hero-tab.png` - Hero section editor
- `admin-animations-tab.png` - Animation controls
- `admin-stats-tab.png` - Statistics configuration
- `admin-featured-tab.png` - Featured content selector
- `admin-ctas-tab.png` - CTA buttons manager

**Animation Screenshots**:
- `animation-nature.png` - Nature theme animation
- `animation-tech.png` - Tech theme animation
- `animation-sunset.png` - Sunset theme animation
- `animation-night.png` - Night theme animation

### Visual Regression Testing

```typescript
// tests/e2e/visual-regression.spec.ts
import { test, expect } from '@playwright/test';

test('homepage visual regression', async ({ page }) => {
  await page.goto('/');
  
  // Wait for animations to settle
  await page.waitForTimeout(2000);
  
  // Take screenshot and compare
  await expect(page).toHaveScreenshot('homepage.png', {
    maxDiffPixels: 100, // Allow small differences
    threshold: 0.2 // 20% threshold
  });
});
```


### CI/CD Integration

#### GitHub Actions Workflow

File: `.github/workflows/playwright.yml`

```yaml
name: Playwright Tests

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    timeout-minutes: 60
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
    
    - uses: actions/setup-node@v3
      with:
        node-version: 20
        
    - name: Install dependencies
      run: npm ci
      
    - name: Install Playwright Browsers
      run: npx playwright install --with-deps
      
    - name: Run Playwright tests
      run: npx playwright test
      
    - uses: actions/upload-artifact@v3
      if: always()
      with:
        name: playwright-report
        path: playwright-report/
        retention-days: 30
        
    - uses: actions/upload-artifact@v3
      if: always()
      with:
        name: screenshots
        path: tests/screenshots/
        retention-days: 30
```

---

## Screenshots & Visual Documentation

### Homepage Before & After

#### Before Enhancement
- Static gradient background
- Basic hero section
- Plain statistics display
- Simple card layouts

#### After Enhancement
- ✨ Animated Three.js particle background
- 🎨 Dynamic geometric shapes
- 🖱️ Interactive mouse tracking
- 📱 Responsive on all devices
- 🎭 Multiple theme presets
- ⚡ Smooth 60 FPS animations
- 🎯 Professional, modern design

### Expected Screenshots

**Desktop View (1920x1080)**:
1. `desktop-nature-theme.png` - Nature theme with green particles
2. `desktop-tech-theme.png` - Tech theme with blue particles
3. `desktop-sunset-theme.png` - Sunset theme with orange particles
4. `desktop-night-theme.png` - Night theme with purple particles

**Mobile View (375x667)**:
1. `mobile-homepage.png` - Mobile responsive layout
2. `mobile-hero.png` - Hero section on mobile
3. `mobile-stats.png` - Statistics on mobile
4. `mobile-cta.png` - Call-to-action buttons stacked

**Admin Panel**:
1. `admin-dashboard.png` - Homepage editor dashboard
2. `admin-hero-editor.png` - Hero section configuration
3. `admin-animation-controls.png` - Animation settings panel
4. `admin-preview.png` - Live preview of changes

**Animation States**:
1. `animation-idle.png` - Static state
2. `animation-hover.png` - Mouse interaction
3. `animation-scroll.png` - Parallax effect
4. `animation-mobile.png` - Reduced motion

### Screenshot Capture Script

File: `scripts/capture-screenshots.ts`

```typescript
import { chromium } from '@playwright/test';
import { mkdirSync } from 'fs';

async function captureScreenshots() {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();
  
  // Ensure directory exists
  mkdirSync('docs/screenshots', { recursive: true });
  
  // Desktop screenshots
  await page.setViewportSize({ width: 1920, height: 1080 });
  
  const themes = ['nature', 'tech', 'sunset', 'night'];
  
  for (const theme of themes) {
    // Navigate and set theme (would require API call in real implementation)
    await page.goto('/');
    await page.waitForTimeout(3000); // Let animation settle
    
    await page.screenshot({
      path: `docs/screenshots/desktop-${theme}-theme.png`,
      fullPage: false
    });
  }
  
  // Mobile screenshots
  await page.setViewportSize({ width: 375, height: 667 });
  await page.goto('/');
  await page.waitForTimeout(2000);
  
  await page.screenshot({
    path: 'docs/screenshots/mobile-homepage.png',
    fullPage: true
  });
  
  // Admin panel (would require login)
  // ... additional screenshots
  
  await browser.close();
  console.log('Screenshots captured successfully!');
}

captureScreenshots().catch(console.error);
```

Run with:
```bash
npx ts-node scripts/capture-screenshots.ts
```

---

## Performance Optimization

### Lighthouse Targets

**Performance Goals**:
- Performance Score: > 90
- First Contentful Paint: < 1.5s
- Speed Index: < 2.5s
- Time to Interactive: < 3.0s
- Total Blocking Time: < 300ms
- Cumulative Layout Shift: < 0.1
- Largest Contentful Paint: < 2.5s

### Optimization Strategies

#### 1. Code Splitting

```typescript
// Lazy load Three.js component
const ThreeJSBackground = dynamic(
  () => import('@/components/animations/ThreeJSBackground'),
  { 
    ssr: false,
    loading: () => <div className="loading-placeholder">Loading animation...</div>
  }
);
```

#### 2. Image Optimization

```typescript
// Use Next.js Image component
import Image from 'next/image';

<Image
  src="/hero-image.jpg"
  alt="Damday Village"
  width={1920}
  height={1080}
  priority // For above-the-fold images
  quality={85}
  placeholder="blur"
  blurDataURL="data:image/jpeg;base64,..."
/>
```

#### 3. Font Optimization

```typescript
// Use Next.js Font optimization
import { Inter, Playfair_Display } from 'next/font/google';

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter'
});

const playfair = Playfair_Display({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-display'
});
```

#### 4. Reduce JavaScript Bundle

```typescript
// Tree-shake Three.js
import { Scene, PerspectiveCamera, WebGLRenderer } from 'three';

// Instead of
import * as THREE from 'three';
```

#### 5. Service Worker Caching

File: `public/sw.js` (generated by next-pwa)

```javascript
// Cache Three.js scripts
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open('three-cache-v1').then((cache) => {
      return cache.addAll([
        '/animations/ThreeJSBackground.js',
        '/lib/three/ParticleSystem.js',
        '/lib/three/ShapeRenderer.js'
      ]);
    })
  );
});
```

#### 6. Reduce Animation on Slow Devices

```typescript
useEffect(() => {
  // Check connection speed
  const connection = (navigator as any).connection;
  if (connection && connection.effectiveType === '2g') {
    setAnimationEnabled(false);
  }
  
  // Check battery
  if ('getBattery' in navigator) {
    (navigator as any).getBattery().then((battery: any) => {
      if (battery.level < 0.2) {
        setAnimationEnabled(false);
      }
    });
  }
  
  // Detect low-end device
  if (navigator.hardwareConcurrency < 4) {
    setQuality('low');
  }
}, []);
```

#### 7. Intersection Observer for Lazy Content

```typescript
const [isVisible, setIsVisible] = useState(false);
const ref = useRef<HTMLDivElement>(null);

useEffect(() => {
  const observer = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true);
        observer.disconnect();
      }
    },
    { threshold: 0.1 }
  );
  
  if (ref.current) {
    observer.observe(ref.current);
  }
  
  return () => observer.disconnect();
}, []);

return (
  <div ref={ref}>
    {isVisible ? <HeavyComponent /> : <Placeholder />}
  </div>
);
```

### Performance Monitoring

```typescript
// Add to ThreeJSBackground component
const [performanceMetrics, setPerformanceMetrics] = useState({
  fps: 0,
  memoryUsage: 0,
  renderTime: 0
});

useEffect(() => {
  let frameCount = 0;
  let lastTime = performance.now();
  
  const measurePerformance = () => {
    frameCount++;
    const currentTime = performance.now();
    
    if (currentTime >= lastTime + 1000) {
      const fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
      
      // Get memory usage (Chrome only)
      const memory = (performance as any).memory;
      const memoryUsage = memory ? Math.round(memory.usedJSHeapSize / 1048576) : 0;
      
      setPerformanceMetrics({
        fps,
        memoryUsage,
        renderTime: Math.round(currentTime - lastTime)
      });
      
      frameCount = 0;
      lastTime = currentTime;
      
      // Auto-adjust quality
      if (fps < 25) {
        // Reduce quality
        setParticleCount(prev => Math.max(100, prev - 100));
      }
    }
    
    requestAnimationFrame(measurePerformance);
  };
  
  measurePerformance();
}, []);

// Display in dev mode
{process.env.NODE_ENV === 'development' && (
  <div className="fixed top-4 right-4 bg-black/80 text-white p-4 rounded text-sm">
    <div>FPS: {performanceMetrics.fps}</div>
    <div>Memory: {performanceMetrics.memoryUsage}MB</div>
    <div>Particles: {particleCount}</div>
  </div>
)}
```

---

## Future Enhancements

### Phase 1 Enhancements (Next 3 Months)

1. **Advanced Animation Presets** (2 weeks)
   - Seasonal animations (snow, rain, leaves)
   - Festival themes (Diwali, Holi, Christmas)
   - Event-specific animations

2. **Video Background Option** (1 week)
   - Upload video files
   - YouTube/Vimeo integration
   - Auto-play with controls

3. **A/B Testing Framework** (2 weeks)
   - Create variants
   - Split traffic
   - Track metrics
   - Statistical analysis

4. **Mobile-First Optimizations** (1 week)
   - Touch interactions
   - Battery-aware animations
   - Reduced motion support
   - Better mobile controls

### Phase 2 Enhancements (Next 6 Months)

1. **WebXR Integration** (4 weeks)
   - VR mode for immersive experience
   - AR mode for mobile devices
   - 360° panorama integration
   - Interactive hotspots

2. **AI-Powered Personalization** (4 weeks)
   - User behavior analysis
   - Dynamic content recommendations
   - Personalized hero messages
   - Smart A/B testing

3. **Advanced Analytics** (2 weeks)
   - Heat maps
   - Scroll depth tracking
   - Click tracking
   - Conversion funnels

4. **Multi-language Support** (2 weeks)
   - Hindi translations
   - Auto-translation
   - RTL support (future)
   - Language-specific content

### Phase 3 Enhancements (Next 12 Months)

1. **Real-time Collaboration** (6 weeks)
   - Multiple admins editing simultaneously
   - Live preview sharing
   - Comment system
   - Change history with diffs

2. **Template System** (4 weeks)
   - Pre-built homepage templates
   - Template marketplace
   - Custom template builder
   - Export/import templates

3. **Advanced SEO Tools** (3 weeks)
   - SEO score calculator
   - Keyword optimization
   - Schema markup builder
   - Social media preview

4. **Performance Dashboard** (2 weeks)
   - Real-time Lighthouse scores
   - Core Web Vitals monitoring
   - User experience metrics
   - Automated optimization suggestions

---

## Conclusion

### Implementation Checklist

**Before Starting**:
- [ ] Review all documentation (README.md, REQUIREMENTS.md, etc.)
- [ ] Understand Three.js basics
- [ ] Set up development environment
- [ ] Database configured and seeded
- [ ] All dependencies installed

**Phase 1 - Setup (Day 1)**:
- [ ] Install additional dependencies
- [ ] Create project structure
- [ ] Update Prisma schema
- [ ] Generate Prisma client
- [ ] Create type definitions

**Phase 2 - Three.js (Days 2-3)**:
- [ ] Create ColorThemes module
- [ ] Implement ParticleSystem
- [ ] Implement ShapeRenderer
- [ ] Create ThreeJSBackground component
- [ ] Test animation performance
- [ ] Update homepage to use animation

**Phase 3 - Admin Panel (Days 4-5)**:
- [ ] Create API routes (GET, POST, publish)
- [ ] Create admin panel page
- [ ] Implement hero section editor
- [ ] Implement animation controls
- [ ] Implement stats configuration
- [ ] Implement featured content selector
- [ ] Implement CTA button manager
- [ ] Test admin panel functionality

**Phase 4 - Testing (Day 6)**:
- [ ] Setup Playwright configuration
- [ ] Write homepage tests
- [ ] Write admin panel tests
- [ ] Write performance tests
- [ ] Run all tests
- [ ] Capture screenshots
- [ ] Generate test reports

**Phase 5 - Quality Assurance**:
- [ ] Run linting (`npm run lint`)
- [ ] Run type checking (`npm run type-check`)
- [ ] Test build process (`npm run build`)
- [ ] Test on local dev server
- [ ] Test on different browsers
- [ ] Test on mobile devices
- [ ] Verify no console errors
- [ ] Check Lighthouse scores
- [ ] Review all screenshots

**Phase 6 - Documentation**:
- [ ] Update README.md
- [ ] Document new components
- [ ] Add JSDoc comments
- [ ] Update API documentation
- [ ] Create user guide for admins
- [ ] Add troubleshooting guide

**Phase 7 - Deployment**:
- [ ] Test build in production mode
- [ ] Deploy to staging environment
- [ ] Verify on staging
- [ ] Get stakeholder approval
- [ ] Deploy to production
- [ ] Monitor performance
- [ ] Collect user feedback

### Success Criteria

**Technical**:
- ✅ Build succeeds with zero errors
- ✅ All tests pass (100%)
- ✅ Lighthouse Performance > 90
- ✅ FPS > 30 on desktop, > 24 on mobile
- ✅ Load time < 3 seconds
- ✅ Zero TypeScript errors
- ✅ Zero ESLint warnings
- ✅ No console errors
- ✅ Cross-browser compatible
- ✅ Mobile responsive

**Functional**:
- ✅ Homepage displays correctly
- ✅ Animations are smooth
- ✅ Admin panel works perfectly
- ✅ All configurations save
- ✅ Publish functionality works
- ✅ Preview mode works
- ✅ All themes display correctly
- ✅ Statistics update in real-time
- ✅ Featured content displays
- ✅ CTA buttons work

**User Experience**:
- ✅ Professional appearance
- ✅ Attractive animations
- ✅ Easy admin controls
- ✅ Intuitive interface
- ✅ Fast load times
- ✅ Smooth interactions
- ✅ Accessible to all users
- ✅ Works on all devices

### Deliverables

1. **Code**:
   - Three.js animation components
   - Admin panel pages
   - API routes
   - Database schema updates
   - Type definitions

2. **Tests**:
   - Playwright test suites
   - Unit tests (if applicable)
   - Integration tests

3. **Documentation**:
   - This comprehensive homereq.md file
   - Code comments
   - API documentation
   - User guide

4. **Screenshots**:
   - Homepage (all themes)
   - Admin panel (all tabs)
   - Mobile views
   - Animation states

5. **Reports**:
   - Test results
   - Lighthouse scores
   - Performance metrics
   - Browser compatibility matrix

### Maintenance Plan

**Weekly**:
- Monitor performance metrics
- Check error logs
- Review user feedback
- Update content as needed

**Monthly**:
- Update dependencies
- Run security audits
- Review and optimize performance
- Backup configuration database

**Quarterly**:
- Evaluate new features
- Plan enhancements
- User satisfaction survey
- Competitive analysis

---

## Support & Resources

### Documentation Links
- [Three.js Documentation](https://threejs.org/docs/)
- [Next.js Documentation](https://nextjs.org/docs)
- [Playwright Documentation](https://playwright.dev/)
- [Prisma Documentation](https://www.prisma.io/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)

### Internal Documentation
- [README.md](./README.md) - Project overview
- [REQUIREMENTS.md](./REQUIREMENTS.md) - Requirements
- [CONFIGURATION.md](./CONFIGURATION.md) - Configuration guide
- [PR.md](./PR.md) - PR roadmap

### Community & Support
- GitHub Issues: Report bugs and request features
- Discussions: Ask questions and share ideas
- Contributing: See CONTRIBUTING.md for guidelines

---

## Appendix

### A. Glossary

**Three.js**: JavaScript library for 3D graphics in the browser  
**Particle System**: Collection of small objects (particles) animated together  
**WebGL**: Web Graphics Library for rendering 3D graphics  
**FPS**: Frames Per Second, measure of animation smoothness  
**Canvas**: HTML element for drawing graphics  
**Geometry**: 3D shape definition  
**Material**: Appearance properties of 3D objects  
**Mesh**: Combination of geometry and material  
**Renderer**: Component that draws the scene  
**Scene**: Container for all 3D objects  
**Camera**: Viewpoint into the 3D scene  
**CMS**: Content Management System  
**CTA**: Call To Action  
**SEO**: Search Engine Optimization  
**WCAG**: Web Content Accessibility Guidelines

### B. References

1. Three.js Official Examples: https://threejs.org/examples/
2. WebGL Fundamentals: https://webglfundamentals.org/
3. Particle Systems: https://en.wikipedia.org/wiki/Particle_system
4. Performance Best Practices: https://web.dev/performance/
5. Accessibility Guidelines: https://www.w3.org/WAI/WCAG21/quickref/

### C. Change Log

**Version 1.0** (2025-10-20):
- Initial document creation
- Comprehensive requirements defined
- Implementation guide completed
- Testing procedures documented
- 10 suggested improvements listed

---

**Document Status**: ✅ Complete and Ready for Implementation  
**Next Review Date**: 2025-11-20  
**Maintained By**: Development Team  
**Last Updated**: 2025-10-20

---

## Quick Reference

### Essential Commands

```bash
# Development
npm run dev                    # Start dev server
npm run build                  # Build for production
npm run start                  # Start production server

# Database
npm run db:generate            # Generate Prisma client
npm run db:push                # Push schema changes
npm run db:studio              # Open Prisma Studio

# Testing
npm test                       # Run Jest tests
npx playwright test            # Run Playwright tests
npx playwright test --ui       # Interactive test mode
npx playwright test --headed   # See browser during tests

# Code Quality
npm run lint                   # Run ESLint
npm run type-check             # Check TypeScript
npm run format                 # Format with Prettier

# Troubleshooting
npm run diagnose               # Full system diagnostic
```

### Key Files

- `/src/app/page.tsx` - Homepage
- `/src/components/animations/ThreeJSBackground.tsx` - Animation component
- `/src/app/admin-panel/homepage-editor/page.tsx` - Admin editor
- `/src/app/api/admin/homepage/config/route.ts` - Config API
- `/prisma/schema.prisma` - Database schema
- `/tests/e2e/homepage.spec.ts` - Homepage tests

### Important URLs

- Homepage: `http://localhost:3000/`
- Admin Panel: `http://localhost:3000/admin-panel`
- Homepage Editor: `http://localhost:3000/admin-panel/homepage-editor`
- Prisma Studio: `http://localhost:5555`
- Test Report: `file://playwright-report/index.html`

---

**END OF DOCUMENT**

🎉 **Implementation Guide Complete!**

This document provides everything needed to create an attractive, professional homepage with beautiful Three.js animations and complete admin panel control. Follow the step-by-step guide, use the debugging tips, and run the comprehensive tests to achieve a 4K-ready, error-free, impressive website.

Good luck with your implementation! 🚀
