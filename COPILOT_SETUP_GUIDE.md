# 🚀 GitHub Copilot Coding Agent - Complete Setup Guide

**Project**: Smart Carbon-Free Village - Damday Village  
**Version**: 1.0.0  
**Last Updated**: 2025-10-23  
**Status**: Ready for Activation

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [System Requirements](#system-requirements)
4. [MCP Configuration](#mcp-configuration)
5. [Secrets Setup](#secrets-setup)
6. [Firewall Configuration](#firewall-configuration)
7. [Activation Steps](#activation-steps)
8. [Verification](#verification)
9. [Usage Guidelines](#usage-guidelines)
10. [Troubleshooting](#troubleshooting)

---

## Overview

This guide provides complete instructions for setting up GitHub Copilot Coding Agent with Model Context Protocol (MCP) for autonomous operation on the `damdayvillage-a11y/Village` repository.

### What This Setup Enables

✅ **Autonomous Operations**:
- Read and respect all `.md` documentation files
- Execute database migrations and seeding
- Manage build, test, and deployment tasks
- Create and manage PRs and issues
- Monitor and respond to system health

✅ **Secure Access**:
- Database operations (PostgreSQL)
- API logs and monitoring
- GitHub repository operations
- Firewall-protected network access

✅ **Automated Workflows**:
- Environment verification
- Database management
- Health checks
- Documentation synchronization

---

## Prerequisites

### Required Access

1. **GitHub Repository Admin Access**
   - `damdayvillage-a11y/Village` repository
   - Ability to configure GitHub Secrets
   - Ability to enable GitHub Copilot

2. **Database Access**
   - PostgreSQL database connection string
   - Database admin credentials (for migrations)

3. **API Access**
   - API token for `api.damdayvillage.com`
   - Monitoring endpoint access

### Required Tools

- GitHub account with Copilot subscription
- Access to GitHub Settings → Copilot → Coding Agent

---

## System Requirements

### Firewall & Network Access

**Configuration**:
- ✅ **Firewall Enabled**: ON
- ✅ **Recommended Allowlist**: ON
- ✅ **Custom Allowlist**: Configured (see below)

**Network Requirements**:
- Outbound HTTPS (443) access required
- DNS resolution for allowlisted domains
- No incoming connections needed

### Resource Requirements

**Minimum**:
- 2GB RAM for build operations
- 10GB disk space
- Stable internet connection

**Recommended**:
- 4GB+ RAM for optimal performance
- 20GB+ disk space
- High-speed internet connection

---

## MCP Configuration

### Configuration File Location

```
.github/copilot/mcp-config.json
```

### MCP Servers Configured

#### 1. Documentation Server (`village-docs`)

**Type**: File System  
**Purpose**: Access all documentation files

**Included Files**:
- `CONFIGURATION.md` - Complete project configuration
- `REQUIREMENTS.md` - Project requirements
- `MEMORY.md` - Current implementation stage
- `PR.md` - PR roadmap
- `COPILOT_INSTRUCTIONS.md` - Agent execution rules
- `README.md` - Project overview
- `ISSUES.md` - Issue tracking
- All files in `docs/` directory

**Permissions**: Read-only

#### 2. Database Server (`village-database`)

**Type**: PostgreSQL Database  
**Purpose**: Database operations

**Capabilities**:
- Read/write operations
- Schema migrations
- Database seeding
- Connection validation

**Connection**: Uses `DATABASE_URL` secret

#### 3. Logs Server (`village-logs`)

**Type**: HTTP API  
**Purpose**: Access application logs

**Endpoint**: `https://api.damdayvillage.com/logs`  
**Authentication**: Bearer token via `API_TOKEN` secret  
**Permissions**: Read-only

#### 4. GitHub Repository Server (`github-repo`)

**Type**: GitHub API  
**Purpose**: Repository operations

**Capabilities**:
- Create/update issues
- Create/update pull requests
- Read/write repository contents
- View GitHub Actions

**Authentication**: Uses `GITHUB_TOKEN` secret

---

## Secrets Setup

### Required Secrets

Configure these secrets in GitHub Settings → Secrets and variables → Actions:

#### 1. DATABASE_URL

**Description**: PostgreSQL connection string  
**Format**:
```
postgresql://username:password@host:5432/database_name
```

**Example**:
```
postgresql://villageuser:securepass123@localhost:5432/villagedb
```

**For CapRover**:
```
postgresql://user:pass@srv-captain--postgres:5432/villagedb
```

**Validation**:
- Must start with `postgresql://`
- Must include username and password
- Must include host and database name

#### 2. API_TOKEN

**Description**: Token for accessing `api.damdayvillage.com`  
**Format**: Bearer token (JWT or similar)

**Example**:
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Generation**: Contact API administrator or generate via API dashboard

#### 3. GITHUB_TOKEN

**Description**: GitHub Personal Access Token or default GITHUB_TOKEN  
**Scope**: `repo`, `issues`, `pull_requests`, `contents`

**Using Default Token** (Recommended):
- GitHub automatically provides `GITHUB_TOKEN`
- No additional configuration needed
- Scoped to current repository

**Using Personal Access Token**:
1. Go to GitHub Settings → Developer settings → Personal access tokens
2. Generate new token (classic) with required scopes
3. Add as repository secret

#### 4. NEXTAUTH_SECRET (Optional but Recommended)

**Description**: NextAuth.js secret for session encryption  
**Format**: Random 32+ character string

**Generation**:
```bash
openssl rand -base64 32
```

**Example**:
```
vT8f3K9mN2xP5qR7sU1wY4zA6bC8dE0fG2hI4jK6lM8n=
```

### Secrets Configuration Steps

1. Go to repository Settings
2. Navigate to "Secrets and variables" → "Actions"
3. Click "New repository secret"
4. Add each secret with exact name (case-sensitive)
5. Verify all required secrets are present

---

## Firewall Configuration

### Allowlist Configuration

The MCP configuration includes a firewall allowlist to restrict network access to approved domains only.

### Approved Domains

```
✅ github.com                    - GitHub API and repos
✅ api.github.com                - GitHub REST API
✅ raw.githubusercontent.com     - GitHub raw content
✅ npmjs.org                     - NPM registry
✅ registry.npmjs.org            - NPM package registry
✅ nodejs.org                    - Node.js downloads
✅ pypi.org                      - Python packages
✅ docker.io                     - Docker Hub
✅ hub.docker.com                - Docker Hub API
✅ registry.hub.docker.com       - Docker registry
✅ prisma.io                     - Prisma ORM
✅ postgresql.org                - PostgreSQL docs
✅ damdayvillage.com             - Production site
✅ api.damdayvillage.com         - API endpoint
✅ www.damdayvillage.com         - WWW subdomain
```

### Firewall Settings

**Mode**: Allowlist (Whitelist)  
**Default Behavior**: Deny all other domains  
**Configuration**: Defined in `mcp-config.json`

### Adding New Domains

To allow additional domains:

1. Edit `.github/copilot/mcp-config.json`
2. Add domain to `firewall.allowlist` array
3. Commit and push changes
4. Copilot will reload configuration automatically

---

## Activation Steps

### Step 1: Verify Repository Setup

```bash
# Check MCP configuration exists
ls -la .github/copilot/mcp-config.json

# Verify documentation files
ls -la *.md
ls -la docs/*.md
```

### Step 2: Configure GitHub Secrets

1. Navigate to repository Settings
2. Add all required secrets (see Secrets Setup section)
3. Verify each secret is saved correctly

### Step 3: Enable GitHub Copilot

1. Go to GitHub Settings → Copilot
2. Navigate to "Coding Agent" section
3. Enable "Model Context Protocol (MCP)"
4. Select configuration file: `.github/copilot/mcp-config.json`

### Step 4: Verify Configuration Loading

Expected confirmation message:
```
✅ MCP configuration loaded successfully
✅ 4 MCP servers initialized
✅ Firewall configured (15 domains allowlisted)
✅ All required secrets validated
```

### Step 5: Initial Test

Trigger Copilot agent with test command:

```
@copilot verify environment setup
```

Expected response:
```
✅ Database connected: postgresql://...
✅ Documentation synchronized (12 files indexed)
✅ GitHub API access confirmed
✅ API logs endpoint accessible
✅ Environment verified successfully
```

---

## Verification

### Verification Checklist

After setup completion, verify:

- [ ] MCP configuration file exists and is valid JSON
- [ ] All 4 MCP servers are configured
- [ ] All required secrets are set in GitHub
- [ ] Firewall allowlist includes all necessary domains
- [ ] Copilot agent responds to commands
- [ ] Database connection successful
- [ ] Documentation files are indexed
- [ ] GitHub API operations work
- [ ] No authentication errors in logs

### Health Check Commands

```bash
# Test database connection
@copilot test database connection

# Verify documentation access
@copilot list available documentation

# Check GitHub API access
@copilot verify github permissions

# Test API logs access
@copilot fetch recent logs
```

### Expected Outputs

**Database Connection**:
```
✅ Connected to PostgreSQL
Database: villagedb
Models: 27
Last migration: 2025-10-19
```

**Documentation Access**:
```
✅ Documentation indexed
Files: 12 core documents + 20 in docs/
Total size: 1.2 MB
Last updated: 2025-10-23
```

**GitHub API Access**:
```
✅ GitHub API authenticated
Repository: damdayvillage-a11y/Village
Permissions: read, write, issues, pull_requests
Rate limit: 5000/hour
```

---

## Usage Guidelines

### Triggering Copilot Agent

**Command Format**:
```
@copilot <command> [parameters]
```

**Example Commands**:

```bash
# Environment and setup
@copilot setup environment and verify database connection
@copilot recall memories and synchronize state
@copilot read all documentation files

# Database operations
@copilot run database migrations
@copilot seed database with initial data
@copilot backup database

# Build and deployment
@copilot build application
@copilot run tests
@copilot verify environment variables

# Development tasks
@copilot implement PR #5 features
@copilot fix TypeScript errors
@copilot update documentation

# Monitoring and maintenance
@copilot check system health
@copilot analyze error logs
@copilot generate status report
```

### Agent Responsibilities

The Copilot agent is configured to:

1. **Always read documentation first**
   - Index all `.md` files on startup
   - Respect current stage in `MEMORY.md`
   - Follow guidelines in `COPILOT_INSTRUCTIONS.md`

2. **Execute automated tasks**
   - Database migrations and seeding
   - Environment verification
   - Health checks
   - Build and test operations

3. **Maintain synchronization**
   - Update `MEMORY.md` after completing goals
   - Keep documentation in sync with implementation
   - Create PRs for human review

4. **Handle errors autonomously**
   - Analyze error logs
   - Suggest fixes
   - Create issues for complex problems
   - Provide next action plans

### Interaction Guidelines

**DO**:
- ✅ Provide clear, specific commands
- ✅ Reference documentation files when needed
- ✅ Review PR descriptions before approving
- ✅ Check agent-created issues regularly
- ✅ Provide feedback on agent performance

**DON'T**:
- ❌ Bypass security controls
- ❌ Modify secrets manually without updating GitHub
- ❌ Approve production deployments without review
- ❌ Disable firewall or allowlist
- ❌ Ignore agent-created issues

---

## Troubleshooting

### Common Issues

#### Issue 1: MCP Configuration Not Loading

**Symptoms**:
- "Failed to load MCP configuration" error
- Copilot agent not responding

**Solutions**:
1. Verify JSON syntax in `mcp-config.json`
   ```bash
   cat .github/copilot/mcp-config.json | jq .
   ```
2. Check file permissions
3. Ensure file is committed to repository
4. Try reloading configuration in GitHub settings

#### Issue 2: Database Connection Failed

**Symptoms**:
- "Unable to connect to database" error
- Migration failures

**Solutions**:
1. Verify `DATABASE_URL` secret is correct
2. Check database server is running
3. Verify network access to database
4. Test connection manually:
   ```bash
   npm run db:test
   ```

#### Issue 3: GitHub API Authentication Failed

**Symptoms**:
- "Authentication failed" errors
- Unable to create PRs or issues

**Solutions**:
1. Verify `GITHUB_TOKEN` secret exists
2. Check token has required scopes
3. Regenerate token if expired
4. Use default `GITHUB_TOKEN` if available

#### Issue 4: Firewall Blocking Required Domains

**Symptoms**:
- Network timeout errors
- Unable to download dependencies

**Solutions**:
1. Add domain to allowlist in `mcp-config.json`
2. Verify domain spelling is correct
3. Check if domain requires subdomain (www, api, etc.)
4. Commit and push configuration changes

#### Issue 5: Secrets Not Found

**Symptoms**:
- "Required secret not configured" error
- Missing environment variables

**Solutions**:
1. Go to repository Settings → Secrets
2. Verify secret name matches exactly (case-sensitive)
3. Re-add secret if necessary
4. Check secret is scoped to correct environment

### Debug Mode

Enable debug logging for troubleshooting:

```bash
@copilot enable debug mode
@copilot show detailed logs
```

### Getting Help

If issues persist:

1. Check Copilot agent logs in GitHub Actions
2. Review error messages in agent responses
3. Consult documentation:
   - `CONFIGURATION.md` - System configuration
   - `COPILOT_INSTRUCTIONS.md` - Agent behavior
   - `MEMORY.md` - Current system state
4. Create issue with:
   - Error message
   - Steps to reproduce
   - Expected vs actual behavior
   - Configuration details (without secrets)

---

## Advanced Configuration

### Customizing Agent Behavior

Edit `mcp-config.json` to customize:

**Agent Capabilities**:
```json
"agent": {
  "capabilities": {
    "autonomous": true,
    "canModifyCode": true,
    "canCreatePRs": true,
    // Adjust as needed
  }
}
```

**Automation Tasks**:
```json
"automation": {
  "tasks": {
    "environmentVerification": {
      "enabled": true,
      "schedule": "on-startup"
    }
  }
}
```

**Documentation Indexing**:
```json
"documentation": {
  "indexingStrategy": {
    "autoIndex": true,
    "semanticSearch": true
  }
}
```

### Adding SSH/CapRover Deployment

To enable direct deployment to CapRover:

1. Add SSH credentials to secrets:
   ```
   CAPROVER_URL
   CAPROVER_APP_TOKEN
   SSH_PRIVATE_KEY
   ```

2. Update `mcp-config.json`:
   ```json
   "deployment-server": {
     "type": "ssh",
     "host": "${{ secrets.CAPROVER_URL }}",
     "credentials": {
       "token": "${{ secrets.CAPROVER_APP_TOKEN }}"
     }
   }
   ```

3. Enable deployment capability:
   ```json
   "agent": {
     "capabilities": {
       "canDeployToProduction": true
     }
   }
   ```

---

## Security Best Practices

### Secrets Management

1. **Never commit secrets to repository**
   - Use GitHub Secrets exclusively
   - Don't log secrets in plain text
   - Rotate secrets regularly

2. **Limit secret access**
   - Use environment-scoped secrets when possible
   - Grant minimum required permissions
   - Audit secret usage regularly

3. **Monitor secret usage**
   - Review agent logs for secret access
   - Alert on unexpected secret usage
   - Rotate compromised secrets immediately

### Network Security

1. **Maintain firewall allowlist**
   - Only add trusted domains
   - Review allowlist regularly
   - Document reason for each domain

2. **Monitor network traffic**
   - Review agent network requests
   - Alert on blocked domain attempts
   - Investigate unusual patterns

### Access Control

1. **Repository permissions**
   - Limit who can modify MCP configuration
   - Protect main branch with reviews
   - Require approval for sensitive changes

2. **Agent restrictions**
   - Configure appropriate capability limits
   - Require human approval for critical actions
   - Maintain audit logs

---

## Maintenance

### Regular Tasks

**Weekly**:
- Review agent-created PRs and issues
- Check system health status
- Verify secrets are valid

**Monthly**:
- Update MCP configuration if needed
- Review and rotate secrets
- Update documentation

**Quarterly**:
- Full security audit
- Review agent performance
- Update agent capabilities as needed

### Configuration Updates

When updating `mcp-config.json`:

1. Test changes in development environment
2. Validate JSON syntax
3. Commit with descriptive message
4. Monitor agent behavior after update
5. Rollback if issues occur

---

## Success Metrics

### Expected Behavior

After successful setup:

✅ **Autonomous Operations**:
- Agent builds and deploys without manual intervention
- Database migrations run automatically
- Documentation stays synchronized
- PRs created for all significant changes

✅ **Error Handling**:
- Agent identifies and reports errors
- Suggests fixes for common issues
- Creates issues for complex problems
- Provides detailed error context

✅ **Documentation Compliance**:
- All actions respect documentation
- Memory state maintained across sessions
- Implementation follows architectural guidelines

---

## Support & Resources

### Documentation

- `CONFIGURATION.md` - Complete system configuration
- `REQUIREMENTS.md` - Project requirements
- `MEMORY.md` - Current implementation stage
- `COPILOT_INSTRUCTIONS.md` - Agent behavior guidelines
- `PR.md` - PR roadmap
- `ISSUES.md` - Issue tracking

### External Resources

- [GitHub Copilot Documentation](https://docs.github.com/copilot)
- [Model Context Protocol Specification](https://github.com/modelcontextprotocol/specification)
- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)

### Contact

For questions or issues:
- Create issue in repository
- Tag with `copilot-agent` label
- Provide detailed context and logs

---

## Quick Reference

### Essential Commands

```bash
# Verify setup
@copilot verify environment setup

# Check status
@copilot show current status

# Run tests
@copilot run all tests

# Build application
@copilot build for production

# Database operations
@copilot run migrations
@copilot seed database

# Documentation
@copilot update documentation
@copilot sync memory state

# Health check
@copilot check system health
```

### File Locations

```
.github/copilot/mcp-config.json    # MCP configuration
COPILOT_SETUP_GUIDE.md             # This file
COPILOT_INSTRUCTIONS.md            # Agent guidelines
CONFIGURATION.md                   # System config
MEMORY.md                          # Current stage
```

### Secrets Required

```
DATABASE_URL        # PostgreSQL connection
API_TOKEN          # API logs access
GITHUB_TOKEN       # GitHub operations
NEXTAUTH_SECRET    # Session encryption (optional)
```

---

**Version**: 1.0.0  
**Last Updated**: 2025-10-23  
**Status**: Production Ready ✅  
**Maintained By**: Development Team

---

## Conclusion

With this setup complete, GitHub Copilot Coding Agent can:

- ✅ Autonomously handle build, database, and deployment tasks
- ✅ Read and respect all documentation as authoritative source
- ✅ Maintain synchronization between code and documentation
- ✅ Create PRs and issues for human review
- ✅ Execute within secure firewall boundaries
- ✅ Access necessary resources through configured secrets

The agent is now ready to assist with development, maintenance, and deployment of the Smart Carbon-Free Village platform.

**Next Steps**: Test the agent with a simple command to verify everything is working correctly.

```bash
@copilot recall memories, read all documentation, verify environment, and report status
```

Expected response: Complete status report with environment verification, documentation index, and system health check.
