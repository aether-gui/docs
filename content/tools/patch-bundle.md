---
sidebar_position: 5
title: patch-bundle
---

# patch-bundle

`patch-bundle` rewrites files inside an already-built `bundle.tar.zst` without re-running a full [build-bundle](./build-bundle). It's the fast path for operators who need to swap a few configuration files — typically aether-onramp templates like SDR parameters, ZMQ ports, or SD-Core values — and don't want to wait for a full rebuild that re-pulls images and `.deb` packages.

For builds that need to be fully reproducible from a checked-in spec, prefer the `onramp.patches:` block in `bundle.yaml` and a normal `make bundle`. patch-bundle is for ad-hoc, post-build edits.

## What it does

For one invocation:

1. Extracts the input bundle to a temporary directory.
2. Applies the requested file replacements (either `--replace` flags or a `patches.yaml` manifest).
3. Recomputes per-file SHA256s for the onramp tree and updates the manifest, including `tree_sha256`.
4. Re-archives to the output path atomically.
5. Writes a fresh `<out>.sha256` sidecar.

The `tree_sha256` change is what makes the launcher detect the patched bundle as distinct from the unpatched one — without it, a host already at the upstream onramp commit would skip the re-extract on the next `aether-ops-bootstrap upgrade`.

A patched bundle is functionally identical to one built fresh with the equivalent `onramp.patches:` block: identical `tree_sha256`, identical per-file hashes, identical content on disk.

## Typical use

```bash
./dist/patch-bundle \
  --in  dist/bundle.tar.zst \
  --out dist/bundle-patched.tar.zst \
  --replace ocudu/roles/uEsimulator/templates/ue_zmq.conf=./ue_zmq.conf
```

For larger sets, point `--patches` at a YAML file using the same schema as `onramp.patches:` in the bundle spec.

## Limitations

- Only the bundled onramp tree is patchable in v1. Patching helm-charts, debs, images, or other manifest components is not supported.
- Whole-file replace only. Partial edits via diff/regex are out of scope; they introduce brittleness against upstream onramp drift.

## Where to go next

- [Building a bundle → Patching a bundle](../building-a-bundle/patching) — the full guide to operator-driven patches
- [Reference → patch-bundle CLI](../reference/patch-bundle/cli) — flags and exit codes

## Source

Lives in [`aether-gui/aether-ops-bootstrap`](https://github.com/aether-gui/aether-ops-bootstrap) under `cmd/patch-bundle/`.
