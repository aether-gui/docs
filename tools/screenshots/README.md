# GUI screenshot rig

Playwright specs that drive a live `aether-ops` instance and write PNGs into
`src/assets/screenshots/gui/`. Run them from the repository root.

## Requirements

- Node 22+, `npm ci`, and a Chromium for Playwright: `npx playwright install chromium`.
- A reachable `aether-ops` (the docs were captured against 0.5.2) with `AETHER_LISTEN` set to a
  routable address, and for the wizard spec a second Ubuntu host prepared as in the
  "Adding nodes" page and trusting the daemon's managed key.

## Environment

| Variable | Default | Purpose |
|---|---|---|
| `BASE_URL` | `http://localhost:8186` | The daemon. |
| `API_TOKEN` | | Sent as a bearer token when the daemon requires one. |
| `NODE_NAME`, `NODE_HOST`, `NODE_USER` | `ran-01`, empty, `aether` | The second machine the wizard spec adds. With `NODE_HOST` empty the add-node part is skipped. |
| `DEPLOY` | | `1` lets the wizard spec press Start Deployment and wait for it (about 10 minutes in the lab). |
| `SHOT_DIR` | `src/assets/screenshots` | Output root. |

## Specs and the state they expect

| Spec | Needs |
|---|---|
| `gui-setup-wizard.spec.ts` | A daemon that has never completed the wizard, with only the local node registered. It resumes at whatever step the wizard is on, so it can be re-run after a failure with `--grep-invert` to skip finished tests. |
| `gui-dashboard.spec.ts` | A finished deployment. |
| `gui-5g-network.spec.ts` | A finished deployment with a `gnbsim` node; it runs the simulator itself. |
| `gui-extension-roles.spec.ts` | The `splunk-enterprise` and `otel-collector` feature gates enabled; it assigns and removes a role without installing. |

```bash
BASE_URL=http://10.0.0.5:8186 NODE_HOST=10.0.0.6 NODE_NAME=ran-01 DEPLOY=1 \
  npx playwright test -c tools/screenshots/playwright.config.ts
```

Screenshots are 1440x900 at device scale 2. A failure leaves a trace under
`tools/screenshots/.artifacts/`; open it with `npx playwright show-trace <trace.zip>`.

## Resetting a lab

`DELETE /api/v1/wizard` re-arms the wizard but keeps nodes, roles, and deployed components. For a
clean first-run capture, reinstall the daemon on a fresh machine instead.
