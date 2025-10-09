# Troubleshooting Guide

Common issues and solutions for the Smart Carbon-Free Village application.

## Admin Panel Issues

### 500 Internal Server Error on Admin Panel

**Symptoms:**
- Cannot access `/admin-panel`
- Getting 500 error when trying to login
- Error message: "Internal Server Error"

**Solution:**
This typically means the application is not properly set up. Run the setup script:

```bash
npm run setup
```

Or manually:
1. Ensure PostgreSQL is running: `pg_isready`
2. Create the database: `createdb smart_village_db`
3. Set up environment: `cp .env.example .env`
4. Generate Prisma client: `npm run db:generate`
5. Push schema: `npm run db:push`
6. Seed data: `npm run db:seed`
7. Verify: `npm run admin:verify`

### Cannot Login with Admin Credentials

**Symptoms:**
- Login form shows "Invalid credentials"
- Admin credentials don't work

**Check:**
1. Verify admin user exists:
   ```bash
   npm run admin:verify
   ```

2. If admin user doesn't exist, seed the database:
   ```bash
   npm run db:seed
   ```

3. Default credentials:
   - Email: `admin@damdayvillage.org`
   - Password: `Admin@123`

### 401 Unauthorized Error on `/api/admin/stats`

**Symptoms:**
- API returns 401 error
- Not authenticated

**Solution:**
You need to be logged in as an admin user. Navigate to `/auth/signin` and login with admin credentials.

## Database Issues

### Database Connection Error

**Symptoms:**
- Error: "Can't reach database server"
- Error: "Authentication failed"
- Prisma connection errors

**Check:**
1. PostgreSQL is running:
   ```bash
   # macOS
   brew services list
   brew services start postgresql
   
   # Linux
   sudo service postgresql status
   sudo service postgresql start
   
   # Check connection
   pg_isready
   ```

2. Database URL in `.env` is correct:
   ```
   DATABASE_URL="postgresql://postgres:postgres@localhost:5432/smart_village_db"
   ```

3. Database exists:
   ```bash
   psql -l | grep smart_village_db
   ```

### Prisma Client Not Generated

**Symptoms:**
- Import errors for `@prisma/client`
- Error: "Cannot find module '@prisma/client'"

**Solution:**
```bash
npm run db:generate
```

### Schema Not Synced

**Symptoms:**
- Table doesn't exist errors
- Column not found errors

**Solution:**
```bash
npm run db:push
```

## Development Server Issues

### Port 3000 Already in Use

**Solution:**
```bash
# Find process using port 3000
lsof -ti:3000

# Kill the process
kill -9 $(lsof -ti:3000)

# Or use a different port
PORT=3001 npm run dev
```

### Build Errors

**TypeScript Errors:**
```bash
# Check for type errors
npm run type-check

# If too many errors, use safe build
npm run build:production-safe
```

**Out of Memory:**
```bash
# Use production build with more memory
npm run build:production
```

## Environment Configuration

### Missing Environment Variables

**Symptoms:**
- OAuth login doesn't work
- Email sending fails
- Payment integration fails

**Check:**
1. Copy example environment:
   ```bash
   cp .env.example .env
   ```

2. Required variables:
   ```
   DATABASE_URL=
   NEXTAUTH_URL=
   NEXTAUTH_SECRET=
   ```

3. Optional variables (for OAuth):
   ```
   GOOGLE_CLIENT_ID=
   GOOGLE_CLIENT_SECRET=
   GITHUB_CLIENT_ID=
   GITHUB_CLIENT_SECRET=
   ```

### NEXTAUTH_SECRET Not Set

**Error:**
- Warning about missing NEXTAUTH_SECRET

**Solution:**
Generate a secure secret:
```bash
# Generate random secret
openssl rand -base64 32

# Add to .env
NEXTAUTH_SECRET="your-generated-secret"
```

## Authentication Issues

### Cannot Sign In with Credentials

**Check:**
1. User exists and is verified:
   ```bash
   npm run admin:verify
   ```

2. Password is correct (default: `Admin@123`)

3. User is active and verified in database

### Session Not Persisting

**Check:**
1. NEXTAUTH_URL matches your current URL:
   ```
   # Local dev
   NEXTAUTH_URL="http://localhost:3000"
   
   # Production
   NEXTAUTH_URL="https://yourdomain.com"
   ```

2. Cookies are enabled in browser

3. Clear browser cookies and try again

## Permission Issues

### Access Denied to Admin Panel

**Symptoms:**
- Redirected to `/auth/unauthorized`
- "Forbidden - Admin access required"

**Check:**
1. User has correct role:
   - Role must be `ADMIN` or `VILLAGE_COUNCIL`

2. Verify in database or use Prisma Studio:
   ```bash
   npm run db:studio
   ```

## Installation Issues

### npm install Fails

**Solution:**
```bash
# Clear cache
npm cache clean --force

# Delete node_modules
rm -rf node_modules package-lock.json

# Reinstall
npm install
```

### Dependency Conflicts

**Solution:**
```bash
# Use legacy peer deps
npm install --legacy-peer-deps
```

## Still Having Issues?

1. Check the logs:
   - Browser console (F12)
   - Terminal output from `npm run dev`

2. Enable debug mode in `.env`:
   ```
   NODE_ENV=development
   ```

3. Check database connection:
   ```bash
   psql $DATABASE_URL -c "SELECT 1"
   ```

4. Verify all setup steps were completed:
   ```bash
   npm run admin:verify
   ```

5. Open an issue on GitHub with:
   - Error message
   - Steps to reproduce
   - Environment (OS, Node version, PostgreSQL version)
   - Logs from terminal and browser console
