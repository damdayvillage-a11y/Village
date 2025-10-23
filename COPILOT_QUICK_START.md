# 🤖 Copilot Agent - Quick Start Guide

**⚡ Get started with GitHub Copilot Coding Agent in 5 minutes**

---

## ✅ Verification

First, verify your setup is complete:

```bash
npm run copilot:verify
```

Expected: `✅ SUCCESS: All checks passed!`

---

## 🔑 Step 1: Configure Secrets

Go to: **GitHub → Settings → Secrets and variables → Actions**

Add these secrets:

| Secret Name | Description | Required |
|-------------|-------------|----------|
| `DATABASE_URL` | PostgreSQL connection string | ✅ Yes |
| `API_TOKEN` | API logs access token | ✅ Yes |
| `GITHUB_TOKEN` | Auto-provided by GitHub | ✅ Auto |
| `NEXTAUTH_SECRET` | Session encryption key | 🟡 Recommended |

### Examples:

```bash
# DATABASE_URL
postgresql://username:password@host:5432/database_name

# NEXTAUTH_SECRET (generate with):
openssl rand -base64 32
```

---

## 🚀 Step 2: Enable Copilot Agent

1. Go to: **GitHub → Settings → Copilot → Coding Agent**
2. Toggle: **Enable Model Context Protocol (MCP)**
3. Select configuration: `.github/copilot/mcp-config.json`
4. Wait for: `✅ MCP configuration loaded successfully`

---

## 🧪 Step 3: Test Activation

In any issue, PR, or discussion, type:

```
@copilot verify environment setup
```

### Expected Response:

```
✅ Database connected: postgresql://...
✅ Documentation synchronized (12 files indexed)
✅ GitHub API access confirmed
✅ API logs endpoint accessible
✅ Firewall active (15 domains allowlisted)
✅ Environment verified successfully
```

---

## 💡 Common Commands

### Environment & Setup
```bash
@copilot recall memories and sync documentation
@copilot verify database connection
@copilot check system health
```

### Database Operations
```bash
@copilot run database migrations
@copilot seed database with initial data
@copilot backup database
```

### Build & Test
```bash
@copilot build application
@copilot run all tests
@copilot check for errors
```

### Development
```bash
@copilot implement feature from PR #5
@copilot fix TypeScript errors
@copilot update documentation
```

### Monitoring
```bash
@copilot analyze error logs
@copilot generate status report
@copilot check deployment health
```

---

## 🤖 What Copilot Can Do

✅ **Autonomous Operations**:
- Read all `.md` documentation (12+ files)
- Execute database migrations and seeding
- Build and test application
- Create PRs and issues
- Update documentation

✅ **Secure Access**:
- PostgreSQL database operations
- API logs monitoring
- GitHub repository management
- Network restricted to 15 approved domains

✅ **Smart Behavior**:
- Reads documentation before acting
- Respects memory state (MEMORY.md)
- Creates PRs for human review
- Handles errors autonomously

---

## 🔒 Security

**Firewall**: Active (allowlist mode)  
**Approved Domains**: 15 (GitHub, npm, Docker, Prisma, Village)  
**Secrets**: Encrypted by GitHub  
**Logging**: No plaintext secrets

---

## 📚 Documentation

Need more details? Check these:

- **Complete Setup**: [COPILOT_SETUP_GUIDE.md](./COPILOT_SETUP_GUIDE.md)
- **Firewall Config**: [FIREWALL_CONFIG.md](./FIREWALL_CONFIG.md)
- **Agent Behavior**: [COPILOT_INSTRUCTIONS.md](./COPILOT_INSTRUCTIONS.md)
- **MCP Config**: [.github/copilot/mcp-config.json](./.github/copilot/mcp-config.json)

---

## 🐛 Troubleshooting

### Issue: "MCP configuration not found"
- **Fix**: Ensure `.github/copilot/mcp-config.json` exists
- **Verify**: Run `npm run copilot:verify`

### Issue: "Database connection failed"
- **Fix**: Check `DATABASE_URL` secret is correct
- **Verify**: Run `npm run db:test`

### Issue: "Authentication failed"
- **Fix**: Verify `GITHUB_TOKEN` exists
- **Verify**: Check token permissions

### Issue: "Domain blocked by firewall"
- **Fix**: Add domain to allowlist in `mcp-config.json`
- **See**: FIREWALL_CONFIG.md for process

---

## ✨ Pro Tips

1. **Start Small**: Test with simple commands first
2. **Review PRs**: Always review agent-created PRs before merging
3. **Check Logs**: Monitor agent activity in GitHub Actions
4. **Provide Context**: Give detailed instructions for complex tasks
5. **Use Documentation**: Reference specific docs when needed

---

## 📊 Configuration Details

- **MCP Servers**: 4 (docs, database, logs, GitHub)
- **Firewall Mode**: Allowlist (15 domains)
- **Security**: Secrets encrypted, audit logging enabled
- **Documentation**: 12+ files indexed automatically
- **Capabilities**: Build, test, migrate, deploy, monitor

---

## 🎯 Quick Actions

```bash
# Verify setup
npm run copilot:verify

# Check configuration
cat .github/copilot/mcp-config.json | jq .

# View secrets (names only, not values)
cat .github/copilot/mcp-config.json | jq '.security.secretManagement.requiredSecrets'

# List documentation files
ls -1 *.md docs/*.md

# Test database connection
npm run db:test
```

---

## 🚦 Status Indicators

| Indicator | Meaning |
|-----------|---------|
| ✅ | Working correctly |
| ⚠️ | Warning - review needed |
| ❌ | Error - action required |
| 🟡 | Optional/recommended |
| ℹ️ | Information only |

---

## 🆘 Getting Help

1. **Run verification**: `npm run copilot:verify`
2. **Check logs**: Review GitHub Actions logs
3. **Read docs**: See COPILOT_SETUP_GUIDE.md
4. **Create issue**: Use `copilot-agent` label

---

## 🎉 You're Ready!

Once you see `✅ SUCCESS: All checks passed!` from the verification script, you're all set!

Test with:
```
@copilot Hello! Verify your configuration and report status.
```

Happy automating! 🤖✨

---

**Version**: 1.0.0  
**Last Updated**: 2025-10-23  
**Need Help?** See [COPILOT_SETUP_GUIDE.md](./COPILOT_SETUP_GUIDE.md)
