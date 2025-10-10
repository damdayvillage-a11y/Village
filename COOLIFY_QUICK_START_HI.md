# ⚡ Coolify Quick Start - 15 Minutes (हिंदी गाइड)

> **अपने Village app को Coolify पर 15 मिनट में deploy करें!**

## 🎯 आप क्या करेंगे

1. ✅ PostgreSQL database बनाएं (2 मिनट)
2. ✅ Application deploy करें (5 मिनट)
3. ✅ Environment configure करें (3 मिनट)
4. ✅ Database और admin setup करें (3 मिनट)
5. ✅ सब कुछ verify करें (2 मिनट)

**कुल समय: लगभग 15 मिनट**

---

## 📋 ज़रूरी चीज़ें

- Coolify instance चालू होना चाहिए
- GitHub repository access
- Domain name (या Coolify का default इस्तेमाल करें)

---

## 🚀 Step-by-Step (कदम दर कदम)

### Step 1: Project बनाएं (30 सेकंड)

1. Coolify में login करें
2. **"+ New"** → **"Project"** पर click करें
3. Name: `village-app` (या कोई भी नाम)
4. **"Save"** पर click करें

---

### Step 2: Database बनाएं (2 मिनट)

1. Project में, **"+ New Resource"** → **"Database"** → **"PostgreSQL"** पर click करें
2. यह भरें:
   - Name: `village-db`
   - Database: `villagedb`
   - Username: `villageuser`
   - Password: Strong password बनाएं (इसे SAVE करें!)
3. **"Create"** पर click करें
4. Green status ✅ का wait करें

**यह connection string save करें:**
```
postgresql://villageuser:आपका_पासवर्ड@village-db:5432/villagedb
```

---

### Step 3: Application बनाएं (2 मिनट)

1. Project में, **"+ New Resource"** → **"Application"** पर click करें
2. **"Public Repository"** select करें
3. Repository: `https://github.com/damdayvillage-a11y/Village`
4. Branch: `main`
5. Build Pack: **"Dockerfile"**
6. Dockerfile: `Dockerfile.simple`
7. Port: `80`
8. **"Continue"** पर click करें

---

### Step 4: Environment Variables Configure करें (3 मिनट)

Application → **"Environment Variables"** में जाएं

ये **4 ज़रूरी** variables add करें:

```bash
NODE_ENV=production

NEXTAUTH_URL=https://आपका-डोमेन.com

NEXTAUTH_SECRET=यहां_सीक्रेट_पेस्ट_करें

DATABASE_URL=postgresql://villageuser:आपका_पासवर्ड@village-db:5432/villagedb
```

**NEXTAUTH_SECRET अभी generate करें:**

```bash
# अपने कंप्यूटर पर यह command चलाएं:
openssl rand -base64 32

# Output को copy करके NEXTAUTH_SECRET में paste करें
```

**ये 3 OPTIMIZATION variables भी add करें:**

```bash
NEXT_TELEMETRY_DISABLED=1
GENERATE_SOURCEMAP=false
CI=true
```

**"Save"** पर click करें

---

### Step 5: Networking Configure करें (1 मिनट)

