# RECORDED-CHANGES

## 2026-06-29 — Phase 6: CPAC Client Updates

### Help Text

- **Paru preference** — `cpac --help` now mentions Paru is preferred (yay still supported)
- **Donate link trailing slash** — Fixed to `https://thecinderproject.qd.je/donate/`

### Suspicious Pattern Detection

- **npm/bun pipe-to-shell** — Pass 2 now catches:
  - `npm install | sh` / `npm install | bash`
  - `bun install | sh` / `bun install | bash`
  - `npx | sh` / `npx | bash`
  - `curl | npx` / `wget | npx`
- **5 new patterns** added to `check_remote_execution()` in `sanitize.rs`

### Unknown Package Behavior

- Local scoring still runs when package not in trust DB
- Missing DB data shown as neutral signals (+0), not penalties
- Warning clearly states score is local-only, not that scoring failed

### Modified Files

- **`cpac/src/cli/mod.rs`** — Added paru mention, fixed donate trailing slash
- **`cpac/src/sanitize.rs`** — Added 5 npm/bun pipe-to-shell patterns

## 2026-06-29 — Phase 5: Email Notifications

### Weekly Advisory Reports

- **New migration:** `20260629000004_add_email_notifications.sql`
- `email_log` table — tracks all sent emails, prevents duplicates
- `report_queue` table — generated reports awaiting send (ephemeral: sent → deleted)
- `get_volunteers_for_today()` — returns volunteers whose report day matches today (based on account creation DOW)
- `get_weekly_submissions()` — returns submissions for a volunteer in a date range
- `cleanup_old_reports()` — deletes sent reports older than 7 days

### Worker Endpoints

- **`POST /reports/generate`** — generates weekly reports for volunteers due today
  - Queries submissions from past 7 days
  - Gets reputation stats (trust tier, approval rate)
  - Builds HTML report using `buildWeeklyReportHtml()`
  - Inserts into `report_queue`
  - Skips volunteers with zero activity

- **`POST /reports/send`** — sends queued reports via Resend
  - Fetches all pending reports from `report_queue`
  - Sends email via Resend API
  - Logs in `email_log`
  - Marks as sent/failed in `report_queue`

### Email Flow

1. Cron/trigger calls `POST /reports/generate`
2. Reports generated for volunteers whose report day = today
3. Cron/trigger calls `POST /reports/send`
4. Emails sent via Resend, logged in `email_log`
5. Sent reports cleaned up after 7 days

### Staggered Schedule

- Reports sent based on account creation day of week
- Created Monday → report every Monday
- Naturally spreads volunteers across 7 days
- Zero activity = no email that week

### Modified Files

- **`worker/src/index.ts`** — Added `/reports/generate` and `/reports/send` endpoints
- **`supabase/migrations/20260629000004_add_email_notifications.sql`** — New migration

## 2026-06-29 — Phase 4: Reputation System

### Reputation Tracking

- **New migration:** `20260629000003_add_reputation_system.sql`
- Added `strikes` column to `profiles` (default 0)
- `volunteer_reputation` view: approval rate, trust tier (Trusted/Standard/Probation/Suspended), active days, submission counts
- `maintainer_reputation` view: reviews conducted, active review days
- `reject_advisory_with_strike()`: increments strike count on rejection, auto-flags at 3 strikes
- `approve_advisory_with_reputation()`: reduces strikes by 1 on approval (incentivizes quality)
- `check_volunteer_inactivity_detailed()`: returns inactive volunteers with trust tier info

### Trust Tiers

- **Trusted**: 80%+ approval rate AND 20+ approved submissions
- **Standard**: default (0-1 strikes)
- **Probation**: 2 strikes
- **Suspended**: 3+ strikes

### Panel Updates

- **Volunteer panel**: reputation card showing trust tier, approval rate, submissions, approved/rejected counts, strikes
- **Maintainer panel**: new "Volunteers" tab with all volunteer reputation stats (sortable by submissions)
- **Admin panel**: volunteer reputation table in Stats tab

