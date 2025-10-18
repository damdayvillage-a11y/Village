# CapRover 500 Internal Server Error - पूर्ण समाधान गाइड (हिंदी में)

## 🔴 समस्या: Admin Panel Login में 500 Internal Server Error

यह गाइड आपको **व्यवस्थित रूप से** CapRover पर admin panel में login करते समय आने वाली 500 error को **ठीक करने** में मदद करेगी।

---

## 🆕 नई सुविधा: स्वचालित Admin User बनाना

**अच्छी खबर!** अब application automatically admin और host users बनाती है जब database connected होता है!

- ✅ Admin user automatically create हो जाता है (email: admin@damdayvillage.org, password: Admin@123)
- ✅ Host user automatically create हो जाता है (email: host@damdayvillage.org, password: Host@123)
- ✅ कोई SSH commands चलाने की जरूरत नहीं!

बस deploy करें और application अपने आप users create कर देगी।

⚠️ **महत्वपूर्ण:** पहली बार login करने के बाद तुरंत password बदलें!

---

## 🚀 तुरंत समाधान (सबसे आम समस्याएं)

### स्टेप 1: पहले System Status देखें

अपनी deployed app का status page देखें:
```
https://your-domain.com/admin-panel/status
```

यह पेज आपको बताएगा कि क्या गलत है। सबसे आम समस्याएं हैं:

1. **Environment variables में placeholders हैं** (जैसे `$$cap_appname$$`)
2. **NEXTAUTH_SECRET set नहीं है या बहुत छोटा है**
3. **DATABASE_URL सही से configured नहीं है**
4. **Database में admin user exist नहीं करता** (अब automatically fix हो जाता है!)

---

## 📋 संपूर्ण Step-by-Step समाधान

### Phase 1: CapRover में Environment Variables को Verify करें

#### Step 1.1: CapRover Dashboard खोलें
1. अपने CapRover dashboard में login करें
2. **Apps** → अपने app के नाम पर क्लिक करें
3. **App Configs** tab पर जाएं
4. नीचे **Environment Variables** section तक scroll करें

#### Step 1.2: सभी Placeholders को Replace करें

**⚠️ बहुत महत्वपूर्ण:** `$$cap_*$$` वाली सभी values को ढूंढें और बदलें!

**ये REQUIRED variables चेक करें:**

##### ✅ NEXTAUTH_URL
```bash
# ❌ गलत (placeholder है):
NEXTAUTH_URL=https://$$cap_appname$$.$$cap_root_domain$$

# ✅ सही (असली domain):
NEXTAUTH_URL=https://your-actual-domain.com
# या अगर CapRover subdomain use कर रहे हैं:
NEXTAUTH_URL=https://village.captain.yourdomain.com
```

##### ✅ NEXTAUTH_SECRET
```bash
# ❌ गलत (placeholder या बहुत छोटा):
NEXTAUTH_SECRET=$$cap_nextauth_secret$$
NEXTAUTH_SECRET=change-me
NEXTAUTH_SECRET=short

# ✅ सही (नया generate करें):
# अपने computer पर यह command चलाएं:
openssl rand -base64 32

# Output को copy करें और NEXTAUTH_SECRET value के रूप में paste करें
# Example output (आपका अलग होगा):
NEXTAUTH_SECRET=BAWGc+0joocoP+7LA8EEExs+I9eDh5vQeog4vhyku7g=
```

##### ✅ DATABASE_URL
```bash
# ❌ गलत (placeholder है):
DATABASE_URL=$$cap_database_url$$

# ✅ सही (CapRover PostgreSQL service):
DATABASE_URL=postgresql://username:password@srv-captain--postgres:5432/villagedb

# Replace करें:
# - username: आपका PostgreSQL username (जैसे, damdiyal)
# - password: आपका PostgreSQL password
# - srv-captain--postgres: CapRover internal service name (ऐसे ही रखें!)
# - villagedb: आपका database name

# Example:
DATABASE_URL=postgresql://damdiyal:MySecurePass123@srv-captain--postgres:5432/villagedb
```

**📝 महत्वपूर्ण:** `srv-captain--` prefix CapRover का internal service naming convention है। यह placeholder **नहीं** है! CapRover के PostgreSQL service का use करते समय इसे ऐसे ही रखें।

#### Step 1.3: Save करें और Redeploy करें
1. नीचे **Save & Update** button पर क्लिक करें
2. App के automatically redeploy होने का इंतजार करें (2-3 मिनट)
3. Deployment logs में errors चेक करें

---

### Phase 2: Database Connection Verify करें

#### Step 2.1: PostgreSQL चल रहा है चेक करें
CapRover dashboard में:
1. **Apps** पर जाएं
2. अपना PostgreSQL app ढूंढें (जैसे, `postgres`)
3. सुनिश्चित करें कि status: **Running** (हरा) दिख रहा है
4. अगर running नहीं है, तो **Start** button पर क्लिक करें

