# How to Use ISSUES.md - Quick Guide

**Purpose**: Guide for developers to use the comprehensive issue tracking system  
**Created**: 2025-10-19  
**Target Audience**: Developers, Copilot Agents, Contributors

---

## Overview

The `ISSUES.md` file contains **100 tracked issues** organized by priority and grouped into **10 Pull Requests** (PRs) for systematic resolution. This guide explains how to use it effectively.

---

## Quick Start

### 1. Find Your Task

**By Priority**:
- **P0 (Critical)**: Fix immediately - blocking production use
- **P1 (High)**: Important features missing or broken
- **P2 (Medium)**: Enhancements and improvements
- **P3 (Low)**: Future nice-to-have features

**By Component**:
- Admin Panel issues
- User Panel issues
- API/Backend issues
- Frontend/UI issues
- Database issues
- Configuration issues

**By PR**:
- PR #1: Critical fixes (ISSUE-001 to ISSUE-010)
- PR #2: CMS UI (ISSUE-011 to ISSUE-020)
- PR #3: User & Marketplace (ISSUE-021 to ISSUE-030)
- And so on...

### 2. Read the Issue Details

Each issue includes:

```markdown
#### ISSUE-XXX: Issue Title
**Priority**: PX - Level
**Status**: ❌/⚠️/✅
**Component**: Where the issue is
**File**: Specific file location

**Problem**: What's broken/missing
**Root Cause**: Why it's happening
**Fix Steps**: What to do
**Files to Modify**: Which files to change
**Testing**: How to verify the fix
```

### 3. Implement the Fix

Follow this workflow:

```bash
# 1. Create a branch for the PR group
git checkout -b pr/1-critical-admin-fixes

# 2. Work on issues one by one
# Example: Fixing ISSUE-001 (Carbon Credit Display)

# 3. Make changes following the "Fix Steps" in ISSUES.md

# 4. Test locally
npm run dev
# Verify the fix works

# 5. Update issue status in ISSUES.md
# Change ❌ to ⚠️ (in progress) or ✅ (fixed)

# 6. Commit with reference
git add .
git commit -m "fix(admin): carbon credit display showing correctly (ISSUE-001)"

# 7. Continue with next issue in the PR

# 8. When all 10 issues in PR are done, push
git push origin pr/1-critical-admin-fixes
```

### 4. Update Status

As you work, update the status icons:

- ❌ **Not Fixed** - Issue not started
- ⚠️ **In Progress** - Working on it
- ✅ **Fixed** - Completed and tested
- 📋 **Blueprint Ready** - Specification exists, needs implementation

---

## Understanding Issue Structure

### Priority Levels Explained

#### P0 - Critical (Issues 1-10)
**Definition**: System-breaking issues that prevent core functionality

**Examples**:
- Carbon credits not displaying at all
- Cannot create users
- Image upload completely broken
- APIs returning errors

**Action**: **Fix immediately** before any other work

**Timeline**: Days 1-3

---

#### P1 - High (Issues 11-30)
**Definition**: Important features missing or significantly degraded

**Examples**:
- UI components missing (page builder, calendar)
- Key features not implemented (refunds, analytics)
- Important workflows broken (user import, reschedule)

**Action**: Fix after P0, high priority

**Timeline**: Week 1-2

---

#### P2 - Medium (Issues 31-60)
**Definition**: Enhancements, quality improvements, technical debt

**Examples**:
- Performance optimizations
- Security hardening
- Better error messages
- Missing nice-to-have features

**Action**: Important but not urgent

**Timeline**: Week 2-4

---

#### P3 - Low (Issues 61-100)
**Definition**: Future features, advanced functionality

**Examples**:
- AR/VR tours
- Web3 integration
- AI features
- Mobile apps

**Action**: Plan for future phases

**Timeline**: Month 2+

---

## PR Organization Strategy

### Why 10 Issues per PR?

1. **Manageable Scope**: Small enough to review and test
2. **Logical Grouping**: Related issues together
3. **Clear Goals**: Each PR has a focused objective
4. **Progress Tracking**: Easy to see completion status
5. **Risk Management**: Smaller changes = lower risk

### PR Groups

```
PR #1: Critical Admin Panel Fixes
├── ISSUE-001: Carbon credit display
├── ISSUE-002: Add user button
├── ISSUE-003: Image upload
├── ISSUE-004: API connections
├── ISSUE-005: Media library
├── ISSUE-006: Welcome emails
├── ISSUE-007: Database seeding
├── ISSUE-008: Error handling
├── ISSUE-009: Placeholder links
└── ISSUE-010: Build issues

PR #2: CMS UI Implementation
├── ISSUE-011: Page builder
├── ISSUE-012: Navigation builder
├── ISSUE-013: Theme editor
├── ISSUE-014: SEO manager
├── ISSUE-015: Booking calendar
├── ISSUE-016: Availability manager
├── ISSUE-017: Homestay editor
├── ISSUE-018: Booking analytics
├── ISSUE-019: Product editor
└── ISSUE-020: Order management

[... and so on for PR #3 through PR #10]
```

