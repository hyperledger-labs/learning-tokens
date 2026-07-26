# Learning Tokens — website

Marketing / informational site for the [Learning Tokens](https://github.com/hyperledger-labs/learning-tokens)
Hyperledger Lab. A static site that explains the protocol, its four token templates, the LMS
integrations, and how to get started.

## Stack

- **[Astro 5](https://astro.build)** — static output, zero JS shipped by default.
- **[Tailwind CSS 3](https://tailwindcss.com)** via `@astrojs/tailwind`.
- **[Cloudflare Workers](https://developers.cloudflare.com/workers/static-assets/)** for hosting (via `wrangler`).
- Fonts: Space Grotesk (display), Inter (body), IBM Plex Mono (data).

## Develop

```bash
cd website
npm install
npm run dev      # http://localhost:4321
```

## Build & preview

```bash
npm run build    # type-checks, then outputs static site to dist/
npm run preview  # serve the build locally
```

## Deploy (Cloudflare)

```bash
npm run deploy   # build + wrangler deploy
```

## Structure

```
src/
  layouts/Layout.astro     # <head>, fonts, base document
  pages/index.astro        # composes the sections
  components/              # one component per section
    Navbar · Hero · Thesis · TokenTypes · HowItWorks
    Integrations · Architecture · GetStarted · Footer
  styles/global.css        # Tailwind layers + ledger-ruling motif
```

## Design

"The ledger of learning" — an ink-on-paper registrar's ledger, minted on-chain. Palette,
type scale and the ledger-ruling motif live in `tailwind.config.mjs` and `global.css`.
