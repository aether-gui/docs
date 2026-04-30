---
sidebar_position: 7
title: "API: Tunings"
---

# Tunings API Reference

Modular OS and kernel optimization framework. Each tuning is a self-contained unit that can calculate recommended values, apply changes (with snapshot for rollback), remove changes (restoring originals), and check current status. Tunings can be grouped into profiles for bulk operations.

## Endpoints

### Individual Tunings

| Method | Path | Operation ID | Description |
|--------|------|--------------|-------------|
| `GET` | `/api/v1/tunings` | `tunings-list` | List all tunings (filterable by category, role) |
| `GET` | `/api/v1/tunings/{id}` | `tunings-get` | Get tuning detail with current check status |
| `POST` | `/api/v1/tunings/{id}/calculate` | `tunings-calculate` | Calculate recommended values for this system |
| `POST` | `/api/v1/tunings/{id}/apply` | `tunings-apply` | Snapshot current values and apply tuning |
| `POST` | `/api/v1/tunings/{id}/remove` | `tunings-remove` | Restore original values from snapshot |

### Profiles

| Method | Path | Operation ID | Description |
|--------|------|--------------|-------------|
| `GET` | `/api/v1/tunings/profiles` | `tunings-profiles-list` | List all tuning profiles |
| `GET` | `/api/v1/tunings/profiles/{id}` | `tunings-profiles-get` | Get profile detail with status of each tuning |
| `POST` | `/api/v1/tunings/profiles/{id}/apply` | `tunings-profiles-apply` | Apply all tunings in the profile sequentially |
| `POST` | `/api/v1/tunings/profiles/{id}/remove` | `tunings-profiles-remove` | Remove all tunings in the profile (reverse order) |

## GET `/api/v1/tunings`

Returns all available tunings, optionally filtered.

| Parameter | Type | In | Description |
|-----------|------|----|-------------|
| `category` | string | query | Filter by category: `network`, `kernel`, `memory`, `disk` |
| `role` | string | query | Filter by applicable node role (e.g., `worker`) |

**Response:**

```json
[
  {
    "id": "net-tcp-buffer-sizes",
    "name": "TCP Buffer Sizes",
    "description": "Optimizes net.core.rmem_max and net.core.wmem_max for 5G data-plane throughput.",
    "category": "network",
    "roles": []
  },
  {
    "id": "mem-huge-pages",
    "name": "Huge Pages",
    "description": "Configures vm.nr_hugepages for DPDK and UPF performance.",
    "category": "memory",
    "roles": ["worker"]
  }
]
```

## GET `/api/v1/tunings/{id}`

Returns tuning details including current check status.

**Response:**

```json
{
  "id": "net-tcp-buffer-sizes",
  "name": "TCP Buffer Sizes",
  "description": "Optimizes net.core.rmem_max and net.core.wmem_max for 5G data-plane throughput.",
  "category": "network",
  "check": {
    "tuning_id": "net-tcp-buffer-sizes",
    "name": "TCP Buffer Sizes",
    "status": "not_applied",
    "current": {"net.core.rmem_max": "212992", "net.core.wmem_max": "212992"},
    "expected": {"net.core.rmem_max": "16777216", "net.core.wmem_max": "16777216"},
    "message": "tuning is not applied"
  }
}
```

**Check status values:** `not_applied`, `applied`, `drifted`, `error`

## POST `/api/v1/tunings/{id}/calculate`

Runs the Calculate function and returns recommended values for this system.

**Response:**

```json
{
  "tuning_id": "mem-huge-pages",
  "recommended": {"vm.nr_hugepages": "1024"},
  "current": {"vm.nr_hugepages": "0"},
  "message": "1024 pages (2 GB) recommended for 32 GB system"
}
```

## POST `/api/v1/tunings/{id}/apply`

Snapshots current values and applies the tuning. Original values are preserved for rollback via remove.

**Response:**

```json
{
  "tuning_id": "net-tcp-buffer-sizes",
  "applied": true,
  "previous": {"net.core.rmem_max": "212992", "net.core.wmem_max": "212992"},
  "new_values": {"net.core.rmem_max": "16777216", "net.core.wmem_max": "16777216"},
  "message": "applied TCP buffer size tuning"
}
```

## POST `/api/v1/tunings/{id}/remove`

Restores original values from the snapshot taken during the first apply.

**Response:**

```json
{
  "tuning_id": "net-tcp-buffer-sizes",
  "removed": true,
  "restored": {"net.core.rmem_max": "212992", "net.core.wmem_max": "212992"},
  "message": "restored original TCP buffer sizes"
}
```

## Profiles

### GET `/api/v1/tunings/profiles`

```json
[
  {
    "id": "5g-baseline",
    "name": "5G Baseline",
    "description": "Essential OS tunings for 5G infrastructure nodes",
    "tuning_ids": ["net-tcp-buffer-sizes", "net-conntrack-table-size", "mem-huge-pages"]
  }
]
```

### POST `/api/v1/tunings/profiles/{id}/apply`

Applies all tunings in the profile sequentially.

```json
{
  "profile_id": "5g-baseline",
  "results": [
    {"tuning_id": "net-tcp-buffer-sizes", "applied": true, "message": "..."},
    {"tuning_id": "net-conntrack-table-size", "applied": true, "message": "..."},
    {"tuning_id": "mem-huge-pages", "applied": true, "message": "..."}
  ],
  "message": "applied 3 tunings"
}
```

### POST `/api/v1/tunings/profiles/{id}/remove`

Removes all tunings in the profile in reverse order.

## Available Tunings

| ID | Name | Category | Description |
|----|------|----------|-------------|
| `net-tcp-buffer-sizes` | TCP Buffer Sizes | network | Tunes `net.core.rmem_max` / `wmem_max` to 16 MB for 5G throughput |
| `net-conntrack-table-size` | Conntrack Table Size | network | Increases `nf_conntrack_max` to 1M for high connection counts |
| `mem-huge-pages` | Huge Pages | memory | Configures `vm.nr_hugepages` based on system RAM (workers only) |

## Available Profiles

| ID | Name | Tunings |
|----|------|---------|
| `5g-baseline` | 5G Baseline | All three starter tunings |