#### Step 2.2: Database Connection Verify करें
अपने CapRover server में SSH करें और चलाएं:

```bash
# CapRover server में SSH करें
ssh root@your-server-ip

# Database connection test करें
docker exec -it $(docker ps | grep captain-village | awk '{print $1}') sh
cd /app
npm run db:test
```

**Expected output:**
```
✅ Database connection successful!
✅ Admin user exists
```

**अगर connection fail होता है:**
- DATABASE_URL सही है चेक करें
- PostgreSQL container चल रहा है सुनिश्चित करें
- Containers के बीच network connectivity verify करें
- CapRover dashboard में PostgreSQL logs देखें

---

### Phase 3: Admin User Create/Verify करें

#### Option A: Browser के माध्यम से (सबसे आसान!)

अपने browser में यह URL खोलें:
```
https://your-domain.com/api/admin/init
```

**Expected response:**
```json
{
  "success": true,
  "message": "Admin user created successfully",
  "credentials": {
    "email": "admin@damdayvillage.org",
    "password": "Admin@123",
    "warning": "⚠️ IMPORTANT: Change this password immediately after first login!"
  }
}
```

अगर यह दिखता है, तो admin user create हो गया! **Phase 4** पर जाएं।

**नोट:** अब यह steps की जरूरत नहीं! Application automatically admin user create कर देती है।

अगर फिर भी manually create करना चाहते हैं:

#### Option B: CapRover Dashboard के माध्यम से

1. CapRover में अपने app पर जाएं
2. **Deployment** tab पर क्लिक करें
3. **Execute Shell Command in Running Container** तक scroll करें
4. चलाएं:
   ```bash
   npm run db:seed
   ```
5. Complete होने का इंतजार करें ("✅ Admin user created" दिखना चाहिए)

#### Option C: SSH के माध्यम से (अब जरूरी नहीं!)

```bash
# CapRover server में SSH करें
ssh root@your-server-ip

# Container में enter करें
docker exec -it $(docker ps | grep captain-village | awk '{print $1}') sh

# Admin user create करें
cd /app
npm run db:seed
```

---

### Phase 4: सब कुछ काम कर रहा है Verify करें

#### Step 4.1: System Status चेक करें
Visit: `https://your-domain.com/admin-panel/status`

**सभी items में ✅ (हरे checkmarks) दिखने चाहिए:**
- NEXTAUTH_URL: ✅ Configured
- NEXTAUTH_SECRET: ✅ Valid (32+ characters)
- Database: ✅ Connected
- Admin User: ✅ Exists

#### Step 4.2: Login Test करें
1. जाएं: `https://your-domain.com/admin-panel/login`
2. Credentials enter करें:
   - **Email:** `admin@damdayvillage.org`
   - **Password:** `Admin@123`
3. **Sign in as Admin** पर क्लिक करें
4. आप admin panel पर redirect हो जाने चाहिए!

#### Step 4.3: Default Password बदलें (महत्वपूर्ण!)
पहली successful login के बाद:
1. Profile settings पर जाएं
2. तुरंत password बदलें
3. Strong password use करें (कम से कम 12 characters, letters, numbers, symbols का mix)

---

## 🔍 Advanced Diagnostics

### पूर्ण Diagnostic चलाएं

अपने container में SSH करें और चलाएं:

```bash
# CapRover में SSH करें
ssh root@your-server-ip

# Container में enter करें
docker exec -it $(docker ps | grep captain-village | awk '{print $1}') sh

# Diagnostics चलाएं
cd /app

# Environment variables चेक करें
npm run validate:env

# Admin user verify करें
npm run admin:verify

# Database connection test करें
npm run db:test

# पूर्ण diagnostic चलाएं
npm run admin:diagnose https://your-domain.com
```

### Application Logs देखें

CapRover Dashboard में:
1. अपने app पर जाएं
2. **Logs** tab पर क्लिक करें
3. Error messages ढूंढें
4. आम errors और उनके fixes:

```
❌ "Database connection failed"
→ Fix: DATABASE_URL चेक करें, PostgreSQL चल रहा है सुनिश्चित करें

❌ "NEXTAUTH_SECRET is not set"
→ Fix: NEXTAUTH_SECRET generate करें और set करें

❌ "Cannot find module '@prisma/client'"
→ Fix: App rebuild करें - delete और redeploy करें

❌ "Invalid credentials"
→ Fix: /api/admin/init के माध्यम से admin user create करें

❌ "ECONNREFUSED"
→ Fix: PostgreSQL चल नहीं रहा या DATABASE_URL में गलत host
```

---

## 🛠️ आम समस्याएं और समाधान

### समस्या 1: Environment variables ठीक करने के बाद भी "500 Error"

