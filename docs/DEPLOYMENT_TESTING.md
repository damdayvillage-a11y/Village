# Deployment Testing Guide

This guide explains how to test the DigitalOcean deployment pipeline before using it in production.

## Prerequisites

Before running the deployment workflow, ensure the following GitHub secrets are configured:

### Required Secrets

Configure these in your GitHub repository at `Settings > Secrets and variables > Actions`:

| Secret Name | Description | Example/Notes |
|-------------|-------------|---------------|
| `DO_HOST` | DigitalOcean server IP | `142.93.208.86` |
| `DO_USER` | SSH username with Docker privileges | `deployer` |
| `SSH_PRIVATE_KEY` | Private SSH key for authentication | Full content of `~/.ssh/id_rsa` |
| `KNOWN_HOSTS` | SSH known hosts fingerprint | Output of `ssh-keyscan 142.93.208.86` |
| `GIT_TOKEN` | GitHub Personal Access Token | For private repo access |
| `DATABASE_PASSWORD` | PostgreSQL password | Secure random password |
| `NEXTAUTH_SECRET` | NextAuth.js secret | Generate with `openssl rand -base64 32` |

## Server Setup

### 1. Prepare the DigitalOcean Server

SSH into your server and run the following setup:

```bash
# Update system packages
sudo apt-get update && sudo apt-get upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Add deployer user to docker group
sudo usermod -aG docker deployer

# Install Docker Compose (usually included with modern Docker)
docker compose version

# Install Git
sudo apt-get install -y git curl

# Create deployment directory
sudo mkdir -p /home/deployer/apps/village
sudo chown -R deployer:deployer /home/deployer/apps

# Configure passwordless sudo for deployer (if needed)
echo "deployer ALL=(ALL) NOPASSWD: /usr/bin/docker" | sudo tee /etc/sudoers.d/deployer
sudo chmod 0440 /etc/sudoers.d/deployer
```

### 2. Configure SSH Key Authentication

On your local machine:

```bash
# Generate SSH key pair (if you don't have one)
ssh-keygen -t rsa -b 4096 -C "deployment@village"

# Copy public key to server
ssh-copy-id deployer@142.93.208.86

# Test SSH connection
ssh deployer@142.93.208.86 "whoami"

# Get known_hosts fingerprint
ssh-keyscan 142.93.208.86
```

### 3. Configure GitHub Secrets

1. Go to your GitHub repository
2. Navigate to `Settings > Secrets and variables > Actions`
3. Click `New repository secret` for each required secret:

**SSH_PRIVATE_KEY:**
```bash
# Display your private key
cat ~/.ssh/id_rsa
# Copy the entire output including header and footer
```

**KNOWN_HOSTS:**
```bash
# Get the fingerprint
ssh-keyscan 142.93.208.86
# Copy the entire output
```

**GIT_TOKEN:**
1. Go to GitHub Settings > Developer settings > Personal access tokens > Tokens (classic)
2. Generate new token with `repo` scope
3. Copy the token value

**NEXTAUTH_SECRET:**
```bash
# Generate a secure secret
openssl rand -base64 32
```

## Testing the Deployment

### Step 1: Test SSH Connectivity

Run the connectivity test script locally:

```bash
# From the repository root
./scripts/test-ssh-connectivity.sh

# Or with explicit values
DO_HOST=142.93.208.86 DO_USER=deployer ./scripts/test-ssh-connectivity.sh
```

Expected output:
```
🔍 Testing SSH Connectivity to DigitalOcean Server
==================================================

Test 1: Basic SSH Connection
✅ SSH connection successful

Test 2: Docker Access
✅ Docker access confirmed

Test 3: Sudo Privileges (Docker Compose)
✅ Sudo access to docker confirmed

Test 4: Deployment Directory
✅ Deployment directory exists

Test 5: Git Availability
✅ Git is installed

Test 6: Docker Compose Availability
✅ Docker Compose is installed

Test 7: Network Connectivity to GitHub
✅ GitHub is reachable

🎉 All connectivity tests passed!
```

### Step 2: Test Deployment Workflow

Once all secrets are configured:

#### Option A: Manual Trigger (Recommended for first test)

