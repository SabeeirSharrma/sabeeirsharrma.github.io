# RECORDED-CHANGES

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
