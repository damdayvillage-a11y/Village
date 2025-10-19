# Documentation Index

## 🚨 Common Issues - Start Here!

### Having Login or SSH Command Issues?

- **"Unable to sign in" error?** → [Quick SSH Reference](./QUICK_SSH_REFERENCE.md)
- **npm commands failing with ENOENT error?** → [SSH Troubleshooting Guide](./SSH_TROUBLESHOOTING.md)
- **Commands not working when SSH'd into server?** → [Quick SSH Reference](./QUICK_SSH_REFERENCE.md)

### Quick Answer:
Run commands **inside the Docker container**, not on the host:
```bash
docker exec -it $(docker ps | grep srv-captain--village | awk '{print $1}') npm run db:seed
```

---

## Deployment Guides

- **[Quick SSH Reference](./QUICK_SSH_REFERENCE.md)** - Most common commands for SSH users
- **[SSH Troubleshooting Guide](./SSH_TROUBLESHOOTING.md)** - Complete SSH troubleshooting
- **[DEPLOY.md](./DEPLOY.md)** - Complete CapRover deployment guide
- **[CAPGUIDE.md](./md-files/CAPGUIDE.md)** - CapRover quick start guide
- **[CAPROVER_DATABASE_SETUP.md](./md-files/CAPROVER_DATABASE_SETUP.md)** - Database setup

## Configuration Guides

- **[ENVIRONMENT_VARIABLES.md](./md-files/ENVIRONMENT_VARIABLES.md)** - Environment configuration
- **[CAPROVER_DEPLOYMENT.md](./CAPROVER_DEPLOYMENT.md)** - Detailed CapRover setup

## Troubleshooting

- **[SSH_TROUBLESHOOTING.md](./SSH_TROUBLESHOOTING.md)** - SSH command issues
- **[CAPROVER_TROUBLESHOOTING.md](./CAPROVER_TROUBLESHOOTING.md)** - CapRover issues

## Other Resources

- **[DEPLOYMENT_VERIFICATION.md](./md-files/DEPLOYMENT_VERIFICATION.md)** - Verify deployment
- **[AUTO_INITIALIZATION_SUMMARY.md](./md-files/AUTO_INITIALIZATION_SUMMARY.md)** - Auto-initialization features

---

**Most users having issues should start with:** [Quick SSH Reference](./QUICK_SSH_REFERENCE.md)
