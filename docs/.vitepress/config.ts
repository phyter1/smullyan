import { defineConfig } from 'vitepress';

/**
 * VitePress configuration for the smullyan documentation site.
 *
 * `base` is set for GitHub Pages project-site hosting, where the site is served
 * from /<repo>/ rather than the domain root. Getting this wrong produces a page
 * that loads but whose every asset 404s.
 */
export default defineConfig({
  title: 'smullyan',
  description:
    'A fully typesafe functional programming library for TypeScript: combinatory-logic bird combinators plus Option, Result, Task, Reader, pipe and flow.',
  base: '/smullyan/',
  lang: 'en-GB',
  cleanUrls: true,
  lastUpdated: true,

  // Fail the build on a broken internal link rather than shipping one.
  ignoreDeadLinks: false,

  head: [
    ['meta', { name: 'theme-color', content: '#5b7cfa' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:title', content: 'smullyan' }],
    [
      'meta',
      {
        property: 'og:description',
        content: 'Combinatory-logic bird combinators for TypeScript, fully typed.',
      },
    ],
  ],

  themeConfig: {
    nav: [
      { text: 'Guide', link: '/guide/getting-started' },
      { text: 'Aviary', link: '/reference/aviary' },
      { text: 'API', link: '/reference/api' },
      { text: 'Design', link: '/design/typing-combinators' },
      {
        text: 'v0.1.0',
        items: [
          { text: 'Changelog', link: 'https://github.com/phyter1/smullyan/blob/main/CHANGELOG.md' },
          { text: 'npm', link: 'https://www.npmjs.com/package/smullyan' },
        ],
      },
    ],

    sidebar: [
      {
        text: 'Guide',
        items: [
          { text: 'Getting started', link: '/guide/getting-started' },
          { text: 'Why birds', link: '/guide/why-birds' },
          { text: 'Currying and composition', link: '/guide/currying' },
          { text: 'Working with Option and Result', link: '/guide/option-result' },
          { text: 'Task and Reader', link: '/guide/task-reader' },
          { text: 'Tool calls for agents', link: '/guide/agent' },
          { text: 'Dialects', link: '/guide/dialects' },
        ],
      },
      {
        text: 'Reference',
        items: [
          { text: 'The aviary', link: '/reference/aviary' },
          { text: 'pipe and flow', link: '/reference/pipe' },
          { text: 'Full API', link: '/reference/api' },
        ],
      },
      {
        text: 'Design notes',
        items: [
          { text: 'Typing combinators', link: '/design/typing-combinators' },
          { text: 'Where the types give out', link: '/design/type-boundaries' },
          { text: 'How this is tested', link: '/design/testing' },
          { text: 'Translating a library', link: '/design/dialects' },
          { text: 'Build and supply chain', link: '/design/supply-chain' },
        ],
      },
      {
        text: 'Project',
        items: [
          { text: 'Releasing', link: '/RELEASING' },
          { text: 'Contributing', link: '/contributing' },
        ],
      },
    ],

    socialLinks: [{ icon: 'github', link: 'https://github.com/phyter1/smullyan' }],

    search: { provider: 'local' },

    editLink: {
      pattern: 'https://github.com/phyter1/smullyan/edit/main/docs/:path',
      text: 'Edit this page on GitHub',
    },

    footer: {
      message: 'MIT licensed.',
      copyright: 'Copyright © 2026 Ryan Lowe',
    },

    outline: [2, 3],
  },
});
