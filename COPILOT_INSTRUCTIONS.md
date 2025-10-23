# Copilot Agent Instructions

**Purpose**: Advanced autonomous implementation guidelines for GitHub Copilot agents working on the Smart Carbon-Free Village project.

**Last Updated**: 2025-10-19  
**Version**: 1.0

---

## Table of Contents

1. [Agent Execution Rules](#agent-execution-rules)
2. [Strategy & Planning](#strategy--planning)
3. [Research & Analysis](#research--analysis)
4. [Implementation Guidelines](#implementation-guidelines)
5. [Testing Requirements](#testing-requirements)
6. [Documentation Standards](#documentation-standards)
7. [Deployment Process](#deployment-process)
8. [Communication Protocol](#communication-protocol)

---

## Agent Execution Rules (ENFORCED)

### Pre-Work Checklist

Before starting ANY task, ALWAYS:

1. **READ FIRST** (Critical):
   - Read `/CONFIGURATION.md` completely
   - Read `/REQUIREMENTS.md` completely
   - Read `/MEMORY.md` for current stage
   - Read this `/COPILOT_INSTRUCTIONS.md` file
   - **Commit checkpoint after reading**

2. **UNDERSTAND CONTEXT**:
   - Check current project stage
   - Review recent PRs and changes
   - Identify dependencies
   - Note technical debt
   - Understand constraints

3. **PLAN BEFORE CODING**:
   - Create detailed implementation plan
   - Identify affected files
   - List required tests
   - Define success criteria
   - Estimate complexity

### Branch Naming Convention

```
pr/NN-short-description

Examples:
- pr/23-add-3d-digital-twin
- pr/24-implement-webrtc-chat
- pr/25-web3-wallet-integration
```

Where NN is zero-padded PR number.

### Commit Message Format

```
<type>: <short description>

Types:
- feat: New feature
- fix: Bug fix
- docs: Documentation only
- style: Code style (formatting, no logic change)
- refactor: Code restructuring
- test: Adding tests
- chore: Maintenance tasks
- perf: Performance improvement
- security: Security fix

Examples:
- feat: add 3D digital twin viewer
- fix: resolve booking payment issue
- docs: update API documentation
- test: add unit tests for user service
```

---

## Strategy & Planning

### Strategic Approach

1. **Assess Before Acting**:
   - Understand the full scope
   - Identify potential risks
   - Consider alternatives
   - Plan for rollback

2. **Think Long-term**:
   - Consider maintainability
   - Think about scalability
   - Plan for extensibility
   - Avoid technical debt

3. **Prioritize Quality**:
   - Code quality over speed
   - Test coverage essential
   - Documentation required
   - Security first

### Planning Checklist

For each new feature or fix:

- [ ] Read related documentation
- [ ] Understand user requirements
- [ ] Identify affected components
- [ ] List required dependencies
- [ ] Design database schema changes (if any)
- [ ] Plan API endpoints (if any)
- [ ] Design UI/UX (if applicable)
- [ ] Write test plan
- [ ] Estimate effort
- [ ] Get approval (for major changes)

### Risk Assessment

Before implementation, evaluate:

1. **Technical Risks**:
   - Breaking changes?
   - Performance impact?
   - Security implications?
   - Compatibility issues?

2. **Business Risks**:
   - User experience impact?
   - Downtime required?
   - Data migration needed?
   - Revenue impact?

3. **Mitigation Strategy**:
   - Feature flags
   - Gradual rollout
   - Rollback plan
   - Monitoring alerts

---

## Research & Analysis

### Research Protocol

When implementing new features:

1. **Technology Research**:
   - Review official documentation
   - Check compatibility with existing stack
   - Evaluate alternatives
   - Consider long-term support
   - Check license compatibility

2. **Best Practices**:
   - Research industry standards
   - Review similar implementations
   - Check security guidelines
   - Consult performance benchmarks

3. **Community Insights**:
   - Check GitHub discussions
   - Review Stack Overflow
   - Read blog posts
   - Watch conference talks

### Analysis Framework

For complex features:

1. **Requirements Analysis**:
   - Functional requirements
   - Non-functional requirements
   - User stories
   - Acceptance criteria

2. **Technical Analysis**:
   - Architecture design
   - Component interactions
   - Data flow
   - State management

3. **Impact Analysis**:
   - Performance impact
   - Security implications
   - User experience changes
   - System dependencies

---

## Implementation Guidelines

### Code Quality Standards

1. **TypeScript Best Practices**:
   ```typescript
   // Use strict typing
   interface User {
     id: string;
     email: string;
     role: UserRole;
   }
   
   // Avoid 'any' type
   // Use proper error handling
   // Document complex logic
   ```

2. **React Best Practices**:
   - Use functional components
   - Implement proper hooks usage
   - Optimize re-renders with memo
   - Use proper key props
   - Handle loading and error states

3. **Next.js Best Practices**:
   - Use App Router features
   - Implement proper caching
   - Optimize images
   - Use proper metadata
   - Server vs Client components

### File Organization

```
src/
├── app/
│   ├── (public)/          # Public pages
│   ├── admin-panel/       # Admin pages
│   ├── user-panel/        # User pages
│   └── api/               # API routes
├── components/
│   ├── ui/                # Base UI components
│   ├── features/          # Feature components
│   └── layouts/           # Layout components
├── lib/
│   ├── services/          # Business logic
│   ├── utils/             # Utility functions
│   └── hooks/             # Custom hooks
└── types/                 # TypeScript types
```

### API Development

1. **Route Structure**:
   ```typescript
   // src/app/api/resource/route.ts
   import { NextRequest, NextResponse } from 'next/server';
   import { getServerSession } from 'next-auth';
   
   export async function GET(req: NextRequest) {
     // Authentication check
     // Authorization check
     // Input validation
     // Business logic
     // Error handling
     // Response formatting
   }
   ```

2. **Error Handling**:
   ```typescript
   try {
     // Logic
     return NextResponse.json({ data }, { status: 200 });
   } catch (error) {
     console.error('Error:', error);
     return NextResponse.json(
       { error: 'Internal server error' },
       { status: 500 }
     );
   }
   ```

3. **Validation**:
   - Validate all inputs
   - Sanitize user data
   - Check authorization
   - Return clear errors

### Database Operations

1. **Prisma Best Practices**:
   ```typescript
   // Use transactions for related operations
   await prisma.$transaction([
     prisma.booking.create({ data }),
     prisma.payment.create({ data })
   ]);
   
   // Use proper error handling
   // Implement pagination
   // Optimize queries
   // Use proper indexes
   ```

2. **Migration Process**:
   ```bash
   # Development
   npx prisma migrate dev --name descriptive-name
   
   # Production (in startup script)
   npx prisma migrate deploy
   ```

### Security Implementation

1. **Authentication**:
   - Use NextAuth.js
   - Validate sessions
   - Check authorization
   - Handle token expiry

2. **Input Validation**:
   - Validate all inputs
   - Sanitize user data
   - Check data types
   - Enforce limits

3. **Authorization**:
   ```typescript
   const session = await getServerSession(authOptions);
   if (!session) {
     return NextResponse.json(
       { error: 'Unauthorized' },
       { status: 401 }
     );
   }
   
   if (session.user.role !== 'ADMIN') {
     return NextResponse.json(
       { error: 'Forbidden' },
       { status: 403 }
     );
   }
   ```

---

## Testing Requirements

### Testing Strategy

1. **Unit Tests** (Required):
   - Test individual functions
   - Test utility functions
   - Test service logic
   - Coverage target: 80%+

2. **Component Tests** (Required):
   - Test React components
   - Test user interactions
   - Test rendering logic
   - Use React Testing Library

3. **E2E Tests** (For critical flows):
   - Test complete user flows
   - Test booking process
   - Test payment flow
   - Test admin operations
   - Use Playwright

4. **Integration Tests** (For APIs):
   - Test API endpoints
   - Test database operations
   - Test external services
   - Test error scenarios

### Test File Structure

```
src/
├── components/
│   ├── Button.tsx
│   └── Button.test.tsx
├── lib/
│   ├── utils.ts
│   └── utils.test.ts
└── app/
    └── api/
        ├── users/
        │   ├── route.ts
        │   └── route.test.ts
```

### Writing Tests

```typescript
// Unit test example
import { calculateTotal } from '@/lib/utils';

describe('calculateTotal', () => {
  it('should calculate total correctly', () => {
    expect(calculateTotal(100, 10, 5)).toBe(115);
  });
  
  it('should handle zero values', () => {
    expect(calculateTotal(0, 0, 0)).toBe(0);
  });
});

// Component test example
import { render, screen } from '@testing-library/react';
import { Button } from '@/components/Button';

describe('Button', () => {
  it('renders button with text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });
});
```

### Test Coverage Requirements

- **Unit Tests**: 80%+ coverage
- **Component Tests**: All interactive components
- **E2E Tests**: All critical user flows
- **API Tests**: All endpoints

### Running Tests

```bash
# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Run specific test
npm test -- Button.test.tsx

# Watch mode
npm run test:watch
```

---

## Documentation Standards

### Code Documentation

1. **Function Documentation**:
   ```typescript
   /**
    * Calculates the total price including tax and fees
    * @param basePrice - The base price before tax
    * @param taxRate - Tax rate as percentage (e.g., 10 for 10%)
    * @param fees - Additional fees
    * @returns The total price including all charges
    */
   export function calculateTotal(
     basePrice: number,
     taxRate: number,
     fees: number
   ): number {
     const tax = (basePrice * taxRate) / 100;
     return basePrice + tax + fees;
   }
   ```

2. **Complex Logic**:
   ```typescript
   // Calculate carbon footprint based on distance and mode of transport
   // Formula: distance (km) × emission factor (kg CO2/km)
   const carbonFootprint = distance * emissionFactors[transport];
   ```

3. **API Documentation**:
   - Document all endpoints
   - Include request/response examples
   - List possible error codes
   - Document authentication requirements

### Documentation Files

Update these files when relevant:

1. **CONFIGURATION.md**:
   - New environment variables
   - New API endpoints
   - New features
   - Configuration changes

2. **REQUIREMENTS.md**:
   - New features
   - Changed requirements
   - Updated roadmap

3. **MEMORY.md**:
   - Completed work
   - Current stage
   - Known issues
   - Next steps

### PR Documentation

Every PR must include:

1. **PR Title**: Clear and descriptive
2. **PR Description**:
   - Summary of changes
   - Motivation and context
   - Testing performed
   - Screenshots (for UI changes)
   - Breaking changes (if any)

3. **Checklist**:
   - [ ] Code follows style guidelines
   - [ ] Self-review completed
   - [ ] Comments added for complex code
   - [ ] Documentation updated
   - [ ] Tests added/updated
   - [ ] All tests pass
   - [ ] No new warnings
   - [ ] Dependent changes merged

---

## Deployment Process

### Pre-Deployment Checklist

- [ ] All tests pass
- [ ] Lint errors resolved
- [ ] Type errors resolved (or documented)
- [ ] Documentation updated
- [ ] Environment variables documented
- [ ] Database migrations prepared
- [ ] Rollback plan ready
- [ ] Monitoring alerts configured

### Deployment Steps

1. **Staging Deployment**:
   ```bash
   # Build and test
   npm run build
   npm test
   
   # Deploy to staging
   # Test on staging
   # Run smoke tests
   ```

2. **Production Deployment**:
   ```bash
   # Final checks
   npm run validate:env
   npm run build:production
   
   # Deploy
   # Monitor logs
   # Run health checks
   ```

3. **Post-Deployment**:
   - Monitor error rates
   - Check performance metrics
   - Verify functionality
   - Watch for anomalies
   - Be ready to rollback

### Rollback Plan

If issues occur:

1. **Immediate Actions**:
   - Identify the issue
   - Assess impact
   - Decide: fix forward or rollback

2. **Rollback Process**:
   ```bash
   # CapRover: Use built-in rollback
   # Or redeploy previous version
   git revert <commit-hash>
   git push
   ```

3. **Communication**:
   - Notify team
   - Document issue
   - Create post-mortem

### Feature Flags

Use feature flags for risky changes:

```typescript
// In AppSettings table
const featureEnabled = await prisma.appSettings.findUnique({
  where: {
    category_key: {
      category: 'features',
      key: 'enable_web3'
    }
  }
});

if (featureEnabled?.value === true) {
  // New feature code
} else {
  // Old code or disabled state
}
```

---

## Communication Protocol

### Status Updates

Provide regular updates:

1. **Daily Updates** (for active work):
   - What was accomplished
   - Current blockers
   - Next steps

2. **PR Updates**:
   - Respond to comments within 24 hours
   - Request review when ready
   - Address feedback promptly

3. **Issue Updates**:
   - Update issue status
   - Comment on progress
   - Link related PRs

### Asking for Help

When blocked:

1. **Document the Problem**:
   - What you're trying to do
   - What you've tried
   - Error messages
   - Relevant code

2. **Research First**:
   - Check documentation
   - Search existing issues
   - Try debugging
   - Consult logs

3. **Ask Clearly**:
   - Clear problem statement
   - Steps to reproduce
   - Expected vs actual behavior
   - Environment details

### Escalation Process

For critical issues:

1. **Level 1** - Self-resolve (2 hours)
2. **Level 2** - Team help (4 hours)
3. **Level 3** - Escalate to lead (8 hours)
4. **Level 4** - Stakeholder involvement

---

## Goal Achievement Strategy

### Breaking Down Large Goals

For complex features:

1. **Phase 1: Foundation**
   - Core infrastructure
   - Basic functionality
   - Tests and documentation

2. **Phase 2: Enhancement**
   - Additional features
   - UI improvements
   - Performance optimization

3. **Phase 3: Polish**
   - Edge cases
   - Error handling
   - User experience
   - Accessibility

### Iterative Development

1. **MVP First**:
   - Build minimum viable product
   - Get feedback
   - Iterate

2. **Incremental Improvements**:
   - Small, focused changes
   - Frequent commits
   - Regular testing
   - Continuous integration

3. **Feedback Loop**:
   - User testing
   - Performance monitoring
   - Error tracking
   - Continuous improvement

### Success Metrics

Track progress with:

1. **Technical Metrics**:
   - Test coverage
   - Build success rate
   - Performance benchmarks
   - Error rates

2. **Business Metrics**:
   - Feature adoption
   - User satisfaction
   - System uptime
   - Response times

3. **Process Metrics**:
   - PR cycle time
   - Code review time
   - Deployment frequency
   - Mean time to recovery

---

## Advanced Techniques

### Performance Optimization

1. **Frontend**:
   - Code splitting
   - Lazy loading
   - Image optimization
   - Caching strategies
   - Minimize bundle size

2. **Backend**:
   - Database query optimization
   - Connection pooling
   - API caching
   - Efficient algorithms
   - Async processing

3. **Monitoring**:
   - Performance tracking
   - Bottleneck identification
   - Resource utilization
   - User experience metrics

### Scalability Patterns

1. **Horizontal Scaling**:
   - Stateless services
   - Load balancing
   - Session management
   - Database replication

2. **Vertical Scaling**:
   - Resource optimization
   - Memory management
   - CPU efficiency
   - I/O optimization

3. **Caching Strategy**:
   - Redis for session data
   - CDN for static assets
   - API response caching
   - Database query caching

### Security Best Practices

1. **OWASP Top 10**:
   - SQL Injection prevention
   - XSS prevention
   - CSRF protection
   - Authentication security
   - Authorization controls

2. **Data Protection**:
   - Encryption in transit (HTTPS)
   - Encryption at rest
   - PII handling
   - Secure storage
   - Data anonymization

3. **Regular Audits**:
   - Dependency scanning
   - Code security review
   - Penetration testing
   - Vulnerability assessment

---

## Emergency Procedures

### Production Issues

1. **Immediate Response**:
   - Assess severity
   - Notify team
   - Start investigation
   - Document timeline

2. **Investigation**:
   - Check logs
   - Review recent changes
   - Identify root cause
   - Determine impact

3. **Resolution**:
   - Fix or rollback
   - Test thoroughly
   - Deploy fix
   - Verify resolution

4. **Post-Mortem**:
   - Document incident
   - Root cause analysis
   - Prevention measures
   - Process improvements

### Data Recovery

If data issues occur:

1. **Stop Further Damage**:
   - Disable affected features
   - Prevent data overwrites
   - Isolate the issue

2. **Assess Damage**:
   - Identify affected data
   - Determine data loss
   - Check backup availability

3. **Recovery Process**:
   - Restore from backup
   - Validate data integrity
   - Test functionality
   - Monitor closely

---

## Continuous Improvement

### Learning from Experience

After each feature:

1. **What Went Well**:
   - Celebrate successes
   - Document effective approaches
   - Share knowledge

2. **What Could Improve**:
   - Identify challenges
   - Learn from mistakes
   - Update processes

3. **Action Items**:
   - Process improvements
   - Tool enhancements
   - Skill development

### Staying Current

1. **Technology Updates**:
   - Monitor dependency updates
   - Review security advisories
   - Test new features
   - Plan upgrades

2. **Best Practices**:
   - Read documentation
   - Follow industry leaders
   - Attend conferences
   - Participate in community

3. **Skill Development**:
   - Learn new technologies
   - Practice new patterns
   - Experiment safely
   - Share knowledge

---

## Quick Reference

### Common Commands

```bash
# Development
npm run dev              # Start dev server
npm run build            # Build app
npm test                 # Run tests
npm run lint             # Run linter

# Database
npm run db:generate      # Generate Prisma client
npm run db:push          # Push schema
npm run db:seed          # Seed database
npm run db:studio        # Open Prisma Studio

# Deployment
npm run build:production # Production build
npm run validate:env     # Validate environment
npm run diagnose         # System diagnostic

# Git
git checkout -b pr/NN-description
git add .
git commit -m "feat: description"
git push origin pr/NN-description
```

### Useful Resources

- **Next.js Docs**: https://nextjs.org/docs
- **Prisma Docs**: https://www.prisma.io/docs
- **NextAuth Docs**: https://next-auth.js.org
- **React Docs**: https://react.dev
- **TypeScript Docs**: https://www.typescriptlang.org/docs

---

**Last Updated**: 2025-10-19  
**Version**: 1.0  
**Maintained By**: Development Team

*This document should be reviewed and updated regularly to reflect current best practices and project needs.*
