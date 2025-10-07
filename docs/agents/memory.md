(Agent state file — keep chronological history; update after every PR merge.)

project: "Smart Carbon-Free Village - Futuristic"
repository: "https://github.com/damdayvillage-a11y/Village"
last_updated: "2025-01-07T16:45:00.000Z"
current_stage:
  pr_number: 6
  pr_title: "Homestay booking + dynamic pricing + offline-first sync + payments (sandbox)"
  status: "in_progress"
  branch: "copilot/optimize-loading-speed-design"
completed_prs:
  - number: 1
    title: "Foundation & infra (monorepo, Next.js, TypeScript, linting, basic PWA shell)"
    merge_commit: "2c61be5"
    date: "2024-10-07T03:45:00.000Z"
    ci_status: "passed"
    staging_url: "http://localhost:3000"
    screenshot_paths: ["docs/memory/screenshots/pr-01/homepage-desktop.png"]
    lighthouse_scores: {performance: "pending", accessibility: "pending", best_practices: "pending", seo: "pending"}
    test_coverage: "pending"
    build_status: "successful"
  - number: 2
    title: "DB & Prisma + TimescaleDB for sensors + device simulation harness"
    merge_commit: "324c355"
    date: "2024-10-07T03:50:00.000Z"
    ci_status: "passed"
    staging_url: "http://localhost:3000"
    screenshot_paths: ["docs/memory/screenshots/pr-02/dashboard-desktop.png"]
    telemetry_snapshot: "docs/memory/telemetry/pr-02-sample.json"
    lighthouse_scores: {performance: "pending", accessibility: "pending", best_practices: "pending", seo: "pending"}
    test_coverage: "pending"
    build_status: "successful"
    api_endpoints: ["/api/health", "/api/devices", "/api/telemetry"]
  - number: 3
    title: "Auth & RBAC + DID-ready identity + admin bootstrap"
    merge_commit: "13de7eb"
    date: "2024-10-07T04:10:00.000Z"
    ci_status: "passed"
    staging_url: "http://localhost:3000"
    screenshot_paths: ["docs/memory/screenshots/pr-03/auth-signin-complete.png"]
    lighthouse_scores: {performance: "pending", accessibility: "pending", best_practices: "pending", seo: "pending"}
    test_coverage: "pending"
    build_status: "successful"
    api_endpoints: ["/api/auth/[...nextauth]", "/api/auth/register"]
    auth_features: ["NextAuth.js", "OAuth (Google/GitHub)", "RBAC", "Password security", "Multi-factor ready", "DID preparation"]
  - number: 4
    title: "Design system + 3D skeleton (Three.js viewer) + accessibility baseline"
    merge_commit: "pending"
    date: "2024-10-07T05:15:00.000Z"
    ci_status: "passed"
    staging_url: "http://localhost:3000"
    screenshot_paths: ["docs/memory/screenshots/pr-04/homepage-enhanced-pr4.png", "docs/memory/screenshots/pr-04/digital-twin-3d-viewer-pr4.png"]
    lighthouse_scores: {performance: "pending", accessibility: "pending", best_practices: "pending", seo: "pending"}
    test_coverage: "pending"
    build_status: "successful"
    ui_pages: ["/digital-twin"]
    components: ["Button", "Input", "Card", "Modal", "Alert", "Badge", "Avatar", "Progress", "VillageViewer"]
    threejs_features: ["3D Scene", "Interactive village model", "Mouse controls", "Lighting system", "Performance optimization"]
  - number: 5
    title: "Homepage & Digital Twin integration + AR/360 viewer"
    merge_commit: "pending"
    date: "2024-10-07T06:30:00.000Z"
    ci_status: "passed"
    staging_url: "http://localhost:3000"
    screenshot_paths: ["docs/memory/screenshots/pr-05/homepage-with-village-tour.png", "docs/memory/screenshots/pr-05/village-tour-360-page.png"]
    telemetry_snapshot: "docs/memory/telemetry/pr-05-ar-360-features.json"
    lighthouse_scores: {performance: "pending", accessibility: "pending", best_practices: "pending", seo: "pending"}
    test_coverage: "pending"
    build_status: "successful"
    ui_pages: ["/village-tour"]
    ar_features: ["360° Panorama Viewer", "Interactive Hotspots", "WebXR AR Integration", "Mobile Gestures", "Real-time Village Data"]
    api_endpoints: ["/api/village/info"]
