# Fumadocs System

This workspace now contains a reusable docs publishing system based on the Topoo docs shell.

The intended production model is now split:

- system repo: `topoodoc`
- content repo: pure docs content only

## What It Is

- shared package: `packages/fumadocs-system`
- reusable starter: `templates/fumadocs-system`
- pure content template: `templates/docs-content-repo`
- scaffold command: `pnpm docs:create -- --name "Acme Docs" --target apps/acme-docs`
- content scaffold command: `pnpm content:create -- --name "Acme Docs" --target ../acme-docs-content`
- generated sites vendor the shared shell into a local `fumadocs-system/` folder, so they can run outside this monorepo

## What The Shared Package Owns

- docs shell
- docs toolbar search
- docs typography and CSS tokens
- docs page chrome helpers
- MDX primitives such as callout, linked card, tabs, steps, package command tabs
- code highlighting transformers

## What The Starter Owns

- a standalone Next.js + Fumadocs site
- a vendored local `fumadocs-system/` source tree copied from the shared package
- source loader wiring
- Cloudflare `wrangler.jsonc`
- markdown import script

## What The Content Repo Owns

- `content/docs/**`
- `content/docs/**/meta.json`
- `topoodoc.content.json`
- repo-local doc assets

## Runtime Consumer

`topoodoc` now includes a dedicated runtime consumer app at:

- `apps/content-site`

This app is not the source of truth. It is materialized from a pure content repo through:

- `scripts/sync-content-repo.mjs`
- `scripts/watch-content-repo.mjs`
- `scripts/dev-content-site.mjs`

## Create A New Docs Site

```bash
pnpm docs:create -- --name "Acme Docs" --target apps/acme-docs --github https://github.com/acme/docs
```

After generation, the new site does not import `@topoo/fumadocs-system` from the workspace. It imports its own local `fumadocs-system/` folder and can be moved to another repository.

## Create A Pure Content Repo

```bash
pnpm content:create -- --name "Acme Docs" --target ../acme-docs-content --github https://github.com/acme/docs-content --domain docs.acme.com
```

This creates a pure content repository with no Next.js app and no deployment code.

## Import Existing Markdown

Inside the generated site:

```bash
pnpm import:docs ../../docs
```

This copies `.md` and `.mdx` files into `content/docs` and generates `meta.json` files for navigation.

## Local Development

```bash
TOPOODOC_CONTENT_REPO=../acme-docs-content pnpm content:dev
```

## Deploy

```bash
TOPOODOC_CONTENT_REPO=../acme-docs-content pnpm content:deploy
```

## Current Direction

`apps/docs` remains the current in-workspace reference consumer.

The long-term direction is:
- `topoodoc` provides the rendering and deployment system
- each client or product keeps docs content in a pure content repo
