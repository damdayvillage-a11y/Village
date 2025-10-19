# Quick SSH Reference - Running Commands in Production

## ⚠️ IMPORTANT: Run Commands Inside Container, Not on Host!

When you SSH into your CapRover server, you're on the **host machine**. The application runs inside a **Docker container**. You need to execute commands inside the container.

## Quick Command Format

```bash
docker exec -it $(docker ps | grep srv-captain--village | awk '{print $1}') <YOUR_COMMAND>
```

## Most Common Tasks

### Fix "Unable to sign in" - Create Admin User
```bash
docker exec -it $(docker ps | grep srv-captain--village | awk '{print $1}') npm run db:seed
```

### Verify Admin User Exists
```bash
docker exec -it $(docker ps | grep srv-captain--village | awk '{print $1}') npm run admin:verify
```

### Check Environment Variables
```bash
docker exec -it $(docker ps | grep srv-captain--village | awk '{print $1}') npm run validate:env
```

### Test Database Connection
```bash
docker exec -it $(docker ps | grep srv-captain--village | awk '{print $1}') npm run db:test
```

### Diagnose Admin Login Issues
```bash
docker exec -it $(docker ps | grep srv-captain--village | awk '{print $1}') npm run admin:diagnose
```

### View Application Logs
```bash
docker logs $(docker ps | grep srv-captain--village | awk '{print $1}') | tail -100
```

### Get Interactive Shell in Container
```bash
docker exec -it $(docker ps | grep srv-captain--village | awk '{print $1}') sh
```

## Default Login Credentials

After running `db:seed`:
```
Email: admin@damdayvillage.org
Password: Admin@123
```

**Change password immediately after first login!**

## What If Commands Don't Work?

1. **Check container is running:**
   ```bash
   docker ps | grep srv-captain--village
   ```

2. **Check container logs for errors:**
   ```bash
   docker logs $(docker ps | grep srv-captain--village | awk '{print $1}') | tail -50
   ```

3. **Restart the container via CapRover Dashboard**

## Full Documentation

For complete troubleshooting guide, see: [SSH_TROUBLESHOOTING.md](./SSH_TROUBLESHOOTING.md)

---

**Remember:** Never run `npm run ...` directly on the host. Always use `docker exec` to run inside the container!
