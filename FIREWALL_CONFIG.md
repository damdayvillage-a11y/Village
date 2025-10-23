# 🔒 Firewall Configuration for Copilot Coding Agent

**Project**: Smart Carbon-Free Village  
**Purpose**: Network access control and security configuration  
**Last Updated**: 2025-10-23

---

## Overview

This document details the firewall configuration for GitHub Copilot Coding Agent, ensuring secure and controlled network access for the Village application.

---

## Firewall Mode

**Type**: Allowlist (Whitelist)  
**Status**: ✅ Enabled  
**Default Behavior**: Deny all non-allowlisted domains  
**Configuration File**: `.github/copilot/mcp-config.json`

---

## Allowlisted Domains

### GitHub & Version Control

| Domain | Purpose | Required |
|--------|---------|----------|
| `github.com` | GitHub main site | ✅ Critical |
| `api.github.com` | GitHub REST API | ✅ Critical |
| `raw.githubusercontent.com` | Raw file content | ✅ Critical |

**Usage**:
- Repository operations
- PR and issue management
- Code commits and branches
- GitHub Actions integration

### Package Managers

| Domain | Purpose | Required |
|--------|---------|----------|
| `npmjs.org` | NPM package registry | ✅ Critical |
| `registry.npmjs.org` | NPM API endpoint | ✅ Critical |
| `nodejs.org` | Node.js downloads | ✅ Critical |
| `pypi.org` | Python packages | 🟡 Optional |

**Usage**:
- Installing Node.js dependencies
- Package updates
- Build tool dependencies
- Optional Python tools

### Container & Deployment

| Domain | Purpose | Required |
|--------|---------|----------|
| `docker.io` | Docker Hub | ✅ Critical |
| `hub.docker.com` | Docker Hub API | ✅ Critical |
| `registry.hub.docker.com` | Docker registry | ✅ Critical |

**Usage**:
- Docker image pulls
- Container deployment
- Base image updates
- Registry operations

### Database & ORM

| Domain | Purpose | Required |
|--------|---------|----------|
| `prisma.io` | Prisma ORM | ✅ Critical |
| `postgresql.org` | PostgreSQL docs | 🟢 Recommended |

**Usage**:
- Prisma client generation
- Database migrations
- Schema management
- Documentation reference

### Application Domains

| Domain | Purpose | Required |
|--------|---------|----------|
| `damdayvillage.com` | Production site | ✅ Critical |
| `api.damdayvillage.com` | API endpoint | ✅ Critical |
| `www.damdayvillage.com` | WWW subdomain | ✅ Critical |

**Usage**:
- Production deployment
- API log access
- Health checks
- Monitoring

---

## Network Security Rules

### Outbound Traffic

**Allowed**:
- ✅ HTTPS (443) to allowlisted domains
- ✅ DNS queries for domain resolution
- ✅ Database connections (PostgreSQL)

**Blocked**:
- ❌ All non-allowlisted domains
- ❌ Non-HTTPS protocols (except database)
- ❌ Direct IP access (except database)
- ❌ Peer-to-peer connections

### Inbound Traffic

**Status**: Not applicable (agent is client-only)

### Port Requirements

| Port | Protocol | Purpose |
|------|----------|---------|
| 443 | HTTPS | All web traffic |
| 5432 | PostgreSQL | Database connection |
| 53 | DNS | Domain resolution |

---

## Adding New Domains

### Process

1. **Evaluate necessity**
   - Is this domain critical for operation?
   - Can functionality work without it?
   - Are there alternatives?

2. **Security review**
   - Is the domain trustworthy?
   - Is HTTPS supported?
   - Are there known security issues?

3. **Add to configuration**
   ```json
   "firewall": {
     "allowlist": [
       "existing-domain.com",
       "new-domain.com"  // Add here
     ]
   }
   ```

4. **Document the change**
   - Update this file
   - Add domain to table above
   - Document purpose and usage

5. **Test and verify**
   - Commit changes
   - Verify agent can access domain
   - Monitor for issues

### Request Template

When requesting a new domain:

```markdown
**Domain**: example.com
**Purpose**: [Describe why this domain is needed]
**Usage**: [How will it be used?]
**Frequency**: [How often?]
**Alternatives**: [Are there alternatives?]
**Security**: [Any security concerns?]
**Priority**: [Critical/High/Medium/Low]
```

---

## Domain Categories

### Critical Domains (Cannot Operate Without)

```
✅ github.com
✅ api.github.com
✅ npmjs.org
✅ registry.npmjs.org
✅ nodejs.org
✅ docker.io
✅ hub.docker.com
✅ prisma.io
✅ damdayvillage.com
✅ api.damdayvillage.com
```

**Impact if blocked**: Build failures, deployment failures, unable to operate

### Recommended Domains (Degraded Function)

```
🟢 postgresql.org
🟢 www.damdayvillage.com
🟢 raw.githubusercontent.com
```

**Impact if blocked**: Limited functionality, workarounds available

### Optional Domains (Nice to Have)

```
🟡 pypi.org
```

