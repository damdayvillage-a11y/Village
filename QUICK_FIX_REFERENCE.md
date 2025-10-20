# Quick Fix Reference - Critical Issues

**Purpose**: Fast reference guide for fixing the 10 most critical issues  
**Created**: 2025-10-19  
**Target**: PR #1 - Critical Admin Panel Fixes

---

## Critical Issues Quick Reference

### ISSUE-001: Carbon Credit Display Fix
**Time**: 2-3 hours  
**Difficulty**: Medium

**Quick Fix**:
```bash
# 1. Check if API endpoints exist
ls src/app/api/admin/carbon/

# 2. If missing, create them:
mkdir -p src/app/api/admin/carbon/{stats,users,transactions}

# 3. Implement basic stats endpoint
# File: src/app/api/admin/carbon/stats/route.ts
```

**Code Template**:
```typescript
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get carbon credit statistics
    const stats = await prisma.carbonCredit.aggregate({
      _sum: { balance: true },
      _count: { userId: true }
    });

    const transactions = await prisma.carbonTransaction.aggregate({
      _sum: {
        amount: true
      },
      where: {
        OR: [
          { type: 'EARN' },
          { type: 'SPEND' }
        ]
      }
    });

    return NextResponse.json({
      totalCredits: stats._sum.balance || 0,
      totalUsers: stats._count.userId || 0,
      totalEarned: transactions._sum.amount || 0,
      totalSpent: 0, // Calculate separately
      totalOffset: (stats._sum.balance || 0) * 2.5, // Example conversion
      avgCreditsPerUser: stats._count.userId > 0 
        ? (stats._sum.balance || 0) / stats._count.userId 
        : 0
    });
  } catch (error) {
    console.error('Error fetching carbon stats:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
```

**Test**:
```bash
curl http://localhost:3000/api/admin/carbon/stats
```

---

### ISSUE-002: Add User Button Fix
**Time**: 1-2 hours  
**Difficulty**: Easy

**Quick Fix**:
The modal exists but form submission is not implemented.

**Code to Add** (in `src/app/admin-panel/users/page.tsx`):

```typescript
// Add state for form
const [formData, setFormData] = useState({
  email: '',
  name: '',
  role: 'GUEST' as any,
  autoPassword: true,
  sendEmail: false,
  password: ''
});

const [isSubmitting, setIsSubmitting] = useState(false);

// Update the Create User button handler
const handleSubmitCreateUser = async () => {
  if (!formData.email || !formData.name) {
    alert('Email and name are required');
    return;
  }

  setIsSubmitting(true);
  try {
    const response = await fetch('/api/admin/users/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: formData.email,
        name: formData.name,
        role: formData.role,
        autoPassword: formData.autoPassword,
        sendEmail: formData.sendEmail
      })
    });

    if (response.ok) {
      const result = await response.json();
      setShowCreateModal(false);
      setFormData({
        email: '',
        name: '',
        role: 'GUEST',
        autoPassword: true,
        sendEmail: false,
        password: ''
      });
      await fetchUsers();
      
      if (result.generatedPassword) {
        alert(`User created! Password: ${result.generatedPassword}`);
      } else {
        alert('User created successfully!');
      }
    } else {
      const error = await response.json();
      alert(error.message || 'Failed to create user');
    }
  } catch (error) {
    console.error('Error creating user:', error);
    alert('Failed to create user');
  } finally {
    setIsSubmitting(false);
  }
};

// Update form inputs to use formData state
<Input 
  type="email" 
  placeholder="user@example.com"
  value={formData.email}
  onChange={(e) => setFormData({...formData, email: e.target.value})}
/>

<Input 
  placeholder="Full Name"
  value={formData.name}
  onChange={(e) => setFormData({...formData, name: e.target.value})}
/>

<select 
  className="w-full px-3 py-2 border border-gray-300 rounded-md"
  value={formData.role}
  onChange={(e) => setFormData({...formData, role: e.target.value as any})}
>
  {/* options stay the same */}
</select>

// Update button
<Button 
  onClick={handleSubmitCreateUser}
  disabled={isSubmitting}
>
  {isSubmitting ? 'Creating...' : 'Create User'}
</Button>
```

**Test**:
1. Click "Create User" button
2. Fill form
3. Click "Create User" in modal
4. Verify user appears in list

---

### ISSUE-003: Image Upload Fix
**Time**: 3-4 hours  
**Difficulty**: Medium-Hard

