---
title: Reference
description: CinderBlock dashboard and feature reference.
order: 4
---

# Reference

## Dashboard

The CinderBlock dashboard is the main interface for managing content blocking. Access it via:

- **Toolbar button** -- click the CinderBlock icon in the browser toolbar
- **Keyboard shortcut** -- `Ctrl+Shift+B` (remappable)
- **URL** -- navigate to `ember://cinderblock`

### Sections

| Section | Description |
|---|---|
| **Settings** | Global blocking options, appearance, per-site switches, advanced settings |
| **Filter Lists** | Enable/disable lists, update individual lists, add custom list URLs |
| **My Filters** | User-authored custom filter rules in plaintext |
| **My Rules** | Per-site allow/block rules, whitelist management |
| **Trusted Sites** | Domains where CinderBlock is fully disabled |
| **Support** | Filter list tester, diagnostics |
| **About** | Version info, upstream attribution, dependencies |

---

## Filter Syntax

CinderBlock uses the [uBlock Origin / AdGuard filter syntax](https://github.com/gorhill/uBlock/wiki/Static-filter-syntax).

### Basic URL Pattern Matching

```
||ads.example.com^
```

Blocks all requests to `ads.example.com` and its subdomains.

### Domain-Specific Filters

```
example.com##.ad-banner
```

Hides elements matching `.ad-banner` on `example.com` only.

### Exception Rules

```
@@||example.com/ads
```

Allows requests matching the pattern (unblocks them).

### Option Modifiers

```
||ads.example.com^$third-party,script
```

Blocks third-party script requests to `ads.example.com`.

Common modifiers: `$third-party`, `$script`, `$image`, `$xhr`, `$stylesheet`, `$font`, `$subdocument`

### Hosts File Format

```
0.0.0.0 ads.example.com
```

Supported for lists that use hosts file format (StevenBlack, Dan Pollock, etc.).

### Cosmetic Filter Syntax

```
##.ad-banner                    ## Generic
example.com##.sponsored         ## Domain-specific
example.com##div:has(.popup)    ## Extended CSS
```

### Scriptlet Injection

```
example.com##+js(set-constant, adBlock, false)
example.com##+js(abort-on-property-read, adblock)
```

---

## Element Picker

Activated via toolbar button or `Ctrl+Shift+E`.

1. Hover over any element on the page -- it will be highlighted
2. Click to generate a cosmetic filter rule
3. Preview what will be hidden
4. Edit the generated rule if needed
5. Save to My Filters

---

## Network Logger

Accessible from the dashboard. Shows real-time network requests for the current tab.

| Column | Description |
|---|---|
| URL | The request URL |
| Type | Script, image, XHR, frame, etc. |
| Origin | The originating domain |
| Status | Blocked, allowed, or redirected |
| Filter | Which filter rule matched (if any) |

The logger is off by default (performance) and does not persist across sessions.

---

## Dynamic Filtering

Per-domain request type matrix for advanced users. Accessible from the dashboard in advanced mode.

| Action | Description |
|---|---|
| Block | Block all requests of this type from this domain |
| Allow | Allow all requests of this type from this domain |
| Noop | Use the default filter list behavior |

The matrix is color-coded:
- **Red** -- blocked
- **Green** -- allowed
- **Gray** -- default (noop)

---

## Per-Site Rules

Scoped to specific domains:

| Rule | Effect |
|---|---|
| Disable CinderBlock | Whitelist -- no filtering at all |
| Disable cosmetic filtering | Elements are not hidden |
| Disable scriptlet injection | Scriptlets are not injected |
| Custom filters | Domain-scoped filter rules |

---

## CLI (Future)

CinderBlock currently has no CLI. All configuration is done through `ember.toml` and the dashboard.

Future versions may expose CLI commands for headless configuration:

```bash
# Not yet implemented
cinderblock status
cinderblock update
cinderblock enable-list easylist
```
