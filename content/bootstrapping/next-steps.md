---
sidebar_position: 7
title: Next steps
---

# Next steps

The bootstrap's job is done. aether-ops is running. What now?

## Hand off to aether-ops

Everything beyond "the platform layer exists" belongs to [aether-ops](../tools/aether-ops.md), not the bootstrap. That includes:

- Adding more nodes (SD-Core, gNBs).
- Deploying 4G/5G workloads onto RKE2 (SD-Core, srsRAN, UERANSIM, etc.).
- Managing SSH keys across the fleet.
- Day-2 operations — upgrades of the workloads, not of RKE2 itself.

Open the aether-ops UI (the bootstrap log printed its URL on success) and continue in [Running aether-ops](../running-aether-ops/index.md) for configuration, node management, and component deployment.

## Try a complete deployment

If you have a single host and want to walk through deploying a full 5G network end-to-end, follow the [Deploy SD-Core with srsRAN tutorial](../tutorials/sd-core-srsran.md). It uses the aether-ops UI to bring up SD-Core (5G Core) and srsRAN (the gNB and UE simulator).

## Keep the artifacts

Keep the launcher binary and the bundle tarball on the node — a future `upgrade` or `repair` will need them. Typical convention:

```bash
sudo mkdir -p /opt/aether/bootstrap
sudo mv aether-ops-bootstrap bundle.tar.zst bundle.tar.zst.sha256 /opt/aether/bootstrap/
```

They are read-only after install; you don't need them on the `$PATH`.

## Understand the launcher more deeply

- [Complete guide](./complete-guide.md) — every component, every file the launcher touches
- [Upgrades and repair](./upgrades-and-repair.md) — `upgrade` vs `repair` vs `check`
- [aether-ops-bootstrap CLI reference](../reference/aether-ops-bootstrap/cli.md) — every subcommand and flag

## Building your own bundle

If you're responsible for producing bundles (different `.deb` pins, internally mirrored sources, a custom aether-ops build), jump to [Building a bundle](../building-a-bundle/index.md).
