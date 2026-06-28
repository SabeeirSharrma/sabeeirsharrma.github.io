---
title: Introduction
description: Overview of the CPAC package trust layer.
order: 1
---

# cpac-trust-db Documentation

> *Community-maintained trust data for CPAC.*

> **The Cinder Project** — *"Burn the Blind Spots"*

---

## What is cpac-trust-db?

`cpac-trust-db` is the trust data backend for CPAC. It stores:

1. **PKGBUILD snapshots** — anonymized, crowdsourced snapshots submitted by CPAC clients, used to detect divergence from known-good package states
2. **Advisories** — maintainer-curated records of known malicious, compromised, or suspicious packages (e.g. Atomic Arch-style hijacks)
3. **Advisory history** — append-only version history of advisory changes (never overwritten)
4. **AI analysis cache** — on-demand AI analysis results cached for 3 hours

---

## Key Features

- **Advisory lifecycle** — versioned advisories with append-only history
- **Reputation system** — strike tracking, trust tiers (Trusted/Standard/Probation/Suspended)
- **Weekly email reports** — staggered by account creation date
- **Admin panel** — account management, advisory review, volunteer stats
- **AUR proxy** — CORS fix for browser-based PKGBUILD comparison
- **Suspicious pattern detection** — 15+ patterns including npm/bun pipe-to-shell

---

## Documentation

- [Architecture](architecture.md) — System design and tech stack
- [API Endpoints](api.md) — REST API reference
- [Staleness Check](staleness-check.md) — How CPAC detects stale data
- [Local Cache](local-cache.md) — Local storage structure
- [Advisories](advisories.md) — Advisory data format and trust impact
- [Snapshots](snapshots.md) — Snapshot data format and submission pipeline
- [GitHub Actions](github-actions.md) — Sync pipeline (TOML → Supabase)
- [Auth Model](auth.md) — Authentication and authorization
- [Governance](governance.md) — Who can submit what
- [Roadmap](roadmap.md) — Planned features
- [Related Projects](related.md) — Ecosystem overview

---

*Part of The Cinder Project — github.com/SabeeirSharrma/cpac-trust-db*
