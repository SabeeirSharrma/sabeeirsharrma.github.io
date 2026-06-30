---
title: Configuration
description: Configuring CinderBlock via ember.toml.
order: 3
---

# Configuration

CinderBlock reads its initial state from the `[blocking]` section of `ember.toml`. Per-site rules, custom filters, and dynamic filtering rules are stored separately in local files.

## ember.toml

```toml
[blocking]
enabled = true
update_interval_hours = 24

# List overrides (optional -- defaults apply if not specified)
[blocking.lists]
adguard_annoyances = true
stevenblack_gambling = false
adult_content = false
```

### Options

| Key | Type | Default | Description |
|---|---|---|---|
| `enabled` | boolean | `true` | Enable or disable content blocking globally |
| `update_interval_hours` | integer | `24` | How often filter lists are updated. Set to `0` to disable auto-update |

### List Overrides

Individual filter lists can be toggled under `[blocking.lists]`. The key names correspond to the list IDs in `assets/assets.json`. Only lists that exist in the registry can be overridden.

| Key | List | Default |
|---|---|---|
| `adguard_annoyances` | AdGuard Annoyances | `true` |
| `stevenblack_gambling` | StevenBlack Gambling | `false` |
| `adult_content` | Adult content | `false` |

Any list in the registry can be toggled by adding its key under `[blocking.lists]`.

## Local Storage

Per-site rules, custom filters, and dynamic filtering rules are stored at:

```
~/.config/ember/cinderblock/
```

| File | Contents |
|---|---|
| `rules.txt` | User-authored custom filter rules (My Filters) |
| `per-site.json` | Per-site rule overrides (whitelist, cosmetic filtering toggles) |
| `dynamic.json` | Dynamic filtering matrix |
| `trusted.txt` | Whitelisted domains |

These files are human-readable and version-controllable.

## Keyboard Shortcuts

| Action | Default Shortcut | Remappable |
|---|---|---|
| Open dashboard | `Ctrl+Shift+B` | Yes, in `ember.toml` |
| Element picker | `Ctrl+Shift+E` | Yes, in `ember.toml` |
| Element zapper | `Ctrl+Shift+X` | Yes, in `ember.toml` |

## Ember Shell Integration

CinderBlock integrates with Ember Shell through:

- **Toolbar button** -- native Shell component (replaces extension popup)
- **Dashboard** -- themed to match the active Ember theme
- **Config bridge** -- reads `[blocking]` from `ember.toml` on launch
- **Update system** -- filter lists update on the schedule defined in config; CinderBlock itself updates via CPAC with Ember
