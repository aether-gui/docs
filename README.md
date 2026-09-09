# Aether Ops documentation

Source of https://aether-gui.github.io/docs/, built with [Astro Starlight](https://starlight.astro.build/).

## Build and preview

```bash
npm ci
npm run dev        # http://localhost:4321/docs/
npm run build      # type-check, build, validate internal links
npm run preview
```

`make build` and `make preview` wrap the same commands.

## Layout

| Path | Contents |
|---|---|
| `src/content/docs/` | The pages. The sidebar topics (Guide, Advanced, Reference) are defined in `astro.config.mjs`. |
| `src/assets/screenshots/gui/` | Web UI captures produced by the Playwright rig. Committed. |
| `src/assets/screenshots/iso/` | Console frames from a QEMU boot of the ISO. Committed. |
| `tools/screenshots/` | Playwright specs that regenerate the GUI captures from a live `aether-ops`. |
| `tools/console/` | Scripts that boot the ISO under QEMU and grab VNC frames. |

## Conventions

- Every documented step was executed on a lab deployment before it was written down. Pages name
  the version they were checked against; re-run the rigs and re-read the pages when a release
  changes the UI.
- Tutorial pages follow one shape: *What you'll do*, *Prerequisites*, *Steps*, *Verify*, *Next*.
- Screenshots are named `<page-slug>-<nn>-<element>.png` after the page that embeds them.
- Pages for gated or unfinished functionality carry `status: beta` or `status: planned` in their
  frontmatter and a sidebar badge.

## Regenerating screenshots

See `tools/screenshots/README.md` and `tools/console/README.md`. Neither rig runs in CI.

## Deployment

Pushes to `main` build and deploy to GitHub Pages (`.github/workflows/deploy.yaml`). Pull requests
and other branches only build (`.github/workflows/ci.yaml`).