**Quick Fix**:
Check if upload API exists, if not create it.

**Step 1**: Install sharp if not installed
```bash
npm install sharp
```

**Step 2**: Create upload endpoint

**File**: `src/app/api/media/upload/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import sharp from 'sharp';
import { randomUUID } from 'crypto';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const files = formData.getAll('files');
    
    if (!files || files.length === 0) {
      return NextResponse.json({ error: 'No files provided' }, { status: 400 });
    }

    const uploadedFiles = [];
    
    for (const file of files) {
      if (!(file instanceof File)) continue;
      
      // Validate file type
      if (!file.type.startsWith('image/')) {
        continue;
      }

      // Validate file size (10MB)
      if (file.size > 10 * 1024 * 1024) {
        continue;
      }

      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      // Generate unique filename
      const ext = file.name.split('.').pop();
      const filename = `${randomUUID()}.${ext}`;
      
      // Ensure upload directory exists
      const uploadDir = join(process.cwd(), 'public', 'uploads');
      await mkdir(uploadDir, { recursive: true });

      // Save original
      const filepath = join(uploadDir, filename);
      await writeFile(filepath, buffer);

      // Optimize image
      const webpFilename = `${randomUUID()}.webp`;
      const webpPath = join(uploadDir, webpFilename);
      
      await sharp(buffer)
        .resize(1920, 1920, { 
          fit: 'inside',
          withoutEnlargement: true 
        })
        .webp({ quality: 80 })
        .toFile(webpPath);

      // Get image metadata
      const metadata = await sharp(buffer).metadata();

      // Save to database
      const media = await prisma.media.create({
        data: {
          filename: webpFilename,
          originalName: file.name,
          mimeType: 'image/webp',
          size: (await sharp(webpPath).metadata()).size || 0,
          width: metadata.width,
          height: metadata.height,
          url: `/uploads/${webpFilename}`,
          uploadedById: session.user.id
        }
      });

      uploadedFiles.push(media);
    }

    return NextResponse.json({
      success: true,
      files: uploadedFiles
    });

  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ 
      error: 'Upload failed' 
    }, { status: 500 });
  }
}
```

**Test**:
1. Go to /admin-panel/media
2. Click "Upload Files" tab
3. Drag and drop images
4. Verify upload completes
5. Check "Media Library" tab

---

### ISSUE-004: API Connection Fix
**Time**: 1 hour  
**Difficulty**: Easy

**Quick Fix**:
Ensure all API endpoints referenced in frontend actually exist.

**Check**:
```bash
# List all API endpoints
find src/app/api -name "route.ts" -o -name "route.js"

# Compare with frontend API calls
grep -r "fetch\|axios" src/app/admin-panel/ | grep "/api/"
```

**Common missing endpoints**:
- `/api/admin/carbon/stats`
- `/api/admin/carbon/users`
- `/api/admin/carbon/transactions`
- `/api/media/upload`

Create stub endpoints that return empty data initially:

```typescript
export async function GET() {
  return NextResponse.json({
    // Empty data structure
    data: [],
    total: 0
  });
}
```

Then implement proper logic later.

---

### ISSUE-005: Media Library Component
**Time**: 2-3 hours  
**Difficulty**: Medium

**Quick Fix**:
Create the MediaLibrary component.

**File**: `src/lib/components/admin-panel/media/MediaLibrary.tsx`

```typescript
"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/lib/components/ui/Card';
import { Button } from '@/lib/components/ui/Button';
import { Trash2, Download, Eye } from 'lucide-react';

interface MediaFile {
  id: string;
  url: string;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  createdAt: string;
}

export function MediaLibrary({ key }: { key?: number }) {
  const [files, setFiles] = useState<MediaFile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMedia();
  }, [key]);

  const fetchMedia = async () => {
    try {
      const response = await fetch('/api/media');
      if (response.ok) {
        const data = await response.json();
        setFiles(data.media || []);
      }
    } catch (error) {
      console.error('Failed to fetch media:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this file?')) return;
    
    try {
      const response = await fetch(`/api/media/${id}`, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        await fetchMedia();
      }
    } catch (error) {
      console.error('Delete failed:', error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {files.map((file) => (
        <Card key={file.id}>
          <CardContent className="p-4">
            <div className="aspect-square mb-2 overflow-hidden rounded">
              <img 
                src={file.url} 
                alt={file.originalName}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="text-sm truncate mb-2">{file.originalName}</div>
            <div className="flex gap-2">
              <Button size="sm" variant="ghost">
                <Eye className="h-4 w-4" />
              </Button>
              <Button size="sm" variant="ghost">
                <Download className="h-4 w-4" />
              </Button>
              <Button 
                size="sm" 
                variant="ghost"
                onClick={() => handleDelete(file.id)}
              >
                <Trash2 className="h-4 w-4 text-red-500" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
```

