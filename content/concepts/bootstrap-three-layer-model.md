---
sidebar_position: 5
title: Three-layer model
---

# The three-layer model

An Aether deployment is structured as a stack of three layers. This vocabulary is used consistently in the docs, the logs, and the code — if you see "platform layer" in a log message, it means the second layer below.

```mermaid
block-beta
    columns 1
    block:cellular["Cellular Layer — UPF, AMF, SMF, NRF …"]
    end
    block:platform["Platform Layer — RKE2 + aether-ops (installed by bootstrap)"]
    end
    block:os["OS Layer — Ubuntu Server 22.04, 24.04, 26.04"]
    end

    cellular --> platform
    platform --> os

    style cellular fill:#f9e2af,stroke:#df8e1d,color:#000
    style platform fill:#89b4fa,stroke:#1d7af3,color:#000
    style os fill:#a6e3a1,stroke:#40a02b,color:#000
```

- **OS layer** — Ubuntu Server, versions 22.04, 24.04, and 26.04 (when released). Kernel, base packages, networking stack. The operator installs this manually. The bootstrap assumes *nothing* about this layer beyond a supported Ubuntu version being present.
- **Platform layer** — RKE2 plus aether-ops, together with the OS-level prerequisites aether-ops needs (`git`, `make`, `ansible`) and the SSH/sudo configuration it relies on. **This is what [aether-ops-bootstrap](../tools/aether-ops-bootstrap) installs.**
- **Cellular layer** — the 4G/5G network functions (UPF, AMF, SMF, NRF, and so on) deployed *by* the platform layer. [aether-ops](../tools/aether-ops) owns this layer entirely; the bootstrap has no involvement.

Relationship verbs we use in the code and logs: the OS layer **hosts** the platform layer; the platform layer **manages** the cellular layer; the cellular layer **contains** network functions.

## Bootstrapping vs. running aether-ops

These are often confused; they are distinct.

| | aether-ops-bootstrap | aether-ops |
|---|---|---|
| **What it is** | A single-shot installer | A long-running service |
| **Runs** | Once per node (plus upgrades/repairs) | Continuously after bootstrap |
| **Owns** | The platform layer | The cellular layer |
| **Needs internet?** | No | Not typically |
| **Manages other nodes?** | No | Yes (via Ansible / its node agent) |

The bootstrap's responsibility begins at "a human just finished the Ubuntu installer" and ends at "aether-ops is running and reachable, with RKE2 underneath it." Everything past that point is aether-ops' job: adding more nodes, deploying SD-Core, distributing SSH keys, operating the cellular workloads.

## Airgap as a behavioural rule

"Airgap" in this project means one concrete rule: **the bootstrap never makes a network request, ever.** Not to `apt-get update`, not to GitHub, not to a container registry. Everything it needs is in the bundle, pre-downloaded and checksummed on the build machine.

Network isolation is a correctness feature, not just a convenience for disconnected environments. It makes bootstrap runs reproducible and auditable: the same bundle on the same Ubuntu version produces the same result.

## Roles (transitional, 0.1.x)

In the 0.1.x line, the launcher accepts an optional `--roles` flag (`mgmt`, `core`, `ran`) that filters which components run. This is a transitional mechanism for exercising multi-node shapes before per-role bundles land. See [Multi-node design](../developer/multi-node-design) for where this is going.

For a single-node install, omit `--roles`; every registered component runs.
