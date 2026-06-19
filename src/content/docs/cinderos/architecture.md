---
title: Architecture
description: The design of CinderOS.
order: 2
---

# Architecture

CinderOS utilizes an immutable base filesystem.

## Immutable Core

The system is built as a single image. Any modifications require a new image to be built and deployed or installed via CPAC overlays.

## Init System

To be determined during Phase 2.