**Impact if blocked**: Minor features unavailable, easily substituted

---

## Security Policies

### Domain Verification

All allowlisted domains must:
- ✅ Support HTTPS/TLS
- ✅ Have valid SSL certificates
- ✅ Maintain security best practices
- ✅ Have legitimate business purpose

### Monitoring

The system monitors:
- Attempted connections to blocked domains
- Failed connection attempts
- Unusual traffic patterns
- Repeated access denials

### Alerts

Alert triggers:
- 🚨 Multiple blocked domain attempts
- 🚨 Connection to suspicious domains
- 🚨 Unusual traffic volume
- 🚨 Failed authentication attempts

---

## Firewall Configuration

### In MCP Config

```json
{
  "firewall": {
    "enabled": true,
    "mode": "allowlist",
    "allowlist": [
      // List of approved domains
    ],
    "blocklist": [],
    "allowByDefault": false
  }
}
```

### Options

| Setting | Value | Description |
|---------|-------|-------------|
| `enabled` | `true` | Firewall active |
| `mode` | `allowlist` | Only allowed domains accessible |
| `allowByDefault` | `false` | Deny all by default |
| `blocklist` | `[]` | Explicit blocks (empty) |

---

## Troubleshooting

### Domain Blocked Error

**Symptoms**:
```
Error: Connection refused to domain.com
Firewall: Domain not in allowlist
```

**Solution**:
1. Verify domain is necessary
2. Add to allowlist if legitimate
3. Update MCP configuration
4. Commit and push changes

### SSL/Certificate Errors

**Symptoms**:
```
Error: SSL certificate verification failed
```

**Solution**:
1. Check domain SSL certificate
2. Verify domain in allowlist
3. Check if domain supports HTTPS
4. Contact domain administrator if needed

### DNS Resolution Failures

**Symptoms**:
```
Error: Could not resolve domain.com
```

**Solution**:
1. Verify domain spelling
2. Check DNS configuration
3. Ensure port 53 is open
4. Test domain manually

---

## Best Practices

### Do's ✅

- ✅ Keep allowlist minimal
- ✅ Document all additions
- ✅ Review allowlist regularly
- ✅ Remove unused domains
- ✅ Monitor blocked attempts
- ✅ Use HTTPS-only domains

### Don'ts ❌

- ❌ Add domains without review
- ❌ Disable firewall for convenience
- ❌ Allow wildcard domains
- ❌ Skip security evaluation
- ❌ Ignore blocked domain logs
- ❌ Use HTTP-only domains

---

## Compliance

### Data Protection

- All traffic over HTTPS
- No unencrypted connections
- Minimal data exposure
- Secure credential handling

### Access Control

- Limited to essential domains
- Role-based access (implicit)
- Audit logging enabled
- Regular security reviews

---

## Maintenance Schedule

### Weekly

- Review blocked domain attempts
- Check for false positives
- Monitor unusual patterns

### Monthly

- Review allowlist necessity
- Remove unused domains
- Update documentation
- Security audit

### Quarterly

- Comprehensive security review
- Allowlist optimization
- Policy updates
- Penetration testing consideration

---

## Change Log

### 2025-10-23 - Initial Configuration

- Created firewall configuration
- Defined allowlist (15 domains)
- Enabled allowlist mode
- Set deny-by-default policy

**Domains Added**:
- GitHub infrastructure (3 domains)
- Package managers (4 domains)
- Container registries (3 domains)
- Database/ORM (2 domains)
- Application domains (3 domains)

---

## Support

### Questions

For firewall configuration questions:
1. Review this document
2. Check `COPILOT_SETUP_GUIDE.md`
3. Review MCP configuration
4. Create issue if needed

### Issues

For firewall-related issues:
1. Check error message
2. Verify domain in allowlist
3. Review troubleshooting section
4. Create issue with:
   - Domain being accessed
   - Error message
   - Expected behavior
   - Use case/necessity

---

## Summary

The firewall configuration ensures:

✅ **Security**:
- Only approved domains accessible
- All traffic over HTTPS
- Minimal attack surface
- Controlled network access

✅ **Functionality**:
- All critical domains allowed
- Build and deployment work
- Database operations succeed
- Monitoring enabled

✅ **Maintainability**:
- Clear documentation
- Easy to update
- Auditable changes
- Regular reviews

**Status**: ✅ Configured and Active  
**Last Review**: 2025-10-23  
**Next Review**: 2025-11-23

---

## Quick Reference

### View Current Allowlist

```bash
cat .github/copilot/mcp-config.json | jq '.firewall.allowlist'
```

### Add New Domain

```bash
# Edit MCP config
nano .github/copilot/mcp-config.json

# Add domain to allowlist array
# Commit and push
git add .github/copilot/mcp-config.json
git commit -m "chore: add domain.com to firewall allowlist"
git push
```

### Check Blocked Attempts

```bash
@copilot show blocked domain attempts
@copilot list firewall logs
```

---

**Document Version**: 1.0.0  
**Configuration File**: `.github/copilot/mcp-config.json`  
**Status**: Active ✅