### Modified Files

- **`src/pages/cpac-trust-db/web/panel/volunteer/index.astro`** — Added reputation card + `loadReputation()`
- **`src/pages/cpac-trust-db/web/panel/maintainer/index.astro`** — Added "Volunteers" tab with `loadVolunteers()`
- **`src/pages/cpac-trust-db/web/panel/admin/index.astro`** — Added volunteer reputation table in Stats
- **`supabase/migrations/20260629000003_add_reputation_system.sql`** — New migration

## 2026-06-29 — Admin Panel + Admin Role + AI Index Fix

### Admin Panel (`/cpac-trust-db/web/panel/admin/`)

- **Accounts tab** — create volunteer/maintainer accounts directly (no Discord ticket needed from admin), change roles, delete accounts
- **Pending Review tab** — approve/reject volunteer advisory submissions (same as maintainer panel)
- **Published tab** — view all published advisories
- **Comparer tab** — version-focused PKGBUILD comparison with diff and suspicious pattern detection
- **Inactivity tab** — lists volunteers with zero submissions in 30+ days
- **Stats tab** — published, pending, volunteer, and maintainer counts

### Admin Role (Supabase Schema)

- **New migration:** `20260629000002_add_admin_role.sql`
- Added `admin` to `profiles.role` CHECK constraint (now: admin, maintainer, volunteer)
- RLS policies: admins can read/insert/update/delete all profiles
- Admin can approve/reject pending advisories (same as maintainers)
- `create_account()`, `suspend_account()`, `delete_account()` functions

### Login Redirect

- Updated `login.astro` — admins redirect to `/panel/admin/`, maintainers to `/panel/maintainer/`, volunteers to `/panel/volunteer/`

### AI Index Fix

- **Fixed:** `20260629000000_add_ai_analysis.sql` — removed `WHERE expires_at > NOW()` from partial index (NOW() is not IMMUTABLE, causing Postgres error 42P17)
- Now a standard index on `expires_at`

### Modified Files

- **`src/pages/cpac-trust-db/web/panel/admin/index.astro`** — New admin panel
- **`src/pages/cpac-trust-db/web/panel/login.astro`** — Added admin redirect
- **`supabase/migrations/20260629000002_add_admin_role.sql`** — New migration
- **`supabase/migrations/20260629000000_add_ai_analysis.sql`** — Fixed index

## 2026-06-29 — Phase 3: Advisory Lifecycle, Snapshot Retention, Storage Management

### Advisory Versioning (`advisory_history` table)

- **New table:** `advisory_history` — append-only version history, never deleted or overwritten
- When an advisory is approved for a package that already has one, the current state is snapshotted into `advisory_history` before the update
- `advisories` table always holds the current state; `advisory_history` holds the timeline
- Indexes on package, advisory_id, and snapshot_at for efficient queries

### Modified `approve_advisory()` Function

- Now uses UPSERT logic: checks for existing advisory before inserting
- If existing advisory found → snapshots it into `advisory_history` → updates `advisories` row
- If no existing advisory → inserts new row (original behavior)
- History entry records who triggered the snapshot (`snapshot_by`)

### Snapshot Retention Policy

- **`is_core_package()`** — immutable function returning true for 40+ core packages (base, linux, systemd, git, etc.)
- **`cleanup_old_snapshots()`** — deletes snapshots for non-core packages:
  - Large packages: retained 2 days after version is no longer latest
  - Small packages: retained 5 days
  - Core packages: never cleaned
- Can be called via cron job or GitHub Actions

### Storage Management

- **`package_storage_usage` view** — per-package stats: snapshot count, total submissions, activity status (active/stale/inactive)
- **`packages_flagged_for_cleanup` view** — packages inactive 30+ days, non-core, ready for cleanup

### Volunteer Inactivity Check

- **`check_volunteer_inactivity()`** — returns volunteers with zero submissions in 30+ days or never submitted
- Used by Phase 5 email system to trigger account suspension

### Database Changes

