---
title: Filter Lists
description: CinderBlock's default filter list set and custom list support.
order: 5
---

# Filter Lists

CinderBlock ships with a curated default filter list set. Users can add custom lists via URL from the dashboard.

## Default Lists

### Enabled by Default

| List | Category | Source |
|---|---|---|
| AdGuard Base | Ads | `https://filters.adtidy.org/extension/ublock/filters/2.txt` |
| AdGuard Tracking Protection | Tracking | `https://filters.adtidy.org/extension/ublock/filters/3.txt` |
| AdGuard Annoyances | Cookie banners, popups | `https://filters.adtidy.org/extension/ublock/filters/14.txt` |
| EasyList | Ads | `https://easylist.to/easylist/easylist.txt` |
| EasyPrivacy | Tracking | `https://easylist.to/easylist/easyprivacy.txt` |
| Peter Lowe's Ad and Tracking | Ads + Tracking | `https://pgl.yoyo.org/adservers/serverlist.php?hostformat=adblockplus` |
| uBlock Origin Filters | Ads | `https://raw.githubusercontent.com/uBlockOrigin/uAssets/master/filters/filters.txt` |
| uBlock Annoyances | Annoyances | `https://raw.githubusercontent.com/uBlockOrigin/uAssets/master/filters/annoyances.txt` |
| Dan Pollock's hosts | Malware, spam | `https://someonewhocares.org/hosts/zero/hosts` |
| PhishTank | Phishing domains | `https://phishtank.org/phishtank.txt` |
| HAGEZI Multi Pro | Ads + Tracking + Malware | `https://raw.githubusercontent.com/hagezi/dns-blocklists/main/adblock/pro.txt` |
| StevenBlack Adware + Malware | Adware, malware | `https://raw.githubusercontent.com/StevenBlack/hosts/master/alternates/adware-malware/hosts` |
| oisd big | Comprehensive | `https://big.oisd.nl` |

### Opt-in Lists (Disabled by Default)

| List | Category | Source |
|---|---|---|
| StevenBlack Gambling | Gambling domains | `https://raw.githubusercontent.com/StevenBlack/hosts/master/alternates/gambling/hosts` |
| Adult content | Adult content | `https://raw.githubusercontent.com/StevenBlack/hosts/master/alternates/porn/hosts` |

Enable via the dashboard or `ember.toml`:

```toml
[blocking.lists]
stevenblack_gambling = true
adult_content = true
```

## Custom Lists

Users can add any custom filter list via URL from the dashboard (Filter Lists section).

### Requirements

- Must be a direct URL to a plaintext file
- Must use uBlock Origin / AdGuard compatible syntax, or hosts file format
- No authentication required (public URL)

### Adding a Custom List

1. Open the CinderBlock dashboard
2. Go to **Filter Lists**
3. Scroll to the import section
4. Paste the URL into the textarea
5. Click **Apply changes**

Custom lists are stored by URL reference, not by content. They are fetched and compiled on the same update schedule as built-in lists.

## List Update Behavior

- **Default interval**: every 24 hours
- **Configurable** in `ember.toml`:

```toml
[blocking]
update_interval_hours = 24   # set to 0 to disable auto-update
```

- Updates are plaintext HTTP GET requests to the list source URL
- No binary downloads, no signed packages, fully transparent
- Lists are compiled into an internal format after fetch
- Manual update available per-list from the dashboard
- CinderBlock itself does **not** auto-update -- it ships with Ember and updates via CPAC

## Filter List Registry

The master registry is at `assets/assets.json`. Each entry specifies:

```json
{
  "list-id": {
    "content": "filters",
    "group": "default",
    "title": "List Name",
    "tags": "ads tracking",
    "contentURL": "https://example.com/list.txt",
    "supportURL": "https://github.com/example"
  }
}
```

| Field | Description |
|---|---|
| `content` | Type of content (`filters` for filter lists) |
| `group` | Category group (`default`, `ads`, `privacy`, `annoyances`, `malware`, `regions`, `custom`) |
| `off` | If `true`, list is disabled by default (opt-in) |
| `title` | Display name in the dashboard |
| `tags` | Space-separated tags for categorization |
| `contentURL` | URL(s) to fetch the list from |
| `cdnURLs` | Alternative CDN URLs for redundancy |
| `supportURL` | Link to the list maintainer's page |
