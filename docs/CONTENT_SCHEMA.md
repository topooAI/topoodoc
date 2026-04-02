# Content Schema

This document defines the first stable content schema for `topoodoc`.

The goal is simple:

- content repos should own text, data, and information architecture
- `topoodoc` should own rendering, layout, and visual behavior
- content updates must not be able to silently change page structure or styling

## Why This Exists

The current split between `topoodoc` and content repos is not enough by itself.

Even with separate repositories, a content repo can still change page appearance if it stores:

- raw MDX layout trees
- `div` grids
- component composition
- class names
- page-specific visual structure

That means the system is still only partially separated.

To finish the separation, we need a schema layer.

## Core Rule

Content repos may describe:

- what a page is
- what data it contains
- what order sections appear in
- what copy should be rendered
- what links should exist

Content repos may not describe:

- visual layout implementation
- CSS classes
- card grids
- typography rules
- shell composition
- reusable component styling

Those belong to `topoodoc`.

## Schema Levels

### 1. Site Schema

This describes the docs site as a whole.

Owned in:
- `topoodoc.content.json`

Allowed concerns:
- site title
- site description
- domain
- top navigation items
- shell flags like whether search or GitHub link is visible

Not allowed:
- topbar layout classes
- sidebar layout classes
- page chrome structure

### 2. Navigation Schema

This describes tree structure and page ordering.

Owned in:
- `content/docs/meta.json`
- `content/docs/**/meta.json`

Allowed concerns:
- section titles
- page order
- grouping

Not allowed:
- per-page presentation logic

### 3. Page Schema

This describes individual document pages.

Each page must declare a page type.

The first stable page types are:
- `doc-page`
- `board-landing`
- `component-index`
- `docs-system-index`
- `docs-block-doc`

## TopooUI Information Architecture

`TopooUI` should not only document general components.

It should also explicitly contain a documentation-system lane.

Recommended first-level structure:

- `Components`
- `Installation`
- `RTL`
- `Registry`
- `Forms`
- `Docs`
- `Changelog`

This means `Docs` should be treated as a first-class `TopooUI` board, not as scattered notes inside other pages.

## TopooUI Docs Board

The `Docs` board exists to document the Topoo documentation rendering system itself.

It should answer:

- how document pages are structured
- which schema types exist
- which renderer/template each schema type maps to
- which blocks are available to content authors
- which concerns belong to content vs system

Recommended page set:

- `Overview`
- `Schema`
- `Renderer Contract`
- `Blocks`
- `Preview + Code`
- `Installation Block`
- `Callout`
- `Package Tabs`
- `Content Ownership`

These pages do not describe general UI primitives.
They describe documentation UI primitives and contracts.

## Page Type: `doc-page`

Use this for long-form narrative documentation.

Examples:
- `toProject/index`
- `toProject/object-model`
- `toProject/git-model`
- `toProject/runtime-model`
- `toProject/ui-mapping`

### Required fields

- `type`
- `title`
- `description`
- `body`

### Shape

```json
{
  "type": "doc-page",
  "title": "Project Object Model",
  "description": "Project architecture contract synced from the project module source documents.",
  "body": "markdown body"
}
```

### Rules

- `body` may contain markdown
- `body` may contain a limited allowlist of inline docs primitives later
- `body` may not contain raw layout wrappers for page-wide visual structure
- `body` may not define grid systems or shell-level composition

## Page Type: `board-landing`

Use this for section homepages like `TopooUI` or future `toAgent`, `toWork`, `toMemory` landing pages.

### Required fields

- `type`
- `title`
- `description`
- `intro`
- `cards`

### Shape

```json
{
  "type": "board-landing",
  "title": "TopooUI",
  "description": "Shared UI foundation, component references, and documentation primitives for the Topoo system.",
  "intro": "All current reference content now lives under TopooUI.",
  "cards": [
    {
      "title": "Components",
      "href": "/docs/topooui/components",
      "description": "Browse reference components and preview the TopooUI component surface."
    }
  ]
}
```

### Rules

- card rendering is fully owned by `topoodoc`
- content may define card data only
- content may not choose between matrix/list/carousel/etc
- content may not provide raw `LinkedCard` markup

## Page Type: `component-index`

Use this for a flat or grouped component directory page.

### Required fields

- `type`
- `title`
- `description`
- `items`

### Shape

```json
{
  "type": "component-index",
  "title": "Components",
  "description": "Reference components available in the shared TopooUI library.",
  "items": [
    {
      "title": "Accordion",
      "href": "/docs/topooui/components/accordion"
    }
  ],
  "footerNote": "Can't find what you need? Try the registry directory."
}
```

### Rules

- the system decides the index layout
- content defines only labels, links, optional grouping, and optional note text
- content may not render custom grids or anchor classes

## Page Type: `docs-system-index`

