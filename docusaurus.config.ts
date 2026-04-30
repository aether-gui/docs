import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
  title: 'Aether Ops',
  tagline: 'Build, bootstrap, and operate Aether 5G deployments',
  favicon: 'img/favicon.ico',

  url: 'https://aether-gui.github.io',
  baseUrl: '/docs/',

  organizationName: 'aether-gui',
  projectName: 'docs',
  trailingSlash: false,

  onBrokenLinks: 'throw',

  markdown: {
    hooks: {
      onBrokenMarkdownLinks: 'warn',
    },
  },

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          path: 'content',
          routeBasePath: '/',
          sidebarPath: './sidebars.ts',
          editUrl: 'https://github.com/aether-gui/docs/tree/main/',
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    navbar: {
      title: 'Aether Ops',
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'docsSidebar',
          position: 'left',
          label: 'Docs',
        },
        {
          href: 'https://github.com/aether-gui/aether-ops',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Docs',
          items: [
            {label: 'Introduction', to: '/docs/intro'},
            {label: 'Tools', to: '/docs/tools/'},
            {label: 'Run aether-ops', to: '/docs/running-aether-ops/quick-start'},
            {label: 'Bootstrap a system', to: '/docs/bootstrapping/quick-start'},
            {label: 'Build a bundle', to: '/docs/building-a-bundle/quick-start'},
          ],
        },
        {
          title: 'Reference',
          items: [
            {label: 'aether-ops API', to: '/docs/reference/aether-ops/api-overview'},
            {label: 'aether-ops CLI', to: '/docs/reference/aether-ops/cli'},
            {label: 'aether-ops-bootstrap CLI', to: '/docs/reference/aether-ops-bootstrap/cli'},
          ],
        },
        {
          title: 'More',
          items: [
            {label: 'GitHub', href: 'https://github.com/aether-gui/aether-ops'},
            {label: 'Aether OnRamp', href: 'https://github.com/opennetworkinglab/aether-onramp'},
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Aether Ops`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
      additionalLanguages: ['bash', 'json', 'yaml', 'go'],
    },
    colorMode: {
      defaultMode: 'light',
      respectPrefersColorScheme: true,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
