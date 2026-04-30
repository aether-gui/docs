---
sidebar_position: 3
title: aether-ops-bootstrap
---

# aether-ops-bootstrap

`aether-ops-bootstrap` is a one-shot installer that takes a freshly installed Ubuntu Server host and produces a running [aether-ops](./aether-ops) management plane on top of RKE2 — without touching the network.

It exists to solve a specific, unglamorous problem: putting a working Kubernetes-based management plane onto a machine that has no internet access, no pre-installed dependencies beyond Ubuntu's essentials, and no operator with the time to hand-install each piece.

## Where it fits

aether-ops-bootstrap owns the **platform layer** of an Aether deployment — RKE2, aether-ops, and the OS-level prerequisites those need (`git`, `make`, `ansible`, SSH/sudo configuration). It does **not** touch the cellular layer; that is aether-ops' job after handoff.

See [Concepts → Three-layer model](../concepts/bootstrap-three-layer-model) for how the layers fit together.

## What it produces and what it consumes

aether-ops-bootstrap is **two artifacts**, released together but versioned independently:

- A **launcher binary** (`aether-ops-bootstrap`). Statically linked Go, single file, 10–30 MB. Versioned with semver (e.g. `v0.1.43`).
- An **offline bundle** (`bundle.tar.zst`). Opaque tarball containing every `.deb`, every RKE2 artifact, the Helm binary, the aether-ops binary, every template the launcher needs, plus a `manifest.json` describing the contents. Versioned with calver (e.g. `2026.04.1`).

The bundle is produced by [build-bundle](./build-bundle); the launcher consumes it.

## Typical use

```bash
sudo ./aether-ops-bootstrap install --bundle bundle.tar.zst
```

After 5–15 minutes the launcher exits cleanly. RKE2 is running, aether-ops is reachable on `http://localhost:8186`, and the launcher writes a state file at `/var/lib/aether-ops-bootstrap/state.json` recording what was installed. The launcher never runs again on that host except to **upgrade** (apply a newer bundle) or **repair** (fix drift).

## Designed-in rules

A few load-bearing properties show up everywhere in the docs:

- **No network, ever.** The launcher has no HTTP client for fetching artifacts; everything it needs is in the bundle.
- **Idempotency by default.** Running the same bundle twice is a no-op.
- **Fail preflight before touching anything.** Unsupported Ubuntu, missing root, schema mismatch — these errors happen *before* any component runs.
- **State is authoritative.** The launcher believes the state file over what it sees on disk; use `repair` to reconcile drift.

## Where to go next

- [Bootstrapping → Quick start](../bootstrapping/quick-start) — the shortest path from "I have artifacts" to "aether-ops is running"
- [Bootstrapping → Complete guide](../bootstrapping/complete-guide) — every component, every file, every flag
- [Reference → aether-ops-bootstrap CLI](../reference/aether-ops-bootstrap/cli) — the full command and flag reference
- [Developer → aether-ops-bootstrap design](../developer/aether-ops-bootstrap-design) — the design-of-record

## Source

[`aether-gui/aether-ops-bootstrap`](https://github.com/aether-gui/aether-ops-bootstrap)
