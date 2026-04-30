---
sidebar_position: 1
title: build-bundle CLI
---

# build-bundle CLI reference

Flags and behavior of the [build-bundle](../../tools/build-bundle) tool. The canonical way to invoke it is via the `make bundle` target in [`aether-gui/aether-ops-bootstrap`](https://github.com/aether-gui/aether-ops-bootstrap), but it can also be run directly.

## Invocation

```
build-bundle --spec <path> --output <path> [flags]
```

`--spec` and `--output` are both required.

## Single-spec mode

```bash
./dist/build-bundle \
  --spec specs/bundle.yaml \
  --output dist/bundle.tar.zst
```

Reads one `bundle.yaml`, produces one `bundle.tar.zst` plus a `.sha256` sidecar at the requested path.

## Multi-spec (directory) mode

```bash
./dist/build-bundle \
  --spec specs/ \
  --output dist/
```

When `--spec` points at a directory, every `.yaml` file in the directory is treated as a separate bundle spec. Each is built into its own bundle named from the spec filename — for example, `specs/core.yaml` becomes `dist/core.tar.zst`.

## Flags

| Flag | Required | Description |
|---|---|---|
| `--spec <path>` | yes | Path to a `bundle.yaml` file or a directory of them. |
| `--output <path>` | yes | Output `.tar.zst` path (single-spec mode) or output directory (multi-spec mode). |

A `--regenerate-lock` convenience flag is planned. For now, regenerate by deleting `bundle.lock.json` and re-running.

## What it does

For each spec, in order:

1. Resolves `.deb` transitive dependencies from Ubuntu's `Packages.gz` indexes (main + universe) for each `(suite × architecture)` pair declared in the spec.
2. Downloads each `.deb` and verifies SHA256 against the index.
3. Downloads the requested RKE2 release artifacts and verifies SHA256 against `sha256sum-<arch>.txt`.
4. Downloads Helm from `get.helm.sh` and verifies SHA256 against the published checksum file.
5. Acquires aether-ops from one of: a local file (`source: ./...`), a GitHub release, or a from-source build (`ref:` / `repo:`).
6. Clones the aether-onramp Ansible toolchain at the requested ref. Applies any `onramp.patches:` overrides.
7. Pulls and pre-stages container images for RKE2's airgap image loader.
8. Writes or compares `bundle.lock.json` (see [Lockfile](../../building-a-bundle/lockfile)).
9. Writes `manifest.json` describing the bundle contents.
10. Stages everything into a tree and packs it with `tar + zstd`.
11. Emits the final `bundle.tar.zst` and a `.sha256` sidecar.

See [Building a bundle → Quick start](../../building-a-bundle/quick-start) for the full workflow including Makefile targets.

## What it refuses to do

- **Download anything at launcher runtime.** All fetching happens here, on the build machine.
- **Hide lockfile drift.** If the lockfile exists and upstream `.deb` resolution has drifted, build-bundle logs a warning before rewriting it.
- **Publish unverified artifacts.** Every downloaded file is hashed and checked against its authoritative source.

## Exit codes

- `0` — bundle built successfully.
- non-zero — build failed. Stderr contains the cause.

## Source

[`cmd/build-bundle`](https://github.com/aether-gui/aether-ops-bootstrap/tree/main/cmd/build-bundle) in the aether-ops-bootstrap repository.