1. Go to GitHub Actions tab
2. Select "Deploy to DigitalOcean" workflow
3. Click "Run workflow"
4. Select `main` branch
5. Click "Run workflow" button
6. Monitor the workflow execution

#### Option B: Automatic Trigger

Push a commit to the `main` branch:

```bash
git checkout main
git pull origin main
git commit --allow-empty -m "Test deployment trigger"
git push origin main
```

### Step 3: Monitor Deployment

Watch the workflow progress in real-time:

1. **In GitHub Actions UI:**
   - Click on the running workflow
   - Expand each step to see detailed logs
   - Watch for the "Deployment Success Summary" step

2. **On the Server:**
   ```bash
   # SSH into the server
   ssh deployer@142.93.208.86

   # Watch container logs
   sudo docker logs -f village-app

   # Check container status
   sudo docker ps

   # Test the service
   curl http://localhost:3000/api/health
   ```

3. **From Your Browser:**
   - Visit `http://142.93.208.86:3000`
   - Check health endpoint: `http://142.93.208.86:3000/api/health`
   - Access admin panel: `http://142.93.208.86:3000/admin-panel/login`

## Troubleshooting

### SSH Connection Fails

**Error:** `Permission denied (publickey)`

**Solution:**
```bash
# Verify SSH key is correct
ssh -v deployer@142.93.208.86

# Re-copy public key to server
ssh-copy-id deployer@142.93.208.86

# Check key permissions
chmod 600 ~/.ssh/id_rsa
chmod 644 ~/.ssh/id_rsa.pub
```

### Docker Permission Denied

**Error:** `permission denied while trying to connect to the Docker daemon`

**Solution:**
```bash
# Add user to docker group
sudo usermod -aG docker deployer

# Restart docker service
sudo systemctl restart docker

# Log out and log back in for group changes to take effect
```

### Health Check Fails

**Error:** `Health check failed after 30 attempts`

**Solution:**
```bash
# Check container logs
sudo docker logs village-app

# Check if container is running
sudo docker ps -a

# Manually test health endpoint
curl -v http://localhost:3000/api/health

# Check port binding
sudo netstat -tulpn | grep 3000
```

### Deployment Rollback

If deployment fails, the workflow automatically attempts rollback. To manually rollback:

```bash
ssh deployer@142.93.208.86
cd /home/deployer/apps/village

# Stop current containers
sudo docker compose down

# Use rollback image if available
sudo docker tag village-app:rollback village-app:latest
sudo docker compose up -d

# Or revert to specific git commit
git reset --hard <previous-commit-sha>
sudo docker compose up -d --build
```

## Validation Checklist

Before considering the deployment successful, verify:

- [ ] Workflow completes without errors
- [ ] `server-test` job passes all checks
- [ ] `deploy` job completes successfully
- [ ] Container `village-app` is running
- [ ] Container `village-db` is running
- [ ] Health check returns 200 status
- [ ] Application is accessible on port 3000
- [ ] Admin panel login page loads
- [ ] No errors in container logs

## Post-Deployment

After successful deployment:

1. **Test the application:**
   ```bash
   # Health check
   curl http://142.93.208.86:3000/api/health

   # Admin panel
   curl -I http://142.93.208.86:3000/admin-panel/login
   ```

2. **Monitor logs:**
   ```bash
   ssh deployer@142.93.208.86 'sudo docker logs -f village-app'
   ```

3. **Setup monitoring (recommended):**
   - Configure uptime monitoring
   - Setup log aggregation
   - Enable automatic backups for database

4. **Security hardening:**
   - Setup firewall (UFW)
   - Configure fail2ban
   - Enable automatic security updates
   - Setup SSL/TLS with Let's Encrypt

## Next Steps

- [ ] Configure domain name and SSL certificate
- [ ] Setup database backups
- [ ] Configure monitoring and alerting
- [ ] Document environment-specific configurations
- [ ] Test rollback procedures
- [ ] Setup staging environment

## Support

If you encounter issues:

1. Check the workflow logs in GitHub Actions
2. Review server logs: `ssh deployer@142.93.208.86 'sudo docker logs village-app'`
3. Run connectivity test: `./scripts/test-ssh-connectivity.sh`
4. Consult the main [TROUBLESHOOTING.md](../TROUBLESHOOTING.md) guide