---

## Step-by-Step Fix Guide

### Example: Fixing ISSUE-001 (Carbon Credit Display)

#### Step 1: Understand the Problem

Read the issue in ISSUES.md:

```markdown
#### ISSUE-001: Carbon Credit Display Not Working in Admin Panel
**Priority**: P0 - Critical
**Status**: ❌ Not Fixed
**Component**: Admin Panel > Carbon Credits
**File**: `src/app/admin-panel/carbon-credits/page.tsx`

**Problem**:
- Carbon credit statistics not showing correctly
- API endpoints may be returning empty data
- Users with carbon credits not displaying
```

#### Step 2: Locate the Files

```bash
# Open the mentioned files
code src/app/admin-panel/carbon-credits/page.tsx
code src/app/api/admin/carbon/stats/route.ts
code src/app/api/admin/carbon/users/route.ts
```

#### Step 3: Follow Fix Steps

The issue lists specific fix steps:

1. Verify API endpoint functionality
2. Check database for records
3. Verify Prisma schema
4. Add seed data if needed
5. Test frontend component
6. Add error handling

#### Step 4: Test the Fix

```bash
# Start dev server
npm run dev

# Check API endpoints
curl http://localhost:3000/api/admin/carbon/stats
curl http://localhost:3000/api/admin/carbon/users

# Test in browser
# Navigate to /admin-panel/carbon-credits
# Verify data displays correctly
```

#### Step 5: Update Issue Status

In ISSUES.md, change:

```markdown
**Status**: ❌ Not Fixed
```

To:

```markdown
**Status**: ✅ Fixed (2025-10-19)
```

Add a note if needed:

```markdown
**Fix Note**: Added seed data for carbon credits, verified API endpoints, added error handling in frontend component.
```

#### Step 6: Commit

```bash
git add .
git commit -m "fix(admin): carbon credit display showing correctly

- Fixed API endpoints to return proper data
- Added seed data for carbon credits
- Added error handling in frontend
- Tested with multiple users

Resolves ISSUE-001"
```

---

## Testing Checklist

Each issue has a testing checklist. **Always complete before marking as fixed.**

Example from ISSUE-001:

```markdown
**Testing**:
- [ ] API returns valid data
- [ ] Frontend displays statistics correctly
- [ ] User list shows carbon balances
- [ ] Transactions display properly
```

### How to Test:

1. **Manual Testing**:
   - Follow the testing checklist
   - Test happy path (everything works)
   - Test error cases (network failure, empty data)
   - Test edge cases (zero credits, negative values)

2. **Automated Testing** (if applicable):
   ```bash
   npm test
   # Or specific test
   npm test carbon-credits
   ```

3. **Visual Testing**:
   - Take screenshots of before/after
   - Verify responsive design (mobile, tablet, desktop)
   - Check accessibility (keyboard navigation, screen readers)

---

## Common Patterns

### Pattern 1: API + Frontend Issue

Many issues involve both API and frontend:

```
1. Fix API endpoint
   ├── Implement proper database query
   ├── Add error handling
   ├── Test with curl/Postman
   └── Verify response format

2. Fix Frontend
   ├── Connect to fixed API
   ├── Add loading states
   ├── Add error handling
   └── Test UI updates
```

### Pattern 2: Missing UI Component

For missing UI implementations:

```
1. Check if API exists
   └── If yes, just create UI
   └── If no, create API first

2. Use blueprint (if available)
   ├── Check IMPLEMENTATION_COMPLETE.md
   ├── Follow specification
   └── Maintain code style

3. Create component
   ├── Match existing patterns
   ├── Add TypeScript types
   ├── Add error handling
   └── Add loading states

4. Test thoroughly
```

### Pattern 3: Configuration Issue

For configuration problems:

```
1. Identify missing config
   ├── Environment variables
   ├── API keys
   └── Feature flags

2. Add to .env.example
   └── Document purpose

3. Update CONFIGURATION.md
   └── Add to documentation

4. Test with config
   └── Verify feature works
```

---

## Tips for Success

### 1. Start with P0 Issues

Always fix critical issues first:
- They block other work
- They affect production
- They're usually simpler to fix

### 2. Work in Order

Follow the issue numbers within each PR:
- Easier to track progress
- Dependencies are considered
- Logical flow

### 3. Don't Skip Testing

The testing checklist is not optional:
- Prevents regressions
- Ensures quality
- Catches edge cases

### 4. Update Documentation

When fixing issues, update:
- ISSUES.md (status)
- MEMORY.md (if major change)
- Code comments
- User documentation

### 5. Ask for Help

If stuck on an issue:
1. Re-read the problem description
2. Check related files
3. Review similar code in codebase
4. Check documentation (CONFIGURATION.md, etc.)
5. Ask in team chat

### 6. Keep PRs Focused

