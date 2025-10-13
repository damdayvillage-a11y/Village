# 🚨 Admin Panel 500 Error - Quick Help

**Problem:** Getting "500 Internal Server Error" when trying to access admin panel login after CapRover deployment.

## 🆘 Instant Help

### 1️⃣ Open Your Browser and Visit:

```
https://your-domain.com/help/admin-500        # English
https://your-domain.com/help/admin-500-hi     # हिंदी (Hindi)
```

These pages will:
- ✅ Show you exactly what's wrong
- ✅ Provide step-by-step fixes
- ✅ Give you clickable links to auto-fix common issues

### 2️⃣ Check System Status:

```
https://your-domain.com/admin-panel/status
```

This shows:
- ✅ Environment configuration status
- ✅ Database connection status
- ✅ Admin user status
- ✅ Specific error messages with fixes

### 3️⃣ Auto-Create Admin User:

```
https://your-domain.com/api/admin/init
```

This will:
- ✅ Automatically create admin user if missing
- ✅ Return credentials (admin@damdayvillage.org / Admin@123)
- ✅ Tell you if there are any configuration issues

---

## 🔥 Common Causes

| Issue | Quick Fix |
|-------|-----------|
| **CapRover placeholders not replaced** | In CapRover → App Configs, replace `$$cap_*$$` with actual values |
| **Database not connected** | Set `DATABASE_URL` in CapRover App Configs |
| **Admin user missing** | Visit `/api/admin/init` in browser |
| **NEXTAUTH_SECRET invalid** | Generate with `openssl rand -base64 32`, set in CapRover |

---

## 📖 More Resources

| Document | When to Use |
|----------|-------------|
| [CAPROVER_ADMIN_PANEL_FIX.md](./CAPROVER_ADMIN_PANEL_FIX.md) | Complete step-by-step fix guide |
| [QUICK_FIX_ADMIN_500.md](./QUICK_FIX_ADMIN_500.md) | 1-minute quick reference |
| [ADMIN_500_FIX_GUIDE.md](./ADMIN_500_FIX_GUIDE.md) | Detailed technical troubleshooting |

---

## 💡 Pro Tips

1. **Replace ALL placeholders** in CapRover App Configs before deploying
2. **Check logs** in CapRover → Your App → Logs tab for specific errors
3. **After fixing**, click "Save & Update" (not just Save) in CapRover
4. **Change password** immediately after first login with default credentials

---

## 🆘 Still Stuck?

1. Check the in-app help pages (they're the most up-to-date)
2. Review CapRover logs for specific error messages
3. Run diagnostics: `npm run admin:diagnose https://your-domain.com`
4. Ensure database migrations are run: `npx prisma migrate deploy`

---

**Last Updated:** January 2025  
**For:** CapRover deployments of Smart Carbon-Free Village
