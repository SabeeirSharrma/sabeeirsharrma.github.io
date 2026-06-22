# RECORDED-CHANGES

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
