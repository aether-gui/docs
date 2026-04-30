---
sidebar_position: 1
title: Bootstrapping a system
---

# Bootstrapping a system

This section covers using [aether-ops-bootstrap](../tools/aether-ops-bootstrap.md) to take a fresh Ubuntu host and produce a running [aether-ops](../tools/aether-ops.md) management plane on top of RKE2 — fully offline.

## When to bootstrap

You bootstrap once per host that needs to act as part of an Aether deployment. Today's 0.1.x line is single-node — one bootstrap'd host runs both aether-ops and the RKE2 cluster underneath it. Multi-node and per-role bundles are on the [roadmap](../developer/multi-node-design.md).

You do **not** bootstrap if:

- aether-ops is already running on the host. Use `upgrade` or `repair` instead.
- The host has internet access and you'd rather install aether-ops directly via the install script (no offline bundle, no RKE2 management). See [Running aether-ops → Installation](../running-aether-ops/installation.md).

## Prerequisites

- A freshly installed Ubuntu Server **22.04, 24.04, or 26.04** (when released). No PPAs, no custom images.
- `sudo` (or root) on the target host.
- The two artifacts on the host: the `aether-ops-bootstrap` launcher binary and a `bundle.tar.zst` payload.

How the artifacts get to the host is up to you — sneakernet, internal artifact store, file server. The launcher itself never makes a network request, so it does not matter whether the host has internet access.

## Pages in this section

| Page | What it covers |
|---|---|
| [Quick start](./quick-start.md) | Step-by-step: artifacts → `install` → reachable aether-ops, in 5–15 minutes |
| [Verifying the install](./verifying.md) | Post-install checklist — state file, systemd units, RKE2 health |
| [Complete guide](./complete-guide.md) | Every component in install order, every file the launcher touches |
| [Upgrades and repair](./upgrades-and-repair.md) | When to use `install`, `upgrade`, `repair`, or `check` — and what each does |
| [Troubleshooting](./troubleshooting.md) | Component-by-component fault tree |
| [Next steps](./next-steps.md) | What to do once the bootstrap is finished |

## What this section is not

- **Not a tutorial for deploying 5G workloads.** Once aether-ops is running, deploying SD-Core and RAN is aether-ops' job. See [Tutorials → Deploy SD-Core with srsRAN](../tutorials/sd-core-srsran.md).
- **Not a guide to building bundles.** That's [Building a bundle](../building-a-bundle/index.md).