upcoming_prs:
  - number: 6
    title: "Homestay booking & offline sync"
    status: "in_progress"
  - number: 7
    title: "Marketplace & web3 escrow"
    status: "pending"
  - number: 8
    title: "Projects transparency & DAO"
    status: "pending"
  - number: 9
    title: "IoT ingestion & microgrid"
    status: "pending"
  - number: 10
    title: "Cultural CMS & AR tours"
    status: "pending"
  - number: 11
    title: "Admin panel & ML features"
    status: "pending"
  - number: 12
    title: "Testing & production deploy"
    status: "pending"
  - number: 13
    title: "Complete Navigation & Page Implementation"
    status: "pending"
  - number: 14
    title: "User Panel — Full Features & Auth Flow"
    status: "pending"
  - number: 15
    title: "Admin Panel — Dynamic Content & Component Editor"
    status: "pending"
  - number: 16
    title: "Booking & Payment Complete Flow"
    status: "pending"
  - number: 17
    title: "Marketplace & Seller Management"
    status: "pending"
  - number: 18
    title: "Projects Transparency & Live Dashboard"
    status: "pending"
  - number: 19
    title: "Media, Gram Pradhan & National Heroes Block"
    status: "pending"
  - number: 20
    title: "Full Site Admin Customization Panel & Theming"
    status: "pending"
  - number: 21
    title: "Final QA, Security, Accessibility, Performance & Public Release"
    status: "pending"
artifacts:
  screenshots: 
    - pr: 1
      path: 'docs/memory/screenshots/pr-01/homepage-desktop.png'
      desc: 'Homepage with hero section, feature cards, and coming soon sections'
      timestamp: '2024-10-07T03:45:00.000Z'
    - pr: 2
      path: 'docs/memory/screenshots/pr-02/dashboard-desktop.png'
      desc: 'Database dashboard showing system health, API endpoints, and schema info'
      timestamp: '2024-10-07T03:50:00.000Z'
    - pr: 3
      path: 'docs/memory/screenshots/pr-03/auth-signin-complete.png'
      desc: 'Advanced authentication system with NextAuth.js, OAuth providers, and secure sign-in'
      timestamp: '2024-10-07T04:10:00.000Z'
    - pr: 4
      path: 'docs/memory/screenshots/pr-04/homepage-enhanced-pr4.png'
      desc: 'Enhanced homepage with new component library and improved navigation'
      timestamp: '2024-10-07T05:15:00.000Z'
    - pr: 4
      path: 'docs/memory/screenshots/pr-04/digital-twin-3d-viewer-pr4.png'
      desc: 'Three.js 3D Digital Twin viewer showing interactive village model with mountains and trees'
      timestamp: '2024-10-07T05:16:00.000Z'
    - pr: 5
      path: 'docs/memory/screenshots/pr-05/homepage-with-village-tour.png'
      desc: 'Enhanced homepage with integrated 360° Village Tour navigation and call-to-action buttons'
      timestamp: '2024-10-07T06:30:00.000Z'
    - pr: 5
      path: 'docs/memory/screenshots/pr-05/village-tour-360-page.png'
      desc: 'Complete 360° Village Tour page with AR panorama viewer, interactive features, and live environmental data'
      timestamp: '2024-10-07T06:31:00.000Z'
  videos: [] # optional screen recordings {pr, path, desc, timestamp}
  telemetry_snapshots: 
    - pr: 2
      path: 'docs/memory/telemetry/pr-02-sample.json'
      desc: 'Sample IoT device telemetry data for 3 device types'
      timestamp: '2024-10-07T03:50:00.000Z'
    - pr: 5
      path: 'docs/memory/telemetry/pr-05-ar-360-features.json'
      desc: 'AR/360 viewer telemetry and interactive features performance data'
      timestamp: '2024-10-07T06:30:00.000Z'
  model_versions: [] # {pr, model_name, version, metrics, path}
  deployments:
    - pr: 0
      env: "none"
      url: ""
    - pr: 5
      env: "production"
      url: "https://village-app.captain.damdayvillage.com/"
      status: "active"
  test_reports: [] # {pr, path, summary, coverage}
notes: []
issues_open: []
tasks_blocked: []
security_notes: []
deployment_history: []
iot_devices_sample: [] # sample devices used in simulation with schemas
data_retention_policy: {media: "2y", telemetry: "5y", user_pii: "as per consent"}
ledger_backups: [] # blockchain/ledger snapshot links

MEMORY UPDATE RULES:
- On PR merge, append to `completed_prs`: number, title, merge_commit, date, CI status, staging_url, prod_url (if deployed), screenshot paths, video paths, test coverage, Lighthouse scores, sensor sample snapshots, model metadata.
- For hardware features, capture a simulated telemetry snapshot and store sample device definitions in `iot_devices_sample`.
- On ML changes, store model artifact path and evaluation metrics in `model_versions`.
- On blockchain actions, store tx hashes (if in testnet) and contract addresses plus audit notes.
- For any failed CI/test or security flag, create an entry under `tasks_blocked` with remediation plan.