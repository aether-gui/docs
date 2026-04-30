import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  docsSidebar: [
    'intro',
    {
      type: 'category',
      label: 'Tools',
      collapsed: false,
      link: {type: 'doc', id: 'tools/index'},
      items: [
        'tools/aether-ops',
        {
          type: 'category',
          label: 'aether-ops-bootstrap',
          link: {type: 'doc', id: 'tools/aether-ops-bootstrap'},
          items: [
            'tools/build-bundle',
            'tools/patch-bundle',
          ],
        },
      ],
    },
    {
      type: 'category',
      label: 'Bootstrapping a system',
      collapsed: true,
      link: {type: 'doc', id: 'bootstrapping/index'},
      items: [
        'bootstrapping/quick-start',
        'bootstrapping/verifying',
        'bootstrapping/complete-guide',
        'bootstrapping/upgrades-and-repair',
        'bootstrapping/troubleshooting',
        'bootstrapping/next-steps',
      ],
    },
    {
      type: 'category',
      label: 'Building a bundle',
      collapsed: true,
      link: {type: 'doc', id: 'building-a-bundle/index'},
      items: [
        'building-a-bundle/quick-start',
        'building-a-bundle/bundle-yaml',
        'building-a-bundle/lockfile',
        'building-a-bundle/manifest',
        'building-a-bundle/versioning',
        'building-a-bundle/release-process',
        'building-a-bundle/patching',
      ],
    },
    {
      type: 'category',
      label: 'Running aether-ops',
      collapsed: true,
      link: {type: 'doc', id: 'running-aether-ops/index'},
      items: [
        'running-aether-ops/quick-start',
        'running-aether-ops/installation',
        'running-aether-ops/verifying',
        'running-aether-ops/next-steps',
        'running-aether-ops/configuration',
        'running-aether-ops/node-management',
        'running-aether-ops/deploying-components',
        'running-aether-ops/bulk-deployment',
        'running-aether-ops/monitoring',
        'running-aether-ops/security',
        'running-aether-ops/docker',
        'running-aether-ops/kubernetes',
        'running-aether-ops/repository',
        'running-aether-ops/mcp',
        'running-aether-ops/troubleshooting',
      ],
    },
    {
      type: 'category',
      label: 'Tutorials',
      collapsed: true,
      items: [
        'tutorials/sd-core-srsran',
      ],
    },
    {
      type: 'category',
      label: 'Reference',
      collapsed: true,
      items: [
        {
          type: 'category',
          label: 'aether-ops',
          items: [
            'reference/aether-ops/cli',
            'reference/aether-ops/api-overview',
            'reference/aether-ops/api-meta',
            'reference/aether-ops/api-system',
            'reference/aether-ops/api-nodes',
            'reference/aether-ops/api-onramp',
            'reference/aether-ops/api-preflight',
            'reference/aether-ops/api-tunings',
            'reference/aether-ops/configuration',
            'reference/aether-ops/components',
          ],
        },
        {
          type: 'category',
          label: 'aether-ops-bootstrap',
          items: [
            'reference/aether-ops-bootstrap/cli',
          ],
        },
        {
          type: 'category',
          label: 'build-bundle',
          items: [
            'reference/build-bundle/cli',
          ],
        },
        {
          type: 'category',
          label: 'patch-bundle',
          items: [
            'reference/patch-bundle/cli',
          ],
        },
      ],
    },
    {
      type: 'category',
      label: 'Concepts',
      collapsed: true,
      items: [
        'concepts/architecture',
        'concepts/providers',
        'concepts/tasks',
        'concepts/deployment-state',
        'concepts/bootstrap-three-layer-model',
        'concepts/bundle-structure',
      ],
    },
    {
      type: 'category',
      label: 'Developer',
      collapsed: true,
      items: [
        'developer/README',
        'developer/architecture',
        'developer/security',
        {
          type: 'category',
          label: 'Providers',
          items: [
            'developer/providers/meta',
            'developer/providers/onramp',
            'developer/providers/preflight',
            'developer/providers/system',
          ],
        },
        'developer/aether-ops-bootstrap-design',
        'developer/multi-node-design',
      ],
    },
  ],
};

export default sidebars;
