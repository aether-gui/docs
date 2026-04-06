---
sidebar_position: 1
title: "Deploy SD-Core with srsRAN"
---

# Deploy SD-Core with srsRAN

:::warning[Work in Progress]
This tutorial — and the Aether Ops project itself — is under active development. Expect rough edges, placeholder features, and workflows that will change. If something doesn't work as described, check the [GitHub issues](https://github.com/aether-gui/aether-ops/issues) or reach out to the team.
:::

This tutorial walks through deploying a private 5G network using SD-Core (the 5G core) and srsRAN (the radio access network) on a single Ubuntu server. By the end, you'll have a working 5G SA deployment managed through the Aether Ops web interface.

## What you'll deploy

- **Kubernetes** (RKE2) — container orchestration for the 5G components
- **SD-Core** — open-source 5G core network (AMF, SMF, UPF, and supporting functions)
- **srsRAN** — software-defined gNodeB and UE simulator for testing

## Prerequisites

### Hardware

- x86_64 server or VM with at least **4 CPU cores**, **8 GB RAM**, and **50 GB disk**
- A network interface with internet access (for downloading packages and container images)

Production deployments need significantly more resources. These minimums are for getting started and running simulated traffic.

### Operating system

- **Ubuntu 22.04 LTS** or **Ubuntu 24.04 LTS** (server edition)
- Fresh install recommended — the setup modifies system packages, kernel parameters, and network configuration

Other Debian-based distributions may work but are not tested. RHEL/Fedora support is partial.

### Network access

- Outbound HTTPS access to GitHub (for install scripts and container images)
- Port **8186** open locally (the Aether Ops API/UI)

## Step 1: Generate a GitHub access token

The Aether Ops repositories are currently private. You need a GitHub Personal Access Token (PAT) to download the installer and release binaries.

1. Sign in to [github.com](https://github.com) with the account that has access to the `aether-gui` organization
2. Go to **Settings → Developer settings → [Personal access tokens → Fine-grained tokens](https://github.com/settings/tokens?type=beta)**
3. Click **Generate new token**
4. Fill in:
   - **Token name**: something descriptive (e.g., `aether-ops-install`)
   - **Expiration**: 90 days is a reasonable default
   - **Resource owner**: select **aether-gui**
   - **Repository access**: select **All repositories** (or pick `aether-ops` and `aether-ops-web` individually)
5. Under **Permissions → Repository permissions**, set **Contents** to **Read-only**
6. Click **Generate token** and **copy the token immediately** — you won't be able to see it again

## Step 2: Set up your environment

SSH into your server and export the token. All subsequent commands in this tutorial use it automatically.

```bash
export GITHUB_TOKEN="github_pat_your_token_here"
```

:::tip
Add the export to your `~/.bashrc` or `~/.profile` if you don't want to re-enter it on every login. Remember to remove it when you no longer need private repo access.
:::

## Step 3: Install Aether Ops

Run the installer with the `--preflight` flag. This installs required system packages (git, make, ansible), configures SSH access for node management, creates the `aether` service user, and installs the Aether Ops binary as a systemd service.

```bash
curl -fsSL -H "Authorization: token $GITHUB_TOKEN" \
  https://raw.githubusercontent.com/aether-gui/aether-ops/main/scripts/install.sh \
  | GITHUB_TOKEN=$GITHUB_TOKEN sudo -E bash -s -- --preflight --yes
```

This takes 1-2 minutes. When it finishes, you'll see an installation summary showing what was configured.

### Verify the service is running

```bash
systemctl status aether-ops
```

The output should show `active (running)`. Confirm the API responds:

```bash
curl -s http://localhost:8186/healthz | python3 -m json.tool
```

Expected output:

```json
{
    "status": "healthy",
    "version": "0.1.36",
    "uptime": "10s"
}
```

### Open the web interface

If your server has a GUI or you're accessing it from another machine on the same network, open a browser to:

```
http://<server-ip>:8186
```

The Aether Ops dashboard will load. The next sections of this tutorial will cover registering nodes, running preflight checks, and deploying SD-Core and srsRAN through the web interface.

---

:::info[Next steps — coming soon]
The following sections are planned:
- Registering your server as a managed node
- Running preflight checks and applying fixes
- Configuring the deployment profile
- Deploying Kubernetes, SD-Core, and srsRAN
- Verifying the deployment and running a test UE
:::