1. **"Networking"** section में जाएं
2. **"Expose"** enable करें
3. **"SSL/TLS"** enable करें (automatic Let's Encrypt)
4. अपना domain set करें या Coolify का default use करें
5. **"Save"** पर click करें

---

### Step 6: Deploy करें! (2-3 मिनट)

1. बड़ा **"Deploy"** button click करें
2. Build logs देखें
3. Complete होने का wait करें (~2-3 मिनट)
4. Status green ✅ होना चाहिए

---

### Step 7: Database Setup करें (2 मिनट)

Deploy हो जाने के बाद, Application → **"Terminal"** में जाएं

ये 2 commands चलाएं:

```bash
# 1. Migrations चलाएं
npx prisma migrate deploy

# 2. Admin user बनाएं
npm run db:seed
```

**अपने credentials note करें:**
- Admin: `admin@damdayvillage.org` / `Admin@123`
- Host: `host@damdayvillage.org` / `Host@123`

---

### Step 8: Verify करें! (2 मिनट)

#### Health Check Test करें

Visit करें: `https://आपका-डोमेन.com/api/health`

यह दिखना चाहिए:
```json
{
  "status": "healthy",
  "services": {
    "database": {"status": "healthy"}
  }
}
```

#### Admin Login Test करें

1. Visit करें: `https://आपका-डोमेन.com/admin-panel/login`
2. Login करें: `admin@damdayvillage.org` / `Admin@123`
3. काम करना चाहिए! ✅ (कोई 500 error नहीं!)
4. **तुरंत password बदलें!**

---

## ✅ Success Checklist

- [ ] Database बन गया और चल रहा है (green)
- [ ] Application successfully deploy हो गया
- [ ] Environment variables configure हो गए
- [ ] Migrations successfully चले
- [ ] Admin user बन गया
- [ ] Health check pass हो रहा है
- [ ] Admin login काम कर रहा है
- [ ] Password बदल दिया

---

## 🎉 हो गया!

आपका Village app अब Coolify पर चल रहा है!

**अगले Steps:**
1. Admin password बदलें
2. Optional services configure करें (payments, OAuth)
3. Monitoring setup करें
4. Automatic backups enable करें

---

## 🐛 Quick Troubleshooting (समस्याएं और समाधान)

### Build Fail हो गया?
- Check करें कि Dockerfile `Dockerfile.simple` है
- Memory को 2GB तक बढ़ाएं
- "Force Rebuild" try करें

### Database से connect नहीं हो रहा?
- Verify करें database चल रहा है (green)
- DATABASE_URL check करें database credentials से match करता है
- Host के रूप में service name `village-db` use करें

### Login पर 500 Error आ रहा है?
- NEXTAUTH_URL verify करें - आपका actual domain होना चाहिए
- NEXTAUTH_SECRET verify करें - set है (32+ chars)
- Migrations चलाएं: `npx prisma migrate deploy`
- Database seed करें: `npm run db:seed`

### Domain/SSL Issues?
- DNS check करें Coolify server को point कर रहा है
- SSL certificate का wait करें (~2 मिनट लगते हैं)
- पहले Coolify का default domain try करें

---

## 📚 पूरी Documentation (English में)

विस्तृत जानकारी के लिए:
- [Complete Deployment Guide](./COOLIFY_DEPLOYMENT_GUIDE.md)
- [Migration from CapRover](./CAPROVER_TO_COOLIFY_MIGRATION.md)
- [Environment Variables](./ENVIRONMENT_VARIABLES.md)

---

## 🆘 मदद चाहिए?

**समस्याएं:**
- [Troubleshooting Guide](./TROUBLESHOOTING.md) देखें
- [Coolify Discord](https://coolify.io/discord) join करें
- [GitHub Issue](https://github.com/damdayvillage-a11y/Village/issues) खोलें

---

## 💡 महत्वपूर्ण बातें (Important Points)

### CapRover से Coolify में क्या फायदा है?

**पहले (CapRover में):**
- ❌ Admin panel में 500 internal server error
- ❌ `$$cap_*$$` placeholders की problem
- ❌ Database connection issues
- ❌ Manual SSL setup

**अब (Coolify में):**
- ✅ Admin panel बिना error के काम करता है
- ✅ कोई placeholder issues नहीं
- ✅ Automatic database networking
- ✅ Automatic SSL/HTTPS
- ✅ Better monitoring और logging
- ✅ Built-in backups

### क्यों Coolify better है?

1. **Easy Setup:** सब कुछ automatic है
2. **No Errors:** Admin panel 500 error नहीं आएगा
3. **Better Interface:** Modern और easy to use
4. **Automatic Backups:** Data safe रहता है
5. **Better Support:** Active development और community

---

## 🔑 Default Credentials (पहली बार login के लिए)

```
Admin Login:
Email: admin@damdayvillage.org
Password: Admin@123

Host Login:
Email: host@damdayvillage.org
Password: Host@123
```

**⚠️ ज़रूरी:** Login करने के बाद तुरंत password बदलें!

---

## 📞 Contact & Support

**Problems होने पर:**
1. पहले [Troubleshooting Guide](./TROUBLESHOOTING.md) देखें
2. Application logs check करें
3. Health check endpoint test करें
4. फिर भी problem हो तो GitHub issue खोलें

**Documentation:**
- English guides ज़्यादा detailed हैं
- यह Hindi guide quick reference के लिए है
- सभी features के लिए English guides देखें

---

**Version:** 1.0  
**समय:** ~15 मिनट  
**Difficulty:** आसान ⭐⭐☆☆☆

**सफलता के साथ deployment करें! 🚀**