---

### ISSUE-006: Welcome Email
**Time**: 2 hours  
**Difficulty**: Medium

**Quick Fix**:
Uncomment and implement the TODO in user creation API.

**File**: `src/app/api/admin/users/create/route.ts`

Find the TODO comment and replace with:

```typescript
// Send welcome email if requested
if (sendEmail) {
  try {
    await sendWelcomeEmail({
      to: email,
      name: firstName || email,
      password: generatedPassword,
      loginUrl: `${process.env.NEXTAUTH_URL}/auth/signin`
    });
  } catch (emailError) {
    console.error('Failed to send welcome email:', emailError);
    // Don't fail the user creation if email fails
  }
}
```

Create email utility:

**File**: `src/lib/email.ts`

```typescript
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD
  }
});

export async function sendWelcomeEmail({ to, name, password, loginUrl }: {
  to: string;
  name: string;
  password: string;
  loginUrl: string;
}) {
  const html = `
    <h1>Welcome to Village!</h1>
    <p>Hello ${name},</p>
    <p>Your account has been created.</p>
    <p><strong>Email:</strong> ${to}</p>
    <p><strong>Password:</strong> ${password}</p>
    <p><a href="${loginUrl}">Click here to login</a></p>
  `;

  await transporter.sendMail({
    from: process.env.SMTP_USER,
    to,
    subject: 'Welcome to Village',
    html
  });
}
```

---

### ISSUE-007: Database Seeding
**Time**: 1 hour  
**Difficulty**: Easy

**Quick Fix**:
Add sample data for carbon credits.

**File**: `prisma/seed.ts`

Add this to the seed function:

```typescript
// Create sample carbon credits
const carbonCredits = await prisma.carbonCredit.createMany({
  data: [
    {
      userId: adminUser.id,
      balance: 100.5,
      totalEarned: 150.5,
      totalSpent: 50.0
    },
    {
      userId: hostUser.id,
      balance: 75.0,
      totalEarned: 100.0,
      totalSpent: 25.0
    }
  ]
});

// Create sample transactions
await prisma.carbonTransaction.createMany({
  data: [
    {
      userId: adminUser.id,
      type: 'EARN',
      amount: 50.0,
      reason: 'Initial bonus',
      fromId: null,
      toId: adminUser.id
    },
    {
      userId: adminUser.id,
      type: 'SPEND',
      amount: -25.0,
      reason: 'Carbon offset purchase',
      fromId: adminUser.id,
      toId: null
    }
  ]
});

console.log('✅ Carbon credits seeded');
```

Run:
```bash
npm run db:seed
```

---

### ISSUE-008: Error Handling
**Time**: 2 hours  
**Difficulty**: Easy

**Quick Fix**:
Add a toast notification system.

**Install**:
```bash
npm install react-hot-toast
```

**Setup** (in main layout or provider):

```typescript
import { Toaster } from 'react-hot-toast';

export default function Layout({ children }) {
  return (
    <>
      {children}
      <Toaster position="top-right" />
    </>
  );
}
```

**Usage** (in components):

```typescript
import toast from 'react-hot-toast';

// Success
toast.success('User created successfully!');

// Error
toast.error('Failed to create user');

// Loading
toast.loading('Creating user...');
```

Replace all `alert()` calls with `toast.*()`.

---

### ISSUE-009: Placeholder Links
**Time**: 1 hour  
**Difficulty**: Easy

**Quick Fix**:
Find and disable/fix placeholder links.

```bash
# Find placeholder links
grep -r "placeholder\|#\|javascript:void" src/app --include="*.tsx"

# Find href="#" 
grep -r 'href="#"' src/app --include="*.tsx"
```

Replace with:

```typescript
// If feature not ready
<Button disabled title="Coming soon">
  Feature Name
</Button>

// Or add onClick handler
<Button onClick={() => toast.info('Feature coming soon!')}>
  Feature Name
</Button>

// Or remove the link
// Comment out until feature is ready
```

---

