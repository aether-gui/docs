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

### (Optional) Listen on all interfaces

By default, Aether Ops only listens on `127.0.0.1` (localhost). If you're running inside a VM and want to access the web interface from your workstation's browser, configure it to listen on all interfaces:

```bash
echo 'AETHER_LISTEN=0.0.0.0:8186' | sudo tee -a /etc/aether-ops/env
sudo systemctl restart aether-ops
```

### Open the web interface

Open a browser to:

```
http://<server-ip>:8186
```

Replace `<server-ip>` with your server's IP address, or use `localhost` if you're on the server itself.

On first launch, the **Initial Setup** wizard guides you through the full deployment process in five steps: Nodes, Preflight, Roles, Config, and Deploy.

## Step 4: Select nodes

The wizard opens to the **Select Nodes** screen. The local machine is already registered as `localhost` with the **LOCAL** badge, pointing to `127.0.0.1` using the `aether` user.

For this single-server tutorial, leave `localhost` checked and click **Continue**.

:::tip
To deploy on a separate machine, click **+ Add Node** to register additional hosts. Each node needs SSH access configured with the `aether` user. For this tutorial, localhost is all you need.
:::

![Setup wizard — Select Nodes with localhost checked](/img/tutorials/sd-core-srsran/setup-nodes.png)

## Step 5: Run preflight checks

The wizard automatically runs preflight checks against each selected node. The results are grouped by node, with an overall status showing SSH connectivity and how many checks passed.

Each check falls into a category:

| Check | Category | What it verifies |
|-------|----------|------------------|
| SSH Connectivity | — | Ansible can reach the node via SSH |
| Required Packages | TOOLING | `git`, `make`, `ansible-playbook`, `sshd`, and `iptables` are installed |
| SSH Configuration | ACCESS | SSH password authentication is enabled |
| Aether User | ACCESS | The `aether` system user exists |
| Node SSH Reachability | NETWORK | All managed nodes are reachable via SSH (TCP port 22) |

Since you installed with `--preflight` in Step 3, all checks should show green. If any check fails, click on it to expand details and apply the automated fix, then click **Re-check All** to verify.

Once everything passes, click **Continue**.

![Setup wizard — Preflight Checks with all checks passing](/img/tutorials/sd-core-srsran/setup-preflight.png)

## Step 6: Assign roles

The **Assign Roles** screen determines which components each node will run. The available roles are:

| Role | Description |
|------|-------------|
| **SD-Core** | 5G core network control plane and user plane functions |
| **gNBsim** | gNB simulator for testing without physical radios |
| **OAI** | OpenAirInterface 5G RAN stack |
| **UERANSIM** | UERANSIM UE and gNB simulator |
| **srsRAN** | srsRAN 5G software radio |
| **OSC RIC** | O-RAN Software Community RAN Intelligent Controller |
| **N3IWF** | Non-3GPP Interworking Function for Wi-Fi access |

For this tutorial, select **SD-Core** and **srsRAN** on the `localhost` node. The selected roles appear as badges next to the node name.

:::tip
In a multi-node deployment, you would add additional hosts on the Nodes screen and assign roles across them here — for example, running SD-Core on one server and srsRAN on another.
:::

Click **Continue** to proceed to configuration.

![Setup wizard — Assign Roles with SD-Core and srsRAN selected](/img/tutorials/sd-core-srsran/setup-roles.png)

## Step 7: Review configuration

The **Review Configuration** screen combines component defaults with values detected from your nodes' network configuration. The blue info box at the top summarizes what was auto-filled — typically the data interface, RAN subnet, AMF IP, and gNB IP, all derived from the node's default route interface and primary IP address.

Below the auto-detected values, each component section (Kubernetes, 5G Core, srsRAN) can be expanded to inspect or edit individual fields. Sections that received auto-filled values are labeled accordingly.

For this tutorial, the defaults are correct. Review the auto-detected values to confirm they match your server's network, then click **Continue**.

:::tip
If you need to change a value — for example, to use a different network interface — expand the relevant section and edit the field. Click **Save Changes** before continuing. You can also click **Reload** to re-detect values from the nodes.
:::

![Setup wizard — Review Configuration with auto-detected values](/img/tutorials/sd-core-srsran/setup-config.png)

## Step 8: Review and start the deployment

The final wizard screen shows the deployment plan — a summary of the node and its assigned roles, followed by the ordered list of actions that will be executed:

1. **Kubernetes Cluster** (`k8s/install`) — container orchestration
2. **SD-Core (5G Core)** (`5gc/install`) — 5G core network functions
3. **srsRAN 5G** (`srsran/gnb-install`) — software gNB

