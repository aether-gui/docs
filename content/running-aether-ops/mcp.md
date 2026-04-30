---
sidebar_position: 10
title: "MCP Server"
---

# MCP Server

aether-ops includes a built-in [Model Context Protocol](https://modelcontextprotocol.io/) (MCP) server that exposes cluster management tools to AI assistants like Claude. This lets you manage nodes, deploy components, monitor tasks, and query system metrics through natural language.

Since aether-ops runs as a long-lived service, the MCP server uses StreamableHTTP transport — clients connect to it over the network just like any other HTTP endpoint.

## Enabling the MCP server

Add the `--mcp-listen` flag (or set `AETHER_MCP_LISTEN`) to expose the MCP endpoint.

If aether-ops is running as a systemd service, add the environment variable and restart:

```bash
# Enable the MCP server on port 8187
echo 'AETHER_MCP_LISTEN=0.0.0.0:8187' | sudo tee -a /etc/aether-ops/env

# Restart the service to apply
sudo systemctl restart aether-ops
```

This starts the MCP server alongside the main API, listening on the given address. Clients connect to `http://<host>:8187/mcp`.

### Authentication

When `--api-token` is set, the MCP endpoint requires the same bearer token:

```bash
aether-ops --mcp-listen 0.0.0.0:8187 --api-token my-secret-token
```

### Configuration reference

| Flag | Env Var | Description | Default |
|------|---------|-------------|---------|
| `--mcp-listen` | `AETHER_MCP_LISTEN` | Address for MCP StreamableHTTP transport (e.g., `0.0.0.0:8187`) | *(disabled)* |
| `--api-token` | `AETHER_API_TOKEN` | Bearer token required for MCP (and API) requests | *(none)* |

## Configuring Claude Code

Register the running aether-ops instance as an MCP server in Claude Code:

```bash
claude mcp add --transport http aether-ops http://localhost:8187/mcp
```

If the server requires a bearer token:

```bash
claude mcp add --transport http aether-ops http://localhost:8187/mcp \
  --header "Authorization: Bearer my-secret-token"
```

Verify it was added:

```bash
claude mcp list
```

### Using environment variables for the token

To avoid hard-coding the token, use environment variable expansion in your project's `.mcp.json`:

```json
{
  "mcpServers": {
    "aether-ops": {
      "type": "http",
      "url": "http://localhost:8187/mcp",
      "headers": {
        "Authorization": "Bearer ${AETHER_API_TOKEN}"
      }
    }
  }
}
```

Then set `AETHER_API_TOKEN` in your shell before launching Claude Code.

### Remote servers

For an aether-ops instance running on another host, replace `localhost` with the server's address:

```bash
claude mcp add --transport http aether-ops http://192.168.1.50:8187/mcp \
  --header "Authorization: Bearer my-secret-token"
```

## Available tools

The MCP server exposes 24 tools across five categories:

### Nodes

| Tool | Description |
|------|-------------|
| `nodes_list` | List all managed cluster nodes with roles and connection info |
| `nodes_get` | Get a single managed node by ID |
| `nodes_create` | Create a new managed cluster node with credentials and role assignments |
| `nodes_update` | Partial update a managed node (only provided fields are changed) |
| `nodes_delete` | Delete a managed node by ID |

### OnRamp

| Tool | Description |
|------|-------------|
| `components_list` | List all deployable OnRamp components and their available actions |
| `component_get` | Get a single OnRamp component's details and available actions |
| `deploy_action` | Execute a deployment action on a component (async, returns task ID) |
| `repo_status` | Get the OnRamp git repository clone status, branch, commit, and dirty state |
| `repo_refresh` | Clone the OnRamp repository if missing, or validate and refresh it |
| `config_get` | Get the current OnRamp configuration (vars/main.yml) |
| `config_patch` | Patch the OnRamp configuration by deep-merging provided fields |
| `profiles_list` | List available OnRamp configuration profiles |

### Tasks

| Tool | Description |
|------|-------------|
| `tasks_list` | List all active and recent tasks |
| `task_get` | Get task details and output (supports incremental reads via offset) |
| `task_cancel` | Cancel a pending or running task |
| `actions_list` | Query action execution history with optional filters |
| `action_get` | Get a single action execution record by ID |

### System

| Tool | Description |
|------|-------------|
| `system_overview` | Get system overview: CPU, memory, disk, and OS information |
| `system_network` | Get network interfaces, DNS configuration, and listening ports |
| `system_metrics` | Query system time-series metrics with optional time range and aggregation |

### Meta

| Tool | Description |
|------|-------------|
| `server_status` | Get server version, provider statuses, and store health |
| `component_states_list` | List the current deployment state of all components |
| `component_state_get` | Get the current deployment state of a single component |
