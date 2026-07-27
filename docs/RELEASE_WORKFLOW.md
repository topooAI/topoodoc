# Topoo Agent Submission And Release Workflow

This workflow prevents one Agent deployment from overwriting another Agent's unintegrated work.

## Authority Model

Git and GitHub own source history and concurrent contribution mechanics.

Topoo owns:

- Agent submission channels
- cross-repository revision pairing
- integrated artifact identity
- preview and production authority
- deployment and rollback records

## Canonical Flow

1. Each Agent starts from the latest accepted base and works on its own branch.
2. The Agent commits only the bounded files it owns.
3. The Agent opens a Pull Request using the Agent submission template.
4. GitHub Actions validates the candidate in isolation.
5. A merge queue re-validates the candidate against the latest `main` and changes ahead of it.
6. Accepted Pull Requests merge into `main`.
7. The release workflow receives explicit `topoodoc` and `topoo-docs` revisions.
8. One integrated build produces one immutable artifact.
9. Preview or production jobs deploy that exact artifact.
10. The workflow records both source revisions and the release artifact.

## Channels

### Draft

Work is saved on an Agent branch. No integration or deployment authority.

### Review

A Pull Request validates scope, content, tests, and ownership.

### Integration

GitHub's merge queue serializes accepted Pull Requests and validates their combined state.

### Preview

The release workflow builds pinned system and content revisions and deploys the artifact to the preview Worker.

### Production

The same integration job builds pinned revisions. The production GitHub Environment controls approval, and the production job deploys only the uploaded artifact.

## Required GitHub Repository Settings

For both `topoodoc` and `topoo-docs`:

- protect `main`
- require Pull Requests
- require the repository validation check
- require conversation resolution
- block force pushes and branch deletion
- enable automatic branch deletion after merge
- enable the merge queue when available

The validation workflows listen to both `pull_request` and `merge_group`, which is required for merge queue validation.

For `topoodoc`:

- create `preview` and `production` Environments
- store Cloudflare credentials as Environment secrets
- require a human reviewer for `production`
- prevent the deployment initiator from approving their own production release when the plan supports it

## Branch Naming

Use:

`agent/<agent-or-role>/<bounded-task>`

Examples:

- `agent/dashboard/runtime-card`
- `agent/docs/cloud-project-model`
- `agent/auth/session-timeout`

Branches isolate work. They do not grant deployment authority.

## Cross-Repository Release

`topoodoc` and `topoo-docs` remain separate repositories.

A release must therefore pin both:

- system revision
- content revision

The release workflow builds the pair together before any deployment begins. This prevents "latest local files" from becoming an implicit, unrepeatable release input.

## Rollback

Rollback is a new production workflow run using a previously accepted pair of system and content revisions.

Do not rebuild from an uncommitted working tree and do not repair production by force-pushing `main`.