Each action runs sequentially. Aether Ops waits for one to complete before starting the next.

Review the plan, then click **Start Deployment**. The wizard closes and takes you to the dashboard, where you can monitor progress in real time.

![Setup wizard — Deployment plan ready to start](/img/tutorials/sd-core-srsran/setup-deploy.png)

## Step 9: Monitor the deployment

After clicking **Start Deployment**, the wizard closes and the main dashboard appears. A progress banner at the top of the screen tracks the deployment queue, showing which action is currently running and how many have completed (e.g., "Deploying: Kubernetes Cluster (0/3 complete)"). A **Cancel Deployment** button is available if you need to abort.

The dashboard **Overview** page shows live system information — hostname, OS, CPU and memory usage, and uptime — along with summary cards for components, core components, RAN nodes, and connected UEs. The **Service Status** panel on the right lists all known services and their current state.

![Dashboard with deployment progress banner](/img/tutorials/sd-core-srsran/dashboard-deploying.png)

Click **Deployment** in the sidebar to see a detailed view of each component's status. As the deployment progresses, components transition from **not installed** to **installing** to **installed**. The node card shows the assigned roles (SD-Core, srsRAN) and each component displays its current state with the underlying action label (e.g., `k8s`, `5gc`, `srsran`).

![Deployment page showing component install progress](/img/tutorials/sd-core-srsran/deployment-progress.png)

:::info
The full deployment typically takes 10-20 minutes depending on your server's resources and network speed. Kubernetes is the longest step. You can continue browsing the dashboard while the deployment runs — the progress banner stays visible across all pages.
:::

Wait for all three components to show **installed** on the Deployment page before proceeding.

## Step 10: Verify the deployment

Once all three components finish installing, navigate to the **Overview** page. The **Service Status** panel confirms what is running:

- **WebUI** — Running
- **k8s** — Running (1 node found)
- **5gc** — Running (16 pods in aether-5gc)
- **srsran** — Running (1 container running)

Services not included in this deployment (gnbsim, sdran, ueransim, oai) show as **Absent** — this is expected.

The **Infrastructure Nodes** table at the bottom shows `localhost` with its assigned roles. The summary cards at the top reflect the active component count and core network status.

![Dashboard Overview with all services running](/img/tutorials/sd-core-srsran/dashboard-running.png)

---

## What you've deployed

Your single-server setup is now running a complete 5G SA network:

- **RKE2 Kubernetes** — container orchestration hosting all 5G workloads
- **SD-Core** — 5G core network (AMF, SMF, UPF, and supporting network functions)
- **srsRAN gNB** — software-defined 5G base station connected to the core

## Cleanup

To tear down the deployment, navigate to the **Deployment** page. Remove components in reverse order using the delete button next to each:

1. Uninstall **srsRAN 5G**
2. Uninstall **SD-Core (5G Core)**
3. Uninstall **Kubernetes Cluster**

Wait for each uninstall to complete before starting the next.

:::warning
Uninstalling Kubernetes removes all workloads running on the cluster. Make sure SD-Core and srsRAN are uninstalled first.
:::

## Troubleshooting

| Problem | Likely cause | Fix |
|---------|-------------|-----|
| k8s install fails | Network issues or insufficient resources | Check task output. Verify outbound HTTPS access and at least 4 CPU / 8 GB RAM. |
| 5gc install fails | Kubernetes not fully ready | Verify k8s shows "Installed". Check task output for pod scheduling errors. |
| srsRAN gnb-install fails | 5gc not installed | Verify 5gc shows "Installed" on the Deployment page. |
| Deployment stalls | A task is taking longer than expected | Check the progress banner. Some steps (especially k8s) can take 10+ minutes. |

For any failure, the first step is always to check the task output for specific error messages. For unresolved issues, check the [GitHub issues](https://github.com/aether-gui/aether-ops/issues).

## Dashboard status

The initial setup wizard and deployment workflow covered in this tutorial are functional, but many of the dashboard pages you see in the sidebar — including 5G Network status, UEs & Subscribers, and detailed monitoring views — are still under active development. Some pages may show placeholder content or incomplete data.

This tutorial will be updated as new dashboard features become available. For the latest progress, check the [GitHub repository](https://github.com/aether-gui/aether-ops).

## Next steps

- [Configuration guide](/guides/configuration) — customize SD-Core and RAN parameters
- [Components reference](/reference/components) — all available components and actions
- [Monitoring](/guides/monitoring) — set up dashboards for network observability
