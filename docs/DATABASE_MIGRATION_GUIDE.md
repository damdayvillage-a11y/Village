# Database Setup and Migration Guide

This guide explains how to setup and migrate your database for the Damday Village application.

## Automatic Database Setup (Recommended)

The application now **automatically runs database migrations** when you build or deploy it, as long as your `DATABASE_URL` environment variable is configured.

### How It Works

1. **During Build**: The Prisma client is automatically generated before building (`npm run build`)
2. **On Startup**: Database migrations are automatically applied when the application starts

### Setup Steps

1. Set your database URL in environment variables:
   ```bash
   DATABASE_URL="postgresql://username:password@localhost:5432/smart_village_db"
   ```

2. Build and start the application:
   ```bash
   npm install
   npm run build
   npm start
   ```

That's it! The database will be automatically set up with all required tables.

### Disabling Auto-Migration

If you need to disable automatic migrations (e.g., for manual control in production):

```bash
SKIP_MIGRATIONS=true
```

## Manual Migration (Alternative)

If you prefer to run migrations manually, you have several options:

### Option 1: Using Prisma CLI

```bash
# Generate Prisma client
npm run db:generate

# Run migrations
npm run db:migrate

# (Optional) Seed initial data
npm run db:seed
```

### Option 2: Using Migration Scripts

For the `village_leaders` table specifically:

## Migration Methods

### Method 1: Using Node.js Script (Recommended)

This is the easiest and safest method:

```bash
# Make sure you have DATABASE_URL set in your .env file
node scripts/migrate-village-leaders.js
```

The script will:
- ✅ Test database connection
- ✅ Create the table if it doesn't exist
- ✅ Add default leaders
- ✅ Verify the migration
- ✅ Show you the results

After running, regenerate Prisma client:
```bash
npm run db:generate
```

### Method 2: Using SQL Directly

If you prefer to run SQL directly on your database:

```bash
# Connect to your PostgreSQL database
psql $DATABASE_URL

# Run the migration SQL
\i scripts/create-village-leaders-table.sql
```

Or copy the contents of `scripts/create-village-leaders-table.sql` and execute in your database client.

### Method 3: Using Prisma Migrate (For Development)

If you want to use Prisma's migration system:

```bash
# This will create a new migration based on the schema
npx prisma migrate dev --name add_village_leaders

# Generate the Prisma client
npm run db:generate
```

## Verification

After migration, verify the table exists:

```bash
# Check if table exists
psql $DATABASE_URL -c "SELECT COUNT(*) FROM village_leaders;"

# View the default leaders
psql $DATABASE_URL -c "SELECT name, position, priority FROM village_leaders ORDER BY priority;"
```

You should see 3 default leaders:
1. श्री नरेंद्र मोदी (प्रधान मंत्री) - Priority 0
2. श्री पुष्कर सिंह धामी (मुख्य मंत्री, उत्तराखंड) - Priority 1
3. श्री रामलाल सिंह (ग्राम प्रधान, दामदे) - Priority 2

## For Production Deployment

When deploying to production, you have several options:

### Option 1: Run Migration Script on Server

SSH into your server and run:
```bash
cd /path/to/app
node scripts/migrate-village-leaders.js
```

### Option 2: Execute SQL via Database Client

Connect to your production database and run:
```sql
-- Copy contents from scripts/create-village-leaders-table.sql
```

### Option 3: Use Prisma Deploy Hook

Add to your deployment pipeline:
```bash
# In your Dockerfile or deployment script
RUN npx prisma generate
# After deployment, run once:
node scripts/migrate-village-leaders.js
```

## Rollback

If you need to remove the table:

```sql
DROP TABLE IF EXISTS "village_leaders" CASCADE;
```

## Table Schema

The `village_leaders` table includes:

| Column | Type | Description |
|--------|------|-------------|
| id | TEXT | Primary key (CUID) |
| name | TEXT | Leader's name (in Hindi) |
| position | TEXT | Position/title (in Hindi) |
| photo | TEXT | URL to photo |
| message | TEXT | Optional message (primarily for Gram Pradhan) |
| priority | INTEGER | Display order (lower = first) |
| isActive | BOOLEAN | Whether to show on homepage |
| createdAt | TIMESTAMP | Creation timestamp |
| updatedAt | TIMESTAMP | Last update timestamp |

## Managing Leaders

After the table is created, you can manage leaders through:

1. **Admin Panel**: Visit `/admin-panel/leadership`
2. **API Endpoints**: 
   - GET `/api/admin/village-leaders` - List all leaders
   - POST `/api/admin/village-leaders` - Create new leader
   - PUT `/api/admin/village-leaders/[id]` - Update leader
   - DELETE `/api/admin/village-leaders/[id]` - Delete leader

## Troubleshooting

### Error: "relation 'village_leaders' already exists"
This is normal if you run the migration multiple times. The script uses `IF NOT EXISTS` to handle this safely.

### Error: "DATABASE_URL is not set"
Make sure you have a `.env` file with:
```
DATABASE_URL="postgresql://user:password@host:port/database"
```

### Error: "permission denied"
Your database user needs CREATE TABLE permissions. Contact your database administrator.

### Leaders not showing on homepage
1. Check that `isActive` is `true` for the leaders
2. Make sure you've regenerated the Prisma client: `npm run db:generate`
3. Restart your application server
4. Clear browser cache or open in incognito mode

## Need Help?

If you encounter issues:
1. Check the application logs
2. Verify DATABASE_URL is correct
3. Test database connection: `npm run db:test`
4. Check Prisma schema is up to date: `npx prisma validate`
