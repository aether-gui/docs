---
sidebar_position: 4
title: build-bundle
---

# build-bundle

`build-bundle` is the offline-bundle builder. It reads a declarative `bundle.yaml` spec and produces a `bundle.tar.zst` — the airgap-ready payload that [aether-ops-bootstrap](./aether-ops-bootstrap) installs onto target hosts.

build-bundle ships in the same repository as aether-ops-bootstrap and is the canonical way to produce bundles. The launcher itself never fetches anything from the network — every byte that ends up on a target host originates from build-bundle on the build machine.

## What it does

For one invocation:

1. Resolves the transitive `.deb` closure from Ubuntu's `Packages.gz` indexes for each requested suite × architecture pair.
2. Downloads every `.deb`, RKE2 release artifact, Helm release, aether-ops binary, and aether-onramp git tree referenced by the spec.
3. Verifies SHA256 against authoritative sources (Ubuntu Packages index, GitHub release checksums, `get.helm.sh`).
4. Writes or verifies `bundle.lock.json` — the lockfile that pins exact `.deb` versions and hashes for reproducibility.
5. Generates `manifest.json` describing the bundle contents.
6. Stages everything into a tree and packs it with `tar + zstd`.
7. Emits `dist/bundle.tar.zst` plus a `bundle.tar.zst.sha256` sidecar.

## Typical use

```bash
make bundle
# or directly:
./dist/build-bundle --spec specs/bundle.yaml --output dist/bundle.tar.zst
```

build-bundle also accepts a directory of specs (`--spec specs/`) for producing per-role bundles in one invocation. See [Building a bundle → Quick start](../building-a-bundle/quick-start).

## Two artifacts, two version schemes

A bundle is **data**; the launcher is **code**. They evolve at different rates:

- The launcher uses **semver** (`v0.1.43`) and changes when launcher logic changes.
- The bundle uses **calver** (`2026.04.1`) and changes whenever any upstream pin moves.

Pairing rules and the manifest schema that ties them together are in [Building a bundle → Versioning](../building-a-bundle/versioning).

## Where to go next

- [Building a bundle → Quick start](../building-a-bundle/quick-start) — the shortest path from `bundle.yaml` to `bundle.tar.zst`
- [Building a bundle → bundle.yaml reference](../building-a-bundle/bundle-yaml) — every spec field
- [Building a bundle → Lockfile](../building-a-bundle/lockfile) — how `bundle.lock.json` works
- [Building a bundle → Manifest](../building-a-bundle/manifest) — what's inside the produced bundle
- [Reference → build-bundle CLI](../reference/build-bundle/cli) — flags and exit codes

## Source

Lives in [`aether-gui/aether-ops-bootstrap`](https://github.com/aether-gui/aether-ops-bootstrap) under `cmd/build-bundle/`.
