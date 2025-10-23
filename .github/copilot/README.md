# GitHub Copilot Coding Agent Configuration

This directory contains the Model Context Protocol (MCP) configuration for GitHub Copilot Coding Agent.

## Files

### `mcp-config.json`

Complete MCP configuration defining:
- **MCP Servers**: Documentation, Database, Logs, GitHub
- **Firewall**: Allowlist of approved domains
- **Security**: Secrets management and data protection
- **Agent Capabilities**: Autonomous operations configuration
- **Automation Tasks**: Environment verification, database management, deployment

## Quick Start

1. **Review Configuration**:
   ```bash
   cat mcp-config.json | jq .
   ```

2. **Verify Secrets**:
   - Ensure GitHub Secrets are configured:
     - `DATABASE_URL`
     - `API_TOKEN`
     - `GITHUB_TOKEN`
     - `NEXTAUTH_SECRET` (optional)

3. **Enable in GitHub**:
   - Go to: Settings → Copilot → Coding Agent
   - Enable: Model Context Protocol (MCP)
   - Select: `.github/copilot/mcp-config.json`

4. **Verify Activation**:
   ```bash
   @copilot verify environment setup
   ```

## Documentation

For complete setup instructions, see:
- **Setup Guide**: `/COPILOT_SETUP_GUIDE.md`
- **Firewall Config**: `/FIREWALL_CONFIG.md`
- **Agent Instructions**: `/COPILOT_INSTRUCTIONS.md`

## MCP Servers

### 1. Documentation Server (`village-docs`)
- **Type**: File system
- **Access**: All `.md` documentation files
- **Permissions**: Read-only

### 2. Database Server (`village-database`)
- **Type**: PostgreSQL
- **Access**: Full database operations
- **Permissions**: Read, write, migrate

### 3. Logs Server (`village-logs`)
- **Type**: HTTP API
- **Access**: Application logs
- **Permissions**: Read-only

### 4. GitHub Repository Server (`github-repo`)
- **Type**: GitHub API
- **Access**: Repository operations
- **Permissions**: Issues, PRs, contents, actions

## Firewall

**Mode**: Allowlist  
**Status**: Enabled  
**Domains**: 15 approved domains

See `FIREWALL_CONFIG.md` for complete list.

## Security

- ✅ Secrets encrypted and managed by GitHub
- ✅ Firewall restricts network access
- ✅ No plaintext secret logging
- ✅ Audit logging enabled
- ✅ Role-based access control

## Support

For issues or questions:
1. Review `/COPILOT_SETUP_GUIDE.md`
2. Check error messages in agent logs
3. Create issue with `copilot-agent` label

---

**Version**: 1.0.0  
**Last Updated**: 2025-10-23  
**Status**: Production Ready ✅