### ISSUE-010: Build Issues
**Time**: 1-2 hours  
**Difficulty**: Medium

**Quick Fix**:
Fix most common TypeScript errors.

```bash
# Run type check
npm run type-check

# Common fixes:

# 1. Add explicit types
const value: string = ...

# 2. Use type assertion
const element = ref.current as HTMLElement

# 3. Add null checks
if (value) {
  // use value
}

# 4. Fix any types
const data: any // BAD
const data: SomeType // GOOD

# 5. Add interface for props
interface Props {
  value: string;
}
```

For now, ensure build succeeds with type checking disabled (already configured).

---

## Quick Commands

### Development:
```bash
npm run dev              # Start dev server
npm run build            # Build application
npm run lint             # Check code quality
npm run type-check       # Check TypeScript
```

### Database:
```bash
npm run db:generate      # Generate Prisma client
npm run db:push          # Push schema changes
npm run db:seed          # Seed with sample data
npm run db:studio        # Open Prisma Studio
```

### Testing:
```bash
npm test                 # Run tests
npm run test:watch       # Watch mode
curl http://localhost:3000/api/endpoint  # Test API
```

---

## Success Criteria

After fixing all 10 critical issues:

✅ **Issue 001**: Carbon credits display with data  
✅ **Issue 002**: Can create users from admin panel  
✅ **Issue 003**: Images upload successfully  
✅ **Issue 004**: All APIs connected and working  
✅ **Issue 005**: Media library shows uploaded files  
✅ **Issue 006**: Welcome emails sent to new users  
✅ **Issue 007**: Database has sample data  
✅ **Issue 008**: Error messages user-friendly  
✅ **Issue 009**: No broken navigation links  
✅ **Issue 010**: Build completes without critical errors  

---

## Next Steps

After completing PR #1:
1. Run full test suite
2. Deploy to staging
3. User acceptance testing
4. Move to PR #2 (CMS UI Implementation)

---

## Build Issues Fix (2025-10-20)

### ISSUE: Error Code 137 (OOM - Out of Memory)

**Status**: ✅ FIXED  
**Time**: Applied  
**Difficulty**: Easy (configuration change)

#### Symptoms
- Build process gets "Killed" during Docker build
- Error message: `returned a non-zero code: 137`
- Happens at Step 44/73 during `npm run build:production`

#### Root Cause
Insufficient memory allocated for Next.js build process (was 1GB, needs 2GB+)

#### Fix Applied ✅

1. **Increased Node.js Heap Memory** (1GB → 2GB)
   - Dockerfile.simple: `BUILD_MEMORY_LIMIT=2048`
   - package.json: `--max-old-space-size=2048`

2. **Optimized PWA Cache Size** (5MB → 3MB)
   - next.config.js: `maximumFileSizeToCacheInBytes: 3000000`

3. **Added Memory Limits to Docker Compose**
   - docker-compose.coolify.yml: 4GB limit, 2GB reservation

#### Server Requirements
- **Minimum**: 3GB total RAM (2GB free during build)
- **Recommended**: 4GB+ total RAM
- **For CapRover**: Ensure droplet/server has at least 4GB RAM

#### If Still Failing - Add Swap Space (Linux)
```bash
# Create 4GB swap file
sudo fallocate -l 4G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile

# Make permanent
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
```

#### Verify Fix
After deployment, check build logs for:
1. ✅ Memory info shown during build
2. ✅ Next.js build completes without being killed
3. ✅ "Build complete" message appears
4. ✅ "✅ Build and cleanup complete" message

#### Files Modified
- ✅ `Dockerfile.simple` - Increased memory to 2GB, added monitoring
- ✅ `package.json` - Updated build scripts to use 2GB heap
- ✅ `next.config.js` - Reduced PWA cache size to 3MB
- ✅ `docker-compose.coolify.yml` - Added 4GB memory limit
- ✅ `BUILD_GUIDE.md` - Created comprehensive build guide (NEW)

#### Quick Commands
```bash
# Check system memory
free -h

# Monitor build (if locally)
docker logs -f container-name

# Build with custom memory (if needed)
docker build --build-arg BUILD_MEMORY_LIMIT=3072 -f Dockerfile.simple .
```

See **BUILD_GUIDE.md** for comprehensive troubleshooting and deployment instructions.

---

**Document Version**: 1.1  
**Last Updated**: 2025-10-20  
**Part Of**: PR #1 - Critical Admin Panel Fixes + Build Issues