Stick to the 10 issues in each PR:
- Don't add extra fixes
- Don't refactor unrelated code
- Keep changes minimal
- One PR = One goal

---

## Tracking Progress

### Individual Progress

Track your own work:

```markdown
## My Progress

**Week 1**:
- [x] ISSUE-001: Carbon credit display ✅
- [x] ISSUE-002: Add user button ✅
- [x] ISSUE-003: Image upload ✅
- [ ] ISSUE-004: API connections (in progress)

**Status**: 3/10 complete in PR #1
```

### Team Progress

Update the main tracking table in ISSUES.md:

```markdown
| Priority | Count | Status | Completed |
|----------|-------|--------|-----------|
| P0 - Critical | 10 | 🔴 | 3/10 |
| P1 - High | 20 | 🟡 | 0/20 |
| P2 - Medium | 30 | 🟢 | 0/30 |
| P3 - Low | 40 | 🔵 | 0/40 |
```

---

## Advanced Usage

### Filtering Issues

#### By Status:
```bash
# Find all unfixed issues
grep "❌ Not Fixed" ISSUES.md

# Find all in-progress issues  
grep "⚠️" ISSUES.md

# Find all completed
grep "✅ Fixed" ISSUES.md
```

#### By Component:
```bash
# Find all Admin Panel issues
grep "Admin Panel" ISSUES.md

# Find all API issues
grep "Backend API" ISSUES.md
```

#### By File:
```bash
# Find issues affecting a specific file
grep "src/app/admin-panel/users/page.tsx" ISSUES.md
```

### Creating New Issues

If you find a new issue:

```markdown
#### ISSUE-XXX: Descriptive Title
**Priority**: P0/P1/P2/P3 - Level
**Status**: ❌ Not Fixed
**Component**: Component Name
**File**: `path/to/file.tsx`

**Problem**:
[Describe what's wrong]

**Root Cause**:
[Why it's happening]

**Fix Steps**:
1. Step one
2. Step two
3. Step three

**Files to Modify**:
- File 1
- File 2

**Testing**:
- [ ] Test case 1
- [ ] Test case 2
```

Add it to the appropriate PR group (or create PR #11 if all are full).

---

## Integration with Other Docs

### How ISSUES.md Relates to Other Documentation

```
REQUIREMENTS.md
└── What features we need (requirements)

PR.md
└── How to implement features (roadmap)

IMPLEMENTATION_COMPLETE.md
└── What's already done (completed work)

ISSUES.md ⬅️ YOU ARE HERE
└── What's broken or missing (problems to fix)

MEMORY.md
└── Current project state (status tracking)

CONFIGURATION.md
└── How everything is set up (configuration)

COPILOT_INSTRUCTIONS.md
└── How agents should work (guidelines)
```

### Workflow:

1. Check **REQUIREMENTS.md** - What should exist?
2. Check **MEMORY.md** - What currently exists?
3. Check **ISSUES.md** - What's broken/missing?
4. Check **PR.md** - What's the implementation plan?
5. Check **IMPLEMENTATION_COMPLETE.md** - What's already built?
6. Use **COPILOT_INSTRUCTIONS.md** - How to implement?
7. Update **CONFIGURATION.md** - Document any config changes

---

## FAQ

### Q: Can I work on issues out of order?

**A**: Stick to priority order within PRs. P0 before P1, P1 before P2, etc.

### Q: What if an issue is already fixed?

**A**: Great! Update the status to ✅ and add a note explaining when/how it was fixed.

### Q: What if I find the root cause is different?

**A**: Update the "Root Cause" section with your findings. This helps future developers.

### Q: Can I combine multiple issues into one fix?

**A**: Only if they're closely related and in the same PR. Keep fixes focused.

### Q: What if the fix is more complex than described?

**A**: Break it into sub-tasks. Add them to the "Fix Steps" section.

### Q: Should I add tests for every fix?

**A**: Yes, if the repository has test infrastructure. Follow existing test patterns.

### Q: What if the issue is no longer relevant?

**A**: Mark it as ✅ with note "Not applicable - feature changed" or similar.

---

## Summary

**ISSUES.md** is your roadmap to fixing the Village project. It contains:

- ✅ **100 tracked issues** organized by priority
- ✅ **10 PR groups** with logical issue grouping
- ✅ **Clear fix steps** for each issue
- ✅ **Testing checklists** to ensure quality
- ✅ **Progress tracking** to monitor completion

**To succeed**:
1. Read issue carefully
2. Follow fix steps
3. Test thoroughly
4. Update status
5. Commit with reference
6. Move to next issue

**Remember**: Quality over speed. A properly fixed issue stays fixed.

---

**For Questions**:
- Check CONFIGURATION.md for setup info
- Check COPILOT_INSTRUCTIONS.md for coding guidelines  
- Check MEMORY.md for current project state
- Check PR.md for implementation roadmap

**Good luck fixing! 🚀**

---

**Document Version**: 1.0  
**Last Updated**: 2025-10-19  
**Maintained By**: Development Team
