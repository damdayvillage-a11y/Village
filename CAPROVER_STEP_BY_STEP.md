# CapRover Step-by-Step: Fix Admin Panel 500 Error

## 🎯 Goal
Get your admin panel working in CapRover by properly configuring environment variables, setting up the database, and creating the admin user.

## 📋 Prerequisites
- ✅ App deployed to CapRover
- ✅ App is running (shows as "running" in CapRover dashboard)
- ✅ Homepage is accessible (you can visit your domain)
- ❌ Admin panel shows 500 error when you try to login

## 🚀 Fix Steps (Follow Exactly)

### STEP 1: Open CapRover Dashboard
1. Open your browser
2. Go to: `https://captain.your-domain.com`
3. Login with your CapRover credentials
4. You'll see the CapRover dashboard with a list of apps

### STEP 2: Find Your Village App
1. Look for your app name in the apps list (e.g., "village" or "damdayvillage")
2. Click on the app name
3. You'll see several tabs: "HTTP Settings", "App Configs", "Deployment", etc.

### STEP 3: Configure Environment Variables

Click on the **"App Configs"** tab. You'll see a big text area with environment variables.

#### Replace These Variables (CRITICAL!)

Find these lines and replace them EXACTLY as shown below:

**1. NEXTAUTH_URL**

