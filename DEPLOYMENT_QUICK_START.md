# Deployment Quick Start Guide

## 🚀 Automatic Deployment to DigitalOcean

This repository includes a fully automated CI/CD pipeline for deploying to DigitalOcean server (142.93.208.86).

### Prerequisites Checklist

Before using the deployment workflow, ensure you have:

- [ ] DigitalOcean server (142.93.208.86) with Ubuntu
- [ ] User `deployer` with SSH key access
- [ ] Docker and Docker Compose installed on server
- [ ] GitHub repository secrets configured (see below)

### Quick Setup (5 minutes)

#### 1. Configure GitHub Secrets

Go to `Repository Settings > Secrets and variables > Actions` and add:

| Secret Name | Get Value From |
|-------------|----------------|
| `DO_HOST` | `142.93.208.86` |
| `DO_USER` | `deployer` |
| `SSH_PRIVATE_KEY` | `cat ~/.ssh/id_rsa` |
| `KNOWN_HOSTS` | `ssh-keyscan 142.93.208.86` |
| `GIT_TOKEN` | GitHub Settings > Developer settings > PAT |
| `DATABASE_PASSWORD` | Generate secure password |
| `NEXTAUTH_SECRET` | `openssl rand -base64 32` |

#### 2. Test SSH Connectivity

From your local machine:

```bash
# Clone the repository
git clone https://github.com/damdayvillage-a11y/Village.git
cd Village

# Run connectivity test
./scripts/test-ssh-connectivity.sh
```

Expected output: All checks should pass ✅

#### 3. Deploy

**Option A: Manual Deploy (Recommended for first time)**

1. Go to GitHub Actions tab
2. Click "Deploy to DigitalOcean"
3. Click "Run workflow" > Select `main` branch
4. Click "Run workflow" button
5. Watch the deployment progress

**Option B: Automatic Deploy**

```bash
git checkout main
git push origin main
# Deployment starts automatically
```

#### 4. Verify Deployment

Once workflow completes:

```bash
# Check health
curl http://142.93.208.86:3000/api/health

# Check application
open http://142.93.208.86:3000

# Check admin panel
open http://142.93.208.86:3000/admin-panel/login
```

### Workflow Overview

The deployment process consists of 2 jobs:

**1. Server Connectivity Test (`server-test`)**
- ✅ SSH connection test
- ✅ Docker access verification
- ✅ Directory structure check

**2. Application Deployment (`deploy`)**
- 📥 Clone/update repository on server
- 🔧 Configure environment variables
- 🐳 Build Docker containers
- 🏥 Health check verification
- 🔄 Automatic rollback on failure
- 📊 Deployment status report

### Monitoring

**View Logs:**
```bash
ssh deployer@142.93.208.86 'sudo docker logs -f village-app'
```

**Check Container Status:**
```bash
ssh deployer@142.93.208.86 'sudo docker ps'
```

**Run Health Check:**
```bash
./scripts/healthcheck.sh http://142.93.208.86:3000
```

### Troubleshooting

**Deployment fails?**
- Check workflow logs in GitHub Actions
- Review [DEPLOYMENT_TESTING.md](docs/DEPLOYMENT_TESTING.md)
- Run `./scripts/test-ssh-connectivity.sh`

**Health check fails?**
```bash
ssh deployer@142.93.208.86 'sudo docker logs village-app | tail -50'
```

**Need to rollback?**
The workflow automatically rolls back on failure. Manual rollback:
```bash
ssh deployer@142.93.208.86
cd /home/deployer/apps/village
sudo docker compose down
sudo docker tag village-app:rollback village-app:latest
sudo docker compose up -d
```

### Success Indicators

✅ Workflow status: Success (green checkmark)  
✅ `server-test` job: All tests pass  
✅ `deploy` job: Completes without errors  
✅ Health check: Returns 200 OK  
✅ Application: Accessible on port 3000  
✅ Containers: Both `village-app` and `village-db` running

### Files Structure

```
.
├── .github/workflows/deploy.yml          # Main deployment workflow
├── docker-compose.yml                    # Production Docker config
├── scripts/
│   ├── healthcheck.sh                    # Health verification
│   └── test-ssh-connectivity.sh          # SSH connectivity test
└── docs/
    └── DEPLOYMENT_TESTING.md             # Detailed testing guide
```

### Next Steps After Successful Deployment

1. **Configure Domain (Optional)**
   - Point DNS to 142.93.208.86
   - Setup SSL with Let's Encrypt
   - Update NEXTAUTH_URL in secrets

2. **Setup Monitoring**
   - Configure uptime monitoring
   - Setup log aggregation
   - Enable alerting

3. **Secure the Server**
   - Configure firewall (UFW)
   - Setup fail2ban
   - Enable automatic updates

4. **Database Backups**
   - Schedule regular backups
   - Test restore procedures
   - Document backup locations

### Support

For detailed documentation, see:
- [DEPLOYMENT_TESTING.md](docs/DEPLOYMENT_TESTING.md) - Complete testing guide
- [README.md](README.md) - Full project documentation
- [TROUBLESHOOTING.md](TROUBLESHOOTING.md) - Common issues and solutions

### Deployment Architecture

```
┌─────────────────────────────┐
│   GitHub Actions Runner     │
│   (Workflow Execution)      │
└──────────────┬──────────────┘
               │ SSH
               ↓
┌─────────────────────────────┐
│  DigitalOcean Ubuntu Server │
│    IP: 142.93.208.86        │
├─────────────────────────────┤
│  Docker Compose              │
├─────────────────────────────┤
│  ┌─────────────────────┐   │
│  │  village-app        │   │
│  │  Next.js App        │   │
│  │  Port: 3000:80      │   │
│  └─────────────────────┘   │
│                              │
│  ┌─────────────────────┐   │
│  │  village-db         │   │
│  │  PostgreSQL 15      │   │
│  │  Port: 5432         │   │
│  └─────────────────────┘   │
└─────────────────────────────┘
```

### Default Credentials

After deployment, admin access:
- **URL**: http://142.93.208.86:3000/admin-panel/login
- **Email**: admin@damdayvillage.org
- **Password**: Admin@123

⚠️ **Change default password immediately!**

---

**Ready to Deploy?** Follow steps 1-4 above and you'll be live in minutes! 🚀