Use this for a documentation-system homepage under `TopooUI > Docs`.

### Required fields

- `type`
- `title`
- `description`
- `intro`
- `sections`

### Shape

```json
{
  "type": "docs-system-index",
  "title": "Docs",
  "description": "Documentation system blocks, renderer contracts, and content schema rules.",
  "intro": "Topoo docs are rendered through fixed templates owned by the system.",
  "sections": [
    {
      "title": "Schema",
      "href": "/docs/topooui/docs/schema",
      "description": "Content model definitions for document pages and blocks."
    }
  ]
}
```

### Rules

- rendering style is owned by the system
- content only defines section data
- content may not define presentation classes or custom layout wrappers

## Page Type: `docs-block-doc`

Use this for a documentation-specific block reference page.

This is the page type that most closely matches the pattern:
- preview on top
- code on bottom
- optional install/use notes underneath

### Required fields

- `type`
- `title`
- `description`
- `block`
- `preview`
- `source`

### Shape

```json
{
  "type": "docs-block-doc",
  "title": "Component Preview Block",
  "description": "A documentation block that renders a live preview above its code source.",
  "block": "component-preview-block",
  "preview": {
    "demoId": "accordion-preview"
  },
  "source": {
    "codeId": "accordion-preview-source"
  }
}
```

### Rules

- preview rendering belongs to `topoodoc`
- source rendering belongs to `topoodoc`
- content may reference `demoId` / `codeId`, but may not define the preview shell directly
- the `preview + code` composition is a renderer concern, not a content concern

## Optional Future Page Types

These are not required immediately, but the schema should anticipate them.

### `component-doc`

For component detail pages.

Possible fields:
- title
- description
- install commands
- usage blocks
- preview ids
- notes

Important rule:
- live preview rendering belongs to the system, not the content repo

### `api-doc`

For contract or API references.

Possible fields:
- resource name
- summary
- field definitions
- examples

### `decision-doc`

For architecture decisions and ADR-style pages.

Possible fields:
- status
- decision
- context
- consequences

## First-Class Content Objects

The CMS/data model should eventually center on these objects:

- `SiteConfig`
- `NavGroup`
- `Page`
- `BoardLandingCard`
- `ComponentIndexItem`
- `DocSection`

## Body Model Direction

For now, `doc-page` can continue using markdown body content.

But the long-term direction should be block-based, not freeform MDX layout.

Recommended block types:
- `heading`
- `paragraph`
- `list`
- `callout`
- `code`
- `quote`
- `table`
- `link-list`
- `component-preview-block`
- `installation-block`
- `package-tabs-block`
- `preview-code-block`

Not recommended as content-owned blocks:
- arbitrary `div`
- arbitrary custom React components
- raw Tailwind classes

## Renderer Contract

Schema alone is not enough.

Each page type or block type must map to a system-owned renderer.

That is the line that prevents content repos from altering the visual system.

Examples:

- `board-landing` -> `BoardLandingTemplate`
- `component-index` -> `ComponentIndexTemplate`
- `docs-system-index` -> `DocsSystemIndexTemplate`
- `doc-page` -> `DocPageTemplate`
- `component-preview-block` -> `DocComponentPreviewBlock`
- `installation-block` -> `DocInstallationBlock`
- `package-tabs-block` -> `DocPackageTabsBlock`

This is the key distinction:

- schema describes the content structure
- renderer describes how that structure becomes UI

`TopooUI` therefore should document both:
- schema contracts
- renderer/block behavior

not only raw components.

## Content Repo Rules

A content repo should eventually contain:

- `topoodoc.content.json`
- `content/docs/meta.json`
- `content/docs/**/meta.json`
- schema-shaped page data files
- doc-local assets

It should not contain:

- raw page layout logic
- system React components
- styling classes used to define final visuals
- render-time component composition for shared templates

## Migration Strategy

We should not migrate the whole repo at once.

Recommended order:

1. convert `TopooUI` landing page to `board-landing`
2. convert `TopooUI/components` to `component-index`
3. add `TopooUI/docs` as `docs-system-index`
4. define the first `docs-block-doc` pages for preview/code style blocks
5. keep `toProject/*` as `doc-page`
6. add a renderer in `topoodoc` that maps page type -> template
7. only after templates are stable, design the CMS editing surface

## CMS Implication

This schema is the prerequisite for a CMS.

Without a schema:
- the CMS would just be an MDX editor
- content editors could still mutate layout
- system/content separation would remain weak

With a schema:
- the CMS can edit structured fields safely
- rendering stays centralized in `topoodoc`
- content repos remain low-risk
- visual regressions from content edits become much less likely

## Current Decision

The immediate direction is:

- keep `topoodoc` as the rendering system
- keep `topoo-docs` as the content repo
- introduce schema-based page types before building a full CMS UI

This is the shortest path to making content management safe.
