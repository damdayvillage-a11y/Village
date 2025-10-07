# CapRover Deployment Setup Guide

This guide will help you deploy the Village application to CapRover using the CI/CD pipeline.

## 🎯 Prerequisites

1. **CapRover Server**: You need a CapRover instance running on your server
2. **Domain**: A domain pointing to your CapRover server
3. **GitHub Repository Access**: Admin access to configure secrets

## 🔐 CapRover Token Configuration

Your CapRover app token is: `34a51f26157493fd890511f07fc950255176082b6a5494d08e8ef8664e345c54`

## 📝 Step-by-Step Setup

### Step 1: Create App in CapRover Dashboard

1. Login to your CapRover dashboard (https://captain.yourdomain.com)
2. Go to **Apps** section
3. Click **Create New App**
4. Enter app name: `village-app` (or your preferred name)
5. Click **Create New App**

### Step 2: Configure GitHub Secrets

1. Go to your GitHub repository: `https://github.com/damdayvillage-a11y/Village`
2. Navigate to **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret** and add the following secrets:

```
Name: CAPROVER_SERVER
Value: https://captain.yourdomain.com

Name: CAPROVER_APP_NAME  
Value: village-app

Name: CAPROVER_APP_TOKEN
Value: 34a51f26157493fd890511f07fc950255176082b6a5494d08e8ef8664e345c54
```

### Step 3: Configure App Settings in CapRover

1. In CapRover dashboard, click on your `village-app`
2. Go to **App Configs** tab
3. Set the following:
   - **Port**: `3000`
   - **Container HTTP Port**: `3000`
4. Go to **HTTP Settings** tab:
   - Enable **HTTPS**
   - Set your domain (e.g., `village.yourdomain.com`)

### Step 4: Environment Variables (Optional)

In CapRover App Configs, you can add environment variables:
- `NODE_ENV=production`
- `PORT=3000`

### Step 5: Deploy

#### Automatic Deployment (Recommended)
1. Push changes to `main` branch or `copilot/setup-cicd-with-caprover` branch
2. GitHub Actions will automatically build and deploy to CapRover
3. Check the Actions tab for deployment status

#### Manual Deployment via GitHub Actions
1. Go to **Actions** tab in your repository
2. Select **Deploy to CapRover** workflow
3. Click **Run workflow**
4. Select your branch and click **Run workflow**

## 🔍 Verification

### Check Deployment Status
1. **GitHub Actions**: Check the workflow logs for any errors
2. **CapRover Logs**: In CapRover dashboard → Your App → App Logs
3. **Health Check**: Visit `https://your-app-domain.com/health`
4. **Main App**: Visit `https://your-app-domain.com`

### Expected Responses

**Health Check Endpoint** (`/health`):
```json
{
  "status": "healthy",
  "timestamp": "2025-10-07T01:46:40.439Z",
  "uptime": 8.742581065
}
```

**Main Application** (`/`):
- Should display "Village Application" with success message
- Shows build time and environment information

## 🐛 Troubleshooting

### Common Issues

1. **Deployment Fails**
   - Check GitHub secrets are correctly set
   - Verify CapRover server is accessible
   - Check app name matches in CapRover and GitHub secrets

2. **App Won't Start**
   - Check CapRover app logs
   - Verify port configuration (should be 3000)
   - Check if all dependencies are installed

3. **Domain Not Working**
   - Verify DNS settings point to your CapRover server
   - Check SSL certificate in CapRover
   - Ensure HTTPS is enabled

### Debug Commands

```bash
# Check if app is responding locally in CapRover
curl http://localhost:3000/health

# Check Docker logs (if needed)
docker logs <container-id>

# Check CapRover logs
# Use CapRover dashboard → Your App → App Logs
```

## 🚀 Next Steps

1. **Custom Domain**: Configure your own domain in CapRover
2. **SSL Certificate**: Enable Let's Encrypt for HTTPS
3. **Monitoring**: Set up monitoring and alerts
4. **Scaling**: Configure multiple instances if needed
5. **Database**: Add database services if required

## 📁 Project Structure

```
Village/
├── .github/workflows/deploy.yml  # CI/CD workflow
├── captain-definition            # CapRover config
├── Dockerfile                    # Container definition  
├── index.js                     # Main application
├── package.json                 # Dependencies
├── README.md                    # Main documentation
├── CAPROVER_SETUP.md           # This setup guide
└── .dockerignore               # Docker ignore rules
```

## 🔧 Advanced Configuration

### Custom Build Commands
If you need custom build steps, modify `.github/workflows/deploy.yml`:

```yaml
- name: Build application
  run: |
    npm run build
    npm run test:production
```

### Environment-specific Deployments
Create separate workflows for different environments by modifying the workflow triggers and using different CapRover apps.

### Database Integration  
Add database services in CapRover and configure connection strings in environment variables.

---

**Need Help?** 
- Check CapRover documentation: https://caprover.com/docs
- GitHub Actions logs for deployment issues
- CapRover app logs for runtime issues