- **New migration:** `20260629000001_advisory_lifecycle.sql`
- **New table:** `advisory_history`
- **New functions:** `is_core_package()`, `cleanup_old_snapshots()`, `check_volunteer_inactivity()`
- **New views:** `package_storage_usage`, `packages_flagged_for_cleanup`
- **Modified function:** `approve_advisory()` — now snapshots history before update

## 2026-06-28 — Phase 2: Comparer Redesign, AI Analysis, AUR CORS Proxy

### AUR CORS Proxy (Cloudflare Worker)

- **New endpoints** on `worker/src/index.ts`:
  - `/cpac-trust-db/api/aur/info/<pkg>` — proxies AUR RPC info (browser can't fetch directly due to CORS)
  - `/cpac-trust-db/api/aur/pkgbuild/<pkg>` — proxies PKGBUILD fetch from AUR
- Added CORS preflight (`OPTIONS`) handling
- Worker now supports three route types: AUR info, AUR pkgbuild, Supabase proxy

### AI Analysis Cache (`ai_analysis` table)

- **New Supabase migration** `20260629000000_add_ai_analysis.sql`
- Stores on-demand AI analysis results with 3-hour expiry
- Cache lookup index on `(package, version_old, version_new, diff_hash)`
- Cleanup function for expired entries
- RLS: public read, authenticated write

### Redesigned Volunteer Panel Comparer

- **Package search** with autocomplete from DB snapshots + AUR
- **Version selectors** — choose any two known versions to compare
- **PKGBUILD fetch** — from DB snapshots (`pkgbuild_text`) or AUR via Worker proxy
- **Line-by-line diff** — LCS-based diff with added/removed highlighting
- **Suspicious pattern detection** — 8 categories mirroring `sanitize.rs` Pass 2:
  - curl/wget pipe to shell, eval, rm -rf, npm/bun/npx pipe to shell, hex escapes, base64
- **"Analyze with AI" button** — on-demand only, checks 3-hour cache before calling AI
- **"Recompare" button** — re-run with different versions
- **"Submit as Advisory"** — pre-fills submission form from comparison results

### Maintainer Panel Comparer Tab

- New "Comparer" tab added to maintainer panel
- Same version-comparison workflow as volunteer panel
- Package search, version selectors, diff view, suspicious pattern detection

### Modified Files

- **`worker/src/index.ts`** — Added AUR proxy endpoints, CORS preflight, refactored with `CORS_HEADERS`
- **`supabase/migrations/20260629000000_add_ai_analysis.sql`** — New migration
- **`src/pages/cpac-trust-db/web/panel/volunteer/index.astro`** — Complete comparer rewrite
- **`src/pages/cpac-trust-db/web/panel/maintainer/index.astro`** — Added Comparer tab with JS logic

## 2026-06-28 — Phase 1: Site Cleanup, Projects Page, Legal Sidebars

### CinderOS Removed

- **Deleted** `src/pages/cinderos/` — CinderOS landing and docs pages
- **Deleted** `src/content/docs/cinderos/` — all CinderOS markdown docs
- **Removed references** from: donate page, home page roadmap, TOS, privacy, CPAC docs, Trust DB docs
- CinderOS retained as text-only in Roadmap section (no link/page)

### Projects Page (`/projects`)

- **New page** listing all projects: CPAC (Active), CPAC Trust DB (Active), CinderOS (Planned)
- Status badges, descriptions, and links to pages/docs/GitHub
- "View All Projects" link added to home page Featured Projects section

### Home Page Updates

- Button text renamed from "View Projects" to "Featured Projects"
- "View All Projects" link added below project cards

### Legal Page Sidebars

- **TOS** (`/tos`) — sticky sidebar with h2 heading navigation, IntersectionObserver for active state
- **Privacy** (`/privacy`) — same sidebar pattern
- Hidden on mobile, visible on desktop (768px+)

### Modified Files

- **`src/pages/cinderos/**`** — Deleted
- **`src/content/docs/cinderos/**`** — Deleted
- **`src/pages/index.astro`** — Removed CinderOS roadmap item, renamed button, added "View All Projects" link
- **`src/pages/donate.astro`** — Removed "and CinderOS" from description
- **`src/pages/projects.astro`** — New projects page
- **`src/pages/tos.astro`** — Rewritten with sidebar navigation
- **`src/pages/privacy.astro`** — Rewritten with sidebar navigation
- **`src/content/docs/cpac/index.md`** — Removed cinderos from Related Projects table
- **`src/content/docs/cpac-trust-db/related.md`** — Removed cinderos row
- **`src/content/docs/tos.md`** — Removed CinderOS mention
- **`src/content/docs/privacy.md`** — Removed CinderOS mentions (2 occurrences)

## 2026-06-28 — Maintainer & Volunteer Panels

### Panel System (`/cpac-trust-db/web/panel/`)

- **Login page** (`/panel/login`) — Supabase Auth email/password, role-based redirect
- **Volunteer panel** (`/panel/volunteer`) — submit advisories, use comparer, view submissions
- **Maintainer panel** (`/panel/maintainer`) — review pending queue, approve/reject, view stats

### Client-Side Comparer (Volunteer Panel)

- Fetches PKGBUILD from AUR RPC (`aur.archlinux.org/rpc/v5/info/<pkg>`)
- Computes SHA-256 hash of PKGBUILD content
- Compares against trust DB snapshots and advisories
- Replicates the Rust `compare.rs` logic in JavaScript
- Displays verdict (Clean/Advisory/Divergent/Outdated/Unknown) with score adjustment
- "Submit as Advisory" button pre-fills the submission form

### Approval Workflow

- Volunteers submit advisories → pending queue (rate-limited: 5/day)
- Maintainers review → approve (moves to live `advisories` table) or reject (with notes)
- Supabase RPC functions: `approve_advisory()`, `reject_advisory()`
- Database trigger enforces daily rate limit per volunteer

### New Database Tables

- `profiles` — links Supabase Auth users to roles (maintainer/volunteer)
- `pending_advisories` — volunteer submissions awaiting review
- `daily_submission_counts` view — for rate limit checking
- Migration: `20260628000000_add_auth_and_roles.sql`

### Modified Files

- **`src/pages/cpac-trust-db/web/panel/login.astro`** — New login page
- **`src/pages/cpac-trust-db/web/panel/volunteer/index.astro`** — Volunteer dashboard with comparer
- **`src/pages/cpac-trust-db/web/panel/maintainer/index.astro`** — Maintainer review dashboard
- **`src/content/docs/cpac-trust-db/governance.md`** — Updated with volunteer/maintainer workflow
- **`src/content/docs/cpac-trust-db/auth.md`** — Updated with panel auth and roles

## 2026-06-27 — Donate Page, install.sh, Trust DB Docs, TOS & Privacy

### Donate Page (`/donate`)

- Two-step flow: choose gateway first, then amount (UPI only)
- **Step 1 — Gateway selection**: UPI or Ko-fi
  - UPI: shows amount selection
  - Ko-fi: opens `ko-fi.com/thecinderproject` in new tab, shows "Opened Ko-fi page in a new tab" confirmation with "Return home" button
- **Step 2 — Amount (UPI only)**: preset buttons (₹50/100/250/500) + custom input + "Generate QR & payment link" button
- **UPI modal**: dynamic QR code (qrcodejs), UPI ID copy, full payment string copy, mobile app link
- Ko-fi icon uses Feather Icons `coffee` SVG
- Desktop: shows "Copy UPI ID" button; Mobile: triggers native UPI app chooser
- Responsive layout matching site theme (dark gradient, glass cards, CSS variables)
- Uses `qrcodejs` library loaded via inline `<script is:inline>` for Astro compatibility

### Terms of Service & Privacy Policy

- New pages at `/tos` and `/privacy`
- Content stored in `src/content/docs/tos.md` and `src/content/docs/privacy.md`
- Pages fetch from the existing `docs` content collection and render with legal-page styling
- TOS covers: acceptance, services, IP, user responsibilities, data collection, disclaimers, liability, third parties, changes
- Privacy covers: what we don't collect, passive data (Google Fonts, CDNs, Supabase), payments (UPI direct, Ko-fi), data storage, open source transparency

### Footer Updated

- Added "Legal" column with links to Terms of Service and Privacy Policy
- Grid updated to 5 columns on desktop

### install.sh Endpoint (`/cpac/install.sh`)

- Transparent build-from-source installer served from `public/cpac/install.sh`
- Auto-detects Rust, installs temporary toolchain if needed, cleans up via trap
- Install command: `curl -sSf https://thecinderproject.qd.je/cpac/install.sh | bash`

### cpac-trust-db Docs Page (`/cpac-trust-db/docs`)

- Added via PR #13 (conflicts resolved during merge)
- Shows architecture, API reference, and integration docs
- Architecture diagram updated to show Cloudflare Worker proxy as primary, direct Supabase as fallback

### Modified Files

- **`src/pages/donate.astro`** — Donate page with two-step flow, Ko-fi, feather icon
- **`src/pages/tos.astro`** — Terms of Service page
- **`src/pages/privacy.astro`** — Privacy Policy page
- **`src/content/docs/tos.md`** — TOS content
- **`src/content/docs/privacy.md`** — Privacy Policy content
- **`src/components/Footer.astro`** — Added Legal column
- **`public/cpac/install.sh`** — New install script endpoint
- **`src/pages/cpac-trust-db/docs/index.astro`** — Updated to reflect proxy architecture
- **`src/content/docs/cpac-trust-db/architecture.md`** — Updated to show worker proxy + fallback
- **`src/content/docs/cpac-trust-db/api.md`** — Updated base URL to `api.thecinderproject.qd.je`

## 2026-06-22 — Single-Page Docs with Collapsible Sub-Topics

### What Changed

Converted the docs system from **multiple pages per topic** to a **single page per project**. All documentation for a project now renders on one scrollable page. The sidebar shows `##` headings as expandable sub-topics that appear/disappear based on scroll position.

### New Files

- **`src/layouts/SinglePageDocsLayout.astro`** — New layout that fetches all docs for a project, sorts by `order` frontmatter, renders them as consecutive `<section>` elements on one page, and extracts `##` headings from raw markdown for sidebar sub-topic data. Each section gets a `topic-{slug}` ID prefix to avoid collisions with markdown-generated heading IDs.

### Modified Files

- **`src/components/Sidebar.astro`** — Rewritten to use `#anchor` links for in-page navigation instead of separate page links. Now includes:
  - Nested `<ul>` sub-topics (h2 headings) hidden by default with `max-height: 0`
  - `IntersectionObserver` on sections to auto-expand/collapse sub-topics on scroll
  - `IntersectionObserver` on h2 headings to highlight the active sub-topic
  - Smooth `scrollIntoView` on click
  - Animated expand/collapse with CSS transitions and rotating chevron arrows
  - Active state tracking for both topics and sub-topics

- **`src/pages/cpac/docs/index.astro`** — Simplified to a single `<SinglePageDocsLayout project="cpac" />` call.

- **`src/pages/cinderos/docs/index.astro`** — Simplified to a single `<SinglePageDocsLayout project="cinderos" />` call.

### Deleted Files

- `src/pages/cpac/docs/installation.astro`
- `src/pages/cpac/docs/configuration.astro`
- `src/pages/cpac/docs/reference.astro`
- `src/pages/cinderos/docs/installation.astro`
- `src/pages/cinderos/docs/architecture.astro`

These individual doc pages are no longer needed since all content lives on the single index page per project.

### Untouched Files

- `src/layouts/DocsLayout.astro` — Kept but no longer referenced by any page.
- All markdown content files in `src/content/docs/` — No changes.
- `src/content.config.ts` — Same content collection config.
- `src/styles/global.css` — No changes.
