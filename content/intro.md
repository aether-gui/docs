---
sidebar_position: 1
title: Introduction
---

# Aether Ops documentation

Aether Ops is the tooling suite for deploying and operating [Aether](https://aetherproject.org) — an open platform for private 4G and 5G networks. It packages a deployable 5G Core (SD-Core), a Radio Access Network (RAN) toolchain (srsRAN, UERANSIM, OpenAirInterface, gNBSim), and the Kubernetes (RKE2) and Helm tooling that hosts them, all driven through a single management service with a REST API and a web UI.

These docs cover everything you need to **build**, **bootstrap**, and **operate** an Aether deployment using the Aether Ops toolchain.

## The tools

Aether Ops ships as a small set of focused tools. Each one has a [Tools section](./tools/) page describing what it does and how it fits in.

- **[aether-ops](./tools/aether-ops)** — the long-running management service. Exposes a REST API and a web UI, drives the [Aether OnRamp](https://github.com/opennetworkinglab/aether-onramp) Ansible toolchain to deploy and manage 5G Core, RAN, and supporting components.
- **[aether-ops-bootstrap](./tools/aether-ops-bootstrap)** — a single-shot installer that turns a fresh Ubuntu host into a running aether-ops management plane on top of RKE2, fully offline.
- **[build-bundle](./tools/build-bundle)** — the bundle builder. Reads a declarative `bundle.yaml` spec and produces the offline payload (`bundle.tar.zst`) that aether-ops-bootstrap consumes.
- **[patch-bundle](./tools/patch-bundle)** — the bundle patcher. Modifies an already-built bundle without re-running a full build.

## The flow

A typical end-to-end Aether deployment looks like this:

```
build-bundle (release engineer)
        │
        │  bundle.tar.zst
        ▼
aether-ops-bootstrap (operator, on each node)
        │
        │  RKE2 + aether-ops installed
        ▼
aether-ops (operators + automation)
        │
        │  REST API / web UI
        ▼
SD-Core, RAN, supporting components running on Kubernetes
```

If you are **operating** an existing deployment, you'll spend most of your time in [Running aether-ops](./running-aether-ops/). If you are **standing up** a new deployment, you'll start in [Bootstrapping a system](./bootstrapping/). If you are **producing release artifacts**, you'll work out of [Building a bundle](./building-a-bundle/).

## Where to start

| If you want to… | Go here |
|---|---|
| Bring up your first 5G deployment end-to-end | [Tutorials → Deploy SD-Core with srsRAN](./tutorials/sd-core-srsran) |
| Install and operate aether-ops on an existing host | [Running aether-ops → Quick start](./running-aether-ops/quick-start) |
| Bootstrap a fresh Ubuntu host into a management plane | [Bootstrapping → Quick start](./bootstrapping/quick-start) |
| Build an offline bundle from a `bundle.yaml` spec | [Building a bundle → Quick start](./building-a-bundle/quick-start) |
| Read API or CLI reference material | [Reference](./reference/aether-ops/api-overview) |
| Understand the architecture before changing anything | [Concepts](./concepts/architecture) |
| Contribute code or design changes | [Developer](./developer/README.md) |

## Telco terminology used in these docs

These docs use industry-standard 3GPP / O-RAN terms wherever possible:

- **5G Core / SD-Core** — the mobile core network. "5G Core" is the generic concept; "SD-Core" is the specific open-source implementation Aether deploys.
- **RAN / gNB / srsRAN** — the Radio Access Network and its base stations. "RAN" is the broader layer; "gNB" is a 5G base station; "srsRAN" is one of several gNB implementations Aether can deploy (alongside UERANSIM, OpenAirInterface, gNBSim).
- **UPF, AMF, SMF, NRF** — individual 5G Core network functions (User Plane Function, Access and Mobility Management Function, Session Management Function, Network Repository Function).
- **Management plane / platform layer / cellular layer** — the three layers an Aether deployment is structured around. See the [three-layer model](./concepts/bootstrap-three-layer-model).

If a term is project-specific rather than 3GPP-standard, it will be defined where it first appears.
