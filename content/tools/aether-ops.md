---
sidebar_position: 2
title: aether-ops
---

# aether-ops

`aether-ops` is the long-running management service for an Aether deployment. It is a REST API backend, an embedded web UI, and a thin orchestration layer over the [Aether OnRamp](https://github.com/opennetworkinglab/aether-onramp) Ansible toolchain.

Operators use aether-ops to deploy and manage:

- **Kubernetes clusters** — RKE2 cluster provisioning and lifecycle
- **5G Core (SD-Core)** — subscriber authentication, session management, data plane routing
- **Radio Access Network (RAN)** — gNBs via srsRAN, UERANSIM, OpenAirInterface, and gNBSim
- **Supporting components** — Aether Management Platform, SD-RAN, O-RAN SC RIC, Non-3GPP Interworking Function
- **Host system monitoring** — CPU, memory, disk, and network metrics

All operations are exposed as REST/JSON endpoints under `http://host:8186/api/v1/`. The same data is rendered in an embedded React SPA (`aether-ops-web`) that ships in the same binary.

## How it's structured

aether-ops is built around a **provider framework**. Each major area of functionality (`meta`, `system`, `nodes`, `onramp`, `preflight`, `tunings`) is a self-contained provider with its own endpoints, data model, and lifecycle. New capabilities are added as new providers without changing existing ones.

For the architectural details, see [Concepts → Architecture](../concepts/architecture) and [Concepts → Providers](../concepts/providers).

## How to run it

Two paths, depending on what host you're starting from:

- **A fresh Ubuntu host with no platform yet** — use [aether-ops-bootstrap](./aether-ops-bootstrap) to install RKE2 and aether-ops together in one offline step. Continue in [Bootstrapping → Quick start](../bootstrapping/quick-start).
- **An existing host that already has the OS prerequisites** — install aether-ops directly via the install script. Continue in [Running aether-ops → Quick start](../running-aether-ops/quick-start).

Once aether-ops is running, day-2 operations — adding nodes, deploying components, configuring profiles, monitoring — all live in [Running aether-ops](../running-aether-ops/index.md).

## Reference material

- [CLI reference](../reference/aether-ops/cli) — every flag, every environment variable
- [API overview](../reference/aether-ops/api-overview) — base URL, authentication, error format
- [Configuration reference](../reference/aether-ops/configuration) — OnRamp variables, profiles, tunings
- [Components reference](../reference/aether-ops/components) — every component aether-ops can deploy

## Source

- Daemon: [`aether-gui/aether-ops`](https://github.com/aether-gui/aether-ops)
- Embedded SPA: [`aether-gui/aether-ops-web`](https://github.com/aether-gui/aether-ops-web) (vendored in the daemon binary)
