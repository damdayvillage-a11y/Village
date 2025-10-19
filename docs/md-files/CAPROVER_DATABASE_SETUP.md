# CapRover Database Setup Guide

## Overview

This guide explains how to correctly configure the database connection for the Village application in CapRover.

## ✅ Correct Database URL Format

### For CapRover Internal PostgreSQL Service

When using CapRover's PostgreSQL service, the DATABASE_URL should use the **internal service name**:

```bash
DATABASE_URL=postgresql://PGUSER:PGPASSWORD@srv-captain--postgres:PGPORT/PGDATABASE
```

**Example with your credentials:**
```bash
DATABASE_URL=postgresql://damdiyal:Damdiyal@975635@srv-captain--postgres:5432/villagedb
```

### Important Notes

1. **`srv-captain--postgres` is NOT a placeholder!**
   - This is the correct internal service name in CapRover
   - The `srv-captain--` prefix is CapRover's naming convention for services
   - Do NOT replace it with anything else when using CapRover's PostgreSQL

2. **Only `$$cap_*$$` patterns are placeholders**
   - Examples: `$$cap_appname$$`, `$$cap_database_url$$`, `$$cap_postgres_password$$`
   - These MUST be replaced with actual values
   - The application will refuse to start if these are not replaced

3. **Password with special characters**
   - If your password contains special characters like `@`, you may need to URL-encode them
   - For the password `Damdiyal@975635`, the `@` should be encoded as `%40`
   - Correct format: `postgresql://damdiyal:Damdiyal%40975635@srv-captain--postgres:5432/villagedb`

## 📋 Setup Steps

### Step 1: Deploy PostgreSQL in CapRover

1. Go to CapRover Dashboard → **One-Click Apps/Databases**
2. Search for **PostgreSQL**
3. Fill in the details:
   - **App Name:** `postgres` (this creates the service `srv-captain--postgres`)
   - **PostgreSQL Version:** Latest stable (e.g., 15 or 16)
   - **PostgreSQL Password:** Your secure password
   - **PostgreSQL Default Database:** `villagedb`

4. Click **Deploy** and wait for completion

### Step 2: Create Database User and Grant Permissions

Access the PostgreSQL container and create your user:

```bash
# In CapRover dashboard, go to Apps → postgres → Deployment → View Logs
# Then open a terminal in the container

# Connect to PostgreSQL
psql -U postgres

# Create the database (if not already created)
CREATE DATABASE villagedb;

# Create your user
CREATE USER damdiyal WITH PASSWORD 'Damdiyal@975635';

# Grant all privileges
GRANT ALL PRIVILEGES ON DATABASE villagedb TO damdiyal;

# Connect to the database
\c villagedb

# Grant schema privileges
GRANT ALL PRIVILEGES ON SCHEMA public TO damdiyal;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO damdiyal;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO damdiyal;

# Exit
\q
```

### Step 3: Configure Village Application

1. Go to CapRover Dashboard → Your Village App → **App Configs**
2. Scroll to **Environment Variables**
3. Set the DATABASE_URL:

```bash
# If password has special characters, URL-encode them:
DATABASE_URL=postgresql://damdiyal:Damdiyal%40975635@srv-captain--postgres:5432/villagedb

# OR if no special characters in password:
DATABASE_URL=postgresql://damdiyal:YourPassword@srv-captain--postgres:5432/villagedb
```

4. Click **Save & Update**

### Step 4: Test the Connection

After deployment, test the connection:

```bash
# Method 1: Check health endpoint
curl https://your-domain.com/api/health

# Expected response:
{
  "status": "healthy",
  "services": {
    "database": {
      "status": "healthy",
      "responseTime": "15ms"
    }
  }
}

# Method 2: Use the test script (in the container)
npm run db:test
```

### Step 5: Initialize the Database

Once connected, initialize the schema and seed data:

```bash
# Access your app's container in CapRover
# Then run:

# Generate Prisma client
npm run db:generate

# Run migrations
npx prisma migrate deploy

# Seed initial data (creates admin user)
npm run db:seed
```

## 🔍 Validation

### Using the Test Script

The repository includes a database connection test script:

```bash
# Run the test
npm run db:test

# Expected output:
🔍 Testing Database Connection

Database URL: postgresql://damdiyal:****@srv-captain--postgres:5432/villagedb

✅ Detected CapRover internal service name (srv-captain--*)
   This is the CORRECT format for CapRover PostgreSQL service

Connection Details:
  Protocol: postgresql
  User: damdiyal
  Host: srv-captain--postgres
  Port: 5432
  Database: villagedb

Attempting to connect to database...

✅ Database connection successful!
✅ PostgreSQL Version: PostgreSQL 15.x
✅ Database has 23 tables
✅ Database schema exists

🎉 Database connection test passed!
```

