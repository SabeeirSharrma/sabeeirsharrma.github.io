---
title: Installation
description: How to build and install CinderBlock.
order: 2
---

# Installation

CinderBlock ships with Ember Browser. You do not need to install it separately.

## Building from Source

### Prerequisites

- Node.js >= 22
- npm >= 11
- Make
- Python 3 (for build scripts)
- Bash

### Build Steps

```bash
git clone https://github.com/SabeeirSharrma/CinderBlock.git
cd CinderBlock
npm install
```

#### Chromium

```bash
make chromium
```

Output: `dist/build/uBlock0.chromium/` (unpacked extension)

#### Firefox

```bash
make firefox
```

Output: `dist/build/uBlock0.firefox/` (unpacked extension) and `dist/build/uBlock0.firefox.xpi`

#### Both

```bash
make all
```

### Loading the Unpacked Extension

#### Chromium

1. Navigate to `chrome://extensions/`
2. Enable **Developer mode**
3. Click **Load unpacked**
4. Select `dist/build/uBlock0.chromium/`

#### Firefox

1. Navigate to `about:debugging#/runtime/this-firefox`
2. Click **Load Temporary Add-on...**
3. Select `dist/build/uBlock0.firefox/manifest.json`

For permanent installation on Firefox, use the `.xpi` file:

```bash
# Requires xpinstall.signatures.required = false in about:config
drag dist/build/uBlock0.firefox.xpi into Firefox
```

## Linting

```bash
npm run lint
```

## Cleaning

```bash
make clean         # remove build output
make cleanassets   # remove cached filter lists
```
