# Village

A Node.js application deployed with CapRover CI/CD.

## 🚀 Quick Start

### Local Development

```bash
# Install dependencies
npm install

# Start the application
npm start

# Development mode
npm run dev
```

The application will be available at `http://localhost:3000`

## 🐳 Docker Deployment

```bash
# Build Docker image
docker build -t village-app .

# Run container
docker run -p 3000:3000 village-app
```

## ⚡ CapRover Deployment

This project is configured for automatic deployment to CapRover using GitHub Actions.

### Prerequisites

1. **CapRover Server**: You need a CapRover instance running
2. **GitHub Secrets**: Configure the following secrets in your GitHub repository:
   - `CAPROVER_SERVER`: Your CapRover server URL (e.g., `https://captain.yourdomain.com`)
   - `CAPROVER_APP_NAME`: Your app name in CapRover (e.g., `village-app`)
   - `CAPROVER_APP_TOKEN`: Your CapRover app token

### Setting up CapRover Secrets

1. Go to your GitHub repository
2. Navigate to **Settings** → **Secrets and variables** → **Actions**
3. Add the following repository secrets:

```
CAPROVER_SERVER=https://captain.yourdomain.com
CAPROVER_APP_NAME=village-app
CAPROVER_APP_TOKEN=your-app-token-here
```

### Deployment Process

1. **Automatic Deployment**: Push to `main` or `copilot/setup-cicd-with-caprover` branch triggers deployment
2. **Manual Deployment**: Use GitHub Actions workflow dispatch
3. **Pull Request Testing**: PRs are tested but not deployed

### Files Structure

```
Village/
├── .github/workflows/deploy.yml  # GitHub Actions workflow
├── captain-definition            # CapRover deployment config
├── Dockerfile                    # Container definition
├── index.js                     # Main application
├── package.json                 # Node.js dependencies
└── README.md                    # This file
```

## 🏥 Health Check

The application includes a health check endpoint:

```bash
curl http://your-app-url/health
```

## 🛠️ Configuration

- **Port**: The app uses `PORT` environment variable or defaults to 3000
- **Environment**: Set `NODE_ENV` for different environments

## 📋 Features

- ✅ Express.js web server
- ✅ Health check endpoint
- ✅ Docker containerization
- ✅ CapRover deployment ready
- ✅ GitHub Actions CI/CD
- ✅ Production-ready Dockerfile with security best practices

## 🔧 Troubleshooting

### Common Issues

1. **Deployment fails**: Check CapRover logs and ensure secrets are correctly set
2. **App not starting**: Verify Dockerfile and check container logs
3. **Health check fails**: Ensure the app is properly listening on the configured port

### Logs

To view logs in CapRover:
1. Go to your CapRover dashboard
2. Select your app
3. Click on "App Logs" to see real-time logs