**समाधान:**
```bash
# Force rebuild और redeploy करें
# CapRover Dashboard में:
1. App Configs पर जाएं
2. कोई छोटा change करें (किसी variable में space add करें)
3. Save & Update पर क्लिक करें
4. या GitHub से नया deployment trigger करें
```

### समस्या 2: Admin user creation fail होता है

**Error:** "Table 'User' does not exist"

**समाधान:**
```bash
# Database migrations चलाएं
docker exec -it $(docker ps | grep captain-village | awk '{print $1}') sh
cd /app
npx prisma migrate deploy
npm run db:seed
```

### समस्या 3: /admin-panel/status page access नहीं हो रहा

**समाधान:**
यह build/deployment level की समस्या है। चेक करें:
1. CapRover में build logs में errors
2. App actually चल रहा है (crash नहीं हुआ)
3. Resource limits (जरूरत हो तो memory बढ़ाएं)

### समस्या 4: PostgreSQL connection issues

**Error:** "ECONNREFUSED" या "ENOTFOUND"

**Check list:**
- [ ] CapRover में PostgreSQL container चल रहा है
- [ ] DATABASE_URL में internal service के लिए `srv-captain--postgres` use हो रहा है
- [ ] Username और password सही हैं
- [ ] Database name exist करता है
- [ ] Port 5432 है (default)

**Connection test करें:**
```bash
# App container के अंदर से
psql "$DATABASE_URL"
# बिना errors के connect होना चाहिए
```

### समस्या 5: "Prisma Client not found" error

**समाधान:**
```bash
# Prisma Client rebuild करें
docker exec -it $(docker ps | grep captain-village | awk '{print $1}') sh
cd /app
npx prisma generate
```

---

## 📖 संदर्भ: आवश्यक Environment Variables

इन्हें CapRover App Configs में copy करें और values replace करें:

```bash
# =============================================================================
# REQUIRED - Core Settings
# =============================================================================
NODE_ENV=production
NEXTAUTH_URL=https://your-actual-domain.com
NEXTAUTH_SECRET=<openssl-rand-base64-32-से-generate-करें>
DATABASE_URL=postgresql://user:pass@srv-captain--postgres:5432/villagedb

# =============================================================================
# REQUIRED - Build Settings
# =============================================================================
NEXT_TELEMETRY_DISABLED=1
GENERATE_SOURCEMAP=false
CI=true
CAPROVER_BUILD=true

# =============================================================================
# OPTIONAL - केवल अगर इन features का use कर रहे हैं
# =============================================================================
# Payment (use नहीं कर रहे तो remove करें)
# STRIPE_SECRET_KEY=sk_test_...
# RAZORPAY_KEY_ID=rzp_test_...

# OAuth (use नहीं कर रहे तो remove करें)
# GOOGLE_CLIENT_ID=your-client-id
# GITHUB_CLIENT_ID=your-client-id

# Email (use नहीं कर रहे तो remove करें)
# EMAIL_SERVER_HOST=smtp.gmail.com
# EMAIL_FROM=noreply@yourdomain.com
```

---

## 🆘 अभी भी समस्याएं हैं?

### Quick Links
- **Status Page:** `https://your-domain.com/admin-panel/status`
- **Create Admin:** `https://your-domain.com/api/admin/init`
- **Health Check:** `https://your-domain.com/api/health`
- **Env Check:** `https://your-domain.com/api/admin/check-env`

### Documentation
- [CAPGUIDE.md](./CAPGUIDE.md) - पूर्ण CapRover deployment guide
- [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) - सामान्य troubleshooting
- [docs/PRODUCTION_LOGIN_TROUBLESHOOTING.md](./docs/PRODUCTION_LOGIN_TROUBLESHOOTING.md) - Production login issues

### मदद लें
1. CapRover dashboard में application logs देखें
2. इस guide में दिखाए गए diagnostic commands चलाएं
3. Similar problems के लिए GitHub issues देखें
4. Support से संपर्क करें, साथ में भेजें:
   - `npm run validate:env` का output
   - `npm run admin:diagnose` का output
   - Error messages के screenshots
   - CapRover application logs

---

## ✅ Success Checklist

इस guide को follow करने के बाद, verify करें:

- [ ] सभी environment variables set हैं (कोई `$$cap_*$$` placeholders नहीं)
- [ ] NEXTAUTH_SECRET 32+ characters का है और unique है
- [ ] DATABASE_URL successfully connect होता है
- [ ] PostgreSQL container चल रहा है
- [ ] Database migrations apply हो गए हैं
- [ ] Database में admin user exist करता है
- [ ] `/admin-panel/status` में सभी green checks दिख रहे हैं
- [ ] `/admin-panel/login` पर login हो सकते हैं
- [ ] पहली login के बाद default password बदल दिया गया

**अगर सभी items checked हैं, तो आप done हैं! 🎉**

---

**Last Updated:** 2025-10-15
**Version:** 1.0.0
