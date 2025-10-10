# Database Migration Guide

## Overview

This guide explains how to apply the database migrations for the new ContentBlock model.

## What's Being Added

- **ContentBlock** table for dynamic content management
- **BlockType** enum for different content block types

## Migration Steps

### For Development

1. **Ensure database is running:**
   ```bash
   # Check if PostgreSQL is accessible
   psql $DATABASE_URL -c "SELECT 1;"
   ```

2. **Create migration:**
   ```bash
   npx prisma migrate dev --name add_content_blocks
   ```

3. **Verify migration:**
   ```bash
   npx prisma studio
   # Check that content_blocks table exists
   ```

### For CapRover Production

1. **Access CapRover web terminal** or SSH into your container

2. **Set DATABASE_URL** if not already set:
   ```bash
   export DATABASE_URL="postgresql://user:password@host:5432/database"
   ```

3. **Run migration:**
   ```bash
   npx prisma migrate deploy
   ```

4. **Verify:**
   ```bash
   npx prisma db execute --stdin <<EOF
   SELECT table_name FROM information_schema.tables 
   WHERE table_name = 'content_blocks';
   EOF
   ```

### Alternative: Direct SQL Migration

If you prefer to run SQL directly:

```sql
-- Create BlockType enum
CREATE TYPE "BlockType" AS ENUM (
  'TEXT',
  'IMAGE',
  'HERO',
  'STATS',
  'GRID',
  'CAROUSEL',
  'VIDEO',
  'TESTIMONIAL'
);

-- Create content_blocks table
CREATE TABLE "content_blocks" (
  "id" TEXT NOT NULL,
  "page" TEXT NOT NULL,
  "type" "BlockType" NOT NULL,
  "position" INTEGER NOT NULL,
  "content" JSONB NOT NULL,
  "active" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "content_blocks_pkey" PRIMARY KEY ("id")
);

-- Create unique index
CREATE UNIQUE INDEX "content_blocks_page_position_key" 
ON "content_blocks"("page", "position");

-- Create indexes for performance
CREATE INDEX "content_blocks_page_idx" ON "content_blocks"("page");
CREATE INDEX "content_blocks_active_idx" ON "content_blocks"("active");
```

## Rollback (If Needed)

If you need to rollback the migration:

```bash
# Using Prisma
npx prisma migrate resolve --rolled-back add_content_blocks

# Or direct SQL
DROP TABLE IF EXISTS "content_blocks";
DROP TYPE IF EXISTS "BlockType";
```

## Verification

After migration, verify the schema:

```bash
# Check tables
npx prisma db execute --stdin <<EOF
SELECT table_name, column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'content_blocks';
EOF

# Expected output:
# content_blocks | id         | text
# content_blocks | page       | text
# content_blocks | type       | USER-DEFINED
# content_blocks | position   | integer
# content_blocks | content    | jsonb
# content_blocks | active     | boolean
# content_blocks | createdAt  | timestamp
# content_blocks | updatedAt  | timestamp
```

## Seed Data (Optional)

To populate initial content blocks:

```bash
npx prisma db execute --stdin <<'EOF'
INSERT INTO "content_blocks" (id, page, type, position, content, active)
VALUES
  (
    gen_random_uuid()::text,
    'home',
    'HERO',
    0,
    '{"title": "Welcome to Smart Carbon-Free Village", "subtitle": "Experience sustainable living in the Himalayas", "ctaText": "Explore", "ctaLink": "/digital-twin"}'::jsonb,
    true
  );
EOF
```

## Troubleshooting

### Error: "relation already exists"

The migration was already applied. Skip to verification.

### Error: "permission denied"

Ensure your database user has CREATE privileges:

```sql
GRANT CREATE ON DATABASE your_database TO your_user;
```

### Error: "database connection failed"

Check your DATABASE_URL:

```bash
echo $DATABASE_URL
# Should output: postgresql://user:pass@host:5432/db
```

## Summary

✅ Migration adds ContentBlock model  
✅ No data loss (additive only)  
✅ Can be rolled back safely  
✅ Compatible with existing data  
✅ Zero downtime migration

---

**Status:** Ready to Apply  
**Risk Level:** Low  
**Rollback:** Supported
