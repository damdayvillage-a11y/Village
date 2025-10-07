Agent Execution Rules & Checklist (ENFORCED)

1. READ FIRST: Read `/docs/agents/requirements.md` and `/docs/agents/memory.md`. Commit checkpoint.
2. BRANCH: `pr/NN-short-description` (NN zero-padded).
3. PR TEMPLATE: Use the standard PR template and include the extended checklist below.
4. HUMAN-APPROVAL: Add `human-approval` label for:
   - PostgreSQL/production migrations
   - Payment provider secrets or live keys
   - Any blockchain transactions (even testnet→prod contract)
   - Drone or physical device commissioning
   - Data deletion of PII
5. SIMULATION-FIRST RULE: For all IoT, drone, and payment flows, implement a robust simulation mode and tests that prove correctness before hooking real hardware/services. If you must enable a real device or production key, require `human-approval`.
6. TESTING REQUIREMENTS:
   - Unit tests (Jest): coverage >= 80%
   - Component tests (React Testing Library)
   - E2E (Playwright): core flows (booking, checkout, admin CRUD, device simulation)
   - Accessibility (axe) integrated into CI; zero critical violations
   - Lighthouse CI: record scores for Home, Homestay, Marketplace, Admin
   - Load tests (k6 or Artillery): define SLOs and run on PR 12; earlier PRs have smoke load tests
   - Chaos tests (optional Gremlin or simple fault injection): try service failures for critical paths on staging
7. SCREENSHOT & MEDIA CAPTURE (automated):
   - After staging deploy, run Playwright capture for:
     - Home, Homestay list/detail, Booking success, Marketplace list/checkout, Project timeline, Admin dashboard, Digital Twin view, IoT dash
   - Save screenshots to `docs/memory/screenshots/pr-N/`. Save short screen recordings to `docs/memory/videos/pr-N/` for flows that require dynamic inspection (e.g., 3D viewer).
   - Add telemetry snapshot: `docs/memory/telemetry/pr-N-sample.json` with device sample data.
8. CI/CD:
   - Workflow: validate → build → preview deploy (staging) → E2E + a11y + perf → (on main + human-approval) prod deploy.
   - Use GitHub Actions secrets and optional HashiCorp Vault for long-term secrets.
   - CapRover: provide `captain-definition` and Dockerfile. Include canary/preview deployment option.
9. DATABASE MIGRATIONS:
   - Prisma Migrate only.
   - For production migrations, require backup + staging migration + smoke tests + `human-approval` label.
10. MONITORING & ROLLBACK:
   - After deployment, run health-check endpoints, smoke E2E, and run Playwright screenshots. Record results to memory.
   - If errors > threshold or SLO violated, perform rollback plan documented in PR.
11. SECURITY & AUDITS:
   - `npm audit` in CI; fail on critical vulnerabilities. Document other high/severe items with remediation timeline.
   - For smart-contracts, require audit report before production.
12. MERGE:
   - Squash merges preferred.
   - Update `docs/agents/memory.md` in the merge commit with artifacts.
13. ESCALATION:
   - If blocked > 8 hours (automation or human-dependent), open Issue `needs-human` and tag human stakeholders.

PR CHECKLIST (include in PR description)
- [ ] Lint passed
- [ ] Type-check passed
- [ ] Unit tests added & passed
- [ ] E2E tests added for the feature & passed (or simulation tests)
- [ ] Playwright screenshots saved to `docs/memory/screenshots/pr-N/`
- [ ] Accessibility audit run (axe) and critical issues fixed
- [ ] Security scan run and critical issues resolved
- [ ] Performance baseline recorded (Lighthouse)
- [ ] Memory updated (screenshots, telemetry if relevant)
- [ ] Migration scripts included (if DB changed)
- [ ] Human-approval label added (if required)

PR TEMPLATE (agent must auto-fill)
---
Title: [PR NN] Short Title
Summary: One-paragraph summary
Scope:
 - Files changed:
 - New files:
 - DB migrations:
Testing:
 - Unit tests: pass/fail, notes
 - E2E tests: pass/fail, notes
 - Accessibility: issues fixed
 - Lighthouse: scores
Simulation artifacts (if IoT/hardware):
 - telemetry snapshot path
 - simulated device definitions path
Deployment Preview: <staging url>
Screenshots: /docs/memory/screenshots/pr-N/
Checklist: (copy above)
---