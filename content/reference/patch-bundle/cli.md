---
sidebar_position: 1
title: patch-bundle CLI
---

# patch-bundle CLI reference

Flags and behavior of the [patch-bundle](../../tools/patch-bundle) tool. For the full operator workflow, see [Building a bundle → Patching a bundle](../../building-a-bundle/patching).

## Invocation

```
patch-bundle --in <path> --out <path> [--replace SPEC]... [--patches <path>]
```

`--in` and `--out` are required. At least one of `--replace` or `--patches` is required.

## Inline overrides

```bash
./dist/patch-bundle \
  --in  dist/bundle.tar.zst \
  --out dist/bundle-patched.tar.zst \
  --replace ocudu/roles/uEsimulator/templates/ue_zmq.conf=./ue_zmq.conf
```

Each `--replace` is `<onramp-rel-path>=<local-file>`:

- The left-hand side is rooted at the bundled onramp tree. Slashes only; no `..` segments.
- The right-hand side is a path on the build host. Both absolute and CWD-relative paths work.

`--replace` is repeatable. The target file must already exist in the bundle — patch-bundle will not implicitly add files.

## Patches manifest

For larger sets, point `--patches` at a YAML file:

```yaml
# patches.yaml
schema_version: 1
patches:
  - target: ocudu/roles/uEsimulator/templates/ue_zmq.conf
    source: ./ue_zmq.conf
  - target: ocudu/roles/gNB/templates/gnb_zmq.yaml
    content: |
      zmq_port: 5555
```

```bash
./dist/patch-bundle \
  --in  dist/bundle.tar.zst \
  --patches patches.yaml \
  --out dist/bundle-patched.tar.zst
```

`source:` paths are resolved relative to the patches file, not the CWD.

## Flags

| Flag | Required | Description |
|---|---|---|
| `--in <path>` | yes | Input bundle. Read-only. |
| `--out <path>` | conditional | Output path for the patched bundle. Cannot equal `--in`. Required unless `--output-dir` is given. |
| `--output-dir <path>` | conditional | Write the output to this directory using a deterministic filename. Mutually exclusive with `--out`. |
| `--replace <KEY=VALUE>` | no (repeatable) | Inline file replacement. KEY is the onramp-relative target; VALUE is the local source file. |
| `--patches <path>` | no | Path to a `patches.yaml` manifest. Same schema as `onramp.patches:` in `bundle.yaml`. |

At least one of `--replace` or `--patches` must be specified.

## Output and integrity

patch-bundle:

1. Extracts the input bundle to a temporary directory.
2. Applies the requested file replacements.
3. Recomputes per-file SHA256s for the onramp tree and updates the manifest, including `tree_sha256`.
4. Re-archives to `<out>.tmp` and renames atomically to `<out>` on success.
5. Writes a fresh `<out>.sha256` sidecar.

The manifest's `tree_sha256` change is what makes the launcher detect the patched bundle as distinct from the unpatched one.

## Limitations

- Only the bundled onramp tree is patchable in v1.
- Whole-file replace only — no diff or regex edits.
- Will not overwrite the input file in place.

## Exit codes

- `0` — patched bundle written successfully.
- non-zero — failure. The staged output is removed; no partial output is left behind.

## Source

[`cmd/patch-bundle`](https://github.com/aether-gui/aether-ops-bootstrap/tree/main/cmd/patch-bundle) in the aether-ops-bootstrap repository.