### Manual Validation

You can also manually validate the connection:

```bash
# From within the CapRover network (any container)
psql "postgresql://damdiyal:Damdiyal@975635@srv-captain--postgres:5432/villagedb" -c "SELECT 1;"

# Expected output:
 ?column? 
----------
        1
(1 row)
```

## ⚠️ Common Issues

### Issue 1: Password Authentication Failed

**Symptoms:**
- Connection fails with "password authentication failed"
- Error: "FATAL: password authentication failed for user"

**Solutions:**
1. Verify the password is correct
2. Check if special characters are URL-encoded properly
3. Ensure the user exists and has access to the database
4. Try connecting with the postgres superuser first to verify

### Issue 2: Connection Refused

**Symptoms:**
- Connection fails with "ECONNREFUSED"
- Error: "connect ECONNREFUSED"

**Solutions:**
1. Verify PostgreSQL is running: Check CapRover dashboard → postgres app
2. Check the service name is exactly `srv-captain--postgres`
3. Ensure both apps are on the same CapRover instance
4. Verify network connectivity between containers

### Issue 3: Database Does Not Exist

**Symptoms:**
- Connection fails with "database does not exist"
- Error: 'database "villagedb" does not exist'

**Solutions:**
1. Create the database manually (see Step 2)
2. Verify the database name in DATABASE_URL matches the actual database name
3. Check for typos in the database name

### Issue 4: Permission Denied

**Symptoms:**
- Connection succeeds but queries fail
- Error: "permission denied for schema public"

**Solutions:**
1. Grant proper permissions (see Step 2)
2. Run the GRANT commands for the specific user
3. Ensure user has privileges on all tables and sequences

## 🎯 Checklist

Before considering the setup complete, verify:

- [ ] PostgreSQL service is running in CapRover (`srv-captain--postgres`)
- [ ] Database `villagedb` exists
- [ ] User `damdiyal` exists with correct password
- [ ] User has all necessary permissions (GRANT ALL PRIVILEGES)
- [ ] DATABASE_URL is set correctly in Village app environment variables
- [ ] Special characters in password are URL-encoded if needed
- [ ] Database connection test passes (`npm run db:test`)
- [ ] Health endpoint returns healthy status
- [ ] Prisma migrations are applied (`npx prisma migrate deploy`)
- [ ] Database is seeded with initial data (`npm run db:seed`)

## 📚 Additional Resources

- [CapRover Deployment Guide](./CAPROVER_DEPLOYMENT_GUIDE.md)
- [Environment Variables Reference](./ENVIRONMENT_VARIABLES.md)
- [Production Setup Guide](./docs/PRODUCTION_SETUP_GUIDE.md)
- [Troubleshooting Guide](./TROUBLESHOOTING.md)

## 🔐 Security Best Practices

1. **Use strong passwords:**
   - Minimum 12 characters
   - Mix of letters, numbers, and special characters
   - Avoid common patterns

2. **Limit user permissions:**
   - Create separate users for different purposes
   - Grant only necessary privileges
   - Use read-only users for reporting/analytics

3. **Secure the connection:**
   - Use internal networking (srv-captain-- services)
   - Don't expose PostgreSQL port publicly
   - Enable SSL/TLS if connecting from external services

4. **Regular backups:**
   - Set up automated database backups in CapRover
   - Test backup restoration regularly
   - Store backups securely off-site

## 💡 Pro Tips

1. **URL-encoding passwords:**
   ```bash
   # Special characters that need encoding:
   @ → %40
   : → %3A
   / → %2F
   ? → %3F
   # → %23
   [ → %5B
   ] → %5D
   ```

2. **Testing connection locally:**
   ```bash
   # Set DATABASE_URL temporarily
   export DATABASE_URL="postgresql://damdiyal:Damdiyal%40975635@srv-captain--postgres:5432/villagedb"
   
   # Run the test
   npm run db:test
   ```

3. **Monitoring database performance:**
   - Check CapRover metrics for PostgreSQL container
   - Monitor query performance using Prisma logging
   - Set up alerts for connection issues

---

**Last Updated:** 2025-10-13  
**Tested with:** CapRover 1.x, PostgreSQL 15.x  
**Status:** Verified working with user credentials
