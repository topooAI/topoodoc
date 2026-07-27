# Doc System Contract

This document defines the structural contract for `doc.topoo.ai`.

## Canonical Rule

The current live structure of `doc.topoo.ai` is the product standard.

Engineering work must preserve the live information architecture unless the user explicitly changes it.

## Core Model

The documentation system is organized as:

`board -> block -> topic -> page`

## UI Mapping

### Board

Boards are the top navigation entries.

Current boards:
- `Topoo`
- `toAgent`
- `toWork`
- `toProject`
- `toMemory`
- `TopooUI`

### Block

Blocks are the gray labels in the left sidebar.

Examples:
- `TopooUI`
- `Components`
- `Installation`
- `RTL`
- `Registry`
- `Forms`
- `Changelog`

### Topic

Topics are the dark clickable items under each block in the left sidebar.

Examples:
- `Theming`
- `CLI`
- `Skills`
- `MCP Server`
- `Accordion`
- `Alert`

### Page

A page is the concrete document body shown in the main content area.

Each page has:
- URL
- title
- description
- body content

## Board Home Behavior

A board home page may use a matrix/card overview in the main content area.

This is valid and part of the approved live structure.

Examples:
- `/docs`
- `/docs/topooui`

The matrix is not a separate structural layer. It is a board-level overview presentation inside the page body.

## Left Sidebar Rules

The sidebar behavior is:
- gray label = block
- dark item = topic
- current page highlight = active page/topic entry

Do not add a second visible block layer.
Do not replace the current live sidebar pattern with a new navigation pattern unless explicitly requested.

## Rendering Rules

The documentation system must preserve:
- current top navigation board structure
- current left sidebar block/topic structure
- current board-home matrix pattern
- current page shell, spacing, typography, and docs primitives as seen on live

## Repository Mapping

### topoodoc

System repository:
- docs shell
- page rendering
- shared docs styling
- system-owned docs pages such as `TopooUI`
- build and deploy pipeline

### topoo-docs

Content repository:
- text-first page bodies
- content metadata
- content model records

This repository must not define layout-owned `TopooUI` system pages.

## Data Model Files

The structured model should be represented with:
- `boards.json`
- `blocks.json`
- `topics.json`
- `pages.json`

These data files must map to the live-approved UI model above.

## Change Discipline

When changing docs structure:
1. Treat current live as the standard baseline.
2. Update source so GitHub, local, and live resolve to the same structure.
3. Never accept a local result that diverges from live without explicit approval.
