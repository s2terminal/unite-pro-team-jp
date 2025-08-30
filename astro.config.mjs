// @ts-check
import { defineConfig } from 'astro/config';

import react from '@astrojs/react';

// https://astro.build/config
// Detect GitHub Pages environment to set proper site/base for project pages
const isCI = process.env.CI === 'true' || process.env.GITHUB_ACTIONS === 'true';
const repo = process.env.GITHUB_REPOSITORY?.split('/')?.[1];
const owner = process.env.GITHUB_REPOSITORY?.split('/')?.[0];

/** @type {import('astro').AstroUserConfig} */
const config = {
  integrations: [react()],
};

// On GitHub Actions (project pages), hint Astro where the site will live so it generates correct URLs.
if (isCI && owner && repo) {
  config.site = `https://${owner}.github.io/${repo}/`;
  config.base = `/${repo}/`;
}

export default defineConfig(config);