❌ **WRONG (Don't use this):**
```
NEXTAUTH_URL=https://$$cap_appname$$.$$cap_root_domain$$
```

✅ **CORRECT (Use your actual domain):**
```
NEXTAUTH_URL=https://your-actual-domain.com
```

**Example**: If your app is at `damdayvillage.com`, use:
```
NEXTAUTH_URL=https://damdayvillage.com
```

**2. NEXTAUTH_SECRET**

❌ **WRONG (Don't use this):**
```
NEXTAUTH_SECRET=$$cap_nextauth_secret$$
```

✅ **CORRECT (Generate a random secret):**

**On your computer terminal**, run this command:
```bash
openssl rand -base64 32
```

You'll get something like: `abc123XYZ789def456GHI012jkl345MNO678pqr901STU234=`

Copy that output and paste it in CapRover:
```
NEXTAUTH_SECRET=abc123XYZ789def456GHI012jkl345MNO678pqr901STU234=
```

**3. DATABASE_URL**

❌ **WRONG (Don't use this):**
```
DATABASE_URL=$$cap_database_url$$
```

✅ **CORRECT (Use your actual PostgreSQL connection):**

**If you're using CapRover's PostgreSQL** (deployed as a one-click app):
```
DATABASE_URL=postgresql://postgres:YOUR_POSTGRES_PASSWORD@srv-captain--postgres:5432/villagedb
```

Replace `YOUR_POSTGRES_PASSWORD` with the password you set when deploying PostgreSQL.

**If you're using external PostgreSQL**:
```
DATABASE_URL=postgresql://username:password@your-db-host.com:5432/database_name
```

#### Other Variables (Keep These As-Is)

These should already be correct, just verify they exist:
```
NODE_ENV=production
NEXT_TELEMETRY_DISABLED=1
GENERATE_SOURCEMAP=false
CI=true
CAPROVER_BUILD=true
```

#### Optional Variables (Remove or Leave Blank)

If you see these and you're NOT using them, you can remove the lines or leave them blank:
```
STRIPE_SECRET_KEY=
GOOGLE_CLIENT_ID=
EMAIL_SERVER_HOST=
SENTRY_DSN=
```

### STEP 4: Save and Restart

1. Scroll to the bottom of the App Configs page
2. Click the **"Save & Update"** button
3. Wait for CapRover to restart your app (this takes 10-30 seconds)
4. You'll see a success message when it's done

### STEP 5: Set Up PostgreSQL (If Not Already Done)

#### Option A: Deploy PostgreSQL in CapRover (If You Don't Have One)

1. In CapRover dashboard, click **"Apps"** in the left menu
2. Click **"One-Click Apps/Databases"** at the top
3. In the search box, type: `postgresql`
4. Click on **"PostgreSQL"** in the results
5. Fill in the form:
   - **App Name**: `postgres` (or any name you like)
   - **PostgreSQL Version**: Keep default (latest)
   - **PostgreSQL Password**: Choose a strong password (write it down!)
   - **Database Name**: `villagedb`
6. Click **"Deploy"**
7. Wait for deployment (takes 30-60 seconds)

Now update your DATABASE_URL in Step 3 with:
```
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD_HERE@srv-captain--postgres:5432/villagedb
```

Then go back to **Step 4** and Save & Update again.

#### Option B: Use Existing PostgreSQL

If you already have PostgreSQL, just make sure your DATABASE_URL is correct in Step 3.

### STEP 6: Run Database Migrations

Now you need to create the database tables.

1. Go to your app in CapRover
2. Click the **"Deployment"** tab
3. Scroll down to find **"Execute Shell Command in Running Container"**
4. In the command box, type:
   ```bash
   npx prisma migrate deploy
   ```
5. Click **"Execute Command"** button
6. Wait for output to appear (takes 10-30 seconds)
7. You should see: ✅ Success messages about migrations

**If this doesn't work**, see Alternative Method below.

### STEP 7: Create Admin User

Now create the admin user account.

#### Method A: Via Web Browser (Easiest)

1. Open a new browser tab
2. Go to: `https://your-actual-domain.com/api/admin/init`
3. You'll see a JSON response like:
   ```json
   {
     "success": true,
     "message": "Admin user created successfully",
     "credentials": {
       "email": "admin@damdayvillage.org",
       "password": "Admin@123"
     }
   }
   ```
4. ✅ Success! Note down the credentials

#### Method B: Via Command in Container

If Method A doesn't work, use the shell command:

1. In CapRover → Your App → Deployment tab
2. Execute Shell Command:
   ```bash
   npm run db:seed
   ```
3. Wait for completion
4. You should see success messages with credentials

### STEP 8: Test Admin Login

1. Go to: `https://your-actual-domain.com/admin-panel/login`
2. Enter:
   - **Email**: `admin@damdayvillage.org`
   - **Password**: `Admin@123`
3. Click **Login**
4. ✅ You should be logged in!

### STEP 9: Change Password (IMPORTANT!)

Right after logging in:
1. Go to your admin profile/settings
2. Change the password from `Admin@123` to something secure
3. Save the new password

## 🔍 Verify Everything Works

Check the system status:
1. Go to: `https://your-actual-domain.com/admin-panel/status`
2. All checks should show ✅ (green checkmarks)
3. If you see ❌ (red X), click on the error to see what to fix

## ❌ Troubleshooting Common Issues

### Issue 1: "Execute Shell Command" Doesn't Work

**Alternative Method Using SSH:**

1. SSH into your CapRover server:
   ```bash
   ssh root@your-caprover-server-ip
   ```

2. Find your container:
   ```bash
   docker ps | grep village
   ```

3. Note the CONTAINER ID (first column)

4. Access the container:
   ```bash
   docker exec -it CONTAINER_ID sh
   ```

5. Run migrations:
   ```bash
   cd /app
   npx prisma migrate deploy
   ```

6. Create admin:
   ```bash
   npm run db:seed
   ```

7. Exit:
   ```bash
   exit
   ```

### Issue 2: Still Getting 500 Error

**Check what's wrong:**

1. Visit: `https://your-domain.com/admin-panel/status`
2. Look for ❌ red X marks
3. Read the error messages
4. Common issues:
   - **Database Connection Failed**: DATABASE_URL is wrong → Go back to Step 3
   - **NEXTAUTH_URL has placeholders**: Not replaced → Go back to Step 3
   - **Admin user not found**: Creation failed → Repeat Step 7

### Issue 3: Can't Connect to Database

**Test the connection:**

1. In CapRover → Apps → Your postgres app
2. Check it's showing as "running"
3. Try the Execute Shell Command in your Village app:
   ```bash
   psql "$DATABASE_URL"
   ```
4. If it connects, type `\l` to list databases
5. Type `\q` to quit

**If it doesn't connect:**
- Check DATABASE_URL is correct (especially password)
- Verify postgres app is running
- Try restarting postgres app

### Issue 4: Migrations Fail with "Permission Denied"

**Fix database permissions:**

1. Connect to postgres container:
   ```bash
   docker exec -it $(docker ps | grep postgres | awk '{print $1}') sh
   ```

2. Access PostgreSQL:
   ```bash
   psql -U postgres
   ```

3. Grant permissions:
   ```sql
   GRANT ALL PRIVILEGES ON DATABASE villagedb TO postgres;
   \q
   ```

4. Try migrations again

## 📊 Visual Checklist

Copy this and check off as you complete each step:

```
Setup Checklist:
[ ] Step 1: Opened CapRover dashboard
[ ] Step 2: Found my Village app
[ ] Step 3: Updated NEXTAUTH_URL (removed $$cap_*$$)
[ ] Step 3: Generated and set NEXTAUTH_SECRET
[ ] Step 3: Set correct DATABASE_URL
[ ] Step 4: Clicked "Save & Update"
[ ] Step 5: PostgreSQL is running
[ ] Step 6: Ran migrations successfully
[ ] Step 7: Created admin user
[ ] Step 8: Successfully logged into admin panel
[ ] Step 9: Changed admin password

Verification:
[ ] Status page shows all green (✅)
[ ] Can access admin panel
[ ] No 500 errors
[ ] Changed default password
```

## 🎉 Success Indicators

You'll know everything is working when:
- ✅ Can visit `/admin-panel/login` without 500 error
- ✅ Can login with credentials
- ✅ Status page shows all green checks
- ✅ Can access admin panel features
- ✅ No errors in CapRover app logs

## 📞 Need More Help?

If you're still stuck:

1. **Check CapRover App Logs**:
   - CapRover Dashboard → Your App → App Logs tab
   - Look for error messages (they usually say what's wrong)

2. **Check these files**:
   - `CAPROVER_ADMIN_PANEL_FIX.md` - Detailed troubleshooting
   - `QUICK_FIX_ADMIN_500.md` - Quick reference
   - `ADMIN_FIX_FLOWCHART.md` - Visual guide

3. **Common error messages and fixes**:
   - "ECONNREFUSED" → Database not running or wrong URL
   - "Invalid credentials" → Wrong DATABASE_URL password
   - "Cannot find module" → App needs to be rebuilt
   - "NEXTAUTH_URL" error → Still has `$$cap_*$$` placeholder

## 💡 Pro Tips

1. **Always click "Save & Update"** not just "Save" when changing environment variables
2. **Wait for app to fully restart** before testing (check App Logs)
3. **Write down your credentials** especially DATABASE_URL and admin password
4. **Use the status page** (`/admin-panel/status`) to diagnose issues
5. **Keep a backup** of your environment variables somewhere safe

---

**Quick Recap:**
1. Fix environment variables (remove `$$cap_*$$`)
2. Set up PostgreSQL
3. Run migrations
4. Create admin user
5. Login and change password
6. Done! 🎉
