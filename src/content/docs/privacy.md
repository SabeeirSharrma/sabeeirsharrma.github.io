---
title: Privacy Policy
description: How The Cinder Project handles your data.
order: 2
---

# Privacy Policy

**The Cinder Project**
*Effective Date: June 27, 2025*
*Last Updated: June 27, 2025*

---

## 1. Overview

The Cinder Project is committed to being transparent about what data is collected, by whom, and why. We collect as little as possible — most of what is described below is passive, third-party exposure inherent to any website, not active data collection by us.

This policy applies to:

- The Cinder Project website (`thecinderproject.qd.je` and subdomains)
- **CPAC** — the Cinder Package Auditing CLI
- **CPAC Trust DB** — the crowd-sourced package trust database
- **CinderOS** and other projects under The Cinder Project umbrella

---

## 2. What We Collect

### 2.1 Website Analytics

We use **Google Search Console** (not Google Analytics) for basic site performance data. This means we receive aggregated click and impression data from Google Search — we do not receive individual user identifiers, browsing sessions, or IP addresses through this channel.

### 2.2 Third-Party Resource Loading (Passive Exposure)

When you visit the website, your browser loads resources from the following external services. Each of these receives standard HTTP request metadata (IP address, User-Agent, Referrer) as a byproduct of the request:

| Service | Domain | Pages Affected | Purpose |
|---|---|---|---|
| Google Fonts | `fonts.googleapis.com` | All pages | Font loading |
| Unpkg CDN | `unpkg.com` | All pages | Lucide icon library |
| jsDelivr CDN | `cdn.jsdelivr.net` | Donate page only | QR code library |
| Supabase | `*.supabase.co` | CPAC Trust DB viewer | Read-only DB access |

**The most significant exposure is Google Fonts**, which logs your IP address and User-Agent on every page load. This is standard behaviour for any site using Google Fonts. We do not control what Google does with this data — please refer to [Google's Privacy Policy](https://policies.google.com/privacy).

The other CDN requests (Unpkg, jsDelivr) involve the same standard HTTP metadata any external resource requires, and are one-time loads.

### 2.3 CPAC Trust DB Contributions

CPAC Trust DB is a crowd-sourced database of package trust data. If you contribute to the database, the following is collected:

- **Anonymized PKGBUILDs** — identifying authorship information is stripped
- **Package hashes** — cryptographic hashes of packages you submit for trust auditing

No account, email address, or personal identifier is required or collected to contribute.

### 2.4 CPAC Install Scripts

CPAC install scripts check whether build dependencies are already present on your machine before proceeding with a build. This check is:

- Performed **entirely locally** on your machine
- **Never transmitted** to The Cinder Project or any third party

No telemetry, diagnostics, or usage data is sent back from install scripts.

### 2.5 Donate Page

The donate page includes an amount input field. This value is processed **entirely client-side** and is never sent to any server operated by The Cinder Project.

---

## 3. What We Do Not Collect

We do not collect:

- Names, email addresses, or account credentials (no accounts exist on our platform)
- Passwords or authentication tokens
- Payment information
- Device fingerprints or tracking cookies
- Crash reports or telemetry from CPAC or CinderOS
- Location data beyond what is inherent in an IP address

---

## 4. Cookies

The Cinder Project website does not set any first-party cookies. Third-party services (Google Fonts, CDNs) may set cookies according to their own policies, which we do not control.

---

## 5. Data Sharing

We do not sell, rent, or trade any data. We do not share data with advertisers or analytics brokers.

Data may be shared only in the following limited circumstances:

- **As required by law** — if we receive a valid legal order from a court or government authority in India
- **To protect rights or safety** — if disclosure is necessary to prevent harm or fraud

---

## 6. Data Retention

Since we do not collect personal data directly, there is nothing for us to retain or delete on your behalf.

Anonymized package data contributed to CPAC Trust DB may be retained indefinitely as part of the public trust record. This data contains no personal identifiers.

---

## 7. Your Rights

Under applicable Indian law (including the Digital Personal Data Protection Act, 2023), you may have rights regarding personal data that relates to you. Since we do not collect personal data directly, most of these rights will apply to the third-party services listed in Section 2.2 rather than to us.

If you have a specific concern, you can reach us via the contact method listed on the website or by opening an issue on the relevant project repository.

---

## 8. Children's Privacy

The Services are not directed at children under the age of 13. We do not knowingly collect data from children. If you believe a child has submitted data through our Services, please contact us and we will take appropriate action.

---

## 9. Changes to This Policy

We may update this policy from time to time. When we do, the "Last Updated" date at the top will be revised. We encourage you to review this policy periodically.

---

## 10. Contact

For privacy-related questions or concerns, please open an issue on the relevant project repository or use the contact information on the website.

---

*The Cinder Project collects as little as possible. We believe your data is yours.*
