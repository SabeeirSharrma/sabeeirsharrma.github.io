---
title: Introduction
description: Overview of CinderBlock, the content blocking engine for Ember Browser.
order: 1
---

# CinderBlock

**Content blocking engine for Ember Browser** -- forked from [uBlock Origin](https://github.com/gorhill/uBlock).

CinderBlock is Ember's built-in content blocking engine. It is not an extension -- it is a first-class component of Ember, compiled as part of the browser and deeply integrated into the Ember Shell.

## What is CinderBlock?

CinderBlock blocks ads, trackers, coin miners, popups, annoyances, malware sites, and more. It inherits uBlock Origin's core architecture: a highly efficient network request filter, a cosmetic filter engine, a scriptlet injection system, and a full dashboard UI.

CinderBlock is not distributed separately. It ships with Ember and updates with Ember via CPAC. Filter lists are the only thing that update independently, fetched as plaintext from their source URLs on a configurable schedule.

## Philosophy

- The **user decides** what web content is acceptable in their browser
- CinderBlock is a **content blocker**, not a gatekeeper -- the user always has the final say
- Filter matching is fast, efficient, and transparent
- No external service dependencies, no cloud sync, no telemetry
- Ships with curated defaults that work out of the box

## Features

### Network Request Filtering

Intercepts all HTTP/HTTPS requests made by the browser. Each request is matched against compiled filter lists using a highly efficient trie-based matching algorithm. Blocked requests are cancelled before they reach the network.

Supports all standard filter syntax: URL pattern matching, domain anchors, path filters, query string filters, exception rules, option modifiers, and hosts file format.

### Cosmetic Filtering

CSS-based element hiding applied after page load. Removes ad containers, cookie consent banners, newsletter popups, notification permission prompts, chat widgets, floating overlays, and "subscribe to continue reading" overlays.

Supports generic cosmetic filters, domain-specific filters, extended CSS selectors (`:has()`, `:not()`, `:matches-css()`), and procedural cosmetic filters.

### Scriptlet Injection

JavaScript snippets injected into page context to neutralize behaviors that CSS cannot reach: anti-adblock detection scripts, tracking calls embedded in page JS, cookie consent wall JS, and fingerprinting scripts.

### Dashboard

Full dashboard UI accessible via toolbar button, keyboard shortcut (`Ctrl+Shift+B`, remappable), or `ember://cinderblock`. Sections include filter lists, custom filters, per-site rules, trusted sites, and advanced settings.

### Element Picker

Point-and-click tool to generate cosmetic filter rules for any page element. Preview what will be hidden before committing, edit the generated rule, and save to custom filters.

### Network Logger

Real-time log of all network requests made by the current tab. Shows request URL, type, origin domain, block/allow status, and which filter rule matched.

### Dynamic Filtering

Per-domain request type matrix for advanced users. Allows fine-grained control such as blocking all third-party scripts globally while allowing them on specific trusted domains.

## Default Filter Lists

CinderBlock ships with a curated default set:

| List | Category | Default |
|---|---|---|
| AdGuard Base | Ads | on |
| AdGuard Tracking Protection | Tracking | on |
| AdGuard Annoyances | Cookie banners, popups | on |
| EasyList | Ads | on |
| EasyPrivacy | Tracking | on |
| Peter Lowe's Ad and Tracking | Ads + Tracking | on |
| uBlock Origin Filters | Ads | on |
| uBlock Annoyances | Annoyances | on |
| Dan Pollock's hosts | Malware, spam | on |
| PhishTank | Phishing domains | on |
| HAGEZI Multi Pro | Ads + Tracking + Malware | on |
| StevenBlack Adware + Malware | Adware, malware | on |
| oisd big | Comprehensive | on |
| StevenBlack Gambling | Gambling domains | off |
| Adult content | Adult content | off |

See [Filter Lists](filter-lists.md) for full details.

## Related Projects

| Project | Role |
| --- | --- |
| [Ember Browser](https://github.com/SabeeirSharrma/Ember) | The browser that ships CinderBlock |
| [CPAC](https://github.com/SabeeirSharrma/cpac) | Package trust layer for Ember OS |
| [uBlock Origin](https://github.com/gorhill/uBlock) | Upstream project |

## Made By

**Developer/Maintainer:** [Sabeeir Sharrma](https://github.com/SabeeirSharrma)

**Made under [The Cinder Project](https://thecinderproject.qd.je/)** -- *Making a safer internet*

## License

GPL-3.0 (inherited from uBlock Origin upstream)

## Attribution

CinderBlock is based on [uBlock Origin](https://github.com/gorhill/uBlock) by Raymond Hill and contributors. uBlock Origin is licensed under the GNU General Public License v3.0.
