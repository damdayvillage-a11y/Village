# Database Migrations

This directory contains Prisma database migrations for the Smart Carbon-Free Village application.

## Migrations

### 20251015095500_init
Initial database schema migration that creates all tables:
- User authentication tables (users, accounts, sessions, etc.)
- Village and homestay management tables
- Booking and payment tables
- IoT device and sensor reading tables
- Marketplace product and order tables
- Project and DAO voting tables
- Content management tables

## Applying Migrations

### Production
```bash
# Automated (recommended)
npm run setup:production

# Manual
npm run db:migrate:deploy
```

### Development
```bash
# Apply and generate migration
npm run db:migrate

# Push schema without migration (for prototyping)
npm run db:push
```

## Creating New Migrations

```bash
# Make changes to prisma/schema.prisma
# Then create a migration
npx prisma migrate dev --name descriptive_migration_name
```

## Troubleshooting

### Migration Already Applied
If you see "Migration already applied" but tables are missing:
```bash
# This is usually fine, it means the migration was partially applied
# Try seeding the database
npm run db:seed
```

### Permission Denied
Grant proper database permissions:
```sql
GRANT ALL PRIVILEGES ON SCHEMA public TO your_db_user;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO your_db_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO your_db_user;
```

### Reset Database (Development Only)
```bash
# WARNING: This will delete all data!
npx prisma migrate reset
```

## Learn More

- [Prisma Migrations Documentation](https://www.prisma.io/docs/concepts/components/prisma-migrate)
- [Production Database Fix Guide](../../PRODUCTION_DATABASE_FIX.md)
- [Database Setup Guide](../../CAPROVER_DATABASE_SETUP.md)
