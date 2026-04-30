---
sidebar_position: 1
title: Tools
---

# Tools

The Aether ecosystem is a small, focused set of tools. Each one does one thing; together they cover building, deploying, and operating a 5G platform.

| Tool | What it does | Audience |
|---|---|---|
| [**aether-ops**](./aether-ops.md) | Long-running management service. REST API and web UI for deploying SD-Core, RAN, and supporting components on top of RKE2. | Operators, integrators, developers |
| [**aether-ops-bootstrap**](./aether-ops-bootstrap.md) | One-shot offline installer. Turns a fresh Ubuntu host into a running aether-ops management plane. | Field operators, install engineers |
| [**build-bundle**](./build-bundle.md) | Bundle builder. Reads `bundle.yaml`, produces `bundle.tar.zst` — the offline payload aether-ops-bootstrap installs. | Release engineers, integrators |
| [**patch-bundle**](./patch-bundle.md) | Bundle patcher. Replaces files inside an already-built bundle without a full rebuild. | Operators producing site-specific overrides |

## Picking a starting page

- You're standing up a new deployment from scratch → [aether-ops-bootstrap](./aether-ops-bootstrap.md), then [aether-ops](./aether-ops.md).
- You're deploying workloads onto an existing aether-ops install → [aether-ops](./aether-ops.md).
- You're producing the release artifacts everyone else consumes → [build-bundle](./build-bundle.md), then [patch-bundle](./patch-bundle.md) when you need a fast-path edit.

Each tool page is a one-screen overview. From there, jump into the workflow sections — [Bootstrapping a system](../bootstrapping/index.md), [Building a bundle](../building-a-bundle/index.md), [Running aether-ops](../running-aether-ops/index.md) — for quick starts and complete guides.
