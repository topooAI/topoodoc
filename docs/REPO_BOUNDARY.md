# Repo Boundary

This document defines the hard boundary between:

- `topoodoc`
- `topoo-docs`

The purpose is to stop future confusion between:

- content
- rendering
- system-owned docs pages
- product/UI reference pages

## Core Rule

`topoodoc` owns the documentation system.

`topoo-docs` owns pure text content.

If something can change visual layout, it does **not** belong in `topoo-docs`.

## Repo Roles

### `topoodoc`

This is the system repository.

It owns:

- docs shell
- navigation shell
- typography baseline
- docs rendering components
- docs block components
- preview/code rendering
- build pipeline
- deploy pipeline
- system-owned documentation pages
- `TopooUI` reference pages

Examples:

- `TopooUI` landing page
- `TopooUI` components index
- `TopooUI` forms index
- docs system pages
- any page whose structure is part of the UI system

### `topoo-docs`

This is the pure content repository.

It owns:

- narrative documentation
- product content
- project docs
- agent docs
- memory docs
- work docs
- page metadata
- ordering
- plain markdown/mdx body content for true document pages

It does **not** own:

- `TopooUI`
- components index layout
- docs-system page layout
- preview/code renderer layout
- card grids
- shell-level MDX structures
- class-based visual composition

## The Practical Test

Use this question:

> If this file changes, can page layout, spacing, typography, or card structure change?

If the answer is yes:
- it belongs in `topoodoc`

If the answer is no, and it only changes text/data/order:
- it can live in `topoo-docs`

## Allowed In `topoo-docs`

- `content/docs/toproject/*.mdx`
- `content/docs/toagent/*.mdx`
- `content/docs/towork/*.mdx`
- `content/docs/tomemory/*.mdx`
- `content/docs/meta.json`
- section `meta.json`
- `topoodoc.content.json`

## Not Allowed In `topoo-docs`

- `content/docs/topooui/**`
- landing page card layouts
- component index layouts
- docs-system layouts
- renderer demos that depend on UI composition
- any page where MDX structure acts like a template

## Why `TopooUI` Is System-Owned

`TopooUI` is not ordinary content.

It is part of the documentation product itself.

Its pages define:

- reference structure
- visual expectations
- docs primitives
- renderer behavior

That makes `TopooUI` part of the system layer, not the pure content layer.

## Publishing Rule

Publishing pure content should only affect pure content pages.

Publishing pure content must not be able to:

- change `TopooUI`
- change docs-shell structure
- change docs block layout
- change global docs typography

If a content publish can do those things, the boundary is broken.

## Current Policy

Current policy is:

- `TopooUI` is system-owned
- `topoo-docs` is pure-text content
- sync/deploy must preserve that split

## Maintenance Rule

When adding a new page, decide first:

1. Is this a content page?
2. Or is this a system/template/reference page?

Do not add the page before answering that question.

That one step prevents most future regressions.
