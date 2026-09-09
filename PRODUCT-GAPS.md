# Product gaps found while writing these docs

Observed on 2026-09-09 against aether-ops v0.5.2 (frontend 5799c47), aether-ops-iso 0.1.0
(built from `main` at 30a920d with bundle 2026.08.05.1), and aether-ops-bootstrap v0.4.0.
Each item is documented on the page it affects; this list exists so issues can be filed.

## Blocking for the ISO path

- **Console login refused.** The autoinstall `user-data` hash for user `aether` (commented as
  "aether") does not verify against `aether` or about forty variants. The bootstrap keeps the
  existing password (`user aether already exists (password unchanged)`) and writes
  `ansible_password=aether` into `hosts.ini` with no key file, so `sshpass -p aether ssh
  aether@127.0.0.1` fails and OnRamp cannot reach the node: deployments from an ISO-installed host
  fail at preflight. Regenerate the hash (for example `openssl passwd -6 aether`).
- **Legacy BIOS installs fail** at `grub-install`: *this GPT partition label contains no BIOS Boot
  Partition* and *filesystem 'btrfs' doesn't support blocklists*. UEFI works. Add a `bios_grub`
  partition or state UEFI-only.

## ISO, non-blocking

- The `aether-setup` dialog on tty1 is overdrawn by boot and bootstrap console output for its first
  minute (the getty/console race). It stays usable.
- `/etc/aether-ops/env` is not created, so the daemon binds to loopback with no obvious place to
  change it. Creating the file with `AETHER_LISTEN` works; the docs make it the first step.
- `AETHER_ONRAMP_PASSWORD=aether` is hardcoded in `aether-bootstrap.service`; nothing prompts for
  or enforces a change.
- The installed daemon (v0.4.5 from bundle 2026.08.05.1) is behind the current release (v0.5.2).

## aether-ops / web UI

- **gNBSim run reports success while the simulator dies.** OnRamp `main` (2d00e03)
  `deps/gnbsim/config/gnbsim-s1-p{1,2}.yaml` has a disabled `customProfiles` entry without `dnn`
  and `sNssai`; gnbsim rel-2.3.0 validates it anyway and exits. The task only starts containers,
  so it exits 0. Workaround on the troubleshooting page.
- **Preflight forgets SSH verification on reload.** Every node returns to *SSH Pending* and
  Continue is disabled until Re-check All runs again.
- **Config step after reload** shows *No configuration available*; the frontend does not re-POST
  `config/compose`. Back then Continue reloads it.
- **Add Node is cancelled by closing the tab.** The node stays registered without an agent
  (`context canceled` in the log); the retry is `POST /nodes/{id}/agent/deploy`.
- Browser tab title still reads *Aether WebUI Deployment Wizard*; the header says *Aether WebUI*.
- Topology is marked EXP; RAN and Security are marked SOON.

## Bootstrap

- `aether-ops-bootstrap version` reports `v0.4.0-dirty` for the published launcher.
- No signing of bundles or launchers; integrity is SHA-256 sidecars only.
- `security/vex/openvex.json` has an empty `statements` list.
