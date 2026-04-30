---
sidebar_position: 1
title: Running aether-ops
---

# Running aether-ops

This section covers operating an [aether-ops](../tools/aether-ops.md) install — installing the daemon directly, configuring it, managing nodes, deploying 5G Core and RAN components, monitoring, and troubleshooting.

If you don't yet have aether-ops running, you have two paths:

- **Bootstrap a fresh Ubuntu host offline** with [aether-ops-bootstrap](../tools/aether-ops-bootstrap.md). Continue in [Bootstrapping → Quick start](../bootstrapping/quick-start.md). This installs RKE2 and aether-ops together from an offline bundle.
- **Install aether-ops directly** on a host that has internet access and the prerequisites in place. Continue in [Quick start](./quick-start.md) on this section. RKE2 is provisioned through the API rather than baked in.

## Pages in this section

| Page | What it covers |
|---|---|
| [Quick start](./quick-start.md) | First deployment via the API: preflight, Kubernetes, 5G Core |
| [Installation](./installation.md) | Installing the aether-ops service via `install.sh` |
| [Verifying](./verifying.md) | Confirming the install succeeded |
| [Next steps](./next-steps.md) | Where to go after the first deployment |
| [Configuration](./configuration.md) | Editing OnRamp variables, profiles, tunings |
| [Managing nodes](./node-management.md) | Adding remote nodes, assigning roles, multi-node clusters |
| [Deploying components](./deploying-components.md) | Deploying SD-Core, RAN (srsRAN, UERANSIM, OAI, gNBSim), AMP, SD-RAN, RIC |
| [Bulk deployment](./bulk-deployment.md) | Batch operations across many components |
| [Monitoring](./monitoring.md) | Host metrics — CPU, memory, disk, network |
| [Security](./security.md) | TLS, API token authentication, hardening |
| [Running with Docker](./docker.md) | Containerized aether-ops |
| [Deploying to Kubernetes](./kubernetes.md) | Running aether-ops itself on a K8s cluster |
| [OnRamp repository](./repository.md) | Managing the cloned aether-onramp tree |
| [MCP server](./mcp.md) | Model Context Protocol integration |
| [Troubleshooting](./troubleshooting.md) | Common issues with deployments, tasks, and connectivity |

## Reference material

- [aether-ops CLI reference](../reference/aether-ops/cli.md) — every flag and environment variable
- [API overview](../reference/aether-ops/api-overview.md) — base URL, authentication, error format
- [Configuration reference](../reference/aether-ops/configuration.md) — OnRamp configuration schema
- [Components reference](../reference/aether-ops/components.md) — every deployable component and its actions

## Concepts

If you want to understand aether-ops' internals before changing anything:

- [Architecture](../concepts/architecture.md)
- [Providers](../concepts/providers.md)
- [Tasks and async execution](../concepts/tasks.md)
- [Deployment state](../concepts/deployment-state.md)
