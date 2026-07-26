import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

// The site is served from a subpath on GitHub Pages
// (labs.hyperledger.org/learning-tokens/), so every absolute asset URL has to be
// built from import.meta.env.BASE_URL. Set SITE_BASE=/ to build for a host that
// serves from the root instead.
const base = process.env.SITE_BASE || '/learning-tokens';

export default defineConfig({
    site: 'https://labs.hyperledger.org',
    base,
    integrations: [tailwind()],
    output: 'static',
});
