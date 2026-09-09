// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import starlightLinksValidator from 'starlight-links-validator';
import starlightSidebarTopics from 'starlight-sidebar-topics';

// Three sidebar topics keep everyday usage (Guide) separate from the material
// most readers never need (Advanced, Reference). Tutorial order inside each
// group is explicit so autogeneration cannot reorder it.
export default defineConfig({
  site: 'https://aether-gui.github.io',
  base: '/docs',
  trailingSlash: 'always',
  integrations: [
    starlight({
      title: 'Aether Ops',
      description: 'Install, deploy, and operate a private 5G network with Aether Ops.',
      logo: { src: './src/assets/logo.svg', alt: 'Aether Ops' },
      favicon: '/favicon.svg',
      social: [
        { icon: 'github', label: 'GitHub', href: 'https://github.com/aether-gui' },
      ],
      editLink: { baseUrl: 'https://github.com/aether-gui/docs/edit/main/' },
      lastUpdated: true,
      customCss: ['./src/styles/custom.css'],
      expressiveCode: {
        themes: ['github-light', 'github-dark'],
        defaultProps: { wrap: true },
      },
      plugins: [
        starlightLinksValidator({ errorOnRelativeLinks: false }),
        starlightSidebarTopics([
          {
            label: 'Guide',
            link: '/',
            icon: 'open-book',
            items: [
              { label: 'Overview', items: [
                { label: 'What is Aether Ops?', slug: 'overview/what-is-aether-ops' },
                { label: 'What you need', slug: 'overview/what-you-need' },
              ]},
              { label: 'Install from the ISO', items: [
                { label: 'Install the operating system', slug: 'iso/install' },
                { label: 'First boot', slug: 'iso/first-boot' },
                { label: 'Open the web UI', slug: 'iso/open-the-web-ui' },
              ]},
              { label: 'Use the web UI', items: [
                { label: 'A quick tour', slug: 'gui/tour' },
                { label: 'Setup wizard', slug: 'gui/setup-wizard' },
                { label: 'Adding nodes', slug: 'gui/adding-nodes' },
                { label: 'Roles', slug: 'gui/roles' },
                { label: 'Extension roles', slug: 'gui/extension-roles' },
                { label: 'Deployment tab', slug: 'gui/deployment-tab' },
                { label: '5G network', slug: 'gui/5g-network' },
                { label: 'Status pages', slug: 'gui/status-pages' },
                { label: 'Backup and restore', slug: 'gui/backup-restore' },
                { label: 'Troubleshooting', slug: 'gui/troubleshooting' },
              ]},
            ],
          },
          {
            label: 'Advanced',
            link: '/advanced/',
            icon: 'setting',
            items: [
              { label: 'Bootstrap installer', items: [
                { label: 'How the bootstrap works', slug: 'bootstrap' },
                { label: 'Install a node', slug: 'bootstrap/install' },
                { label: 'Upgrade and repair', slug: 'bootstrap/upgrade-repair' },
                { label: 'Inspect and diagnose', slug: 'bootstrap/inspect-and-diagnose' },
                { label: 'Build a bundle', slug: 'bootstrap/build-a-bundle' },
                { label: 'Patch a bundle', slug: 'bootstrap/patch-a-bundle' },
                { label: 'Verify a bundle', slug: 'bootstrap/verify-a-bundle' },
                { label: 'SBOM and VEX', slug: 'bootstrap/sbom-and-vex' },
                { label: 'Release process', slug: 'bootstrap/release-process' },
              ]},
              { label: 'Building the ISO', items: [
                { label: 'Build the ISO', slug: 'iso/build' },
                { label: 'Build in a container', slug: 'iso/build-in-a-container' },
                { label: 'Snapshots and rollback', slug: 'iso/snapshots-and-rollback' },
                { label: 'How the ISO works', slug: 'iso/how-the-iso-works' },
              ]},
              { label: 'Running aether-ops', items: [
                { label: 'Other ways to run it', slug: 'running/other-ways-to-run' },
                { label: 'Configuration', slug: 'running/configuration' },
                { label: 'MCP server', slug: 'running/mcp' },
              ]},
              { label: 'Concepts', items: [
                { label: 'Architecture', slug: 'concepts/architecture' },
                { label: 'Nodes, roles, and deployments', slug: 'concepts/nodes-roles-deployments' },
                { label: 'Bundle and manifest', slug: 'concepts/bundle-and-manifest' },
              ]},
            ],
          },
          {
            label: 'Reference',
            link: '/reference/',
            icon: 'document',
            items: [
              { label: 'aether-ops CLI', slug: 'reference/aether-ops-cli' },
              { label: 'aether-ops-bootstrap CLI', slug: 'reference/aether-ops-bootstrap-cli' },
              { label: 'ISO build recipes', slug: 'reference/iso-justfile' },
              { label: 'REST API', slug: 'reference/api' },
              { label: 'Ports and paths', slug: 'reference/ports-and-paths' },
              { label: 'Glossary', slug: 'reference/glossary' },
            ],
          },
        ]),
      ],
    }),
  ],
});
