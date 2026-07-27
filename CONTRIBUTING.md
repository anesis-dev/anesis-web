# Contributing to anesis-web

Thanks for taking the time. This repository is the Next.js frontend; the registry
API, the CLI, and the registry content live in separate repositories under
[`anesis-dev`](https://github.com/anesis-dev).

## Before you start

- **Bug fixes and UI polish** — open a PR directly.
- **New routes or data flows** — open an issue first. Anything that needs a new
  API endpoint has to land in `anesis-server` before it can land here.
- **New templates or addons** — those belong in the registry repositories.
- **Security problems** — do not open an issue. See [SECURITY.md](SECURITY.md).

## Getting set up

```bash
bun install
cp .env.example .env.local     # set NEXT_PUBLIC_API_URL / API_PROXY_URL
bun run dev                    # http://localhost:3000
```

Run `anesis-server` on port 4000 alongside it for the full experience. Without
it, catalogue pages render their error states — which is itself worth seeing.

## Before opening a PR

All four must pass. CI runs the same commands.

```bash
bun run typecheck
bun run lint
bun run test
bun run build
```

`bun run e2e` runs Playwright; its config builds and starts the app itself.

## House rules

- **Tabs for indentation**, TypeScript strict, `@/*` maps to `src/*`.
- **Data from the API goes through `src/lib/api-contracts.ts`** before it is
  used. Nothing consumes a raw response.
- **Network calls flow `src/api/client.ts` → `src/services/*` → `src/hooks/*`.**
  A component never calls `fetch` directly.
- **Tests mirror the source tree** under `src/test/**`.
- **Every route needs metadata.** Static pages export `metadata`; dynamic ones
  export `generateMetadata` and must degrade to `unresolvedMetadata(...)` when
  the fetch fails, rather than throwing — a registry outage should produce an
  unindexed page, not a 500.
- **A dynamic route that needs `"use client"`** should be a server component that
  exports `generateMetadata` and renders an extracted client component. All four
  registry detail routes are built that way.
- **Interactive elements need an accessible name.** Icon-only buttons get an
  `aria-label`; a bare number is not a name.
- **Layouts own the `<main>` landmark.** Do not add a second `<main>` inside the
  `(main)` route group — use `<article>` or `<section>`.

## Content Security Policy

`next.config.ts` sends a real CSP, not a cosmetic one: the site renders user
README markdown through `rehype-raw`. If a change needs a new origin, say why in
the PR description. Widening the policy is a security decision.

## Commit messages and PRs

Conventional-commit prefixes (`feat:`, `fix:`, `refactor:`, `docs:`, `test:`,
`chore:`) are preferred but not enforced. Say what changed and why; screenshots
help for anything visual.

## Known warnings

`bun run lint` reports 11 warnings today, four of them
`react-hooks/set-state-in-effect` in components that sync state from a query
result. They are a tracked follow-up — please do not add new ones.
