---
sidebar_position: 2
title: Installation
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Installation

This page walks through installing Aether Ops and verifying that the service is running.

## Private repo access

If the repository is private, you need a GitHub Personal Access Token (PAT) to authenticate. One token covers all repos in the organization.

**Generate a token:**

1. Go to [github.com/settings/tokens](https://github.com/settings/tokens?type=beta) (fine-grained tokens)
2. Click **Generate new token**
3. Set a name (e.g., "aether-ops install") and expiration
4. Under **Repository access**, select **All repositories** (or pick `aether-ops` and `aether-ops-web` individually)
5. Under **Permissions → Repository permissions**, set **Contents** to **Read-only**
6. Click **Generate token** and copy it

**Export the token** on every machine where you run install commands:

```bash
export GITHUB_TOKEN=github_pat_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

All install commands below use the token automatically when set. Add `-H "Authorization: token $GITHUB_TOKEN"` to curl commands that fetch scripts. Not needed once the repos are public.

## Quick start

Run the installer with preflight to set up the host and install the service in one step:

```bash
curl -fsSL -H "Authorization: token $GITHUB_TOKEN" \
  https://raw.githubusercontent.com/aether-gui/aether-ops/main/scripts/install.sh \
  | GITHUB_TOKEN=$GITHUB_TOKEN sudo -E bash -s -- --preflight --yes
```

:::warning[Security notice]
The `--preflight` flag enables SSH password authentication, creates an `aether` OS user with the default password `aether`, and grants it passwordless sudo. **Change the password immediately after setup.** See the [Security guide](../guides/security) for hardening recommendations.
:::

## Verify the service is running

Confirm the service started successfully:

```bash
systemctl status aether-ops
```

The output should show `active (running)`. If the service failed to start, check the journal:

```bash
journalctl -u aether-ops --no-pager -n 50
```

Verify the health endpoint responds:

```bash
curl http://localhost:8186/healthz
```

Example response (the `version` and `uptime` values will vary):

```json
{"status":"healthy","version":"0.0.9","uptime":"1m39s"}
```

## Next step

With the service running, proceed to [First Deployment](first-deployment) to run preflight checks and deploy Kubernetes and the 5G Core.

---

## Alternative installation methods

<Tabs>
  <TabItem value="multi" label="Multi-Node" default>

When Aether Ops runs on a dedicated management node that drives remote targets via Ansible, you don't need SSH password auth or the `aether` user on the management node itself. Use `--no-ssh` and `--no-user` to install only the required packages:

```bash
curl -fsSL -H "Authorization: token $GITHUB_TOKEN" \
  https://raw.githubusercontent.com/aether-gui/aether-ops/main/scripts/install.sh \
  | GITHUB_TOKEN=$GITHUB_TOKEN sudo -E bash -s -- --preflight --no-ssh --no-user --yes
```

Then prepare each target node (core, RAN, etc.) with the lightweight target node setup script:

```bash
curl -fsSL -H "Authorization: token $GITHUB_TOKEN" \
  https://raw.githubusercontent.com/aether-gui/aether-ops/main/scripts/setup-target-node.sh \
  | sudo bash -s -- --yes
```

:::warning[Security notice]
The target node script enables SSH password authentication and creates an `aether` user with the default password `aether`. Change the password after setup.
:::

  </TabItem>
  <TabItem value="manual" label="Without Preflight">

If prerequisites are already satisfied (packages installed, SSH configured, `aether` user created), skip preflight and install only the binary and systemd service:

```bash
curl -fsSL -H "Authorization: token $GITHUB_TOKEN" \
  https://raw.githubusercontent.com/aether-gui/aether-ops/main/scripts/install.sh \
  | GITHUB_TOKEN=$GITHUB_TOKEN sudo -E bash
```

For granular control, the standalone setup scripts are still available:

```bash
# Management node: full setup (packages, SSH, user)
curl -fsSL -H "Authorization: token $GITHUB_TOKEN" \
  https://raw.githubusercontent.com/aether-gui/aether-ops/main/scripts/setup-mgmt-node.sh \
  | sudo bash -s -- --yes

# Target node: lightweight setup (SSH, user only)
curl -fsSL -H "Authorization: token $GITHUB_TOKEN" \
  https://raw.githubusercontent.com/aether-gui/aether-ops/main/scripts/setup-target-node.sh \
  | sudo bash -s -- --yes
```

  </TabItem>
</Tabs>

---

<details>
<summary>Installer flags reference</summary>

| Flag | Default | Description |
|------|---------|-------------|
| `--preflight` | off | Run management node setup before installing (packages, SSH, user) |
| `--yes` | off | Skip the interactive security confirmation prompt |
| `--no-ssh` | off | Skip SSH password auth configuration (requires `--preflight`) |
| `--no-user` | off | Skip `aether` user/sudo creation (requires `--preflight`) |

The installer also accepts environment variables for version control:

| Variable | Default | Description |
|----------|---------|-------------|
| `VERSION` | latest | Install a specific release version (e.g. `VERSION=v1.0.0`) |
| `REF` | — | Build from source at a git ref (tag, branch, or commit) |
| `FRONTEND_REF` | — | Override the frontend submodule to a specific git ref. If `REF` is not set, it defaults to the latest release tag. Requires Node >= 18 and npm. |
| `GITHUB_TOKEN` | — | GitHub PAT for private repo access. Used for API calls, release downloads, and git clones. Not needed for public repos. |

`VERSION` and `REF` are mutually exclusive. `FRONTEND_REF` and `VERSION` are also mutually exclusive because `FRONTEND_REF` requires a source build.

</details>

<details>
<summary>Configure the listen address</summary>

By default, `aether-ops` listens on `127.0.0.1:8186` (local only). To expose the service on all interfaces, add the variable to the environment file and restart:

```bash
echo 'AETHER_LISTEN=0.0.0.0:8186' | sudo tee -a /etc/aether-ops/env
sudo systemctl restart aether-ops
```

The environment file at `/etc/aether-ops/env` accepts one variable per line. For example, to enable TLS and token auth:

```bash
cat <<'EOF' | sudo tee /etc/aether-ops/env
AETHER_LISTEN=0.0.0.0:8186
AETHER_TLS=true
AETHER_API_TOKEN=my-secret-token
EOF
```

CLI flags override environment variables when both are set. See the [CLI Reference](../reference/cli) for the full mapping.

:::warning
Exposing the API on all interfaces should be paired with TLS and API token authentication in production. See the [Security guide](../guides/security) for setup instructions.
:::

</details>

<details>
<summary>CORS (Cross-Origin Resource Sharing)</summary>

If you serve the frontend separately from the backend (e.g. during development with `npm run dev`), set `AETHER_CORS_ORIGINS` to allow the frontend origin:

```bash
echo 'AETHER_CORS_ORIGINS=http://localhost:5173' | sudo tee -a /etc/aether-ops/env
sudo systemctl restart aether-ops
```

Multiple origins can be comma-separated. Use `*` to allow all origins (not recommended for production).

</details>

<details>
<summary>Preventing unwanted service restarts</summary>

Ubuntu 24.04 ships with `needrestart`, which automatically restarts services after package upgrades. Aether OnRamp playbooks install packages via Ansible that can trigger `needrestart` to kill `aether-ops` mid-task.

The install script creates this exclusion automatically. If you installed manually or from source, create it yourself:

```bash
sudo mkdir -p /etc/needrestart/conf.d
cat <<'EOF' | sudo tee /etc/needrestart/conf.d/aether-ops.conf
# Exclude aether-ops from automatic restarts.
$nrconf{override_rc}{qr(^aether-ops)} = 0;
EOF
```

If `needrestart` is not installed, this step can be skipped.

</details>

<details>
<summary>Configuration options</summary>

The `aether-ops` binary accepts flags for customizing behavior, including `--tls` for automatic self-signed certificate generation and `--api-token` for bearer token authentication. See the [CLI Reference](../reference/cli) for the full list.

</details>
