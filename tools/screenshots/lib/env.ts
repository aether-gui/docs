import path from 'node:path';
import { fileURLToPath } from 'node:url';

// Resolves rig settings from the environment with lab-friendly defaults.
// SHOT_DIR is relative to the repo root so PNG paths in specs stay short.
const here = path.dirname(fileURLToPath(import.meta.url));
export const repoRoot = path.resolve(here, '..', '..', '..');

export const env = {
  baseUrl: process.env.BASE_URL ?? 'http://localhost:8186',
  shotDir: path.resolve(repoRoot, process.env.SHOT_DIR ?? 'src/assets/screenshots'),
  // The second lab machine used by the "Adding nodes" spec.
  node: {
    name: process.env.NODE_NAME ?? 'ran-01',
    host: process.env.NODE_HOST ?? '',
    user: process.env.NODE_USER ?? 'aether',
    password: process.env.NODE_PASSWORD ?? '',
  },
  // Set DEPLOY=1 to let the wizard spec run a real deployment (30+ minutes).
  deploy: process.env.DEPLOY === '1',
};
